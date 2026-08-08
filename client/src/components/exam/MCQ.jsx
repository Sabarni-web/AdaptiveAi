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
        if (option) onSelect(option.key || option.label);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [options, onSelect, disabled]);

  return (
    <div className="flex flex-col gap-4 w-full">
      {options.map((opt, idx) => {
        const optKey = opt.key || opt.label;
        const isSelected = selected === optKey;
        return (
          <button
            key={optKey || idx}
            disabled={disabled}
            onClick={() => onSelect(optKey)}
            className={clsx(
              'w-full text-left px-5 py-4 rounded-xl transition-all flex items-center gap-4 focus:outline-none focus:ring-2 focus:ring-mint disabled:opacity-50 disabled:cursor-not-allowed',
              isSelected
                ? 'border border-hair border-l-[4px] border-l-mint bg-surface text-primary font-bold shadow-[0_0_15px_-3px_var(--mint-glow)]'
                : 'border border-hair bg-surface-2 text-secondary hover:text-primary hover:bg-surface'
            )}
          >
            <span
              className={clsx(
                'h-8 w-8 flex items-center justify-center rounded-lg font-bold text-xs shrink-0 select-none border',
                isSelected
                  ? 'bg-mint border-mint text-void'
                  : 'bg-void border-hair text-secondary'
              )}
            >
              {optKey}
            </span>
            <span className="text-sm md:text-base leading-relaxed">{opt.text}</span>
          </button>
        );
      })}
    </div>
  );
};
export default MCQ;
