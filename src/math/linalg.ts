/**
 * High-performance, zero-dependency linear algebra primitives in TypeScript.
 * Designed for transparent inspection of state vectors and weight matrices.
 */

export function createZeroVector(dim: number): number[] {
  return new Array(dim).fill(0);
}

export function createZeroMatrix(rows: number, cols: number): number[][] {
  const m: number[][] = [];
  for (let i = 0; i < rows; i++) {
    m.push(new Array(cols).fill(0));
  }
  return m;
}

export function vectorAdd(a: number[], b: number[]): number[] {
  return a.map((val, idx) => val + b[idx]);
}

export function vectorSub(a: number[], b: number[]): number[] {
  return a.map((val, idx) => val - b[idx]);
}

export function vectorScale(v: number[], s: number): number[] {
  return v.map(val => val * s);
}

export function dotProduct(a: number[], b: number[]): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += a[i] * b[i];
  }
  return sum;
}

export function vectorNorm(v: number[]): number {
  return Math.sqrt(dotProduct(v, v));
}

export function normalizeVector(v: number[]): number[] {
  const norm = vectorNorm(v);
  if (norm === 0 || isNaN(norm)) return createZeroVector(v.length);
  return v.map(val => val / norm);
}

export function cosineSimilarity(a: number[], b: number[]): number {
  const normA = vectorNorm(a);
  const normB = vectorNorm(b);
  if (normA === 0 || normB === 0) return 0;
  return dotProduct(a, b) / (normA * normB);
}

/**
 * Outer product: u * v^T results in a matrix of size dim(u) x dim(v)
 * M[i][j] = u[i] * v[j]
 */
export function outerProduct(u: number[], v: number[]): number[][] {
  const rows = u.length;
  const cols = v.length;
  const result = createZeroMatrix(rows, cols);
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      result[i][j] = u[i] * v[j];
    }
  }
  return result;
}

/**
 * Matrix-vector product: M * v results in vector of size rows(M)
 */
export function matrixVectorMultiply(M: number[][], v: number[]): number[] {
  const rows = M.length;
  const cols = v.length;
  const result = new Array(rows).fill(0);
  for (let i = 0; i < rows; i++) {
    let sum = 0;
    for (let j = 0; j < cols; j++) {
      sum += M[i][j] * v[j];
    }
    result[i] = sum;
  }
  return result;
}

export function matrixAdd(A: number[][], B: number[][]): number[][] {
  const rows = A.length;
  const cols = A[0].length;
  const result = createZeroMatrix(rows, cols);
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      result[i][j] = A[i][j] + B[i][j];
    }
  }
  return result;
}

export function matrixScale(M: number[][], s: number): number[][] {
  return M.map(row => row.map(val => val * s));
}

export function frobeniusNorm(M: number[][]): number {
  let sum = 0;
  for (let i = 0; i < M.length; i++) {
    for (let j = 0; j < M[i].length; j++) {
      sum += M[i][j] * M[i][j];
    }
  }
  return Math.sqrt(sum);
}

/**
 * Generates an orthonormal basis in R^d using Gram-Schmidt process.
 */
export function generateOrthonormalBasis(dim: number): number[][] {
  const basis: number[][] = [];
  for (let i = 0; i < dim; i++) {
    const e = createZeroVector(dim);
    e[i] = 1.0;
    basis.push(e);
  }
  return basis;
}

/**
 * Power iteration with deflation to compute top-k singular values of matrix M.
 * SVD singular values reveal the rank and spectral energy concentration.
 */
export function computeSingularValues(M: number[][], k: number = 8): number[] {
  const rows = M.length;
  const cols = M[0]?.length || 0;
  if (rows === 0 || cols === 0) return [];
  const maxK = Math.min(k, rows, cols);
  const singularValues: number[] = [];
  
  // Clone M
  let A = M.map(r => [...r]);

  for (let s = 0; s < maxK; s++) {
    // Random initial vector
    let v = normalizeVector(new Array(cols).fill(0).map((_, idx) => Math.sin(idx + s + 1)));
    let u = createZeroVector(rows);
    let sigma = 0;

    // Power iterations
    for (let iter = 0; iter < 25; iter++) {
      u = matrixVectorMultiply(A, v);
      sigma = vectorNorm(u);
      if (sigma < 1e-12) break;
      u = normalizeVector(u);

      // v = A^T * u
      const vNext = createZeroVector(cols);
      for (let j = 0; j < cols; j++) {
        let sum = 0;
        for (let i = 0; i < rows; i++) {
          sum += A[i][j] * u[i];
        }
        vNext[j] = sum;
      }
      const vNorm = vectorNorm(vNext);
      if (vNorm < 1e-12) break;
      v = normalizeVector(vNext);
    }

    singularValues.push(Number(sigma.toFixed(4)));

    // Deflation: A = A - sigma * u * v^T
    const outer = outerProduct(u, v);
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        A[i][j] -= sigma * outer[i][j];
      }
    }
  }

  return singularValues;
}
