/**
 * Detection History Storage Engine
 * Mirrors the SQLite schema with client-side persistence and sample seed data.
 */

export interface HistoryRecord {
  id: string;
  title: string;
  snippet: string;
  fullText: string;
  prediction: 'REAL' | 'FAKE';
  confidence: number;
  algorithm: string;
  wordCount: number;
  sensationalismScore: number;
  timestamp: string; // ISO string
}

const STORAGE_KEY = 'veritas_ml_detection_history_v1';

const INITIAL_HISTORY: HistoryRecord[] = [
  {
    id: 'rec-001',
    title: 'Federal Reserve Holds Interest Rates Steady, Officials Cite Labor Market Stability',
    snippet: 'WASHINGTON (Reuters) - The Federal Reserve held benchmark interest rates steady following a two-day monetary policy conference on Wednesday...',
    fullText: 'WASHINGTON (Reuters) - The Federal Reserve held benchmark interest rates steady following a two-day monetary policy conference on Wednesday. Fed officials confirmed in an official statement that inflation metrics have continued their gradual moderation while employment remained resilient across major sectors.',
    prediction: 'REAL',
    confidence: 96.4,
    algorithm: 'Passive Aggressive Classifier',
    wordCount: 52,
    sensationalismScore: 4,
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    id: 'rec-002',
    title: 'SHOCKING BOMBSHELL: Whistleblower Reveals Secret Miracle Water Cure Censored by Mainstream Media',
    snippet: 'SHOCKING! Mindblowing proof has leaked that globalists and corrupt elites have banned a miracle cure that destroys all diseases overnight!...',
    fullText: 'SHOCKING! Mindblowing proof has leaked that globalists and corrupt elites have banned a miracle cure that destroys all diseases overnight! A brave whistleblower exposed the evil coverup orchestrated by the deep state and corrupt pharmaceutical cabals.',
    prediction: 'FAKE',
    confidence: 98.2,
    algorithm: 'Passive Aggressive Classifier',
    wordCount: 58,
    sensationalismScore: 88,
    timestamp: new Date(Date.now() - 3600000 * 7).toISOString()
  },
  {
    id: 'rec-003',
    title: 'NASA Perseverance Rover Identifies Sedimentary Rock Samples on Ancient Mars Riverbed',
    snippet: 'PASADENA, Calif. (AP) — Scientists confirmed on Thursday that NASA\'s Perseverance rover has collected promising sedimentary core samples...',
    fullText: 'PASADENA, Calif. (AP) — Scientists confirmed on Thursday that NASA\'s Perseverance rover has collected promising sedimentary core samples from an ancient river delta in Jezero Crater. The department released detailed spectrometer measurements indicating mineral compounds typically formed in aqueous environments.',
    prediction: 'REAL',
    confidence: 94.8,
    algorithm: 'Logistic Regression',
    wordCount: 54,
    sensationalismScore: 6,
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: 'rec-004',
    title: 'EXPOSED HOAX: Mindblowing Conspiracy Proves Secret Microchips Rigged Every Ballot',
    snippet: 'UNBELIEVABLE! In a shocking revelation, underground researchers have exposed the covert conspiracy where millions of ballots were secretly flipped...',
    fullText: 'UNBELIEVABLE! In a shocking revelation, underground researchers have exposed the covert conspiracy where millions of ballots were secretly flipped by hidden microchip transmitters! Corrupt traitors inside the system attempted a massive coverup.',
    prediction: 'FAKE',
    confidence: 97.5,
    algorithm: 'Multinomial Naive Bayes',
    wordCount: 46,
    sensationalismScore: 92,
    timestamp: new Date(Date.now() - 3600000 * 36).toISOString()
  }
];

export function loadHistory(): HistoryRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_HISTORY));
      return INITIAL_HISTORY;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_HISTORY;
  }
}

export function saveHistory(records: HistoryRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (e) {
    console.error('Failed to save history to localStorage', e);
  }
}

export function addHistoryRecord(record: Omit<HistoryRecord, 'id' | 'timestamp'>): HistoryRecord {
  const current = loadHistory();
  const newRecord: HistoryRecord = {
    ...record,
    id: `rec-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString()
  };
  const updated = [newRecord, ...current].slice(0, 100);
  saveHistory(updated);
  return newRecord;
}

export function deleteHistoryRecord(id: string): HistoryRecord[] {
  const current = loadHistory();
  const updated = current.filter(r => r.id !== id);
  saveHistory(updated);
  return updated;
}

export function clearHistory(): void {
  saveHistory([]);
}

export function exportHistoryAsCSV(records: HistoryRecord[]): string {
  const headers = ['ID', 'Title', 'Prediction', 'Confidence (%)', 'Algorithm', 'Word Count', 'Sensationalism Index', 'Date/Time'];
  const rows = records.map(r => [
    r.id,
    `"${r.title.replace(/"/g, '""')}"`,
    r.prediction,
    r.confidence,
    `"${r.algorithm}"`,
    r.wordCount,
    r.sensationalismScore,
    `"${new Date(r.timestamp).toLocaleString()}"`
  ]);
  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}
