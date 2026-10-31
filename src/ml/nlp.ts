/**
 * NLP Preprocessing Engine
 * Mirrors Python NLTK pipeline: Case folding, punctuation removal,
 * stop words filtering, and Porter Stemming.
 */

export const NLTK_STOPWORDS = new Set([
  'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', "you're",
  "you've", "you'll", "you'd", 'your', 'yours', 'yourself', 'yourselves', 'he',
  'him', 'his', 'himself', 'she', "she's", 'her', 'hers', 'herself', 'it', "it's",
  'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which',
  'who', 'whom', 'this', 'that', "that'll", 'these', 'those', 'am', 'is', 'are',
  'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do',
  'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because',
  'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against',
  'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to',
  'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again',
  'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all',
  'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no',
  'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't',
  'can', 'will', 'just', 'don', "don't", 'should', "should've", 'now', 'd', 'll',
  'm', 'o', 're', 've', 'y', 'ain', 'aren', "aren't", 'couldn', "couldn't",
  'didn', "didn't", 'doesn', "doesn't", 'hadn', "hadn't", 'hasn', "hasn't",
  'haven', "haven't", 'isn', "isn't", 'ma', 'mightn', "mightn't", 'mustn',
  "mustn't", 'needn', "needn't", 'shan', "shan't", 'shouldn', "shouldn't",
  'wasn', "wasn't", 'weren', "weren't", 'won', "won't", 'wouldn', "wouldn't"
]);

/**
 * Lightweight Porter Stemmer implementation for English morphology.
 */
export function porterStem(word: string): string {
  let w = word.toLowerCase();
  if (w.length < 3) return w;

  // Step 1a: sses -> ss, ies -> i, ss -> ss, s -> ''
  if (w.endsWith('sses')) {
    w = w.slice(0, -2);
  } else if (w.endsWith('ies')) {
    w = w.slice(0, -2);
  } else if (w.endsWith('ss')) {
    // leave as is
  } else if (w.endsWith('s')) {
    w = w.slice(0, -1);
  }

  // Step 1b: eed -> ee, ed/ing stripping with vowel check
  const hasVowel = (s: string) => /[aeiou]/.test(s);

  if (w.endsWith('eed')) {
    if (w.length > 4) w = w.slice(0, -1);
  } else if (w.endsWith('ed')) {
    const base = w.slice(0, -2);
    if (hasVowel(base)) w = base;
  } else if (w.endsWith('ing')) {
    const base = w.slice(0, -3);
    if (hasVowel(base)) w = base;
  }

  // Step 1c: y -> i if preceded by non-vowel
  if (w.endsWith('y') && w.length > 2) {
    const charBefore = w[w.length - 2];
    if (!/[aeiou]/.test(charBefore)) {
      w = w.slice(0, -1) + 'i';
    }
  }

  // Step 2 & 3: common suffix reduction
  const suffixReplacements: [string, string][] = [
    ['ational', 'ate'],
    ['tional', 'tion'],
    ['enci', 'ence'],
    ['anci', 'ance'],
    ['izer', 'ize'],
    ['abli', 'able'],
    ['alli', 'al'],
    ['entli', 'ent'],
    ['eli', 'e'],
    ['ousli', 'ous'],
    ['ization', 'ize'],
    ['ation', 'ate'],
    ['ator', 'ate'],
    ['alism', 'al'],
    ['iveness', 'ive'],
    ['fulness', 'ful'],
    ['ousness', 'ous'],
    ['aliti', 'al'],
    ['iviti', 'ive'],
    ['biliti', 'ble']
  ];

  for (const [suffix, repl] of suffixReplacements) {
    if (w.endsWith(suffix) && w.length > suffix.length + 2) {
      w = w.slice(0, -suffix.length) + repl;
      break;
    }
  }

  // Step 4: strip full, ness, ment
  if (w.endsWith('ness') && w.length > 6) {
    w = w.slice(0, -4);
  } else if (w.endsWith('ment') && w.length > 6) {
    w = w.slice(0, -4);
  } else if (w.endsWith('ful') && w.length > 5) {
    w = w.slice(0, -3);
  }

  return w;
}

export interface PreprocessingPipelineResult {
  originalText: string;
  lowercased: string;
  cleanedText: string;
  rawTokens: string[];
  filteredTokens: string[];
  stemmedTokens: string[];
  removedStopwords: string[];
  vocabularyCount: number;
}

export interface TextQualityMetrics {
  charCount: number;
  wordCount: number;
  sentenceCount: number;
  avgWordLength: number;
  uppercaseRatio: number;
  exclamationCount: number;
  questionCount: number;
  sensationalismScore: number; // 0 to 100
  readabilityScore: number; // Flesch-Kincaid Reading Ease approximation
}

const SENSATIONAL_WORDS = new Set([
  'shocking', 'unbelievable', 'bombshell', 'exposed', 'secret', 'miracle',
  'conspiracy', 'illuminati', 'hoax', 'proof', 'leaked', 'banned', 'censored',
  'urgent', 'truth', 'must see', 'panic', 'destroy', 'traitor', 'apocalypse',
  'coverup', 'outrage', 'scandal', 'mindblowing', 'classified', 'won\'t tell'
]);

export function analyzeTextQuality(text: string): TextQualityMetrics {
  const chars = text.length;
  const uppercaseChars = (text.match(/[A-Z]/g) || []).length;
  const exclamationCount = (text.match(/!/g) || []).length;
  const questionCount = (text.match(/\?/g) || []).length;

  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const sentenceCount = Math.max(1, sentences.length);

  const words = text.trim().split(/\s+/).filter(w => w.length > 0);
  const wordCount = Math.max(1, words.length);

  const totalWordChars = words.reduce((acc, w) => acc + w.length, 0);
  const avgWordLength = Number((totalWordChars / wordCount).toFixed(2));
  const uppercaseRatio = Number(((uppercaseChars / (chars || 1)) * 100).toFixed(1));

  // Count sensational markers
  const lower = text.toLowerCase();
  let sensationalHits = 0;
  SENSATIONAL_WORDS.forEach(term => {
    if (lower.includes(term)) sensationalHits++;
  });

  // Calculate sensationalism index (0 - 100)
  const punctuationExcess = Math.min(30, exclamationCount * 5);
  const capsExcess = Math.min(30, uppercaseRatio > 15 ? (uppercaseRatio - 15) * 2 : 0);
  const keywordWeight = Math.min(40, sensationalHits * 8);
  const sensationalismScore = Math.min(100, Math.round(punctuationExcess + capsExcess + keywordWeight));

  // Approximate Flesch Reading Ease: 206.835 - 1.015*(words/sentences) - 84.6*(syllables/words)
  // Simplified approximation: 1 syllable ~ 3 chars
  const approxSyllables = Math.max(wordCount, Math.round(totalWordChars / 3));
  const flesch = Math.max(0, Math.min(100, Math.round(206.835 - 1.015 * (wordCount / sentenceCount) - 84.6 * (approxSyllables / wordCount))));

  return {
    charCount: chars,
    wordCount,
    sentenceCount,
    avgWordLength,
    uppercaseRatio,
    exclamationCount,
    questionCount,
    sensationalismScore,
    readabilityScore: flesch
  };
}

export function preprocessText(text: string): PreprocessingPipelineResult {
  const originalText = text;
  // 1. Lowercase
  const lowercased = text.toLowerCase();

  // 2. Remove punctuation, symbols, URLs, numbers if needed
  // Keep spaces and letters
  const cleanedText = lowercased
    .replace(/https?:\/\/\S+/g, ' ') // Strip URLs
    .replace(/[^a-z\s]/g, ' ')     // Keep only alphabetic characters
    .replace(/\s+/g, ' ')           // Normalize multiple whitespaces
    .trim();

  // 3. Raw tokens
  const rawTokens = cleanedText.length > 0 ? cleanedText.split(' ') : [];

  // 4. Remove stopwords
  const filteredTokens: string[] = [];
  const removedStopwords: string[] = [];

  for (const token of rawTokens) {
    if (NLTK_STOPWORDS.has(token)) {
      removedStopwords.push(token);
    } else if (token.length > 1) {
      filteredTokens.push(token);
    }
  }

  // 5. Porter Stemming
  const stemmedTokens = filteredTokens.map(token => porterStem(token));

  return {
    originalText,
    lowercased,
    cleanedText,
    rawTokens,
    filteredTokens,
    stemmedTokens,
    removedStopwords,
    vocabularyCount: new Set(stemmedTokens).size
  };
}
