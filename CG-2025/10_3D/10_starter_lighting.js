/*
 * Using Phong shaders
 *
 * Gilberto Echeverria
 * 2024-11-03
 */


'use strict';

import * as twgl from 'twgl-base.js';
import GUI from 'lil-gui';
import { V3, M4 } from '../libs/3d-lib';
import { cubeFaceColors } from '../libs/shapes';

// Read the whole input file as a string
// https://vitejs.dev/guide/assets.html#importing-asset-as-string
// Define the shader code, using GLSL 3.00
import vsGLSL from './../assets/shaders/vs_phong_30x.glsl?raw';
import fsGLSL from './../assets/shaders/fs_phong_30x.glsl?raw';

// Variables used for the object, and coltrolled from the UI
const object = {
    model: {
        ambientColor: [0.3, 0.6, 0.6, 1.0],
        diffuseColor: [0.3, 0.6, 0.6, 1.0],
        specularColor: [0.3, 0.6, 0.6, 1.0],
        shininess: 60.0,
    },
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
            x: 1.2,
            y: 1.2,
            z: 1.2},
        s_all: 1.2
    }
};

const settings = {
    // Speed in degrees
    rotationSpeed: {
        x: 0,
        y: 30,
        z: 0,
    },
    cameraPosition: {
        x: 0,
        y: 0,
        z: 10,
    },
    lightPosition: {
        x: 10,
        y: 10,
        z: 10,
    },
    ambientColor: [0.5, 0.5, 0.5, 1.0],
    diffuseColor: [0.5, 0.5, 0.5, 1.0],
    specularColor: [0.5, 0.5, 0.5, 1.0],
};

const duration = 1000; // ms
let then = 0;

let arrays = undefined;
let programInfo = undefined;
let vao = undefined;
let bufferInfo = undefined;

function setupWorldView(gl) {
    // Field of view of 60 degrees, in radians
    const fov = 60 * Math.PI / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;

    // Matrices for the world view
    const projectionMatrix = M4.perspective(fov, aspect, 1, 200);

    const cameraPosition = [settings.cameraPosition.x,
                            settings.cameraPosition.y,
                            settings.cameraPosition.z];
    const target = [0, 0, 0];
    const up = [0, 1, 0];
    const cameraMatrix = M4.lookAt(cameraPosition, target, up);

    const viewMatrix = M4.inverse(cameraMatrix);

    const viewProjectionMatrix = M4.multiply(projectionMatrix, viewMatrix);
    return viewProjectionMatrix;
}

// Function to do the actual display of the objects
function drawScene(gl) {
    // Compute time elapsed since last frame
    let now = Date.now();
    let deltaTime = now - then;
    const fract = deltaTime / duration;
    then = now;

    twgl.resizeCanvasToDisplaySize(gl.canvas);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas
    gl.clearColor(0, 0, 0, 1);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // tell webgl to cull faces
    gl.enable(gl.CULL_FACE);

    // All objects will use the same program and vertices
    gl.useProgram(programInfo.program);
    gl.bindVertexArray(vao);

    const viewProjectionMatrix = setupWorldView(gl);

    // Convert the global transform values into twgl vectors
    let v3_trans = V3.create(object.transforms.t.x,
                             object.transforms.t.y,
                             object.transforms.t.z);
    let v3_scale = V3.create(object.transforms.s.x,
                             object.transforms.s.y,
                             object.transforms.s.z);

    // Variable with the position of the light
    let v3_lightPosition = V3.create(settings.lightPosition.x,
                                     settings.lightPosition.y,
                                     settings.lightPosition.z);
    let v3_cameraPosition = V3.create(settings.cameraPosition.x,
                                      settings.cameraPosition.y,
                                      settings.cameraPosition.z);

    let globalUniforms = {
        u_viewWorldPosition: v3_cameraPosition,
        u_lightWorldPosition: v3_lightPosition,
        u_ambientLight: settings.ambientColor,
        u_diffuseLight: settings.diffuseColor,
        u_specularLight: settings.specularColor,
    };
    twgl.setUniforms(programInfo, globalUniforms);

    // Matrices for the object world transforms
    const traMat = M4.translation(v3_trans);
    const rotXMat = M4.rotationX(object.transforms.rr.x);
    const rotYMat = M4.rotationY(object.transforms.rr.y);
    const rotZMat = M4.rotationZ(object.transforms.rr.z);
    const scaMat = M4.scale(v3_scale);

    let world = M4.identity();
    world = M4.multiply(traMat, world);
    world = M4.multiply(rotXMat, world);
    world = M4.multiply(rotYMat, world);
    world = M4.multiply(rotZMat, world);
    world = M4.multiply(scaMat, world);

    let worldViewProjection = M4.multiply(viewProjectionMatrix, world);

    let transformsInverseTranspose = M4.identity();

    let modelUniforms = {
        u_transforms: worldViewProjection,
        u_world: world,
        u_worldInverseTransform: transformsInverseTranspose,
        u_worldViewProjection: worldViewProjection,
        u_ambientColor: object.model.ambientColor,
        u_diffuseColor: object.model.diffuseColor,
        u_specularColor: object.model.specularColor,
        u_shininess: object.model.shininess,
    }
    twgl.setUniforms(programInfo, modelUniforms);
    //console.log("MODEL UNIFORMS");
    //console.log(modelUniforms);

    twgl.drawBufferInfo(gl, bufferInfo);

    requestAnimationFrame(() => drawScene(gl));
}

function setupUI(gl) {
    // Create the UI elements for each value
    const gui = new GUI();

    // Model controllers
    const modelFolder = gui.addFolder('Model:');
    modelFolder.addColor(object.model, 'ambientColor')
    modelFolder.addColor(object.model, 'diffuseColor')
    modelFolder.addColor(object.model, 'specularColor')
    modelFolder.add(object.model, 'shininess', 0, 600)
        .decimals(2)

    const transformsFolder = gui.addFolder('Transforms')
    const posFolder = transformsFolder.addFolder('Position:');
    posFolder.add( object.transforms.t, 'x', -5, 5)
        .decimals(2)
    posFolder.add( object.transforms.t, 'y', -5, 5)
        .decimals(2)
    posFolder.add( object.transforms.t, 'z', -5, 5)
        .decimals(2)
    const rotFolder = transformsFolder.addFolder('Rotation:');
    rotFolder.add( object.transforms.rd, 'x', 0, 360)
        .decimals(2)
        .listen()
        .onChange( value => {
            object.transforms.rd.x = value
            object.transforms.rr.x = object.transforms.rd.x * Math.PI / 180;
        });
    rotFolder.add( object.transforms.rd, 'y', 0, 360)
        .decimals(2)
        .listen()
        .onChange( value => {
            object.transforms.rd.y = value
            object.transforms.rr.y = object.transforms.rd.y * Math.PI / 180;
        });
    rotFolder.add( object.transforms.rd, 'z', 0, 360)
        .decimals(2)
        .listen()
        .onChange( value => {
            object.transforms.rd.z = value
            object.transforms.rr.z = object.transforms.rd.z * Math.PI / 180;
        });
    const scaFolder = transformsFolder.addFolder('Scale:');
    scaFolder.add(object.transforms, 's_all', -5, 5)
        .decimals(2)
        .onChange(value => {
          object.transforms.s.x = value;
          object.transforms.s.y = value;
          object.transforms.s.z = value;
        });
    scaFolder.add( object.transforms.s, 'x', -5, 5)
        .decimals(2)
        .listen()
    scaFolder.add( object.transforms.s, 'y', -5, 5)
        .decimals(2)
        .listen()
    scaFolder.add( object.transforms.s, 'z', -5, 5)
        .decimals(2)
        .listen()

    // Settings for the animation
    const lightFolder = gui.addFolder('Light:')
    lightFolder.add( settings.lightPosition, 'x', -20, 20)
        .decimals(2)
    lightFolder.add( settings.lightPosition, 'y', -20, 20)
        .decimals(2)
    lightFolder.add( settings.lightPosition, 'z', -20, 20)
        .decimals(2)
    lightFolder.addColor(settings, 'ambientColor')
    lightFolder.addColor(settings, 'diffuseColor')
    lightFolder.addColor(settings, 'specularColor')
}

function main() {
    const canvas = document.querySelector('canvas');
    const gl = canvas.getContext('webgl2');

    setupUI(gl);

    programInfo = twgl.createProgramInfo(gl, [vsGLSL, fsGLSL]);
    // Set the default shape to be used
    arrays = cubeFaceColors(2);
    //arrays = loadOBJ(fileContents);
    // Configure the Phong colors
    arrays.a_ambientColor = object.model.ambientColor;
    arrays.a_diffuseColor = object.model.diffuseColor;
    arrays.a_specularColor = object.model.specularColor;
    bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
    vao = twgl.createVAOFromBufferInfo(gl, programInfo, bufferInfo);

    drawScene(gl);
}

main()
