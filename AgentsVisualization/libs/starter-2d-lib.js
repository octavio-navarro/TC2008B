/*
 * Functions for 2D transformations
 *
 * Gilberto Echeverria
 * 2024-11-04
 */

class V2 {
    static create(px, py) {
        let v = new Float32Array(2);
        v[0] = px;
        v[1] = py;
        return v;
    }
}


class M3 {
    static identity() {
        let m = new Float32Array(9);
        m[0] = 1;
        m[1] = 0;
        m[2] = 0;
        m[3] = 0;
        m[4] = 1;
        m[5] = 0;
        m[6] = 0;
        m[7] = 0;
        m[8] = 1;
        return m;
    }

    static scale(vs) {
        return [
             1,  0,  0,
             0,  1,  0,
             0,  0,  1 ];
    }

    static translation(vt) {
       return [
             1,  0,  0,
             0,  1,  0,
             0,  0,  1 ];
    }

    static rotation(angleRadians) {
        return [
             1,  0,  0,
             0,  1,  0,
             0,  0,  1 ];
    }

    static multiply(ma, mb) {
        // Get individual elements of the matrices
        const ma00 = ma[0 * 3 + 0];
        const ma01 = ma[0 * 3 + 1];
        const ma02 = ma[0 * 3 + 2];
        const ma10 = ma[1 * 3 + 0];
        const ma11 = ma[1 * 3 + 1];
        const ma12 = ma[1 * 3 + 2];
        const ma20 = ma[2 * 3 + 0];
        const ma21 = ma[2 * 3 + 1];
        const ma22 = ma[2 * 3 + 2];

        const mb00 = mb[0 * 3 + 0];
        const mb01 = mb[0 * 3 + 1];
        const mb02 = mb[0 * 3 + 2];
        const mb10 = mb[1 * 3 + 0];
        const mb11 = mb[1 * 3 + 1];
        const mb12 = mb[1 * 3 + 2];
        const mb20 = mb[2 * 3 + 0];
        const mb21 = mb[2 * 3 + 1];
        const mb22 = mb[2 * 3 + 2];

/*
// Matrix guide:
// Consider the rows and columns are transposed
a00 a01 a02            b00 b01 b02
a10 a11 a12            b10 b11 b12
a20 a21 a22            b20 b21 b22
*/
        return [
             1,  0,  0,
             0,  1,  0,
             0,  0,  1 ];
    }

}

export { V2, M3 };
