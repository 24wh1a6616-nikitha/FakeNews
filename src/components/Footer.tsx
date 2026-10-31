import React from 'react';
import { ShieldCheck, Github, ExternalLink, Award, Heart } from 'lucide-react';
import { NavTab } from './Navbar.tsx';

interface FooterProps {
  setCurrentTab: (tab: NavTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentTab }) => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-md">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-base font-extrabold text-white">
                Veritas<span className="text-emerald-400">ML</span>
              </span>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                v1.0 Academic
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automated Fake News Detection System utilizing Machine Learning & NLP (TF-IDF + Passive Aggressive Classifier). Suitable for B.Tech CSE (AI & ML) capstone defense.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-300">
            <button
              onClick={() => setCurrentTab('home')}
              className="hover:text-emerald-400 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => setCurrentTab('detect')}
              className="hover:text-emerald-400 transition-colors"
            >
              Detect News
            </button>
            <button
              onClick={() => setCurrentTab('dashboard')}
              className="hover:text-emerald-400 transition-colors"
            >
              Performance Dashboard
            </button>
            <button
              onClick={() => setCurrentTab('history')}
              className="hover:text-emerald-400 transition-colors"
            >
              Detection History
            </button>
            <button
              onClick={() => setCurrentTab('academic')}
              className="hover:text-emerald-400 transition-colors"
            >
              Python Code & Viva Guide
            </button>
            <button
              onClick={() => setCurrentTab('about')}
              className="hover:text-emerald-400 transition-colors"
            >
              Mathematical Formulations
            </button>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
          <div className="flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span>B.Tech Computer Science & Engineering (Artificial Intelligence & Machine Learning)</span>
          </div>

          <div className="text-center sm:text-right">
            <span>ISOT Fake News Corpus (N=44,898) • Scikit-Learn • Flask • SQLite</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
