/*
 * Script to draw a color polygon using WebGL 2
 * Also using external functions to abstract commonly used code
 *
 * Gilberto Echeverria
 * 2024-07-02
 */


'use strict';

import * as twgl from "twgl-base.js";

// Vertex Shader as a string
const vsGLSL = `#version 300 es
in vec4 a_position;
in vec4 a_color;

out vec4 v_color;

void main() {
    gl_Position = a_position;
    v_color = a_color;
}
`;

// Fragment Shader as a string
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

    const sides = 6;

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
    // The arrays are initially empty
    let arrays =
    {
        // Two components for each position in 2D
        a_position: { numComponents: 2, data: [] },
        // Four components for a color (RGBA)
        a_color:    { numComponents: 4, data: [] },
        // Three components for each triangle, the 3 vertices
        indices:  { numComponents: 3, data: [] }
    };

    // Initialize the center vertex, at the origin and with white color
    arrays.a_position.data.push(0);
    arrays.a_position.data.push(0);
    arrays.a_color.data.push(1);
    arrays.a_color.data.push(1);
    arrays.a_color.data.push(1);
    arrays.a_color.data.push(1);

    let angleStep = 2 * Math.PI / sides;
    // Loop over the sides to create the rest of the vertices
    for (let s=0; s<sides; s++) {
        let angle = angleStep * s;
        // Generate the coordinates of the vertex
        let x = Math.cos(angle);
        let y = Math.sin(angle);
        arrays.a_position.data.push(x);
        arrays.a_position.data.push(y);
        // Generate a random color for the vertex
        arrays.a_color.data.push(Math.random());
        arrays.a_color.data.push(Math.random());
        arrays.a_color.data.push(Math.random());
        arrays.a_color.data.push(1);
        // Define the triangles, in counter clockwise order
        arrays.indices.data.push(0);
        arrays.indices.data.push(s + 1);
        arrays.indices.data.push(((s + 2) <= sides) ? (s + 2) : 1);
    }
    console.log(arrays);

    return arrays;
}

main()
