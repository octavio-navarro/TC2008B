/*
 * Script to draw a complex shape in 2D
 *
 * Gilberto Echeverria
 * 2024-07-12
 */


'use strict';

import * as twgl from 'twgl-base.js';
import { shapeF } from '../libs/shapes.js';
import { M3 } from '../libs/2d-lib.js';

// Define the shader code, using GLSL 3.00

const vsGLSL = `#version 300 es
in vec2 a_position;

uniform vec2 u_resolution;
uniform mat3 u_transforms;

void main() {
    // Multiply the matrix by the vector, adding 1 to the vector to make
    // it the correct size. Then keep only the two first components.
    vec2 position = (u_transforms * vec3(a_position, 1)).xy;

    // Convert the position from pixels to 0.0 - 1.0
    vec2 zeroToOne = position / u_resolution;

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

// Initialize the WebGL environmnet
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

    let translate = [240, 150];
    let angle_degrees = 30;
    let angle_radians = angle_degrees * Math.PI / 180;
    let scale = [3.1, 1.2];

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
        u_color: [Math.random(), Math.random(), Math.random(), 1],
    }

    gl.useProgram(programInfo.program);

    twgl.setUniforms(programInfo, uniforms);

    gl.bindVertexArray(vao);

    twgl.drawBufferInfo(gl, bufferInfo);
}

main()
