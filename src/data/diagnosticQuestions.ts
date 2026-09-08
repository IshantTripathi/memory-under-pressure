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
        explanation: 'Incorrect. For a fixed-size evolving state, memory footprint is O(d^2) = O(1) with respect to sequence length T. Only a KV cache grows by 50x.',
        isCorrect: false,
      },
      {
        id: 'D',
        text: 'The model outputs an out-of-memory (OOM) error.',
        explanation: 'Incorrect. Fixed-size states prevent OOM errors entirely, but trade away retrieval fidelity when capacity is overwhelmed.',
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
    question: 'What is the mathematical fate of the first stored fact at step 31?',
    options: [
      {
        id: 'A',
        text: 'Its effective signal magnitude is attenuated by λ^30 ≈ 0.042 (over 95% signal loss).',
        explanation: 'Correct! The decay factor λ acts as an exponential discount: signal weight scales as λ^(t - t_fact). Early facts suffer exponential forgetting (recency bias).',
        isCorrect: true,
      },
      {
        id: 'B',
        text: 'The fact remains at 100% strength because associative memories do not experience decay.',
        explanation: 'Incorrect. The decay factor λ=0.90 explicitly multiplies the entire preceding matrix at every timestep.',
        isCorrect: false,
      },
      {
        id: 'C',
        text: 'The state matrix rank drops to 0.',
        explanation: 'Incorrect. New tokens continue to refresh the state with outer products, so the matrix maintains rank populated by recent tokens.',
        isCorrect: false,
      },
      {
        id: 'D',
        text: 'The model achieves infinite context window with zero information loss.',
        explanation: 'Incorrect. Decay solves numerical explosion, but directly causes selective forgetting of early context.',
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
        explanation: 'Correct! BDH-CQ in-context demonstrations continuously update recurrent memory; iterative reasoning occurs directly within high-dimensional latent space at O(1) token overhead.',
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
