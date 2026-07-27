import React from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import { Navbar } from '../components/common/Navbar';
import { Sidebar } from '../components/common/Sidebar';

export const MainLayout = () => {
  const sidebarCollapsed = useSelector((state) => state.ui.sidebarCollapsed);
  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar />

      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main
        className={clsx(
          'pt-24 pb-8 px-6 min-h-screen transition-all duration-300',
          sidebarCollapsed ? 'lg:pl-28' : 'lg:pl-72',
          sidebarOpen ? 'pl-6' : 'pl-6'
        )}
      >
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
