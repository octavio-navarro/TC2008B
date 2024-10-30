/*
 * Script to draw a color polygon using WebGL 2
 * Also using external functions to abstract commonly used code
 *
 * Gilberto Echeverria
 * 2024-07-02
 */


'use strict';

import * as twgl from "twgl-base.js";

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
}
`;

function main() {
    const canvas = document.querySelector('canvas');
    const gl = canvas.getContext('webgl2');

    const programInfo = twgl.createProgramInfo(gl, [vsGLSL, fsGLSL]);

    const sides = 5;

    const arrays = generateData(sides);

    const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);

    const vao = twgl.createVAOFromBufferInfo(gl, programInfo, bufferInfo);
    console.log(vao);

    gl.bindVertexArray(vao);

    gl.useProgram(programInfo.program);

    twgl.drawBufferInfo(gl, bufferInfo);
    //gl.drawElements(gl.TRIANGLES, bufferInfo.enumElements, gl.UNSIGNED_SHORT, 0);
}

// Create the data for the vertices of the polyton, as an object with two arrays
function generateData(sides) {
    let arrays =
    {
        position: { numComponents: 2, data: [] },
        color:    { numComponents: 4, data: [] },
        indices:  { numComponents: 3, data: [] }
    };

    // Initialize the center vertex, at the origin and with white color
    arrays.position.data.push(0);
    arrays.position.data.push(0);
    arrays.color.data.push(1);
    arrays.color.data.push(1);
    arrays.color.data.push(1);
    arrays.color.data.push(1);

    // Loop over the sides to create the rest of the vertices
    for (let s=0; s<sides; s++) {
        let angle = 2 * Math.PI * s / sides;
        let x = Math.cos(angle);
        let y = Math.sin(angle);
        arrays.position.data.push(x);
        arrays.position.data.push(y);
        arrays.color.data.push(Math.random());
        arrays.color.data.push(Math.random());
        arrays.color.data.push(Math.random());
        arrays.color.data.push(1);
        arrays.indices.data.push(0);
        arrays.indices.data.push(s + 1);
        arrays.indices.data.push(((s + 2) <= sides) ? (s + 2) : 1);
    }
    console.log(arrays);

    return arrays;
}

main()
