import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Cpu, 
  Sparkles, 
  Trash2, 
  Copy, 
  Check, 
  RefreshCw, 
  Info, 
  Layers, 
  TrendingUp, 
  Sliders, 
  AlertCircle,
  BarChart,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SAMPLE_NEWS_ARTICLES, NewsSample } from '../data/samples.ts';
import { preprocessText, analyzeTextQuality, PreprocessingPipelineResult, TextQualityMetrics } from '../ml/nlp.ts';
import { vectorizeText, TfidfVectorResult } from '../ml/tfidf.ts';
import { runModelInference, AlgorithmType, ModelPrediction } from '../ml/models.ts';
import { addHistoryRecord } from '../services/historyStore.ts';

interface DetectNewsViewProps {
  initialSample?: NewsSample | null;
  onHistoryAdded?: () => void;
}

export const DetectNewsView: React.FC<DetectNewsViewProps> = ({ initialSample, onHistoryAdded }) => {
  const [headline, setHeadline] = useState(initialSample?.headline || '');
  const [newsText, setNewsText] = useState(initialSample?.fullText || '');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmType>('passive_aggressive');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

  // Results state
  const [predictionResult, setPredictionResult] = useState<ModelPrediction | null>(null);
  const [nlpResult, setNlpResult] = useState<PreprocessingPipelineResult | null>(null);
  const [tfidfResult, setTfidfResult] = useState<TfidfVectorResult | null>(null);
  const [qualityMetrics, setQualityMetrics] = useState<TextQualityMetrics | null>(null);
  const [activeNlpTab, setActiveNlpTab] = useState<'clean' | 'stopwords' | 'stem' | 'tfidf'>('tfidf');

  const handleLoadSample = (sample: NewsSample) => {
    setHeadline(sample.headline);
    setNewsText(sample.fullText);
    setPredictionResult(null);
  };

  const handleClear = () => {
    setHeadline('');
    setNewsText('');
    setPredictionResult(null);
    setNlpResult(null);
    setTfidfResult(null);
    setQualityMetrics(null);
  };

  const handleDetect = () => {
    const combinedText = `${headline} ${newsText}`.trim();
    if (!combinedText || combinedText.length < 10) {
      alert('Please enter at least 10 characters of news text or select a sample article.');
      return;
    }

    setIsAnalyzing(true);

    setTimeout(() => {
      // 1. Quality metrics
      const metrics = analyzeTextQuality(combinedText);
      setQualityMetrics(metrics);

      // 2. Preprocess text using NLTK pipeline
      const prep = preprocessText(combinedText);
      setNlpResult(prep);

      // 3. TF-IDF vectorization
      const tfidf = vectorizeText(prep.stemmedTokens);
      setTfidfResult(tfidf);

      // 4. Model inference
      const prediction = runModelInference(selectedAlgorithm, tfidf);
      setPredictionResult(prediction);

      // 5. Store in history
      const savedTitle = headline || (combinedText.slice(0, 60) + (combinedText.length > 60 ? '...' : ''));
      const savedSnippet = combinedText.slice(0, 160) + (combinedText.length > 160 ? '...' : '');

      addHistoryRecord({
        title: savedTitle,
        snippet: savedSnippet,
        fullText: combinedText,
        prediction: prediction.prediction,
        confidence: prediction.confidence,
        algorithm: prediction.algorithmName,
        wordCount: metrics.wordCount,
        sensationalismScore: metrics.sensationalismScore
      });

      if (onHistoryAdded) {
        onHistoryAdded();
      }

      setIsAnalyzing(false);

      // Celebratory or alert feedback
      if (prediction.prediction === 'REAL') {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#10b981', '#34d399', '#059669']
        });
      }
    }, 400);
  };

  const copyAnalysisReport = () => {
    if (!predictionResult) return;
    const report = `VERITASML DETECTION REPORT
Verdict: ${predictionResult.prediction} NEWS
Confidence: ${predictionResult.confidence}%
Algorithm: ${predictionResult.algorithmName}
Explanation: ${predictionResult.explanation}
Headline: ${headline || 'N/A'}
Word Count: ${qualityMetrics?.wordCount || 0}
Sensationalism Score: ${qualityMetrics?.sensationalismScore || 0}/100`;

    navigator.clipboard.writeText(report);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-2">
            <Cpu className="w-3.5 h-3.5" />
            <span>Interactive Machine Learning Inference</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            News Veracity Classifier
          </h1>
          <p className="text-sm text-slate-400">
            Paste an article, select an algorithm, and evaluate stylistic and lexical credibility.
          </p>
        </div>

        {/* Algorithm Selector Switch */}
        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
          <Sliders className="w-4 h-4 text-slate-400 ml-2" />
          <select
            value={selectedAlgorithm}
            onChange={(e) => setSelectedAlgorithm(e.target.value as AlgorithmType)}
            className="bg-transparent text-xs sm:text-sm font-semibold text-slate-200 focus:outline-none cursor-pointer pr-3 py-1"
          >
            <option value="passive_aggressive" className="bg-slate-900 text-white">
              Passive Aggressive Classifier (93.85% - Best)
            </option>
            <option value="logistic_regression" className="bg-slate-900 text-white">
              Logistic Regression (92.09%)
            </option>
            <option value="naive_bayes" className="bg-slate-900 text-white">
              Multinomial Naive Bayes (89.43%)
            </option>
            <option value="ensemble" className="bg-slate-900 text-white">
              Ensemble Voting (PAC + LR + MNB)
            </option>
          </select>
        </div>
      </div>

      {/* Main Grid: Input Column & Results Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input Panel (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-5 shadow-sm">
            {/* Sample Selector Buttons */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>Quick Test with Benchmark Samples:</span>
                <span className="text-[11px] text-slate-400">Click to autofill</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SAMPLE_NEWS_ARTICLES.slice(0, 4).map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleLoadSample(sample)}
                    className="flex items-center justify-between text-left px-3 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 hover:border-emerald-500/50 transition-all text-xs group"
                  >
                    <span className="truncate max-w-[190px] font-medium text-slate-300 group-hover:text-white">
                      {sample.title}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase shrink-0 ${
                        sample.groundTruth === 'REAL'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-red-500/20 text-red-300'
                      }`}
                    >
                      {sample.groundTruth}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* News Headline Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Article Headline / Title (Optional)</span>
                <span className="text-[11px] text-slate-400">{headline.length} chars</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Federal Reserve Holds Interest Rates Steady, Officials Cite Labor Market Stability"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-emerald-500 focus:outline-none transition-colors"
              />
            </div>

            {/* News Content Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">
                  Article Body or News Snippet <span className="text-emerald-400">*</span>
                </label>
                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span>{newsText.trim().split(/\s+/).filter(Boolean).length} words</span>
                  <span>{newsText.length} characters</span>
                </div>
              </div>
              <textarea
                rows={9}
                placeholder="Paste the full article text, breaking news statement, or social media news headline here for machine learning analysis..."
                value={newsText}
                onChange={(e) => setNewsText(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-emerald-500 focus:outline-none transition-colors leading-relaxed font-sans"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleClear}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleDetect}
                disabled={isAnalyzing || (!headline && !newsText)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all hover:scale-102 active:scale-98 cursor-pointer disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing Text with ML...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Detect News Veracity</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Text Preprocessing Pipeline Inspector */}
          {nlpResult && qualityMetrics && (
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">NLP Preprocessing Pipeline</h3>
                </div>
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                  <button
                    onClick={() => setActiveNlpTab('tfidf')}
                    className={`px-2 py-1 text-xs font-semibold rounded ${
                      activeNlpTab === 'tfidf' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    TF-IDF Features
                  </button>
                  <button
                    onClick={() => setActiveNlpTab('stem')}
                    className={`px-2 py-1 text-xs font-semibold rounded ${
                      activeNlpTab === 'stem' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Porter Stems
                  </button>
                  <button
                    onClick={() => setActiveNlpTab('stopwords')}
                    className={`px-2 py-1 text-xs font-semibold rounded ${
                      activeNlpTab === 'stopwords' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Removed Stopwords ({nlpResult.removedStopwords.length})
                  </button>
                  <button
                    onClick={() => setActiveNlpTab('clean')}
                    className={`px-2 py-1 text-xs font-semibold rounded ${
                      activeNlpTab === 'clean' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Sanitized
                  </button>
                </div>
              </div>

              {/* Tab: TF-IDF Features Table */}
              {activeNlpTab === 'tfidf' && tfidfResult && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Top Weighted Terms (Sublinear TF * IDF, Normalized L2)</span>
                    <span>L2 Vector Norm: {tfidfResult.l2Norm}</span>
                  </div>
                  <div className="overflow-x-auto max-h-48 border border-slate-800 rounded-lg">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-slate-950 text-slate-400 sticky top-0">
                        <tr>
                          <th className="px-3 py-1.5">Stemmed Token</th>
                          <th className="px-3 py-1.5">Raw TF</th>
                          <th className="px-3 py-1.5">Sublinear TF</th>
                          <th className="px-3 py-1.5">IDF</th>
                          <th className="px-3 py-1.5">TF-IDF (L2)</th>
                          <th className="px-3 py-1.5">In ISOT Vocab</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-300">
                        {tfidfResult.features.slice(0, 10).map((f, i) => (
                          <tr key={i} className="hover:bg-slate-800/40">
                            <td className="px-3 py-1 text-white font-semibold">{f.token}</td>
                            <td className="px-3 py-1">{f.tf}</td>
                            <td className="px-3 py-1">{f.sublinearTf}</td>
                            <td className="px-3 py-1">{f.idf}</td>
                            <td className="px-3 py-1 text-emerald-400 font-bold">{f.tfidfNormalized}</td>
                            <td className="px-3 py-1">
                              {f.inVocabulary ? (
                                <span className="text-emerald-400 font-semibold">Yes</span>
                              ) : (
                                <span className="text-slate-400">Default</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab: Porter Stems */}
              {activeNlpTab === 'stem' && (
                <div className="space-y-2">
                  <p className="text-xs text-slate-400">
                    Extracted morphological stems using standard NLTK PorterStemmer:
                  </p>
                  <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-2 bg-slate-950 rounded-lg border border-slate-800">
                    {nlpResult.stemmedTokens.map((stem, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-xs border border-slate-700">
                        {stem}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab: Removed Stopwords */}
              {activeNlpTab === 'stopwords' && (
                <div className="space-y-2">
                  <p className="text-xs text-slate-400">
                    Filtered common English stopwords (NLTK corpus, 179 terms):
                  </p>
                  <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-2 bg-slate-950 rounded-lg border border-slate-800">
                    {nlpResult.removedStopwords.map((stop, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-rose-950/40 text-rose-300 font-mono text-xs border border-rose-900/50">
                        {stop}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab: Cleaned text */}
              {activeNlpTab === 'clean' && (
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 max-h-40 overflow-y-auto leading-relaxed">
                  {nlpResult.cleanedText}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Prediction Results Panel (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-6">
          {predictionResult ? (
            <div className="space-y-6">
              {/* Giant Result Card */}
              <div
                className={`relative overflow-hidden rounded-2xl border p-6 shadow-xl transition-all ${
                  predictionResult.prediction === 'REAL'
                    ? 'bg-gradient-to-b from-emerald-950/70 via-slate-900 to-slate-950 border-emerald-500/60 shadow-emerald-500/10'
                    : 'bg-gradient-to-b from-rose-950/70 via-slate-900 to-slate-950 border-rose-500/60 shadow-rose-500/10'
                }`}
              >
                {/* Result Header */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Classification Result
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {predictionResult.algorithmName}
                  </span>
                </div>

                {/* Main Classification Banner */}
                <div className="my-5 flex items-center gap-4">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${
                      predictionResult.prediction === 'REAL'
                        ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30'
                        : 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                    }`}
                  >
                    {predictionResult.prediction === 'REAL' ? (
                      <ShieldCheck className="w-10 h-10" />
                    ) : (
                      <AlertTriangle className="w-10 h-10" />
                    )}
                  </div>
                  <div>
                    <div
                      className={`text-3xl font-black tracking-tight ${
                        predictionResult.prediction === 'REAL' ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {predictionResult.prediction} NEWS
                    </div>
                    <div className="text-xs text-slate-300 flex items-center gap-2 mt-0.5">
                      <span>Model Confidence:</span>
                      <strong className="text-sm font-bold text-white">
                        {predictionResult.confidence}%
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Confidence Visual Gauge Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-400">Posterior Probability Distribution</span>
                    <span className="text-slate-200">
                      Real: {predictionResult.probReal}% | Fake: {predictionResult.probFake}%
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex">
                    <div
                      style={{ width: `${predictionResult.probReal}%` }}
                      className="h-full bg-emerald-500 transition-all duration-700"
                    />
                    <div
                      style={{ width: `${predictionResult.probFake}%` }}
                      className="h-full bg-rose-500 transition-all duration-700"
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 pt-0.5">
                    <span>0% (Authentic Wire)</span>
                    <span>Decision Boundary (50%)</span>
                    <span>100% (Sensational Hoax)</span>
                  </div>
                </div>

                {/* Model Explanation Text */}
                <div className="mt-5 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  <strong className="text-white block mb-1 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-emerald-400" />
                    Model Decision Analysis:
                  </strong>
                  {predictionResult.explanation}
                </div>

                {/* Academic Disclaimer Notice */}
                <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200/90 flex items-start gap-2 leading-snug">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Academic ML Disclaimer:</strong> This confidence score is a statistical probability derived from stylistic, lexical, and structural features in the training corpus. It is an algorithmic indicator, not an infallible guarantee of factual truth.
                  </span>
                </div>

                {/* Copy report button */}
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={copyAnalysisReport}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  >
                    {hasCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Report Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Summary</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Explainable AI (XAI): Feature Attribution Waterfall */}
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <BarChart className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white">Explainable AI: Key Token Signals</h3>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">LIME/SHAP Approximation</span>
                </div>

                <div className="space-y-3">
                  {predictionResult.topRealFeatures.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Tokens Correlating with Real Reporting:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {predictionResult.topRealFeatures.map((feat, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-mono"
                          >
                            <span>{feat.token}</span>
                            <span className="text-[10px] text-emerald-400 font-bold">
                              +{feat.contribution.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {predictionResult.topFakeFeatures.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <div className="text-xs font-semibold text-rose-400 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Tokens Correlating with Misleading / Fake Claims:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {predictionResult.topFakeFeatures.map((feat, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-300 border border-rose-500/30 text-xs font-mono"
                          >
                            <span>{feat.token}</span>
                            <span className="text-[10px] text-rose-400 font-bold">
                              {feat.contribution.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {predictionResult.topRealFeatures.length === 0 && predictionResult.topFakeFeatures.length === 0 && (
                    <p className="text-xs text-slate-400 italic">
                      No strongly biased domain tokens detected in the active vocabulary. Classification was driven by baseline sentence structure and sublinear term distribution.
                    </p>
                  )}
                </div>
              </div>

              {/* Text Quality & Stylometry Metrics */}
              {qualityMetrics && (
                <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-sm font-bold text-white">Stylometry & Lexical Properties</h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Sensationalism</span>
                      <span className={`text-base font-bold ${
                        qualityMetrics.sensationalismScore > 40 ? 'text-rose-400' : 'text-emerald-400'
                      }`}>
                        {qualityMetrics.sensationalismScore}/100
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Reading Ease</span>
                      <span className="text-base font-bold text-slate-100">
                        {qualityMetrics.readabilityScore}/100
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Uppercase Ratio</span>
                      <span className="text-base font-bold text-slate-100">
                        {qualityMetrics.uppercaseRatio}%
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Exclamations</span>
                      <span className="text-base font-bold text-slate-100">
                        {qualityMetrics.exclamationCount}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Sentences</span>
                      <span className="text-base font-bold text-slate-100">
                        {qualityMetrics.sentenceCount}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Avg Word Length</span>
                      <span className="text-base font-bold text-slate-100">
                        {qualityMetrics.avgWordLength} chars
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full min-h-[380px] rounded-2xl bg-slate-900/60 border border-dashed border-slate-800 p-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-400">
                <Cpu className="w-8 h-8" />
              </div>
              <div className="space-y-1.5 max-w-sm">
                <h3 className="text-base font-bold text-white">Inference Engine Ready</h3>
                <p className="text-xs text-slate-400">
                  Enter news text on the left or select a sample article, then click "Detect News Veracity" to view predictions, TF-IDF weights, and explainability reports.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
