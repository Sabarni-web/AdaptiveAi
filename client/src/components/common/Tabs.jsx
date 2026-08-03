import React, { useState } from 'react';
import clsx from 'clsx';

export const Tabs = ({
  tabs = [],
  defaultTab,
  onChange,
  variant = 'underline',
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (onChange) onChange(tabId);
  };

  const variants = {
    underline: 'border-b border-slate-200 dark:border-slate-700 flex gap-6',
    pills: 'flex gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit',
    cards: 'flex border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden',
  };

  const tabStyles = {
    underline: (active) =>
      clsx(
        'pb-3 pt-1 text-sm font-semibold border-b-2 transition-all relative flex items-center gap-2',
        active
          ? 'border-primary-600 text-primary-600 dark:text-primary-400'
          : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
      ),
    pills: (active) =>
      clsx(
        'px-4 py-2 text-sm font-semibold rounded-lg transition-all flex items-center gap-2',
        active
          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
          : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
      ),
    cards: (active) =>
      clsx(
        'px-5 py-2.5 text-sm font-semibold transition-all flex items-center gap-2 border-r border-slate-200 dark:border-slate-700 last:border-0',
        active
          ? 'bg-slate-50 dark:bg-slate-800 text-primary-600 dark:text-primary-400'
          : 'bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:text-slate-400'
      ),
  };

  const activeContent = tabs.find((t) => t.id === activeTab)?.content;

  return (
    <div className={clsx('flex flex-col gap-6', className)}>
      <div className={variants[variant]}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={tabStyles[variant](activeTab === tab.id)}
          >
            {tab.icon && <span className="h-4 w-4">{tab.icon}</span>}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
      <div className="flex-1 animate-fade-in">{activeContent}</div>
    </div>
  );
};
