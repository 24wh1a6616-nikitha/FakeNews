/**
 * VeritasML: Fake News Detection System
 * Main Application Root
 */

import React, { useState, useEffect } from 'react';
import { Navbar, NavTab } from './components/Navbar.tsx';
import { HomeView } from './components/HomeView.tsx';
import { DetectNewsView } from './components/DetectNewsView.tsx';
import { PerformanceDashboardView } from './components/PerformanceDashboardView.tsx';
import { HistoryView } from './components/HistoryView.tsx';
import { AcademicCodeView } from './components/AcademicCodeView.tsx';
import { AboutView } from './components/AboutView.tsx';
import { Footer } from './components/Footer.tsx';
import { loadHistory, HistoryRecord } from './services/historyStore.ts';
import { NewsSample } from './data/samples.ts';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [activeSampleForDetection, setActiveSampleForDetection] = useState<NewsSample | null>(null);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const refreshHistory = () => {
    setHistory(loadHistory());
  };

  const handleStartDetectionWithSample = (sample?: NewsSample) => {
    if (sample) {
      setActiveSampleForDetection(sample);
    }
    setCurrentTab('detect');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabChange = (tab: NavTab) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={handleTabChange}
        historyCount={history.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {currentTab === 'home' && (
          <HomeView
            onStartDetection={handleStartDetectionWithSample}
            onNavigateTab={(tab) => handleTabChange(tab)}
          />
        )}

        {currentTab === 'detect' && (
          <DetectNewsView
            initialSample={activeSampleForDetection}
            onHistoryAdded={refreshHistory}
          />
        )}

        {currentTab === 'dashboard' && (
          <PerformanceDashboardView />
        )}

        {currentTab === 'history' && (
          <HistoryView
            history={history}
            onHistoryChange={refreshHistory}
          />
        )}

        {currentTab === 'academic' && (
          <AcademicCodeView />
        )}

        {currentTab === 'about' && (
          <AboutView />
        )}
      </main>

      {/* Footer */}
      <Footer setCurrentTab={handleTabChange} />
    </div>
  );
}
