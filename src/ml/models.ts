/**
 * Machine Learning Inference Engine
 * Implements:
 * 1. Passive Aggressive Classifier (PAC)
 * 2. Multinomial Naive Bayes (MNB)
 * 3. Logistic Regression (LR)
 * 4. Ensemble Voting
 * 5. Explainable AI (LIME / feature contributions)
 */

import { MODEL_CONFIG, MODEL_VOCABULARY } from './vocabulary.ts';
import { TfidfVectorResult } from './tfidf.ts';

export type AlgorithmType = 'passive_aggressive' | 'naive_bayes' | 'logistic_regression' | 'ensemble';

export interface FeatureContribution {
  token: string;
  weight: number;
  contribution: number; // positive = towards Real, negative = towards Fake
  direction: 'REAL' | 'FAKE';
  percentage: number;
}

export interface ModelPrediction {
  algorithm: AlgorithmType;
  algorithmName: string;
  prediction: 'REAL' | 'FAKE';
  confidence: number; // 0 to 100%
  rawScore: number;
  probReal: number;
  probFake: number;
  explanation: string;
  topRealFeatures: FeatureContribution[];
  topFakeFeatures: FeatureContribution[];
  allContributions: FeatureContribution[];
}

function sigmoid(z: number): number {
  return 1 / (1 + Math.exp(-Math.max(-15, Math.min(15, z))));
}

export function predictPassiveAggressive(vectorResult: TfidfVectorResult): ModelPrediction {
  const { vector } = vectorResult;
  let rawScore = MODEL_CONFIG.passiveAggressive.bias;
  const contributions: FeatureContribution[] = [];

  for (const [token, tfidf] of Object.entries(vector)) {
    const vocab = MODEL_VOCABULARY[token];
    if (vocab) {
      const weight = vocab.pacWeight;
      const termContribution = weight * tfidf;
      rawScore += termContribution;
      contributions.push({
        token,
        weight,
        contribution: Number(termContribution.toFixed(4)),
        direction: termContribution >= 0 ? 'REAL' : 'FAKE',
        percentage: 0
      });
    }
  }

  // Sigmoid calibration on raw margin score
  const probReal = sigmoid(rawScore * 2.2);
  const probFake = 1 - probReal;

  const isReal = probReal >= 0.5;
  const confidence = Math.round((isReal ? probReal : probFake) * 100);

  // Compute percentage contributions
  const totalAbsContrib = contributions.reduce((acc, c) => acc + Math.abs(c.contribution), 0) || 1;
  contributions.forEach(c => {
    c.percentage = Number(((Math.abs(c.contribution) / totalAbsContrib) * 100).toFixed(1));
  });

  const topRealFeatures = contributions
    .filter(c => c.contribution > 0)
    .sort((a, b) => b.contribution - a.contribution)
    .slice(0, 8);

  const topFakeFeatures = contributions
    .filter(c => c.contribution < 0)
    .sort((a, b) => a.contribution - b.contribution)
    .slice(0, 8);

  let explanation = '';
  if (isReal) {
    explanation = topRealFeatures.length > 0
      ? `Article exhibits formal journalistic framing and institutional verification cues (such as "${topRealFeatures.slice(0, 3).map(f => f.token).join('", "')}"). The Passive Aggressive Classifier identified strong margin separation for authentic reporting.`
      : 'Text contains standard neutral phrasing with absence of sensationalist or conspiratorial anomalies.';
  } else {
    explanation = topFakeFeatures.length > 0
      ? `Elevated linguistic indicators of sensationalism and unsubstantiated rhetoric (such as "${topFakeFeatures.slice(0, 3).map(f => f.token).join('", "')}"). The model detected high hinge-loss deviation consistent with unverified news.`
      : 'Structural lexical patterns show high alignment with fabricated claims and emotive hyperbole.';
  }

  return {
    algorithm: 'passive_aggressive',
    algorithmName: 'Passive Aggressive Classifier',
    prediction: isReal ? 'REAL' : 'FAKE',
    confidence,
    rawScore: Number(rawScore.toFixed(3)),
    probReal: Number((probReal * 100).toFixed(1)),
    probFake: Number((probFake * 100).toFixed(1)),
    explanation,
    topRealFeatures,
    topFakeFeatures,
    allContributions: contributions
  };
}

export function predictNaiveBayes(vectorResult: TfidfVectorResult): ModelPrediction {
  const { features } = vectorResult;
  let logProbReal = MODEL_CONFIG.naiveBayes.logPriorReal;
  let logProbFake = MODEL_CONFIG.naiveBayes.logPriorFake;
  const contributions: FeatureContribution[] = [];

  for (const item of features) {
    const vocab = MODEL_VOCABULARY[item.token];
    const logReal = vocab ? vocab.nbLogProbReal : MODEL_CONFIG.naiveBayes.defaultWordLogProbReal;
    const logFake = vocab ? vocab.nbLogProbFake : MODEL_CONFIG.naiveBayes.defaultWordLogProbFake;

    const termDiff = (logReal - logFake) * item.tf;
    logProbReal += logReal * item.tf;
    logProbFake += logFake * item.tf;

    if (vocab) {
      contributions.push({
        token: item.token,
        weight: Number((logReal - logFake).toFixed(3)),
        contribution: Number(termDiff.toFixed(3)),
        direction: termDiff >= 0 ? 'REAL' : 'FAKE',
        percentage: 0
      });
    }
  }

  // Softmax on log probabilities
  const maxLog = Math.max(logProbReal, logProbFake);
  const expReal = Math.exp(logProbReal - maxLog);
  const expFake = Math.exp(logProbFake - maxLog);
  const probReal = expReal / (expReal + expFake);
  const probFake = expFake / (expReal + expFake);

  const isReal = probReal >= 0.5;
  const confidence = Math.round((isReal ? probReal : probFake) * 100);

  const totalAbsContrib = contributions.reduce((acc, c) => acc + Math.abs(c.contribution), 0) || 1;
  contributions.forEach(c => {
    c.percentage = Number(((Math.abs(c.contribution) / totalAbsContrib) * 100).toFixed(1));
  });

  const topRealFeatures = contributions
    .filter(c => c.contribution > 0)
    .sort((a, b) => b.contribution - a.contribution)
    .slice(0, 8);

  const topFakeFeatures = contributions
    .filter(c => c.contribution < 0)
    .sort((a, b) => a.contribution - b.contribution)
    .slice(0, 8);

  const explanation = isReal
    ? `Bayesian log-likelihood strongly supports the authentic news class hypothesis (P(Real|D) = ${(probReal * 100).toFixed(1)}%).`
    : `Bayesian conditional word distributions favor the fabricated news category (P(Fake|D) = ${(probFake * 100).toFixed(1)}%).`;

  return {
    algorithm: 'naive_bayes',
    algorithmName: 'Multinomial Naive Bayes',
    prediction: isReal ? 'REAL' : 'FAKE',
    confidence,
    rawScore: Number((logProbReal - logProbFake).toFixed(3)),
    probReal: Number((probReal * 100).toFixed(1)),
    probFake: Number((probFake * 100).toFixed(1)),
    explanation,
    topRealFeatures,
    topFakeFeatures,
    allContributions: contributions
  };
}

export function predictLogisticRegression(vectorResult: TfidfVectorResult): ModelPrediction {
  const { vector } = vectorResult;
  let z = MODEL_CONFIG.logisticRegression.bias;
  const contributions: FeatureContribution[] = [];

  for (const [token, tfidf] of Object.entries(vector)) {
    const vocab = MODEL_VOCABULARY[token];
    if (vocab) {
      const weight = vocab.lrWeight;
      const termContribution = weight * tfidf;
      z += termContribution;
      contributions.push({
        token,
        weight,
        contribution: Number(termContribution.toFixed(4)),
        direction: termContribution >= 0 ? 'REAL' : 'FAKE',
        percentage: 0
      });
    }
  }

  const probReal = sigmoid(z * 1.8);
  const probFake = 1 - probReal;

  const isReal = probReal >= 0.5;
  const confidence = Math.round((isReal ? probReal : probFake) * 100);

  const totalAbsContrib = contributions.reduce((acc, c) => acc + Math.abs(c.contribution), 0) || 1;
  contributions.forEach(c => {
    c.percentage = Number(((Math.abs(c.contribution) / totalAbsContrib) * 100).toFixed(1));
  });

  const topRealFeatures = contributions
    .filter(c => c.contribution > 0)
    .sort((a, b) => b.contribution - a.contribution)
    .slice(0, 8);

  const topFakeFeatures = contributions
    .filter(c => c.contribution < 0)
    .sort((a, b) => a.contribution - b.contribution)
    .slice(0, 8);

  const explanation = isReal
    ? `Logistic Regression logit output (z = ${z.toFixed(2)}) produces a ${probReal > 0.85 ? 'high-confidence' : 'moderate'} authentic news probability.`
    : `Logistic regression decision boundary indicates negative classification score (z = ${z.toFixed(2)}), identifying misleading linguistic style.`;

  return {
    algorithm: 'logistic_regression',
    algorithmName: 'Logistic Regression',
    prediction: isReal ? 'REAL' : 'FAKE',
    confidence,
    rawScore: Number(z.toFixed(3)),
    probReal: Number((probReal * 100).toFixed(1)),
    probFake: Number((probFake * 100).toFixed(1)),
    explanation,
    topRealFeatures,
    topFakeFeatures,
    allContributions: contributions
  };
}

export function predictEnsemble(vectorResult: TfidfVectorResult): ModelPrediction {
  const pac = predictPassiveAggressive(vectorResult);
  const nb = predictNaiveBayes(vectorResult);
  const lr = predictLogisticRegression(vectorResult);

  // Weighted soft voting (0.5 PAC + 0.3 LR + 0.2 MNB)
  const probReal = 0.5 * (pac.probReal / 100) + 0.3 * (lr.probReal / 100) + 0.2 * (nb.probReal / 100);
  const probFake = 1 - probReal;

  const isReal = probReal >= 0.5;
  const confidence = Math.round((isReal ? probReal : probFake) * 100);

  // Combine top contributions
  const contribMap = new Map<string, FeatureContribution>();
  for (const c of [...pac.allContributions, ...lr.allContributions]) {
    const existing = contribMap.get(c.token);
    if (existing) {
      existing.contribution += c.contribution;
    } else {
      contribMap.set(c.token, { ...c });
    }
  }

  const allContributions = Array.from(contribMap.values());
  const topRealFeatures = allContributions
    .filter(c => c.contribution > 0)
    .sort((a, b) => b.contribution - a.contribution)
    .slice(0, 8);

  const topFakeFeatures = allContributions
    .filter(c => c.contribution < 0)
    .sort((a, b) => a.contribution - b.contribution)
    .slice(0, 8);

  const agreement = [pac.prediction, nb.prediction, lr.prediction].filter(p => p === (isReal ? 'REAL' : 'FAKE')).length;

  const explanation = `Ensemble meta-classifier: ${agreement}/3 algorithms (PAC: ${pac.prediction}, LR: ${lr.prediction}, MNB: ${nb.prediction}) agreed on ${isReal ? 'REAL' : 'FAKE'} with weighted confidence of ${confidence}%.`;

  return {
    algorithm: 'ensemble',
    algorithmName: 'Ensemble Soft-Voting (PAC + LR + MNB)',
    prediction: isReal ? 'REAL' : 'FAKE',
    confidence,
    rawScore: Number(((probReal - 0.5) * 2).toFixed(3)),
    probReal: Number((probReal * 100).toFixed(1)),
    probFake: Number((probFake * 100).toFixed(1)),
    explanation,
    topRealFeatures,
    topFakeFeatures,
    allContributions
  };
}

export function runModelInference(algorithm: AlgorithmType, vectorResult: TfidfVectorResult): ModelPrediction {
  switch (algorithm) {
    case 'passive_aggressive':
      return predictPassiveAggressive(vectorResult);
    case 'naive_bayes':
      return predictNaiveBayes(vectorResult);
    case 'logistic_regression':
      return predictLogisticRegression(vectorResult);
    case 'ensemble':
    default:
      return predictEnsemble(vectorResult);
  }
}
