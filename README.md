# Memory Under Pressure: How AI Models Remember, Update and Forget Across Long Sequences

[![Vitest](https://img.shields.io/badge/tests-12%20passing-emerald.svg)](https://github.com/pathwaycom/bdh)
[![Vite](https://img.shields.io/badge/vite-8.2-cyan.svg)](https://vitejs.dev)
[![React](https://img.shields.io/badge/react-19-indigo.svg)](https://react.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./SOURCES_AND_LICENSES.md)
[![Track](https://img.shields.io/badge/DataForge%202026-Pathway%20Track-blue.svg)](https://pathway.com)

> **Competition Submission:** DataForge 2026 — Pathway Track ("Explain the Frontier")  
> **Core Frontier Concept:** Long-Horizon Evolving State, Recurrent Latent Reasoning, and Synaptic Memory in AI Architectures.

---

## 1. The Frontier Problem

Standard Transformer Large Language Models retain sequence context by storing all Key and Value vectors for every processed token in an external **KV Cache**. Over long horizons, this induces **linear growth in cached-token memory ($O(T \cdot d \cdot L)$)** in GPU VRAM ($T$ = sequence length, $d$ = head dimension, $L$ = layer count). Serving long context models requires massive memory bandwidth and yields severe cost inflation.

Recurrent state-space models and Pathway's **Dragon Hatchling (BDH)** architecture maintain fixed-size representations where memory footprint is **fixed with respect to sequence length $T$ for a fixed model configuration** (bounded at $O(d^2)$ state parameters per layer). But finite state capacity introduces a fundamental trade-off: **subspace interference and forgetting**.

---

## 2. Central Falsifiable Claim

> **"A fixed-size evolving state can process sequences whose duration grows without allocating a new memory slot for every token, but limited state capacity can cause interference and forgetting."**

This claim is made experimentally testable inside this application. The learner can manipulate real concept variables (dimension $d$, sequence length $T$, decay factor $\lambda$, key correlation $\rho$, and sensory noise $\sigma$) to observe exact conditions supporting and challenging the claim.

---

## 3. Educational Journey: 10 Core Modules

```
OPEN APPLICATION
  ↓
[Section 1: The Memory Problem] (Live running stream: O(T) KV cache vs fixed-size evolving state)
  ↓
[Section 2: What is an Evolving State?] (Step-by-step matrix update inspector & cell heatmap)
  ↓
[Section 3: Memory Capacity] (Dimension control d ∈ {4..64}, rank bounds & singular spectrum)
  ↓
[Section 4: Interference & Forgetting] (Entity fact probe, Expected vs Actual, SNR in dB)
  ↓
[Section 5: Compare Strategies] (Transformer KV vs RNN Vector vs Linear State vs BDH Synaptic)
  ↓
[Section 6: The "Break It" Stress Test] (Live phase transition curve: Accuracy vs T/d ratio)
  ↓
[Section 7: BDH & BDH-CQ Module] (From recurrent state to synaptic memory; ARC-AGI-1 benchmark)
  ↓
[Section 8: 60-Second Challenge] (Diagnostic scenario tests with live simulation verification)
  ↓
[Section 9: Failure Cases & Limitations] (5 documented mathematical and engineering boundaries)
  ↓
[Section 10: Executive Summary] (Printable 1-page PDF-ready brief with trade-off matrix)
```

---

## 4. Key Mathematical Substrate

The simulation substrate is implemented in pure TypeScript with zero external math dependencies:

1. **State Update Formula:**
   $$S_t = \lambda S_{t-1} + \eta (v_t \otimes k_t^T)$$
2. **Associative Retrieval:**
   $$\hat{v} = S_t q = \sum_{\tau=1}^t \lambda^{t-\tau} (k_\tau^T q) v_\tau$$
3. **Signal vs Cross-Talk Noise Decomposition:**
   $$\hat{v} = \underbrace{\lambda^{t - t_{\text{target}}} (k_{\text{target}}^T q) v_{\text{target}}}_{\text{Signal Vector } s} + \underbrace{\sum_{\tau \neq \text{target}} \lambda^{t-\tau} (k_\tau^T q) v_\tau}_{\text{Noise Vector } n}$$
4. **Signal-to-Noise Ratio (SNR):**
   $$\text{SNR}_{\text{dB}} = 10 \log_{10} \left( \frac{\|s\|^2}{\|n\|^2 + \epsilon} \right)$$
5. **Singular Value Decomposition (Spectral Energy):**
   Power iteration with deflation computes the singular spectrum $\sigma_1, \dots, \sigma_k$, revealing effective matrix rank saturation.

---

## 5. Frontier Connection: Pathway BDH & BDH-CQ

This project directly connects evolving state dynamics to two primary Pathway research papers:

### A. Dragon Hatchling (BDH, arXiv:2509.26507)
* **Mechanism:** Replaces external KV-cache buffers with dynamic synaptic plasticity across a scale-free graph of interacting neuron particles.
* **$Q = K$ Self-Affinity:** Constrains queries and keys to identical projections from sparse, non-negative ReLU activations, implementing Donald Hebb's biological law ("neurons that fire together wire together").
* **Synaptic Working Memory:** Synaptic weights adapt on the fly during inference without parameter fine-tuning.

### B. BDH-CQ (arXiv:2608.09888, Aug 2026)
* **Recurrent Latent Reasoning:** In-context demonstrations continuously update the model's recurrent memory; reasoning occurs directly in high-dimensional latent space without emitting intermediate Chain-of-Thought (CoT) text tokens.
* **Benchmark Performance:** Achieved **29.5% pass@2 on public ARC-AGI-1 at $0.0007 per task** (under 1/10th of a cent), establishing a reported cost-efficiency Pareto point on the public benchmark.

### Transparency Standard
* **Published Benchmark Results:** ARC-AGI-1 benchmark accuracy and cost numbers are cited directly from arXiv:2608.09888.
* **Educational Toy Model:** The interactive matrix simulations are educational models designed to demonstrate the underlying linear algebra and recurrent dynamics.

---

## 6. Project Architecture

```
/
├── src/
│   ├── components/
│   │   ├── Section1MemoryProblem.tsx       # Live O(T) KV cache vs fixed-size state comparison
│   │   ├── Section2EvolvingState.tsx       # Evolving state recurrence inspector
│   │   ├── Section3Capacity.tsx            # Dimension controls & singular spectrum
│   │   ├── Section4Interference.tsx        # Probe query & Truth-Beside-Estimate
│   │   ├── Section5CompareStrategies.tsx   # 4-way architectural comparison
│   │   ├── Section6BreakIt.tsx             # Stress test & capacity collapse
│   │   ├── Section7BDHModule.tsx           # Pathway BDH & BDH-CQ frontier module
│   │   ├── Section8Challenge.tsx           # 60-second diagnostic challenge
│   │   ├── Section9Limitations.tsx         # 5 documented boundary limitations
│   │   └── Section10SummaryModal.tsx       # PDF-ready 1-page executive brief
│   ├── visualizations/
│   │   ├── StateMatrixHeatmap.tsx          # 2D Canvas/SVG matrix weights inspector
│   │   ├── MemoryGrowthChart.tsx           # Linear vs flat memory footprint
│   │   ├── SignalNoiseDecomposition.tsx    # Signal vs Noise proportion & SNR gauge
│   │   ├── LatentRecurrenceDiagram.tsx     # BDH-CQ latent workspace vs CoT diagram
│   │   └── CapacityPhasePlot.tsx           # Empirical accuracy vs T/d phase curve
│   ├── math/
│   │   ├── linalg.ts                       # Pure vector/matrix linear algebra
│   │   ├── associativeMemory.ts            # State update & signal decomposition
│   │   └── prng.ts                         # Mulberry32 deterministic PRNG
│   ├── data/
│   │   ├── syntheticTasks.ts               # Controlled entity fact codebook
│   │   ├── presets.ts                      # 6 deterministic experiment presets
│   │   ├── bdhBenchmarks.ts                # ARC-AGI-1 published metrics
│   │   └── diagnosticQuestions.ts          # Challenge scenarios
│   ├── types/
│   │   └── memory.ts                       # Type definitions
│   └── tests/
│       ├── linalg.test.ts                  # Linear algebra unit tests
│       ├── associativeMemory.test.ts       # Recurrent memory & decay tests
│       └── capacityBounds.test.ts          # Capacity saturation verification
│
├── research/
│   └── references.md                       # Primary literature verification
├── docs/
│   └── concept_summary.md                  # Printable 1-Page Concept Summary
├── EXPERIMENTS.md                          # 5 reproducible benchmark logs
├── SOURCES_AND_LICENSES.md                 # Asset licenses & attribution
├── AI_DISCLOSURE.md                        # Transparent AI assistance statement
├── vercel.json                             # Production deployment config
└── package.json
```

---

## 7. How to Run Locally

### Prerequisites
* Node.js v18+ (Tested on v24.14.0)
* npm v9+ (Tested on 11.9.0)

### Installation & Development
```bash
# 1. Clone repository
git clone https://github.com/IshantTripathi/memory-under-pressure.git
cd memory-under-pressure

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Running Automated Tests
```bash
npm run test
# or with Vitest directly:
npx vitest run
```

### Production Build
```bash
npm run build
```
Creates an optimized production bundle in `dist/` (<1MB, sub-second load time).

---

## 8. Reproducible Experiment Presets

The interface provides 6 deterministic presets:
1. **Clean Baseline ($T < d$):** $T=5, d=16$. Orthogonal regime, SNR $> +20\text{ dB}$, 100% exact retrieval.
2. **Capacity Threshold ($T \approx d$):** $T=16, d=16$. Matrix approaches full rank, mild cross-talk begins.
3. **Severe Saturation ($T \gg d$):** $T=60, d=8$. Catastrophic cross-talk noise, early facts buried under superposition.
4. **Selective Decay ($\lambda = 0.92$):** $T=35, d=16$. Exponential decay prevents state explosion, causing recency amnesia.
5. **Key Collision ($\rho = 0.70$):** $T=20, d=16$. Correlated key vectors force value leakage regardless of dimension.
6. **"Break It" Stress Benchmark:** $T=250, d=8$. Demonstrates hard geometric, representational, and interference capacity limits.

---

## 9. Limitations & Failure Cases

1. **Finite Rank:** An associative matrix $S_t \in \mathbb{R}^{d \times d}$ has rank at most $d$. It cannot match the dynamic input-dependent selective precision of non-linear Softmax attention when $T \gg d$.
2. **Exponential Decay Dilemma:** Setting $\lambda < 1.0$ is necessary to prevent numerical divergence, but exponentially discounts early context ($\lambda^t$), creating recency bias.
3. **Quasi-Orthogonality in Real Text:** Natural language embeddings are clustered, causing cross-talk to accumulate significantly faster than in idealized orthogonal codebooks.
4. **Toy Model Distinctions:** Our simulator uses a 2D associative matrix to make linear algebra inspectable; production architectures (BDH, Mamba, RetNet) utilize multi-layer sparse projections and input-dependent gating.

---

## 10. Licenses & Attribution

* **Code & Content:** MIT License (see [SOURCES_AND_LICENSES.md](./SOURCES_AND_LICENSES.md)).
* **Typography:** Inter & JetBrains Mono under SIL Open Font License 1.1.
* **AI Disclosure:** See [AI_DISCLOSURE.md](./AI_DISCLOSURE.md).
* **Research Citations:** Grounded in primary publications by Pathway, Microsoft Research, and ICML.
