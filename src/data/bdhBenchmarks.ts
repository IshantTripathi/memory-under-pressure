/**
 * Published research data and architectural comparisons for Pathway's Dragon Hatchling (BDH) and BDH-CQ.
 * Citations:
 * - BDH: "The Dragon Hatchling: The Missing Link between the Transformer and Models of the Brain" (arXiv:2509.26507)
 * - BDH-CQ: "BDH-CQ: In-Context Learning with Recurrent Latent Reasoning" (arXiv:2608.09888, August 2026)
 */

export interface BenchmarkComparison {
  model: string;
  architecture: string;
  parameters: string;
  passAt2ARC: number; // percentage
  costPerTaskUSD: number;
  reasoningType: 'Recurrent Latent Reasoning';
  memoryMechanism: string;
  sourceType: 'Published Result';
  citation: string;
}

export const ARC_AGI_BENCHMARKS: BenchmarkComparison[] = [
  {
    model: 'BDH-CQ (150M)',
    architecture: 'Recurrent Latent Reasoning (BDH base)',
    parameters: '150M',
    passAt2ARC: 29.5,
    costPerTaskUSD: 0.0007,
    reasoningType: 'Recurrent Latent Reasoning',
    memoryMechanism: 'In-context demonstrations update recurrent synaptic memory in latent space; reasoning occurs without generating verbalized tokens',
    sourceType: 'Published Result',
    citation: 'arXiv:2608.09888 (Pathway, Aug 2026)',
  },
];

export const ARCHITECTURE_CONTRAST = [
  {
    feature: 'Working Memory Substrate',
    transformer: 'External KV Cache buffer (grows linearly O(T · d) per layer)',
    linearAttention: 'Compressed matrix state S_t = S_{t-1} + v_t k_t^T (fixed O(d^2) with respect to sequence length T)',
    bdh: 'Dynamic synaptic plasticity across scale-free neuron particles (fixed O(d^2) or graph edges with respect to sequence length T)',
  },
  {
    feature: 'Attention Formulation',
    transformer: 'Softmax(Q K^T / sqrt(d)) V (dense, all-to-all token interaction)',
    linearAttention: 'Linear kernel phi(Q) (phi(K)^T V) (unconstrained key/query projections)',
    bdh: 'Q = K self-affinity with causal mask (diagonal = -1) and non-negative sparse activations',
  },
  {
    feature: 'Activation Profile',
    transformer: 'Dense mixed-sign real vectors (polysemantic, distributed representations)',
    linearAttention: 'Dense or feature-mapped real vectors',
    bdh: 'Sparse, non-negative ReLU activations (biologically plausible firing rates, monosemantic)',
  },
  {
    feature: 'Reasoning Execution',
    transformer: 'Autoregressive token emission (Chain-of-Thought verbalization)',
    linearAttention: 'Standard token emission sequence',
    bdh: 'BDH-CQ performs iterative recurrence in latent space without verbalizing text tokens',
  },
  {
    feature: 'Long-Horizon Bottleneck',
    transformer: 'KV Cache VRAM exhaustion (linear O(T) memory footprint) & quadratic prefill',
    linearAttention: 'Finite-rank state capacity & cross-talk interference when T exceeds dimension d',
    bdh: 'Synaptic saturation and latent representation capacity limits',
  },
];
