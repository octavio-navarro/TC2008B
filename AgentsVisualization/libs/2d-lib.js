/*
 * Utility functions for transformation matrices
 *
 * Gilberto Echeverria
 * 2024-07-12
 */

const X = 0;
const Y = 1;

// 2D vector
class V2 {
    static create(x, y) {
        const v = new Float32Array(2);
        v[0] = x;
        v[1] = y;
        return v;
    }

    static add(u, v, dest) {
        dest = dest || new Float32Array(2);
        dest[X] = u[X] + v[X];
        dest[Y] = u[Y] + v[Y];
        return dest;
    }

    static subtract(u, v, dest) {
        dest = dest || new Float32Array(2);
        dest[X] = u[X] - v[X];
        dest[Y] = u[Y] - v[Y];
        return dest;
    }

}

// 3x3 matrices used for 2D transformations
class M3 {
    static multiply(a, b) {
        // Get the elements in the matrix
        let a00 = a[0 * 3 + 0];
        let a01 = a[0 * 3 + 1];
        let a02 = a[0 * 3 + 2];
        let a10 = a[1 * 3 + 0];
        let a11 = a[1 * 3 + 1];
        let a12 = a[1 * 3 + 2];
        let a20 = a[2 * 3 + 0];
        let a21 = a[2 * 3 + 1];
        let a22 = a[2 * 3 + 2];

        let b00 = b[0 * 3 + 0];
        let b01 = b[0 * 3 + 1];
        let b02 = b[0 * 3 + 2];
        let b10 = b[1 * 3 + 0];
        let b11 = b[1 * 3 + 1];
        let b12 = b[1 * 3 + 2];
        let b20 = b[2 * 3 + 0];
        let b21 = b[2 * 3 + 1];
        let b22 = b[2 * 3 + 2];

        // The matrices are oriented transposed, so the multiplication
        // must be adjusted accordingly
        return [
            a00 * b00 + a10 * b01 + a20 * b02,
            a01 * b00 + a11 * b01 + a21 * b02,
            a02 * b00 + a12 * b01 + a22 * b02,
            a00 * b10 + a10 * b11 + a20 * b12,
            a01 * b10 + a11 * b11 + a21 * b12,
            a02 * b10 + a12 * b11 + a22 * b12,
            a00 * b20 + a10 * b21 + a20 * b22,
            a01 * b20 + a11 * b21 + a21 * b22,
            a02 * b20 + a12 * b21 + a22 * b22,
        ];
    }

    static identity() {
        return [
            1, 0, 0,
            0, 1, 0,
            0, 0, 1 ];
    }

    static translation(v) {
        const tx = v[X];
        const ty = v[Y];
        return [
             1,  0,  0,
             0,  1,  0,
            tx, ty,  1, ];
    }

    static rotation(angleRadians) {
        const c = Math.cos(angleRadians);
        const s = Math.sin(angleRadians)
        return [
             c,  s,  0,
            -s,  c,  0,
             0,  0,  1, ];
    }

    static scale(v) {
        const sx = v[X];
        const sy = v[Y];
        return [
            sx,  0,  0,
             0, sy,  0,
             0,  0,  1, ];
    }
}

/*
// Matrix guide:
// Consider the rows and columns are transposed
a00 a01 a02            b00 b01 b02
a10 a11 a12            b10 b11 b12
a20 a21 a22            b20 b21 b22
*/

export { V2, M3 };
