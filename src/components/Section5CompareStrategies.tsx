import React, { useState } from 'react';
import type { MemoryStrategyInfo, MemoryStrategyType } from '../types/memory';
import { Database, Cpu, Brain, Network, CheckCircle2, XCircle } from 'lucide-react';

const STRATEGIES_DATA: MemoryStrategyInfo[] = [
  {
    id: 'full_kv',
    name: 'Token KV Cache (Transformer)',
    subtitle: 'Explicit token-buffer storage with Softmax Attention',
    complexityMemory: 'Grows approximately linearly with cached tokens for fixed model (O(T · d · L))',
    complexityInference: 'O(T) per step [Memory bandwidth bounded]',
    retrievalMechanism: 'Softmax(Q K^T / √d) V — exact all-to-all attention across all historical tokens',
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
    complexityMemory: 'Fixed with respect to sequence length T for fixed model (O(d))',
    complexityInference: 'O(d^2) matrix-vector product per token [Fixed in T]',
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
    complexityMemory: 'Fixed with respect to sequence length T for fixed model (O(d^2))',
    complexityInference: 'O(d^2) per step [Matrix-vector multiplication, fixed in T]',
    retrievalMechanism: 'S_t = λ S_{t-1} + v_t k_t^T; Retrieval: v_hat = S_t q',
    pros: [
      'Memory footprint does not grow with sequence length T for fixed d',
      'Maintains d^2 state entries in a d×d matrix versus d entries in a vector RNN (though usable capacity depends on update rule and key geometry)',
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
    name: 'Dragon Hatchling (BDH) Synaptic Memory',
    subtitle: 'Dynamic Hebbian plasticity in scale-free neuron graphs',
    complexityMemory: 'Fixed with respect to sequence length T for fixed model (O(d^2) or O(|E|))',
    complexityInference: 'Fixed in T; non-verbalized recurrent latent reasoning',
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
    frontierConnection: 'Pathway Dragon Hatchling (BDH, arXiv:2509.26507; BDH-CQ, arXiv:2608.09888)',
  },
];

export const Section5CompareStrategies: React.FC = () => {
  const [selectedStrategy, setSelectedStrategy] = useState<MemoryStrategyType>('associative_matrix');

  const activeInfo = STRATEGIES_DATA.find((s) => s.id === selectedStrategy)!;

  return (
    <section id="section-strategies" className="py-8 border-b border-slate-800">
      {/* Academic Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/80 pb-2.5 mb-3 gap-1.5 text-[11px] font-mono">
        <span className="text-slate-300 font-semibold tracking-wider uppercase">
          &sect; 05 / ARCHITECTURAL COMPARATOR &bull; MEMORY PARADIGM SPECTRUM
        </span>
        <span className="text-slate-400">
          [CONCEPTUAL TAXONOMY &bull; ARCHITECTURAL TRADEOFF MATRIX]
        </span>
      </div>

      <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white mb-2">
        Compare Memory Strategies: From KV Buffers to Synaptic States
      </h2>
      <p className="text-xs sm:text-sm text-slate-300 mb-5 max-w-3xl leading-relaxed">
        Modern AI memory lies on a spectrum between external token buffers (Transformers) and internal evolving states (Linear Attention, SSMs, BDH). Explore how each paradigm navigates the trade-off between memory footprint, computational scaling, and interference.
      </p>

      {/* 4 Strategy Cards Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {STRATEGIES_DATA.map((strat) => {
          const isSelected = selectedStrategy === strat.id;
          return (
            <button
              key={strat.id}
              onClick={() => setSelectedStrategy(strat.id)}
              className={`p-3 rounded text-left transition-colors border ${
                isSelected
                  ? 'bg-slate-800 border-slate-600 text-slate-100'
                  : 'bg-[#0b111a] hover:bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`p-1.5 rounded ${isSelected ? 'bg-slate-700 text-cyan-400' : 'bg-slate-850 text-slate-400'}`}>
                  {strat.id === 'full_kv' && <Database size={14} />}
                  {strat.id === 'recurrent_vector' && <Cpu size={14} />}
                  {strat.id === 'associative_matrix' && <Network size={14} />}
                  {strat.id === 'bdh_synaptic' && <Brain size={14} />}
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  {strat.id === 'full_kv' ? 'O(T) KV' : 'Fixed in T'}
                </span>
              </div>
              <h3 className={`text-xs font-bold leading-tight ${isSelected ? 'text-slate-100' : 'text-slate-300'}`}>
                {strat.name}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                {strat.subtitle}
              </p>
            </button>
          );
        })}
      </div>

      {/* Detailed Strategy Inspector */}
      <div className="bg-[#0b111a] border border-slate-800 rounded p-4 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-100">{activeInfo.name}</h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{activeInfo.subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-1.5 text-xs font-mono">
            <span className="px-2 py-0.5 rounded bg-[#070c14] text-slate-300 border border-slate-800 text-[11px]">
              Memory: {activeInfo.complexityMemory}
            </span>
            <span className="px-2 py-0.5 rounded bg-[#070c14] text-slate-300 border border-slate-800 text-[11px]">
              Step Time: {activeInfo.complexityInference}
            </span>
          </div>
        </div>

        {/* Mechanism & Math */}
        <div className="p-3 bg-[#070c14] rounded border border-slate-800 font-mono text-xs">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-0.5">
            Update / Addressing Mechanism
          </span>
          <div className="text-slate-200 font-semibold">{activeInfo.retrievalMechanism}</div>
        </div>

        {/* Pros and Cons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="space-y-1.5 p-3 bg-[#070c14] rounded border border-slate-800">
            <span className="text-emerald-400 font-semibold font-mono text-[11px] uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 size={12} />
              Advantages &amp; Strengths
            </span>
            <ul className="space-y-1 text-slate-300">
              {activeInfo.pros.map((p, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-400 mt-0.5">&bull;</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-1.5 p-3 bg-[#070c14] rounded border border-slate-800">
            <span className="text-rose-400 font-semibold font-mono text-[11px] uppercase tracking-wider flex items-center gap-1">
              <XCircle size={12} />
              Vulnerabilities &amp; Boundaries
            </span>
            <ul className="space-y-1 text-slate-300">
              {activeInfo.cons.map((c, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-rose-400 mt-0.5">&bull;</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Frontier Models Connection */}
        <div className="pt-1 text-xs text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-1 font-mono border-t border-slate-800/80">
          <span>Primary Implementations:</span>
          <span className="text-slate-300 font-semibold">{activeInfo.frontierConnection}</span>
        </div>
      </div>
    </section>
  );
};
