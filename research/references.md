# Primary Research References & Literature Verification

This repository grounds all technical claims, architectural comparisons, and mathematical formulations in verified primary research papers published between 1982 and 2026, with an emphasis on 2022–2026 frontier architectures.

---

## 1. Pathway Frontier Papers (Primary Focus)

### Reference 1: The Dragon Hatchling (BDH)
* **Title:** *The Dragon Hatchling: The Missing Link between the Transformer and Models of the Brain*
* **Authors:** Adrian Kosowski, Przemysław Uznański, Jan Chorowski, Zuzanna Stamirowska, Michał Bartoszkiewicz (Pathway Research Team)
* **Identifier:** [arXiv:2509.26507](https://arxiv.org/abs/2509.26507)
* **Date:** September 30, 2025
* **Evidence Level:** Original Author Benchmark & Architecture Introduction (Code released in `pathwaycom/bdh`)
* **What the Paper Demonstrates:**
  - Reformulates self-attention through biologically plausible Hebbian plasticity over a scale-free graph of interacting neuron particles.
  - Replaces external KV-cache buffers with dynamic synaptic weights updated during inference.
  - Implements $Q = K$ self-affinity with causal masking and sparse, non-negative ReLU activations (monosemantic neuron firing).
  - Matches GPT-2 scale performance across language modeling and translation benchmarks at 10M–1B parameter scale.

### Reference 2: BDH-CQ
* **Title:** *BDH-CQ: In-Context Learning with Recurrent Latent Reasoning*
* **Authors:** Björn Engdahl, Adrian Kosowski, Jan Chorowski, Zuzanna Stamirowska, Przemysław Uznański, Junlin Jiang, Rohan Phadke, Remigiusz Kinas, Richard Zhong (Pathway Research Team)
* **Identifier:** [arXiv:2608.09888](https://arxiv.org/abs/2608.09888)
* **Date:** August 2026
* **Evidence Level:** Original Author Benchmark on Public Evaluation Set (ARC-AGI-1)
* **What the Paper Demonstrates:**
  - Demonstrates in-context learning via continuous recurrent memory updates from demonstration examples without parameter fine-tuning.
  - Executes iterative reasoning entirely within high-dimensional latent space without verbalizing intermediate Chain-of-Thought (CoT) text tokens.
  - Reaches **29.5% pass@2** on the public ARC-AGI-1 evaluation set at an inference cost of **$0.0007 per task** (150M parameter model), establishing a reported cost-efficiency Pareto point on the public benchmark.

---

## 2. Recurrent & Linear Attention Foundations (2021–2024)

### Reference 3: Fast Weight Programmers
* **Title:** *Linear Transformers Are Secretly Fast Weight Programmers*
* **Authors:** Imanol Schlag, Kazuki Irie, Jürgen Schmidhuber
* **Identifier:** ICML 2021 / [arXiv:2102.11174](https://arxiv.org/abs/2102.11174)
* **Evidence Level:** Peer-Reviewed Conference Paper (ICML 2021)
* **What the Paper Demonstrates:**
  - Proves mathematical equivalence between unnormalized linear attention and recurrent associative memory updating outer-product states $S_t = S_{t-1} + v_t k_t^T$.
  - Analyzes the Delta rule (Widrow-Hoff error correction) for associative memory updates.

### Reference 4: RetNet (Retentive Network)
* **Title:** *Retentive Network: A Successor to Transformer for Large Language Models*
* **Authors:** Yutao Sun, Li Dong, Shaohan Huang, Shuming Ma, Yuqing Xia, Jilong Xue, Jianyin Wang, Furu Wei (Microsoft Research)
* **Identifier:** [arXiv:2307.08621](https://arxiv.org/abs/2307.08621) (2023)
* **Evidence Level:** Primary Technical Report with Scale Empirical Evaluations
* **What the Paper Demonstrates:**
  - Multi-scale retention mechanism introducing explicit exponential decay factors $\lambda < 1$ to preserve numerical stability and prevent state explosion.
  - Achieves constant inference memory per token with respect to sequence length $T$ and $O(1)$ recurrent step latency.

### Reference 5: Mamba SSM
* **Title:** *Mamba: Linear-Time Sequence Modeling with Selective State Spaces*
* **Authors:** Albert Gu, Tri Dao
* **Identifier:** [arXiv:2312.00752](https://arxiv.org/abs/2312.00752) (2023)
* **Evidence Level:** Primary Research Paper with Multi-Benchmark Verification
* **What the Paper Demonstrates:**
  - Input-dependent selection mechanisms (parameter gating based on current token) allowing selective filtering and forgetting in a compressed recurrent state.

---

## 3. Classical Associative Memory Capacity

### Reference 6: Hopfield Associative Memory
* **Title:** *Neural Networks and Physical Systems with Emergent Collective Computational Abilities*
* **Author:** John J. Hopfield
* **Identifier:** PNAS 1982, 79(8): 2554–2558
* **Evidence Level:** Foundational Theoretical Physics / Neuroscience Paper
* **What the Paper Demonstrates:**
  - Establishes mathematical capacity limits for outer-product associative recall: $C \approx 0.14 d$ for binary Hopfield networks, and rank $d$ for linear matrix associative memories before cross-talk noise causes catastrophic retrieval breakdown.
