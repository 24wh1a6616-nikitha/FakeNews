/**
 * TF-IDF Vectorizer
 * Implements standard Scikit-learn TfidfVectorizer logic:
 * Sublinear TF scaling (1 + log(tf)), IDF weighting, and L2 vector normalization.
 */

import { MODEL_VOCABULARY } from './vocabulary.ts';

export interface TfidfFeature {
  token: string;
  tf: number;
  sublinearTf: number;
  idf: number;
  tfidfRaw: number;
  tfidfNormalized: number;
  inVocabulary: boolean;
}

export interface TfidfVectorResult {
  vector: Record<string, number>; // token -> normalized tfidf
  features: TfidfFeature[];
  l2Norm: number;
  vocabularyHits: number;
  totalTokens: number;
}

export function vectorizeText(stemmedTokens: string[]): TfidfVectorResult {
  const totalTokens = stemmedTokens.length;
  if (totalTokens === 0) {
    return {
      vector: {},
      features: [],
      l2Norm: 0,
      vocabularyHits: 0,
      totalTokens: 0
    };
  }

  // 1. Calculate raw term frequencies
  const tfMap: Record<string, number> = {};
  for (const token of stemmedTokens) {
    tfMap[token] = (tfMap[token] || 0) + 1;
  }

  // 2. Calculate TF-IDF for all tokens
  const rawFeatures: {
    token: string;
    tf: number;
    sublinearTf: number;
    idf: number;
    tfidfRaw: number;
    inVocabulary: boolean;
  }[] = [];

  let sumSquares = 0;
  let vocabularyHits = 0;

  for (const [token, count] of Object.entries(tfMap)) {
    const vocabEntry = MODEL_VOCABULARY[token];
    const inVocabulary = !!vocabEntry;
    // Default IDF for out-of-core vocabulary tokens based on standard Zipf curve
    const idf = inVocabulary ? vocabEntry.idf : 3.5;
    
    if (inVocabulary) {
      vocabularyHits++;
    }

    const sublinearTf = 1 + Math.log(count);
    const tfidfRaw = sublinearTf * idf;
    sumSquares += tfidfRaw * tfidfRaw;

    rawFeatures.push({
      token,
      tf: count,
      sublinearTf: Number(sublinearTf.toFixed(3)),
      idf: Number(idf.toFixed(2)),
      tfidfRaw: Number(tfidfRaw.toFixed(3)),
      inVocabulary
    });
  }

  const l2Norm = Math.sqrt(sumSquares) || 1.0;

  // 3. Normalize vector to unit L2 norm (as per scikit-learn norm='l2')
  const vector: Record<string, number> = {};
  const features: TfidfFeature[] = rawFeatures.map(item => {
    const tfidfNormalized = Number((item.tfidfRaw / l2Norm).toFixed(4));
    vector[item.token] = tfidfNormalized;
    return {
      ...item,
      tfidfNormalized
    };
  });

  // Sort features by normalized TF-IDF descending
  features.sort((a, b) => b.tfidfNormalized - a.tfidfNormalized);

  return {
    vector,
    features,
    l2Norm: Number(l2Norm.toFixed(4)),
    vocabularyHits,
    totalTokens
  };
}
