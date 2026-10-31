import React from 'react';
import { 
  Info, 
  Cpu, 
  Binary, 
  BookOpen, 
  ShieldAlert, 
  Sparkles, 
  Award,
  CheckCircle2,
  BrainCircuit,
  Scale
} from 'lucide-react';
import { DATASET_INFO } from '../ml/benchmarkData.ts';

export const AboutView: React.FC = () => {
  return (
    <div className="space-y-10 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-400 text-xs font-semibold">
          <Info className="w-3.5 h-3.5" />
          <span>Academic Documentation & Project Theory</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          About VeritasML & Mathematical Methodology
        </h1>
        <p className="text-sm text-slate-400">
          Theoretical foundations, mathematical formulations, and engineering principles behind automated fake news detection.
        </p>
      </div>

      {/* 1. Academic Abstract & Problem Statement */}
      <section className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Project Abstract & Objectives</h2>
            <p className="text-xs text-slate-400">Bachelor of Technology in Computer Science & Engineering (AI & ML)</p>
          </div>
        </div>

        <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3">
          <p>
            The proliferation of unverified digital news articles, synthetic clickbait, and state-sponsored disinformation poses an acute threat to public discourse, democratic processes, and public health awareness. Traditional manual fact-checking organizations cannot scale with the velocity of social media publication.
          </p>
          <p>
            This project develops an autonomous, scalable fake news detection pipeline employing machine learning algorithms and Natural Language Processing (NLP). By examining subtle stylometric anomalies, hyperbolic emotional cues, and lack of standard journalistic attribution, our system classifies articles as <strong>REAL</strong> or <strong>FAKE</strong> with probabilistic confidence and transparent feature attribution.
          </p>
        </div>
      </section>

      {/* 2. Mathematical Formulations */}
      <section className="space-y-6">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">Algorithmic Theory</div>
          <h2 className="text-2xl font-bold text-white">Mathematical Formulations</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Passive Aggressive Classifier */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400">
              <BrainCircuit className="w-5 h-5" />
              <h3 className="font-bold text-white text-base">1. Passive Aggressive Classifier (PAC)</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              An online margin-based algorithm designed for continuous text streams. It minimizes a constrained optimization problem balancing weight stability and hinge loss:
            </p>
            <div className="p-3.5 rounded-xl bg-slate-950 font-mono text-xs text-emerald-300 space-y-2 border border-slate-800">
              <div>Hinge Loss:</div>
              <div className="text-white">ℓ(w; (x, y)) = max(0, 1 - y(w · x))</div>
              <div className="pt-1">Weight Update:</div>
              <div className="text-white">w_(t+1) = w_t + τ_t · y_t · x_t</div>
              <div className="text-slate-400 text-[11px]">where step size τ_t = ℓ_t / (||x_t||² + 1 / (2C))</div>
            </div>
            <p className="text-xs text-slate-400">
              If the article is correctly classified with margin ≥ 1, the model is <em>passive</em> (zero update). If an error occurs, it is <em>aggressive</em> in rectifying the hyperplane with minimal L2 norm change.
            </p>
          </div>

          {/* Card 2: TF-IDF Vectorization */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-cyan-400">
              <Binary className="w-5 h-5" />
              <h3 className="font-bold text-white text-base">2. Sublinear TF-IDF Vectorization</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Transforms variable-length natural language text into numerical vectors with logarithmic frequency dampening:
            </p>
            <div className="p-3.5 rounded-xl bg-slate-950 font-mono text-xs text-cyan-300 space-y-2 border border-slate-800">
              <div>Sublinear Term Frequency:</div>
              <div className="text-white">TF(t, d) = 1 + log(count(t, d))  [if count &gt; 0]</div>
              <div className="pt-1">Inverse Document Frequency:</div>
              <div className="text-white">IDF(t, D) = log((1 + |D|) / (1 + df(t))) + 1</div>
              <div className="pt-1">L2 Euclidean Normalization:</div>
              <div className="text-white">v_normalized = v / ||v||₂</div>
            </div>
            <p className="text-xs text-slate-400">
              L2 normalization prevents long news articles from dominating vector magnitudes compared to short breaking headlines.
            </p>
          </div>

          {/* Card 3: Multinomial Naive Bayes */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-indigo-400">
              <Scale className="w-5 h-5" />
              <h3 className="font-bold text-white text-base">3. Multinomial Naive Bayes (MNB)</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Computes maximum a posteriori (MAP) class probabilities assuming conditional feature independence given class c ∈ &#123;REAL, FAKE&#125;:
            </p>
            <div className="p-3.5 rounded-xl bg-slate-950 font-mono text-xs text-indigo-300 space-y-2 border border-slate-800">
              <div>Bayes Posterior Rule:</div>
              <div className="text-white">P(c | d) ∝ P(c) · ∏ P(w_i | c)^(tf_i)</div>
              <div className="pt-1">Laplace Smoothing (α = 0.1):</div>
              <div className="text-white">P(w_i | c) = (N_ci + α) / (N_c + α|V|)</div>
            </div>
            <p className="text-xs text-slate-400">
              Laplace smoothing avoids zero-probability errors when evaluating rare or unseen tokens.
            </p>
          </div>

          {/* Card 4: Logistic Regression */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-teal-400">
              <Cpu className="w-5 h-5" />
              <h3 className="font-bold text-white text-base">4. Regularized Logistic Regression</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Models the log-odds of news authenticity as a linear combination of TF-IDF features with L2 weight shrinkage:
            </p>
            <div className="p-3.5 rounded-xl bg-slate-950 font-mono text-xs text-teal-300 space-y-2 border border-slate-800">
              <div>Logit Link & Sigmoid Function:</div>
              <div className="text-white">P(Real | x) = 1 / (1 + e^(-(β₀ + ∑ β_i x_i)))</div>
              <div className="pt-1">Objective with L2 Penalty:</div>
              <div className="text-white">min 1/2 ||w||² + C ∑ log(1 + e^(-y_i(w · x_i)))</div>
            </div>
            <p className="text-xs text-slate-400">
              Hyperparameter C=10.0 provides a calibrated balance between training accuracy and generalizability to fresh news topics.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Benchmark Dataset Description */}
      <section className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
        <h3 className="text-lg font-bold text-white">Dataset Provenance & Class Distribution</h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          The models are evaluated against the acclaimed <strong>{DATASET_INFO.name}</strong>, widely utilized in academic literature on automated deception detection:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold uppercase text-emerald-400 block">Real News Corpus</span>
            <div className="text-xl font-black text-white">{DATASET_INFO.realSamples.toLocaleString()} Articles</div>
            <p className="text-xs text-slate-400">
              Sourced from official Reuters wire feeds (2016-2017) exhibiting standard editorial oversight and quotes.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold uppercase text-rose-400 block">Fake News Corpus</span>
            <div className="text-xl font-black text-white">{DATASET_INFO.fakeSamples.toLocaleString()} Articles</div>
            <p className="text-xs text-slate-400">
              Sourced from notorious debunked hoax websites and flagged by independent fact-checking bodies (Politifact, Snopes).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold uppercase text-cyan-400 block">Feature Dimension</span>
            <div className="text-xl font-black text-white">{DATASET_INFO.vocabularyFeatures.toLocaleString()} Features</div>
            <p className="text-xs text-slate-400">
              Unigrams and bigrams selected by TF-IDF ranking with English stopword elimination.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Ethical AI & Disclaimers */}
      <section className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-6 space-y-3 text-amber-200/90 text-xs sm:text-sm leading-relaxed">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
          <ShieldAlert className="w-5 h-5 shrink-0" />
          <span>Ethical Boundaries & Technical Limitations</span>
        </div>
        <p>
          Automated text classifiers analyze structural, lexical, and stylistic indicators. They do not maintain an omniscient real-time factual knowledge graph. A satirical publication or a verified breaking development that employs dramatic vocabulary may receive false-positive indicators, while highly sophisticated state-sponsored disinformation mimicking formal wire prose may escape pure lexical detection.
        </p>
        <p>
          Therefore, this academic system is designed as an <strong>investigative decision-support tool</strong> rather than an automated censorship mechanism, fully respecting democratic principles of open information and critical digital literacy.
        </p>
      </section>
    </div>
  );
};
