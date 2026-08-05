import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between p-4 transition-colors duration-200">
      <div className="flex-1 flex items-center justify-center py-10">
        <div className="w-full max-w-[420px] card p-8 flex flex-col gap-6 animate-in">
          {/* Logo Header */}
          <div className="flex flex-col items-center gap-2">
            <Link to="/" className="text-3xl font-extrabold tracking-tight text-primary">
              AdaptiveAI
            </Link>
            <p className="text-xs text-secondary font-medium">
              Next-generation adaptive evaluation platform
            </p>
          </div>

          {/* Child Routes */}
          <Outlet />
        </div>
      </div>

      {/* Footer Links */}
      <footer className="py-4 text-center text-xs text-secondary flex items-center justify-center gap-4">
        <a href="#terms" className="hover:text-primary font-medium transition-colors">Terms of Service</a>
        <span>&bull;</span>
        <a href="#privacy" className="hover:text-primary font-medium transition-colors">Privacy Policy</a>
        <span>&bull;</span>
        <a href="#help" className="hover:text-primary font-medium transition-colors">Help Center</a>
      </footer>
    </div>
  );
};
