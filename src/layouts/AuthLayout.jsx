import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 p-4 transition-colors duration-200">
      <div className="flex-1 flex items-center justify-center py-10">
        <div className="w-full max-w-[420px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-xl p-8 flex flex-col gap-6 animate-slide-in">
          {/* Logo Header */}
          <div className="flex flex-col items-center gap-2">
            <Link to="/" className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary-600 to-indigo-500 bg-clip-text text-transparent">
              AdaptiveAI
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Next-generation adaptive evaluation platform
            </p>
          </div>

          {/* Child Routes */}
          <Outlet />
        </div>
      </div>

      {/* Footer Links */}
      <footer className="py-4 text-center text-xs text-slate-400 dark:text-slate-500 flex items-center justify-center gap-4">
        <a href="#terms" className="hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">Terms of Service</a>
        <span>&bull;</span>
        <a href="#privacy" className="hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">Privacy Policy</a>
        <span>&bull;</span>
        <a href="#help" className="hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">Help Center</a>
      </footer>
    </div>
  );
};
