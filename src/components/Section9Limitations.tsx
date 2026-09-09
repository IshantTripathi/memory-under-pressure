import React from 'react';
import { ShieldAlert } from 'lucide-react';

export const Section9Limitations: React.FC = () => {
  const limitations = [
    {
      title: '1. Finite-Rank State Bottleneck',
      tag: 'Mathematical Limit',
      description:
        'An associative state matrix S in R^{d x d} has mathematical rank at most d. When storing T facts where T >> d, the pigeonhole principle guarantees that value vectors must be superposed into non-orthogonal directions. A finite matrix state cannot represent arbitrarily many independent associations without interference as the number of stored associations grows relative to the available state.',
    },
    {
      title: '2. Quasi-Orthogonality in Real Language',
      tag: 'Data Distribution',
      description:
        'In synthetic benchmarks, keys can be generated from an orthonormal basis. In natural language text, however, token embeddings are densely clustered on semantic submanifolds with high mutual cosine similarities. This causes real-world recurrent states to experience cross-talk far sooner than idealized orthogonal synthetic codebooks.',
    },
    {
      title: '3. Decay Factor: Attenuation vs Amnesia',
      tag: 'Optimization Dilemma',
      description:
        'In this recurrence, setting λ < 1.0 attenuates older state contributions and helps prevent unbounded state norm accumulation over long sequences. However, this creates an exponential forgetting horizon: signals from t steps ago scale as λ^t, inducing recency bias and selective context amnesia.',
    },
    {
      title: '4. Linear vs Non-Linear Addressing',
      tag: 'Retrieval Dynamics',
      description:
        'Standard Transformers use Softmax(Q K^T / √d), which acts as a continuous argmax that exponentially suppresses irrelevant keys. Linear associative states calculate S_t q = Σ (k_i^T q) v_i. Even a small dot-product similarity (e.g. 0.15) leaks directly into the output vector. As sequence length grows, the sum of these small leaks drowns the target signal.',
    },
    {
      title: '5. Educational Model vs Production BDH / BDH-CQ',
      tag: 'Engineering Reality',
      description:
        'Our in-browser interactive simulator uses an explicit 2D matrix of size d×d to make linear algebra visually inspectable. Production architectures like Pathway’s Dragon Hatchling BDH (arXiv:2509.26507) and BDH-CQ (arXiv:2608.09888) operate over scale-free graphs of neuron particles, multi-head sparse projections, and iterative latent reasoning loops that exceed simplified toy outer products.',
    },
  ];

  return (
    <section id="section-limitations" className="py-10 border-b border-slate-800">
      <div className="flex items-center gap-2 mb-2">
        <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-slate-800 text-rose-400 border border-slate-700">
          § 09 / BOUNDARY CONDITIONS
        </span>
        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-950/40 text-rose-300 border border-rose-800/40">
          THEORETICAL ANALYSIS • CRITICAL MEMORANDUM
        </span>
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          Theoretical Boundaries & Engineering Realities
          <ShieldAlert size={18} className="text-rose-400" />
        </h2>
      </div>
      <p className="text-sm text-slate-400 mb-6 max-w-3xl leading-relaxed">
        Intellectual rigor requires explicit identification of architectural limits. Fixed-size evolving states prevent $O(T)$ KV cache footprint growth, but introduce hard representational, geometric, and information-theoretic trade-offs. The five critical failure modes and boundaries are documented below.
      </p>

      {/* Limitations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {limitations.map((lim, idx) => (
          <div
            key={idx}
            className="p-4 bg-[#0b111a] border border-slate-800 rounded flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#080d14] text-slate-400 border border-slate-800">
                  {lim.tag}
                </span>
                <span className="text-slate-500 font-mono text-xs">§9.{idx + 1}</span>
              </div>
              <h3 className="text-xs font-bold text-slate-200">{lim.title}</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {lim.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
