/*
 * Script para practicar las transformaciones en objectos 2D
 *
 * Miranda Urban Solano A01752391
 * noviembre 2025
 */

'use strict';

import * as twgl from "twgl-base.js";
import {emojiCat} from "./libs/A01752391-shapes";
import { M3 } from './libs/A01752391-2d-libs.js';
import GUI from 'lil-gui';


/*// Vertex Shader as a string
const vsGLSL = `#version 300 es
in vec4 a_position;
in vec4 a_color;

out vec4 v_color;

void main() {
    gl_Position = a_position;
    v_color = a_color;
}
`;*/

// Fragment Shader as a string
const fsGLSL = `#version 300 es
precision highp float;

in vec4 v_color;

out vec4 outColor;

void main() {
    outColor = v_color;
}
`;

/*function main() {
    const canvas = document.querySelector('canvas');
    const gl = canvas.getContext('webgl2');
    

    const programInfo = twgl.createProgramInfo(gl, [vsGLSL, fsGLSL]);

    const arrays = emojiCat(); // Dibujar emoji

    const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);

    const vao = twgl.createVAOFromBufferInfo(gl, programInfo, bufferInfo);
    console.log(vao);

    gl.bindVertexArray(vao);

    gl.useProgram(programInfo.program);

    twgl.drawBufferInfo(gl, bufferInfo);
}*/


// Define the shader code, using GLSL 3.00

const vsGLSL = `#version 300 es
in vec2 a_position;
in vec4 a_color;

uniform vec2 u_resolution;
uniform mat3 u_transforms;

out vec4 v_color;
`;

// Structure for the global data of all objects
// This data will be modified by the UI and used by the renderer
const objects = {
    model: {
        transforms: {
            t: {
                x: 0,
                y: 0,
                z: 0,
            },
            rr: {
                x: 0,
                y: 0,
                z: 0,
            },
            s: {
                x: 1,
                y: 1,
                z: 1,
            }
        },
        color: [1, 0.3, 0, 1],
    }
}

// Initialize the WebGL environmnet
function main() {
    const canvas = document.querySelector('canvas');
    const gl = canvas.getContext('webgl2');
    twgl.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    setupUI(gl);

    const programInfo = twgl.createProgramInfo(gl, [vsGLSL, fsGLSL]);

    const arrays = emojiCat();

    const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);

    const vao = twgl.createVAOFromBufferInfo(gl, programInfo, bufferInfo);

    drawScene(gl, vao, programInfo, bufferInfo);
}

// Function to do the actual display of the objects
function drawScene(gl, vao, programInfo, bufferInfo) {

    let translate = [objects.model.transforms.t.x, objects.model.transforms.t.y];
    let angle_radians = objects.model.transforms.rr.z;
    let scale = [objects.model.transforms.s.x, objects.model.transforms.s.y];

    // Create transform matrices
    const scaMat = M3.scale(scale);
    const rotMat = M3.rotation(angle_radians);
    const traMat = M3.translation(translate);

    // Create a composite matrix
    let transforms = M3.identity();
    transforms = M3.multiply(scaMat, transforms);
    transforms = M3.multiply(rotMat, transforms);
    transforms = M3.multiply(traMat, transforms);

    let uniforms =
    {
        u_resolution: [gl.canvas.width, gl.canvas.height],
        u_transforms: transforms,
        u_color: objects.model.color,
    }

    gl.useProgram(programInfo.program);

    twgl.setUniforms(programInfo, uniforms);

    gl.bindVertexArray(vao);

    twgl.drawBufferInfo(gl, bufferInfo);

    requestAnimationFrame(() => drawScene(gl, vao, programInfo, bufferInfo));
}

// Recibe un objeto y las propiedades de este (x,y,z), y las modifica
function setupUI(gl)
{
    const gui = new GUI();

    const traFolder = gui.addFolder('Translation');
    traFolder.add(objects.model.transforms.t, 'x', 0, gl.canvas.width);
    traFolder.add(objects.model.transforms.t, 'y', 0, gl.canvas.height);

    const rotFolder = gui.addFolder('Rotation');
    rotFolder.add(objects.model.transforms.rr, 'z', 0, Math.PI * 2);

    const scaFolder = gui.addFolder('Scale');
    scaFolder.add(objects.model.transforms.s, 'x', -5, 5);
    scaFolder.add(objects.model.transforms.s, 'y', -5, 5);

    gui.addColor(objects.model, 'color');
}

main()
