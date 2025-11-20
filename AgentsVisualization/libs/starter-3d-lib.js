/*
 * Library file with objects and funcitions used for 3D vectors, matrices and transformations
 *
 * Gilberto Echeverria
 * 2025-07-22
 */

// Constants to simplify references to the X, Y and Z axis
const X = 0;
const Y = 1;
const Z = 2;



// Vector 3
class V3 {
    static create(x, y, z) {
        const v = new Float32Array(3);
        return v;
    }

    static length(v) {
        return 0;
    }

    static normalize(v, dest) {
        return [];
    }

    static dot(u, v) {
        return 0;
    }

    static cross(u, v, dest) {
        return [];
    }

    static add(u, v, dest) {
        return [];
    }

    static subtract(u, v, dest) {
        return [];
    }

    // Multiply a vector by a scalar
    static scale(u, s, dest) {
        return [];
    }
}

/*
// Matrix guide:
// Consider the rows and columns are transposed
a00 a01 a02 a03           b00 b01 b02 b03
a10 a11 a12 a13           b10 b11 b12 b13
a20 a21 a22 a23           b20 b21 b22 b23
a30 a31 a32 a33           b30 b31 b32 b33
*/

// 4x4 matrices used for 3D transformations
class M4 {
    static multiply(a, b) {
        // Get the elements in the matrix
        let a00 = a[0 * 4 + 0];
        let a01 = a[0 * 4 + 1];
        let a02 = a[0 * 4 + 2];
        let a03 = a[0 * 4 + 3];
        let a10 = a[1 * 4 + 0];
        let a11 = a[1 * 4 + 1];
        let a12 = a[1 * 4 + 2];
        let a13 = a[1 * 4 + 3];
        let a20 = a[2 * 4 + 0];
        let a21 = a[2 * 4 + 1];
        let a22 = a[2 * 4 + 2];
        let a23 = a[2 * 4 + 3];
        let a30 = a[3 * 4 + 0];
        let a31 = a[3 * 4 + 1];
        let a32 = a[3 * 4 + 2];
        let a33 = a[3 * 4 + 3];

        let b00 = b[0 * 4 + 0];
        let b01 = b[0 * 4 + 1];
        let b02 = b[0 * 4 + 2];
        let b03 = b[0 * 4 + 3];
        let b10 = b[1 * 4 + 0];
        let b11 = b[1 * 4 + 1];
        let b12 = b[1 * 4 + 2];
        let b13 = b[1 * 4 + 3];
        let b20 = b[2 * 4 + 0];
        let b21 = b[2 * 4 + 1];
        let b22 = b[2 * 4 + 2];
        let b23 = b[2 * 4 + 3];
        let b30 = b[3 * 4 + 0];
        let b31 = b[3 * 4 + 1];
        let b32 = b[3 * 4 + 2];
        let b33 = b[3 * 4 + 3];

        // The matrices are oriented transposed,
        // so the multiplication must be adjusted accordingly
        return [
        ];
    }

    static identity() {
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]
    }

    static translation(v) {
        return [];
    }

    static rotationX(angleRadians) {
        return [];
    }

    static rotationY(angleRadians) {
        return [];
    }

    static rotationZ(angleRadians) {
        return [];
    }

    static scale(v) {
        return [];
    }

    /**
     * Takes the transpose of a matrix.
     * @param {m4} m The matrix.
     * @param {m4} [dst] matrix to hold result. If not passed a new one is created.
     * @return {m4} The transpose of m.
     */
    static transpose(m, dst) {
        dst = dst || new Float32Array(16);
        if (dst === m) {
            let t;

            t = m[1];
            m[1] = m[4];
            m[4] = t;

            t = m[2];
            m[2] = m[8];
            m[8] = t;

            t = m[3];
            m[3] = m[12];
            m[12] = t;

            t = m[6];
            m[6] = m[9];
            m[9] = t;

            t = m[7];
            m[7] = m[13];
            m[13] = t;

            t = m[11];
            m[11] = m[14];
            m[14] = t;
            return dst;
        }

        const m00 = m[0 * 4 + 0];
        const m01 = m[0 * 4 + 1];
        const m02 = m[0 * 4 + 2];
        const m03 = m[0 * 4 + 3];
        const m10 = m[1 * 4 + 0];
        const m11 = m[1 * 4 + 1];
        const m12 = m[1 * 4 + 2];
        const m13 = m[1 * 4 + 3];
        const m20 = m[2 * 4 + 0];
        const m21 = m[2 * 4 + 1];
        const m22 = m[2 * 4 + 2];
        const m23 = m[2 * 4 + 3];
        const m30 = m[3 * 4 + 0];
        const m31 = m[3 * 4 + 1];
        const m32 = m[3 * 4 + 2];
        const m33 = m[3 * 4 + 3];

        dst[ 0] = m00;
        dst[ 1] = m10;
        dst[ 2] = m20;
        dst[ 3] = m30;
        dst[ 4] = m01;
        dst[ 5] = m11;
        dst[ 6] = m21;
        dst[ 7] = m31;
        dst[ 8] = m02;
        dst[ 9] = m12;
        dst[10] = m22;
        dst[11] = m32;
        dst[12] = m03;
        dst[13] = m13;
        dst[14] = m23;
        dst[15] = m33;

        return dst;
    }


    /**
     * Computes the inverse of a 4-by-4 matrix.
     * @param {m4} m The matrix.
     * @param {m4} [dst] matrix to hold result. If not passed a new one is created.
     * @return {m4} The inverse of m.
     */
    static inverse(m, dst) {
        dst = dst || new Float32Array(16);

        const m00 = m[0 * 4 + 0];
        const m01 = m[0 * 4 + 1];
        const m02 = m[0 * 4 + 2];
        const m03 = m[0 * 4 + 3];
        const m10 = m[1 * 4 + 0];
        const m11 = m[1 * 4 + 1];
        const m12 = m[1 * 4 + 2];
        const m13 = m[1 * 4 + 3];
        const m20 = m[2 * 4 + 0];
        const m21 = m[2 * 4 + 1];
        const m22 = m[2 * 4 + 2];
        const m23 = m[2 * 4 + 3];
        const m30 = m[3 * 4 + 0];
        const m31 = m[3 * 4 + 1];
        const m32 = m[3 * 4 + 2];
        const m33 = m[3 * 4 + 3];
        const tmp_0  = m22 * m33;
        const tmp_1  = m32 * m23;
        const tmp_2  = m12 * m33;
        const tmp_3  = m32 * m13;
        const tmp_4  = m12 * m23;
        const tmp_5  = m22 * m13;
        const tmp_6  = m02 * m33;
        const tmp_7  = m32 * m03;
        const tmp_8  = m02 * m23;
        const tmp_9  = m22 * m03;
        const tmp_10 = m02 * m13;
        const tmp_11 = m12 * m03;
        const tmp_12 = m20 * m31;
        const tmp_13 = m30 * m21;
        const tmp_14 = m10 * m31;
        const tmp_15 = m30 * m11;
        const tmp_16 = m10 * m21;
        const tmp_17 = m20 * m11;
        const tmp_18 = m00 * m31;
        const tmp_19 = m30 * m01;
        const tmp_20 = m00 * m21;
        const tmp_21 = m20 * m01;
        const tmp_22 = m00 * m11;
        const tmp_23 = m10 * m01;

        const t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
            (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
        const t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
            (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
        const t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
            (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
        const t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
            (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

        const d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

        dst[ 0] = d * t0;
        dst[ 1] = d * t1;
        dst[ 2] = d * t2;
        dst[ 3] = d * t3;
        dst[ 4] = d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
            (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30));
        dst[ 5] = d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
            (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30));
        dst[ 6] = d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
            (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30));
        dst[ 7] = d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
            (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20));
        dst[ 8] = d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
            (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33));
        dst[ 9] = d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
            (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33));
        dst[10] = d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
            (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33));
        dst[11] = d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
            (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23));
        dst[12] = d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
            (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22));
        dst[13] = d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
            (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02));
        dst[14] = d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
            (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12));
        dst[15] = d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
            (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02));

        return dst;
    }

    /**
     * Computes a 4-by-4 perspective transformation matrix given the angular height
     * of the frustum, the aspect ratio, and the near and far clipping planes.  The
     * arguments define a frustum extending in the negative z direction.  The given
     * angle is the vertical angle of the frustum, and the horizontal angle is
     * determined to produce the given aspect ratio.  The arguments near and far are
     * the distances to the near and far clipping planes.  Note that near and far
     * are not z coordinates, but rather they are distances along the negative
     * z-axis.  The matrix generated sends the viewing frustum to the unit box.
     * We assume a unit box extending from -1 to 1 in the x and y dimensions and
     * from 0 to 1 in the z dimension.
     * @param {number} fieldOfViewYInRadians The camera angle from top to bottom (in radians).
     * @param {number} aspect The aspect ratio width / height.
     * @param {number} zNear The depth (negative z coordinate)
     *     of the near clipping plane.
     * @param {number} zFar The depth (negative z coordinate)
     *     of the far clipping plane.
     * @param {m4} [dst] matrix to hold result. If not passed a new one is created.
     * @return {m4} The perspective matrix.
     */
    static perspective(fieldOfViewYInRadians, aspect, zNear, zFar, dst) {
        dst = dst || new Float32Array(16);

        const f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewYInRadians);
        const rangeInv = 1.0 / (zNear - zFar);

        dst[0]  = f / aspect;
        dst[1]  = 0;
        dst[2]  = 0;
        dst[3]  = 0;

        dst[4]  = 0;
        dst[5]  = f;
        dst[6]  = 0;
        dst[7]  = 0;

        dst[8]  = 0;
        dst[9]  = 0;
        dst[10] = (zNear + zFar) * rangeInv;
        dst[11] = -1;

        dst[12] = 0;
        dst[13] = 0;
        dst[14] = zNear * zFar * rangeInv * 2;
        dst[15] = 0;

        return dst;
    }

    /**
     * Computes a 4-by-4 orthogonal transformation matrix given the left, right,
     * bottom, and top dimensions of the near clipping plane as well as the
     * near and far clipping plane distances.
     * @param {number} left Left side of the near clipping plane viewport.
     * @param {number} right Right side of the near clipping plane viewport.
     * @param {number} bottom Bottom of the near clipping plane viewport.
     * @param {number} top Top of the near clipping plane viewport.
     * @param {number} near The depth (negative z coordinate)
     *     of the near clipping plane.
     * @param {number} far The depth (negative z coordinate)
     *     of the far clipping plane.
     * @param {m4} [dst] Output matrix. If not passed a new one is created.
     * @return {m4} The perspective matrix.
     */
    static ortho(left, right, bottom, top, near, far, dst) {
        dst = dst || new Float32Array(16);

        dst[0]  = 2 / (right - left);
        dst[1]  = 0;
        dst[2]  = 0;
        dst[3]  = 0;

        dst[4]  = 0;
        dst[5]  = 2 / (top - bottom);
        dst[6]  = 0;
        dst[7]  = 0;

        dst[8]  = 0;
        dst[9]  = 0;
        dst[10] = 2 / (near - far);
        dst[11] = 0;

        dst[12] = (right + left) / (left - right);
        dst[13] = (top + bottom) / (bottom - top);
        dst[14] = (far + near) / (near - far);
        dst[15] = 1;

        return dst;
    }

    /**
     * Computes a 4-by-4 perspective transformation matrix given the left, right,
     * top, bottom, near and far clipping planes. The arguments define a frustum
     * extending in the negative z direction. The arguments near and far are the
     * distances to the near and far clipping planes. Note that near and far are not
     * z coordinates, but rather they are distances along the negative z-axis. The
     * matrix generated sends the viewing frustum to the unit box. We assume a unit
     * box extending from -1 to 1 in the x and y dimensions and from 0 to 1 in the z
     * dimension.
     * @param {number} left The x coordinate of the left plane of the box.
     * @param {number} right The x coordinate of the right plane of the box.
     * @param {number} bottom The y coordinate of the bottom plane of the box.
     * @param {number} top The y coordinate of the right plane of the box.
     * @param {number} near The negative z coordinate of the near plane of the box.
     * @param {number} far The negative z coordinate of the far plane of the box.
     * @param {m4} [dst] Output matrix. If not passed a new one is created.
     * @return {m4} The perspective projection matrix.
     */
    static frustum(left, right, bottom, top, near, far, dst) {
        dst = dst || new Float32Array(16);

        const dx = (right - left);
        const dy = (top - bottom);
        const dz = (near - far);

        dst[ 0] = 2 * near / dx;
        dst[ 1] = 0;
        dst[ 2] = 0;
        dst[ 3] = 0;
        dst[ 4] = 0;
        dst[ 5] = 2 * near / dy;
        dst[ 6] = 0;
        dst[ 7] = 0;
        dst[ 8] = (left + right) / dx;
        dst[ 9] = (top + bottom) / dy;
        dst[10] = far / dz;
        dst[11] = -1;
        dst[12] = 0;
        dst[13] = 0;
        dst[14] = near * far / dz;
        dst[15] = 0;

        return dst;
    }

    /**
     * Computes a 4-by-4 look-at transformation.
     *
     * This is a matrix which positions the camera itself. If you want
     * a view matrix (a matrix which moves things in front of the camera)
     * take the inverse of this.
     *
     * @param {v3} eye The position of the eye.
     * @param {v3} target The position meant to be viewed.
     * @param {v3} up A vector pointing up.
     * @param {m4} [dst] matrix to hold result. If not passed a new one is created.
     * @return {m4} The look-at matrix.
     */
    static lookAt(eye, target, up, dst) {
        dst = dst || new Float32Array(16);

        let xAxis;
        let yAxis;
        let zAxis;

        xAxis = xAxis || v3.create();
        yAxis = yAxis || v3.create();
        zAxis = zAxis || v3.create();

        v3.normalize(
            v3.subtract(eye, target, zAxis), zAxis);
        v3.normalize(v3.cross(up, zAxis, xAxis), xAxis);
        v3.normalize(v3.cross(zAxis, xAxis, yAxis), yAxis);

        dst[ 0] = xAxis[0];
        dst[ 1] = xAxis[1];
        dst[ 2] = xAxis[2];
        dst[ 3] = 0;
        dst[ 4] = yAxis[0];
        dst[ 5] = yAxis[1];
        dst[ 6] = yAxis[2];
        dst[ 7] = 0;
        dst[ 8] = zAxis[0];
        dst[ 9] = zAxis[1];
        dst[10] = zAxis[2];
        dst[11] = 0;
        dst[12] = eye[0];
        dst[13] = eye[1];
        dst[14] = eye[2];
        dst[15] = 1;

        return dst;
    }
}

export { V3, M4 };
