/*
 * Base program for a 3D scene that connects to an API to get the movement
 * of agents.
 * The scene shows colored cubes
 *
 * Gilberto Echeverria
 * 2025-11-08
 */


'use strict';

import * as twgl from 'twgl-base.js';
import GUI from 'lil-gui';
import { M4 } from '../libs/3d-lib';
import { Scene3D } from '../libs/scene3d';
import { Object3D } from '../libs/object3d';
import { Camera3D } from '../libs/camera3d';

// Functions and arrays for the communication with the API
import {
  agents, obstacles, initAgentsModel,
  update, getAgents, getObstacles
} from '../libs/api_connection.js';

// Define the shader code, using GLSL 3.00
import vsGLSL from '../assets/shaders/vs_color.glsl?raw';
import fsGLSL from '../assets/shaders/fs_color.glsl?raw';

const scene = new Scene3D();

/*
// Variable for the scene settings
const settings = {
    // Speed in degrees
    rotationSpeed: {
        x: 0,
        y: 0,
        z: 0,
    },
};
*/


// Global variables
let colorProgramInfo = undefined;
let gl = undefined;
const duration = 1000; // ms
let elapsed = 0;
let then = 0;


// Main function is async to be able to make the requests
async function main() {
  // Setup the canvas area
  const canvas = document.querySelector('canvas');
  gl = canvas.getContext('webgl2');
  twgl.resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Prepare the program with the shaders
  colorProgramInfo = twgl.createProgramInfo(gl, [vsGLSL, fsGLSL]);

  // Initialize the agents model
  await initAgentsModel();

  // Get the agents and obstacles
  await getAgents();
  await getObstacles();


  // Initialize the scene
  setupScene();

  // Position the objects in the scene
  setupObjects(scene, gl, colorProgramInfo);

  // Prepare the user interface
  setupUI();

  // Fisrt call to the drawing loop
  drawScene();
}



function setupScene() {
  let camera = new Camera3D(0,
    10,             // Distance to target
    4,              // Azimut
    0.8,              // Elevation
    [0, 0, 10],
    [0, 0, 0]);
  // These values are empyrical.
  // Maybe find a better way to determine them
  camera.panOffset = [0, 8, 0];
  scene.setCamera(camera);
  scene.camera.setupControls();
}

function setupObjects(scene, gl, programInfo) {
  // Create VAOs for the different shapes
  const baseCube = new Object3D(-1);
  baseCube.prepareVAO(gl, programInfo);

  /*
  // A scaled cube to use as the ground
  const ground = new Object3D(-3, [14, 0, 14]);
  ground.arrays = baseCube.arrays;
  ground.bufferInfo = baseCube.bufferInfo;
  ground.vao = baseCube.vao;
  ground.scale = {x: 50, y: 0.1, z: 50};
  ground.color = [0.6, 0.6, 0.6, 1];
  scene.addObject(ground);
  */

  // Copy the properties of the base objects
  for (const agent of agents) {
    agent.arrays = baseCube.arrays;
    agent.bufferInfo = baseCube.bufferInfo;
    agent.vao = baseCube.vao;
    agent.scale = { x: 0.5, y: 0.5, z: 0.5 };
    scene.addObject(agent);
  }

  // Copy the properties of the base objects
  for (const agent of obstacles) {
    agent.arrays = baseCube.arrays;
    agent.bufferInfo = baseCube.bufferInfo;
    agent.vao = baseCube.vao;
    agent.scale = { x: 0.5, y: 0.5, z: 0.5 };
    agent.color = [0.7, 0.7, 0.7, 1.0];
    scene.addObject(agent);
  }

}

// Draw an object with its corresponding transformations
function drawObject(gl, programInfo, object, viewProjectionMatrix, fract) {
  // Prepare the vector for translation and scale
  let v3_tra = object.posArray;
  let v3_sca = object.scaArray;

  /*
  // Animate the rotation of the objects
  object.rotDeg.x = (object.rotDeg.x + settings.rotationSpeed.x * fract) % 360;
  object.rotDeg.y = (object.rotDeg.y + settings.rotationSpeed.y * fract) % 360;
  object.rotDeg.z = (object.rotDeg.z + settings.rotationSpeed.z * fract) % 360;
  object.rotRad.x = object.rotDeg.x * Math.PI / 180;
  object.rotRad.y = object.rotDeg.y * Math.PI / 180;
  object.rotRad.z = object.rotDeg.z * Math.PI / 180;
  */

  // Create the individual transform matrices
  const scaMat = M4.scale(v3_sca);
  const rotXMat = M4.rotationX(object.rotRad.x);
  const rotYMat = M4.rotationY(object.rotRad.y);
  const rotZMat = M4.rotationZ(object.rotRad.z);
  const traMat = M4.translation(v3_tra);

  // Create the composite matrix with all transformations
  let transforms = M4.identity();
  transforms = M4.multiply(scaMat, transforms);
  transforms = M4.multiply(rotXMat, transforms);
  transforms = M4.multiply(rotYMat, transforms);
  transforms = M4.multiply(rotZMat, transforms);
  transforms = M4.multiply(traMat, transforms);

  object.matrix = transforms;

  // Apply the projection to the final matrix for the
  // World-View-Projection
  const wvpMat = M4.multiply(viewProjectionMatrix, transforms);

  // Model uniforms
  let objectUniforms = {
    u_transforms: wvpMat
  }
  twgl.setUniforms(programInfo, objectUniforms);

  gl.bindVertexArray(object.vao);
  twgl.drawBufferInfo(gl, object.bufferInfo);
}

// Function to do the actual display of the objects
async function drawScene() {
  // Compute time elapsed since last frame
  let now = Date.now();
  let deltaTime = now - then;
  elapsed += deltaTime;
  let fract = Math.min(1.0, elapsed / duration);
  then = now;

  // Clear the canvas
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // tell webgl to cull faces
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);

  scene.camera.checkKeys();
  //console.log(scene.camera);
  const viewProjectionMatrix = setupViewProjection(gl);

  // Draw the objects
  gl.useProgram(colorProgramInfo.program);
  for (let object of scene.objects) {
    drawObject(gl, colorProgramInfo, object, viewProjectionMatrix, fract);
  }

  // Update the scene after the elapsed duration
  if (elapsed >= duration) {
    elapsed = 0;
    await update();
  }

  requestAnimationFrame(drawScene);
}

function setupViewProjection(gl) {
  // Field of view of 60 degrees vertically, in radians
  const fov = 60 * Math.PI / 180;
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;

  // Matrices for the world view
  const projectionMatrix = M4.perspective(fov, aspect, 1, 200);

  const cameraPosition = scene.camera.posArray;
  const target = scene.camera.targetArray;
  const up = [0, 1, 0];

  const cameraMatrix = M4.lookAt(cameraPosition, target, up);
  const viewMatrix = M4.inverse(cameraMatrix);
  const viewProjectionMatrix = M4.multiply(projectionMatrix, viewMatrix);

  return viewProjectionMatrix;
}

// Setup a ui.
function setupUI() {
  /*
  const gui = new GUI();

  // Settings for the animation
  const animFolder = gui.addFolder('Animation:');
  animFolder.add( settings.rotationSpeed, 'x', 0, 360)
      .decimals(2)
  animFolder.add( settings.rotationSpeed, 'y', 0, 360)
      .decimals(2)
  animFolder.add( settings.rotationSpeed, 'z', 0, 360)
      .decimals(2)
  */
}

main();
