import React, { useEffect } from 'react';
import clsx from 'clsx';
import { useTimer } from '../../hooks/useTimer';

export const Timer = ({
  totalSeconds = 3600,
  warningAt = 300,
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
    setTimeRemaining,
  } = useTimer(totalSeconds, warningAt, onTimeUp);

  useEffect(() => {
    if (isRunning) {
      start();
    } else {
      pause();
    }
  }, [isRunning, start, pause]);

  // Sync remaining seconds if parent overrides
  useEffect(() => {
    setTimeRemaining(totalSeconds);
  }, [totalSeconds, setTimeRemaining]);

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
    <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl">
      <div className="relative h-6 w-6">
        {/* Ring indicator */}
        <svg className="h-full w-full transform -rotate-90">
          <circle
            cx="12"
            cy="12"
            r="9"
            className="stroke-slate-800 fill-none"
            strokeWidth="2"
          />
          <circle
            cx="12"
            cy="12"
            r="9"
            className={clsx(
              'fill-none stroke-current transition-all duration-300',
              isCritical ? 'text-red-500 animate-pulse' : isWarning ? 'text-yellow-500' : 'text-primary-500'
            )}
            strokeWidth="2"
            strokeDasharray={56.5}
            strokeDashoffset={56.5 - (56.5 * timeRemaining) / totalSeconds}
          />
        </svg>
      </div>
      <span
        className={clsx(
          'text-base font-bold font-mono tracking-wider transition-colors duration-200',
          isCritical ? 'text-red-500 animate-pulse' : isWarning ? 'text-yellow-500' : 'text-slate-100'
        )}
      >
        {formattedTime}
      </span>
    </div>
  );
};
export default Timer;
