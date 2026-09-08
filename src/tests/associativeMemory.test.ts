import { describe, it, expect } from 'vitest';
import {
  initAssociativeState,
  updateAssociativeState,
  queryAssociativeMemory,
  queryKVCache,
} from '../math/associativeMemory';
import { generateFactSequence } from '../data/syntheticTasks';

describe('Associative Memory Mathematical Engine', () => {
  it('achieves perfect retrieval for orthogonal keys when T < d', () => {
    // Generate clean sequence T=3, d=8
    const { facts, codebook } = generateFactSequence(3, 8, 0, 0, 123);
    let state = initAssociativeState(8, 1.0, 1.0);

    for (const f of facts) {
      state = updateAssociativeState(state, f.keyVector, f.valueVector, 'hebbian');
    }

    const queryKey = 'Color';
    const queryVec = codebook.keyVectors.get(queryKey)!;
    const result = queryAssociativeMemory(state, queryVec, queryKey, facts, codebook.vocabulary);

    expect(result.expectedValue).toBe('Cyan');
    expect(result.predictedValue).toBe('Cyan');
    expect(result.isCorrect).toBe(true);
    expect(result.signalToNoiseDb).toBeGreaterThan(10);
  });

  it('demonstrates recency decay when lambda < 1.0', () => {
    const { facts, codebook } = generateFactSequence(20, 16, 0, 0, 42);
    // Leaky state with decay 0.85
    let state = initAssociativeState(16, 0.85, 1.0);

    for (const f of facts) {
      state = updateAssociativeState(state, f.keyVector, f.valueVector, 'hebbian');
    }

    const queryKey = 'Color'; // Step 1
    const queryVec = codebook.keyVectors.get(queryKey)!;
    const result = queryAssociativeMemory(state, queryVec, queryKey, facts, codebook.vocabulary);

    // Early fact at step 1 after 20 steps has decayed by 0.85^19 ≈ 0.045
    expect(result.signalNorm).toBeLessThan(0.15);
  });

  it('compares KV cache memory growth against fixed-size associative state', () => {
    const d = 16;
    const T = 100;
    const { facts, codebook } = generateFactSequence(T, d, 0, 0, 999);
    
    // Fixed associative state in R^{16 x 16}: constant size 16 * 16 * 4 bytes = 1,024 bytes
    const fixedStateBytes = d * d * 4;
    expect(fixedStateBytes).toBe(1024);

    // KV Cache stores key and value vector per token: T * 2 * d * 4 bytes
    const kvPairs = facts.map(f => ({
      keyVector: f.keyVector,
      valueVector: f.valueVector,
      value: f.value,
    }));
    const queryVec = codebook.keyVectors.get('Color')!;
    const kvResult = queryKVCache(kvPairs, queryVec, 'Color', 'Cyan');

    // For T=100, d=16: 100 * 2 * 16 * 4 = 12,800 bytes (12.5x larger than fixed state)
    expect(kvResult.memoryBytes).toBe(12800);
    expect(kvResult.memoryBytes).toBeGreaterThan(fixedStateBytes * 10);
  });
});
