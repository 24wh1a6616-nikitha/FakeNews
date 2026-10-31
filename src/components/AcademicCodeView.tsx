import React, { useState } from 'react';
import { 
  Code2, 
  Download, 
  Copy, 
  Check, 
  FileCode, 
  FolderTree, 
  BookOpen, 
  Terminal, 
  PackageCheck,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import JSZip from 'jszip';
import { ACADEMIC_FILES, AcademicFile } from '../academic/pythonCode.ts';

export const AcademicCodeView: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<AcademicFile>(ACADEMIC_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'viva' | 'tree'>('code');
  const [expandedVivaIndex, setExpandedVivaIndex] = useState<number | null>(0);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSingle = () => {
    const blob = new Blob([selectedFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', selectedFile.filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();
      const folder = zip.folder('veritas_ml_project');

      // Add all academic files
      ACADEMIC_FILES.forEach(file => {
        folder?.file(file.filename, file.content);
      });

      // Add sample instructions
      folder?.file('START_HERE.txt', `VERITASML: B.TECH CSE (AI & ML) PROJECT
To set up and run this project:
1. Ensure Python 3.9+ is installed
2. Run: pip install -r requirements.txt
3. Run: python download_dataset.py
4. Run: python train_model.py
5. Run: python app.py
Access the web service at http://localhost:5000`);

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'VeritasML_Academic_Submission_Package.zip');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error('ZIP generation failed', e);
      alert('Failed to generate ZIP archive. You can download individual files.');
    } finally {
      setIsZipping(false);
    }
  };

  // Viva QA list extracted for interactive mode
  const vivaList = [
    {
      q: 'What is a Passive Aggressive Classifier and why does it outperform Naive Bayes for news streams?',
      a: 'The Passive Aggressive Classifier (PAC) is a margin-based online linear algorithm. It is passive when a sample is correctly classified outside the margin (loss = 0, no weight update), and aggressively updates its weights when an error or margin violation occurs (loss > 0) with minimal L2 perturbation. Unlike Naive Bayes which assumes conditional feature independence, PAC handles complex feature correlations in continuous TF-IDF spaces and adapts dynamically to evolving news styles.'
    },
    {
      q: 'What is the mathematical formulation of TF-IDF used in Scikit-learn?',
      a: 'TF-IDF combines sublinear term frequency TF(t, d) = 1 + log(tf) for tf > 0 with inverse document frequency IDF(t) = log((1 + N) / (1 + df(t))) + 1. The resulting vector is normalized to unit Euclidean length (L2 norm) so that document length does not unfairly skew feature significance.'
    },
    {
      q: 'Why choose Porter Stemming over Lemmatization in this project?',
      a: 'Porter Stemming executes deterministic, rule-based suffix-stripping in O(N) runtime without requiring full Part-of-Speech (POS) tagging or large WordNet dictionaries. For bag-of-words / n-gram TF-IDF classification, collapsing variants (e.g. investigating, investigator, investigated -> investig) into a common root provides sufficient morphological equivalence with much lower computational latency.'
    },
    {
      q: 'What is the difference between Type I (False Positive) and Type II (False Negative) errors in fake news detection?',
      a: 'Type I Error (False Positive): Fake News is falsely predicted as REAL. This is dangerous because users trust misinformation. Type II Error (False Negative): Real News is flagged as FAKE. While undesirable, it prompts verification rather than unchecked deception.'
    },
    {
      q: 'How does the system prevent overfitting?',
      a: 'Through four defensive mechanisms: (1) Stratified 80/20 train/test split preserving class priors; (2) C-hyperparameter regularization in Passive Aggressive Classifier and L2 penalty in Logistic Regression; (3) Vocabulary cap at 5,000 top n-grams in TfidfVectorizer; (4) Minimum document frequency filtering to prevent memorizing idiosyncratic rare words.'
    },
    {
      q: 'What is Matthews Correlation Coefficient (MCC) and why is it preferred over raw accuracy?',
      a: 'MCC is calculated as (TP*TN - FP*FN) / sqrt((TP+FP)(TP+FN)(TN+FP)(TN+FN)), yielding a score in [-1, +1]. Unlike raw accuracy which can be inflated by class imbalance, MCC considers all four confusion matrix quadrants symmetrically. An MCC of 0.877 for our PAC model demonstrates authentic balance.'
    }
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-400 text-xs font-semibold mb-2">
            <Terminal className="w-3.5 h-3.5" />
            <span>Academic Source Code Repository</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Python Backend & Viva Voce Defense Suite
          </h1>
          <p className="text-sm text-slate-400">
            Full working source code, SQLite database schema, Scikit-learn training pipeline, and viva presentation notes.
          </p>
        </div>

        {/* 1-Click ZIP Download */}
        <button
          onClick={handleDownloadZip}
          disabled={isZipping}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition-all hover:scale-102 active:scale-98 self-start sm:self-auto cursor-pointer"
        >
          <PackageCheck className="w-4 h-4" />
          <span>{isZipping ? 'Bundling ZIP...' : 'Download Complete Project (.ZIP)'}</span>
        </button>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('code')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'code'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>Source Code Viewer</span>
        </button>

        <button
          onClick={() => setActiveTab('viva')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'viva'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>B.Tech Viva Voce Flashcards</span>
        </button>

        <button
          onClick={() => setActiveTab('tree')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'tree'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <FolderTree className="w-4 h-4" />
          <span>Project Directory Layout</span>
        </button>
      </div>

      {/* Tab: Source Code Viewer */}
      {activeTab === 'code' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* File Selector Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
              Repository Files ({ACADEMIC_FILES.length})
            </span>
            <div className="space-y-1.5">
              {ACADEMIC_FILES.map((file) => (
                <button
                  key={file.filename}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left p-3 rounded-xl border text-xs font-mono transition-all flex items-start gap-3 ${
                    selectedFile.filename === file.filename
                      ? 'bg-slate-800 text-white border-emerald-500/60 shadow-md'
                      : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <FileCode className={`w-4 h-4 mt-0.5 shrink-0 ${
                    selectedFile.filename === file.filename ? 'text-emerald-400' : 'text-slate-400'
                  }`} />
                  <div className="space-y-0.5 min-w-0">
                    <div className="font-bold truncate">{file.filename}</div>
                    <div className="text-[11px] text-slate-400 font-sans line-clamp-1">
                      {file.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Quick Run Box */}
            <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                <span>Quick Terminal Execution</span>
              </span>
              <pre className="text-[11px] font-mono text-slate-300 bg-slate-900 p-2.5 rounded-lg border border-slate-800 overflow-x-auto">
{`pip install -r requirements.txt
python train_model.py
python app.py`}
              </pre>
            </div>
          </div>

          {/* Code Viewer Panel (8 cols) */}
          <div className="lg:col-span-8 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col shadow-xl">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-white">
                  {selectedFile.filename}
                </span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {selectedFile.language}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleDownloadSingle}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* Code Body */}
            <div className="p-4 overflow-x-auto max-h-[580px] overflow-y-auto font-mono text-xs leading-relaxed text-slate-300 bg-slate-950">
              <pre>
                <code>{selectedFile.content}</code>
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Viva Voce Flashcards */}
      {activeTab === 'viva' && (
        <div className="space-y-4 max-w-4xl">
          <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-200 flex items-center justify-between">
            <span>
              <strong>B.Tech Viva Voce Exam Prep:</strong> Essential conceptual questions asked by external examiners regarding ML classifiers, NLP vectorization, and model trade-offs.
            </span>
          </div>

          <div className="space-y-3">
            {vivaList.map((item, index) => {
              const isExpanded = expandedVivaIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setExpandedVivaIndex(isExpanded ? null : index)}
                    className="w-full text-left p-4 flex items-center justify-between gap-4 hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-800 text-emerald-400 flex items-center justify-center text-xs font-mono font-bold shrink-0">
                        {index + 1}
                      </span>
                      <h4 className="text-sm font-bold text-white">
                        {item.q}
                      </h4>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 border-t border-slate-800/60 bg-slate-950/40 text-xs text-slate-300 leading-relaxed space-y-2">
                      <strong className="text-emerald-400 block text-[11px] uppercase tracking-wider">
                        Suggested Answer for Defense:
                      </strong>
                      <p>{item.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Project Directory Tree */}
      {activeTab === 'tree' && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-5 max-w-3xl">
          <div>
            <h3 className="text-lg font-bold text-white">Academic Submission Directory Structure</h3>
            <p className="text-xs text-slate-400">
              Conforms strictly to standard modular Machine Learning software engineering guidelines.
            </p>
          </div>

          <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300 leading-relaxed overflow-x-auto">
{`VeritasML_Fake_News_System/
│
├── app.py                      # Flask REST server (Endpoints: /, /detect, /history)
├── train_model.py              # ML Training, Cross-validation & Joblib serialization
├── database.py                 # SQLite database initialization & CRUD methods
├── download_dataset.py         # ISOT & Kaggle dataset automated downloader
├── requirements.txt            # Python dependencies (Flask, scikit-learn, nltk, etc.)
│
├── static/                     # Web assets (CSS stylesheets, Chart.js bundles)
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── main.js
│
├── templates/                  # Jinja2 HTML templates
│   ├── index.html              # Modern responsive detection portal
│   ├── dashboard.html          # Model performance & confusion matrix visualizer
│   └── history.html            # SQLite detection history viewer
│
├── models/                     # Saved binary artifacts
│   ├── model.pkl               # Serialized best classifier (PassiveAggressive)
│   └── tfidf_vectorizer.pkl    # Serialized fitted TfidfVectorizer
│
├── data/                       # Datasets
│   ├── True.csv                # 21,417 authentic news articles
│   └── Fake.csv                # 23,481 fact-checked fake articles
│
├── database.db                 # SQLite3 database (auto-generated)
├── README.md                   # Complete deployment & execution instructions
└── Viva_Voce_QA.md             # Oral exam defense questions & answers`}
          </pre>
        </div>
      )}
    </div>
  );
};
