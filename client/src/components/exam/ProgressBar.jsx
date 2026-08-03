import React from 'react';
import clsx from 'clsx';

export const ProgressBar = ({
  current = 0,
  total = 10,
  answered = [],
  flagged = [],
  onJump,
}) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
        <span>Completion Progress</span>
        <span>
          {answered.length} of {total} answered
        </span>
      </div>
      <div className="flex gap-1.5 w-full">
        {Array.from({ length: total }).map((_, idx) => {
          const isCurrent = current === idx;
          const isAnswered = answered.includes(idx);
          const isFlagged = flagged.includes(idx);

          return (
            <button
              key={idx}
              disabled={!onJump}
              onClick={() => onJump && onJump(idx)}
              className={clsx(
                'h-2.5 flex-1 rounded-full transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-primary-500',
                isCurrent
                  ? 'bg-green-500 scale-y-110 shadow shadow-green-500/20'
                  : isFlagged
                  ? 'bg-yellow-500'
                  : isAnswered
                  ? 'bg-primary-500'
                  : 'bg-slate-700 hover:bg-slate-650'
              )}
              title={`Question ${idx + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
};
export default ProgressBar;
