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
    <section id="section-state" className="py-10 border-b border-slate-800">
      <div className="flex items-center gap-2 mb-2">
        <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          SECTION 2
        </span>
        <h2 className="text-xl font-bold tracking-tight text-white">
          What is an Evolving State? The Mechanics of Recurrent Memory
        </h2>
      </div>
      <p className="text-sm text-slate-400 mb-6 max-w-3xl leading-relaxed">
        An evolving state compresses historical context into an internal matrix or vector using an incremental update function: <code className="text-cyan-300 font-mono">S_t = update(S_{'{t-1}'}, x_t)</code>. Inspect each incoming token and observe how the weights change.
      </p>

      {/* Control Toolbar */}
      <div className="bg-dark-900 border border-slate-800 rounded-xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
        {/* Method Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Sliders size={13} />
            Update Rule:
          </span>
          <div className="flex rounded-lg bg-dark-950 p-1 border border-slate-800">
            <button
              onClick={() => setUpdateMethod('hebbian')}
              className={`px-2.5 py-1 text-xs font-mono rounded transition-all ${
                updateMethod === 'hebbian'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Hebbian (v k^T)
            </button>
            <button
              onClick={() => setUpdateMethod('delta')}
              className={`px-2.5 py-1 text-xs font-mono rounded transition-all ${
                updateMethod === 'delta'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Delta Rule (e k^T)
            </button>
            <button
              onClick={() => setUpdateMethod('bdh_synaptic')}
              className={`px-2.5 py-1 text-xs font-mono rounded transition-all ${
                updateMethod === 'bdh_synaptic'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              BDH Synaptic (Q=K)
            </button>
          </div>
        </div>

        {/* Decay Slider */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Decay (λ):</span>
          <input
            type="range"
            min="0.80"
            max="1.00"
            step="0.02"
            value={decay}
            onChange={(e) => setDecay(Number(e.target.value))}
            className="w-24 accent-indigo-500 cursor-pointer"
          />
          <span className="font-mono text-indigo-300 w-10 text-right">
            {decay.toFixed(2)}
          </span>
        </div>

        {/* Step Trigger Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleNext}
            disabled={currentStep >= facts.length}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-medium transition-colors shadow-lg shadow-indigo-600/30"
          >
            Inject Token {currentStep + 1}
            <ChevronRight size={14} />
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg bg-dark-800 hover:bg-dark-700 text-slate-400 hover:text-slate-200 border border-slate-700 transition-colors"
            title="Reset to step 1"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Main Grid: Visual Pipeline & Matrix Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Update Pipeline Visualization */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-dark-900 border border-slate-800 rounded-xl p-4 shadow-xl">
            <h3 className="text-xs font-semibold text-slate-200 mb-3">
              Step-by-Step Computational Flow
            </h3>

            <div className="space-y-3 font-mono text-xs">
              {/* Previous State */}
              <div className="p-3 bg-dark-950 rounded-lg border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-500 text-[10px] block">PREVIOUS STATE</span>
                  <span className="text-indigo-400 font-semibold">S_{currentStep - 1}</span>
                  <span className="text-slate-400 ml-2">({dimension}×{dimension} matrix)</span>
                </div>
                <div className="text-slate-500 text-xs">× decay ({decay.toFixed(2)})</div>
              </div>

              <div className="flex justify-center text-slate-600">
                <ArrowRight size={16} className="rotate-90" />
              </div>

              {/* Incoming Fact */}
              <div className="p-3 bg-dark-950 rounded-lg border border-cyan-500/30 glow-cyan">
                <span className="text-slate-500 text-[10px] block">NEW INCOMING TOKEN / FACT</span>
                <div className="flex items-center justify-between mt-1">
                  <div>
                    <span className="text-cyan-400 font-semibold">{currentFact.key}: </span>
                    <span className="text-slate-100">{currentFact.value}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-dark-850 text-slate-300 border border-slate-800">
                    Step {currentStep}
                  </span>
                </div>
                {/* Vectors preview */}
                <div className="mt-2 text-[10px] text-slate-400 space-y-1">
                  <div>
                    Key Vector k_t: [{currentFact.keyVector.slice(0, 4).map(v => v.toFixed(2)).join(', ')}...]
                  </div>
                  <div>
                    Value Vector v_t: [{currentFact.valueVector.slice(0, 4).map(v => v.toFixed(2)).join(', ')}...]
                  </div>
                </div>
              </div>

              <div className="flex justify-center text-slate-600">
                <ArrowRight size={16} className="rotate-90" />
              </div>

              {/* State Update Rule */}
              <div className="p-3 bg-dark-950 rounded-lg border border-emerald-500/30">
                <span className="text-slate-500 text-[10px] block">OUTER PRODUCT STATE UPDATE</span>
                <div className="text-emerald-400 font-semibold mt-0.5">
                  {updateMethod === 'hebbian' && 'S_t = λ S_{t-1} + v_t ⊗ k_t^T'}
                  {updateMethod === 'delta' && 'S_t = λ S_{t-1} + (v_t - S_{t-1} k_t) ⊗ k_t^T'}
                  {updateMethod === 'bdh_synaptic' && 'S_t = λ S_{t-1} + ReLU(x_t) ⊗ ReLU(x_t)^T'}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 font-sans">
                  The rank-1 matrix update is superposed directly onto the existing state tensor.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Inspectable Matrix Heatmap */}
        <div className="lg:col-span-6 space-y-4">
          <StateMatrixHeatmap
            matrix={state.matrix}
            dimension={dimension}
            frobeniusNorm={state.frobeniusNorm}
            step={currentStep}
          />

          <div className="p-3 bg-dark-900/60 border border-slate-800 rounded-xl text-xs text-slate-400 leading-relaxed font-sans">
            <strong className="text-slate-200">Mathematical Insight:</strong> Every token contributes an outer product <code className="text-cyan-300 font-mono">v_t k_t^T</code>. If key vectors are mutually orthogonal, they reside in orthogonal subspaces with zero interference. But when multiple tokens share geometric directions, their outer products collide.
          </div>
        </div>
      </div>
    </section>
  );
};
