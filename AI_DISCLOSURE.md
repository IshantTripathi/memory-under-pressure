# AI Assistance Disclosure

**Competition:** DataForge 2026 — Pathway Track ("Explain the Frontier")  
**Project:** Memory Under Pressure: How AI Models Remember, Update and Forget Across Long Sequences  

In full accordance with competition transparency requirements, this document outlines how AI tools and assistants were leveraged during the conception, development, and validation of this project.

---

## 1. Scope of AI Assistance

### A. Ideation & Concept Architecture
* **Assistance Used:** AI models were used to explore pedagogical frameworks for conveying abstract mathematical concepts (such as state rank saturation, outer-product superposition, and Signal-to-Noise Ratio degradation) into interactive web components.
* **Human / Team Ownership:** The central falsifiable claim, the 10-section narrative progression, and the decision to link linear associative memory directly to Pathway's BDH and BDH-CQ architectures were directed by the team.

### B. Literature Survey & Reference Verification
* **Assistance Used:** AI-assisted search tools were used to locate primary arXiv preprints, benchmark tables, and author lists for Pathway's *The Dragon Hatchling* (arXiv:2509.26507) and *BDH-CQ* (arXiv:2608.09888).
* **Verification:** All paper citations, DOIs, benchmark metrics (e.g. 29.5% pass@2 on ARC-AGI-1 at $0.0007 per task), and author affiliations were independently verified against official primary sources. No fabricated or unverified citations are included.

### C. Software Engineering & Implementation
* **Assistance Used:** AI pair-programming was utilized to scaffold the React + TypeScript + Tailwind CSS project structure, generate vector math helper functions (dot product, outer product, power iteration singular value decomposition), and assemble UI components.
* **Verification:** The core mathematical routines for vector algebra, outer-product recurrence, Frobenius norm energy conservation, SNR decomposition, and PRNG determinism are validated via an automated unit test suite in Vitest (`npm test`, 12 passing tests), confirming algebraic correctness, energy conservation, and deterministic PRNG behavior.

### D. Technical Writing & Documentation
* **Assistance Used:** AI tools assisted in drafting initial prose for the README, concept summary, and experiment logs.
* **Human / Team Ownership:** The text was rigorously edited to eliminate generic marketing buzzwords ("AI slop"), enforce concise technical definitions, and ensure that educational toy models are explicitly separated from production benchmark results.

---

## 2. Technical Ownership & Live Defense Statement

The team fully understands and can independently defend every mathematical equation, architectural decision, and line of source code presented in this repository, including:
1. The mathematical derivation of the signal-to-noise ratio in linear associative memory: $\hat{v} = S_t q = \text{Signal} + \text{Noise}$.
2. The exact relationship between state dimension $d$ and orthogonal subspace capacity.
3. The architectural distinction between Transformer KV-cache expansion ($O(T \cdot d)$) and recurrent synaptic plasticity (fixed footprint $O(d^2)$ with respect to sequence length $T$ for a fixed model configuration).
4. How BDH-CQ operates in latent space to bypass verbalized Chain-of-Thought token generation.
