import React, { useEffect } from 'react';
import clsx from 'clsx';

export const MCQ = ({
  options = [],
  selected = null,
  onSelect,
  disabled = false,
}) => {
  // Bind 1-4 keys to options selection
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (disabled) return;
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= options.length) {
        const option = options[num - 1];
        if (option) onSelect(option.label);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [options, onSelect, disabled]);

  return (
    <div className="flex flex-col gap-4 w-full">
      {options.map((opt, idx) => {
        const isSelected = selected === opt.label;
        return (
          <button
            key={opt.label || idx}
            disabled={disabled}
            onClick={() => onSelect(opt.label)}
            className={clsx(
              'w-full text-left px-5 py-4 rounded-xl border-2 transition-all flex items-center gap-4 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed',
              isSelected
                ? 'border-primary-500 bg-primary-50/10 dark:bg-primary-950/20 text-primary-900 dark:text-primary-300 font-bold'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
            )}
          >
            <span
              className={clsx(
                'h-8 w-8 flex items-center justify-center rounded-lg font-bold text-xs shrink-0 select-none border',
                isSelected
                  ? 'bg-primary-600 border-primary-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
              )}
            >
              {opt.label}
            </span>
            <span className="text-sm md:text-base leading-relaxed">{opt.text}</span>
          </button>
        );
      })}
    </div>
  );
};
export default MCQ;
