import React, { useState } from 'react';
import { CapacityPhasePlot } from '../visualizations/CapacityPhasePlot';
import { Flame, AlertOctagon } from 'lucide-react';
import { generateFactSequence } from '../data/syntheticTasks';
import { initAssociativeState, updateAssociativeState, queryAssociativeMemory } from '../math/associativeMemory';

interface Section6Props {
  currentDimension: number;
}

export const Section6BreakIt: React.FC<Section6Props> = ({ currentDimension }) => {
  const [stressLength, setStressLength] = useState<number>(120);
  const [stressDimension, setStressDimension] = useState<number>(currentDimension || 8);
  const [stressNoise, setStressNoise] = useState<number>(0.1);
  const [stressCorrelation, setStressCorrelation] = useState<number>(0.2);

  // Compute live stress test simulation
  const { facts, codebook } = generateFactSequence(
    stressLength,
    stressDimension,
    stressCorrelation,
    stressNoise,
    888
  );

  let state = initAssociativeState(stressDimension, 1.0, 1.0);
  for (const f of facts) {
    state = updateAssociativeState(state, f.keyVector, f.valueVector, 'hebbian');
  }

  const queryVec = codebook.keyVectors.get('Color')!;
  const result = queryAssociativeMemory(state, queryVec, 'Color', facts, codebook.vocabulary);

  // Approximate accuracy based on SNR
  // If SNR > 10dB -> ~100%, 5dB -> ~80%, 0dB -> ~50%, -5dB -> ~20%
  const estimatedAccuracy = Math.max(
    5,
    Math.min(100, Math.round(100 / (1 + Math.exp(-result.signalToNoiseDb / 3))))
  );

  return (
    <section id="section-break" className="py-10 border-b border-slate-800">
      <div className="flex items-center gap-2 mb-2">
        <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
          SECTION 6 (THE BREAK IT EXPERIMENT)
        </span>
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          The &quot;Break It&quot; Experiment: Pushing State Memory to Collapse
          <Flame size={18} className="text-amber-400" />
        </h2>
      </div>
      <p className="text-sm text-slate-400 mb-6 max-w-3xl leading-relaxed">
        Science proceeds by attempting to falsify claims. Here, your goal is deliberate: <strong>break the memory state</strong>. Push sequence length far beyond state capacity and watch the exact point where cross-talk noise causes catastrophic failure.
      </p>

      {/* Stress Controls Toolbar */}
      <div className="bg-dark-900 border border-slate-800 rounded-xl p-5 mb-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <AlertOctagon size={14} className="text-amber-400" />
            Stress Configuration Sliders
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            Real-time deterministic simulation
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          {/* Slider 1: Sequence Length */}
          <div className="p-3 bg-dark-950 rounded-lg border border-slate-800 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Sequence (T):</span>
              <span className="text-amber-400 font-bold">{stressLength}</span>
            </div>
            <input
              type="range"
              min="10"
              max="300"
              step="10"
              value={stressLength}
              onChange={(e) => setStressLength(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Slider 2: Capacity Dimension */}
          <div className="p-3 bg-dark-950 rounded-lg border border-slate-800 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Dimension (d):</span>
              <span className="text-cyan-400 font-bold">{stressDimension}</span>
            </div>
            <input
              type="range"
              min="4"
              max="32"
              step="4"
              value={stressDimension}
              onChange={(e) => setStressDimension(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          {/* Slider 3: Noise Level */}
          <div className="p-3 bg-dark-950 rounded-lg border border-slate-800 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Sensory Noise:</span>
              <span className="text-rose-400 font-bold">{(stressNoise * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="0.3"
              step="0.05"
              value={stressNoise}
              onChange={(e) => setStressNoise(Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer"
            />
          </div>

          {/* Slider 4: Key Correlation */}
          <div className="p-3 bg-dark-950 rounded-lg border border-slate-800 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Key Correlation (ρ):</span>
              <span className="text-indigo-400 font-bold">{(stressCorrelation * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="0.75"
              step="0.05"
              value={stressCorrelation}
              onChange={(e) => setStressCorrelation(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Grid: Phase Plot & Stress Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Capacity Phase Plot */}
        <div className="lg:col-span-7 space-y-4">
          <CapacityPhasePlot
            sequenceLength={stressLength}
            dimension={stressDimension}
            currentAccuracy={estimatedAccuracy}
            currentSnrDb={result.signalToNoiseDb}
          />
        </div>

        {/* Right: Stress Diagnostic Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-dark-900 border border-slate-800 rounded-xl p-4 shadow-xl space-y-3 text-xs">
            <span className="text-slate-200 font-semibold block">
              Live Stress Outcome: Target Probe (Color)
            </span>

            <div className="p-3 bg-dark-950 rounded-lg border border-slate-800 font-mono space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Expected Ground Truth:</span>
                <span className="text-emerald-400 font-bold">{result.expectedValue}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Model Retrieval:</span>
                <span className={`font-bold ${result.isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {result.predictedValue}
                </span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-800/80">
                <span className="text-slate-400">Signal-to-Noise Ratio:</span>
                <span className={result.signalToNoiseDb > 0 ? 'text-emerald-400' : 'text-rose-400'}>
                  {result.signalToNoiseDb > 0 ? `+${result.signalToNoiseDb}` : result.signalToNoiseDb} dB
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">State Matrix Size:</span>
                <span className="text-cyan-400 font-semibold">{stressDimension}×{stressDimension} ({stressDimension * stressDimension * 4}B)</span>
              </div>
            </div>

            {/* Gap Analysis */}
            <div className="p-3 rounded-lg bg-dark-950/80 border border-slate-800 space-y-1">
              <span className="font-mono text-[10px] text-amber-400 block uppercase tracking-wider font-semibold">
                Lesson from the Gap
              </span>
              <p className="text-slate-300 leading-relaxed">
                {result.isCorrect ? (
                  <>The model resisted interference despite <code className="font-mono text-cyan-300">T/d = {(stressLength / stressDimension).toFixed(1)}x</code> because key vectors maintained sufficient quasi-orthogonality.</>
                ) : (
                  <>Overloading capacity by <code className="font-mono text-rose-300">{(stressLength / stressDimension).toFixed(1)}x</code> generated cross-talk noise norm of <code className="font-mono text-rose-300">{result.noiseNorm.toFixed(2)}</code>, completely drowning the target signal of <code className="font-mono text-cyan-300">{result.signalNorm.toFixed(2)}</code>.</>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
