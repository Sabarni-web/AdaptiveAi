import React from 'react';
import { Outlet } from 'react-router-dom';

export const BlankLayout = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-200">
      <Outlet />
    </div>
  );
};
