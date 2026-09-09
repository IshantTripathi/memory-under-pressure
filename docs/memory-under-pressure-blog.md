# Memory Under Pressure: How Fixed-Size State Remembers, Updates, Interferes and Forgets

**Competition:** DataForge 2026 — Pathway Track ("Explain the Frontier")  
**Project:** *Memory Under Pressure*  
**Interactive Artifact:** [https://memory-under-pressure-flax.vercel.app](https://memory-under-pressure-flax.vercel.app)  
**Source Repository:** [https://github.com/IshantTripathi/memory-under-pressure](https://github.com/IshantTripathi/memory-under-pressure)  
**Target Audience:** Students, early-career ML engineers, and data scientists familiar with vectors, matrices, and basic neural networks who want to understand modern state-space and recurrent memory architectures.

---

## 1. Why Long Context Creates a Memory Problem

In contemporary Large Language Models (LLMs) built on standard multi-head attention (the Transformer architecture), context retention relies on an external buffer known as the **Key-Value (KV) Cache**. During autoregressive generation, every newly processed token generates a key vector $k_t \in \mathbb{R}^d$ and a value vector $v_t \in \mathbb{R}^d$ for each attention layer and head. Because standard attention computes pairwise Softmax dot products between the current query and all historical keys, none of these past vectors can be discarded.

As a consequence, the memory footprint required to maintain this history grows strictly linearly with sequence length $T$:
$$\text{KV-Cache Footprint} = 2 \times T \times d \times L \times \text{bytes per element}$$
where $T$ is the sequence length, $d$ is the head dimension, and $L$ is the number of layers. 

For modern context windows spanning 32,000 to 1,000,000+ tokens, this linear growth in cached-token memory presents a severe physical hurdle:
1. **GPU High-Bandwidth Memory (VRAM) Exhaustion:** Storing gigabytes of cached activations per concurrent user session exhausts available accelerator memory.
2. **Memory Bandwidth Bottleneck:** In autoregressive decoding, loading hundreds of megabytes of KV vectors from HBM into on-chip SRAM for every single generated token bounds generation throughput to memory bandwidth rather than compute FLOPs.
3. **Reasoning Token Overhead:** When frontier models attempt complex reasoning via extended Chain-of-Thought (CoT), generating thousands of intermediate reasoning tokens compounds KV cache accumulation and drastically elevates inference costs.

This tension motivates a fundamental architectural question: *Can a neural system process arbitrarily long token sequences using a memory representation that remains fixed with respect to sequence length $T$ for a fixed model configuration?*

---

## 2. The Central Falsifiable Claim

The educational premise of this project is organized around a single falsifiable technical hypothesis:

> **"A fixed-size evolving state can process sequences whose duration grows without allocating a new memory slot for every token, but limited state capacity can cause interference and forgetting."**

This statement contains two reciprocal assertions:
* **The Promise:** A recurrent model can maintain an internal working memory representation whose size is bounded independently of sequence length $T$ (for example, an explicit $d \times d$ matrix state requiring $O(d^2)$ parameters), avoiding per-token buffer allocation.
* **The Physical Constraint:** Because the representation size does not grow with $T$, incoming facts must share the same finite-dimensional subspace. This superposition inevitably produces cross-talk interference and forces information trade-offs as sequence length grows relative to the available state.

Our companion interactive simulator is built specifically to test the boundaries of this claim under controlled experimental conditions.

---

## 3. A Minimal Associative Memory Model

To make the algebraic mechanics of evolving states inspectable in real time, the project implements an **intentionally small educational associative-memory model inspired by the broader family of recurrent and state-based architectures** (such as Linear Transformers, RetNet, RWKV, and Fast Weight Programmers).

The model maintains an explicit 2D matrix state $S_t \in \mathbb{R}^{d \times d}$. At each discrete timestep $t \in \{1, 2, \dots, T\}$, the system receives a token representation decomposed into an association pair:
* **Key vector:** $k_t \in \mathbb{R}^d$, normalized such that $\|k_t\| = 1$, indicating the address or attribute slot (e.g., "Color", "Shield", "Telemetry").
* **Value vector:** $v_t \in \mathbb{R}^d$, normalized such that $\|v_t\| = 1$, encoding the attribute value (e.g., "Cyan", "Nominal", "Channel-4").

The state matrix updates according to a generalized outer-product recurrent rule:
$$S_t = \lambda S_{t-1} + \eta (v_t \otimes k_t^T)$$
where:
* $S_t$ is the recurrent state matrix of dimension $d \times d$ at step $t$ (initialized to $S_0 = 0$).
* $\lambda \in [0, 1]$ is a recency decay factor that attenuates existing state entries.
* $\eta \in \mathbb{R}^+$ is the learning or update rate (default $\eta = 1.0$).
* $v_t \otimes k_t^T = v_t k_t^T$ denotes the outer product of the value and key vectors, producing a rank-1 matrix of size $d \times d$ where entry $(i, j)$ equals $v_{t, i} k_{t, j}$.

By expanding this recurrence from $t = 1$ to $t$, the state matrix at any step can be written in closed form:
$$S_t = \sum_{\tau=1}^t \lambda^{t-\tau} \eta (v_\tau k_\tau^T)$$

---

## 4. What the State Matrix Actually Stores

Standard Transformer models store a list of isolated vectors: $[k_1, k_2, \dots, k_t]$ and $[v_1, v_2, \dots, v_t]$. In contrast, an associative recurrent state stores the **linear superposition of outer products**.

Each cell $S_{i, j}$ in the matrix tracks the accumulated correlation between the $i$-th feature of past values and the $j$-th feature of past keys:
$$S_{i, j}^{(t)} = \sum_{\tau=1}^t \lambda^{t-\tau} \eta \, v_{\tau, i} \, k_{\tau, j}$$

Because matrix addition is commutative and associative, the state acts as an integrated memory canvas:
* Information is distributed across the entire matrix rather than sequestered in distinct token slots.
* The Frobenius norm $\|S_t\|_F = \sqrt{\sum_{i,j} S_{i,j}^2}$ provides a scalar metric of total accumulated memory energy.
* In the absence of decay ($\lambda = 1.0$), the norm grows monotonically as new facts are added. With decay ($\lambda < 1.0$), the norm stabilizes toward a steady-state bound determined by the balance between incoming outer-product energy and exponential attenuation.

---

## 5. Retrieval: Asking the State for a Fact

To retrieve the value associated with a specific query key $q \in \mathbb{R}^d$ (with $\|q\| = 1$), the model computes a standard matrix-vector product:
$$\hat{v} = S_t q$$

Substituting the closed-form expansion of $S_t$:
$$\hat{v} = \left( \sum_{\tau=1}^t \lambda^{t-\tau} \eta \, v_\tau k_\tau^T \right) q = \sum_{\tau=1}^t \lambda^{t-\tau} \eta \, v_\tau (k_\tau^T q)$$

Notice the associative re-grouping: because matrix multiplication is associative, $(v_\tau k_\tau^T) q = v_\tau (k_\tau^T q)$. The scalar dot product $k_\tau^T q$ measures the cosine similarity between the query probe $q$ and each historical key $k_\tau$. 

The retrieved output $\hat{v} \in \mathbb{R}^d$ is therefore a linear combination of all historical value vectors, weighted by:
1. Their key similarity to the query ($k_\tau^T q$), and
2. Their recency attenuation factor ($\lambda^{t-\tau}$).

To determine which discrete fact the model predicts, $\hat{v}$ is matched against a codebook of known candidate value representations using cosine similarity:
$$\text{predicted\_value} = \arg\max_{c \in \mathcal{V}} \frac{\hat{v}^T v_c}{\|\hat{v}\| \|v_c\|}$$

---

## 6. Signal, Noise and Interference

When we query the memory for a specific fact injected at step $t_{\text{target}}$ with key $k_{\text{target}}$ and value $v_{\text{target}}$, the retrieval expression decomposes analytically into two orthogonal parts:
$$\hat{v} = \underbrace{\lambda^{t - t_{\text{target}}} \eta (k_{\text{target}}^T q) v_{\text{target}}}_{\text{Target Signal Vector } s} + \underbrace{\sum_{\tau \neq t_{\text{target}}} \lambda^{t-\tau} \eta (k_\tau^T q) v_\tau}_{\text{Cross-Talk Noise Vector } n}$$

* **Target Signal ($s$):** The portion of the output aligned with the true value vector $v_{\text{target}}$. If the probe key perfectly matches the target key ($q = k_{\text{target}}$), then $k_{\text{target}}^T q = 1.0$, and the signal norm is $\|s\| = \lambda^{t - t_{\text{target}}} \eta$.
* **Cross-Talk Noise ($n$):** The vector sum of all *other* historical values $v_\tau$, each scaled by the dot product $k_\tau^T q$. Whenever historical keys are not perfectly orthogonal to the query ($k_\tau^T q \neq 0$), a fraction of their value vector leaks into the retrieval.

We define the **Signal-to-Noise Ratio (SNR)** in decibels:
$$\text{SNR}_{\text{dB}} = 10 \log_{10} \left( \frac{\|s\|^2}{\|n\|^2 + \epsilon} \right)$$
where $\epsilon = 10^{-12}$ prevents division by zero.

* **$\text{SNR} > +15\text{ dB}$ (High Fidelity):** The signal vector completely dominates the noise vector. The nearest-neighbor codebook lookup reliably identifies the correct value.
* **$0\text{ dB} \le \text{SNR} \le +10\text{ dB}$ (Degraded / Borderline):** Cross-talk noise distorts the retrieved vector. Depending on the angular separation of candidate codebook values, retrieval may succeed or begin to misclassify.
* **$\text{SNR} < 0\text{ dB}$ (Interference Collapse):** The accumulated cross-talk noise norm exceeds the target signal norm ($\|n\| > \|s\|$). The model outputs a spurious attribute or hallucinated value corresponding to the dominant direction of distractor keys.

---

## 7. Why Capacity Depends on State Dimension

Why cannot a fixed-size matrix state store an unbounded number of facts cleanly? The answer lies in linear algebra's dimension theorem.

In a Euclidean vector space $\mathbb{R}^d$:
1. **Orthogonal Subspace Bound:** At most $d$ non-zero vectors can be mutually orthogonal ($k_i^T k_j = 0$ for all $i \neq j$). More than $d$ mutually orthogonal vectors are mathematically impossible in $\mathbb{R}^d$.
2. **Zero Cross-Talk Regime ($T \le d$):** If sequence length $T \le d$ and the key vectors are drawn from an orthonormal basis, then for any query $q = k_{\text{target}}$, we have $k_\tau^T q = 0$ for all $\tau \neq \text{target}$. The cross-talk noise vector is identically zero:
   $$n = \sum_{\tau \neq \text{target}} \lambda^{t-\tau} \eta (0) v_\tau = \mathbf{0} \implies \text{SNR} \to \infty$$
3. **Superposition Saturation ($T > d$):** When the number of stored facts $T$ exceeds the state dimension $d$, the pigeonhole principle guarantees that incoming key vectors must be linearly dependent on the existing keys. They cannot be orthogonal to all preceding keys.
4. **Rank Bottleneck:** A matrix $S_t \in \mathbb{R}^{d \times d}$ formed by summing outer products has algebraic rank at most $\min(d, T)$. For $T \gg d$, the matrix rank saturates at $d$. As new rank-1 updates are continuously added, the singular values shift, and existing directional subspaces become overwritten or contaminated by non-zero projections.

---

## 8. Decay and Forgetting

To prevent the entries of $S_t$ from growing without bound when processing long sequences, recurrent architectures introduce an exponential decay factor $\lambda < 1.0$.

In our educational model:
$$S_t = \lambda S_{t-1} + \eta (v_t k_t^T)$$

The impact of $\lambda$ on memory retention is exact and quantifiable:
* A fact written at step $\tau$ is multiplied by $\lambda$ at every subsequent step. By step $t$, its signal amplitude has decayed to $\lambda^{t-\tau}$.
* **Numerical Stability:** If $\lambda < 1.0$, the steady-state maximum Frobenius norm of the matrix is bounded by $\|S_\infty\|_F \le \frac{\eta}{1 - \lambda}$, preventing numerical overflow even as $T \to \infty$.
* **The Recency Dilemma:** This stability comes at a severe cost: **exponential recency amnesia**. If $\lambda = 0.90$, a fact stored 30 steps ago has an effective signal strength of:
  $$0.90^{30} \approx 0.042 \implies 95.8\% \text{ signal attenuation}$$
While recent facts (stored at $t-1$ or $t-2$) remain strong, early context is effectively erased. Recurrent architectures that rely on scalar decay cannot simultaneously achieve unbounded retention and numerical boundedness without non-linear gating or selective mechanisms.

---

## 9. Key Correlation and Information Leakage

In idealized theoretical analyses, keys are often assumed to be uniformly random or orthogonal. In natural language text, however, token embeddings are densely clustered on semantic submanifolds with high mutual cosine similarities ($\rho = k_i^T k_j > 0$).

When key vectors are correlated ($\rho > 0$):
$$\hat{v} = s + \sum_{\tau \neq \text{target}} \lambda^{t-\tau} \eta \rho_\tau v_\tau$$

Even if the state dimension is large (e.g., $d = 64$) and sequence length is small (e.g., $T = 10$), non-orthogonal keys cause every distractor token to leak a fraction $\rho_\tau$ of its value into the output. 

Correlated keys can induce retrieval leakage even when the state dimension is large, depending on the update and retrieval conditions. This demonstrates that **usable memory capacity is not solely a function of matrix dimension $d$; it is fundamentally constrained by the geometric distribution and angular separation of the input keys.**

---

## 10. Interactive Experiments in Memory Under Pressure

The repository's interactive simulator exposes 6 deterministic presets, allowing learners to observe these mathematical phase transitions directly. All presets use the deterministic Mulberry32 PRNG (seed 42) for exact reproducibility:

| Preset Name | Configuration | Theoretical Prediction | Empirical Simulator Outcome |
| :--- | :--- | :--- | :--- |
| **Clean Baseline** | $T=5, d=16, \lambda=1.00, \rho=0.00$ | Orthogonal regime ($T < d$). Keys mutually perpendicular. | Noise = $0.000$, $\text{SNR} = +90.00\text{ dB}$ (ceiling), 100% exact retrieval. |
| **Capacity Threshold** | $T=16, d=16, \lambda=1.00, \rho=0.10$ | Dimension bound ($T = d$). Matrix approaches full rank. | Noise = $0.452$, $\text{SNR} = +6.90\text{ dB}$, target retrieved with reduced margin. |
| **Severe Saturation** | $T=60, d=8, \lambda=1.00, \sigma=0.05$ | Superposition saturation ($T = 7.5 d$). Noise norm exceeds signal norm. | Noise = $2.648$, $\text{SNR} = -8.46\text{ dB}$, retrieval fails (outputs distractor value). |
| **Selective Decay** | $T=35, d=16, \lambda=0.92, \rho=0.00$ | Early fact ($t=1$) attenuated by $0.92^{34} \approx 0.059$. | Signal attenuated by 94.1%, $\text{SNR} = -16.27\text{ dB}$, model exhibits recency amnesia. |
| **Key Collision** | $T=20, d=16, \lambda=1.00, \rho=0.70$ | Correlated keys leak value energy regardless of state size. | Noise = $3.142$, $\text{SNR} = -9.94\text{ dB}$, severe directional interference. |
| **Break-It Stress** | $T=250, d=8, \lambda=0.99, \sigma=0.15$ | Catastrophic overload. 250 facts forced into $8 \times 8$ matrix. | Accuracy drops along empirical phase-transition curve from 100% to <10%. |

---

## 11. The Failure Cases

A hallmark of rigorous scientific communication is the explicit documentation of boundary limitations. The educational simulator exposes five concrete failure modes:

1. **Finite-Rank Saturation:** An associative state matrix $S \in \mathbb{R}^{d \times d}$ has rank at most $d$. A finite matrix state cannot represent arbitrarily many independent associations without interference as the number of stored associations grows relative to the available state.
2. **The Leaky State Dilemma:** In this recurrence, setting $\lambda < 1.0$ attenuates older state contributions and helps prevent unbounded state norm accumulation over long sequences. However, this creates an exponential forgetting horizon where signals scale as $\lambda^t$, inducing recency amnesia.
3. **Quasi-Orthogonality in Real Text:** Natural language embeddings occupy clustered semantic clusters. Real-world recurrent states experience cross-talk far sooner than idealized orthogonal synthetic benchmarks.
4. **Linear vs. Non-Linear Selectivity:** Standard Transformers use Softmax dot-product attention, which computes $\exp(q^T k_i / \sqrt{d})$. The exponential function acts as a continuous argmax, suppressing small dot products to near-zero. Linear associative states compute unweighted sums, meaning even small dot products ($0.15$) accumulate linearly until they overwhelm the signal.
5. **Educational Toy vs. Frontier Architectures:** The simulator uses an explicit 2D matrix of size $d \times d$ to make linear algebra inspectable. Production architectures utilize multi-layer representations, non-linear activation functions, input-dependent gating, and multi-head sparse projections.

---

## 12. Connection to Dragon Hatchling (BDH)

How does frontier AI research address the representational limits of linear recurrence? 

In 2025, researchers at Pathway introduced **Dragon Hatchling (BDH, arXiv:2509.26507)**. BDH is a bio-inspired Post-Transformer architecture designed to bridge the gap between artificial attention mechanisms and neuroscience models of the brain.

It is vital to understand the pedagogical relationship:
* **The toy model in this repository is NOT official BDH.** The repository uses a minimal associative outer-product matrix to teach the foundational concepts of fixed-state memory, subspace capacity, and interference.
* **BDH is a much richer architecture:** Instead of an unconstrained dense outer-product matrix, BDH models the network as a scale-free graph of locally interacting "neuron particles."
* **Hebbian Plasticity ($Q = K$):** Standard Transformers compute attention between arbitrary query and key projections ($Q K^T$). In biological neuroscience, Donald Hebb's rule states: *"Neurons that fire together, wire together."* BDH constrains queries and keys to identical projections ($Q = K$) derived from sparse, non-negative activations ($\text{ReLU}$). The resulting attention matrix is directly interpretable as dynamic synaptic weights.
* **In-Context Plasticity:** During inference, BDH updates its synaptic connections dynamically without backpropagation or weight fine-tuning, allowing the network to adapt to demonstration streams while maintaining a fixed internal state representation.

---

## 13. BDH-CQ and Demonstration-Based Reasoning

In August 2026, Pathway researchers introduced **BDH-CQ (arXiv:2608.09888)**, extending the Dragon Hatchling architecture to long-horizon demonstration learning and iterative reasoning.

In conventional LLMs, complex reasoning requires generating extended verbal Chain-of-Thought (CoT) text tokens. Each generated token must be appended to the KV cache, driving inference cost and latency up quadratically with reasoning depth.

BDH-CQ introduces two distinct innovations:
1. **Recurrent In-Context Demo Ingestion:** In-context demonstrations update the model's recurrent synaptic memory at inference time without gradient fine-tuning.
2. **Latent Workspace Recurrence:** Rather than emitting hundreds of verbal tokens to solve multi-step reasoning queries, BDH-CQ performs iterative recurrence directly within high-dimensional latent space ($z_{k} = \text{step}(z_{k-1}, S_t)$). Reasoning occurs in latent state representations without text token emission.

### Verified Published Benchmark Evidence
On the public ARC-AGI-1 evaluation set, published research results for BDH-CQ report:
* **Model Scale:** Approximately 150 million parameters (150M).
* **Reasoning Accuracy:** **29.5% pass@2** on the public ARC-AGI-1 evaluation set.
* **Inference Cost:** **$0.0007 per task** (under one-tenth of a cent).
* **Citation:** Engdahl et al. (Pathway), *BDH-CQ: In-Context Learning with Recurrent Latent Reasoning*, arXiv:2608.09888 (August 2026).

*Transparency Demarcation:* This result is cited directly from primary published literature as a reported cost-efficiency Pareto point on the public benchmark. It is not presented as the highest raw-accuracy system on ARC-AGI, nor is the educational toy simulator in this repository an implementation of BDH-CQ.

---

## 14. Comparing Fixed-State Memory with Attention/KV Caches

To place evolving states in proper context, we compare five distinct sequence-processing paradigms across key architectural dimensions:

| Architectural Dimension | Standard Transformer (KV Cache) | Recurrent Vector (RNN / GRU) | Linear Attention / SSM (RetNet, Mamba) | Dragon Hatchling (BDH) |
| :--- | :--- | :--- | :--- | :--- |
| **Working Memory Mechanism** | External buffer of uncompressed key-value vectors | Single hidden vector $h_t \in \mathbb{R}^d$ updated non-linearly | Matrix state $S_t \in \mathbb{R}^{d \times d}$ or selective state parameters | Dynamic synaptic plasticity over scale-free particle graph |
| **Memory Footprint Scaling** | Linear $O(T \cdot d \cdot L)$ in sequence length $T$ | Fixed $O(d)$ with respect to sequence length $T$ | Fixed $O(d^2)$ with respect to sequence length $T$ | Fixed with respect to sequence length $T$ for fixed config |
| **Inference Step Cost** | $O(T)$ Memory-bandwidth bound (scales with context) | $O(d^2)$ Compute bound (constant per step) | $O(d^2)$ Compute bound (constant per step) | Fixed with respect to sequence length $T$ |
| **Information Retention** | Exact lossless token storage within context limit | Severe bottleneck (compressed into $d$ scalar values) | Linear superposition; subject to cross-talk interference | Dynamic synaptic adaptation; bounded by latent capacity |
| **Long-Horizon Failure Mode** | VRAM out-of-memory (OOM) exhaustion | Vanishing gradients / catastrophic forgetting | Rank saturation & cross-talk noise ($T > d$) | Synaptic saturation in finite latent workspace |

*Scientific Precision Rule:* A fixed-size state keeps the state representation fixed with respect to sequence length for a fixed model configuration, rather than allocating a new memory slot for every token. This does not imply unlimited information capacity or zero information loss.

---

## 15. What This Toy Model Does NOT Claim

Intellectual honesty requires establishing what our educational simulator does **not** do:
1. **Not an Official BDH Implementation:** The simulator is an educational matrix model designed to make the linear algebra of recurrence visible. It does not execute the multi-layer, scale-free particle graph algorithm of BDH.
2. **Not a Replacement for Softmax Attention:** The educational model demonstrates that unconstrained linear associative recall cannot achieve the sharp, non-linear selective focus of Softmax attention when key distributions are non-orthogonal.
3. **No Infinite Context Without Loss:** The model proves that while fixed-size states can ingest arbitrarily long sequences without memory allocation growth, information retrieval degrades along a predictable capacity curve once sequence length exceeds available subspace dimensions.
4. **No Universal OOM Immunity:** While a fixed-size state avoids sequence-length OOM from cached token vectors, an overall system can still exhaust memory due to activation storage, batch size, or parameter footprint.

---

## 16. Evidence and Research Context

The concepts taught in this project are grounded in peer-reviewed and preprint literature published between 1982 and 2026:

* **Linear Attention as Fast Weights:** Schlag, Irie, & Schmidhuber (ICML 2021) mathematically established that unnormalized linear Transformers are equivalent to fast-weight recurrent associative memories that update matrix states via outer products.
* **Retention Networks:** Sun et al. (Microsoft Research, 2023) demonstrated that multi-scale retention with explicit exponential decay ($\lambda < 1.0$) achieves constant inference memory and linear-time training.
* **Selective State Spaces:** Gu & Dao (2023, Mamba) showed that making recurrent transition matrices input-dependent allows models to selectively filter relevant tokens into compressed states.
* **Synaptic Plasticity & Recurrent Reasoning:** Kosowski et al. (2025, arXiv:2509.26507) and Engdahl et al. (2026, arXiv:2608.09888) demonstrated that Hebbian attention ($Q=K$) and latent recurrent reasoning achieve remarkable cost-efficiency Pareto trade-offs on challenging reasoning benchmarks.

---

## 17. Reproducibility

Every interactive figure, metric, and table in this project is 100% reproducible:
1. **Deterministic PRNG:** All synthetic tasks and vector generations use the Mulberry32 pseudorandom generator with fixed seeds (seed 42 for standard benchmarks, seed 555 for diagnostic questions).
2. **Automated Unit Testing:** 12 automated unit tests in Vitest verify vector normalization, outer-product algebra, Frobenius norm conservation, SNR decomposition, and singular spectrum computation.
3. **Open-Source Codebase:** Complete source code is available on GitHub under the MIT License, with step-by-step reproduction instructions in `README.md` and detailed logs in `EXPERIMENTS.md`.

---

## 18. AI Assistance and Disclosure

In full accordance with competition transparency guidelines, AI tools were utilized during the development of this project for:
* Scaffolding initial React 19 + TypeScript + Tailwind CSS component templates.
* Assisting with vector linear algebra helper routines and automated unit test assertions.
* Editorial feedback on technical writing clarity and formatting.

**Human / Team Ownership:** The human team directed the conceptual scope, selected the central falsifiable claim, structured the 10-module pedagogical progression, audited every mathematical formula and citation against primary sources, established the university laboratory visual design, and executed all verification builds and tests.

---

## 19. References

1. **Kosowski, A., Uznański, P., Chorowski, J., Stamirowska, Z., & Bartoszkiewicz, M.** (2025). *The Dragon Hatchling: The Missing Link between the Transformer and Models of the Brain*. [arXiv:2509.26507](https://arxiv.org/abs/2509.26507).
2. **Engdahl, B., Kosowski, A., Chorowski, J., Stamirowska, Z., Uznański, P., Jiang, J., Phadke, R., Kinas, R., & Zhong, R.** (2026). *BDH-CQ: In-Context Learning with Recurrent Latent Reasoning*. [arXiv:2608.09888](https://arxiv.org/abs/2608.09888).
3. **Schlag, I., Irie, K., & Schmidhuber, J.** (2021). *Linear Transformers Are Secretly Fast Weight Programmers*. In *Proceedings of the 38th International Conference on Machine Learning (ICML 2021)*. [arXiv:2102.11174](https://arxiv.org/abs/2102.11174).
4. **Sun, Y., Dong, L., Huang, S., Ma, S., Xia, Y., Xue, J., Wang, J., & Wei, F.** (2023). *Retentive Network: A Successor to Transformer for Large Language Models*. Microsoft Research. [arXiv:2307.08621](https://arxiv.org/abs/2307.08621).
5. **Gu, A., & Dao, T.** (2023). *Mamba: Linear-Time Sequence Modeling with Selective State Spaces*. [arXiv:2312.00752](https://arxiv.org/abs/2312.00752).
6. **Hopfield, J. J.** (1982). *Neural Networks and Physical Systems with Emergent Collective Computational Abilities*. *Proceedings of the National Academy of Sciences (PNAS)*, 79(8), 2554–2558.
