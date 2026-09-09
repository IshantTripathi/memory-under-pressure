import React from 'react';

interface CapacityPhasePlotProps {
  sequenceLength: number;
  dimension: number;
  currentAccuracy: number;
  currentSnrDb: number;
}

export const CapacityPhasePlot: React.FC<CapacityPhasePlotProps> = ({
  sequenceLength,
  dimension,
  currentAccuracy,
  currentSnrDb,
}) => {
  const width = 480;
  const height = 180;
  const padding = { top: 20, right: 30, bottom: 35, left: 50 };

  const plotW = width - padding.left - padding.right;
  const plotH = height - padding.top - padding.bottom;

  // Max T to plot
  const maxT = Math.max(100, sequenceLength * 1.3);

  // Approximate theoretical sigmoid accuracy drop as T / d increases
  // P(correct) ≈ 1 / (1 + exp((T - d) / (d * 0.35)))
  const curvePoints: string[] = [];
  const sampleSteps = 40;
  for (let i = 0; i <= sampleSteps; i++) {
    const tVal = (i / sampleSteps) * maxT;
    const ratio = (tVal - dimension) / (dimension * 0.35);
    const estAcc = Math.max(5, Math.min(100, 100 / (1 + Math.exp(ratio))));
    const xPos = padding.left + (tVal / maxT) * plotW;
    const yPos = padding.top + plotH - (estAcc / 100) * plotH;
    curvePoints.push(`${xPos},${yPos}`);
  }

  const getX = (tVal: number) => padding.left + (Math.min(maxT, tVal) / maxT) * plotW;
  const getY = (accVal: number) => padding.top + plotH - (Math.min(100, Math.max(0, accVal)) / 100) * plotH;

  // Current operating point
  const curX = getX(sequenceLength);
  const curY = getY(currentAccuracy);

  // Critical capacity boundary line (T = d)
  const capX = getX(dimension);

  return (
    <div className="bg-[#0b111a] border border-slate-800 rounded p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-200">Capacity Phase Transition Curve</span>
          <span className="text-[10px] text-slate-400 font-mono">Accuracy vs Sequence Length T</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">Operating Ratio:</span>
          <span className={`font-semibold tabular-nums ${sequenceLength <= dimension ? 'text-cyan-400' : 'text-rose-400'}`}>
            T/d = {(sequenceLength / dimension).toFixed(2)}x
          </span>
        </div>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
        {/* Background Regime shading */}
        {/* Safe regime (T <= d) */}
        <rect
          x={padding.left}
          y={padding.top}
          width={Math.max(0, capX - padding.left)}
          height={plotH}
          fill="rgba(6, 182, 212, 0.05)"
        />
        {/* Saturated regime (T > d) */}
        <rect
          x={capX}
          y={padding.top}
          width={Math.max(0, width - padding.right - capX)}
          height={plotH}
          fill="rgba(244, 63, 94, 0.05)"
        />

        {/* Grid lines */}
        {[0, 50, 100].map((acc, idx) => {
          const yPos = getY(acc);
          return (
            <g key={idx}>
              <line
                x1={padding.left}
                y1={yPos}
                x2={width - padding.right}
                y2={yPos}
                stroke="#1e293b"
                strokeDasharray="2,2"
              />
              <text
                x={padding.left - 8}
                y={yPos + 3}
                fill="#64748b"
                fontSize="9"
                textAnchor="end"
                fontFamily="monospace"
              >
                {acc}%
              </text>
            </g>
          );
        })}

        {/* Theoretical Capacity Threshold line (T = d) */}
        <line
          x1={capX}
          y1={padding.top}
          x2={capX}
          y2={height - padding.bottom}
          stroke="#f59e0b"
          strokeWidth="1.5"
          strokeDasharray="3,3"
        />
        <text
          x={capX + 4}
          y={padding.top + 12}
          fill="#f59e0b"
          fontSize="9"
          fontFamily="monospace"
        >
          Capacity Bound (d={dimension})
        </text>

        {/* Phase transition curve */}
        <polyline
          points={curvePoints.join(' ')}
          fill="none"
          stroke="#6366f1"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Current Operating Point */}
        <circle
          cx={curX}
          cy={curY}
          r="6"
          fill={currentAccuracy > 60 ? '#10b981' : '#f43f5e'}
          className="animate-pulse"
        />
        <circle
          cx={curX}
          cy={curY}
          r="10"
          fill="none"
          stroke={currentAccuracy > 60 ? '#10b981' : '#f43f5e'}
          strokeWidth="1.5"
          opacity="0.5"
        />

        {/* Axes */}
        <line
          x1={padding.left}
          y1={height - padding.bottom}
          x2={width - padding.right}
          y2={height - padding.bottom}
          stroke="#334155"
        />
        {[0, Math.round(maxT / 2), Math.round(maxT)].map((tVal, idx) => (
          <text
            key={idx}
            x={getX(tVal)}
            y={height - padding.bottom + 14}
            fill="#64748b"
            fontSize="9"
            textAnchor="middle"
            fontFamily="monospace"
          >
            T={tVal}
          </text>
        ))}
      </svg>

      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400/40 inline-block" />
          Safe Subspace (T ≤ {dimension})
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-400/40 inline-block" />
          Superposition Saturation (T &gt; {dimension})
        </span>
        <span className="font-mono text-slate-300">
          SNR: {currentSnrDb} dB
        </span>
      </div>
    </div>
  );
};
