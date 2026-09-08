import {
  createZeroMatrix,
  createZeroVector,
  matrixAdd,
  matrixScale,
  matrixVectorMultiply,
  outerProduct,
  frobeniusNorm,
  computeSingularValues,
  cosineSimilarity,
  vectorNorm,
  vectorScale,
  normalizeVector,
} from './linalg';
import type { AssociativeState, Fact, RetrievalResult } from '../types/memory';

/**
 * Initialize an empty fixed-size associative state in R^{d x d}.
 */
export function initAssociativeState(
  dimension: number = 8,
  decay: number = 1.0,
  learningRate: number = 1.0
): AssociativeState {
  return {
    dimension,
    matrix: createZeroMatrix(dimension, dimension),
    hiddenVector: createZeroVector(dimension),
    step: 0,
    decay,
    learningRate,
    frobeniusNorm: 0,
    singularValues: new Array(Math.min(8, dimension)).fill(0),
    energyRatio: 0,
  };
}

/**
 * Apply state update s_t = update(s_{t-1}, x_t).
 * Supports standard Hebbian outer product, Delta rule, and BDH-inspired synaptic plasticity.
 */
export function updateAssociativeState(
  currentState: AssociativeState,
  keyVector: number[],
  valueVector: number[],
  method: 'hebbian' | 'delta' | 'bdh_synaptic' = 'hebbian'
): AssociativeState {
  const d = currentState.dimension;
  const lambda = currentState.decay;
  const eta = currentState.learningRate;

  let newMatrix: number[][];

  if (method === 'delta') {
    // Delta rule (Widrow-Hoff / associative correction):
    // S_t = S_{t-1} + eta * (v_t - S_{t-1} * k_t) * k_t^T
    const predicted = matrixVectorMultiply(currentState.matrix, keyVector);
    const error = valueVector.map((val, i) => val - predicted[i]);
    const update = outerProduct(error, keyVector);
    newMatrix = matrixAdd(
      matrixScale(currentState.matrix, lambda),
      matrixScale(update, eta)
    );
  } else if (method === 'bdh_synaptic') {
    // BDH-inspired Synaptic Plasticity:
    // Uses Q=K Hebbian correlation with sparse positive activations (ReLU firing)
    // S_t = lambda * S_{t-1} + eta * ReLU(k_t) * ReLU(k_t)^T
    const sparseK = keyVector.map(x => Math.max(0, x));
    const sparseV = valueVector.map(x => Math.max(0, x));
    const update = outerProduct(sparseV, sparseK);
    newMatrix = matrixAdd(
      matrixScale(currentState.matrix, lambda),
      matrixScale(update, eta)
    );
  } else {
    // Standard Hebbian Outer-Product update:
    // S_t = lambda * S_{t-1} + eta * (v_t * k_t^T)
    const update = outerProduct(valueVector, keyVector);
    newMatrix = matrixAdd(
      matrixScale(currentState.matrix, lambda),
      matrixScale(update, eta)
    );
  }

  // Recurrent hidden vector update: h_t = tanh(lambda * h_{t-1} + x_t)
  const newHidden = currentState.hiddenVector.map((h, i) => {
    const inputSignal = (keyVector[i] || 0) + (valueVector[i] || 0);
    return Math.tanh(lambda * h + eta * inputSignal);
  });

  const fNorm = frobeniusNorm(newMatrix);
  const singularValues = computeSingularValues(newMatrix, Math.min(8, d));
  const totalEnergy = singularValues.reduce((sum, s) => sum + s * s, 0);
  const topEnergy = (singularValues[0] || 0) * (singularValues[0] || 0);
  const energyRatio = totalEnergy > 0 ? topEnergy / totalEnergy : 0;

  return {
    dimension: d,
    matrix: newMatrix,
    hiddenVector: newHidden,
    step: currentState.step + 1,
    decay: lambda,
    learningRate: eta,
    frobeniusNorm: Number(fNorm.toFixed(4)),
    singularValues,
    energyRatio: Number(energyRatio.toFixed(4)),
  };
}

/**
 * Query the associative state matrix S_t with probe key q.
 * Retrieves predicted vector v_hat = S_t * q and isolates exact signal vs interference noise.
 */
export function queryAssociativeMemory(
  state: AssociativeState,
  queryKeyVector: number[],
  targetKey: string,
  history: Fact[],
  vocabulary: Array<{ value: string; vector: number[] }>
): RetrievalResult {
  const d = state.dimension;
  // Raw associative retrieval: v_hat = S_t * q
  const retrievedVector = matrixVectorMultiply(state.matrix, queryKeyVector);

  // Find the most recent ground truth fact matching targetKey
  const targetFact = [...history].reverse().find(f => f.key === targetKey);
  const expectedValue = targetFact ? targetFact.value : 'UNKNOWN';

  // Decompose into Signal vs Cross-Talk Noise
  // Theoretical signal: S_signal = lambda^(t - t_target) * (k_target^T * q) * v_target
  let signalVector = createZeroVector(d);
  if (targetFact) {
    const stepsAgo = state.step - targetFact.step;
    const decayWeight = Math.pow(state.decay, Math.max(0, stepsAgo));
    const alignment = queryKeyVector.reduce((sum, qVal, idx) => sum + qVal * targetFact.keyVector[idx], 0);
    signalVector = vectorScale(targetFact.valueVector, decayWeight * alignment);
  }

  // Cross-talk noise vector is the difference between total retrieved vector and target signal
  const noiseVector = retrievedVector.map((val, idx) => val - signalVector[idx]);

  const sigNorm = vectorNorm(signalVector);
  const noiseNorm = vectorNorm(noiseVector);

  // Exact SNR in decibels: 10 * log10(||signal||^2 / (||noise||^2 + epsilon))
  const eps = 1e-9;
  const snrLinear = (sigNorm * sigNorm) / (noiseNorm * noiseNorm + eps);
  const snrDb = Number((10 * Math.log10(Math.max(1e-4, snrLinear))).toFixed(2));

  // Match against vocabulary candidates via cosine similarity
  const normalizedRetrieved = normalizeVector(retrievedVector);
  const candidateScores = vocabulary.map(cand => {
    const sim = cosineSimilarity(normalizedRetrieved, cand.vector);
    return {
      value: cand.value,
      similarity: Number(sim.toFixed(4)),
    };
  }).sort((a, b) => b.similarity - a.similarity);

  const topCandidate = candidateScores[0] || { value: 'None', similarity: 0 };
  const predictedValue = topCandidate.value;
  const isCorrect = expectedValue !== 'UNKNOWN' && predictedValue === expectedValue;

  return {
    queryKey: targetKey,
    expectedValue,
    predictedValue,
    isCorrect,
    cosineSimilarity: topCandidate.similarity,
    signalToNoiseDb: snrDb,
    signalVector,
    noiseVector,
    signalNorm: Number(sigNorm.toFixed(4)),
    noiseNorm: Number(noiseNorm.toFixed(4)),
    retrievedVector,
    candidates: candidateScores.slice(0, 5),
  };
}

/**
 * Standard Transformer Token-by-Token KV Cache Retrieval.
 * Exact retrieval via softmax attention over all stored token pairs.
 */
export function queryKVCache(
  kvPairs: Array<{ keyVector: number[]; valueVector: number[]; value: string }>,
  queryKeyVector: number[],
  _targetKey: string,
  expectedValue: string
): { predictedValue: string; isCorrect: boolean; memoryBytes: number; attentionWeights: number[] } {
  const d = queryKeyVector.length;
  if (kvPairs.length === 0) {
    return { predictedValue: 'None', isCorrect: false, memoryBytes: 0, attentionWeights: [] };
  }

  // Scale factor 1 / sqrt(d)
  const scale = 1 / Math.sqrt(d);
  const logits = kvPairs.map(pair => {
    let dot = 0;
    for (let i = 0; i < d; i++) {
      dot += pair.keyVector[i] * queryKeyVector[i];
    }
    return dot * scale;
  });

  // Softmax
  const maxLogit = Math.max(...logits);
  const exps = logits.map(l => Math.exp(l - maxLogit));
  const sumExp = exps.reduce((a, b) => a + b, 0);
  const attentionWeights = exps.map(e => e / (sumExp || 1));

  // Weighted sum of value vectors
  const weightedV = createZeroVector(d);
  for (let i = 0; i < kvPairs.length; i++) {
    for (let j = 0; j < d; j++) {
      weightedV[j] += attentionWeights[i] * kvPairs[i].valueVector[j];
    }
  }

  // Find highest attended pair
  let maxIdx = 0;
  let maxW = -1;
  attentionWeights.forEach((w, idx) => {
    if (w > maxW) {
      maxW = w;
      maxIdx = idx;
    }
  });

  const predictedValue = kvPairs[maxIdx]?.value || 'None';
  // 4 bytes per float32 * 2 vectors (key + value) * dimension d * T tokens
  const memoryBytes = kvPairs.length * 2 * d * 4;

  return {
    predictedValue,
    isCorrect: predictedValue === expectedValue,
    memoryBytes,
    attentionWeights,
  };
}
