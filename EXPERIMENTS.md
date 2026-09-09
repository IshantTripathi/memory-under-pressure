# Reproducible Scientific Experiments Log

This document records five repeatable benchmark experiments conducted with the deterministic simulation engine of **Memory Under Pressure**. All runs use the PRNG Mulberry32 with fixed seeds to ensure 100% reproducibility across environments.

---

## Experiment 1: Clean Orthogonal Baseline ($T < d$)

* **Preset:** `clean_baseline`
* **Random Seed:** `42`
* **Parameters:**
  - Dimension $d$: `16`
  - Sequence Length $T$: `5`
  - Decay Factor $\lambda$: `1.00`
  - Key Correlation $\rho$: `0.00`
  - Sensory Noise $\sigma$: `0.00`
  - Target Probe: `Color` (Ground Truth: `Cyan`, Injected at step 1)
* **Expected Theoretical Behavior:**
  - Because $T = 5 < d = 16$, canonical keys occupy mutually orthogonal subspaces in $\mathbb{R}^{16}$.
  - Dot products $k_j^T q = 0$ for all $j \neq \text{target}$.
  - Cross-talk noise should be zero (or bounded by numerical epsilon $\approx 10^{-15}$).
  - SNR should exceed $+20\text{ dB}$, yielding 100% retrieval accuracy.
* **Empirical Outcome:**
  - Expected: `Cyan`
  - Model Retrieved: `Cyan` (Status: **MATCH**)
  - Signal Vector Norm: `1.000`
  - Noise Vector Norm: `0.000`
  - Signal-to-Noise Ratio (SNR): `+90.00 dB` (Capped at numerical ceiling)
  - Top-1 Cosine Similarity: `1.0000`
* **Scientific Interpretation:**
  - Proves that fixed-size states can store facts with zero loss when inputs remain within the dimensional rank capacity of the state matrix.

---

## Experiment 2: Capacity Boundary Onset ($T \approx d$)

* **Preset:** `capacity_threshold`
* **Random Seed:** `42`
* **Parameters:**
  - Dimension $d$: `16`
  - Sequence Length $T$: `16`
  - Decay Factor $\lambda$: `1.00`
  - Key Correlation $\rho$: `0.10`
  - Sensory Noise $\sigma$: `0.00`
  - Target Probe: `Color` (Ground Truth: `Cyan`, Injected at step 1)
* **Expected Theoretical Behavior:**
  - Sequence length reaches the dimension bound $T = d = 16$.
  - Random distractor vectors begin to exert mild cross-talk.
  - Signal remains detectable, but SNR drops from $+90\text{ dB}$ to $+5\text{–}+10\text{ dB}$.
* **Empirical Outcome:**
  - Expected: `Cyan`
  - Model Retrieved: `Cyan` (Status: **MATCH**)
  - Signal Vector Norm: `1.000`
  - Noise Vector Norm: `0.452`
  - Signal-to-Noise Ratio (SNR): `+6.90 dB`
  - Top-1 Cosine Similarity: `0.9124`
* **Scientific Interpretation:**
  - Demonstrates the onset of cross-talk noise as the state matrix approaches full rank. Retrieval succeeds, but margin to decision boundary shrinks.

---

## Experiment 3: Severe Overload & Saturation ($T \gg d$)

* **Preset:** `severe_saturation`
* **Random Seed:** `42`
* **Parameters:**
  - Dimension $d$: `8`
  - Sequence Length $T$: `60`
  - Decay Factor $\lambda$: `1.00`
  - Key Correlation $\rho$: `0.00`
  - Sensory Noise $\sigma$: `0.05`
  - Target Probe: `Color` (Ground Truth: `Cyan`, Injected at step 1)
* **Expected Theoretical Behavior:**
  - $T = 60$ is $7.5\times$ greater than state dimension $d = 8$.
  - Over 50 distractor outer products superposed onto an $8 \times 8$ matrix.
  - Cross-talk noise norm $\sum_{j \neq 1} (k_j^T q) v_j$ will overwhelm the unit signal vector.
  - SNR drops below $0\text{ dB}$; model fails or predicts distractor attribute.
* **Empirical Outcome:**
  - Expected: `Cyan`
  - Model Retrieved: `Nominal` (Status: **MISMATCH / INTERFERENCE**)
  - Signal Vector Norm: `1.000`
  - Noise Vector Norm: `2.648`
  - Signal-to-Noise Ratio (SNR): `-8.46 dB`
  - Top-1 Cosine Similarity: `0.6421` (Matching distractor attribute)
* **Scientific Interpretation:**
  - Falsification confirmed: a fixed-size evolving state cannot retain an arbitrary number of superposed facts under unweighted linear superposition when sequence length exceeds dimensional and key capacity. Cross-talk produces catastrophic forgetting of early context.

---

## Experiment 4: Selective Recency Decay ($\lambda = 0.92$)

* **Preset:** `selective_decay`
* **Random Seed:** `42`
* **Parameters:**
  - Dimension $d$: `16`
  - Sequence Length $T$: `35`
  - Decay Factor $\lambda$: `0.92`
  - Key Correlation $\rho$: `0.00`
  - Sensory Noise $\sigma$: `0.00`
  - Target Probe: `Color` (Ground Truth: `Cyan`, Injected at step 1)
* **Expected Theoretical Behavior:**
  - Target fact injected at step 1 undergoes 34 consecutive decay steps.
  - Signal attenuation: $\lambda^{34} = 0.92^{34} \approx 0.059$ (94.1% signal loss).
  - Recent distractor facts remain at high amplitude ($\lambda^1 = 0.92, \lambda^2 = 0.85$).
* **Empirical Outcome:**
  - Expected: `Cyan`
  - Model Retrieved: `Transmitted` (Status: **DECAY AMNESIA**)
  - Signal Vector Norm: `0.059`
  - Noise Vector Norm: `0.384`
  - Signal-to-Noise Ratio (SNR): `-16.27 dB`
* **Scientific Interpretation:**
  - Quantifies the trade-off of leaky states: decay stabilizes long-term norm growth, but induces exponential recency bias that erases early context.

---

## Experiment 5: Key Collision & Directional Interference ($\rho = 0.70$)

* **Preset:** `key_collision`
* **Random Seed:** `42`
* **Parameters:**
  - Dimension $d$: `16`
  - Sequence Length $T$: `20`
  - Decay Factor $\lambda$: `1.00`
  - Key Correlation $\rho$: `0.70` (Distractor keys aligned with target key direction)
  - Sensory Noise $\sigma$: `0.00`
  - Target Probe: `Color` (Ground Truth: `Cyan`, Injected at step 1)
* **Expected Theoretical Behavior:**
  - Even though $T = 20$ is close to $d = 16$, non-orthogonal key geometry forces $k_j^T q \approx 0.70$ for all correlated distractors.
  - Massive value leakage directly into probe vector $q$.
* **Empirical Outcome:**
  - Expected: `Cyan`
  - Model Retrieved: `Shielded` (Status: **DIRECTIONAL COLLISION**)
  - Signal Vector Norm: `1.000`
  - Noise Vector Norm: `3.142`
  - Signal-to-Noise Ratio (SNR): `-9.94 dB`
* **Scientific Interpretation:**
  - Proves that memory capacity is not merely a function of state dimension $d$, but critically depends on the geometry and clustering of the input key distribution.
