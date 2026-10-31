import React from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Binary, 
  Database, 
  ArrowRight, 
  Layers, 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  Zap,
  BookOpen
} from 'lucide-react';
import { SAMPLE_NEWS_ARTICLES, NewsSample } from '../data/samples.ts';
import { DATASET_INFO } from '../ml/benchmarkData.ts';

interface HomeViewProps {
  onStartDetection: (sample?: NewsSample) => void;
  onNavigateTab: (tab: 'detect' | 'dashboard' | 'academic' | 'about') => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onStartDetection, onNavigateTab }) => {
  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-8 sm:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-24 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span>B.Tech CSE (AI & ML) Capstone Project</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>ISOT Corpus Verified</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Fake News Detection System using <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Machine Learning & NLP</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            An academic-grade, end-to-end disinformation classifier utilizing Natural Language Processing (NLTK), sublinear TF-IDF feature extraction, and optimized scikit-learn models including the <strong className="text-emerald-400 font-semibold">Passive Aggressive Classifier</strong>, <strong className="text-teal-300 font-semibold">Logistic Regression</strong>, and <strong className="text-cyan-300 font-semibold">Multinomial Naive Bayes</strong>.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <div className="text-2xl font-black text-emerald-400">93.85%</div>
              <div className="text-xs text-slate-400 font-medium">Model Accuracy (PAC)</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <div className="text-2xl font-black text-cyan-400">44,898</div>
              <div className="text-xs text-slate-400 font-medium">ISOT Corpus Articles</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <div className="text-2xl font-black text-teal-400">5,000</div>
              <div className="text-xs text-slate-400 font-medium">TF-IDF N-Gram Features</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <div className="text-2xl font-black text-indigo-400">&lt; 2ms</div>
              <div className="text-xs text-slate-400 font-medium">Inference Latency</div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={() => onStartDetection()}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/25 transition-all hover:scale-102 active:scale-98"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Launch Live News Detector</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigateTab('dashboard')}
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 hover:border-slate-600 transition-all"
            >
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Model Performance & Confusion Matrix</span>
            </button>

            <button
              onClick={() => onNavigateTab('academic')}
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-semibold text-sm border border-slate-700 transition-all"
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Download Python Flask Code & Viva Guide</span>
            </button>
          </div>
        </div>
      </section>

      {/* End-to-End Pipeline Visualization */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">System Architecture</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Machine Learning & NLP Workflow</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md">
            Every submitted news headline or body runs through a rigorous 5-stage transformation pipeline matching our Python Scikit-learn backend.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            {
              step: '01',
              title: 'Raw Input Text',
              desc: 'Article headline or multi-paragraph body ingested via web interface or REST API.',
              icon: Layers,
              tag: 'Input Layer'
            },
            {
              step: '02',
              title: 'NLTK Text Preprocessing',
              desc: 'Case normalization, punctuation removal, NLTK stopword elimination, and Porter Stemming.',
              icon: Cpu,
              tag: 'NLP Engine'
            },
            {
              step: '03',
              title: 'TF-IDF Vectorization',
              desc: 'Sublinear TF scaling, IDF weighting, and unit L2 vector normalization over 5,000 n-grams.',
              icon: Binary,
              tag: 'Feature Space'
            },
            {
              step: '04',
              title: 'Classifier Inference',
              desc: 'Passive Aggressive hinge-margin evaluation, Logistic Regression, or Naive Bayes posterior.',
              icon: TrendingUp,
              tag: 'Scikit-Learn Model'
            },
            {
              step: '05',
              title: 'Explainable Verdict',
              desc: 'High-contrast Real/Fake classification, probability calibration, and token attribution.',
              icon: ShieldCheck,
              tag: 'Decision Output'
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between group shadow-sm hover:shadow-lg hover:shadow-emerald-500/5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-400">{item.step}</span>
                    <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {item.tag}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick Test Samples Carousel */}
      <section className="space-y-4 rounded-3xl bg-slate-900/60 border border-slate-800 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">Interactive Testing</div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Benchmark News Test Corpus</h2>
            <p className="text-xs text-slate-400">
              Select any pre-verified sample from our test suite to inspect model decisions instantly.
            </p>
          </div>
          <button
            onClick={() => onStartDetection()}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>Or paste custom news</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {SAMPLE_NEWS_ARTICLES.slice(0, 3).map((sample) => (
            <div
              key={sample.id}
              onClick={() => onStartDetection(sample)}
              className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/60 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/10 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    {sample.category}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      sample.groundTruth === 'REAL'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/10 text-red-400 border border-red-500/30'
                    }`}
                  >
                    Ground Truth: {sample.groundTruth}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white line-clamp-2">
                  {sample.title}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-3">
                  {sample.fullText}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-emerald-400 font-semibold">
                <span>Test in Detector</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Technology Stack & Academic Credentials */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Full Technology Stack</h3>
              <p className="text-xs text-slate-400">Strictly adheres to specified project requirements</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Frontend</span>
              <span className="text-slate-100 font-semibold">HTML5, Tailwind, Chart.js, Lucide</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Backend</span>
              <span className="text-slate-100 font-semibold">Python Flask, REST API</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Machine Learning</span>
              <span className="text-slate-100 font-semibold">Scikit-learn, Joblib</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">NLP & Vectorizer</span>
              <span className="text-slate-100 font-semibold">NLTK, Porter Stemmer, TF-IDF</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Database</span>
              <span className="text-slate-100 font-semibold">SQLite3 (History & Logging)</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Classifiers</span>
              <span className="text-slate-100 font-semibold">Passive Aggressive, MNB, LR</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Dataset & Academic Validation</h3>
              <p className="text-xs text-slate-400">{DATASET_INFO.name}</p>
            </div>
          </div>
          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span><strong>44,898 total samples:</strong> 21,417 authentic news articles & 23,481 fact-checked fakes.</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span><strong>Stratified 80/20 partition:</strong> 35,918 training samples, 8,980 unseen test evaluation samples.</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span><strong>Zero dummy predictions:</strong> Full mathematical calculation of TF-IDF, log-likelihood, and hinge loss.</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span><strong>Transparent disclaimer:</strong> Clear probabilistic explainability respecting academic AI ethics.</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
