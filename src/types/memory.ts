export type FactCategory = 'color' | 'shape' | 'location' | 'entity' | 'action';

export interface Fact {
  id: string;
  category: FactCategory;
  key: string;
  value: string;
  keyVector: number[];
  valueVector: number[];
  step: number;
  isDistractor?: boolean;
}

export type MemoryStrategyType = 
  | 'full_kv'
  | 'recurrent_vector'
  | 'associative_matrix'
  | 'bdh_synaptic';

export interface MemoryStrategyInfo {
  id: MemoryStrategyType;
  name: string;
  subtitle: string;
  complexityMemory: string;
  complexityInference: string;
  retrievalMechanism: string;
  pros: string[];
  cons: string[];
  frontierConnection: string;
}

export interface AssociativeState {
  dimension: number;
  matrix: number[][];       // S_t in R^{d x d}
  hiddenVector: number[];   // h_t in R^d (for recurrent vector comparison)
  step: number;
  decay: number;           // lambda in [0.8, 1.0]
  learningRate: number;    // eta
  frobeniusNorm: number;
  singularValues: number[];
  energyRatio: number;     // ratio of top singular value to total
}

export interface RetrievalResult {
  queryKey: string;
  expectedValue: string;
  predictedValue: string;
  isCorrect: boolean;
  cosineSimilarity: number;
  signalToNoiseDb: number;
  signalVector: number[];
  noiseVector: number[];
  signalNorm: number;
  noiseNorm: number;
  retrievedVector: number[];
  candidates: Array<{ value: string; similarity: number }>;
}

export interface ExperimentPreset {
  id: string;
  title: string;
  tagline: string;
  description: string;
  hypothesis: string;
  sequenceLength: number;
  dimension: number;
  decay: number;
  keyCorrelation: number; // 0 = orthogonal, 1 = identical
  noiseLevel: number;
  targetProbeKey: string;
  expectedOutcome: 'perfect' | 'degraded' | 'catastrophic';
}

export interface DiagnosticQuestion {
  id: number;
  title: string;
  scenario: string;
  question: string;
  options: Array<{
    id: string;
    text: string;
    explanation: string;
    isCorrect: boolean;
  }>;
  simulationConfig: {
    sequenceLength: number;
    dimension: number;
    decay: number;
    label: string;
  };
}
