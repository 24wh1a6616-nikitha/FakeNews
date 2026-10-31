import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Layers, 
  Sliders, 
  Info, 
  CheckCircle2, 
  Award,
  Zap,
  Target
} from 'lucide-react';
import { BENCHMARK_MODELS, DATASET_INFO, TOP_INDICATIVE_FEATURES, ModelBenchmark } from '../ml/benchmarkData.ts';

export const PerformanceDashboardView: React.FC = () => {
  const [selectedModelId, setSelectedModelId] = useState<string>('passive_aggressive');
  const activeModel: ModelBenchmark = BENCHMARK_MODELS[selectedModelId] || BENCHMARK_MODELS.passive_aggressive;

  const modelsList = Object.values(BENCHMARK_MODELS);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Academic Validation & Benchmarking</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Model Performance & Evaluation Dashboard
          </h1>
          <p className="text-sm text-slate-400">
            Empirical comparative analysis trained on 44,898 articles from the ISOT Fake News Dataset (80/20 train/test split).
          </p>
        </div>

        {/* Algorithm Switcher */}
        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
          <Sliders className="w-4 h-4 text-slate-400 ml-2" />
          <select
            value={selectedModelId}
            onChange={(e) => setSelectedModelId(e.target.value)}
            className="bg-transparent text-xs sm:text-sm font-semibold text-slate-200 focus:outline-none cursor-pointer pr-3 py-1"
          >
            {modelsList.map((m) => (
              <option key={m.id} value={m.id} className="bg-slate-900 text-white">
                {m.name} ({m.metrics.accuracy}% Acc)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Highlight Cards for Active Model */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Accuracy</span>
          <div className="text-2xl font-black text-emerald-400">{activeModel.metrics.accuracy}%</div>
          <span className="text-[10px] text-slate-400 block">(TP + TN) / Total</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Precision</span>
          <div className="text-2xl font-black text-teal-400">{activeModel.metrics.precision}%</div>
          <span className="text-[10px] text-slate-400 block">TP / (TP + FP)</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Recall (Sens.)</span>
          <div className="text-2xl font-black text-cyan-400">{activeModel.metrics.recall}%</div>
          <span className="text-[10px] text-slate-400 block">TP / (TP + FN)</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">F1-Score</span>
          <div className="text-2xl font-black text-indigo-400">{activeModel.metrics.f1Score}%</div>
          <span className="text-[10px] text-slate-400 block">Harmonic Mean</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">ROC-AUC</span>
          <div className="text-2xl font-black text-violet-400">{activeModel.metrics.rocAuc}</div>
          <span className="text-[10px] text-slate-400 block">Area Under Curve</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">MCC Score</span>
          <div className="text-2xl font-black text-amber-400">{activeModel.metrics.mcc}</div>
          <span className="text-[10px] text-slate-400 block">Matthews Corr. Coeff</span>
        </div>
      </div>

      {/* Algorithm Comparison Chart & Table */}
      <section className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">Model Benchmarking</div>
            <h2 className="text-xl font-bold text-white">Comparative Algorithm Performance</h2>
          </div>
          <span className="text-xs text-slate-400">
            Evaluated on N={DATASET_INFO.testSamples} unseen test set articles
          </span>
        </div>

        {/* Visual Bar Comparison */}
        <div className="space-y-4 pt-2">
          {modelsList.map((model) => {
            const isBest = model.id === 'passive_aggressive';
            return (
              <div key={model.id} className="space-y-1.5 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm">{model.name}</span>
                    {isBest && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        Selected Best Model
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <span>Acc: <strong className="text-emerald-400">{model.metrics.accuracy}%</strong></span>
                    <span>F1: <strong className="text-indigo-400">{model.metrics.f1Score}%</strong></span>
                    <span>ROC: <strong className="text-cyan-400">{model.metrics.rocAuc}</strong></span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-3.5 rounded-full bg-slate-800 overflow-hidden flex">
                  <div
                    style={{ width: `${model.metrics.accuracy}%` }}
                    className={`h-full transition-all duration-700 ${
                      isBest ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-slate-500'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Metrics Table */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs font-mono border border-slate-800 rounded-lg">
            <thead className="bg-slate-950 text-slate-300">
              <tr>
                <th className="px-3.5 py-2.5 font-bold">Algorithm Name</th>
                <th className="px-3.5 py-2.5 font-bold">Accuracy</th>
                <th className="px-3.5 py-2.5 font-bold">Precision</th>
                <th className="px-3.5 py-2.5 font-bold">Recall</th>
                <th className="px-3.5 py-2.5 font-bold">F1-Score</th>
                <th className="px-3.5 py-2.5 font-bold">Specificity</th>
                <th className="px-3.5 py-2.5 font-bold">MCC</th>
                <th className="px-3.5 py-2.5 font-bold">ROC-AUC</th>
                <th className="px-3.5 py-2.5 font-bold">Train Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {modelsList.map((m) => (
                <tr
                  key={m.id}
                  onClick={() => setSelectedModelId(m.id)}
                  className={`cursor-pointer transition-colors ${
                    m.id === selectedModelId ? 'bg-emerald-500/10 text-white font-semibold' : 'hover:bg-slate-800/40'
                  }`}
                >
                  <td className="px-3.5 py-2.5 flex items-center gap-1.5 text-white">
                    {m.id === 'passive_aggressive' && <Award className="w-3.5 h-3.5 text-emerald-400" />}
                    <span>{m.name}</span>
                  </td>
                  <td className="px-3.5 py-2.5 text-emerald-400 font-bold">{m.metrics.accuracy}%</td>
                  <td className="px-3.5 py-2.5">{m.metrics.precision}%</td>
                  <td className="px-3.5 py-2.5">{m.metrics.recall}%</td>
                  <td className="px-3.5 py-2.5 text-indigo-400 font-bold">{m.metrics.f1Score}%</td>
                  <td className="px-3.5 py-2.5">{m.metrics.specificity}%</td>
                  <td className="px-3.5 py-2.5">{m.metrics.mcc}</td>
                  <td className="px-3.5 py-2.5">{m.metrics.rocAuc}</td>
                  <td className="px-3.5 py-2.5">{m.metrics.trainingTimeSec}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Confusion Matrix & ROC Curve Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Interactive Confusion Matrix Heatmap (6 cols) */}
        <div className="lg:col-span-6 rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">Error Analysis</div>
              <h3 className="text-lg font-bold text-white">
                Confusion Matrix: {activeModel.shortName}
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Total Test: {DATASET_INFO.testSamples}
            </span>
          </div>

          {/* 2x2 Heatmap Matrix Grid */}
          <div className="space-y-4">
            <div className="text-center text-xs font-semibold text-slate-400">
              Predicted Class
            </div>
            <div className="flex">
              {/* Actual label vertical header */}
              <div className="flex items-center justify-center -rotate-90 text-xs font-semibold text-slate-400 w-8">
                Actual Class
              </div>

              {/* Matrix Table */}
              <div className="flex-1 space-y-2">
                {/* Column Headers */}
                <div className="grid grid-cols-2 text-center text-xs font-bold text-slate-300">
                  <span>PREDICTED REAL</span>
                  <span>PREDICTED FAKE</span>
                </div>

                {/* Row 1: Actual REAL */}
                <div className="grid grid-cols-2 gap-2">
                  {/* True Positive */}
                  <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-center space-y-1">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 block">
                      True Positive (TP)
                    </span>
                    <div className="text-2xl font-black text-emerald-300 font-mono">
                      {activeModel.confusionMatrix.tp.toLocaleString()}
                    </div>
                    <span className="text-[10px] text-slate-400 block">
                      Correctly identified Real News
                    </span>
                    <span className="text-[11px] font-bold text-emerald-400 block">
                      {((activeModel.confusionMatrix.tp / DATASET_INFO.testSamples) * 100).toFixed(1)}% of total
                    </span>
                  </div>

                  {/* False Negative */}
                  <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-center space-y-1">
                    <span className="text-[10px] uppercase font-bold text-rose-400 block">
                      False Negative (FN) - Type II Error
                    </span>
                    <div className="text-2xl font-black text-rose-300 font-mono">
                      {activeModel.confusionMatrix.fn.toLocaleString()}
                    </div>
                    <span className="text-[10px] text-slate-400 block">
                      Real News falsely flagged as Fake
                    </span>
                    <span className="text-[11px] font-bold text-rose-400 block">
                      {((activeModel.confusionMatrix.fn / DATASET_INFO.testSamples) * 100).toFixed(1)}% of total
                    </span>
                  </div>
                </div>

                {/* Row 2: Actual FAKE */}
                <div className="grid grid-cols-2 gap-2">
                  {/* False Positive */}
                  <div className="p-4 rounded-xl bg-amber-500/15 border border-amber-500/30 text-center space-y-1">
                    <span className="text-[10px] uppercase font-bold text-amber-400 block">
                      False Positive (FP) - Type I Error
                    </span>
                    <div className="text-2xl font-black text-amber-300 font-mono">
                      {activeModel.confusionMatrix.fp.toLocaleString()}
                    </div>
                    <span className="text-[10px] text-slate-400 block">
                      Fake News falsely trusted as Real
                    </span>
                    <span className="text-[11px] font-bold text-amber-400 block">
                      {((activeModel.confusionMatrix.fp / DATASET_INFO.testSamples) * 100).toFixed(1)}% of total
                    </span>
                  </div>

                  {/* True Negative */}
                  <div className="p-4 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-center space-y-1">
                    <span className="text-[10px] uppercase font-bold text-cyan-400 block">
                      True Negative (TN)
                    </span>
                    <div className="text-2xl font-black text-cyan-300 font-mono">
                      {activeModel.confusionMatrix.tn.toLocaleString()}
                    </div>
                    <span className="text-[10px] text-slate-400 block">
                      Correctly identified Fake News
                    </span>
                    <span className="text-[11px] font-bold text-cyan-400 block">
                      {((activeModel.confusionMatrix.tn / DATASET_INFO.testSamples) * 100).toFixed(1)}% of total
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Classification Report Table for Active Model */}
            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-300 block mb-2">
                Class-Specific Evaluation Report:
              </span>
              <table className="w-full text-left text-xs font-mono border border-slate-800 rounded-lg">
                <thead className="bg-slate-950 text-slate-400">
                  <tr>
                    <th className="px-3 py-1.5">Class</th>
                    <th className="px-3 py-1.5">Precision</th>
                    <th className="px-3 py-1.5">Recall</th>
                    <th className="px-3 py-1.5">F1-Score</th>
                    <th className="px-3 py-1.5">Support</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  <tr>
                    <td className="px-3 py-1.5 text-emerald-400 font-bold">REAL NEWS</td>
                    <td className="px-3 py-1.5">{(activeModel.classificationReport.real.precision * 100).toFixed(1)}%</td>
                    <td className="px-3 py-1.5">{(activeModel.classificationReport.real.recall * 100).toFixed(1)}%</td>
                    <td className="px-3 py-1.5">{(activeModel.classificationReport.real.f1Score * 100).toFixed(1)}%</td>
                    <td className="px-3 py-1.5">{activeModel.classificationReport.real.support}</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-1.5 text-rose-400 font-bold">FAKE NEWS</td>
                    <td className="px-3 py-1.5">{(activeModel.classificationReport.fake.precision * 100).toFixed(1)}%</td>
                    <td className="px-3 py-1.5">{(activeModel.classificationReport.fake.recall * 100).toFixed(1)}%</td>
                    <td className="px-3 py-1.5">{(activeModel.classificationReport.fake.f1Score * 100).toFixed(1)}%</td>
                    <td className="px-3 py-1.5">{activeModel.classificationReport.fake.support}</td>
                  </tr>
                  <tr className="bg-slate-950/60 font-semibold">
                    <td className="px-3 py-1.5 text-slate-400">Macro Avg</td>
                    <td className="px-3 py-1.5">{(activeModel.classificationReport.macroAvg.precision * 100).toFixed(1)}%</td>
                    <td className="px-3 py-1.5">{(activeModel.classificationReport.macroAvg.recall * 100).toFixed(1)}%</td>
                    <td className="px-3 py-1.5">{(activeModel.classificationReport.macroAvg.f1Score * 100).toFixed(1)}%</td>
                    <td className="px-3 py-1.5">{activeModel.classificationReport.macroAvg.support}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Receiver Operating Characteristic (ROC) Curve (6 cols) */}
        <div className="lg:col-span-6 rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-cyan-400">Discrimination Ability</div>
              <h3 className="text-lg font-bold text-white">ROC Curve (Receiver Operating Characteristic)</h3>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              AUC: {activeModel.metrics.rocAuc}
            </span>
          </div>

          {/* SVG Visual ROC Curve */}
          <div className="space-y-3">
            <div className="relative w-full aspect-[4/3] bg-slate-950 rounded-xl p-4 border border-slate-800 flex items-center justify-center">
              <svg viewBox="0 0 300 240" className="w-full h-full overflow-visible">
                {/* Grid Lines */}
                <line x1="40" y1="20" x2="280" y2="20" stroke="#1e293b" strokeDasharray="2,2" />
                <line x1="40" y1="70" x2="280" y2="70" stroke="#1e293b" strokeDasharray="2,2" />
                <line x1="40" y1="120" x2="280" y2="120" stroke="#1e293b" strokeDasharray="2,2" />
                <line x1="40" y1="170" x2="280" y2="170" stroke="#1e293b" strokeDasharray="2,2" />
                <line x1="40" y1="210" x2="280" y2="210" stroke="#334155" />

                <line x1="40" y1="20" x2="40" y2="210" stroke="#334155" />
                <line x1="100" y1="20" x2="100" y2="210" stroke="#1e293b" strokeDasharray="2,2" />
                <line x1="160" y1="20" x2="160" y2="210" stroke="#1e293b" strokeDasharray="2,2" />
                <line x1="220" y1="20" x2="220" y2="210" stroke="#1e293b" strokeDasharray="2,2" />
                <line x1="280" y1="20" x2="280" y2="210" stroke="#1e293b" strokeDasharray="2,2" />

                {/* Random Guess Diagonal (AUC = 0.5) */}
                <line x1="40" y1="210" x2="280" y2="20" stroke="#64748b" strokeDasharray="4,4" strokeWidth="1.5" />

                {/* Model ROC Curve Path */}
                {/* Map FPR [0, 1] -> [40, 280], TPR [0, 1] -> [210, 20] */}
                <path
                  d={activeModel.rocCurve.reduce((acc, pt, i) => {
                    const x = 40 + pt.fpr * 240;
                    const y = 210 - pt.tpr * 190;
                    return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
                  }, '')}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  className="drop-shadow-md"
                />

                {/* Coordinate Dots */}
                {activeModel.rocCurve.map((pt, i) => {
                  const x = 40 + pt.fpr * 240;
                  const y = 210 - pt.tpr * 190;
                  return (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r="4"
                      fill="#34d399"
                      stroke="#064e3b"
                      strokeWidth="1.5"
                    />
                  );
                })}

                {/* Axis Labels */}
                <text x="35" y="25" textAnchor="end" fill="#94a3b8" fontSize="10" fontFamily="monospace">1.0</text>
                <text x="35" y="120" textAnchor="end" fill="#94a3b8" fontSize="10" fontFamily="monospace">0.5</text>
                <text x="35" y="210" textAnchor="end" fill="#94a3b8" fontSize="10" fontFamily="monospace">0.0</text>

                <text x="40" y="225" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">0.0</text>
                <text x="160" y="225" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">0.5</text>
                <text x="280" y="225" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">1.0</text>
              </svg>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-emerald-500 rounded" />
                <span>{activeModel.shortName} (AUC = {activeModel.metrics.rocAuc})</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 border-t border-dashed border-slate-500" />
                <span>Random Baseline (AUC = 0.50)</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed pt-1">
              The ROC curve maps the True Positive Rate (Sensitivity) against the False Positive Rate (1 - Specificity) across operating decision thresholds. An AUC of {activeModel.metrics.rocAuc} proves outstanding discrimination between authentic journalistic text and fabricated disinformation.
            </p>
          </div>
        </div>
      </div>

      {/* Top Discriminative Linguistic Features Section */}
      <section className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-6">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">Lexical Transparency</div>
          <h2 className="text-xl font-bold text-white">Top Discriminative Linguistic Features (ISOT Corpus)</h2>
          <p className="text-xs text-slate-400">
            Fitted regression coefficients and frequency-adjusted weights that drive classification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Real Indicative Features */}
          <div className="space-y-3 p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Top Features Indicative of REAL NEWS (+ Weight)</span>
              </span>
              <span className="text-[11px] text-slate-400">Formal Attribution & Quotes</span>
            </div>
            <div className="space-y-2">
              {TOP_INDICATIVE_FEATURES.realNewsTokens.slice(0, 8).map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs font-mono bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-[10px]">#{i + 1}</span>
                    <span className="text-white font-bold">{item.token}</span>
                    <span className="text-[10px] text-slate-400 font-sans">({item.category})</span>
                  </div>
                  <span className="text-emerald-400 font-bold">+{item.weight.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Fake Indicative Features */}
          <div className="space-y-3 p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                <Target className="w-4 h-4" />
                <span>Top Features Indicative of FAKE NEWS (- Weight)</span>
              </span>
              <span className="text-[11px] text-slate-400">Conspiracy & Hyperbolic</span>
            </div>
            <div className="space-y-2">
              {TOP_INDICATIVE_FEATURES.fakeNewsTokens.slice(0, 8).map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs font-mono bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-[10px]">#{i + 1}</span>
                    <span className="text-white font-bold">{item.token}</span>
                    <span className="text-[10px] text-slate-400 font-sans">({item.category})</span>
                  </div>
                  <span className="text-rose-400 font-bold">{item.weight.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
