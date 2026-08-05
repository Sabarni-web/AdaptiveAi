import React from 'react';
import { Card } from '../common/Card';
import clsx from 'clsx';

export const HeatMap = ({ data = [], title = 'Topic Performance Map' }) => {
  const getIntensityClass = (score) => {
    if (score >= 85) return 'tile-green text-primary';
    if (score >= 70) return 'tile-green opacity-80 text-primary';
    if (score >= 50) return 'tile-amber text-primary';
    if (score >= 35) return 'tile-amber opacity-80 text-primary';
    return 'tile-red text-primary';
  };

  return (
    <Card title={title} description="Color intensity corresponds to the level of topic proficiency.">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
        {data.length === 0 ? (
          <div className="col-span-full py-8 text-center text-secondary text-sm">
            No topic performance logged.
          </div>
        ) : (
          data.map((item, idx) => (
            <div
              key={idx}
              className={clsx(
                'p-4 rounded-xl flex flex-col justify-between gap-3 shadow-sm transition-all hover:scale-[1.02]',
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
