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
    <section id="section-capacity" className="py-8 border-b border-slate-800">
      {/* Academic Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/80 pb-2.5 mb-3 gap-1.5 text-[11px] font-mono">
        <span className="text-slate-300 font-semibold tracking-wider uppercase">
          &sect; 03 / REPRESENTATIONAL CAPACITY &bull; SUBSPACE DIMENSION BOUNDS
        </span>
        <span className="text-slate-400">
          [LIVE COMPUTATION &bull; EDUCATIONAL TOY MODEL]
        </span>
      </div>

      <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white mb-2">
        Memory Capacity: The Geometric Limits of Finite Dimensions
      </h2>
      <p className="text-xs sm:text-sm text-slate-300 mb-5 max-w-3xl leading-relaxed">
        How many distinct facts can a fixed-size state hold before memories bleed into each other? In linear algebra, a vector space ℝ<sup>d</sup> can support <strong>up to d mutually orthogonal vectors</strong>, while <strong>more than d mutually orthogonal vectors are mathematically impossible</strong>. In practice, whether memories interfere depends on key geometry (clustering and mutual cosine similarity) and the specific update rule.
      </p>

      {/* Control Panel */}
      <div className="bg-[#0b111a] border border-slate-800 rounded p-4 mb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-semibold text-slate-200 block mb-0.5 flex items-center gap-1.5 font-mono">
              <Layers size={13} className="text-slate-400" />
              State Dimension Setting (d)
            </span>
            <span className="text-xs text-slate-400">
              Select representation dimension for state vectors and outer-product tensors.
            </span>
          </div>

          {/* Dimension Selector Switches */}
          <div className="flex items-center gap-1.5">
            {allowedDimensions.map((dVal) => (
              <button
                key={dVal}
                onClick={() => setDimension(dVal)}
                className={`px-3 py-1 rounded font-mono text-xs transition-colors border ${
                  dimension === dVal
                    ? 'bg-slate-800 text-slate-100 border-slate-600 font-semibold'
                    : 'bg-[#070c14] text-slate-400 hover:text-slate-200 border-slate-800'
                }`}
              >
                d = {dVal}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid: Capacity Diagnostics & Singular Spectrum */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Geometric Capacity Card */}
        <div className="lg:col-span-6 space-y-3.5">
          <div className="p-4 bg-[#0b111a] border border-slate-800 rounded space-y-3.5">
            <h3 className="text-xs font-semibold text-slate-300 font-mono">
              Capacity Status &amp; Subspace Allocation
            </h3>

            {/* Capacity Meter */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">
                  Sequence Length (T={sequenceLength}) vs Capacity (d={maxOrthogonal})
                </span>
                <span className={isOverCapacity ? 'text-rose-400 font-semibold tabular-nums' : 'text-emerald-400 font-semibold tabular-nums'}>
                  {(saturationRatio * 100).toFixed(0)}% Utilized
                </span>
              </div>
              <div className="h-2 w-full bg-[#070c14] rounded overflow-hidden border border-slate-800">
                <div
                  className={`h-full transition-all duration-200 ${
                    isOverCapacity ? 'bg-rose-500' : 'bg-slate-400'
                  }`}
                  style={{ width: `${Math.min(100, saturationRatio * 100)}%` }}
                />
              </div>
            </div>

            {/* Status Alert */}
            {isOverCapacity ? (
              <div className="p-2.5 rounded bg-rose-500/10 border border-rose-500/30 flex items-start gap-2 text-xs text-rose-300 font-sans">
                <AlertTriangle size={15} className="text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold font-mono text-[11px] uppercase text-rose-300">
                    Subspace Saturation (T &gt; d)
                  </strong>
                  More than {dimension} mutually orthogonal vectors are impossible in ℝ<sup>{dimension}</sup>. Storing {sequenceLength} facts forces directional superposition, causing cross-talk noise to leak into query outputs.
                </div>
              </div>
            ) : (
              <div className="p-2.5 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2 text-xs text-emerald-300 font-sans">
                <ShieldCheck size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold font-mono text-[11px] uppercase text-emerald-300">
                    Within Dimensional Bound (T &le; d)
                  </strong>
                  Up to {dimension} mutually orthogonal vectors can exist in ℝ<sup>{dimension}</sup>. If key vectors are orthogonal, cross-talk is zero; otherwise, interference scales with key correlation and the update rule.
                </div>
              </div>
            )}

            {/* Matrix Capacity Math */}
            <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs font-mono">
              <div className="p-2.5 rounded bg-[#070c14] border border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase">Theoretical Max Rank</span>
                <span className="text-slate-200 font-semibold text-xs tabular-nums">rank(S) &le; {dimension}</span>
              </div>
              <div className="p-2.5 rounded bg-[#070c14] border border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase">Hopfield Soft Limit</span>
                <span className="text-slate-200 font-semibold text-xs tabular-nums">&sim;{(0.14 * dimension).toFixed(1)} facts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Singular Value Spectrum */}
        <div className="lg:col-span-6 space-y-3.5">
          <div className="p-4 bg-[#0b111a] border border-slate-800 rounded">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-semibold text-slate-300 font-mono">
                Singular Value Spectrum (Spectral Energy)
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                Top {singularValues.length} Singular Modes
              </span>
            </div>

            {/* Spectrum Bar Chart */}
            <div className="space-y-1.5">
              {singularValues.map((val, idx) => {
                const pct = maxSingularVal > 0 ? (val / maxSingularVal) * 100 : 0;
                return (
                  <div key={idx} className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-slate-500 w-6 text-right text-[10px]">&sigma;_{idx + 1}</span>
                    <div className="flex-1 h-3 bg-[#070c14] rounded overflow-hidden border border-slate-800/80">
                      <div
                        className="h-full bg-slate-400 rounded-none transition-all duration-200"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-slate-300 w-10 text-right text-[10px] tabular-nums">
                      {val.toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>

            <p className="text-[11px] text-slate-400 mt-3 leading-relaxed font-sans border-t border-slate-800/80 pt-2.5">
              The singular values <code className="font-mono text-slate-300">&sigma;_i</code> reveal how representation energy distributes across orthogonal subspaces. As tokens superpose, all <code className="font-mono text-slate-300">d</code> directions fill up, causing rank saturation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
