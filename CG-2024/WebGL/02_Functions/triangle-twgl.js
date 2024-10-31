/*
 * Script to draw a color triangle using WebGL 2
 * Also using external functions to abstract commonly used code
 *
 * Gilberto Echeverria
 * 2024-07-02
 */


'use strict';

import * as twgl from 'twgl-base.js'

// Define the shader code, using GLSL 3.00

const vsGLSL = `#version 300 es
in vec4 position;
in vec4 color;

out vec4 v_color;

void main() {
    gl_Position = position;
    v_color = color;
}
`;

const fsGLSL = `#version 300 es
precision highp float;

in vec4 v_color;

out vec4 outColor;

void main() {
    outColor = v_color;
    //outColor = vec4(1, 0, 1, 1);
}
`;


function main_twgl() {
    const canvas = document.querySelector('canvas');
    const gl = canvas.getContext('webgl2');

    const programInfo = twgl.createProgramInfo(gl, [vsGLSL, fsGLSL]);
    //console.log(programInfo.program);

    // Create an object that contains the arrays with the data
    // for each of the vertices
    const arrays = generateData();

    const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);

    const vao = twgl.createVAOFromBufferInfo(gl, programInfo, bufferInfo);

    gl.bindVertexArray(vao);

    gl.useProgram(programInfo.program);

    // compute 3 vertices for 1 triangle
    twgl.drawBufferInfo(gl, bufferInfo);
}

// Create the data for the vertices of the polyton, as an object with two arrays
function generateData() {
    let arrays = {
        position: {
            numComponents: 2,
            data: new Float32Array([
                0,   0.7,
                0.5,  -0.7,
                -0.5,  -0.7,
            ])
        },
        color: {
            numComponents: 4, 
            /*
            // If not type is indicated, twgl will assume a float
            data: [
                1, 0, 0, 1,
                0, 1, 0, 1,
                0, 0, 1, 1,
            ]
            */
            // To pass integer values, the type must be specified
            data: new Uint8Array([
                255, 0, 0, 255,
                0, 255, 0, 255,
                0, 0, 255, 255,
            ])
        }
    };

    return arrays;
}

main_twgl()
