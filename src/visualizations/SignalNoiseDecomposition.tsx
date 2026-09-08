import React from 'react';

interface SignalNoiseDecompositionProps {
  signalNorm: number;
  noiseNorm: number;
  snrDb: number;
  isCorrect: boolean;
  queryKey: string;
  expectedValue: string;
  predictedValue: string;
}

export const SignalNoiseDecomposition: React.FC<SignalNoiseDecompositionProps> = ({
  signalNorm,
  noiseNorm,
  snrDb,
  isCorrect,
  queryKey,
  expectedValue,
  predictedValue,
}) => {
  const totalNorm = signalNorm + noiseNorm;
  const signalPct = totalNorm > 0 ? (signalNorm / totalNorm) * 100 : 50;
  const noisePct = totalNorm > 0 ? (noiseNorm / totalNorm) * 100 : 50;

  // Status color based on SNR
  const snrStatus = 
    snrDb >= 10 ? { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', label: 'High Fidelity' } :
    snrDb >= 0  ? { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', label: 'Degraded / Borderline' } :
                  { color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30', label: 'Interference Collapse' };

  return (
    <div className="bg-dark-900 border border-slate-800 rounded-xl p-4 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-200">Interference & Signal-to-Noise Ratio</span>
          <span className="text-[10px] text-slate-400 font-mono">||Signal|| vs ||Noise||</span>
        </div>
        <div className={`px-2.5 py-0.5 rounded-full border text-xs font-mono font-semibold flex items-center gap-1.5 ${snrStatus.bg} ${snrStatus.border} ${snrStatus.color}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          SNR: {snrDb > 0 ? `+${snrDb}` : snrDb} dB ({snrStatus.label})
        </div>
      </div>

      {/* Signal vs Cross-Talk Proportion Bar */}
      <div className="space-y-1.5 mb-3">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-cyan-400 font-semibold">
            Signal: {signalNorm.toFixed(3)} ({signalPct.toFixed(1)}%)
          </span>
          <span className="text-rose-400 font-semibold">
            Cross-Talk Noise: {noiseNorm.toFixed(3)} ({noisePct.toFixed(1)}%)
          </span>
        </div>
        <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden flex p-0.5 border border-slate-800">
          <div
            className="h-full bg-cyan-500 rounded-l-full transition-all duration-300"
            style={{ width: `${signalPct}%` }}
          />
          <div
            className="h-full bg-rose-500 rounded-r-full transition-all duration-300"
            style={{ width: `${noisePct}%` }}
          />
        </div>
      </div>

      {/* Truth Beside Estimate Panel */}
      <div className="grid grid-cols-3 gap-2 p-3 bg-dark-950/90 rounded-lg border border-slate-800/80 text-xs">
        <div>
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-mono">Target Probe</span>
          <span className="font-semibold text-slate-200 font-mono">{queryKey}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-mono">Expected Ground Truth</span>
          <span className="font-semibold text-emerald-400 font-mono">{expectedValue}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-mono">Model Retrieval</span>
          <div className="flex items-center gap-1.5">
            <span className={`font-semibold font-mono ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
              {predictedValue}
            </span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${isCorrect ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
              {isCorrect ? 'MATCH' : 'MISMATCH'}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 text-[11px] text-slate-400 leading-relaxed font-sans">
        {isCorrect ? (
          <p>
            <strong className="text-emerald-400">Signal dominant:</strong> The key vector for &quot;{queryKey}&quot; has sufficient alignment with the target memory subspace, keeping cross-talk noise below the detection threshold.
          </p>
        ) : (
          <p>
            <strong className="text-rose-400">Interference failure:</strong> The accumulated outer-product noise from intervening tokens has exceeded the target signal vector norm. The system retrieved &quot;{predictedValue}&quot; instead of &quot;{expectedValue}&quot;.
          </p>
        )}
      </div>
    </div>
  );
};
