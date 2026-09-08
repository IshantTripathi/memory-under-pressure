import React, { useState } from 'react';

interface StateMatrixHeatmapProps {
  matrix: number[][];
  dimension: number;
  frobeniusNorm: number;
  step: number;
  highlightRow?: number;
  highlightCol?: number;
}

export const StateMatrixHeatmap: React.FC<StateMatrixHeatmapProps> = ({
  matrix,
  dimension,
  frobeniusNorm,
  step,
  highlightRow,
  highlightCol,
}) => {
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number; val: number } | null>(null);

  // Find max absolute value for normalization
  let maxAbs = 0.001;
  for (let i = 0; i < dimension; i++) {
    for (let j = 0; j < dimension; j++) {
      const absVal = Math.abs(matrix[i]?.[j] || 0);
      if (absVal > maxAbs) maxAbs = absVal;
    }
  }

  return (
    <div className="flex flex-col items-center bg-dark-900 border border-slate-800 rounded-xl p-4 shadow-xl">
      <div className="w-full flex items-center justify-between mb-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono text-cyan-400 font-semibold tracking-wider">S_{step}</span>
          <span className="text-slate-400">State Matrix ({dimension}×{dimension})</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-400 font-mono">
            ||S||_F: <span className="text-slate-200 font-semibold">{frobeniusNorm.toFixed(2)}</span>
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
            Rank ≤ {dimension}
          </span>
        </div>
      </div>

      {/* 2D Heatmap Grid */}
      <div 
        className="grid gap-1 p-2 bg-dark-950/80 rounded-lg border border-slate-800/80"
        style={{
          gridTemplateColumns: `repeat(${dimension}, minmax(0, 1fr))`,
          maxWidth: dimension > 32 ? '420px' : dimension > 16 ? '360px' : '280px',
          width: '100%',
          aspectRatio: '1 / 1',
        }}
      >
        {matrix.slice(0, dimension).map((row, rIdx) =>
          row.slice(0, dimension).map((val, cIdx) => {
            const normalized = val / maxAbs; // in [-1, 1]
            const isPos = normalized > 0;
            const opacity = Math.min(1, Math.max(0.08, Math.abs(normalized)));
            const isHighlighted = (highlightRow === rIdx && highlightCol === cIdx);

            return (
              <div
                key={`${rIdx}-${cIdx}`}
                onMouseEnter={() => setHoveredCell({ row: rIdx, col: cIdx, val })}
                onMouseLeave={() => setHoveredCell(null)}
                className={`w-full h-full rounded-sm transition-all duration-150 cursor-pointer ${
                  isHighlighted ? 'ring-2 ring-amber-400 z-10 scale-110' : ''
                }`}
                style={{
                  backgroundColor: isPos
                    ? `rgba(6, 182, 212, ${opacity})`   // Cyan for positive weights
                    : `rgba(244, 63, 94, ${opacity})`,  // Rose for negative weights
                }}
              />
            );
          })
        )}
      </div>

      {/* Hover Inspect Tooltip */}
      <div className="w-full mt-3 px-3 py-1.5 bg-dark-850 rounded border border-slate-800 flex items-center justify-between text-xs font-mono">
        {hoveredCell ? (
          <>
            <span className="text-slate-400">
              Cell S[{hoveredCell.row}, {hoveredCell.col}]:
            </span>
            <span className={`font-semibold ${hoveredCell.val >= 0 ? 'text-cyan-400' : 'text-rose-400'}`}>
              {hoveredCell.val.toFixed(4)}
            </span>
          </>
        ) : (
          <span className="text-slate-500 italic">Hover any cell to inspect weight S_ij</span>
        )}
      </div>
    </div>
  );
};
