/*
 * Script to display an object with texture mapping
 *
 * Gilberto Echeverria
 * 2025-11-17
 */


'use strict';

import * as twgl from 'twgl-base.js';
import GUI from 'lil-gui';
import { cubeTextured } from '../libs/shapes';
import { Object3D } from '../libs/object3d';
import { V3, M4 } from '../libs/3d-lib';

// Define the shader code, using GLSL 3.00
import vsGLSL from '../assets/shaders/vs_flat_texture.glsl?raw';
import fsGLSL from '../assets/shaders/fs_flat_texture.glsl?raw';
//import vsGLSL from '../assets/shaders/vs_color_texture.glsl?raw';
//import fsGLSL from '../assets/shaders/fs_color_texture.glsl?raw';

const settings = {
    // Speed in degrees
    rotationSpeed: {
        x: 0,
        y: 0,
        z: 0,
    }
}

let gl = undefined;
let programInfo = undefined;
let object = undefined;
const duration = 1000; // ms
let then = 0;


function setupViewProjection(gl) {
    // Field of view of 60 degrees, in radians
    const fov = 60 * Math.PI / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;

    // Matrices for the world view
    const projectionMatrix = M4.perspective(fov, aspect, 1, 200);

    const cameraPosition = [0, 0, 10];
    const target = [0, 0, 0];
    const up = [0, 1, 0];

    const cameraMatrix = M4.lookAt(cameraPosition, target, up);
    const viewMatrix = M4.inverse(cameraMatrix);
    const viewProjectionMatrix = M4.multiply(projectionMatrix, viewMatrix);

    return viewProjectionMatrix;
}


function drawObject(gl, programInfo, object, viewProjectionMatrix, fract) {
    // Prepare the vector for translation and scale
    let v3_tra = object.posArray;
    let v3_sca = object.scaArray;

    // Animate the rotation of the objects
    object.rotDeg.x = (object.rotDeg.x + settings.rotationSpeed.x * fract) % 360;
    object.rotDeg.y = (object.rotDeg.y + settings.rotationSpeed.y * fract) % 360;
    object.rotDeg.z = (object.rotDeg.z + settings.rotationSpeed.z * fract) % 360;
    object.rotRad.x = object.rotDeg.x * Math.PI / 180;
    object.rotRad.y = object.rotDeg.y * Math.PI / 180;
    object.rotRad.z = object.rotDeg.z * Math.PI / 180;

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

    let uniforms = {
        u_worldViewProjection: wvpMat,
        u_texture: object.texture
    }
    twgl.setUniforms(programInfo, uniforms);

    gl.bindVertexArray(object.vao);
    twgl.drawBufferInfo(gl, object.bufferInfo);
    //twgl.drawBufferInfo(gl, object.bufferInfo, gl.LINES);
}


// Function to do the actual display of the objects
function drawScene() {
    // Compute time elapsed since last frame
    // Convert time from milliseconds to seconds
    let now = Date.now();
    let deltaTime = now - then;
    const fract = deltaTime / duration;
    then = now;

    // Clear the canvas
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // tell webgl to cull faces
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    // All cubes will use the same program and vertices
    gl.useProgram(programInfo.program);

    const viewProjectionMatrix = setupViewProjection(gl);

    drawObject(gl, programInfo, object, viewProjectionMatrix, fract);

    requestAnimationFrame(drawScene);
}

function main() {
    // Setup the canvas area
    const canvas = document.querySelector('canvas');
    gl = canvas.getContext('webgl2');
    twgl.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    programInfo = twgl.createProgramInfo(gl, [vsGLSL, fsGLSL]);

    object = new Object3D('model');
    // Use a textured cube
    object.arrays = cubeTextured(2);
    object.bufferInfo = twgl.createBufferInfoFromArrays(gl, object.arrays);
    object.vao = twgl.createVAOFromBufferInfo(gl, programInfo, object.bufferInfo);

    // Get a texture ready to be drawn on the objects
    try {
        object.texture = twgl.createTexture(gl, {
            min: gl.NEAREST,
            mag: gl.NEAREST,
            src: './../assets/textures/f-texture.png'
        });
    } catch (error) {
        console.log(error)
    }

    // Prepare the user interface
    setupUI(gl);

    // Fisrt call to the drawing loop
    drawScene();
}

function setupUI() {
    // Create the UI elements for each value
    const gui = new GUI();

    // Create the UI elements for each value
    const traFolder = gui.addFolder('Translation:')
    traFolder.add( object.position, 'x', -5, 5)
    traFolder.add( object.position, 'y', -5, 5)
    traFolder.add( object.position, 'z', -5, 5)

    const rotFolder = gui.addFolder('Rotation:')
    rotFolder.add( object.rotDeg, 'x', -360, 360)
            .decimals(2)
            .onChange( value => {
                object.rotRad.x = value * Math.PI / 180.0;
            });
    rotFolder.add( object.rotDeg, 'y', -360, 360)
            .decimals(2)
            .onChange( value => {
                object.rotRad.y = value * Math.PI / 180.0;
            });
    rotFolder.add( object.rotDeg, 'z', -360, 360)
            .decimals(2)
            .onChange( value => {
                object.rotRad.z = value * Math.PI / 180.0;
            });

    const scaFolder = gui.addFolder('Scale:')
    scaFolder.add( object.scale, 'x', -5, 5)
    scaFolder.add( object.scale, 'y', -5, 5)
    scaFolder.add( object.scale, 'z', -5, 5)
    // Change all scales at once
    scaFolder.add( object, 's_all', -5, 5)
        .decimals(2)
        .onChange(value => {
          object.scale.x = value;
          object.scale.y = value;
          object.scale.z = value;
        });

    // Settings for the animation
    const animFolder = gui.addFolder('Animation:')
    animFolder.add( settings.rotationSpeed, 'x', 0, 360)
        .decimals(2)
    animFolder.add( settings.rotationSpeed, 'y', 0, 360)
        .decimals(2)
    animFolder.add( settings.rotationSpeed, 'z', 0, 360)
        .decimals(2)
}

main();
