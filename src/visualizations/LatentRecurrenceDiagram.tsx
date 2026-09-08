import React, { useState } from 'react';

export const LatentRecurrenceDiagram: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'bdh_cq' | 'transformer_cot'>('bdh_cq');

  return (
    <div className="bg-dark-900 border border-slate-800 rounded-xl p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h4 className="text-sm font-semibold text-slate-200">
            Architectural Mechanism: Latent Recurrence vs Verbalized CoT
          </h4>
          <p className="text-xs text-slate-400">
            How BDH-CQ solves reasoning tasks without inflating token context windows
          </p>
        </div>
        <div className="flex rounded-lg bg-dark-950 p-1 border border-slate-800 self-start">
          <button
            onClick={() => setActiveMode('bdh_cq')}
            className={`px-3 py-1 text-xs font-mono rounded-md transition-all ${
              activeMode === 'bdh_cq'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            BDH-CQ (Latent Reasoning)
          </button>
          <button
            onClick={() => setActiveMode('transformer_cot')}
            className={`px-3 py-1 text-xs font-mono rounded-md transition-all ${
              activeMode === 'transformer_cot'
                ? 'bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Transformer (Verbalized CoT)
          </button>
        </div>
      </div>

      {activeMode === 'bdh_cq' ? (
        /* BDH-CQ Architecture View */
        <div className="space-y-4">
          <div className="bg-dark-950 p-4 rounded-lg border border-cyan-500/30 glow-cyan relative overflow-hidden">
            <div className="absolute top-2 right-2 text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              Published: arXiv:2608.09888
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-3">
              {/* Step 1: Ingestion */}
              <div className="flex-1 text-center">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-500/40 mx-auto flex items-center justify-center text-cyan-300 font-mono text-xs font-bold mb-2">
                  D_in
                </div>
                <div className="text-xs font-semibold text-slate-200">Demonstration Stream</div>
                <div className="text-[11px] text-slate-400">ARC-AGI-1 Grid Examples</div>
              </div>

              <div className="text-cyan-500 text-lg font-mono">→</div>

              {/* Step 2: Recurrent Memory Update */}
              <div className="flex-1 text-center bg-dark-900/90 p-3 rounded-lg border border-slate-700">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/20 border border-indigo-500/40 mx-auto flex items-center justify-center text-indigo-300 font-mono text-xs font-bold mb-2">
                  S_t
                </div>
                <div className="text-xs font-semibold text-indigo-300">Recurrent Memory</div>
                <div className="text-[10px] text-slate-400 font-mono">S_t = update(S_{'{t-1}'}, x_t)</div>
                <div className="text-[10px] text-emerald-400 mt-1">Constant O(1) Memory</div>
              </div>

              <div className="text-cyan-500 text-lg font-mono">↺</div>

              {/* Step 3: Latent Workspace Reasoning */}
              <div className="flex-1 text-center bg-dark-900/90 p-3 rounded-lg border border-cyan-500/40">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-500/50 mx-auto flex items-center justify-center text-cyan-300 font-mono text-xs font-bold mb-2 animate-pulse-subtle">
                  z_k
                </div>
                <div className="text-xs font-semibold text-cyan-300">Latent Workspace</div>
                <div className="text-[10px] text-slate-400">Iterative Recurrence</div>
                <div className="text-[10px] text-cyan-400 mt-1">Zero Verbal Tokens</div>
              </div>

              <div className="text-cyan-500 text-lg font-mono">→</div>

              {/* Step 4: Output */}
              <div className="flex-1 text-center">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/40 mx-auto flex items-center justify-center text-emerald-300 font-mono text-xs font-bold mb-2">
                  Y_out
                </div>
                <div className="text-xs font-semibold text-slate-200">Direct Prediction</div>
                <div className="text-[11px] text-emerald-400 font-mono">$0.0007 / task</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-2.5 rounded bg-dark-950 border border-slate-800">
              <span className="text-slate-400 block mb-0.5 font-mono text-[10px]">RECURRENT UPDATE</span>
              <span className="text-slate-200 leading-snug">
                Demonstrations update the model&apos;s recurrent memory at inference time with no weight fine-tuning.
              </span>
            </div>
            <div className="p-2.5 rounded bg-dark-950 border border-slate-800">
              <span className="text-cyan-400 block mb-0.5 font-mono text-[10px]">NON-VERBALIZED REASONING</span>
              <span className="text-slate-200 leading-snug">
                Iterative computation occurs entirely in high-dimensional latent space, bypassing token generation.
              </span>
            </div>
            <div className="p-2.5 rounded bg-dark-950 border border-slate-800">
              <span className="text-emerald-400 block mb-0.5 font-mono text-[10px]">COST EFFICIENCY</span>
              <span className="text-slate-200 leading-snug">
                Achieves 29.5% pass@2 on ARC-AGI-1 at less than one-tenth of a cent per task.
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Transformer Chain-of-Thought View */
        <div className="space-y-4">
          <div className="bg-dark-950 p-4 rounded-lg border border-rose-500/30 glow-rose relative overflow-hidden">
            <div className="absolute top-2 right-2 text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30">
              Standard Baseline Architecture
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-3">
              {/* Step 1: Prompt */}
              <div className="flex-1 text-center">
                <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 mx-auto flex items-center justify-center text-slate-300 font-mono text-xs font-bold mb-2">
                  Prompt
                </div>
                <div className="text-xs font-semibold text-slate-200">Demonstrations</div>
                <div className="text-[11px] text-slate-400">Appended to KV Cache</div>
              </div>

              <div className="text-rose-500 text-lg font-mono">→</div>

              {/* Step 2: Verbal Chain of Thought */}
              <div className="flex-2 text-center bg-dark-900/90 p-3 rounded-lg border border-rose-500/40">
                <div className="text-xs font-semibold text-rose-300 mb-1">Verbal Chain-of-Thought (CoT)</div>
                <div className="flex items-center justify-center gap-1 font-mono text-[10px] text-rose-400 mb-1">
                  <span className="px-1 py-0.5 bg-rose-950 rounded">Tok 1</span>
                  <span>→</span>
                  <span className="px-1 py-0.5 bg-rose-950 rounded">Tok 2</span>
                  <span>→</span>
                  <span>...</span>
                  <span>→</span>
                  <span className="px-1 py-0.5 bg-rose-950 rounded">Tok 2,500</span>
                </div>
                <div className="text-[10px] text-rose-400">KV Cache explodes linearly: O(T) VRAM</div>
              </div>

              <div className="text-rose-500 text-lg font-mono">→</div>

              {/* Step 3: Output */}
              <div className="flex-1 text-center">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/40 mx-auto flex items-center justify-center text-amber-300 font-mono text-xs font-bold mb-2">
                  Answer
                </div>
                <div className="text-xs font-semibold text-slate-200">Final Answer</div>
                <div className="text-[11px] text-amber-400 font-mono">$1.00 – $2.50 / task</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-2.5 rounded bg-dark-950 border border-slate-800">
              <span className="text-slate-400 block mb-0.5 font-mono text-[10px]">GROWING MEMORY</span>
              <span className="text-slate-200 leading-snug">
                Every generated token must be retained in GPU VRAM KV cache, incurring high memory footprint.
              </span>
            </div>
            <div className="p-2.5 rounded bg-dark-950 border border-slate-800">
              <span className="text-rose-400 block mb-0.5 font-mono text-[10px]">VERBALIZATION OVERHEAD</span>
              <span className="text-slate-200 leading-snug">
                Requires hundreds to thousands of autoregressive decoding steps, each bound by memory bandwidth.
              </span>
            </div>
            <div className="p-2.5 rounded bg-dark-950 border border-slate-800">
              <span className="text-amber-400 block mb-0.5 font-mono text-[10px]">HIGH INFERENCE COST</span>
              <span className="text-slate-200 leading-snug">
                Cost scales linearly with reasoning token count, exceeding $1.50+ per task on benchmarks like ARC-AGI.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
