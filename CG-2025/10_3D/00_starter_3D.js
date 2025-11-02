/*
 * Base program for a 3D scene using the custom 3D library
 * Using twgl for boilerplate functions
 * The twgl and lil-gui libraries are installed with npm
 *
 * Gilberto Echeverria
 * 2024-11-06
 */


'use strict';

import * as twgl from 'twgl-base.js';
import GUI from 'lil-gui';
import { V3, M4 } from '../libs/3d-lib';

import { cubeFaceColors } from '../libs/shapes';

// Define the shader code, using GLSL 3.00
import vsGLSL from '../assets/shaders/vs_color.glsl?raw';
import fsGLSL from '../assets/shaders/fs_color.glsl?raw';

// Global variables
let programInfo = undefined;
let gl = undefined;

// Variable with the data for the object transforms, controlled by the UI
const objects = {
    model: {
        transforms: {
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
        },
        arrays: undefined,
        bufferInfo: undefined,
        vao: undefined,
    }
}

function main() {
    const canvas = document.querySelector('canvas');
    gl = canvas.getContext('webgl2');
    twgl.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    setupUI();

    programInfo = twgl.createProgramInfo(gl, [vsGLSL, fsGLSL]);

    // Prepare the object data and store it in the data structure
    objects.model.arrays = cubeFaceColors(2);
    objects.model.bufferInfo = twgl.createBufferInfoFromArrays(gl, objects.model.arrays);
    objects.model.vao = twgl.createVAOFromBufferInfo(gl, programInfo, objects.model.bufferInfo);

    drawScene();
}

// Function to do the actual display of the objects
function drawScene() {

    // Clear the canvas
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // tell webgl to cull faces
    gl.enable(gl.CULL_FACE);

    gl.useProgram(programInfo.program);

    const viewProjectionMatrix = setupViewProjection(gl);

    // Prepare the vector for translation and scale
    const traV3 = [objects.model.transforms.t.x,
                   objects.model.transforms.t.y,
                   objects.model.transforms.t.z];
    const scaV3 = [objects.model.transforms.s.x,
                   objects.model.transforms.s.y,
                   objects.model.transforms.s.z];

    // Create the individual transform matrices
    const traMat = M4.translation(traV3);
    const rotXMat = M4.rotationX(objects.model.transforms.rr.x);
    const rotYMat = M4.rotationY(objects.model.transforms.rr.y);
    const rotZMat = M4.rotationZ(objects.model.transforms.rr.z);
    const scaMat = M4.scale(scaV3);

    // Create the composite matrix with all transformations
    let transforms = M4.identity();
    transforms = M4.multiply(scaMat, transforms);
    transforms = M4.multiply(rotXMat, transforms);
    transforms = M4.multiply(rotYMat, transforms);
    transforms = M4.multiply(rotZMat, transforms);
    transforms = M4.multiply(traMat, transforms);

    // Apply the projection to the final matrix
    transforms = M4.multiply(viewProjectionMatrix, transforms);

    let uniforms = {
        u_transforms: transforms,
    }

    twgl.setUniforms(programInfo, uniforms);
    gl.bindVertexArray(objects.model.vao);
    twgl.drawBufferInfo(gl, objects.model.bufferInfo);

    requestAnimationFrame(() => drawScene(gl));
}

function setupViewProjection(gl) {
    // Field of view of 60 degrees vertically, in radians
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

// Setup a ui.
function setupUI() {
    const gui = new GUI();

    // Create the UI elements for each value
    const traFolder = gui.addFolder('Translation:')
    traFolder.add( objects.model.transforms.t, 'x', -5, 5)
    traFolder.add( objects.model.transforms.t, 'y', -5, 5)
    traFolder.add( objects.model.transforms.t, 'z', -5, 5)

    const rotFolder = gui.addFolder('Rotation:')
    rotFolder.add( objects.model.transforms.rd, 'x', 0, 360)
        .onChange( value => {
            objects.model.transforms.rd.x = value
            objects.model.transforms.rr.x = value * Math.PI / 180;
        });
    rotFolder.add( objects.model.transforms.rd, 'y', 0, 360)
        .onChange( value => {
            objects.model.transforms.rd.y = value
            objects.model.transforms.rr.y = value * Math.PI / 180;
        });
    rotFolder.add( objects.model.transforms.rd, 'z', 0, 360)
        .onChange( value => {
            objects.model.transforms.rd.z = value
            objects.model.transforms.rr.z = value * Math.PI / 180;
        });

    const scaFolder = gui.addFolder('Scale:')
    scaFolder.add( objects.model.transforms.s, 'x', -5, 5)
    scaFolder.add( objects.model.transforms.s, 'y', -5, 5)
    scaFolder.add( objects.model.transforms.s, 'z', -5, 5)
}

main()
