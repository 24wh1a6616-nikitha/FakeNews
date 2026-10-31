import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Trash2, 
  Download, 
  ShieldCheck, 
  AlertTriangle, 
  Eye, 
  X, 
  Calendar,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { HistoryRecord, deleteHistoryRecord, clearHistory, exportHistoryAsCSV } from '../services/historyStore.ts';

interface HistoryViewProps {
  history: HistoryRecord[];
  onHistoryChange: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ history, onHistoryChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVerdict, setFilterVerdict] = useState<'ALL' | 'REAL' | 'FAKE'>('ALL');
  const [selectedRecord, setSelectedRecord] = useState<HistoryRecord | null>(null);

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.snippet.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.algorithm.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesVerdict = filterVerdict === 'ALL' || item.prediction === filterVerdict;

    return matchesSearch && matchesVerdict;
  });

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this record from detection history?')) {
      deleteHistoryRecord(id);
      onHistoryChange();
      if (selectedRecord?.id === id) {
        setSelectedRecord(null);
      }
    }
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all detection history? This cannot be undone.')) {
      clearHistory();
      onHistoryChange();
      setSelectedRecord(null);
    }
  };

  const handleExportCSV = () => {
    const csvData = exportHistoryAsCSV(filteredHistory);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `veritas_ml_detection_history_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const realCount = history.filter(h => h.prediction === 'REAL').length;
  const fakeCount = history.filter(h => h.prediction === 'FAKE').length;
  const avgConfidence = history.length > 0 
    ? (history.reduce((acc, h) => acc + h.confidence, 0) / history.length).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-2">
            <History className="w-3.5 h-3.5" />
            <span>Audit Trail & Persistence (SQLite Schema)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            News Detection History
          </h1>
          <p className="text-sm text-slate-400">
            Review past articles analyzed by the system, inspect verdicts, and export session logs.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleExportCSV}
            disabled={history.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleClearAll}
            disabled={history.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 disabled:opacity-50 text-rose-300 text-xs font-semibold border border-rose-500/30 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        </div>
      </div>

      {/* Aggregate Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Total Analyzed</span>
          <div className="text-2xl font-black text-white">{history.length}</div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Verified Real</span>
          <div className="text-2xl font-black text-emerald-400">{realCount}</div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Detected Fake</span>
          <div className="text-2xl font-black text-rose-400">{fakeCount}</div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Mean Confidence</span>
          <div className="text-2xl font-black text-cyan-400">{avgConfidence}%</div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900 p-3.5 rounded-2xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search headline, text snippet, or algorithm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs sm:text-sm focus:border-emerald-500 focus:outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-400 font-semibold mr-1">Filter:</span>
          {(['ALL', 'REAL', 'FAKE'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setFilterVerdict(v)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filterVerdict === v
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* History Table / List */}
      {filteredHistory.length > 0 ? (
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-mono">
              <tr>
                <th className="px-4 py-3 font-semibold">Verdict</th>
                <th className="px-4 py-3 font-semibold">Article Headline & Snippet</th>
                <th className="px-4 py-3 font-semibold">Confidence</th>
                <th className="px-4 py-3 font-semibold">Algorithm</th>
                <th className="px-4 py-3 font-semibold">Timestamp</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredHistory.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => setSelectedRecord(item)}
                  className="hover:bg-slate-800/50 cursor-pointer transition-colors group"
                >
                  {/* Verdict Badge */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        item.prediction === 'REAL'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      }`}
                    >
                      {item.prediction === 'REAL' ? (
                        <ShieldCheck className="w-3 h-3" />
                      ) : (
                        <AlertTriangle className="w-3 h-3" />
                      )}
                      <span>{item.prediction}</span>
                    </span>
                  </td>

                  {/* Headline / Snippet */}
                  <td className="px-4 py-3 max-w-md">
                    <div className="font-semibold text-white truncate group-hover:text-emerald-300 transition-colors">
                      {item.title}
                    </div>
                    <div className="text-slate-400 text-[11px] truncate mt-0.5">
                      {item.snippet}
                    </div>
                  </td>

                  {/* Confidence */}
                  <td className="px-4 py-3 whitespace-nowrap font-mono font-bold text-white">
                    {item.confidence}%
                  </td>

                  {/* Algorithm */}
                  <td className="px-4 py-3 whitespace-nowrap text-slate-400">
                    {item.algorithm}
                  </td>

                  {/* Timestamp */}
                  <td className="px-4 py-3 whitespace-nowrap text-slate-400 font-mono text-[11px]">
                    {new Date(item.timestamp).toLocaleString()}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRecord(item);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        title="View Full Record"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(item.id, e)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                        title="Delete from History"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-12 text-center space-y-3">
          <History className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-white">No Detection Records Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchQuery
              ? `No articles matched your search query "${searchQuery}".`
              : 'Your detection audit trail is currently empty. Run a news analysis to populate history.'}
          </p>
        </div>
      )}

      {/* Record Inspection Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    selectedRecord.prediction === 'REAL'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                  }`}
                >
                  {selectedRecord.prediction === 'REAL' ? (
                    <ShieldCheck className="w-4 h-4" />
                  ) : (
                    <AlertTriangle className="w-4 h-4" />
                  )}
                  <span>{selectedRecord.prediction} NEWS ({selectedRecord.confidence}%)</span>
                </span>
                <h3 className="text-lg font-bold text-white pt-1">
                  {selectedRecord.title}
                </h3>
              </div>

              <button
                onClick={() => setSelectedRecord(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Algorithm</span>
                <span className="text-white font-semibold truncate block">{selectedRecord.algorithm}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Word Count</span>
                <span className="text-white font-semibold block">{selectedRecord.wordCount} words</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Sensationalism</span>
                <span className="text-white font-semibold block">{selectedRecord.sensationalismScore}/100</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Recorded At</span>
                <span className="text-white font-semibold font-mono text-[11px] block">
                  {new Date(selectedRecord.timestamp).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Full Text View */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Analyzed Article Text:
              </label>
              <div className="max-h-60 overflow-y-auto p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">
                {selectedRecord.fullText}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <button
                onClick={(e) => handleDelete(selectedRecord.id, e)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Record</span>
              </button>

              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
