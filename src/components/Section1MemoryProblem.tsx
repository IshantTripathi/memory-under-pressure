import React, { useState, useEffect } from 'react';
import { MemoryGrowthChart } from '../visualizations/MemoryGrowthChart';
import { Play, Pause, RotateCcw, Zap, Database } from 'lucide-react';

interface Section1Props {
  dimension: number;
}

export const Section1MemoryProblem: React.FC<Section1Props> = ({ dimension }) => {
  const maxSteps = 40;
  const [currentStep, setCurrentStep] = useState<number>(12);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speedMs, setSpeedMs] = useState<number>(400);

  // Auto-run simulation loop on mount
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev >= maxSteps ? 1 : prev + 1));
    }, speedMs);
    return () => clearInterval(interval);
  }, [isPlaying, speedMs, maxSteps]);

  // KV cache bytes: step * 2 * d * 4 bytes
  const kvBytes = currentStep * 2 * dimension * 4;
  // Fixed state bytes: d * d * 4 bytes
  const fixedBytes = dimension * dimension * 4;

  // Stream preview of incoming tokens
  const sampleTokens = [
    'The', 'rover', 'scanned', 'the', 'red', 'crater', 'at', '0800',
    'hours.', 'Subsystem', 'Alpha', 'detected', 'high', 'ambient',
    'radiation', 'near', 'the', 'perimeter', 'shield.', 'Status',
    'is', 'Nominal.', 'Telemetry', 'frequency', 'shifted', 'to',
    'Channel-4.', 'Solar', 'battery', 'charge', 'at', '88%.',
    'Navigation', 'heading', 'set', 'due', 'North-East', 'towards',
    'Sector-7', 'ridge.'
  ];

  return (
    <section id="section-problem" className="py-8 border-b border-slate-800">
      {/* Academic Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/80 pb-2.5 mb-3 gap-1.5 text-[11px] font-mono">
        <span className="text-slate-300 font-semibold tracking-wider uppercase">
          &sect; 01 / LIVE BENCHMARK &bull; HORIZON SCALING COMPARISON
        </span>
        <span className="text-slate-400">
          [LIVE COMPUTATION &bull; EDUCATIONAL TOY MODEL]
        </span>
      </div>

      <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white mb-2">
        The Memory Problem: Why Can&apos;t AI Retain Everything Indefinitely?
      </h2>
      <p className="text-xs sm:text-sm text-slate-300 mb-5 max-w-3xl leading-relaxed">
        Observe a live sequence stream into two distinct memory paradigms. Standard autoregressive Transformers store every token key-value vector in high-bandwidth memory ($O(T \cdot d \cdot L)$ linear growth). Fixed recurrent states maintain an internal representation whose memory footprint is <strong>fixed with respect to sequence length $T$ for a fixed model configuration</strong> ($O(d^2)$ state parameters).
      </p>

      {/* Main Simulation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Live Token Stream & Playback Controls */}
        <div className="lg:col-span-6 space-y-3.5">
          <div className="bg-[#0b111a] border border-slate-800 rounded p-4">
            <div className="flex items-center justify-between mb-2.5 text-xs font-mono">
              <span className="text-slate-300 font-semibold">
                Sequential Token Ingestion Stream
              </span>
              <span className="text-slate-400">
                Step: <strong className="text-cyan-400">{currentStep}</strong> / {maxSteps}
              </span>
            </div>

            {/* Token Tape Visualizer */}
            <div className="bg-[#070c14] p-2.5 rounded border border-slate-800/90 flex flex-wrap gap-1 min-h-[90px] max-h-[130px] overflow-y-auto">
              {sampleTokens.slice(0, currentStep).map((tok, idx) => (
                <span
                  key={idx}
                  className={`px-2 py-0.5 rounded text-xs font-mono transition-colors ${
                    idx === currentStep - 1
                      ? 'bg-slate-200 text-slate-950 font-bold'
                      : 'bg-[#0e1624] text-slate-300 border border-slate-800/80'
                  }`}
                >
                  {tok}
                </span>
              ))}
              {currentStep < maxSteps && (
                <span className="px-2 py-0.5 rounded text-xs font-mono text-slate-600 border border-dashed border-slate-800">
                  ...
                </span>
              )}
            </div>

            {/* Playback Controls Toolbar */}
            <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-800/80 text-xs font-mono">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 transition-colors"
                >
                  {isPlaying ? <Pause size={13} /> : <Play size={13} />}
                  <span>{isPlaying ? 'Pause' : 'Stream'}</span>
                </button>
                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setCurrentStep(1);
                  }}
                  className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#0b121c] hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors"
                  title="Reset to step 1"
                >
                  <RotateCcw size={13} />
                  <span>Reset</span>
                </button>
              </div>

              {/* Speed Controller */}
              <div className="flex items-center gap-2 text-slate-400">
                <span>Clock:</span>
                <input
                  type="range"
                  min="100"
                  max="1000"
                  step="50"
                  value={speedMs}
                  onChange={(e) => setSpeedMs(Number(e.target.value))}
                  className="w-20 cursor-pointer"
                />
                <span className="w-10 text-right tabular-nums text-slate-300">
                  {speedMs}ms
                </span>
              </div>
            </div>
          </div>

          {/* Architecture Comparison Panels */}
          <div className="grid grid-cols-2 gap-3">
            {/* Strategy A: Growing KV Cache */}
            <div className="p-3 bg-[#0b111a] border border-slate-800 rounded relative">
              <div className="flex items-center justify-between mb-1 text-xs font-mono">
                <span className="text-slate-300 font-semibold flex items-center gap-1">
                  <Database size={12} className="text-rose-400" />
                  Transformer KV Cache
                </span>
                <span className="text-[10px] text-rose-400">
                  O(T) growth
                </span>
              </div>
              <div className="text-lg font-bold font-mono text-slate-100 tabular-nums">
                {kvBytes.toLocaleString()} <span className="text-xs font-normal text-slate-400">Bytes</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                Stores all {currentStep} key-value tokens ($2 \times d$ floats per token).
              </div>
            </div>

            {/* Strategy B: Fixed Evolving State */}
            <div className="p-3 bg-[#0b111a] border border-slate-800 rounded relative">
              <div className="flex items-center justify-between mb-1 text-xs font-mono">
                <span className="text-slate-300 font-semibold flex items-center gap-1">
                  <Zap size={12} className="text-cyan-400" />
                  Fixed Evolving State
                </span>
                <span className="text-[10px] text-cyan-400">
                  Fixed in T
                </span>
              </div>
              <div className="text-lg font-bold font-mono text-slate-100 tabular-nums">
                {fixedBytes.toLocaleString()} <span className="text-xs font-normal text-slate-400">Bytes</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                Fixed {dimension}&times;{dimension} matrix. Size is independent of sequence length $T$.
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Scaling Plot & Research Discussion */}
        <div className="lg:col-span-6 space-y-3.5">
          <MemoryGrowthChart
            currentStep={currentStep}
            maxSteps={maxSteps}
            dimension={dimension}
          />

          <div className="border-l-2 border-slate-700 bg-[#070c14] p-3 text-xs text-slate-300 leading-relaxed space-y-1">
            <span className="text-slate-400 font-semibold font-mono block text-[10px] uppercase tracking-wider">
              Research Takeaway: The Long-Context Memory Wall
            </span>
            <p>
              Standard Transformers preserve historical sequence context by appending key-value vectors to an external cache. At scale, serving long-context requests across concurrent users creates prohibitive VRAM bandwidth bottlenecks.
            </p>
            <p>
              Recurrent state models and Pathway&apos;s <strong>Dragon Hatchling (BDH)</strong> circumvent cache growth by compressing context into internal synaptic state. However, because a finite-dimensional state cannot hold unbounded information, <em>subspace interference and forgetting become the fundamental limiting factors</em>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
