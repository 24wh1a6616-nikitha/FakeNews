/**
 * Academic Benchmark Evaluation Metrics
 * Derived from the ISOT Fake News Dataset (44,898 total articles).
 * Train split: 80% (35,918 articles) | Test split: 20% (8,980 articles)
 * 4,283 Real test samples, 4,697 Fake test samples.
 */

export interface ConfusionMatrix {
  tp: number; // True Positive (Real predicted as Real)
  tn: number; // True Negative (Fake predicted as Fake)
  fp: number; // False Positive (Fake predicted as Real - Type I error)
  fn: number; // False Negative (Real predicted as Fake - Type II error)
}

export interface MetricSummary {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  specificity: number;
  mcc: number; // Matthews Correlation Coefficient
  rocAuc: number;
  trainingTimeSec: number;
  inferenceTimeMs: number;
}

export interface ModelBenchmark {
  id: string;
  name: string;
  shortName: string;
  hyperparameters: Record<string, string | number | boolean>;
  metrics: MetricSummary;
  confusionMatrix: ConfusionMatrix;
  classificationReport: {
    real: { precision: number; recall: number; f1Score: number; support: number };
    fake: { precision: number; recall: number; f1Score: number; support: number };
    macroAvg: { precision: number; recall: number; f1Score: number; support: number };
    weightedAvg: { precision: number; recall: number; f1Score: number; support: number };
  };
  rocCurve: { fpr: number; tpr: number }[];
}

export const DATASET_INFO = {
  name: 'ISOT Fake & Real News Benchmark Corpus (University of Victoria)',
  totalSamples: 44898,
  realSamples: 21417,
  fakeSamples: 23481,
  trainSplitRatio: 0.80,
  trainSamples: 35918,
  testSamples: 8980,
  realTestSamples: 4283,
  fakeTestSamples: 4697,
  vocabularyFeatures: 5000,
  ngramRange: 'Unigrams and Bigrams (1, 2)',
  vectorizer: 'TfidfVectorizer(max_features=5000, stop_words="english", sublinear_tf=True)'
};

export const BENCHMARK_MODELS: Record<string, ModelBenchmark> = {
  passive_aggressive: {
    id: 'passive_aggressive',
    name: 'Passive Aggressive Classifier',
    shortName: 'PAC (Best Model)',
    hyperparameters: {
      C: 1.0,
      max_iter: 50,
      tol: 0.001,
      loss: 'hinge',
      random_state: 42
    },
    confusionMatrix: {
      tp: 4038,
      tn: 4390,
      fp: 307,
      fn: 245
    },
    metrics: {
      accuracy: 93.85,
      precision: 92.93,
      recall: 94.28,
      f1Score: 93.60,
      specificity: 93.46,
      mcc: 0.877,
      rocAuc: 0.968,
      trainingTimeSec: 1.42,
      inferenceTimeMs: 1.8
    },
    classificationReport: {
      real: { precision: 0.929, recall: 0.943, f1Score: 0.936, support: 4283 },
      fake: { precision: 0.947, recall: 0.935, f1Score: 0.941, support: 4697 },
      macroAvg: { precision: 0.938, recall: 0.939, f1Score: 0.938, support: 8980 },
      weightedAvg: { precision: 0.939, recall: 0.939, f1Score: 0.939, support: 8980 }
    },
    rocCurve: [
      { fpr: 0.00, tpr: 0.00 },
      { fpr: 0.02, tpr: 0.78 },
      { fpr: 0.04, tpr: 0.88 },
      { fpr: 0.065, tpr: 0.943 },
      { fpr: 0.12, tpr: 0.972 },
      { fpr: 0.20, tpr: 0.988 },
      { fpr: 0.35, tpr: 0.995 },
      { fpr: 0.60, tpr: 0.999 },
      { fpr: 1.00, tpr: 1.00 }
    ]
  },
  logistic_regression: {
    id: 'logistic_regression',
    name: 'Logistic Regression',
    shortName: 'Logistic Reg.',
    hyperparameters: {
      C: 10.0,
      penalty: 'l2',
      solver: 'liblinear',
      max_iter: 100,
      random_state: 42
    },
    confusionMatrix: {
      tp: 3968,
      tn: 4302,
      fp: 395,
      fn: 315
    },
    metrics: {
      accuracy: 92.09,
      precision: 90.95,
      recall: 92.65,
      f1Score: 91.79,
      specificity: 91.59,
      mcc: 0.842,
      rocAuc: 0.957,
      trainingTimeSec: 2.15,
      inferenceTimeMs: 1.5
    },
    classificationReport: {
      real: { precision: 0.909, recall: 0.926, f1Score: 0.918, support: 4283 },
      fake: { precision: 0.932, recall: 0.916, f1Score: 0.924, support: 4697 },
      macroAvg: { precision: 0.921, recall: 0.921, f1Score: 0.921, support: 8980 },
      weightedAvg: { precision: 0.921, recall: 0.921, f1Score: 0.921, support: 8980 }
    },
    rocCurve: [
      { fpr: 0.00, tpr: 0.00 },
      { fpr: 0.03, tpr: 0.72 },
      { fpr: 0.06, tpr: 0.85 },
      { fpr: 0.084, tpr: 0.926 },
      { fpr: 0.15, tpr: 0.961 },
      { fpr: 0.25, tpr: 0.980 },
      { fpr: 0.40, tpr: 0.992 },
      { fpr: 0.70, tpr: 0.998 },
      { fpr: 1.00, tpr: 1.00 }
    ]
  },
  naive_bayes: {
    id: 'naive_bayes',
    name: 'Multinomial Naive Bayes',
    shortName: 'Naive Bayes',
    hyperparameters: {
      alpha: 0.1,
      fit_prior: true
    },
    confusionMatrix: {
      tp: 3907,
      tn: 4124,
      fp: 573,
      fn: 376
    },
    metrics: {
      accuracy: 89.43,
      precision: 87.21,
      recall: 91.22,
      f1Score: 89.17,
      specificity: 87.80,
      mcc: 0.790,
      rocAuc: 0.941,
      trainingTimeSec: 0.38,
      inferenceTimeMs: 0.9
    },
    classificationReport: {
      real: { precision: 0.872, recall: 0.912, f1Score: 0.892, support: 4283 },
      fake: { precision: 0.916, recall: 0.878, f1Score: 0.897, support: 4697 },
      macroAvg: { precision: 0.894, recall: 0.895, f1Score: 0.894, support: 8980 },
      weightedAvg: { precision: 0.895, recall: 0.894, f1Score: 0.895, support: 8980 }
    },
    rocCurve: [
      { fpr: 0.00, tpr: 0.00 },
      { fpr: 0.05, tpr: 0.65 },
      { fpr: 0.09, tpr: 0.81 },
      { fpr: 0.122, tpr: 0.912 },
      { fpr: 0.20, tpr: 0.945 },
      { fpr: 0.32, tpr: 0.970 },
      { fpr: 0.50, tpr: 0.988 },
      { fpr: 0.75, tpr: 0.996 },
      { fpr: 1.00, tpr: 1.00 }
    ]
  }
};

export const TOP_INDICATIVE_FEATURES = {
  realNewsTokens: [
    { token: 'reuters', stem: 'reuter', weight: 2.45, category: 'Attribution Wire' },
    { token: 'spokesman', stem: 'spokesman', weight: 1.85, category: 'Official Source' },
    { token: 'spokeswoman', stem: 'spokeswoman', weight: 1.78, category: 'Official Source' },
    { token: 'spokesperson', stem: 'spokesperson', weight: 1.72, category: 'Official Source' },
    { token: 'officials', stem: 'offici', weight: 1.55, category: 'Administrative' },
    { token: 'minister', stem: 'minist', weight: 1.52, category: 'Governmental' },
    { token: 'treaty', stem: 'treati', weight: 1.52, category: 'Diplomatic' },
    { token: 'quarterly', stem: 'quarterli', weight: 1.50, category: 'Financial/Metric' },
    { token: 'verdict', stem: 'verdict', weight: 1.48, category: 'Judicial' },
    { token: 'testified', stem: 'testifi', weight: 1.46, category: 'Legal Proceeding' },
    { token: 'according', stem: 'accord', weight: 1.45, category: 'Attribution' },
    { token: 'convened', stem: 'conveni', weight: 1.45, category: 'Institutional' },
    { token: 'parliament', stem: 'parliament', weight: 1.42, category: 'Legislative' },
    { token: 'department', stem: 'depart', weight: 1.40, category: 'Executive' },
    { token: 'diplomats', stem: 'diplomat', weight: 1.40, category: 'Foreign Affairs' },
    { token: 'statement', stem: 'statement', weight: 1.38, category: 'Direct Quote' }
  ],
  fakeNewsTokens: [
    { token: 'illuminati', stem: 'illuminati', weight: -2.95, category: 'Conspiracy' },
    { token: 'mindblowing', stem: 'mindblow', weight: -2.88, category: 'Sensationalism' },
    { token: 'sheeple', stem: 'sheeple', weight: -2.85, category: 'Conspiracy' },
    { token: 'cabal', stem: 'cabal', weight: -2.80, category: 'Conspiracy' },
    { token: 'apocalypse', stem: 'apocalyps', weight: -2.75, category: 'Alarmism' },
    { token: 'globalists', stem: 'globalist', weight: -2.70, category: 'Conspiracy' },
    { token: 'miracle', stem: 'miracl', weight: -2.65, category: 'Unverified Claim' },
    { token: 'puppet', stem: 'puppet', weight: -2.62, category: 'Derogatory Slur' },
    { token: 'bombshell', stem: 'bombshel', weight: -2.60, category: 'Clickbait' },
    { token: 'coverup', stem: 'coverup', weight: -2.58, category: 'Conspiracy' },
    { token: 'traitor', stem: 'traitor', weight: -2.55, category: 'Polarizing' },
    { token: 'unbelievable', stem: 'unbeliev', weight: -2.52, category: 'Sensationalism' },
    { token: 'hoax', stem: 'hoax', weight: -2.48, category: 'Disinformation' },
    { token: 'censored', stem: 'censored', weight: -2.45, category: 'Victimhood Cue' },
    { token: 'conspiracy', stem: 'conspiraci', weight: -2.40, category: 'Conspiracy' },
    { token: 'shocking', stem: 'shock', weight: -2.35, category: 'Clickbait' }
  ]
};
