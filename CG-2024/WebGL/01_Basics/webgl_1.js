/*
 * Script to draw a color triangle using WebGL
 * Based on the tutorials at:
 * https://webglfundamentals.org/webgl/lessons/resources/webgl-state-diagram.html?exampleId=rainbow-triangle#no-help
 *
 * Gilberto Echeverria
 * 2024-07-01
 */


'use strict';

// Definitions for the shader programs

const vsGLSL = `
attribute vec4 position;
attribute vec4 color;

varying vec4 v_color;

void main() {
    gl_Position = position;
    v_color = color;
}
`;

const fsGLSL = `
precision highp float;

varying vec4 v_color;

void main() {
    gl_FragColor = v_color;
}
`;

// Get the canvas space from the HTML DOM
const canvas = document.querySelector('#canvas');
const gl = canvas.getContext('webgl');

gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

// Initialization of the programs

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vsGLSL);
gl.compileShader(vertexShader);
if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(vertexShader))
};

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fsGLSL);
gl.compileShader(fragmentShader);
if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(fragmentShader))
};

const prg = gl.createProgram();
gl.attachShader(prg, vertexShader);
gl.attachShader(prg, fragmentShader);
gl.linkProgram(prg);
if (!gl.getProgramParameter(prg, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(prg))
};


// NOTE! These are only here to unclutter the diagram.
// It is safe to detach and delete shaders once
// a program is linked though it is arguably not common.
// and I usually don't do it.
gl.detachShader(prg, vertexShader);
gl.deleteShader(vertexShader);
gl.detachShader(prg, fragmentShader);
gl.deleteShader(fragmentShader);


// Get the references to the attributes in the programs

const positionLoc = gl.getAttribLocation(prg, 'position');
const colorLoc = gl.getAttribLocation(prg, 'color');

// The coordinates for the triangle vertices
// in clip space
const vertexPositions = new Float32Array([
       0,   0.7,
     0.5,  -0.7,
    -0.5,  -0.7,
]);

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertexPositions, gl.STATIC_DRAW);

const vertexColors = new Uint8Array([
    255, 0, 0, 255,
    0, 255, 0, 255,
    0, 0, 255, 255,
]);

const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertexColors, gl.STATIC_DRAW);


// Prepare the data to be read by the shaders

gl.enableVertexAttribArray(positionLoc);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.vertexAttribPointer(
    positionLoc,
    2,            // 2 values per vertex shader iteration
    gl.FLOAT,     // data is 32bit floats
    false,        // don't normalize
    0,            // stride (0 = auto)
    0,            // offset into buffer
);

gl.enableVertexAttribArray(colorLoc);
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.vertexAttribPointer(
    colorLoc,
    4,                // 4 values per vertex shader iteration
    gl.UNSIGNED_BYTE, // data is 8bit unsigned bytes
    true,             // do normalize
    0,                // stride (0 = auto)
    0,                // offset into buffer
);

gl.useProgram(prg);

// compute 3 vertices for 1 triangle
gl.drawArrays(gl.TRIANGLES, 0, 3);
