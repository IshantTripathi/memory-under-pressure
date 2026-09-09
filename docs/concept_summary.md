# Memory Under Pressure: How Fixed-Size State Remembers, Updates, Interferes and Forgets
**DataForge 2026 — Pathway Track ("Explain the Frontier")**  
*Artifact:* https://memory-under-pressure-flax.vercel.app | *Repository:* https://github.com/IshantTripathi/memory-under-pressure

---

### Central Claim
> **"A fixed-size evolving state can process sequences whose duration grows without allocating a new memory slot for every token, but limited state capacity can cause interference and forgetting."**

A fixed-size state representation remains fixed with respect to sequence length $T$ for a fixed model configuration ($O(d^2)$ matrix parameters), avoiding linear growth in cached-token memory ($O(T \cdot d)$ in Transformer KV caches). However, fixed representation size does not imply unlimited capacity or zero information loss: past facts are superposed, creating cross-talk noise and selective forgetting under sequence pressure.

---

### Mechanism: Recurrence & Retrieval Decomposition
The educational substrate models an explicit 2D matrix state $S_t \in \mathbb{R}^{d \times d}$. Given input key-value pairs $(k_t, v_t)$ with $\|k_t\|=1, \|v_t\|=1$, the state evolves via:
$$S_t = \lambda S_{t-1} + \eta (v_t \otimes k_t^T)$$
where $\lambda \in [0, 1]$ is a recency decay factor and $\eta$ is learning rate. Probing the state with query vector $q$ retrieves $\hat{v} = S_t q$, which decomposes analytically into target signal plus cross-talk noise:
$$\hat{v} = \underbrace{\lambda^{t - t_{\text{target}}} (k_{\text{target}}^T q) v_{\text{target}}}_{\text{Signal Component } s} + \underbrace{\sum_{\tau \neq \text{target}} \lambda^{t-\tau} (k_\tau^T q) v_\tau}_{\text{Cross-Talk Noise Component } n}$$
The Signal-to-Noise Ratio is defined as $\text{SNR}_{\text{dB}} = 10 \log_{10}(\|s\|^2 / (\|n\|^2 + \epsilon))$. When $T \le d$ and keys form an orthonormal set ($k_\tau^T q = 0$ for $\tau \neq \text{target}$), noise is zero. But because $\mathbb{R}^d$ supports at most $d$ mutually orthogonal directions, storing $T > d$ associations forces non-orthogonal superpositions that degrade SNR.

---

### Why It Matters
As frontier models tackle long-horizon reasoning and agentic tasks, generating thousands of Chain-of-Thought (CoT) tokens causes severe memory bandwidth bottlenecks and quadratic prefill latency. Understanding evolving states is critical for evaluating post-Transformer architectures that replace external token buffers with compact internal memory.

---

### Architectural Comparison

| Dimension | Transformer (KV Cache) | Linear Attention / SSM | Dragon Hatchling (BDH) |
| :--- | :--- | :--- | :--- |
| **Working Memory** | Linear $O(T \cdot d)$ cached tokens | Fixed $O(d^2)$ matrix state in $T$ | Fixed $O(d^2)$ or particle graph in $T$ |
| **Step Cost** | $O(T)$ Memory-bandwidth bound | $O(d^2)$ Compute bound | Fixed in $T$ (latent recurrence) |
| **Reasoning Substrate** | Verbalized token emission (CoT) | Verbalized token emission | Iterative latent workspace (zero text tokens) |
| **Failure Mode** | VRAM exhaustion ($O(T)$ growth) | Rank saturation & cross-talk noise | Synaptic saturation in finite latent workspace |

---

### What the Learner Can Test (Interactive Simulator)
The accompanying simulator provides an intentionally small educational associative-memory model to make linear algebra inspectable. Learners manipulate real concept variables across 6 deterministic presets:
1. **Clean Baseline ($T=5, d=16$):** Orthonormal keys guarantee $0.000$ cross-talk noise and $+90\text{ dB}$ SNR.
2. **Capacity Threshold ($T=16, d=16$):** State approaches full rank; cross-talk begins.
3. **Severe Saturation ($T=60, d=8$):** $T \gg d$; outer products overwhelm signal, forcing interference failure.
4. **Selective Decay ($T=35, d=16, \lambda=0.92$):** $\lambda < 1$ prevents unbounded norm accumulation, but erases early context ($\lambda^{34} \approx 0.059$).
5. **Key Collision ($T=20, d=16, \rho=0.70$):** Correlated keys cause retrieval leakage even when dimension is relatively large.
6. **"Break-It" Stress Test ($T=250, d=8$):** Live phase-transition curve mapping retrieval accuracy against $T/d$ ratio.

---

### BDH & BDH-CQ Connection
Pathway researchers addressed recurrent representational limits in **Dragon Hatchling (BDH, arXiv:2509.26507)** by reformulating attention as dynamic synaptic plasticity over sparse particle graphs with $Q=K$ Hebbian self-affinity and non-negative activations. **BDH-CQ (arXiv:2608.09888)** extends this to in-context learning: demonstration examples update recurrent memory at inference time, and queries are solved iteratively in high-dimensional latent space without verbalizing text tokens. On the public ARC-AGI-1 evaluation set, a 150M BDH-CQ model achieved a published result of **29.5% pass@2 at $0.0007 per task**, establishing a reported cost-efficiency Pareto point.

---

### Limitations & Boundaries
1. **Finite Rank:** A matrix $S \in \mathbb{R}^{d \times d}$ has rank $\le d$. It cannot store arbitrarily many independent associations without interference as $T$ exceeds available state dimensions.
2. **Decay Dilemma:** In this recurrence, $\lambda < 1$ stabilizes norm accumulation but creates an exponential forgetting horizon ($\lambda^t$).
3. **Quasi-Orthogonality:** Real-world semantic embeddings are clustered; non-orthogonal keys cause leakage earlier than orthogonal codebooks.
4. **Toy Model Demarcation:** The simulator is an educational toy model, not production BDH.

---

### Takeaway
Fixed-size evolving states break the linear memory scaling of cached-token models, trading unbounded memory footprint for bounded representation capacity governed by linear algebra and geometry.

---

### Key References
1. Kosowski et al. (Pathway, 2025). *The Dragon Hatchling*. arXiv:2509.26507.
2. Engdahl et al. (Pathway, 2026). *BDH-CQ: In-Context Learning with Recurrent Latent Reasoning*. arXiv:2608.09888.
3. Schlag, Irie, Schmidhuber (2021). *Linear Transformers Are Secretly Fast Weight Programmers*. ICML 2021.
4. Sun et al. (Microsoft Research, 2023). *Retentive Network (RetNet)*. arXiv:2307.08621.
5. Gu & Dao (2023). *Mamba: Linear-Time Sequence Modeling with Selective State Spaces*. arXiv:2312.00752.
