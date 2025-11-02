/*
 * Script to read a model stored in Wavefront OBJ format
 *
 * Gilberto Echeverria
 * 2025-07-29
 */


'use strict';

/*
 * Read the contents of an OBJ file received as a string
 * Return an object called arrays, with the arrays necessary to build a
 * Vertex Array Object (VAO) for WebGL.
 */
function loadObj(objString) {

    // The array with the attributes that will be passed to WebGL
    let arrays = {
        a_position: {
            numComponents: 3,
            data: [ ]
        },
        a_color: {
            numComponents: 4,
            data: [ ]
        },
        a_normal: {
            numComponents: 3,
            data: [ ]
        },
        a_texCoord: {
            numComponents: 2,
            data: [ ]
        }
    };





    //console.log("ATTRIBUTES:")
    //console.log(arrays);

    //console.log("OBJ DATA:")
    //console.log(objData);

    return arrays;
}

/*
 * Read the contents of an MTL file received as a string
 * Return an object containing all the materials described inside,
 * with their illumination attributes.
 */
function loadMtl(mtlString) {


    return /* SOMETHING */;
}

export { loadObj, loadMtl };
