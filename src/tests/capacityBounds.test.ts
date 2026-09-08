import { describe, it, expect } from 'vitest';
import { initAssociativeState, updateAssociativeState, queryAssociativeMemory } from '../math/associativeMemory';
import { generateFactSequence } from '../data/syntheticTasks';

describe('Capacity Bounds & Interference Verification', () => {
  it('experimentally tests the central claim: capacity saturation leads to interference', () => {
    // Dimension d = 8
    const d = 8;
    
    // Case 1: Short sequence T = 4 (T < d)
    const shortSeq = generateFactSequence(4, d, 0, 0, 777);
    let stateShort = initAssociativeState(d, 1.0, 1.0);
    for (const f of shortSeq.facts) {
      stateShort = updateAssociativeState(stateShort, f.keyVector, f.valueVector, 'hebbian');
    }
    const shortQueryVec = shortSeq.codebook.keyVectors.get('Color')!;
    const shortResult = queryAssociativeMemory(
      stateShort,
      shortQueryVec,
      'Color',
      shortSeq.facts,
      shortSeq.codebook.vocabulary
    );

    // Case 2: Overloaded long sequence T = 50 (T >> d)
    const longSeq = generateFactSequence(50, d, 0, 0, 777);
    let stateLong = initAssociativeState(d, 1.0, 1.0);
    for (const f of longSeq.facts) {
      stateLong = updateAssociativeState(stateLong, f.keyVector, f.valueVector, 'hebbian');
    }
    const longQueryVec = longSeq.codebook.keyVectors.get('Color')!;
    const longResult = queryAssociativeMemory(
      stateLong,
      longQueryVec,
      'Color',
      longSeq.facts,
      longSeq.codebook.vocabulary
    );

    // Verifications:
    // 1. Both systems processed their sequences using the EXACT same memory footprint (an 8x8 matrix)
    expect(stateShort.matrix.length).toBe(d);
    expect(stateLong.matrix.length).toBe(d);
    expect(stateShort.matrix[0].length).toBe(d);
    expect(stateLong.matrix[0].length).toBe(d);

    // 2. Short sequence has high SNR and low noise
    expect(shortResult.signalToNoiseDb).toBeGreaterThan(5);

    // 3. Long sequence suffers substantial cross-talk interference
    expect(longResult.noiseNorm).toBeGreaterThan(shortResult.noiseNorm * 2);
    expect(longResult.signalToNoiseDb).toBeLessThan(shortResult.signalToNoiseDb);
  });
});
