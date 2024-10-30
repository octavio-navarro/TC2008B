/*
 * Script to draw a color polygon using WebGL 2,
 * using viewport transforms to provide coordinates in different references
 * Also using external functions to abstract commonly used code
 *
 * Gilberto Echeverria
 * 2024-07-11
 */


'use strict';

import * as twgl from 'twgl-base.js'

// Define the shader code, using GLSL 3.00

const vsGLSL = `#version 300 es
in vec2 a_position;
in vec4 a_color;

uniform vec2 u_resolution;

out vec4 v_color;

void main() {
    // Convert the position from pixels to 0.0 - 1.0
    vec2 zeroToOne = a_position / u_resolution;

    // Convert from 0->1 to 0->2
    vec2 zeroToTwo = zeroToOne * 2.0;

    // Convert from 0->2 to -1->1 (clip space)
    vec2 clipSpace = zeroToTwo - 1.0;

    gl_Position = vec4(clipSpace, 0, 1);
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

function main() {
    const canvas = document.querySelector('canvas');
    const gl = canvas.getContext('webgl2');

    const programInfo = twgl.createProgramInfo(gl, [vsGLSL, fsGLSL]);

    const sides = 5;
    const centerX = 600;
    const centerY = 300;
    const radius = 200;

    // Create a polygon with the center at a specific location
    const arrays = generateData(sides, centerX, centerY, radius);

    const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);

    const vao = twgl.createVAOFromBufferInfo(gl, programInfo, bufferInfo);

    drawScene(gl, vao, programInfo, bufferInfo);
}

// Function to do the actual display of the objects
function drawScene(gl, vao, programInfo, bufferInfo) {
    twgl.resizeCanvasToDisplaySize(gl.canvas);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    let uniforms = 
    {
        u_resolution: [gl.canvas.width, gl.canvas.height],
    }

    gl.useProgram(programInfo.program);

    twgl.setUniforms(programInfo, uniforms);

    console.log(vao);

    gl.bindVertexArray(vao);

    twgl.drawBufferInfo(gl, bufferInfo);
}

// Create the data for the vertices of the polyton, as an object with two arrays
function generateData(sides, centerX, centerY, radius) {
    let arrays =
    {
        a_position: { numComponents: 2, data: [] },
        a_color:    { numComponents: 4, data: [] },
        indices:    { numComponents: 3, data: [] }
    };

    // Initialize the center vertex, at the origin and with white color
    arrays.a_position.data.push(centerX);
    arrays.a_position.data.push(centerY);
    arrays.a_color.data.push(1);
    arrays.a_color.data.push(1);
    arrays.a_color.data.push(1);
    arrays.a_color.data.push(1);

    // Loop over the sides to create the rest of the vertices
    for (let s=0; s<sides; s++) {
        let angle = 2 * Math.PI * s / sides;
        let x = centerX + Math.cos(angle) * radius;
        let y = centerY + Math.sin(angle) * radius;
        arrays.a_position.data.push(x);
        arrays.a_position.data.push(y);
        arrays.a_color.data.push(Math.random());
        arrays.a_color.data.push(Math.random());
        arrays.a_color.data.push(Math.random());
        arrays.a_color.data.push(1);
        arrays.indices.data.push(0);
        arrays.indices.data.push(s + 1);
        arrays.indices.data.push(((s + 2) <= sides) ? (s + 2) : 1);
    }
    console.log(arrays);

    return arrays;
}

main()
