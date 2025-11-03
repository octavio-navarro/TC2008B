/*
 * Definition of the class to store the data for a light in 3D
 *
 * Gilberto Echeverria
 * 2025-07-25
 */

import { M4 } from '../libs/3d-lib';

class Light3D {
    constructor(id,
        position=[0, 0, 0],
        ambient=[Math.random(), Math.random(), Math.random(), 1.0],
        diffuse=[Math.random(), Math.random(), Math.random(), 1.0],
        specular=[Math.random(), Math.random(), Math.random(), 1.0]) {
        this.id = id;
        // Initial transformations
        this.position = {
            x: position[0],
            y: position[1],
            z: position[2],
        };
        // Colors
        this.ambient = ambient;
        this.diffuse = diffuse;
        this.specular = specular;
        // Transformations ?? Is this necessary?
        this.matrix = M4.identity();
    }

    get posArray() {
        return [this.position.x, this.position.y, this.position.z];
    }
}

export { Light3D };
