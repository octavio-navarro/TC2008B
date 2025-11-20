/*
 * Definition of the class to store the data for 3D objects
 *
 * Gilberto Echeverria
 * 2025-07-22
 */

import * as twgl from 'twgl-base.js';

import { M4 } from '../libs/3d-lib';
import { cubeVertexColors, cubeFaceColors } from '../libs/shapes';
import { loadObj } from '../libs/obj_loader';

class Object3D {
    constructor(id,
        position=[0, 0, 0],
        rotation=[0, 0, 0],
        scale=[1, 1, 1],
        color=[Math.random(), Math.random(), Math.random(), 1.0]) {

        this.id = id;
        // Initial transformations
        this.position = {
            x: position[0],
            y: position[1],
            z: position[2],
        };
        this.rotDeg = {
            x: rotation[0],
            y: rotation[1],
            z: rotation[2],
        };
        this.rotRad = {
            x: rotation[0] * Math.PI / 180,
            y: rotation[1] * Math.PI / 180,
            z: rotation[2] * Math.PI / 180,
        };
        this.scale = {
            x: scale[0],
            y: scale[1],
            z: scale[2],
        };
        // This variabe may be used to controll all the scale factors at once
        this.s_all = scale[0];

        this.matrix = M4.identity();
        // Materials and colors
        this.color = color;
        this.shininess = 100;
        this.texture = undefined;
        // Properties for rendering in WebGL
        this.arrays = undefined;
        this.bufferInfo = undefined;
        this.vao = undefined;
    }

    setPosition(position) {
        this.position = {
            x: position[0],
            y: position[1],
            z: position[2],
        };
    }

    // Return the position as an array
    get posArray() {
        return [this.position.x, this.position.y, this.position.z];
    }

    // Return the scale as an array
    get scaArray() {
        return [this.scale.x, this.scale.y, this.scale.z];
    }

    // Set up the WebGL components for an object
    prepareVAO(gl, programInfo, objData) {
        if (objData == undefined) {
            // Using a default cube
            //this.arrays = cubeVertexColors(1);
            this.arrays = cubeFaceColors(1);
        } else {
            // Or using an obj file
            this.arrays = loadObj(objData);
        }
        this.bufferInfo = twgl.createBufferInfoFromArrays(gl, this.arrays);
        this.vao = twgl.createVAOFromBufferInfo(gl, programInfo, this.bufferInfo);
    }

    // Copy an existing vao
    // This should be used when multiple objects share the same model
    setVAO(vao) {
        this.vao = vao;
    }

};

export { Object3D };
