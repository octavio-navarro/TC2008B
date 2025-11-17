/*
 * Simple scene with a lighted cube
 *
 * Gilberto Echeverria
 * 2025-11-13
 */


'use strict';

import * as twgl from 'twgl-base.js';
import GUI from 'lil-gui';
import { M4 } from '../libs/3d-lib';
import { Scene3D } from '../libs/scene3d';
import { Object3D } from '../libs/object3d';
import { Light3D } from '../libs/light3d';
import { Camera3D } from '../libs/camera3d';

// Define the shader code, using GLSL 3.00
import vsGLSL from '../assets/shaders/vs_phong_301.glsl?raw';
import fsGLSL from '../assets/shaders/fs_phong_301.glsl?raw';

const scene = new Scene3D();

// Variable for the scene settings
const settings = {
    // Speed in degrees
    rotationSpeed: {
        x: 40,
        y: 40,
        z: 40,
    },
};


// Global variables
let phongProgramInfo = undefined;
let gl = undefined;
const duration = 1000; // ms
let then = 0;

function main() {
    // Setup the canvas area
    const canvas = document.querySelector('canvas');
    gl = canvas.getContext('webgl2');
    twgl.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Prepare the program with the shaders
    phongProgramInfo = twgl.createProgramInfo(gl, [vsGLSL, fsGLSL]);

    // Initialize the scene
    setupScene();

    // Position the objects in the scene
    setupObjects(scene, gl, phongProgramInfo);

    // Prepare the user interface
    setupUI();

    // Fisrt call to the drawing loop
    drawScene();
}

function setupScene() {
    let camera = new Camera3D(0,
        20,             // Distance to target
        0,              // Azimut
        0,              // Elevation
        [0, 0, 10],
        [0, 0, 0]);
    scene.setCamera(camera);
    scene.camera.setupControls();

    let light = new Light3D(0, [3, 3, 5],              // Position
                               [0.3, 0.3, 0.3, 1.0],   // Ambient
                               [1.0, 1.0, 1.0, 1.0],   // Diffuse
                               [1.0, 1.0, 1.0, 1.0]);  // Specular
    scene.addLight(light);
}

function setupObjects(scene, gl, programInfo) {
    // Create an object with the base cube
    addObject(scene, gl, programInfo);
}

// Initialize a new 3D object and add it to a list
function addObject(scene, gl, programInfo, objData) {
    // Create a new cube, with a scale of 3
    const object = new Object3D(0, [0, 0, 0], [0, 0, 0], [3, 3, 3]);
    object.prepareVAO(gl, programInfo, objData);
    scene.addObject(object);
}

// Draw an object with its corresponding transformations
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

    // The matrix to be used for normal transformations
    const normalMat = M4.transpose(M4.inverse(object.matrix));

    // Model uniforms
    let objectUniforms = {



    }
    twgl.setUniforms(programInfo, objectUniforms);

    gl.bindVertexArray(object.vao);
    twgl.drawBufferInfo(gl, object.bufferInfo);
}

// Function to do the actual display of the objects
function drawScene() {
    // Compute time elapsed since last frame
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

    scene.camera.checkKeys();
    const viewProjectionMatrix = setupViewProjection(gl);

    gl.useProgram(phongProgramInfo.program);

    // Scene uniforms
    let globalUniforms = {



    }
    twgl.setUniforms(phongProgramInfo, globalUniforms);

    // Draw the illuminated objects
    for (let object of scene.objects) {
        drawObject(gl, phongProgramInfo, object, viewProjectionMatrix, fract);
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
    const gui = new GUI();

    const modelFolder = gui.addFolder('Model:')

    const rotFolder = modelFolder.addFolder('Rotation:')
    rotFolder.add( scene.objects[0].rotDeg, 'x', -360, 360)
            .decimals(2)
            .onChange( value => {
                scene.objects[0].rotRad.x = value * Math.PI / 180.0;
            });
    rotFolder.add( scene.objects[0].rotDeg, 'y', -360, 360)
            .decimals(2)
            .onChange( value => {
                scene.objects[0].rotRad.y = value * Math.PI / 180.0;
            });
    rotFolder.add( scene.objects[0].rotDeg, 'z', -360, 360)
            .decimals(2)
            .onChange( value => {
                scene.objects[0].rotRad.z = value * Math.PI / 180.0;
            });

    const scaFolder = modelFolder.addFolder('Scale:')
    scaFolder.add( scene.objects[0], 's_all', -5, 5)
        .onChange( value => {
            scene.objects[0].scale.x = value;
            scene.objects[0].scale.y = value;
            scene.objects[0].scale.z = value;
        })
    scaFolder.add( scene.objects[0].scale, 'x', -5, 5)
        .listen()
    scaFolder.add( scene.objects[0].scale, 'y', -5, 5)
        .listen()
    scaFolder.add( scene.objects[0].scale, 'z', -5, 5)
        .listen()

    modelFolder.addColor( scene.objects[0], 'color')

    // Settings for the animation
    const animFolder = gui.addFolder('Animation:');
    animFolder.add( settings.rotationSpeed, 'x', 0, 360)
        .decimals(2)
    animFolder.add( settings.rotationSpeed, 'y', 0, 360)
        .decimals(2)
    animFolder.add( settings.rotationSpeed, 'z', 0, 360)
        .decimals(2)

    // Settings for the animation
    const lightFolder = gui.addFolder('Light:')
    lightFolder.add( scene.lights[0].position, 'x', -20, 20)
        .decimals(2)
    lightFolder.add( scene.lights[0].position, 'y', -20, 20)
        .decimals(2)
    lightFolder.add( scene.lights[0].position, 'z', -20, 20)
        .decimals(2)

    lightFolder.addColor(scene.lights[0], 'ambient')
    lightFolder.addColor(scene.lights[0], 'diffuse')
    lightFolder.addColor(scene.lights[0], 'specular')
}

main()
