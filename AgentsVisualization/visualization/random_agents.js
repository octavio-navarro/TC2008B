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

// Variables used for the object, and coltrolled from the UI
const object = {
    // Translation
    t: {
        x: 0,
        y: 0,
        z: 0},
    // Rotation in degrees
    rd: {
        x: 0,
        y: 0,
        z: 0},
    // Rotation in radians
    rr: {
        x: 0,
        y: 0,
        z: 0},
    // Scale
    s: {
        x: 1,
        y: 1,
        z: 1},
}

const agent_server_uri = "http://localhost:8585/"

const agents = {}

let gl, programInfo, arrays, bufferInfo, vao;
let cameraPosition = [0, 0, 0]

async function main() {
    const canvas = document.querySelector('canvas');
    gl = canvas.getContext('webgl2');


    programInfo = twgl.createProgramInfo(gl, [vsGLSL, fsGLSL]);

    arrays = generateData(1);

    bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);

    vao = twgl.createVAOFromBufferInfo(gl, programInfo, bufferInfo);

    setupUI();
    await initAgentsModel()
    await getAgents()

    drawScene(gl, programInfo, vao, bufferInfo);
}

async function initAgentsModel(){
  const data = {
    NAgents: "5",
    width: 20,
    height: 20
  }

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
        agents[agent.id] = {x:agent.x, y:agent.y, z:agent.z}
      }
      console.log("Agents:", agents)
    }

  } catch (error) {
    
  }
}

// Function to do the actual display of the objects
function drawScene(gl, programInfo, vao, bufferInfo) {
    twgl.resizeCanvasToDisplaySize(gl.canvas);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // tell webgl to cull faces
    gl.enable(gl.CULL_FACE);

    // All cubes will use the same program and vertices
    gl.useProgram(programInfo.program);
    gl.bindVertexArray(vao);

    const viewProjectionMatrix = setupWorldView(gl);

    // Convert the global transform values into twgl vectors
    let v3_trans = twgl.v3.create(object.t.x, object.t.y, object.t.z);
    let v3_scale = twgl.v3.create(object.s.x, object.s.y, object.s.z);

    // Draw multiple copies of the same cube
    const distance = 3;        
    
    for(const agent in agents){
      let x = agent.x * distance, y = agent.y * distance, z = agent.z
      
      const cube_trans = twgl.v3.create(x, y, z);

      let matrix = twgl.m4.translate(viewProjectionMatrix, cube_trans);
      matrix = twgl.m4.translate(matrix, v3_trans);
      matrix = twgl.m4.rotateX(matrix, object.rr.x);
      matrix = twgl.m4.rotateY(matrix, object.rr.y);
      matrix = twgl.m4.rotateZ(matrix, object.rr.z);
      matrix = twgl.m4.scale(matrix, v3_scale);

      let uniforms = {
          u_matrix: matrix,
      }
      twgl.setUniforms(programInfo, uniforms);
      twgl.drawBufferInfo(gl, bufferInfo);
      
    }
}

function setupWorldView(gl) {
    // Field of view of 60 degrees, in radians
    const fov = 60 * Math.PI / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;

    // Matrices for the world view
    const projectionMatrix = twgl.m4.perspective(fov, aspect, 1, 200);

    const target = [0, 0, 0];
    const up = [0, 1, 0];
    const cameraMatrix = twgl.m4.lookAt(cameraPosition, target, up);

    const viewMatrix = twgl.m4.inverse(cameraMatrix);

    const viewProjectionMatrix = twgl.m4.multiply(projectionMatrix, viewMatrix);
    return viewProjectionMatrix;
}

function setupUI() {
    const gui = new GUI();
    const posFolder = gui.addFolder('Position:')
    posFolder.add( object.t, 'x', -50, 50)
        .onChange( value => {
            object.t.x = value,
            setupUI()
            drawScene(gl, programInfo, vao, bufferInfo);
        });
    posFolder.add( object.t, 'y', -50, 50)
        .onChange( value => {
            object.t.y = value,
            setupUI()
            drawScene(gl, programInfo, vao, bufferInfo);;
        });
    posFolder.add( object.t, 'z', -50, 50)
        .onChange( value => {
            object.t.z = value,
            setupUI()
            drawScene(gl, programInfo, vao, bufferInfo);;
        });
    const rotFolder = gui.addFolder('Rotation:')
    rotFolder.add( object.rd, 'x', 0, 360)
        .onChange( value => {
            object.rd.x = value
            object.rr.x = object.rd.x * Math.PI / 180;
            setupUI()
            drawScene(gl, programInfo, vao, bufferInfo);;
        });
    rotFolder.add( object.rd, 'y', 0, 360)
        .onChange( value => {
            object.rd.y = value
            object.rr.y = object.rd.y * Math.PI / 180;
            setupUI()
            drawScene(gl, programInfo, vao, bufferInfo);;
        });
    rotFolder.add( object.rd, 'z', 0, 360)
        .onChange( value => {
            object.rd.z = value
            object.rr.z = object.rd.z * Math.PI / 180;
            setupUI()
            drawScene(gl, programInfo, vao, bufferInfo);;
        });
    const scaFolder = gui.addFolder('Scale:')
    scaFolder.add( object.s, 'x', -50, 50)
        .onChange( value => {
            object.s.x = value;
            setupUI()
            drawScene(gl, programInfo, vao, bufferInfo);;
        });
    scaFolder.add( object.s, 'y', -50, 50)
        .onChange( value => {
            object.s.y = value;
            setupUI()
            drawScene(gl, programInfo, vao, bufferInfo);;
        });
    scaFolder.add( object.s, 'z', -50, 50)
        .onChange( value => {
            object.s.z = value;
            setupUI()
            drawScene(gl, programInfo, vao, bufferInfo);;
        });
}

function generateData(size) {
    let arrays =
    {
        a_position: {
                numComponents: 3,
                data: [
                  // Front Face
                  -1.0, -1.0,  1.0,
                  1.0, -1.0,  1.0,
                  1.0,  1.0,  1.0,
                 -1.0,  1.0,  1.0,

                 // Back face
                 -1.0, -1.0, -1.0,
                 -1.0,  1.0, -1.0,
                  1.0,  1.0, -1.0,
                  1.0, -1.0, -1.0,

                 // Top face
                 -1.0,  1.0, -1.0,
                 -1.0,  1.0,  1.0,
                  1.0,  1.0,  1.0,
                  1.0,  1.0, -1.0,

                 // Bottom face
                 -1.0, -1.0, -1.0,
                  1.0, -1.0, -1.0,
                  1.0, -1.0,  1.0,
                 -1.0, -1.0,  1.0,

                 // Right face
                  1.0, -1.0, -1.0,
                  1.0,  1.0, -1.0,
                  1.0,  1.0,  1.0,
                  1.0, -1.0,  1.0,

                 // Left face
                 -1.0, -1.0, -1.0,
                 -1.0, -1.0,  1.0,
                 -1.0,  1.0,  1.0,
                 -1.0,  1.0, -1.0
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
