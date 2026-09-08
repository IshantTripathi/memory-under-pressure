import { describe, it, expect } from 'vitest';
import {
  dotProduct,
  vectorNorm,
  normalizeVector,
  cosineSimilarity,
  outerProduct,
  matrixVectorMultiply,
  frobeniusNorm,
  computeSingularValues,
  generateOrthonormalBasis,
} from '../math/linalg';

describe('Linear Algebra Library', () => {
  it('computes dot product and norms correctly', () => {
    const a = [1, 2, 3];
    const b = [4, -5, 6];
    // 1*4 + 2*(-5) + 3*6 = 4 - 10 + 18 = 12
    expect(dotProduct(a, b)).toBe(12);
    expect(vectorNorm([3, 4])).toBe(5);
  });

  it('normalizes vector to unit length', () => {
    const v = [3, 4, 0];
    const u = normalizeVector(v);
    expect(u[0]).toBeCloseTo(0.6, 5);
    expect(u[1]).toBeCloseTo(0.8, 5);
    expect(vectorNorm(u)).toBeCloseTo(1.0, 5);
  });

  it('computes cosine similarity accurately', () => {
    const a = [1, 0, 0];
    const b = [0, 1, 0];
    const c = [2, 0, 0];
    expect(cosineSimilarity(a, b)).toBeCloseTo(0, 5); // orthogonal
    expect(cosineSimilarity(a, c)).toBeCloseTo(1, 5); // parallel
  });

  it('computes outer product and matrix-vector multiplication', () => {
    const u = [1, 2];
    const v = [3, 4];
    // M = u * v^T = [[3, 4], [6, 8]]
    const M = outerProduct(u, v);
    expect(M[0][0]).toBe(3);
    expect(M[0][1]).toBe(4);
    expect(M[1][0]).toBe(6);
    expect(M[1][1]).toBe(8);

    // M * v = [[3,4],[6,8]] * [3,4] = [3*3 + 4*4, 6*3 + 8*4] = [25, 50]
    const res = matrixVectorMultiply(M, v);
    expect(res[0]).toBe(25);
    expect(res[1]).toBe(50);
  });

  it('computes frobenius norm', () => {
    const M = [[3, 0], [0, 4]];
    expect(frobeniusNorm(M)).toBe(5);
  });

  it('generates orthonormal basis of requested dimension', () => {
    const basis = generateOrthonormalBasis(4);
    expect(basis.length).toBe(4);
    for (let i = 0; i < 4; i++) {
      expect(vectorNorm(basis[i])).toBe(1);
      for (let j = 0; j < 4; j++) {
        if (i !== j) {
          expect(dotProduct(basis[i], basis[j])).toBe(0);
        }
      }
    }
  });

  it('computes singular values via power iteration with deflation', () => {
    const M = [[3, 0], [0, 2]];
    const sv = computeSingularValues(M, 2);
    expect(sv[0]).toBeCloseTo(3.0, 1);
    expect(sv[1]).toBeCloseTo(2.0, 1);
  });
});
