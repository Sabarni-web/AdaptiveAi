import React from 'react';
import clsx from 'clsx';

export const Descriptive = ({
  value = '',
  onChange,
  maxLength = 2000,
  placeholder = 'Type your comprehensive response here...',
  disabled = false,
  wordCountTarget = 500,
}) => {
  const getWordCount = (str) => {
    if (!str.trim()) return 0;
    return str.trim().split(/\s+/).length;
  };

  const wordCount = getWordCount(value);
  const charCount = value.length;

  const blockEvent = (e) => {
    e.preventDefault();
  };

  const handleBeforeInput = (e) => {
    if (e.inputType === 'insertFromPaste' || e.inputType === 'insertFromDrop') {
      e.preventDefault();
    }
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'v' || e.key === 'x')) {
      e.preventDefault();
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <textarea
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onPaste={blockEvent}
        onCopy={blockEvent}
        onCut={blockEvent}
        onDragOver={blockEvent}
        onDrop={blockEvent}
        onContextMenu={blockEvent}
        onBeforeInput={handleBeforeInput}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={10}
        className={clsx(
          'w-full px-5 py-4 text-sm md:text-base rounded-2xl border-2 bg-slate-950 text-slate-100 dark:border-slate-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none resize-none font-mono leading-relaxed',
          disabled && 'opacity-60 cursor-not-allowed'
        )}
      />
      <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
        <div className="flex items-center gap-4">
          <span>
            Words:{' '}
            <span
              className={clsx(
                wordCount >= wordCountTarget ? 'text-green-400' : 'text-slate-400'
              )}
            >
              {wordCount}
            </span>{' '}
            / {wordCountTarget}
          </span>
          <span>
            Characters: {charCount} / {maxLength}
          </span>
        </div>
      </div>
    </div>
  );
};
export default Descriptive;
