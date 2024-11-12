'use strict';

import * as twgl from 'twgl.js';
import GUI from 'lil-gui';

// Define the shader code, using GLSL 3.00

const vsGLSL = `#version 300 es
in vec4 a_position;
in vec4 a_color;

uniform mat4 u_transforms;
uniform mat4 u_matrix;

out vec4 v_color;

void main() {
    gl_Position = u_matrix * a_position;
    v_color = a_color;
}
`;

const fsGLSL = `#version 300 es
precision highp float;

in vec4 v_color;

out vec4 outColor;

void main() {
    outColor = v_color;
}
`;

class Object3D {

  constructor(id, position=[0,0,0], rotation=[0,0,0], scale=[1,1,1]){
    this.id = id
    this.position = position 
    this.rotation = rotation 
    this.scale = scale 
    this.matrix = twgl.m4.create() 
    this.modelViewMatrix = twgl.m4.create()
  }
}

const agent_server_uri = "http://localhost:8585/"

const agents = []
const obstacles = []

let gl, programInfo, agentArrays, obstacleArrays, agentsBufferInfo, obstaclesBufferInfo, agentsVao, obstaclesVao;
let cameraPosition = {x:0, y:0, z:20}

const data = {
  NAgents: 5,
  width: 10,
  height: 10
}

async function main() {
    const canvas = document.querySelector('canvas');
    gl = canvas.getContext('webgl2');

    programInfo = twgl.createProgramInfo(gl, [vsGLSL, fsGLSL]);

    agentArrays = generateData(1);
    obstacleArrays = generateData(1);

    agentsBufferInfo = twgl.createBufferInfoFromArrays(gl, agentArrays);
    obstaclesBufferInfo = twgl.createBufferInfoFromArrays(gl, obstacleArrays);

    agentsVao = twgl.createVAOFromBufferInfo(gl, programInfo, agentsBufferInfo);
    obstaclesVao = twgl.createVAOFromBufferInfo(gl, programInfo, obstaclesBufferInfo);

    setupUI();

    await initAgentsModel()
    await getAgents()
    await getObstacles()

    drawScene(gl, programInfo, agentsVao, agentsBufferInfo, obstaclesVao, obstaclesBufferInfo);
}

async function initAgentsModel(){

  try {

    let response = await fetch(agent_server_uri + "init", 
      {
        method: 'POST', 
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify(data)
      })

    if(response.ok){
      let result = await response.json()
      console.log(result.message)
    }
      
  } catch (error) {
    console.log(error)    
  }
  
}

async function getAgents(){

  try {
    let response = await fetch(agent_server_uri + "getAgents") 

    if(response.ok){
      let result = await response.json()

      console.log(result.positions)

      for (const agent of result.positions) {
        const newAgent = new Object3D(agent.id, [agent.x, agent.y, agent.z])
        agents.push(newAgent)
      }
      console.log("Agents:", agents)
    }

  } catch (error) {
    console.log(error) 
  }
}

async function getObstacles(){

  try {
    let response = await fetch(agent_server_uri + "getObstacles") 

    if(response.ok){
      let result = await response.json()

      for (const obstacle of result.positions) {
        const newObstacle = new Object3D(obstacle.id, [obstacle.x, obstacle.y, obstacle.z])
        obstacles.push(newObstacle)
      }
      console.log("Obstacles:", obstacles)
    }

  } catch (error) {
    console.log(error) 
  }
}

function drawScene(gl, programInfo, agentsVao, agentsBufferInfo, obstaclesVao, obstaclesBufferInfo) {
    twgl.resizeCanvasToDisplaySize(gl.canvas);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clearColor(0, 0, 0, 1);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(programInfo.program);

    const viewProjectionMatrix = setupWorldView(gl);

    const distance = 1

    drawAgents(distance, agentsVao, agentsBufferInfo, viewProjectionMatrix)    
    drawObstacles(distance, obstaclesVao, obstaclesBufferInfo, viewProjectionMatrix)
}

function drawAgents(distance, agentsVao, agentsBufferInfo, viewProjectionMatrix){

    gl.bindVertexArray(agentsVao);
    for(const agent of agents){

      let x = agent.position[0] * distance, y = agent.position[1] * distance, z = agent.position[2]

      const cube_trans = twgl.v3.create(...agent.position);
      const cube_scale = twgl.v3.create(...agent.scale);

      agent.matrix = twgl.m4.translate(viewProjectionMatrix, cube_trans);
      agent.matrix = twgl.m4.rotateX(agent.matrix, agent.rotation[0]);
      agent.matrix = twgl.m4.rotateY(agent.matrix, agent.rotation[1]);
      agent.matrix = twgl.m4.rotateZ(agent.matrix, agent.rotation[2]);
      agent.matrix = twgl.m4.scale(agent.matrix, cube_scale);

      let uniforms = {
          u_matrix: agent.matrix,
      }

      twgl.setUniforms(programInfo, uniforms);
      twgl.drawBufferInfo(gl, agentsBufferInfo);
      
    }

}

function drawObstacles(distance, obstaclesVao, obstaclesBufferInfo, viewProjectionMatrix){

    gl.bindVertexArray(obstaclesVao);
    for(const obstacle of obstacles){

      const cube_trans = twgl.v3.create(...obstacle.position);
      const cube_scale = twgl.v3.create(...obstacle.scale);

      obstacle.matrix = twgl.m4.translate(viewProjectionMatrix, cube_trans);
      obstacle.matrix = twgl.m4.rotateX(obstacle.matrix, obstacle.rotation[0]);
      obstacle.matrix = twgl.m4.rotateY(obstacle.matrix, obstacle.rotation[1]);
      obstacle.matrix = twgl.m4.rotateZ(obstacle.matrix, obstacle.rotation[2]);
      obstacle.matrix = twgl.m4.scale(obstacle.matrix, cube_scale);

      let uniforms = {
          u_matrix: obstacle.matrix,
      }

      twgl.setUniforms(programInfo, uniforms);
      twgl.drawBufferInfo(gl, obstaclesBufferInfo);
      
    }
}

function setupWorldView(gl) {
    const fov = 45 * Math.PI / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;

    const projectionMatrix = twgl.m4.perspective(fov, aspect, 1, 200);

    const target = [data.width/2, 0, data.height/2];
    const up = [0, 1, 0];

    const camPos = twgl.v3.create(cameraPosition.x + data.width/2, cameraPosition.y, cameraPosition.z+data.height/2)
    const cameraMatrix = twgl.m4.lookAt(camPos, target, up);

    const viewMatrix = twgl.m4.inverse(cameraMatrix);

    const viewProjectionMatrix = twgl.m4.multiply(projectionMatrix, viewMatrix);
    return viewProjectionMatrix;
}

function setupUI() {
    const gui = new GUI();
    const posFolder = gui.addFolder('Position:')
    posFolder.add(cameraPosition, 'x', -50, 50)
        .onChange( value => {
            cameraPosition.x = value
            drawScene(gl, programInfo, agentsVao, agentsBufferInfo, obstaclesVao, obstaclesBufferInfo);
        });
    posFolder.add( cameraPosition, 'y', -50, 50)
        .onChange( value => {
            cameraPosition.y = value,
            drawScene(gl, programInfo, agentsVao, agentsBufferInfo, obstaclesVao, obstaclesBufferInfo);
        });
    posFolder.add( cameraPosition, 'z', -50, 50)
        .onChange( value => {
            cameraPosition.z = value,
            drawScene(gl, programInfo, agentsVao, agentsBufferInfo, obstaclesVao, obstaclesBufferInfo);
        });
}

function generateData(size) {
    let arrays =
    {
        a_position: {
                numComponents: 3,
                data: [
                  // Front Face
                  -0.5, -0.5,  0.5,
                  0.5, -0.5,  0.5,
                  0.5,  0.5,  0.5,
                 -0.5,  0.5,  0.5,

                 // Back face
                 -0.5, -0.5, -0.5,
                 -0.5,  0.5, -0.5,
                  0.5,  0.5, -0.5,
                  0.5, -0.5, -0.5,

                 // Top face
                 -0.5,  0.5, -0.5,
                 -0.5,  0.5,  0.5,
                  0.5,  0.5,  0.5,
                  0.5,  0.5, -0.5,

                 // Bottom face
                 -0.5, -0.5, -0.5,
                  0.5, -0.5, -0.5,
                  0.5, -0.5,  0.5,
                 -0.5, -0.5,  0.5,

                 // Right face
                  0.5, -0.5, -0.5,
                  0.5,  0.5, -0.5,
                  0.5,  0.5,  0.5,
                  0.5, -0.5,  0.5,

                 // Left face
                 -0.5, -0.5, -0.5,
                 -0.5, -0.5,  0.5,
                 -0.5,  0.5,  0.5,
                 -0.5,  0.5, -0.5
                ].map(e => size * e)
            },
        a_color: {
                numComponents: 4,
                data: [
                  // Front face
                    1, 0, 0, 1, // v_1
                    1, 0, 0, 1, // v_1
                    1, 0, 0, 1, // v_1
                    1, 0, 0, 1, // v_1
                  // Back Face
                    0, 1, 0, 1, // v_2
                    0, 1, 0, 1, // v_2
                    0, 1, 0, 1, // v_2
                    0, 1, 0, 1, // v_2
                  // Top Face
                    0, 0, 1, 1, // v_3
                    0, 0, 1, 1, // v_3
                    0, 0, 1, 1, // v_3
                    0, 0, 1, 1, // v_3
                  // Bottom Face
                    1, 1, 0, 1, // v_4
                    1, 1, 0, 1, // v_4
                    1, 1, 0, 1, // v_4
                    1, 1, 0, 1, // v_4
                  // Right Face
                    0, 1, 1, 1, // v_5
                    0, 1, 1, 1, // v_5
                    0, 1, 1, 1, // v_5
                    0, 1, 1, 1, // v_5
                  // Left Face
                    1, 0, 1, 1, // v_6
                    1, 0, 1, 1, // v_6
                    1, 0, 1, 1, // v_6
                    1, 0, 1, 1, // v_6
                ]
            },
        indices: {
                numComponents: 3,
                data: [
                  0, 1, 2,      0, 2, 3,    // Front face
                  4, 5, 6,      4, 6, 7,    // Back face
                  8, 9, 10,     8, 10, 11,  // Top face
                  12, 13, 14,   12, 14, 15, // Bottom face
                  16, 17, 18,   16, 18, 19, // Right face
                  20, 21, 22,   20, 22, 23  // Left face
                ]
            }
    };

    // console.log("ATTRIBUTES:")
    // console.log(arrays);

    return arrays;
}

main()
