import React from 'react';
import { ShieldAlert } from 'lucide-react';

export const Section9Limitations: React.FC = () => {
  const limitations = [
    {
      title: '1. Finite-Rank State Bottleneck',
      tag: 'Mathematical Limit',
      description:
        'An associative state matrix S in R^{d x d} has mathematical rank at most d. When storing T facts where T >> d, the pigeonhole principle guarantees that value vectors must be superposed into non-orthogonal directions. Unlike Softmax attention which can query an infinite set of cached tokens with non-linear selectivity, a linear state cannot escape rank saturation.',
    },
    {
      title: '2. Quasi-Orthogonality in Real Language',
      tag: 'Data Distribution',
      description:
        'In synthetic benchmarks, keys can be generated from an orthonormal basis. In natural language text, however, token embeddings are densely clustered on semantic submanifolds with high mutual cosine similarities. This causes real-world recurrent states to experience cross-talk far sooner than idealized orthogonal synthetic codebooks.',
    },
    {
      title: '3. Decay Factor: Numerical Stability vs Amnesia',
      tag: 'Optimization Dilemma',
      description:
        'Setting λ < 1.0 is essential in recurrent architectures (such as RetNet or Mamba) to prevent unbounded state norm growth over millions of tokens. However, this creates an unavoidable exponential forgetting horizon: signals from t steps ago scale as λ^t, inducing severe recency bias and early context amnesia.',
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
        'Our in-browser interactive simulator uses a simplified 2D associative matrix to make linear algebra visually inspectable. Production architectures like Pathway’s BDH (arXiv:2509.26507) and BDH-CQ (arXiv:2608.09888) operate over scale-free graphs of neuron particles, multi-head sparse projections, and iterative latent reasoning loops that exceed simplified toy outer products.',
    },
  ];

  return (
    <section id="section-limitations" className="py-10 border-b border-slate-800">
      <div className="flex items-center gap-2 mb-2">
        <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
          SECTION 9
        </span>
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          Limitations, Edge Cases & Frontier Misconceptions
          <ShieldAlert size={18} className="text-rose-400" />
        </h2>
      </div>
      <p className="text-sm text-slate-400 mb-6 max-w-3xl leading-relaxed">
        Intellectual honesty is the hallmark of frontier research. Fixed-size evolving states solve the VRAM memory wall, but introduce hard physical and geometric trade-offs. Here are the five critical failure modes and boundaries.
      </p>

      {/* Limitations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {limitations.map((lim, idx) => (
          <div
            key={idx}
            className="p-4 bg-dark-900 border border-slate-800 rounded-xl shadow-xl flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-dark-950 text-slate-400 border border-slate-800">
                  {lim.tag}
                </span>
                <span className="text-slate-600 font-mono text-xs">#{idx + 1}</span>
              </div>
              <h3 className="text-xs font-bold text-slate-200">{lim.title}</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed font-sans">
                {lim.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
