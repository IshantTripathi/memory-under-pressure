import React from 'react';
import { Layers, ShieldCheck, AlertTriangle } from 'lucide-react';

interface Section3Props {
  dimension: number;
  setDimension: (d: number) => void;
  sequenceLength: number;
  singularValues: number[];
}

export const Section3Capacity: React.FC<Section3Props> = ({
  dimension,
  setDimension,
  sequenceLength,
  singularValues,
}) => {
  const allowedDimensions = [4, 8, 16, 32, 64];

  // Max possible orthogonal basis directions
  const maxOrthogonal = dimension;
  const isOverCapacity = sequenceLength > maxOrthogonal;
  const saturationRatio = sequenceLength / maxOrthogonal;

  const maxSingularVal = Math.max(...singularValues, 0.001);

  return (
    <section id="section-capacity" className="py-10 border-b border-slate-800">
      <div className="flex items-center gap-2 mb-2">
        <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          SECTION 3
        </span>
        <h2 className="text-xl font-bold tracking-tight text-white">
          Memory Capacity: The Geometric Limits of Finite Dimensions
        </h2>
      </div>
      <p className="text-sm text-slate-400 mb-6 max-w-3xl leading-relaxed">
        How many distinct facts can a fixed-size state hold before memories bleed into each other? In linear algebra, a vector space of dimension <code className="text-emerald-400 font-mono">d</code> can support at most <code className="text-emerald-400 font-mono">d</code> mutually orthogonal directions.
      </p>

      {/* Control Panel */}
      <div className="bg-dark-900 border border-slate-800 rounded-xl p-5 mb-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-slate-200 block mb-1 flex items-center gap-1.5">
              <Layers size={14} className="text-emerald-400" />
              State Dimension Control (d)
            </span>
            <span className="text-xs text-slate-400">
              Select the representation dimension for state vectors and weight tensors.
            </span>
          </div>

          {/* Dimension Selector Pills */}
          <div className="flex items-center gap-2">
            {allowedDimensions.map((dVal) => (
              <button
                key={dVal}
                onClick={() => setDimension(dVal)}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs font-semibold transition-all ${
                  dimension === dVal
                    ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30 scale-105'
                    : 'bg-dark-800 text-slate-400 hover:text-slate-200 border border-slate-700'
                }`}
              >
                d = {dVal}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid: Capacity Diagnostics & Singular Spectrum */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Geometric Capacity Card */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 bg-dark-900 border border-slate-800 rounded-xl space-y-4 shadow-xl">
            <h3 className="text-xs font-semibold text-slate-200">
              Capacity Status & Subspace Allocation
            </h3>

            {/* Capacity Meter */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">
                  Sequence Length (T={sequenceLength}) vs Capacity (d={maxOrthogonal})
                </span>
                <span className={isOverCapacity ? 'text-rose-400 font-semibold' : 'text-emerald-400 font-semibold'}>
                  {(saturationRatio * 100).toFixed(0)}% Utilized
                </span>
              </div>
              <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isOverCapacity ? 'bg-rose-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, saturationRatio * 100)}%` }}
                />
              </div>
            </div>

            {/* Status Alert */}
            {isOverCapacity ? (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300">
                <AlertTriangle size={16} className="text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold">Subspace Exhaustion (T &gt; d)</strong>
                  With {sequenceLength} facts in $\mathbb&#123;R&#125;^{dimension}$, the Pigeonhole Principle for vector spaces guarantees non-zero dot products. Cross-talk noise will accumulate upon query.
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5 text-xs text-emerald-300">
                <ShieldCheck size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold">Orthogonal Safe Regime (T ≤ d)</strong>
                  Each fact can occupy an independent orthogonal eigen-direction. Near-zero cross-talk interference expected.
                </div>
              </div>
            )}

            {/* Matrix Capacity Math */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono">
              <div className="p-2.5 rounded bg-dark-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">THEORETICAL MAXIMUM RANK</span>
                <span className="text-slate-200 font-semibold text-sm">rank(S) ≤ {dimension}</span>
              </div>
              <div className="p-2.5 rounded bg-dark-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">HOPFIELD CAPACITY BOUND</span>
                <span className="text-slate-200 font-semibold text-sm">~{(0.14 * dimension).toFixed(1)} facts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Singular Value Spectrum */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 bg-dark-900 border border-slate-800 rounded-xl shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-200">
                Singular Value Spectrum (Spectral Energy)
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Top {singularValues.length} Eigen-modes
              </span>
            </div>

            {/* Spectrum Bar Chart */}
            <div className="space-y-2">
              {singularValues.map((val, idx) => {
                const pct = maxSingularVal > 0 ? (val / maxSingularVal) * 100 : 0;
                return (
                  <div key={idx} className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-slate-500 w-6 text-right text-[10px]">σ_{idx + 1}</span>
                    <div className="flex-1 h-3.5 bg-dark-950 rounded overflow-hidden p-0.5 border border-slate-800/80">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-sm transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-slate-300 w-10 text-right text-[10px]">
                      {val.toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>

            <p className="text-[11px] text-slate-400 mt-4 leading-relaxed font-sans border-t border-slate-800/80 pt-3">
              The singular values <code className="font-mono text-slate-300">σ_i</code> reveal how energy is distributed across orthogonal subspaces. As tokens superpose, all <code className="font-mono text-slate-300">d</code> directions fill up, causing rank saturation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
