import React, { useEffect } from 'react';
import clsx from 'clsx';
import { useTimer } from '../../hooks/useTimer';

export const Timer = ({
  totalSeconds = 3600,
  warningAt = 300,
  startedAt,
  onTimeUp,
  isRunning = false,
}) => {
  const {
    timeRemaining,
    formattedTime,
    isWarning,
    isCritical,
    start,
    pause,
  } = useTimer({ totalSeconds, warningThreshold: warningAt, startedAt, onTimeUp });

  useEffect(() => {
    if (!isRunning || timeRemaining <= 0) {
      pause();
      return;
    }
    
    start();
  }, [isRunning, timeRemaining, start, pause]);

  // No longer needed to manually sync totalSeconds if we use startedAt, 
  // but if totalSeconds changes independently, the key prop in Exam.jsx handles remounting.

  // Change browser tab title to show remaining timer
  useEffect(() => {
    const originalTitle = document.title;
    if (isRunning) {
      document.title = `(${formattedTime}) Adaptive Exam`;
    }
    return () => {
      document.title = originalTitle;
    };
  }, [formattedTime, isRunning]);

  return (
    <div className="flex items-center gap-3 bg-surface border border-hair px-4 py-2 rounded-xl">
      <div className="relative h-6 w-6">
        {/* Ring indicator */}
        <svg className="h-full w-full transform -rotate-90">
          <circle
            cx="12"
            cy="12"
            r="9"
            className="stroke-hair fill-none"
            strokeWidth="2"
          />
          <circle
            cx="12"
            cy="12"
            r="9"
            className={clsx(
              'fill-none stroke-current transition-all duration-300',
              isCritical ? 'text-red-500 animate-pulse' : isWarning ? 'text-amber-500' : 'text-mint-dim'
            )}
            strokeWidth="2"
            strokeDasharray={56.5}
            strokeDashoffset={56.5 - (56.5 * (timeRemaining > 0 ? timeRemaining : 0)) / totalSeconds}
          />
        </svg>
      </div>
      <span
        className={clsx(
          'text-base font-bold font-mono tracking-wider transition-colors duration-200 flex gap-1',
          isCritical ? 'text-red-500 animate-pulse' : isWarning ? 'text-amber-500' : 'text-primary'
        )}
      >
        <span className="text-sm font-semibold opacity-80 uppercase tracking-widest hidden sm:inline">Time Remaining:</span>
        {timeRemaining <= 0 ? 'TIME UP' : formattedTime}
      </span>
    </div>
  );
};
export default Timer;
