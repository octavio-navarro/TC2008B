/* 2d-lib.test.js
 * Based on a test set generated with Grok
 *
 * Gilberto Echeverria
 * 2025-11-02
 */

"use strict";

import { ok, strictEqual } from "assert";
import { V2, M3 } from "../libs/2d-lib.js";

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
/* V2 tests                                                       */
/* --------------------------------------------------------------- */
describe('V2', () => {
    /* ----- basic functionality (kept from original) ----- */
    describe('create', () => {
        it('creates vector with given components', () => {
            const v = V2.create(2, 3);
            arraysAlmostEqual(v, new Float32Array([2, 3]), 'create');
        });
    });

    describe('add / subtract', () => {
        it('adds two vectors', () => {
            const a = V2.create(2, 3);
            const b = V2.create(5, 6);
            const s = V2.add(a, b);
            arraysAlmostEqual(s, new Float32Array([7, 9]), 'add');
        });
        it('subtracts two vectors', () => {
            const a = V2.create(2, 3);
            const b = V2.create(5, 6);
            const d = V2.subtract(a, b);
            arraysAlmostEqual(d, new Float32Array([-3, -3]), 'subtract');
        });
    });
});

/* --------------------------------------------------------------- */
/* M3 tests                                                       */
/* --------------------------------------------------------------- */
describe('M3', () => {
    /* ----- basic functionality (kept from original) ----- */
    describe('identity', () => {
        it('returns identity matrix', () => {
            const id = M3.identity();
            const exp = new Float32Array([1,0,0,0,1,0,0,0,1]);
            arraysAlmostEqual(id, exp, 'identity');
        });
    });

    describe('translation', () => {
        it('creates translation matrix', () => {
            const t = M3.translation(V2.create(5, -2));
            const exp = new Float32Array([1,0,0,0,1,0,5,-2,1]);
            arraysAlmostEqual(t, exp, 'translation');
        });
    });

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

        describe('rotationZ', () => {
            angles.forEach(({ deg, rad }) => {
                it(`Z rotation ${deg}°`, () => {
                    const m = M3.rotation(rad);
                    const c = Math.cos(rad);
                    const s = Math.sin(rad);
                    const expected = new Float32Array([
                        c,  s, 0,
                        -s,  c, 0,
                        0,  0, 1,
                    ]);
                    arraysAlmostEqual(m, expected, `rotZ ${deg}°`);
                });
            });
        });
    });

    describe('scale', () => {
        it('creates scale matrix', () => {
            const s = M3.scale(V2.create(2, 4));
            const exp = new Float32Array([2,0,0,0,4,0,0,0,1]);
            arraysAlmostEqual(s, exp, 'scale');
        });
    });

    describe('multiply', () => {
        it('identity × translation = translation', () => {
            const id = M3.identity();
            const tr = M3.translation(V2.create(2, 3));
            const res = M3.multiply(id, tr);
            arraysAlmostEqual(res, tr, 'id × tr');
        });
        it('translation × identity = translation', () => {
            const id = M3.identity();
            const tr = M3.translation(V2.create(2, 3));
            const res = M3.multiply(tr, id);
            arraysAlmostEqual(res, tr, 'tr × id');
        });
    });

    describe('composite transformations', () => {
        describe('Translation × Rotation × Scale (TRS)', () => {
            it('applies scale → rotate → translate in correct order', () => {
                const scale = M3.scale(V2.create(2, 3));
                const rotY = M3.rotation(Math.PI / 2);  // 90°
                const trans = M3.translation(V2.create(7, 0));

                // Model = T × R × S
                const model = M3.multiply(M3.multiply(trans, rotY), scale);

                // Apply to point (1, 0)
                const point = new Float32Array([1, 0, 1]);
                const result = [];
                for (let i = 0; i < 3; ++i) {
                    result[i] =
                        model[i]      * point[0] +
                        model[i + 3]  * point[1] +
                        model[i + 6]  * point[2]
                }

                // Expected:
                // 1. Scale: (1,0,0) → (2,0,0)
                // 2. Rotate Z 90°: (2,0) → (0,2)
                // 3. Translate +5 X: (0,2) → (7,2)
                const expected = [7, 2, 1];
                arraysAlmostEqual(new Float32Array(result), new Float32Array(expected), 'TRS point transform');
            });

            it('matrix multiplication is associative: (T×R)×S = T×(R×S)', () => {
                const T = M3.translation(V2.create(2, 3));
                const R = M3.rotation(Math.PI / 4);
                const S = M3.scale(V2.create(2, 2));

                const left  = M3.multiply(M3.multiply(T, R), S);
                const right = M3.multiply(T, M3.multiply(R, S));

                arraysAlmostEqual(left, right, 'associativity');
            });
        });
    });
});
