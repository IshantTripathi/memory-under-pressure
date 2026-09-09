import React, { useState } from 'react';
import { DIAGNOSTIC_QUESTIONS } from '../data/diagnosticQuestions';
import { generateFactSequence } from '../data/syntheticTasks';
import { initAssociativeState, updateAssociativeState, queryAssociativeMemory } from '../math/associativeMemory';
import { CheckCircle, XCircle, Play, HelpCircle, Trophy } from 'lucide-react';

export const Section8Challenge: React.FC = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showFeedback, setShowFeedback] = useState<Record<number, boolean>>({});
  const [liveTestOutput, setLiveTestOutput] = useState<{
    questionId: number;
    expected: string;
    actual: string;
    snrDb: number;
    isCorrect: boolean;
    label: string;
  } | null>(null);

  const handleSelectOption = (qId: number, optId: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optId }));
    setShowFeedback((prev) => ({ ...prev, [qId]: true }));
  };

  const handleVerifyInSimulation = (qId: number) => {
    const q = DIAGNOSTIC_QUESTIONS.find((item) => item.id === qId)!;
    const config = q.simulationConfig;

    const { facts, codebook } = generateFactSequence(
      config.sequenceLength,
      config.dimension,
      0,
      0,
      555
    );

    let state = initAssociativeState(config.dimension, config.decay, 1.0);
    for (const f of facts) {
      state = updateAssociativeState(state, f.keyVector, f.valueVector, 'hebbian');
    }

    const queryVec = codebook.keyVectors.get('Color')!;
    const res = queryAssociativeMemory(state, queryVec, 'Color', facts, codebook.vocabulary);

    setLiveTestOutput({
      questionId: qId,
      expected: res.expectedValue,
      actual: res.predictedValue,
      snrDb: res.signalToNoiseDb,
      isCorrect: res.isCorrect,
      label: config.label,
    });
  };

  // Compute learner's score
  const totalAnswered = Object.keys(selectedAnswers).length;
  const correctCount = DIAGNOSTIC_QUESTIONS.filter((q) => {
    const userChoice = selectedAnswers[q.id];
    const correctOpt = q.options.find((o) => o.isCorrect)?.id;
    return userChoice === correctOpt;
  }).length;

  return (
    <section id="section-challenge" className="py-10 border-b border-slate-800">
      <div className="flex items-center gap-2 mb-2">
        <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-slate-800 text-cyan-400 border border-slate-700">
          § 08 / ACTIVE RECALL BENCH
        </span>
        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/40 text-cyan-300 border border-cyan-800/40">
          LIVE COMPUTATION • EMPIRICAL PROOF
        </span>
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          Diagnostic Evaluation: Test Your Mental Model
          <Trophy size={18} className="text-amber-400" />
        </h2>
      </div>
      <p className="text-sm text-slate-400 mb-6 max-w-3xl leading-relaxed">
        Can you predict how evolving states behave under memory pressure? Formulate your hypothesis for each scenario, then execute &quot;Verify in Simulation&quot; to test your prediction against the active linear algebra substrate.
      </p>

      {/* Progress & Score Banner */}
      <div className="bg-[#0b111a] border border-slate-800 rounded p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-200">Diagnostic Mastery Score:</span>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#080d14] text-cyan-300 border border-slate-800 tabular-nums">
            {correctCount} / {DIAGNOSTIC_QUESTIONS.length} Validated
          </span>
        </div>
        {totalAnswered === DIAGNOSTIC_QUESTIONS.length && (
          <span className="text-xs font-mono text-emerald-400 font-semibold">
            All Scenarios Evaluated
          </span>
        )}
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {DIAGNOSTIC_QUESTIONS.map((q) => {
          const userChoice = selectedAnswers[q.id];
          const isSubmitted = showFeedback[q.id];

          return (
            <div
              key={q.id}
              className="bg-[#0b111a] border border-slate-800 rounded p-5 space-y-4"
            >
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                    Scenario {q.id} / Diagnostic Hypothesis
                  </span>
                  <h3 className="text-sm font-bold text-slate-100">{q.title}</h3>
                </div>
                <button
                  onClick={() => handleVerifyInSimulation(q.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-mono border border-slate-700 transition-colors"
                >
                  <Play size={12} />
                  Verify in Simulation
                </button>
              </div>

              {/* Scenario description */}
              <div className="p-3 bg-[#080d14] rounded border border-slate-800 text-xs text-slate-300 leading-relaxed font-mono">
                {q.scenario}
              </div>

              {/* Question text */}
              <p className="text-xs font-semibold text-slate-200">{q.question}</p>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {q.options.map((opt) => {
                  const isSelected = userChoice === opt.id;
                  let optStyle = 'bg-[#080d14] hover:bg-slate-900 border-slate-800 text-slate-300';

                  if (isSubmitted) {
                    if (opt.isCorrect) {
                      optStyle = 'bg-emerald-950/30 border-emerald-700/60 text-emerald-200 font-semibold';
                    } else if (isSelected && !opt.isCorrect) {
                      optStyle = 'bg-rose-950/30 border-rose-700/60 text-rose-200';
                    }
                  } else if (isSelected) {
                    optStyle = 'bg-cyan-950/30 border-cyan-700/60 text-cyan-200';
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(q.id, opt.id)}
                      className={`p-3 rounded border text-left text-xs transition-all flex items-start gap-2.5 ${optStyle}`}
                    >
                      <span className="font-mono font-bold w-5 h-5 rounded bg-[#0b111a] border border-slate-700 flex items-center justify-center shrink-0 text-[11px]">
                        {opt.id}
                      </span>
                      <span className="leading-snug">{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Feedback Explanations */}
              {isSubmitted && (
                <div className="p-3 rounded bg-[#080d14] border border-slate-800 text-xs leading-relaxed space-y-1">
                  {q.options.map((opt) => {
                    if (!opt.isCorrect && userChoice !== opt.id) return null;
                    return (
                      <div key={opt.id} className="flex items-start gap-2">
                        {opt.isCorrect ? (
                          <CheckCircle size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle size={14} className="text-rose-400 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <strong className={opt.isCorrect ? 'text-emerald-400 font-mono' : 'text-rose-400 font-mono'}>
                            Option {opt.id}:
                          </strong>{' '}
                          <span className="text-slate-300">{opt.explanation}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Simulation Verification Drawer */}
              {liveTestOutput && liveTestOutput.questionId === q.id && (
                <div className="p-3.5 rounded bg-[#080d14] border border-cyan-800/60 font-mono text-xs space-y-2">
                  <div className="flex items-center justify-between text-cyan-300 font-semibold">
                    <span>Live Simulation Proof: {liveTestOutput.label}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/40">
                      COMPUTED LIVE
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1">
                    <div className="p-2 rounded bg-[#0b111a] border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">EXPECTED</span>
                      <span className="text-emerald-400 font-bold">{liveTestOutput.expected}</span>
                    </div>
                    <div className="p-2 rounded bg-[#0b111a] border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">MODEL RETRIEVAL</span>
                      <span className={liveTestOutput.isCorrect ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                        {liveTestOutput.actual}
                      </span>
                    </div>
                    <div className="p-2 rounded bg-[#0b111a] border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">SIGNAL-TO-NOISE</span>
                      <span className={liveTestOutput.snrDb > 0 ? 'text-emerald-400 font-bold tabular-nums' : 'text-rose-400 font-bold tabular-nums'}>
                        {liveTestOutput.snrDb > 0 ? `+${liveTestOutput.snrDb}` : liveTestOutput.snrDb} dB
                      </span>
                    </div>
                    <div className="p-2 rounded bg-[#0b111a] border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">VERDICT</span>
                      <span className={liveTestOutput.isCorrect ? 'text-emerald-300 font-bold' : 'text-rose-300 font-bold'}>
                        {liveTestOutput.isCorrect ? 'PRESERVED' : 'INTERFERENCE'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Self-Explanation Prompt */}
      <div className="mt-8 p-5 bg-[#0b111a] border border-slate-800 rounded space-y-3">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 font-mono">
          <HelpCircle size={15} className="text-indigo-400" />
          Technical Synthesis: Key Concept
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Consolidate the central architectural finding into a concise technical statement:
        </p>
        <div className="p-3.5 bg-[#080d14] rounded border border-slate-800 text-xs font-mono text-slate-300 leading-relaxed">
          &quot;A recurrent state achieves a constant-size footprint with respect to sequence length $T$, but because a vector space $\mathbb&#123;R&#125;^d$ supports at most $d$ mutually orthogonal directions, continuing to write beyond $T &gt; d$ forces non-orthogonal superpositions that induce cross-talk interference and inevitable state saturation.&quot;
        </div>
      </div>
    </section>
  );
};
