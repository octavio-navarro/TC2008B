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
import { M4 } from '../libs/3d-lib';
import { Object3D } from '../libs/object3d';

// Define the shader code, using GLSL 3.00
import vsGLSL from '../assets/shaders/vs_color.glsl?raw';
import fsGLSL from '../assets/shaders/fs_color.glsl?raw';

// Read the contents of an OBJ file
//import objData from '../assets/models/utah_teapot_uv.obj?raw';

// Global variables
let programInfo = undefined;
let gl = undefined;

// Variable with the data for the object transforms, controlled by the UI
const objects = [];

function main() {
    // Setup the canvas area
    const canvas = document.querySelector('canvas');
    gl = canvas.getContext('webgl2');
    twgl.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Prepare the program with the shaders
    programInfo = twgl.createProgramInfo(gl, [vsGLSL, fsGLSL]);

    // Prepare the object to be drawn
    const cube = new Object3D(1);
    cube.prepareVAO(gl, programInfo);
    objects.push(cube);

    // Prepare the user interface
    setupUI(cube);

    drawScene();
}

function drawObject(gl, programInfo, object, viewProjectionMatrix) {
    // Prepare the vector for translation and scale
    let v3_tra = [object.position.x,
                  object.position.y,
                  object.position.z];
    let v3_sca = [object.scale.x,
                  object.scale.y,
                  object.scale.z];

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
        u_transforms: wvpMat,
    }

    twgl.setUniforms(programInfo, uniforms);
    gl.bindVertexArray(object.vao);
    twgl.drawBufferInfo(gl, object.bufferInfo);
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

    drawObject(gl, programInfo, objects[0], viewProjectionMatrix);

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
function setupUI(object) {
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
}

main()
