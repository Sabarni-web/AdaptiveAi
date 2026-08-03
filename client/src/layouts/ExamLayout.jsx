import React from 'react';
import { Outlet } from 'react-router-dom';

export const ExamLayout = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans select-none antialiased">
      {/* Minimal Header */}
      <header className="h-16 px-6 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-lg font-black tracking-wider bg-gradient-to-r from-primary-400 to-indigo-400 bg-clip-text text-transparent">
            ADAPTIVEAI EVALUATION
          </span>
        </div>
        <div id="exam-header-portal" className="flex items-center gap-6" />
      </header>

      {/* Main Viewport */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <Outlet />
      </main>
    </div>
  );
};
