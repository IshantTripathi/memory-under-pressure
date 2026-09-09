import React from 'react';
import { LatentRecurrenceDiagram } from '../visualizations/LatentRecurrenceDiagram';
import { ARC_AGI_BENCHMARKS, ARCHITECTURE_CONTRAST } from '../data/bdhBenchmarks';
import { Brain, BookOpen, Award } from 'lucide-react';

export const Section7BDHModule: React.FC = () => {
  return (
    <section id="section-bdh" className="py-10 border-b border-slate-800">
      <div className="flex items-center gap-2 mb-2">
        <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-slate-800 text-cyan-400 border border-slate-700">
          § 07 / FRONTIER SYNTHESIS
        </span>
        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/40 text-emerald-300 border border-emerald-800/40">
          PUBLISHED BENCHMARKS • PRIMARY SOURCES
        </span>
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          From Recurrent State to Synaptic Memory: Pathway&apos;s Dragon Hatchling (BDH) & BDH-CQ
          <Brain size={18} className="text-cyan-400" />
        </h2>
      </div>
      <p className="text-sm text-slate-400 mb-6 max-w-3xl leading-relaxed">
        How does the concept of an evolving state bridge the gap between artificial Transformers and biological synaptic memory? In Sections 2–6, we observed how unconstrained linear recurrence (<code className="font-mono text-cyan-300">S_t = S_{'{t-1}'} + v_t k_t^T</code>) suffers from cross-talk and rank saturation when <code className="font-mono text-cyan-300">T &gt; d</code>. Pathway researchers addressed this representational challenge in <strong>Dragon Hatchling (BDH)</strong> and <strong>BDH-CQ</strong>, establishing that attention can be reformulated as dynamic synaptic plasticity over sparse particle graphs, and that reasoning can execute iteratively in latent space without generating verbose verbal tokens.
      </p>

      {/* Epistemological Transparency Notice */}
      <div className="p-4 rounded bg-[#080d14] border border-indigo-900/60 mb-6 text-xs text-slate-300 flex items-start gap-3">
        <BookOpen size={16} className="text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-indigo-300 font-mono block mb-1 text-[11px] uppercase tracking-wider">
            Scientific Provenance & Labeling Standard
          </strong>
          <span className="leading-relaxed">
            The benchmark figures and architectural equations below are cited directly from primary research publications:{' '}
            <strong className="text-slate-100">arXiv:2509.26507</strong> (Dragon Hatchling BDH) and{' '}
            <strong className="text-slate-100">arXiv:2608.09888</strong> (BDH-CQ). Note that the interactive simulations in Sections 1–6 are <em>educational toy models</em> designed to demonstrate fundamental linear algebra and recurrent dynamics; they are not an official BDH implementation.
          </span>
        </div>
      </div>

      {/* Latent Recurrence Interactive Diagram */}
      <div className="mb-8">
        <LatentRecurrenceDiagram />
      </div>

      {/* ARC-AGI-1 Benchmark Table */}
      <div className="bg-[#0b111a] border border-slate-800 rounded p-5 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Award size={15} className="text-amber-400" />
              ARC-AGI-1 Benchmark: Cost vs Reasoning Accuracy
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Published evaluation results on the public ARC-AGI-1 evaluation set (arXiv:2608.09888)
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-800/40">
            PUBLISHED RESULT
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="pb-2.5 font-semibold">Model & Architecture</th>
                <th className="pb-2.5 font-semibold">Parameters</th>
                <th className="pb-2.5 font-semibold">ARC-AGI-1 Pass@2</th>
                <th className="pb-2.5 font-semibold">Inference Cost / Task</th>
                <th className="pb-2.5 font-semibold">Reasoning Substrate</th>
                <th className="pb-2.5 font-semibold">Citation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {ARC_AGI_BENCHMARKS.map((bm, idx) => {
                const isBdh = bm.model.includes('BDH');
                return (
                  <tr
                    key={idx}
                    className={isBdh ? 'bg-cyan-950/20 font-medium' : 'hover:bg-slate-900/40'}
                  >
                    <td className="py-2.5 pr-2">
                      <span className={isBdh ? 'text-cyan-300 font-bold' : 'text-slate-200'}>
                        {bm.model}
                      </span>
                    </td>
                    <td className="py-2.5 pr-2 text-slate-400">{bm.parameters}</td>
                    <td className="py-2.5 pr-2">
                      <span className={isBdh ? 'text-emerald-400 font-bold tabular-nums' : 'text-slate-200'}>
                        {bm.passAt2ARC.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-2.5 pr-2">
                      <span className={isBdh ? 'text-emerald-400 font-bold tabular-nums' : 'text-slate-300'}>
                        ${bm.costPerTaskUSD.toFixed(4)}
                      </span>
                    </td>
                    <td className="py-2.5 pr-2 text-[11px] text-slate-400 max-w-[220px] truncate">
                      {bm.reasoningType}
                    </td>
                    <td className="py-2.5 text-[10px] text-slate-500">
                      {bm.citation}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span>
            BDH-CQ (150M) achieves <strong className="text-slate-200">29.5% pass@2</strong> at a computed inference cost of <strong className="text-slate-200">$0.0007/task</strong>, establishing a reported cost-efficiency Pareto point.
          </span>
          <span className="text-cyan-400 font-mono text-[11px]">Primary Source: arXiv:2608.09888</span>
        </div>
      </div>

      {/* Architectural Mechanisms Comparison */}
      <div className="bg-[#0b111a] border border-slate-800 rounded p-5">
        <h3 className="text-sm font-bold text-slate-100 mb-4 pb-2 border-b border-slate-800 font-mono">
          Core Architectural Contrasts: Transformers vs BDH
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded bg-[#080d14] border border-slate-800 space-y-2">
            <span className="text-cyan-400 font-mono font-semibold block text-[11px] uppercase tracking-wider">
              1. Q = K Self-Affinity & Synaptic Plasticity
            </span>
            <p className="text-slate-300 leading-relaxed">
              Standard Transformers calculate arbitrary query-key affinities: <code className="font-mono text-cyan-300">Q K^T</code>. In biological neuroscience, Donald Hebb&apos;s rule states: <em>&quot;Neurons that fire together, wire together.&quot;</em> BDH constrains queries and keys to identical projections (<code className="font-mono text-cyan-300">Q = K</code>) from sparse, non-negative firing rates (<code className="font-mono text-cyan-300">ReLU</code>). The attention matrix is directly interpretable as dynamic synaptic weights!
            </p>
          </div>

          <div className="p-4 rounded bg-[#080d14] border border-slate-800 space-y-2">
            <span className="text-indigo-400 font-mono font-semibold block text-[11px] uppercase tracking-wider">
              2. Training vs Inference: What Actually Changes?
            </span>
            <p className="text-slate-300 leading-relaxed">
              During pre-training, BDH learns the base graph connectivity rules and projection matrices via gradient descent. During inference and in-context demonstration processing, the model adapts <strong>without backpropagation</strong>: inputs continuously update its recurrent synaptic state (<code className="font-mono text-indigo-300">S_t</code>), allowing real-time adaptation without fine-tuning weights.
            </p>
          </div>
        </div>

        {/* Feature Comparison Matrix Table */}
        <div className="mt-6 pt-4 border-t border-slate-800">
          <h4 className="text-xs font-mono text-slate-400 mb-3 uppercase tracking-wider">
            Detailed Feature Breakdown across Paradigms
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                  <th className="pb-2 font-semibold">Architectural Dimension</th>
                  <th className="pb-2 font-semibold">Standard Transformer</th>
                  <th className="pb-2 font-semibold">Linear Attention / SSM</th>
                  <th className="pb-2 font-semibold text-cyan-400">Pathway BDH</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 text-[11px]">
                {ARCHITECTURE_CONTRAST.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40">
                    <td className="py-2.5 pr-3 font-semibold text-slate-200">{row.feature}</td>
                    <td className="py-2.5 pr-3 text-slate-400">{row.transformer}</td>
                    <td className="py-2.5 pr-3 text-slate-400">{row.linearAttention}</td>
                    <td className="py-2.5 text-cyan-300">{row.bdh}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
