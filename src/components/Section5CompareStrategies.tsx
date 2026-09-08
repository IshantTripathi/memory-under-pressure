import React, { useState } from 'react';
import type { MemoryStrategyInfo, MemoryStrategyType } from '../types/memory';
import { Database, Cpu, Brain, Network, CheckCircle2, XCircle } from 'lucide-react';

export const STRATEGIES_DATA: MemoryStrategyInfo[] = [
  {
    id: 'full_kv',
    name: 'Token KV Cache (Transformer)',
    subtitle: 'Explicit append buffer with Softmax Attention',
    complexityMemory: 'O(T · d · L) [Linear VRAM Growth]',
    complexityInference: 'O(T) per step [Memory Bandwidth Bound]',
    retrievalMechanism: 'Softmax(Q K^T / √d) V — exact all-to-all attention over all prior tokens',
    pros: [
      'Near-perfect recall across long sequences (no rank bottleneck)',
      'Sharp non-linear addressing prevents cross-talk interference',
      'Extremely expressive multi-head associative bindings',
    ],
    cons: [
      'VRAM footprint explodes linearly with context length T',
      'High serving cost and cache thrashing on concurrent streams',
      'No biological counterpart (requires saving all raw historical vectors)',
    ],
    frontierConnection: 'GPT-4o, Claude 3.5, Llama-3 (Standard Dense Transformers)',
  },
  {
    id: 'recurrent_vector',
    name: 'Recurrent Vector State (RNN / GRU)',
    subtitle: 'Fixed-dimension compressed hidden vector',
    complexityMemory: 'O(d) [Strictly Constant]',
    complexityInference: 'O(d^2) matrix-vector product per token [O(1) in T]',
    retrievalMechanism: 'h_t = tanh(W h_{t-1} + U x_t) — single vector bottleneck',
    pros: [
      'Constant memory footprint regardless of sequence duration',
      'Extremely fast autoregressive token generation',
      'Biologically intuitive temporal integration',
    ],
    cons: [
      'Severe vector information bottleneck (1 vector of size d)',
      'Gradient vanishing / exploding on long credit assignment',
      'Early context completely overwritten on long horizons',
    ],
    frontierConnection: 'Classic RNN, GRU, LSTM, Early Seq2Seq',
  },
  {
    id: 'associative_matrix',
    name: 'Matrix State / Linear Attention',
    subtitle: 'Recurrent outer-product fast weights',
    complexityMemory: 'O(d^2) [Fixed Matrix Tensor]',
    complexityInference: 'O(d^2) per step [Matrix-vector multiplication]',
    retrievalMechanism: 'S_t = λ S_{t-1} + v_t k_t^T; Retrieval: v_hat = S_t q',
    pros: [
      'Constant O(d^2) VRAM footprint independent of sequence length T',
      'Quadratic capacity boost over vector RNNs (d^2 scalar weights vs d)',
      'Dual form: parallel training during prefill, recurrent state during generation',
    ],
    cons: [
      'Subject to cross-talk interference when T exceeds dimension d',
      'Linear dot-product lacks the sharp selective focusing of Softmax',
      'Exponential decay λ creates a recency bias trade-off',
    ],
    frontierConnection: 'Linear Transformers (Katharopoulos), RetNet (Sun et al.), RWKV, Mamba SSM',
  },
  {
    id: 'bdh_synaptic',
    name: 'BDH Synaptic Memory (Pathway)',
    subtitle: 'Dynamic Hebbian plasticity in scale-free neuron graphs',
    complexityMemory: 'O(d^2) or O(|E|) sparse graph synaptic weights',
    complexityInference: 'O(1) in sequence length; O(1) token overhead via latent recurrence',
    retrievalMechanism: 'Q = K self-affinity with causal mask; non-negative sparse ReLU firing dynamics',
    pros: [
      'Biologically plausible synaptic plasticity ("neurons that fire together wire together")',
      'Sparse, non-negative activations yield high interpretability (monosemantic neurons)',
      'BDH-CQ performs iterative reasoning in latent space without expensive CoT token verbalization',
    ],
    cons: [
      'Synaptic saturation under sustained long-horizon inputs',
      'Requires specialized graph / tensor kernel mapping (BDH-GPU)',
      'Emerging paradigm with novel training dynamics compared to standard Transformers',
    ],
    frontierConnection: 'Pathway Baby Dragon Hatchling (BDH, arXiv:2509.26507; BDH-CQ, arXiv:2608.09888)',
  },
];

export const Section5CompareStrategies: React.FC = () => {
  const [selectedStrategy, setSelectedStrategy] = useState<MemoryStrategyType>('associative_matrix');

  const activeInfo = STRATEGIES_DATA.find((s) => s.id === selectedStrategy)!;

  return (
    <section id="section-strategies" className="py-10 border-b border-slate-800">
      <div className="flex items-center gap-2 mb-2">
        <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          SECTION 5
        </span>
        <h2 className="text-xl font-bold tracking-tight text-white">
          Compare Memory Strategies: From KV Buffers to Synaptic States
        </h2>
      </div>
      <p className="text-sm text-slate-400 mb-6 max-w-3xl leading-relaxed">
        Modern AI memory lies on a spectrum between external token buffers (Transformers) and internal evolving states (Linear Attention, SSMs, BDH). Explore how each paradigm navigates the trade-off between memory capacity, computation, and interference.
      </p>

      {/* 4 Strategy Cards Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {STRATEGIES_DATA.map((strat) => {
          const isSelected = selectedStrategy === strat.id;
          return (
            <button
              key={strat.id}
              onClick={() => setSelectedStrategy(strat.id)}
              className={`p-4 rounded-xl text-left transition-all border ${
                isSelected
                  ? 'bg-dark-900 border-cyan-500/50 shadow-xl shadow-cyan-500/10 ring-1 ring-cyan-500/30'
                  : 'bg-dark-950/80 hover:bg-dark-900 border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`p-2 rounded-lg ${isSelected ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'}`}>
                  {strat.id === 'full_kv' && <Database size={16} />}
                  {strat.id === 'recurrent_vector' && <Cpu size={16} />}
                  {strat.id === 'associative_matrix' && <Network size={16} />}
                  {strat.id === 'bdh_synaptic' && <Brain size={16} />}
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  {strat.id === 'full_kv' ? 'O(T)' : 'O(1)'}
                </span>
              </div>
              <h3 className={`text-xs font-bold leading-tight ${isSelected ? 'text-slate-100' : 'text-slate-300'}`}>
                {strat.name}
              </h3>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                {strat.subtitle}
              </p>
            </button>
          );
        })}
      </div>

      {/* Detailed Strategy Inspector */}
      <div className="bg-dark-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-100">{activeInfo.name}</h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{activeInfo.subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded bg-dark-950 text-cyan-400 border border-slate-800">
              VRAM: {activeInfo.complexityMemory}
            </span>
            <span className="px-2.5 py-1 rounded bg-dark-950 text-emerald-400 border border-slate-800">
              Step Time: {activeInfo.complexityInference}
            </span>
          </div>
        </div>

        {/* Mechanism & Math */}
        <div className="p-3.5 bg-dark-950 rounded-lg border border-slate-800 font-mono text-xs">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
            Update / Addressing Mechanism
          </span>
          <div className="text-cyan-300 font-semibold">{activeInfo.retrievalMechanism}</div>
        </div>

        {/* Pros and Cons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-2 p-3 bg-dark-950/60 rounded-lg border border-slate-800/80">
            <span className="text-emerald-400 font-semibold font-mono text-[11px] uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 size={13} />
              Advantages & Strengths
            </span>
            <ul className="space-y-1.5 text-slate-300">
              {activeInfo.pros.map((p, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-400 mt-0.5">•</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2 p-3 bg-dark-950/60 rounded-lg border border-slate-800/80">
            <span className="text-rose-400 font-semibold font-mono text-[11px] uppercase tracking-wider flex items-center gap-1.5">
              <XCircle size={13} />
              Vulnerabilities & Limitations
            </span>
            <ul className="space-y-1.5 text-slate-300">
              {activeInfo.cons.map((c, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-rose-400 mt-0.5">•</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Frontier Models Connection */}
        <div className="pt-2 text-xs text-slate-400 flex items-center justify-between font-mono">
          <span>Frontier Systems:</span>
          <span className="text-indigo-300 font-semibold">{activeInfo.frontierConnection}</span>
        </div>
      </div>
    </section>
  );
};
