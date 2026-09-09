import type { Fact, RetrievalResult } from '../types/memory';
import { SignalNoiseDecomposition } from '../visualizations/SignalNoiseDecomposition';
import { HelpCircle } from 'lucide-react';

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
    <section id="section-interference" className="py-8 border-b border-slate-800">
      {/* Academic Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/80 pb-2.5 mb-3 gap-1.5 text-[11px] font-mono">
        <span className="text-slate-300 font-semibold tracking-wider uppercase">
          &sect; 04 / CORE EXPERIMENT &bull; SUBSPACE INTERFERENCE &amp; FORGETTING
        </span>
        <span className="text-slate-400">
          [LIVE COMPUTATION &bull; EDUCATIONAL TOY MODEL]
        </span>
      </div>

      <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white mb-2">
        Interference &amp; Forgetting: Probing the Saturated State
      </h2>
      <p className="text-xs sm:text-sm text-slate-300 mb-5 max-w-3xl leading-relaxed">
        Ground-truth facts are injected at early positions ($t=1..3$), followed by an arbitrary sequence of intervening distractor tokens. Later, we probe the state with query key <code className="font-mono text-slate-200">q</code>. Intervening tokens leak cross-talk noise into the retrieved vector whenever key directions overlap.
      </p>

      {/* Facts Sequence Tape Preview */}
      <div className="bg-[#0b111a] border border-slate-800 rounded p-3 mb-4">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
          <span>Injected Fact History ({facts.length} tokens):</span>
          <span className="text-[10px] text-cyan-400">Target facts injected at t=1..3</span>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {facts.slice(0, 12).map((f) => (
            <span
              key={f.id}
              className={`px-2 py-0.5 rounded text-[11px] font-mono whitespace-nowrap border ${
                f.key === selectedProbe
                  ? 'bg-slate-800 text-slate-100 border-slate-600 font-semibold'
                  : f.isDistractor
                  ? 'bg-[#070c14] text-slate-400 border-slate-800'
                  : 'bg-[#09101b] text-slate-300 border-slate-750'
              }`}
            >
              t={f.step}: {f.key}={f.value}
            </span>
          ))}
          {facts.length > 12 && (
            <span className="px-2 py-0.5 rounded text-[11px] font-mono text-slate-500 bg-[#070c14] border border-slate-800 self-center">
              +{facts.length - 12} more
            </span>
          )}
        </div>
      </div>

      {/* Interactive Probing & Parameter Controls */}
      <div className="bg-[#0b111a] border border-slate-800 rounded p-3.5 mb-5 space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          {/* Query Selector */}
          <div className="flex items-center gap-2">
            <span className="text-slate-300 font-semibold flex items-center gap-1">
              <HelpCircle size={13} className="text-slate-400" />
              Probe Query:
            </span>
            <div className="flex rounded bg-[#070c14] p-0.5 border border-slate-800">
              {probeOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setSelectedProbe(opt)}
                  className={`px-2.5 py-1 text-xs rounded transition-colors ${
                    selectedProbe === opt
                      ? 'bg-slate-800 text-slate-100 border border-slate-700 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  What is the {opt}?
                </button>
              ))}
            </div>
          </div>

          {/* Sequence Length Slider */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Sequence Length (T):</span>
            <input
              type="range"
              min="5"
              max="80"
              step="1"
              value={sequenceLength}
              onChange={(e) => setSequenceLength(Number(e.target.value))}
              className="w-24 cursor-pointer"
            />
            <span className="w-8 text-right font-semibold text-slate-200 tabular-nums">
              {sequenceLength}
            </span>
          </div>
        </div>

        {/* Secondary controls: Decay & Key Correlation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2.5 border-t border-slate-800/80 text-xs font-mono">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-slate-300 block font-medium">Decay Factor (λ): {decay.toFixed(2)}</span>
              <span className="text-[10px] text-slate-500 font-sans">Exponential discounting of older facts</span>
            </div>
            <input
              type="range"
              min="0.80"
              max="1.00"
              step="0.02"
              value={decay}
              onChange={(e) => setDecay(Number(e.target.value))}
              className="w-20 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-slate-300 block font-medium">Key Correlation (ρ): {(keyCorrelation * 100).toFixed(0)}%</span>
              <span className="text-[10px] text-slate-500 font-sans">Directional alignment among keys</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="0.8"
              step="0.05"
              value={keyCorrelation}
              onChange={(e) => setKeyCorrelation(Number(e.target.value))}
              className="w-20 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Signal/Noise Decomposition & Candidate Ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Signal & Noise Decomposition Visualizer */}
        <div className="lg:col-span-7 space-y-3.5">
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
        <div className="lg:col-span-5 space-y-3.5">
          <div className="bg-[#0b111a] border border-slate-800 rounded p-4">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-semibold text-slate-300 font-mono">
                Vocabulary Cosine Alignment
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                cos(v_hat, v_cand)
              </span>
            </div>

            <div className="space-y-1.5">
              {retrievalResult.candidates.map((cand, idx) => {
                const isTarget = cand.value === retrievalResult.expectedValue;
                const isSelected = cand.value === retrievalResult.predictedValue;
                const widthPct = Math.max(0, Math.min(100, cand.similarity * 100));

                return (
                  <div
                    key={idx}
                    className={`p-2 rounded border transition-colors text-xs font-mono ${
                      isSelected
                        ? isTarget
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                          : 'bg-rose-500/10 border-rose-500/40 text-rose-300'
                        : isTarget
                        ? 'bg-[#070c14] border-emerald-500/30 text-slate-300'
                        : 'bg-[#070c14] border-slate-800 text-slate-400'
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
                      <span className="tabular-nums">{cand.similarity.toFixed(4)}</span>
                    </div>

                    <div className="h-1 w-full bg-[#0b121c] rounded overflow-hidden">
                      <div
                        className={`h-full ${
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

            <p className="text-[11px] text-slate-400 mt-3 leading-relaxed font-sans border-t border-slate-800/80 pt-2.5">
              The query vector <code className="font-mono text-slate-200">q</code> computes <code className="font-mono text-slate-200">S_t q</code>. When intervening tokens have non-zero projection onto <code className="font-mono text-slate-200">q</code>, their value vectors contaminate the output, elevating incorrect candidates.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
