import React from 'react';
import { X, Printer } from 'lucide-react';

interface SummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Section10SummaryModal: React.FC<SummaryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-dark-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-dark-950">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              EXECUTIVE BRIEF
            </span>
            <h2 className="text-sm sm:text-base font-bold text-white">
              One-Page Concept Summary (PDF / Print-Ready)
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-800 hover:bg-dark-700 text-slate-200 text-xs font-mono border border-slate-700 transition-colors"
            >
              <Printer size={13} />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-dark-800 hover:bg-dark-700 text-slate-400 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Modal Body / Printable Document */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-200 text-xs sm:text-sm leading-relaxed bg-dark-950 font-sans print:p-0 print:bg-white print:text-black">
          {/* Header Block */}
          <div className="border-b border-slate-800 pb-4 print:border-black">
            <div className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 print:text-blue-700">
              DataForge 2026 Pathway Track — Explain the Frontier
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white print:text-black mt-1">
              Memory Under Pressure: How AI Models Remember, Update and Forget Across Long Sequences
            </h1>
            <p className="text-xs text-slate-400 print:text-gray-600 font-mono mt-1">
              Core Concept: Long-Horizon Evolving State & Synaptic Recurrence | Target Audience: CS/AI Engineers & Researchers
            </p>
          </div>

          {/* Section 1: Problem Pressure & The Central Claim */}
          <div className="space-y-2">
            <h3 className="font-bold text-cyan-400 print:text-blue-800 font-mono uppercase text-xs tracking-wider">
              1. Problem & Central Falsifiable Claim
            </h3>
            <p>
              Standard Transformer architectures maintain historical working memory by appending every input token to an external Key-Value (KV) cache. Over long sequences, this causes an <strong className="text-white print:text-black">O(T · d) linear memory explosion</strong> in high-bandwidth GPU memory (VRAM), creating severe serving bottlenecks and high inference costs on reasoning tasks.
            </p>
            <div className="p-3 bg-dark-900 print:bg-gray-100 rounded border border-slate-800 print:border-gray-300 font-mono text-xs">
              <strong className="text-cyan-300 print:text-blue-900">Central Falsifiable Claim:</strong> &quot;A fixed-size evolving state can process sequences whose duration grows without allocating a new memory slot for every token, but limited state capacity can cause interference and forgetting.&quot;
            </div>
          </div>

          {/* Section 2: Mathematical Mechanism */}
          <div className="space-y-2">
            <h3 className="font-bold text-cyan-400 print:text-blue-800 font-mono uppercase text-xs tracking-wider">
              2. Mathematical Mechanism of State Update & Interference
            </h3>
            <p>
              In linear recurrent associative memory, the model maintains a fixed matrix state <code className="font-mono text-cyan-300 print:text-blue-900">S_t ∈ ℝ^(d × d)</code>. At each timestep <code className="font-mono">t</code>, an incoming key-value token pair <code className="font-mono">(k_t, v_t)</code> updates the state via:
            </p>
            <div className="p-2.5 bg-dark-900 print:bg-gray-100 rounded border border-slate-800 print:border-gray-300 font-mono text-center text-xs">
              S_t = λ S_{'{t-1}'} + η (v_t ⊗ k_t^T)
            </div>
            <p>
              When queried with probe vector <code className="font-mono">q</code>, retrieval decomposes exactly into target signal plus cross-talk noise:
            </p>
            <div className="p-2.5 bg-dark-900 print:bg-gray-100 rounded border border-slate-800 print:border-gray-300 font-mono text-center text-xs">
              v̂ = S_t q = λ^(t - t_target) (k_target^T q) v_target + ∑_{'{j ≠ target}'} λ^(t - t_j) (k_j^T q) v_j
            </div>
            <p>
              If <code className="font-mono">T ≤ d</code> and keys are orthogonal, cross-talk is zero. But as <code className="font-mono">T &gt; d</code>, vectors in <code className="font-mono">ℝ^d</code> cannot remain mutually orthogonal. Cross-talk noise accumulates linearly, causing the Signal-to-Noise Ratio (SNR) to drop and memory retrieval to degrade.
            </p>
          </div>

          {/* Section 3: Frontier Connection to BDH and BDH-CQ */}
          <div className="space-y-2">
            <h3 className="font-bold text-cyan-400 print:text-blue-800 font-mono uppercase text-xs tracking-wider">
              3. Pathway Frontier Connection: BDH & BDH-CQ
            </h3>
            <p>
              Pathway researchers reformulated attention into biologically plausible synaptic memory in <strong className="text-white print:text-black">BDH (Baby Dragon Hatchling, arXiv:2509.26507)</strong>. Instead of storing tokens in an external KV cache, BDH implements working memory as dynamic synaptic plasticity across locally interacting neuron particles with non-negative sparse ReLU activations and <code className="font-mono">Q = K</code> Hebbian self-affinity.
            </p>
            <p>
              In <strong className="text-white print:text-black">BDH-CQ (arXiv:2608.09888, Aug 2026)</strong>, in-context demonstrations continuously update the model&apos;s recurrent memory at inference time without parameter fine-tuning. The model then solves queries through iterative computation directly within high-dimensional latent space—<strong className="text-white print:text-black">without verbalizing intermediate Chain-of-Thought reasoning tokens</strong>. On the public ARC-AGI-1 benchmark, a 150M-parameter BDH-CQ achieved <strong className="text-emerald-400 print:text-green-800">29.5% pass@2 at $0.0007 per task</strong> (under 1/10th of a cent), breaking previous cost-accuracy Pareto frontiers.
            </p>
          </div>

          {/* Section 4: Architectural Trade-Off Matrix */}
          <div className="space-y-2">
            <h3 className="font-bold text-cyan-400 print:text-blue-800 font-mono uppercase text-xs tracking-wider">
              4. Comparative Architectural Trade-Off Matrix
            </h3>
            <table className="w-full text-left text-[11px] font-mono border-collapse border border-slate-800 print:border-gray-400">
              <thead>
                <tr className="bg-dark-900 print:bg-gray-200">
                  <th className="p-1.5 border border-slate-800 print:border-gray-400">Architecture</th>
                  <th className="p-1.5 border border-slate-800 print:border-gray-400">Memory Complexity</th>
                  <th className="p-1.5 border border-slate-800 print:border-gray-400">Inference Step</th>
                  <th className="p-1.5 border border-slate-800 print:border-gray-400">Long-Horizon Bottleneck</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-1.5 border border-slate-800 print:border-gray-400 font-semibold">Transformer (KV Cache)</td>
                  <td className="p-1.5 border border-slate-800 print:border-gray-400">O(T · d) [Linear]</td>
                  <td className="p-1.5 border border-slate-800 print:border-gray-400">O(T) Bandwidth bound</td>
                  <td className="p-1.5 border border-slate-800 print:border-gray-400">VRAM exhaustion & token verbalization cost</td>
                </tr>
                <tr>
                  <td className="p-1.5 border border-slate-800 print:border-gray-400 font-semibold">Recurrent RNN/GRU</td>
                  <td className="p-1.5 border border-slate-800 print:border-gray-400">O(d) [Constant]</td>
                  <td className="p-1.5 border border-slate-800 print:border-gray-400">O(d^2) Compute bound</td>
                  <td className="p-1.5 border border-slate-800 print:border-gray-400">Severe vector capacity bottleneck (size d)</td>
                </tr>
                <tr>
                  <td className="p-1.5 border border-slate-800 print:border-gray-400 font-semibold">Linear Associative / SSM</td>
                  <td className="p-1.5 border border-slate-800 print:border-gray-400">O(d^2) [Constant]</td>
                  <td className="p-1.5 border border-slate-800 print:border-gray-400">O(d^2) Matrix-vector</td>
                  <td className="p-1.5 border border-slate-800 print:border-gray-400">Finite rank saturation & cross-talk noise</td>
                </tr>
                <tr>
                  <td className="p-1.5 border border-slate-800 print:border-gray-400 font-semibold text-cyan-400 print:text-blue-800">BDH / BDH-CQ (Pathway)</td>
                  <td className="p-1.5 border border-slate-800 print:border-gray-400">O(d^2) / O(|E|) Synaptic</td>
                  <td className="p-1.5 border border-slate-800 print:border-gray-400">O(1) Token generation</td>
                  <td className="p-1.5 border border-slate-800 print:border-gray-400">Synaptic saturation in finite latent workspace</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section 5: Limitations & Provenance */}
          <div className="space-y-2">
            <h3 className="font-bold text-cyan-400 print:text-blue-800 font-mono uppercase text-xs tracking-wider">
              5. Limitations & Research Provenance
            </h3>
            <p>
              Linear state recurrence guarantees constant memory, but cannot match the non-linear selective addressing of Softmax attention when key distributions are clustered. Furthermore, exponential decay <code className="font-mono">λ &lt; 1.0</code> avoids numerical overflow but trades away long-term retention via recency amnesia. Our in-browser simulator demonstrates these principles on an educational associative matrix model, grounded in published findings from:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-[11px] font-mono text-slate-400 print:text-gray-700">
              <li>Pathway (2025): <em>The Dragon Hatchling: The Missing Link between the Transformer and Models of the Brain</em> (arXiv:2509.26507).</li>
              <li>Pathway (2026): <em>BDH-CQ: In-Context Learning with Recurrent Latent Reasoning</em> (arXiv:2608.09888).</li>
              <li>Schlag, Irie, Schmidhuber (2021): <em>Linear Transformers Are Secretly Fast Weight Programmers</em> (ICML 2021).</li>
              <li>Sun et al. (2023): <em>Retentive Network: A Successor to Transformer for Large Language Models</em> (arXiv:2307.08621).</li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-dark-950 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">
            Document Length: ~780 words | Competition Ready
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-colors"
          >
            Close Brief
          </button>
        </div>
      </div>
    </div>
  );
};
