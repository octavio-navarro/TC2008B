/* 3d-lib.test.js
 * Based on a test set generated with Grok
 *
 * Gilberto Echeverria
 * 2025-10-30
 */

"use strict";

import { ok, strictEqual } from "assert";
import { V3, M4 } from "../libs/3d-lib.js";

const EPS = 1e-6;

/* --------------------------------------------------------------- */
/* Helper – compare two Float32Arrays with tolerance                */
/* --------------------------------------------------------------- */
function arraysAlmostEqual(a, b, msg) {
    strictEqual(a.length, b.length, `${msg}: length mismatch`);
    for (let i = 0; i < a.length; ++i) {
        ok(
            Math.abs(a[i] - b[i]) <= EPS,
            `${msg}: idx ${i} → ${a[i]} ≠ ${b[i]} (Δ=${Math.abs(a[i] - b[i])})`
        );
    }
}

/* --------------------------------------------------------------- */
/* V3 tests                                                       */
/* --------------------------------------------------------------- */
describe('V3', () => {
    /* ----- basic functionality (kept from original) ----- */
    describe('create', () => {
        it('creates vector with given components', () => {
            const v = V3.create(1, 2, 3);
            arraysAlmostEqual(v, new Float32Array([1, 2, 3]), 'create');
        });
    });

    describe('length', () => {
        it('computes length of (3,4,0)', () => {
            const v = V3.create(3, 4, 0);
            strictEqual(V3.length(v), 5, 'length 3-4-5');
        });
        it('returns 0 for zero vector', () => {
            const v = V3.create(0, 0, 0);
            strictEqual(V3.length(v), 0, 'zero length');
        });
    });

    describe('normalize', () => {
        it('normalizes (3,4,0)', () => {
            const v = V3.create(3, 4, 0);
            const n = V3.normalize(v);
            arraysAlmostEqual(n, new Float32Array([0.6, 0.8, 0]), 'normalize 3-4');
        });
        it('returns zero vector for zero input', () => {
            const v = V3.create(0, 0, 0);
            const n = V3.normalize(v);
            arraysAlmostEqual(n, new Float32Array([0, 0, 0]), 'normalize zero');
        });
    });

    describe('dot', () => {
        it('computes dot product', () => {
            const a = V3.create(1, 2, 3);
            const b = V3.create(4, 5, 6);
            strictEqual(V3.dot(a, b), 32, 'dot 1-2-3 • 4-5-6');
        });
    });

    describe('cross', () => {
        it('computes cross product i × j = k', () => {
            const i = V3.create(1, 0, 0);
            const j = V3.create(0, 1, 0);
            const k = V3.cross(i, j);
            arraysAlmostEqual(k, new Float32Array([0, 0, 1]), 'i × j');
        });
    });

    describe('add / subtract', () => {
        it('adds two vectors', () => {
            const a = V3.create(1, 2, 3);
            const b = V3.create(4, 5, 6);
            const s = V3.add(a, b);
            arraysAlmostEqual(s, new Float32Array([5, 7, 9]), 'add');
        });
        it('subtracts two vectors', () => {
            const a = V3.create(1, 2, 3);
            const b = V3.create(4, 5, 6);
            const d = V3.subtract(a, b);
            arraysAlmostEqual(d, new Float32Array([-3, -3, -3]), 'subtract');
        });
    });

    /* ==================== EDGE CASES ==================== */
    describe('/* EDGE CASES */', () => {
        it('create with NaN components → NaN vector', () => {
            const v = V3.create(NaN, 1, 2);
            ok(Number.isNaN(v[0]), 'NaN component preserved');
        });

        it('length of vector with NaN → NaN', () => {
            const v = V3.create(NaN, 3, 4);
            ok(Number.isNaN(V3.length(v)), 'length with NaN');
        });

        it('normalize of tiny vector (near under-flow)', () => {
            const v = V3.create(1e-20, 0, 0);
            const n = V3.normalize(v);
            // length ≈ 1e-20, division gives ≈ 1 (but may under-flow to 0)
            const len = V3.length(n);
            ok(len === 0 || Math.abs(len - 1) < EPS, 'tiny vector normalize');
        });

        it('normalize of extremely large vector (overflow guard)', () => {
            const v = V3.create(1e200, 0, 0);
            const n = V3.normalize(v);
            const len = V3.length(n);
            ok(len === 1 || Number.isNaN(len), 'huge vector normalize');
        });

        it('dot with opposite unit vectors → -1', () => {
            const a = V3.create(1, 0, 0);
            const b = V3.create(-1, 0, 0);
            strictEqual(V3.dot(a, b), -1, 'opposite unit dot');
        });

        it('cross of parallel vectors → zero vector', () => {
            const a = V3.create(2, 3, 4);
            const b = V3.create(4, 6, 8);
            const c = V3.cross(a, b);
            arraysAlmostEqual(c, new Float32Array([0, 0, 0]), 'parallel cross');
        });

        it('add with destination buffer reuse', () => {
            const a = V3.create(1, 2, 3);
            const b = V3.create(4, 5, 6);
            const dest = new Float32Array(3);
            const result = V3.add(a, b, dest);
            strictEqual(result, dest, 'dest reuse');
            arraysAlmostEqual(dest, new Float32Array([5, 7, 9]), 'add reuse');
        });

        it('subtract with destination buffer reuse', () => {
            const a = V3.create(1, 2, 3);
            const b = V3.create(4, 5, 6);
            const dest = new Float32Array(3);
            const result = V3.subtract(a, b, dest);
            strictEqual(result, dest, 'dest reuse');
            arraysAlmostEqual(dest, new Float32Array([-3, -3, -3]), 'subtract reuse');
        });
    });
});

/* --------------------------------------------------------------- */
/* M4 tests                                                       */
/* --------------------------------------------------------------- */
describe('M4', () => {
    /* ----- basic functionality (kept from original) ----- */
    describe('identity', () => {
        it('returns identity matrix', () => {
            const id = M4.identity();
            const exp = new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);
            arraysAlmostEqual(id, exp, 'identity');
        });
    });

    describe('translation', () => {
        it('creates translation matrix', () => {
            const t = M4.translation(V3.create(5, -2, 3));
            const exp = new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,5,-2,3,1]);
            arraysAlmostEqual(t, exp, 'translation');
        });
    });

    /*
    describe('rotationX/Y/Z', () => {
        it('rotationX 90°', () => {
            const r = M4.rotationX(Math.PI/2);
            const exp = new Float32Array([1,0,0,0,0,0,1,0,0,-1,0,0,0,0,0,1]);
            arraysAlmostEqual(r, exp, 'rotX 90°');
        });
        it('rotationY 90°', () => {
            const r = M4.rotationY(Math.PI/2);
            const exp = new Float32Array([0,0,-1,0,0,1,0,0,1,0,0,0,0,0,0,1]);
            arraysAlmostEqual(r, exp, 'rotY 90°');
        });
        it('rotationZ 90°', () => {
            const r = M4.rotationZ(Math.PI/2);
            const exp = new Float32Array([0,1,0,0,-1,0,0,0,0,0,1,0,0,0,0,1]);
            arraysAlmostEqual(r, exp, 'rotZ 90°');
        });
    });
    */

    describe('rotation (Multiple Angles)', () => {
        const angles = [
            { deg: 0,    rad: 0 },
            { deg: 45,   rad: Math.PI / 4 },
            { deg: 90,   rad: Math.PI / 2 },
            { deg: 180,  rad: Math.PI },
            { deg: 270,  rad: 3 * Math.PI / 2 },
            { deg: 360,  rad: 2 * Math.PI },
            { deg: -45,  rad: -Math.PI / 4 },
            { deg: -90,  rad: -Math.PI / 2 },
        ];

        describe('rotationX', () => {
            angles.forEach(({ deg, rad }) => {
                it(`X rotation ${deg}°`, () => {
                    const m = M4.rotationX(rad);
                    const c = Math.cos(rad);
                    const s = Math.sin(rad);
                    const expected = new Float32Array([
                        1,  0,  0, 0,
                        0,  c,  s, 0,
                        0, -s,  c, 0,
                        0,  0,  0, 1
                    ]);
                    arraysAlmostEqual(m, expected, `rotX ${deg}°`);
                });
            });
        });

        describe('rotationY', () => {
            angles.forEach(({ deg, rad }) => {
                it(`Y rotation ${deg}°`, () => {
                    const m = M4.rotationY(rad);
                    const c = Math.cos(rad);
                    const s = Math.sin(rad);
                    const expected = new Float32Array([
                        c, 0, -s, 0,
                        0, 1,  0, 0,
                        s, 0,  c, 0,
                        0, 0,  0, 1
                    ]);
                    arraysAlmostEqual(m, expected, `rotY ${deg}°`);
                });
            });
        });

        describe('rotationZ', () => {
            angles.forEach(({ deg, rad }) => {
                it(`Z rotation ${deg}°`, () => {
                    const m = M4.rotationZ(rad);
                    const c = Math.cos(rad);
                    const s = Math.sin(rad);
                    const expected = new Float32Array([
                        c,  s, 0, 0,
                        -s,  c, 0, 0,
                        0,  0, 1, 0,
                        0,  0, 0, 1
                    ]);
                    arraysAlmostEqual(m, expected, `rotZ ${deg}°`);
                });
            });
        });
    });

    describe('scale', () => {
        it('creates scale matrix', () => {
            const s = M4.scale(V3.create(2, 3, 4));
            const exp = new Float32Array([2,0,0,0,0,3,0,0,0,0,4,0,0,0,0,1]);
            arraysAlmostEqual(s, exp, 'scale');
        });
    });

    describe('multiply', () => {
        it('identity × translation = translation', () => {
            const id = M4.identity();
            const tr = M4.translation(V3.create(1, 2, 3));
            const res = M4.multiply(id, tr);
            arraysAlmostEqual(res, tr, 'id × tr');
        });
        it('translation × identity = translation', () => {
            const id = M4.identity();
            const tr = M4.translation(V3.create(1, 2, 3));
            const res = M4.multiply(tr, id);
            arraysAlmostEqual(res, tr, 'tr × id');
        });
    });

    describe('composite transformations', () => {
        describe('Translation × Rotation × Scale (TRS)', () => {
            it('applies scale → rotate → translate in correct order', () => {
                const scale = M4.scale(V3.create(2, 3, 1));
                const rotY = M4.rotationY(Math.PI / 2);  // 90°
                const trans = M4.translation(V3.create(5, 0, 0));

                // Model = T × R × S
                const model = M4.multiply(M4.multiply(trans, rotY), scale);

                // Apply to point (1, 0, 0)
                const point = new Float32Array([1, 0, 0, 1]);
                const result = [];
                for (let i = 0; i < 4; ++i) {
                    result[i] =
                        model[i]      * point[0] +
                        model[i + 4]  * point[1] +
                        model[i + 8]  * point[2] +
                        model[i + 12] * point[3];
                }

                // Expected:
                // 1. Scale: (1,0,0) → (2,0,0)
                // 2. Rotate Y 90°: (2,0,0) → (0,0,-2)
                // 3. Translate +5 X: (0,0,-2) → (5,0,-2)
                const expected = [5, 0, -2, 1];
                arraysAlmostEqual(new Float32Array(result), new Float32Array(expected), 'TRS point transform');
            });

            it('matrix multiplication is associative: (T×R)×S = T×(R×S)', () => {
                const T = M4.translation(V3.create(1, 2, 3));
                const R = M4.rotationZ(Math.PI / 4);
                const S = M4.scale(V3.create(2, 2, 2));

                const left  = M4.multiply(M4.multiply(T, R), S);
                const right = M4.multiply(T, M4.multiply(R, S));

                arraysAlmostEqual(left, right, 'associativity');
            });
        });

        describe('Full Rendering Pipeline: Perspective × View × Model', () => {
            it('combines perspective, camera, and model correctly', () => {
                // Model: scale → rotate → translate
                const S = M4.scale(V3.create(1, 1, 1));
                const R = M4.rotationY(Math.PI / 4);
                const T = M4.translation(V3.create(0, 0, -5));
                const model = M4.multiply(M4.multiply(T, R), S);

                // View: look from (0,0,5) to (0,0,0)
                const eye = V3.create(0, 0, 5);
                const target = V3.create(0, 0, 0);
                const up = V3.create(0, 1, 0);
                const view = M4.lookAt(eye, target, up);
                const invView = M4.inverse(view);  // camera-to-world

                // Projection
                const proj = M4.perspective(Math.PI / 3, 1, 0.1, 100);

                // Final MVP = P × V⁻¹ × M
                const mvp = M4.multiply(M4.multiply(proj, invView), model);

                // Test point (1,0,0) in model space
                const point = new Float32Array([1, 0, 0, 1]);
                const clip = [];
                for (let i = 0; i < 4; ++i) {
                    clip[i] =
                        mvp[i]      * point[0] +
                        mvp[i + 4]  * point[1] +
                        mvp[i + 8]  * point[2] +
                        mvp[i + 12] * point[3];
                }

                // After perspective divide: clip / w
                const ndc = clip.map((v, i) => i < 3 ? v / clip[3] : v);

                // Expected NDC range: [-1,1]
                ok(ndc[0] >= -1 && ndc[0] <= 1, 'NDC X in range');
                ok(ndc[1] >= -1 && ndc[1] <= 1, 'NDC Y in range');
                ok(ndc[2] >= -1 && ndc[2] <= 1, 'NDC Z in range');
            });
        });
    });

    /* ==================== EDGE CASES ==================== */
    describe('/* EDGE CASES */', () => {
        it('multiply with NaN entries → NaN result', () => {
            const a = M4.identity();
            a[0] = NaN;
            const b = M4.identity();
            const c = M4.multiply(a, b);
            ok(Number.isNaN(c[0]), 'multiply propagates NaN');
        });

        /*
        it('translation with huge values (no overflow in Float32)', () => {
            const huge = V3.create(1e30, -1e30, 0);
            const m = M4.translation(huge);
            strictEqual(m[12], 1e30, 'translation huge X');
            strictEqual(m[13], -1e30, 'translation huge Y');
        });
        */

        it('rotation with 0 radians → identity', () => {
            const r = M4.rotationX(0);
            arraysAlmostEqual(r, M4.identity(), 'rot 0 rad');
        });

        it('rotation with 2π radians → identity', () => {
            const r = M4.rotationY(2 * Math.PI);
            arraysAlmostEqual(r, M4.identity(), 'rot 2π rad');
        });

        it('scale with zero factor → collapse to plane/line/point', () => {
            const s = M4.scale(V3.create(0, 1, 1));
            const exp = new Float32Array([0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);
            arraysAlmostEqual(s, exp, 'scale zero X');
        });

        it('scale with negative factors (reflection)', () => {
            const s = M4.scale(V3.create(-1, 1, 1));
            const exp = new Float32Array([-1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);
            arraysAlmostEqual(s, exp, 'scale negative X');
        });

        it('transpose of identity = identity', () => {
            const id = M4.identity();
            const t = M4.transpose(id);
            arraysAlmostEqual(t, id, 'transpose identity');
        });

        it('transpose in-place works', () => {
            const m = new Float32Array([
                1,2,3,4,
                5,6,7,8,
                9,10,11,12,
                13,14,15,16
            ]);
            const copy = m.slice();
            M4.transpose(m, m);               // in-place
            const expected = new Float32Array([
                1,5,9,13,
                2,6,10,14,
                3,7,11,15,
                4,8,12,16
            ]);
            arraysAlmostEqual(m, expected, 'transpose in-place');
            // original copy unchanged
            arraysAlmostEqual(copy, new Float32Array([
                1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16
            ]), 'original unchanged');
        });

        it('inverse of singular matrix (zero scale) → NaN/Inf', () => {
            const s = M4.scale(V3.create(0, 1, 1));
            const inv = M4.inverse(s);
            ok(!Number.isFinite(inv[0]), 'inverse singular → non-finite');
        });

        it('inverse of translation matrix', () => {
            const t = M4.translation(V3.create(5, -3, 2));
            const inv = M4.inverse(t);
            const expected = M4.translation(V3.create(-5, 3, -2));
            arraysAlmostEqual(inv, expected, 'inverse translation');
        });

        /*
        it('perspective with near == far → division by zero → NaN', () => {
            const p = M4.perspective(Math.PI/3, 1, 5, 5);
            ok(Number.isNaN(p[10]), 'perspective near==far');
        });
        */

        it('perspective with negative near/far (invalid but defined)', () => {
            const p = M4.perspective(Math.PI/3, 1, -1, -10);
            // library treats them as distances along -z, so it still works
            ok(Number.isFinite(p[0]), 'perspective negative depths');
        });

        it('ortho with left == right → division by zero', () => {
            const o = M4.ortho(1, 1, -1, 1, -1, 1);
            ok(!Number.isFinite(o[0]), 'ortho left==right');
        });

        it('frustum with near == far → division by zero', () => {
            const f = M4.frustum(-1, 1, -1, 1, 5, 5);
            ok(!Number.isFinite(f[10]), 'frustum near==far');
        });

        it('lookAt with eye == target → zero z-axis (handled by normalize → zero vector)', () => {
            const eye = V3.create(1, 1, 1);
            const target = V3.create(1, 1, 1);
            const up = V3.create(0, 1, 0);
            const m = M4.lookAt(eye, target, up);
            // z-axis becomes [0,0,0]; library normalises to zero → identity rotation part
            const rotPart = m.slice(0, 12);
            arraysAlmostEqual(rotPart, new Float32Array(12).fill(0), 'lookAt eye==target rotation');
            strictEqual(m[12], 1, 'translation X');
            strictEqual(m[13], 1, 'translation Y');
            strictEqual(m[14], 1, 'translation Z');
        });

        /*
        it('lookAt with up parallel to view direction → cross product zero', () => {
            const eye = V3.create(0, 0, 5);
            const target = V3.create(0, 0, 0);
            const up = V3.create(0, 0, -1); // parallel to view
            const m = M4.lookAt(eye, target, up);
            // library normalises zero vectors → rotation part becomes identity
            const rot = m.slice(0, 12);
            arraysAlmostEqual(rot, new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0]), 'lookAt up parallel');
        });
        */

        it('multiply chain: T × R × S × point should match manual composition', () => {
            const trans = M4.translation(V3.create(10, 0, 0));
            const rot   = M4.rotationY(Math.PI / 2);
            const scale = M4.scale(V3.create(2, 2, 2));

            const trs = M4.multiply(M4.multiply(trans, rot), scale);
            const point = new Float32Array([1, 0, 0, 1]); // homogeneous
            const transformed = [];
            // manual matrix-vector multiply
            for (let i = 0; i < 4; ++i) {
                transformed[i] = trs[i]*point[0] + trs[i+4]*point[1] + trs[i+8]*point[2] + trs[i+12]*point[3];
            }
            // expected: scale(2) → (2,0,0) → rotate 90° Y → (0,0,-2) → translate +10 X → (10,0,-2)
            const expected = [10, 0, -2, 1];
            for (let i = 0; i < 4; ++i) {
                ok(Math.abs(transformed[i] - expected[i]) <= EPS,
                    `chain multiply point[${i}]: ${transformed[i]} vs ${expected[i]}`);
            }
        });
    });

    describe('Edge Cases in Composite Transforms', () => {
        it('zero scale collapses geometry', () => {
            const S = M4.scale(V3.create(0, 0, 0));
            const T = M4.translation(V3.create(10, 20, 30));
            const model = M4.multiply(T, S);

            const point = new Float32Array([5, 5, 5, 1]);
            const result = [];
            for (let i = 0; i < 4; ++i) {
                result[i] =
                    model[i]      * point[0] +
                    model[i + 4]  * point[1] +
                    model[i + 8]  * point[2] +
                    model[i + 12] * point[3];
            }
            // Should be at translation origin: (10,20,30,1)
            arraysAlmostEqual(new Float32Array(result), new Float32Array([10, 20, 30, 1]), 'zero scale');
        });

        it('identity in chain does nothing', () => {
            const T = M4.translation(V3.create(1, 2, 3));
            const I = M4.identity();
            const result1 = M4.multiply(T, I);
            const result2 = M4.multiply(I, T);
            arraysAlmostEqual(result1, T, 'T × I');
            arraysAlmostEqual(result2, T, 'I × T');
        });

        it('inverse of TRS restores original point', () => {
            const S = M4.scale(V3.create(2, 3, 4));
            const R = M4.rotationX(Math.PI / 2);
            const T = M4.translation(V3.create(5, -2, 1));
            const model = M4.multiply(M4.multiply(T, R), S);
            const inv = M4.inverse(model);

            const point = new Float32Array([1, 1, 1, 1]);
            const forward = [];
            const back = [];

            // Forward
            for (let i = 0; i < 4; ++i) {
                forward[i] =
                    model[i]      * point[0] +
                    model[i + 4]  * point[1] +
                    model[i + 8]  * point[2] +
                    model[i + 12] * point[3];
            }

            // Backward
            for (let i = 0; i < 4; ++i) {
                back[i] =
                    inv[i]      * forward[0] +
                    inv[i + 4]  * forward[1] +
                    inv[i + 8]  * forward[2] +
                    inv[i + 12] * forward[3];
            }

            arraysAlmostEqual(new Float32Array(back), point, 'inverse TRS');
        });

        /*
        it('perspective with near=far → invalid (NaN)', () => {
            const p = M4.perspective(Math.PI / 3, 1, 5, 5);
            ok(Number.isNaN(p[10]), 'perspective near==far → NaN');
        });
        */
    });
});
