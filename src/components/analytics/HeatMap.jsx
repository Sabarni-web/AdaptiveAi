import React from 'react';
import { Card } from '../common/Card';
import clsx from 'clsx';

export const HeatMap = ({ data = [], title = 'Topic Performance Map' }) => {
  const getIntensityClass = (score) => {
    if (score >= 85) return 'bg-green-600 dark:bg-green-700 text-white';
    if (score >= 70) return 'bg-green-400 dark:bg-green-500 text-slate-900';
    if (score >= 50) return 'bg-yellow-400 dark:bg-yellow-500 text-slate-900';
    if (score >= 35) return 'bg-orange-400 dark:bg-orange-500 text-slate-900';
    return 'bg-red-500 dark:bg-red-650 text-white';
  };

  return (
    <Card title={title} description="Color intensity corresponds to the level of topic proficiency.">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
        {data.length === 0 ? (
          <div className="col-span-full py-8 text-center text-slate-400 text-sm">
            No topic performance logged.
          </div>
        ) : (
          data.map((item, idx) => (
            <div
              key={idx}
              className={clsx(
                'p-4 rounded-xl flex flex-col justify-between gap-3 shadow-sm border border-slate-100 dark:border-slate-800 transition-all hover:scale-[1.02]',
                getIntensityClass(item.score)
              )}
            >
              <span className="text-xs font-bold leading-tight break-words">{item.topic}</span>
              <div className="flex justify-between items-baseline mt-2">
                <span className="text-lg font-black">{item.score}%</span>
                <span className="text-[9px] opacity-80 font-bold uppercase">
                  {item.attempts} {item.attempts === 1 ? 'try' : 'tries'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
export default HeatMap;
