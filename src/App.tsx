import { useState, useMemo } from 'react';
import { Section1MemoryProblem } from './components/Section1MemoryProblem';
import { Section2EvolvingState } from './components/Section2EvolvingState';
import { Section3Capacity } from './components/Section3Capacity';
import { Section4Interference } from './components/Section4Interference';
import { Section5CompareStrategies } from './components/Section5CompareStrategies';
import { Section6BreakIt } from './components/Section6BreakIt';
import { Section7BDHModule } from './components/Section7BDHModule';
import { Section8Challenge } from './components/Section8Challenge';
import { Section9Limitations } from './components/Section9Limitations';
import { Section10SummaryModal } from './components/Section10SummaryModal';

import { EXPERIMENT_PRESETS } from './data/presets';
import { generateFactSequence } from './data/syntheticTasks';
import { initAssociativeState, updateAssociativeState, queryAssociativeMemory } from './math/associativeMemory';
import { Brain, Sparkles, BookOpen, RotateCcw } from 'lucide-react';

export function App() {
  // Global Experiment State
  const [selectedPresetId, setSelectedPresetId] = useState<string>('clean_baseline');
  const [dimension, setDimension] = useState<number>(16);
  const [sequenceLength, setSequenceLength] = useState<number>(16);
  const [decay, setDecay] = useState<number>(1.0);
  const [keyCorrelation, setKeyCorrelation] = useState<number>(0.0);
  const [noiseLevel, setNoiseLevel] = useState<number>(0.0);
  const [selectedProbe, setSelectedProbe] = useState<string>('Color');
  const [seed, setSeed] = useState<number>(42);
  const [isSummaryOpen, setIsSummaryOpen] = useState<boolean>(false);

  // Load Preset
  const handleSelectPreset = (presetId: string) => {
    const preset = EXPERIMENT_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setSelectedPresetId(preset.id);
    setDimension(preset.dimension);
    setSequenceLength(preset.sequenceLength);
    setDecay(preset.decay);
    setKeyCorrelation(preset.keyCorrelation);
    setNoiseLevel(preset.noiseLevel);
    setSelectedProbe(preset.targetProbeKey);
  };

  // Generate deterministic synthetic fact sequence based on current state
  const { facts, codebook } = useMemo(() => {
    return generateFactSequence(sequenceLength, dimension, keyCorrelation, noiseLevel, seed);
  }, [sequenceLength, dimension, keyCorrelation, noiseLevel, seed]);

  // Compute evolving state up to current sequence length
  const { currentState, retrievalResult } = useMemo(() => {
    let state = initAssociativeState(dimension, decay, 1.0);
    for (const f of facts) {
      state = updateAssociativeState(state, f.keyVector, f.valueVector, 'hebbian');
    }

    const probeVector = codebook.keyVectors.get(selectedProbe) || facts[0]?.keyVector || [];
    const res = queryAssociativeMemory(
      state,
      probeVector,
      selectedProbe,
      facts,
      codebook.vocabulary
    );

    return { currentState: state, retrievalResult: res };
  }, [facts, dimension, decay, selectedProbe, codebook]);

  const handleGlobalReset = () => {
    handleSelectPreset('clean_baseline');
    setSeed(42);
  };

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-dark-950/85 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Brain size={20} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm tracking-tight text-white">MEMORY UNDER PRESSURE</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hidden sm:inline-block">
                  DataForge 2026 • Pathway Track
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono hidden md:block">
                How AI Models Remember, Update and Forget Across Long Sequences
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsSummaryOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-900 hover:bg-dark-850 text-slate-200 text-xs font-mono border border-slate-700 hover:border-slate-600 transition-all shadow-sm"
            >
              <BookOpen size={13} className="text-cyan-400" />
              <span className="hidden sm:inline">1-Page</span> Summary
            </button>

            <button
              onClick={handleGlobalReset}
              className="p-1.5 rounded-lg bg-dark-900 hover:bg-dark-850 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors"
              title="Reset experiment to baseline"
            >
              <RotateCcw size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero / Learning Objective Banner */}
      <section className="bg-dark-900 border-b border-slate-800 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-3xl space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
                  Explain the Frontier: Long-Horizon Evolving State
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Can an AI remember an infinite stream of facts without running out of memory?
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed font-sans">
                Standard Transformers store every token into an ever-expanding KV cache buffer ($O(T)$ growth). Recurrent state-space models and Pathway&apos;s <strong>BDH</strong> architecture maintain fixed-size representations ($O(1)$ memory). But finite state capacity comes at a physical price: <strong>subspace interference and forgetting</strong>.
              </p>
            </div>

            {/* Global Presets Carousel / Selector */}
            <div className="p-4 rounded-xl bg-dark-950 border border-slate-800 space-y-2.5 lg:w-96 shrink-0">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1.5 font-semibold">
                  <Sparkles size={13} className="text-cyan-400" />
                  Deterministic Presets:
                </span>
                <span className="text-[10px] text-slate-500">Seed: {seed}</span>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                {EXPERIMENT_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset.id)}
                    className={`p-2 rounded-lg text-left text-xs font-mono transition-all border ${
                      selectedPresetId === preset.id
                        ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-200 font-semibold shadow-sm shadow-cyan-500/20'
                        : 'bg-dark-900 hover:bg-dark-850 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="block truncate text-[11px]">{preset.title}</span>
                    <span className="text-[9px] text-slate-500 block truncate">
                      T={preset.sequenceLength}, d={preset.dimension}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Sub-nav Pills */}
          <div className="mt-8 pt-4 border-t border-slate-800/80 flex flex-wrap gap-2 text-xs font-mono">
            <a href="#section-problem" className="px-2.5 py-1 rounded bg-dark-950 hover:bg-dark-850 text-slate-300 border border-slate-800 transition-colors">
              1. The Problem
            </a>
            <a href="#section-state" className="px-2.5 py-1 rounded bg-dark-950 hover:bg-dark-850 text-slate-300 border border-slate-800 transition-colors">
              2. Evolving State
            </a>
            <a href="#section-capacity" className="px-2.5 py-1 rounded bg-dark-950 hover:bg-dark-850 text-slate-300 border border-slate-800 transition-colors">
              3. Capacity Limit
            </a>
            <a href="#section-interference" className="px-2.5 py-1 rounded bg-dark-950 hover:bg-dark-850 text-slate-300 border border-slate-800 transition-colors">
              4. Interference
            </a>
            <a href="#section-strategies" className="px-2.5 py-1 rounded bg-dark-950 hover:bg-dark-850 text-slate-300 border border-slate-800 transition-colors">
              5. Strategy Matrix
            </a>
            <a href="#section-break" className="px-2.5 py-1 rounded bg-dark-950 hover:bg-dark-850 text-slate-300 border border-slate-800 transition-colors">
              6. &quot;Break It&quot; Test
            </a>
            <a href="#section-bdh" className="px-2.5 py-1 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-colors">
              7. BDH & BDH-CQ
            </a>
            <a href="#section-challenge" className="px-2.5 py-1 rounded bg-dark-950 hover:bg-dark-850 text-slate-300 border border-slate-800 transition-colors">
              8. 60s Challenge
            </a>
            <a href="#section-limitations" className="px-2.5 py-1 rounded bg-dark-950 hover:bg-dark-850 text-slate-300 border border-slate-800 transition-colors">
              9. Limitations
            </a>
          </div>
        </div>
      </section>

      {/* Main Narrative Body */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 w-full space-y-6">
        {/* Section 1: The Memory Problem */}
        <Section1MemoryProblem dimension={dimension} />

        {/* Section 2: What is an Evolving State? */}
        <Section2EvolvingState facts={facts} dimension={dimension} />

        {/* Section 3: Memory Capacity */}
        <Section3Capacity
          dimension={dimension}
          setDimension={setDimension}
          sequenceLength={sequenceLength}
          singularValues={currentState.singularValues}
        />

        {/* Section 4: Interference / Forgetting (Core Experiment) */}
        <Section4Interference
          facts={facts}
          retrievalResult={retrievalResult}
          selectedProbe={selectedProbe}
          setSelectedProbe={setSelectedProbe}
          sequenceLength={sequenceLength}
          setSequenceLength={setSequenceLength}
          keyCorrelation={keyCorrelation}
          setKeyCorrelation={setKeyCorrelation}
          decay={decay}
          setDecay={setDecay}
        />

        {/* Section 5: Compare Memory Strategies */}
        <Section5CompareStrategies />

        {/* Section 6: The "Break It" Experiment */}
        <Section6BreakIt currentDimension={dimension} />

        {/* Section 7: BDH & BDH-CQ Module */}
        <Section7BDHModule />

        {/* Section 8: 60-Second Learning Challenge */}
        <Section8Challenge />

        {/* Section 9: Failure Cases & Limitations */}
        <Section9Limitations />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-dark-950 py-10 mt-16 text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-slate-300 font-semibold mb-1">
              Memory Under Pressure • Explain the Frontier
            </div>
            <div>
              Built for DataForge 2026 Pathway Track. Grounded in primary literature: arXiv:2509.26507 & arXiv:2608.09888.
            </div>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button onClick={() => setIsSummaryOpen(true)} className="hover:text-cyan-400 transition-colors">
              1-Page Summary
            </button>
            <a href="#section-problem" className="hover:text-cyan-400 transition-colors">
              Back to Top ↑
            </a>
          </div>
        </div>
      </footer>

      {/* 1-Page Summary Modal */}
      <Section10SummaryModal
        isOpen={isSummaryOpen}
        onClose={() => setIsSummaryOpen(false)}
      />
    </div>
  );
}

export default App;
