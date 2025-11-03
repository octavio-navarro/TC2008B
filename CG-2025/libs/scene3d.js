/*
 * Definition of the class to store the description of a scene in 3D
 *
 * Gilberto Echeverria
 * 2025-07-25
 */

class Scene3D {
    constructor() {
        this.camera = undefined;
        this.lights = [];
        this.objects = [];
    }

    setCamera(camera) {
        this.camera = camera;
    }

    addLight(light) {
        this.lights.push(light);
    }

    addObject(object) {
        this.objects.push(object);
    }
};

export { Scene3D };
