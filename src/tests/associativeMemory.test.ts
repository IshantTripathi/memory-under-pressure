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

  it('guarantees strictly zero cross-talk noise for clean orthogonal baseline (T=5, d=16)', () => {
    const { facts, codebook } = generateFactSequence(5, 16, 0, 0, 42);
    // Verify mutual orthogonality of distinct fact keys
    for (let i = 0; i < facts.length; i++) {
      for (let j = i + 1; j < facts.length; j++) {
        if (facts[i].key !== facts[j].key) {
          const dot = facts[i].keyVector.reduce((sum, v, k) => sum + v * facts[j].keyVector[k], 0);
          expect(Math.abs(dot)).toBeLessThan(1e-6);
        }
      }
    }

    let state = initAssociativeState(16, 1.0, 1.0);
    for (const f of facts) {
      state = updateAssociativeState(state, f.keyVector, f.valueVector, 'hebbian');
    }

    const queryKey = 'Color';
    const queryVec = codebook.keyVectors.get(queryKey)!;
    const result = queryAssociativeMemory(state, queryVec, queryKey, facts, codebook.vocabulary);

    expect(result.isCorrect).toBe(true);
    expect(result.expectedValue).toBe('Cyan');
    expect(result.predictedValue).toBe('Cyan');
    expect(result.noiseNorm).toBeLessThan(1e-6);
    expect(result.signalToNoiseDb).toBe(90); // numerical ceiling
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
