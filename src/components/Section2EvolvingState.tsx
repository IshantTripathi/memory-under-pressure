import { useState } from 'react';
import type { AssociativeState, Fact } from '../types/memory';
import { updateAssociativeState, initAssociativeState } from '../math/associativeMemory';
import { StateMatrixHeatmap } from '../visualizations/StateMatrixHeatmap';
import { ArrowRight, ChevronRight, RotateCcw, Sliders } from 'lucide-react';

interface Section2Props {
  facts: Fact[];
  dimension: number;
}

export const Section2EvolvingState: React.FC<Section2Props> = ({ facts, dimension }) => {
  const [currentStep, setCurrentStep] = useState<number>(3);
  const [updateMethod, setUpdateMethod] = useState<'hebbian' | 'delta' | 'bdh_synaptic'>('hebbian');
  const [decay, setDecay] = useState<number>(1.0);

  // Compute state up to currentStep
  let state: AssociativeState = initAssociativeState(dimension, decay, 1.0);
  const activeFacts = facts.slice(0, currentStep);
  for (const f of activeFacts) {
    state = updateAssociativeState(state, f.keyVector, f.valueVector, updateMethod);
  }

  const currentFact = activeFacts[activeFacts.length - 1] || facts[0];

  const handleNext = () => {
    if (currentStep < facts.length) setCurrentStep(prev => prev + 1);
  };

  const handleReset = () => {
    setCurrentStep(1);
  };

  return (
    <section id="section-state" className="py-8 border-b border-slate-800">
      {/* Academic Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/80 pb-2.5 mb-3 gap-1.5 text-[11px] font-mono">
        <span className="text-slate-300 font-semibold tracking-wider uppercase">
          &sect; 02 / RECURRENT STATE MECHANICS &bull; INCREMENTAL UPDATE ENGINE
        </span>
        <span className="text-slate-400">
          [LIVE COMPUTATION &bull; EDUCATIONAL TOY MODEL]
        </span>
      </div>

      <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white mb-2">
        What is an Evolving State? The Mechanics of Recurrent Memory
      </h2>
      <p className="text-xs sm:text-sm text-slate-300 mb-5 max-w-3xl leading-relaxed">
        An evolving state compresses sequence context into an internal matrix via a recurrence step: <code className="text-slate-200 font-mono">S_t = update(S_{'{t-1}'}, x_t)</code>. Inspect each incoming token to observe how outer-product matrices accumulate. <em>(Note: This interactive component is an educational toy model of linear recurrence, not an official BDH implementation.)</em>
      </p>

      {/* Control Toolbar */}
      <div className="bg-[#0b111a] border border-slate-800 rounded p-3.5 mb-5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        {/* Method Selector */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 flex items-center gap-1">
            <Sliders size={12} />
            Update Rule:
          </span>
          <div className="flex rounded bg-[#070c14] p-0.5 border border-slate-800">
            <button
              onClick={() => setUpdateMethod('hebbian')}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                updateMethod === 'hebbian'
                  ? 'bg-slate-800 text-slate-100 border border-slate-700 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Hebbian (v k^T)
            </button>
            <button
              onClick={() => setUpdateMethod('delta')}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                updateMethod === 'delta'
                  ? 'bg-slate-800 text-slate-100 border border-slate-700 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Delta Rule (e k^T)
            </button>
            <button
              onClick={() => setUpdateMethod('bdh_synaptic')}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                updateMethod === 'bdh_synaptic'
                  ? 'bg-slate-800 text-slate-100 border border-slate-700 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              BDH Synaptic (Q=K Toy Model)
            </button>
          </div>
        </div>

        {/* Decay Slider */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Decay (λ):</span>
          <input
            type="range"
            min="0.80"
            max="1.00"
            step="0.02"
            value={decay}
            onChange={(e) => setDecay(Number(e.target.value))}
            className="w-20 cursor-pointer"
          />
          <span className="text-slate-300 w-10 text-right tabular-nums">
            {decay.toFixed(2)}
          </span>
        </div>

        {/* Step Trigger Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleNext}
            disabled={currentStep >= facts.length}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-750 disabled:opacity-40 disabled:cursor-not-allowed text-slate-100 border border-slate-700 transition-colors"
          >
            <span>Step {currentStep + 1}</span>
            <ChevronRight size={13} />
          </button>
          <button
            onClick={handleReset}
            className="p-1 rounded bg-[#0b121c] hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors"
            title="Reset to step 1"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>

      {/* Main Grid: Visual Pipeline & Matrix Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Update Pipeline Visualization */}
        <div className="lg:col-span-6 space-y-3.5">
          <div className="bg-[#0b111a] border border-slate-800 rounded p-4">
            <h3 className="text-xs font-semibold text-slate-300 mb-2.5 font-mono">
              Step-by-Step Computational Flow
            </h3>

            <div className="space-y-2.5 font-mono text-xs">
              {/* Previous State */}
              <div className="p-2.5 bg-[#070c14] rounded border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-500 text-[10px] block uppercase">PREVIOUS STATE</span>
                  <span className="text-slate-200 font-semibold">S_{currentStep - 1}</span>
                  <span className="text-slate-400 ml-2">({dimension}&times;{dimension} matrix)</span>
                </div>
                <div className="text-slate-500 text-[11px]">&times; decay ({decay.toFixed(2)})</div>
              </div>

              <div className="flex justify-center text-slate-600">
                <ArrowRight size={14} className="rotate-90" />
              </div>

              {/* Incoming Fact */}
              <div className="p-2.5 bg-[#070c14] rounded border border-slate-800">
                <span className="text-slate-500 text-[10px] block uppercase">INCOMING TOKEN / ATTRIBUTE</span>
                <div className="flex items-center justify-between mt-1">
                  <div>
                    <span className="text-cyan-400 font-semibold">{currentFact.key}: </span>
                    <span className="text-slate-200">{currentFact.value}</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-850 text-slate-400 border border-slate-800">
                    Step {currentStep}
                  </span>
                </div>
                {/* Vectors preview */}
                <div className="mt-2 text-[10px] text-slate-400 space-y-0.5">
                  <div>
                    Key Vector k_t: [{currentFact.keyVector.slice(0, 4).map(v => v.toFixed(2)).join(', ')}...]
                  </div>
                  <div>
                    Value Vector v_t: [{currentFact.valueVector.slice(0, 4).map(v => v.toFixed(2)).join(', ')}...]
                  </div>
                </div>
              </div>

              <div className="flex justify-center text-slate-600">
                <ArrowRight size={14} className="rotate-90" />
              </div>

              {/* State Update Rule */}
              <div className="p-2.5 bg-[#070c14] rounded border border-slate-800">
                <span className="text-slate-500 text-[10px] block uppercase">OUTER PRODUCT STATE UPDATE</span>
                <div className="text-slate-200 font-semibold mt-0.5">
                  {updateMethod === 'hebbian' && 'S_t = λ S_{t-1} + v_t ⊗ k_t^T'}
                  {updateMethod === 'delta' && 'S_t = λ S_{t-1} + (v_t - S_{t-1} k_t) ⊗ k_t^T'}
                  {updateMethod === 'bdh_synaptic' && 'S_t = λ S_{t-1} + ReLU(x_t) ⊗ ReLU(x_t)^T'}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 font-sans">
                  The rank-1 matrix update is superposed directly into the existing state tensor.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Inspectable Matrix Heatmap */}
        <div className="lg:col-span-6 space-y-3.5">
          <StateMatrixHeatmap
            matrix={state.matrix}
            dimension={dimension}
            frobeniusNorm={state.frobeniusNorm}
            step={currentStep}
          />

          <div className="border-l-2 border-slate-700 bg-[#070c14] p-3 text-xs text-slate-300 leading-relaxed font-sans">
            <strong className="text-slate-200 block font-mono text-[10px] uppercase tracking-wider mb-0.5">Mathematical Insight</strong>
            Every token contributes an outer product <code className="text-cyan-300 font-mono">v_t k_t^T</code>. If key vectors are mutually orthogonal, they reside in orthogonal subspaces with zero interference. But when multiple tokens share geometric directions, their outer products collide.
          </div>
        </div>
      </div>
    </section>
  );
};
