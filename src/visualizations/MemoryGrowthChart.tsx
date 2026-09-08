import React from 'react';

interface MemoryGrowthChartProps {
  currentStep: number;
  maxSteps: number;
  dimension: number;
}

export const MemoryGrowthChart: React.FC<MemoryGrowthChartProps> = ({
  currentStep,
  maxSteps,
  dimension,
}) => {
  // Constant fixed-size state memory: d * d * 4 bytes (Float32)
  const fixedBytes = dimension * dimension * 4;

  // Linear KV-Cache memory: step * 2 * d * 4 bytes (Float32 for Key & Value)
  const currentKvBytes = currentStep * 2 * dimension * 4;
  const maxKvBytes = maxSteps * 2 * dimension * 4;

  const width = 480;
  const height = 180;
  const padding = { top: 20, right: 30, bottom: 35, left: 60 };

  const plotW = width - padding.left - padding.right;
  const plotH = height - padding.top - padding.bottom;

  const yMax = Math.max(maxKvBytes * 1.1, fixedBytes * 1.5);

  const getX = (step: number) => padding.left + (step / maxSteps) * plotW;
  const getY = (bytes: number) => padding.top + plotH - (bytes / yMax) * plotH;

  // Polyline for KV-Cache (linear ramp)
  const kvPoints = `${getX(0)},${getY(0)} ${getX(maxSteps)},${getY(maxKvBytes)}`;
  // Polyline for Fixed-Size State (horizontal constant line)
  const fixedPoints = `${getX(0)},${getY(fixedBytes)} ${getX(maxSteps)},${getY(fixedBytes)}`;

  // Crossover step where KV cache exceeds fixed state
  // step * 2 * d * 4 = d * d * 4  =>  step = d / 2
  const crossoverStep = Math.round(dimension / 2);

  return (
    <div className="bg-dark-900 border border-slate-800 rounded-xl p-4 shadow-xl">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-200">Memory Allocation Scaling</span>
          <span className="text-[10px] text-slate-400 font-mono">Float32 bytes (d={dimension})</span>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-rose-400">
            <span className="w-2.5 h-0.5 bg-rose-500 inline-block" />
            KV Cache: {currentKvBytes.toLocaleString()} B
          </span>
          <span className="flex items-center gap-1.5 text-cyan-400">
            <span className="w-2.5 h-0.5 bg-cyan-500 inline-block" />
            Fixed State: {fixedBytes.toLocaleString()} B
          </span>
        </div>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
        {/* Grid lines */}
        {[0, 0.5, 1].map((ratio, idx) => {
          const yVal = yMax * ratio;
          const yPos = getY(yVal);
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
                {Math.round(yVal).toLocaleString()}B
              </text>
            </g>
          );
        })}

        {/* KV Cache Line (O(T)) */}
        <polyline
          points={kvPoints}
          fill="none"
          stroke="#f43f5e"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Fixed Evolving State Line (O(1) in T) */}
        <polyline
          points={fixedPoints}
          fill="none"
          stroke="#06b6d4"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Crossover point marker */}
        {crossoverStep <= maxSteps && (
          <g>
            <circle
              cx={getX(crossoverStep)}
              cy={getY(fixedBytes)}
              r="4"
              fill="#f59e0b"
            />
            <text
              x={getX(crossoverStep) + 6}
              y={getY(fixedBytes) - 6}
              fill="#f59e0b"
              fontSize="9"
              fontFamily="monospace"
            >
              Crossover (t={crossoverStep})
            </text>
          </g>
        )}

        {/* Current Step Cursor */}
        <line
          x1={getX(currentStep)}
          y1={padding.top}
          x2={getX(currentStep)}
          y2={height - padding.bottom}
          stroke="#94a3b8"
          strokeWidth="1.5"
          strokeDasharray="3,3"
        />
        <circle
          cx={getX(currentStep)}
          cy={getY(currentKvBytes)}
          r="4"
          fill="#f43f5e"
        />
        <circle
          cx={getX(currentStep)}
          cy={getY(fixedBytes)}
          r="4"
          fill="#06b6d4"
        />

        {/* X-axis */}
        <line
          x1={padding.left}
          y1={height - padding.bottom}
          x2={width - padding.right}
          y2={height - padding.bottom}
          stroke="#334155"
        />
        {[0, Math.round(maxSteps / 2), maxSteps].map((stepVal, idx) => (
          <text
            key={idx}
            x={getX(stepVal)}
            y={height - padding.bottom + 14}
            fill="#64748b"
            fontSize="9"
            textAnchor="middle"
            fontFamily="monospace"
          >
            t={stepVal}
          </text>
        ))}
      </svg>
      <div className="mt-1 text-[11px] text-slate-400 flex items-center justify-between">
        <span>At step t={currentStep}: KV Cache is <strong>{(currentKvBytes / (fixedBytes || 1)).toFixed(1)}x</strong> the size of the fixed state.</span>
        <span className="text-cyan-400 font-mono">O(1) memory vs O(T) memory</span>
      </div>
    </div>
  );
};
