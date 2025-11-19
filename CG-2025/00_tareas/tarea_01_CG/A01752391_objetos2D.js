/*
 * Script para practicar las transformaciones en objectos 2D
 *
 * Miranda Urban Solano A01752391
 * noviembre 2025
 */

'use strict';

import * as twgl from "twgl-base.js";
import {emojiCat, pivot} from "./libs/A01752391-shapes.js";
import { M3 } from './libs/A01752391-2d-libs.js';
import GUI from 'lil-gui';

// Vertex shader for transformations
const vsGLSL = `#version 300 es
in vec2 a_position;
in vec4 a_color;

uniform mat3 u_transforms;

out vec4 v_color;

void main() {
    vec3 transformed = u_transforms * vec3(a_position, 1.0);
    gl_Position = vec4(transformed.xy, 0.0, 1.0);
    v_color = a_color;
}
`;

// Fragment shader
const fsGLSL = `#version 300 es
precision highp float;

in vec4 v_color;

out vec4 outColor;

void main() {
    outColor = v_color;
}
`;


// Structure for the global data of all objects
// This data will be modified by the UI and used by the renderer

let color_pivot = [0,0.7,0.9,1];

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
            },
            pivot: {
                x: 0,
                y: 0,
                color:  color_pivot,//[1.0, 0.0, 0.0, 1.0],
            }
        },
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

    // For building the emoji
    const arrays_cat = emojiCat();
    const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays_cat);
    const vao = twgl.createVAOFromBufferInfo(gl, programInfo, bufferInfo);

    // For building the pivot
    const arrays_pivot = pivot(objects.model.transforms.pivot.color)
    const bufferInfo_pivot = twgl.createBufferInfoFromArrays(gl, arrays_pivot);
    const vao_pivot = twgl.createVAOFromBufferInfo(gl, programInfo, bufferInfo_pivot);

    drawScene(gl, vao, programInfo, bufferInfo, vao_pivot, bufferInfo_pivot);
    //drawScene(gl, vao, programInfo, bufferInfo);
}

// Function to do the actual display of the objects
function drawScene(gl, vao, programInfo, bufferInfo, vao_pivot, bufferInfo_pivot) {

    let translate = [objects.model.transforms.t.x, objects.model.transforms.t.y];
    let angle_radians = objects.model.transforms.rr.z;
    let scale = [objects.model.transforms.s.x, objects.model.transforms.s.y];
    let pivotPoint = [objects.model.transforms.pivot.x, objects.model.transforms.pivot.y];

    // Create transform matrices for the cat
    const scaMat = M3.scale(scale);
    const rotMat = M3.rotation(angle_radians);
    const traMat = M3.translation(translate);

    // Create pivot's matrices
    const pivotOrigin = M3.translation([-pivotPoint[0], -pivotPoint[1]]);
    const pivotBack = M3.translation(pivotPoint);

    // Create a composite matrix for the cat
    // The order is important to transform correctly the cat according to the pivot position
    let catTransforms = M3.identity();
    catTransforms = M3.multiply(traMat, catTransforms);      // 1. Translation
    catTransforms = M3.multiply(pivotOrigin, catTransforms); // 2. Mover to pivot
    catTransforms = M3.multiply(rotMat, catTransforms);      // 3. Rotaion
    catTransforms = M3.multiply(pivotBack, catTransforms);   // 4. Mover to pivot
    catTransforms = M3.multiply(scaMat, catTransforms);      // 5. Scale

    // Create transform matrix for the pivot (solo translación para mostrar posición)
    let pivotTransforms = M3.translation(pivotPoint);

    gl.useProgram(programInfo.program);

    // Draw the cat with its transformations
    twgl.setUniforms(programInfo, { u_transforms: catTransforms });
    gl.bindVertexArray(vao);
    twgl.drawBufferInfo(gl, bufferInfo);

    // Draw the pivot with its own transformations (solo posición)
    twgl.setUniforms(programInfo, { u_transforms: pivotTransforms });
    gl.bindVertexArray(vao_pivot);
    twgl.drawBufferInfo(gl, bufferInfo_pivot);

    requestAnimationFrame(() => drawScene(gl, vao, programInfo, bufferInfo, vao_pivot, bufferInfo_pivot));
}

// Recibe un objeto y las propiedades de este (x,y,z), y las modifica
function setupUI(gl)
{
    const gui = new GUI();

    const traFolder = gui.addFolder('Translation');
    traFolder.add(objects.model.transforms.t, 'x', -1, 1);
    traFolder.add(objects.model.transforms.t, 'y', -1, 1);

    const rotFolder = gui.addFolder('Rotation');
    rotFolder.add(objects.model.transforms.rr, 'z', 0, Math.PI * 2);

    const scaFolder = gui.addFolder('Scale');
    scaFolder.add(objects.model.transforms.s, 'x', -5, 5);
    scaFolder.add(objects.model.transforms.s, 'y', -5, 5);

    const pivotFolder = gui.addFolder('Pivot');
    pivotFolder.add(objects.model.transforms.pivot, 'x', -1, 1);
    pivotFolder.add(objects.model.transforms.pivot, 'y', -1, 1);
    // pivotFolder.addColor(objects.model.transforms.pivot, 'color')
}

main()