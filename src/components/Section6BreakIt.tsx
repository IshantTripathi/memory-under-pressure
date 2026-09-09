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
    <section id="section-break" className="py-8 border-b border-slate-800">
      {/* Academic Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/80 pb-2.5 mb-3 gap-1.5 text-[11px] font-mono">
        <span className="text-slate-300 font-semibold tracking-wider uppercase">
          &sect; 06 / FALSIFICATION EXPERIMENT &bull; PUSHING STATE MEMORY TO COLLAPSE
        </span>
        <span className="text-slate-400">
          [LIVE COMPUTATION &bull; EDUCATIONAL TOY MODEL]
        </span>
      </div>

      <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white mb-2 flex items-center gap-2">
        The &quot;Break It&quot; Experiment: Pushing State Memory to Collapse
        <Flame size={16} className="text-amber-400" />
      </h2>
      <p className="text-xs sm:text-sm text-slate-300 mb-5 max-w-3xl leading-relaxed">
        Science proceeds by attempting to falsify claims. Here, your goal is deliberate: <strong>break the memory state</strong>. Push sequence length far beyond state capacity and observe the phase transition where cross-talk noise causes catastrophic retrieval breakdown.
      </p>

      {/* Stress Controls Toolbar */}
      <div className="bg-[#0b111a] border border-slate-800 rounded p-4 mb-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5 font-mono">
            <AlertOctagon size={13} className="text-amber-400" />
            Stress Parameter Controls
          </span>
          <span className="text-[10px] font-mono text-slate-500">
            Real-time deterministic execution
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
          {/* Slider 1: Sequence Length */}
          <div className="p-2.5 bg-[#070c14] rounded border border-slate-800 space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">Sequence (T):</span>
              <span className="text-slate-200 font-bold tabular-nums">{stressLength}</span>
            </div>
            <input
              type="range"
              min="10"
              max="300"
              step="10"
              value={stressLength}
              onChange={(e) => setStressLength(Number(e.target.value))}
              className="w-full cursor-pointer"
            />
          </div>

          {/* Slider 2: Capacity Dimension */}
          <div className="p-2.5 bg-[#070c14] rounded border border-slate-800 space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">Dimension (d):</span>
              <span className="text-slate-200 font-bold tabular-nums">{stressDimension}</span>
            </div>
            <input
              type="range"
              min="4"
              max="32"
              step="4"
              value={stressDimension}
              onChange={(e) => setStressDimension(Number(e.target.value))}
              className="w-full cursor-pointer"
            />
          </div>

          {/* Slider 3: Noise Level */}
          <div className="p-2.5 bg-[#070c14] rounded border border-slate-800 space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">Sensory Noise:</span>
              <span className="text-slate-200 font-bold tabular-nums">{(stressNoise * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="0.3"
              step="0.05"
              value={stressNoise}
              onChange={(e) => setStressNoise(Number(e.target.value))}
              className="w-full cursor-pointer"
            />
          </div>

          {/* Slider 4: Key Correlation */}
          <div className="p-2.5 bg-[#070c14] rounded border border-slate-800 space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">Key Correlation (ρ):</span>
              <span className="text-slate-200 font-bold tabular-nums">{(stressCorrelation * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="0.75"
              step="0.05"
              value={stressCorrelation}
              onChange={(e) => setStressCorrelation(Number(e.target.value))}
              className="w-full cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Grid: Phase Plot & Stress Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Capacity Phase Plot */}
        <div className="lg:col-span-7 space-y-3.5">
          <CapacityPhasePlot
            sequenceLength={stressLength}
            dimension={stressDimension}
            currentAccuracy={estimatedAccuracy}
            currentSnrDb={result.signalToNoiseDb}
          />
        </div>

        {/* Right: Stress Diagnostic Cards */}
        <div className="lg:col-span-5 space-y-3.5">
          <div className="bg-[#0b111a] border border-slate-800 rounded p-4 space-y-3 text-xs">
            <span className="text-slate-300 font-semibold block font-mono">
              Live Stress Outcome: Target Probe (Color)
            </span>

            <div className="p-2.5 bg-[#070c14] rounded border border-slate-800 font-mono space-y-1.5 text-xs">
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
                <span className={`tabular-nums ${result.signalToNoiseDb > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {result.signalToNoiseDb > 0 ? `+${result.signalToNoiseDb}` : result.signalToNoiseDb} dB
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">State Matrix Dimensions:</span>
                <span className="text-slate-300 font-semibold">{stressDimension}&times;{stressDimension} ({stressDimension * stressDimension * 4}B)</span>
              </div>
            </div>

            {/* Gap Analysis */}
            <div className="border-l-2 border-amber-500 bg-[#070c14] p-2.5 rounded-r space-y-0.5">
              <span className="font-mono text-[10px] text-amber-400 block uppercase tracking-wider font-semibold">
                Lesson from the Boundary
              </span>
              <p className="text-slate-300 leading-relaxed font-sans text-xs">
                {result.isCorrect ? (
                  <>The model resisted interference at <code className="font-mono text-slate-200">T/d = {(stressLength / stressDimension).toFixed(1)}x</code> because key vectors maintained sufficient quasi-orthogonality.</>
                ) : (
                  <>Overloading state capacity by <code className="font-mono text-rose-300">{(stressLength / stressDimension).toFixed(1)}x</code> generated cross-talk noise of <code className="font-mono text-rose-300">{result.noiseNorm.toFixed(2)}</code>, completely drowning the target signal of <code className="font-mono text-slate-200">{result.signalNorm.toFixed(2)}</code>.</>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
