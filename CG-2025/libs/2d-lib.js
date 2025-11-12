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
        let sx = vs[0];
        let sy = vs[1];
        return [
             sx,  0,  0,
             0,  sy,  0,
             0,  0,   1
        ];
    }

    static translation(vt) {
        let tx = vt[0];
        let ty = vt[1];
        return [
            1,   0,   0,
            0,   1,   0,
            tx,  ty,  1
        ];
    }

    static rotation(angleRadians) {
        const c = Math.cos(angleRadians);
        const s = Math.sin(angleRadians);
        return [
            c,  s, 0,
            -s,  c,  0,
            0,  0,  1
        ];
    }

/*
// Matrix guide:
// Consider the rows and columns are transposed
a00 a01 a02            b00 b01 b02
a10 a11 a12            b10 b11 b12
a20 a21 a22            b20 b21 b22
*/
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

        return [
        /*
        // Fila 1
        ma00 * mb00 + ma10 * mb01 + ma20 * mb02, // Col 1
        ma00 * mb10 + ma10 * mb11 + ma20 * mb12, // Col 2
        ma00 * mb20 + ma10 * m201 + ma20 * mb22, // Col 3

        // Fila 2
        ma01 * mb00 + ma11 * mb01 + ma21 * mb02, // Col 1
        ma01 * mb10 + ma11 * mb11 + ma21 * mb12, // Col 2
        ma01 * mb20 + ma11 * m201 + ma21 * mb22, // Col 3
        

        // Fila 3
        ma02 * mb00 + ma12 * mb01 + ma22 * mb02, // Col 1
        ma02 * mb10 + ma12 * mb11 + ma22 * mb12, // Col 2
        ma02 * mb20 + ma12 * m201 + ma22 * mb22, // Col 3
        */
        
        /*
        // Fila 1
        ma00 * mb00 + ma01 * mb10 + ma02 * mb20, // Columna 1
        ma00 * mb01 + ma01 * mb11 + ma02 * mb21, // Columna 2
        ma00 * mb02 + ma01 * mb12 + ma02 * mb22, // COlumna 3
        
        // Fila 2
        ma10 * mb00 + ma11 * mb10 + ma12 * mb20, // Columna 1
        ma10 * mb01 + ma11 * mb11 + ma12 * mb21, // Colmna 2
        ma10 * mb02 + ma11 * mb12 + ma12 * mb22, // Columna 3
        
        // Fila 3
        ma20 * mb00 + ma21 * mb10 + ma22 * mb20, // Columna 1
        ma20 * mb01 + ma21 * mb11 + ma22 * mb21, // Colmna 2
        ma20 * mb02 + ma21 * mb12 + ma22 * mb22 // Columna 3
        
        */
        // A cambia, B se mantiene igual
        // Fila 1
        ma00 * mb00 + ma10 * mb00 + ma20 * mb00, // Col 1
        ma01 * mb00 + ma11 * mb01 + ma21 * mb00, // Col 2
        ma02 * mb00 + ma12 * mb00 + ma22 * mb00, // Col 3

        // Fila 2
        ma00 * mb10 + ma10 * mb11 + ma20 * mb12, // Col 1
        ma01 * mb10 + ma11 * mb11 + ma21 * mb12, // Col 2
        ma02 * mb10 + ma12 * mb11 + ma22 * mb12, // Col 3

        // Fila 3
        ma00 * mb20 + ma10 * mb21 + ma20 * mb22, // Col 1
        ma01 * mb20 + ma11 * mb21 + ma21 * mb22, // Col 2
        ma02 * mb20 + ma12 * mb21 + ma22 * mb22, // Col 3

    ];
    }

}

export { V2, M3 };
