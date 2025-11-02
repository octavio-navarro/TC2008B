/*
 * Script to draw a complex shape in 2D
 *
 * Gilberto Echeverria
 * 2024-07-12
 */


'use strict';

import * as twgl from 'twgl-base.js';
import { shapeF } from '../libs/shapes.js';

// Define the shader code, using GLSL 3.00

const vsGLSL = `#version 300 es
in vec2 a_position;

uniform vec2 u_resolution;

void main() {
    // Convert the position from pixels to 0.0 - 1.0
    vec2 zeroToOne = a_position / u_resolution;

    // Convert from 0->1 to 0->2
    vec2 zeroToTwo = zeroToOne * 2.0;

    // Convert from 0->2 to -1->1 (clip space)
    vec2 clipSpace = zeroToTwo - 1.0;

    // Invert Y axis
    //gl_Position = vec4(clipSpace[0], clipSpace[1] * -1.0, 0, 1);
    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
}
`;

const fsGLSL = `#version 300 es
precision highp float;

uniform vec4 u_color;

out vec4 outColor;

void main() {
    outColor = u_color;
}
`;

function main() {
    const canvas = document.querySelector('canvas');
    const gl = canvas.getContext('webgl2');

    const programInfo = twgl.createProgramInfo(gl, [vsGLSL, fsGLSL]);

    const arrays = shapeF();

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
        u_color: [Math.random(), Math.random(), Math.random(), 1],
    }

    gl.useProgram(programInfo.program);

    twgl.setUniforms(programInfo, uniforms);

    console.log(vao);

    gl.bindVertexArray(vao);

    twgl.drawBufferInfo(gl, bufferInfo);
}

main()
