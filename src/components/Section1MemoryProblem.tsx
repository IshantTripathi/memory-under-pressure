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
    <section id="section-problem" className="py-10 border-b border-slate-800">
      <div className="flex items-center gap-2 mb-2">
        <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          SECTION 1
        </span>
        <h2 className="text-xl font-bold tracking-tight text-white">
          The Memory Problem: Why Can&apos;t AI Remember Everything?
        </h2>
      </div>
      <p className="text-sm text-slate-400 mb-6 max-w-3xl leading-relaxed">
        Watch a live sequence stream into two different memory architectures. Standard Transformers store every token into an ever-expanding KV cache ($O(T)$ growth). Recurrent evolving states maintain a constant-sized representation ($O(1)$ memory).
      </p>

      {/* Main Simulation Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Token Stream & Playback Controls */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-dark-900 border border-slate-800 rounded-xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-semibold text-slate-200">Live Ingested Token Stream</span>
              </div>
              <span className="text-xs font-mono text-cyan-400">
                Token {currentStep} of {maxSteps}
              </span>
            </div>

            {/* Token Tape Visualizer */}
            <div className="bg-dark-950 p-3 rounded-lg border border-slate-800 flex flex-wrap gap-1.5 min-h-[100px] max-h-[140px] overflow-y-auto">
              {sampleTokens.slice(0, currentStep).map((tok, idx) => (
                <span
                  key={idx}
                  className={`px-2 py-0.5 rounded text-xs font-mono transition-all duration-200 ${
                    idx === currentStep - 1
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/40 scale-105'
                      : 'bg-dark-850 text-slate-300 border border-slate-800'
                  }`}
                >
                  {tok}
                </span>
              ))}
              {currentStep < maxSteps && (
                <span className="px-2 py-0.5 rounded text-xs font-mono bg-dark-900 text-slate-600 border border-dashed border-slate-800 animate-pulse">
                  ...
                </span>
              )}
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800/80">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-medium border border-cyan-500/40 transition-colors"
                >
                  {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                  {isPlaying ? 'Pause' : 'Play'}
                </button>
                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setCurrentStep(1);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-dark-800 hover:bg-dark-700 text-slate-300 text-xs border border-slate-700 transition-colors"
                  title="Reset to step 1"
                >
                  <RotateCcw size={14} />
                  Reset
                </button>
              </div>

              {/* Speed Slider */}
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Speed:</span>
                <input
                  type="range"
                  min="100"
                  max="1000"
                  step="50"
                  value={speedMs}
                  onChange={(e) => setSpeedMs(Number(e.target.value))}
                  className="w-24 accent-cyan-500 cursor-pointer"
                />
                <span className="font-mono text-slate-300 text-[10px] w-12 text-right">
                  {speedMs}ms
                </span>
              </div>
            </div>
          </div>

          {/* Architecture Comparison Cards */}
          <div className="grid grid-cols-2 gap-3">
            {/* Strategy A: Growing KV Cache */}
            <div className="p-3.5 bg-dark-900 border border-rose-500/30 rounded-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
                  <Database size={13} />
                  Growing KV Cache
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                  O(T) Memory
                </span>
              </div>
              <div className="text-xl font-bold font-mono text-slate-100">
                {kvBytes.toLocaleString()} <span className="text-xs font-normal text-slate-400">Bytes</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Allocates {2 * dimension * 4}B for every new token. VRAM explodes on long context.
              </div>
            </div>

            {/* Strategy B: Fixed Evolving State */}
            <div className="p-3.5 bg-dark-900 border border-cyan-500/30 rounded-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1.5">
                  <Zap size={13} />
                  Fixed Evolving State
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  O(1) in T
                </span>
              </div>
              <div className="text-xl font-bold font-mono text-slate-100">
                {fixedBytes.toLocaleString()} <span className="text-xs font-normal text-slate-400">Bytes</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Constant {dimension}×{dimension} matrix. Never allocates new slots as T grows.
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Scaling Plot & Pedagogical Box */}
        <div className="lg:col-span-6 space-y-4">
          <MemoryGrowthChart
            currentStep={currentStep}
            maxSteps={maxSteps}
            dimension={dimension}
          />

          <div className="p-3.5 bg-dark-900/60 border border-slate-800 rounded-xl text-xs text-slate-300 leading-relaxed space-y-1.5">
            <span className="text-cyan-400 font-semibold font-mono block text-[11px] uppercase tracking-wider">
              Core Technical Trade-off
            </span>
            <p>
              Transformers preserve exact historical tokens by storing every Key-Value pair in high-bandwidth GPU memory. As sequences reach 100,000+ tokens, the KV cache requires tens of gigabytes per concurrent user.
            </p>
            <p>
              An <strong>evolving recurrent state</strong> avoids this memory wall by fusing every new token into a fixed-size internal representation. But this creates a new challenge: <em>how does a finite state store infinite information without overwriting itself?</em>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
