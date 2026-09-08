import type { Fact, RetrievalResult } from '../types/memory';
import { SignalNoiseDecomposition } from '../visualizations/SignalNoiseDecomposition';
import { HelpCircle, Sparkles } from 'lucide-react';

interface Section4Props {
  facts: Fact[];
  retrievalResult: RetrievalResult;
  selectedProbe: string;
  setSelectedProbe: (probe: string) => void;
  sequenceLength: number;
  setSequenceLength: (len: number) => void;
  keyCorrelation: number;
  setKeyCorrelation: (corr: number) => void;
  decay: number;
  setDecay: (decay: number) => void;
}

export const Section4Interference: React.FC<Section4Props> = ({
  facts,
  retrievalResult,
  selectedProbe,
  setSelectedProbe,
  sequenceLength,
  setSequenceLength,
  keyCorrelation,
  setKeyCorrelation,
  decay,
  setDecay,
}) => {
  const probeOptions = ['Color', 'Shape', 'Location'];

  return (
    <section id="section-interference" className="py-10 border-b border-slate-800">
      <div className="flex items-center gap-2 mb-2">
        <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
          SECTION 4 (CORE EXPERIMENT)
        </span>
        <h2 className="text-xl font-bold tracking-tight text-white">
          Interference & Forgetting: Probing the Saturated State
        </h2>
      </div>
      <p className="text-sm text-slate-400 mb-6 max-w-3xl leading-relaxed">
        We inject early ground-truth facts, followed by an arbitrary sequence of intervening distractor tokens. Later, we probe the state with a query key <code className="font-mono text-cyan-300">q</code>. Notice how intervening tokens leak cross-talk noise into the retrieved vector.
      </p>

      {/* Facts Sequence Tape Preview */}
      <div className="bg-dark-900 border border-slate-800 rounded-xl p-3.5 mb-4 shadow-sm">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
          <span>Injected Fact History ({facts.length} tokens):</span>
          <span className="text-[10px] text-cyan-400">Target facts injected at t=1..3</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {facts.slice(0, 12).map((f) => (
            <span
              key={f.id}
              className={`px-2 py-1 rounded text-[11px] font-mono whitespace-nowrap border ${
                f.key === selectedProbe
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-semibold ring-1 ring-cyan-500/30'
                  : f.isDistractor
                  ? 'bg-dark-950 text-slate-400 border-slate-800'
                  : 'bg-dark-900 text-slate-200 border-slate-700'
              }`}
            >
              t={f.step}: {f.key}={f.value}
            </span>
          ))}
          {facts.length > 12 && (
            <span className="px-2 py-1 rounded text-[11px] font-mono text-slate-500 bg-dark-950 border border-slate-800 self-center">
              +{facts.length - 12} more
            </span>
          )}
        </div>
      </div>

      {/* Interactive Probing & Variable Controls */}
      <div className="bg-dark-900 border border-slate-800 rounded-xl p-4 mb-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Query Selector */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <HelpCircle size={14} className="text-cyan-400" />
              Probe Question:
            </span>
            <div className="flex rounded-lg bg-dark-950 p-1 border border-slate-800">
              {probeOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setSelectedProbe(opt)}
                  className={`px-3 py-1 text-xs font-mono rounded transition-all ${
                    selectedProbe === opt
                      ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  What is the {opt}?
                </button>
              ))}
            </div>
          </div>

          {/* Quick preset triggers */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Sequence Length (T):</span>
            <input
              type="range"
              min="5"
              max="80"
              step="1"
              value={sequenceLength}
              onChange={(e) => setSequenceLength(Number(e.target.value))}
              className="w-28 accent-rose-500 cursor-pointer"
            />
            <span className="font-mono text-rose-300 w-8 text-right font-semibold">
              {sequenceLength}
            </span>
          </div>
        </div>

        {/* Secondary controls: Decay & Key Correlation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-800/80 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-slate-300 block font-medium">Decay Factor (λ): {decay.toFixed(2)}</span>
              <span className="text-[10px] text-slate-500">Exponential discounting of older facts</span>
            </div>
            <input
              type="range"
              min="0.80"
              max="1.00"
              step="0.02"
              value={decay}
              onChange={(e) => setDecay(Number(e.target.value))}
              className="w-24 accent-indigo-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-slate-300 block font-medium">Key Correlation (ρ): {(keyCorrelation * 100).toFixed(0)}%</span>
              <span className="text-[10px] text-slate-500">Directional similarity among keys</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="0.8"
              step="0.05"
              value={keyCorrelation}
              onChange={(e) => setKeyCorrelation(Number(e.target.value))}
              className="w-24 accent-rose-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Signal/Noise Decomposition & Candidate Ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Signal & Noise Decomposition Visualizer */}
        <div className="lg:col-span-7 space-y-4">
          <SignalNoiseDecomposition
            signalNorm={retrievalResult.signalNorm}
            noiseNorm={retrievalResult.noiseNorm}
            snrDb={retrievalResult.signalToNoiseDb}
            isCorrect={retrievalResult.isCorrect}
            queryKey={retrievalResult.queryKey}
            expectedValue={retrievalResult.expectedValue}
            predictedValue={retrievalResult.predictedValue}
          />
        </div>

        {/* Right: Vocabulary Candidates Match Ranking */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-dark-900 border border-slate-800 rounded-xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Sparkles size={13} className="text-cyan-400" />
                Vocabulary Cosine Alignment
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                cos(v_hat, v_cand)
              </span>
            </div>

            <div className="space-y-2">
              {retrievalResult.candidates.map((cand, idx) => {
                const isTarget = cand.value === retrievalResult.expectedValue;
                const isSelected = cand.value === retrievalResult.predictedValue;
                const widthPct = Math.max(0, Math.min(100, cand.similarity * 100));

                return (
                  <div
                    key={idx}
                    className={`p-2 rounded-lg border transition-all text-xs font-mono ${
                      isSelected
                        ? isTarget
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                          : 'bg-rose-500/10 border-rose-500/40 text-rose-300'
                        : isTarget
                        ? 'bg-dark-950 border-emerald-500/30 text-slate-300'
                        : 'bg-dark-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold">
                        #{idx + 1} {cand.value}
                        {isTarget && (
                          <span className="ml-1.5 text-[9px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            TARGET
                          </span>
                        )}
                      </span>
                      <span>{cand.similarity.toFixed(4)}</span>
                    </div>

                    <div className="h-1.5 w-full bg-dark-850 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          isSelected
                            ? isTarget
                              ? 'bg-emerald-500'
                              : 'bg-rose-500'
                            : 'bg-slate-600'
                        }`}
                        style={{ width: `${widthPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-[11px] text-slate-400 mt-4 leading-relaxed font-sans border-t border-slate-800/80 pt-3">
              The query vector <code className="font-mono text-cyan-300">q</code> computes <code className="font-mono text-cyan-300">S_t q</code>. When intervening tokens have non-zero projection onto <code className="font-mono text-cyan-300">q</code>, their value vectors contaminate the output, elevating incorrect candidates.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
