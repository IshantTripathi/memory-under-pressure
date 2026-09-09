import type { DiagnosticQuestion } from '../types/memory';

export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: 1,
    title: 'The Capacity & Interference Bound',
    scenario: 'An AI model compresses incoming tokens into a fixed-size state matrix S_t in R^{8 x 8} (d=8). A stream of 50 distinct entity attributes arrives, followed by a probe query for the 1st attribute.',
    question: 'According to linear associative memory theory, what will happen to the retrieval quality of the 1st attribute?',
    options: [
      {
        id: 'A',
        text: 'Retrieval remains 100% exact because matrix state expands dynamically for every token.',
        explanation: 'Incorrect. A fixed-size state matrix in R^{d x d} cannot expand; its dimensions are constant regardless of sequence duration.',
        isCorrect: false,
      },
      {
        id: 'B',
        text: 'Interference and cross-talk noise increase because T (50) significantly exceeds the state rank bound (d=8).',
        explanation: 'Correct! Vectors in R^8 cannot all remain orthogonal. As T >> d, the outer-product superpositions cause severe cross-talk noise (SNR drops below 0 dB).',
        isCorrect: true,
      },
      {
        id: 'C',
        text: 'The memory footprint in GPU VRAM increases by 50x.',
        explanation: 'Incorrect. For a fixed-size evolving state, memory footprint is O(d^2) and remains fixed with respect to sequence length T for a fixed model configuration. Only a KV cache grows by 50x.',
        isCorrect: false,
      },
      {
        id: 'D',
        text: 'The model outputs an out-of-memory (OOM) error.',
        explanation: 'Incorrect. The recurrent state itself maintains a fixed footprint that does not grow with sequence length T, avoiding sequence-length OOM from cached tokens, but the overall system can still run out of memory for other reasons (e.g. batch size, activations, or model parameters). Under sequence pressure, the recurrent state trades away retrieval fidelity through cross-talk interference.',
        isCorrect: false,
      }
    ],
    simulationConfig: {
      sequenceLength: 50,
      dimension: 8,
      decay: 1.0,
      label: 'Load T=50, d=8 Overload Test',
    }
  },
  {
    id: 2,
    title: 'Selective Forgetting & The Recency Trade-off',
    scenario: 'An engineer sets the state update rule to S_t = 0.90 * S_{t-1} + v_t * k_t^T (decay λ = 0.90) to prevent state weights from exploding over long sequences. The first fact is stored at step 1; 30 subsequent tokens arrive.',
    question: 'What happens to the first fact when queried at step 31?',
    options: [
      {
        id: 'A',
        text: 'The first fact is perfectly preserved at full signal amplitude.',
        explanation: 'Incorrect. Each decay step attenuates the signal component by factor λ. Over 30 steps, signal norm drops to 0.90^30 ≈ 0.042 (over 95% attenuation).',
        isCorrect: false,
      },
      {
        id: 'B',
        text: 'The signal norm decays to ~4% of its original magnitude (0.90^30), causing recency amnesia.',
        explanation: 'Correct! Exponential decay stabilizes long-term norm growth, but creates an unavoidable recency bias where early facts are progressively erased.',
        isCorrect: true,
      },
      {
        id: 'C',
        text: 'The state matrix rank drops to 0.',
        explanation: 'Incorrect. New tokens continue to refresh the state with outer products, so the matrix maintains rank populated by recent tokens.',
        isCorrect: false,
      },
      {
        id: 'D',
        text: 'The model retains every earlier fact with zero information loss regardless of sequence length.',
        explanation: 'Incorrect. While decay stabilizes state magnitude, multiplying by λ < 1 causes earlier facts to decay exponentially as λ^t, inducing selective forgetting of early context.',
        isCorrect: false,
      }
    ],
    simulationConfig: {
      sequenceLength: 32,
      dimension: 16,
      decay: 0.90,
      label: 'Load λ=0.90 Recency Decay Test',
    }
  },
  {
    id: 3,
    title: 'BDH-CQ Recurrent Latent Reasoning',
    scenario: 'In Pathway\'s BDH-CQ architecture (arXiv:2608.09888), how does the model achieve a 29.5% pass@2 rate on ARC-AGI-1 at $0.0007 per task compared to conventional Transformer LLMs?',
    question: 'What architectural difference eliminates the massive token generation cost?',
    options: [
      {
        id: 'A',
        text: 'It generates 5,000 verbalized Chain-of-Thought tokens per task and compresses them with gzip.',
        explanation: 'Incorrect. BDH-CQ explicitly does NOT verbalize its reasoning steps as text tokens.',
        isCorrect: false,
      },
      {
        id: 'B',
        text: 'Demonstrations update its recurrent memory, and reasoning is performed iteratively in latent space without generating verbalized tokens.',
        explanation: 'Correct! BDH-CQ in-context demonstrations continuously update recurrent memory; iterative reasoning occurs directly within high-dimensional latent space without emitting intermediate reasoning tokens.',
        isCorrect: true,
      },
      {
        id: 'C',
        text: 'It fine-tunes all 150M model parameters with gradient descent at inference time.',
        explanation: 'Incorrect. BDH-CQ adapts via recurrent latent memory without any parameter weight updates during inference.',
        isCorrect: false,
      },
      {
        id: 'D',
        text: 'It switches to an unlimited 100-million token KV cache on GPU VRAM.',
        explanation: 'Incorrect. BDH-CQ avoids large KV-cache allocations through its recurrent state formulation.',
        isCorrect: false,
      }
    ],
    simulationConfig: {
      sequenceLength: 15,
      dimension: 16,
      decay: 0.98,
      label: 'Load BDH Synaptic Recurrence Preset',
    }
  }
];
