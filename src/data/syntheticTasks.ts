import type { Fact, FactCategory } from '../types/memory';
import { PRNG } from '../math/prng';
import { normalizeVector, vectorAdd, vectorScale, generateOrthonormalBasis } from '../math/linalg';

export const CANONICAL_ATTRIBUTES = [
  { key: 'Color', category: 'color' as FactCategory, values: ['Cyan', 'Crimson', 'Emerald', 'Amber', 'Violet', 'Indigo'] },
  { key: 'Shape', category: 'shape' as FactCategory, values: ['Hexagon', 'Triangle', 'Sphere', 'Octagon', 'Prism', 'Helix'] },
  { key: 'Location', category: 'location' as FactCategory, values: ['Sector-7', 'Core-A', 'Outpost-3', 'Quadrant-9', 'Node-Z', 'Orbit-4'] },
  { key: 'Status', category: 'entity' as FactCategory, values: ['Active', 'Dormant', 'Overheating', 'Synchronized', 'Shielded', 'Locked'] },
  { key: 'Operator', category: 'entity' as FactCategory, values: ['Atlas', 'Nexus', 'Valkyrie', 'Orion', 'Kestrel', 'Sentinel'] },
];

export const DISTRACTOR_POOLS = [
  { key: 'Sensor-Alpha', category: 'action' as FactCategory, values: ['Calibrating', 'Optimal', 'Degraded', 'Nominal', 'Fluctuating'] },
  { key: 'Subsystem-Beta', category: 'action' as FactCategory, values: ['Engaged', 'Standby', 'Rerouted', 'Throttled', 'Rebooting'] },
  { key: 'Signal-Gamma', category: 'action' as FactCategory, values: ['Echoed', 'Filtered', 'Amplified', 'Attenuated', 'Interleaved'] },
  { key: 'Telemetry-Delta', category: 'action' as FactCategory, values: ['Transmitted', 'Buffered', 'Encrypted', 'Logged', 'Purged'] },
  { key: 'Auxiliary-Epsilon', category: 'action' as FactCategory, values: ['Charging', 'Discharged', 'Coupled', 'Isolated', 'Bypassed'] },
];

/**
 * Creates a deterministic codebook of normalized vectors in R^d for each key and value.
 * If keyCorrelation > 0, distractor keys are biased towards canonical keys to test cross-talk interference.
 */
export function generateCodebook(
  dimension: number,
  keyCorrelation: number = 0,
  seed: number = 42
): {
  keyVectors: Map<string, number[]>;
  valueVectors: Map<string, number[]>;
  vocabulary: Array<{ value: string; vector: number[] }>;
} {
  const rng = new PRNG(seed);
  const keyVectors = new Map<string, number[]>();
  const valueVectors = new Map<string, number[]>();
  const vocabulary: Array<{ value: string; vector: number[] }> = [];

  // Helper to sample random vector in R^d
  const sampleRandomVector = () => {
    const v = new Array(dimension).fill(0).map(() => rng.gaussian(0, 1));
    return normalizeVector(v);
  };

  // Generate orthonormal basis for canonical keys if dimension permits
  const basis = generateOrthonormalBasis(dimension);

  // Canonical keys and values
  CANONICAL_ATTRIBUTES.forEach((attr, idx) => {
    // If within basis dimension, use strictly orthogonal basis vector for canonical keys
    const kVec = idx < basis.length ? basis[idx] : sampleRandomVector();
    keyVectors.set(attr.key, kVec);

    attr.values.forEach((val) => {
      const vVec = sampleRandomVector();
      valueVectors.set(val, vVec);
      vocabulary.push({ value: val, vector: vVec });
    });
  });

  // Distractor keys and values
  DISTRACTOR_POOLS.forEach((dist, idx) => {
    let kVec = sampleRandomVector();
    if (keyCorrelation > 0) {
      // Blend distractor key towards one of the canonical keys to introduce intentional key collisions
      const targetCanonicalKey = CANONICAL_ATTRIBUTES[idx % CANONICAL_ATTRIBUTES.length].key;
      const canonicalVec = keyVectors.get(targetCanonicalKey)!;
      // k_dist = normalize((1 - corr) * k_rand + corr * k_canonical)
      const blended = vectorAdd(
        vectorScale(kVec, 1 - keyCorrelation),
        vectorScale(canonicalVec, keyCorrelation)
      );
      kVec = normalizeVector(blended);
    }
    keyVectors.set(dist.key, kVec);

    dist.values.forEach((val) => {
      const vVec = sampleRandomVector();
      valueVectors.set(val, vVec);
      vocabulary.push({ value: val, vector: vVec });
    });
  });

  return { keyVectors, valueVectors, vocabulary };
}

/**
 * Generates a sequence of facts for the educational simulation.
 * Injects canonical facts early (e.g. at step 0, 1, 2) followed by N distractor facts.
 */
export function generateFactSequence(
  sequenceLength: number,
  dimension: number,
  keyCorrelation: number = 0,
  noiseLevel: number = 0,
  seed: number = 42
): {
  facts: Fact[];
  codebook: {
    keyVectors: Map<string, number[]>;
    valueVectors: Map<string, number[]>;
    vocabulary: Array<{ value: string; vector: number[] }>;
  };
} {
  const rng = new PRNG(seed);
  const codebook = generateCodebook(dimension, keyCorrelation, seed);
  const facts: Fact[] = [];

  // Step 0..2: Fixed canonical target facts
  const targetFacts = [
    { key: 'Color', value: 'Cyan', category: 'color' as FactCategory },
    { key: 'Shape', value: 'Hexagon', category: 'shape' as FactCategory },
    { key: 'Location', value: 'Sector-7', category: 'location' as FactCategory },
  ];

  targetFacts.forEach((tf, step) => {
    const kVec = codebook.keyVectors.get(tf.key)!;
    const vVec = codebook.valueVectors.get(tf.value)!;
    facts.push({
      id: `fact-canonical-${step}`,
      category: tf.category,
      key: tf.key,
      value: tf.value,
      keyVector: kVec,
      valueVector: vVec,
      step: step + 1,
      isDistractor: false,
    });
  });

  // Steps 3..sequenceLength: Distractor / filler facts
  const remainingCount = Math.max(0, sequenceLength - targetFacts.length);
  for (let i = 0; i < remainingCount; i++) {
    const step = targetFacts.length + i + 1;
    const distPool = DISTRACTOR_POOLS[rng.int(0, DISTRACTOR_POOLS.length - 1)];
    const val = distPool.values[rng.int(0, distPool.values.length - 1)];
    
    let kVec = codebook.keyVectors.get(distPool.key)!;
    let vVec = codebook.valueVectors.get(val)!;

    if (noiseLevel > 0) {
      // Add random additive noise to the value vector
      const noise = new Array(dimension).fill(0).map(() => rng.gaussian(0, noiseLevel));
      vVec = normalizeVector(vectorAdd(vVec, noise));
    }

    facts.push({
      id: `fact-distractor-${step}`,
      category: distPool.category,
      key: distPool.key,
      value: val,
      keyVector: kVec,
      valueVector: vVec,
      step,
      isDistractor: true,
    });
  }

  return { facts, codebook };
}
