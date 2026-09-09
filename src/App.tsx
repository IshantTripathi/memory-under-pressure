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
import { BookOpen, RotateCcw } from 'lucide-react';

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
    <div className="min-h-screen bg-[#070b12] text-slate-100 flex flex-col selection:bg-slate-700 selection:text-slate-100">
      {/* Academic Masthead */}
      <header className="sticky top-0 z-40 bg-[#070b12]/95 border-b border-slate-800 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded border border-slate-700 bg-slate-900 flex items-center justify-center font-mono font-bold text-xs text-cyan-400">
              μP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs tracking-wider uppercase font-mono text-slate-100">
                  MEMORY UNDER PRESSURE
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700 hidden sm:inline-block">
                  Pathway Track &bull; DataForge 2026
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono hidden md:block">
                Academic Experimental Substrate &bull; Fixed-State Recurrence &amp; Synaptic Memory
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsSummaryOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-850 text-slate-200 text-xs font-mono border border-slate-700 hover:border-slate-600 transition-colors"
            >
              <BookOpen size={12} className="text-cyan-400" />
              <span>1-Page Brief</span>
            </button>

            <button
              onClick={handleGlobalReset}
              className="p-1 rounded bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors"
              title="Reset experiment to baseline"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* Research Abstract & Experimental Benchmark Selector */}
      <section className="bg-[#0b111a] border-b border-slate-800 py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="max-w-3xl space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-semibold">
                  RESEARCH PROTOTYPE &bull; EXPLAIN THE FRONTIER
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                How Far Can a Fixed-Size Evolving State Remember as Sequences Grow?
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                Standard autoregressive Transformers store every key-value pair into an expanding cache buffer ($O(T \cdot d \cdot L)$ linear memory pressure). Recurrent architectures and Pathway&apos;s <strong>Dragon Hatchling (BDH)</strong> maintain a compact representation whose memory footprint is <strong>fixed with respect to sequence length $T$ for a fixed model configuration</strong> ($O(d^2)$ state parameters per layer). However, finite state capacity introduces a fundamental trade-off: <strong>subspace interference, signal degradation, and forgetting</strong>.
              </p>
              <div className="border-l-2 border-cyan-500/80 bg-slate-950/60 pl-3 py-1.5 text-xs font-mono text-slate-300">
                <strong className="text-cyan-300">Central Falsifiable Claim:</strong> A fixed-size evolving state can process sequences whose duration grows without allocating a new memory slot for every token, but finite state capacity causes interference, degradation, and forgetting.
              </div>
            </div>

            {/* Benchmark Patchboard Selector */}
            <div className="p-3 rounded border border-slate-800 bg-[#070d15] space-y-2 lg:w-96 shrink-0">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 font-semibold tracking-wider text-[11px] uppercase">
                  EXPERIMENT PRESETS:
                </span>
                <span className="text-[10px] text-slate-500">Seed: {seed}</span>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                {EXPERIMENT_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset.id)}
                    className={`p-2 rounded text-left text-xs font-mono transition-colors border ${
                      selectedPresetId === preset.id
                        ? 'bg-slate-800 border-slate-600 text-slate-100 font-semibold'
                        : 'bg-[#0b121c] hover:bg-slate-900 border-slate-800 text-slate-400'
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

          {/* Research Index Tabs */}
          <div className="mt-6 pt-3 border-t border-slate-800/80 flex flex-wrap gap-1.5 text-[11px] font-mono">
            <a href="#section-problem" className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors">
              &sect; 01 Memory Problem
            </a>
            <a href="#section-state" className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors">
              &sect; 02 Evolving State
            </a>
            <a href="#section-capacity" className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors">
              &sect; 03 Capacity Limit
            </a>
            <a href="#section-interference" className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors">
              &sect; 04 Interference
            </a>
            <a href="#section-strategies" className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors">
              &sect; 05 Architecture Matrix
            </a>
            <a href="#section-break" className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors">
              &sect; 06 &quot;Break It&quot; Test
            </a>
            <a href="#section-bdh" className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-800 transition-colors">
              &sect; 07 BDH &amp; BDH-CQ
            </a>
            <a href="#section-challenge" className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors">
              &sect; 08 Diagnostic Test
            </a>
            <a href="#section-limitations" className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors">
              &sect; 09 Limitations
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
