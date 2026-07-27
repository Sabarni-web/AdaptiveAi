import React from 'react';
import clsx from 'clsx';

export const Progress = ({
  value = 0,
  max = 100,
  size = 'md',
  color = 'bg-primary-600',
  showLabel = false,
  striped = false,
  animated = false,
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={clsx('w-full flex flex-col gap-1.5', className)}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span>Progress</span>
          <span>{percentage}%</span>
        </div>
      )}
      <div className={clsx('w-full bg-slate-105 dark:bg-slate-700 rounded-full overflow-hidden', sizes[size])}>
        <div
          style={{ width: `${percentage}%` }}
          className={clsx(
            'h-full rounded-full transition-all duration-300 relative',
            color,
            striped && 'bg-[linear-gradient(45deg,rgba(255,255,255,.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.15)_50%,rgba(255,255,255,.15)_75%,transparent_75%,transparent)] bg-[size:1rem_1rem]',
            animated && 'animate-[barProgress_1s_linear_infinite]'
          )}
        />
      </div>
      {/* Dynamic Keyframe Injection if needed */}
      <style>{`
        @keyframes barProgress {
          from { background-position: 1rem 0; }
          to { background-position: 0 0; }
        }
      `}</style>
    </div>
  );
};
