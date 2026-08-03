import React from 'react';
import { Card } from '../common/Card';
import { Progress } from '../common/Progress';

export const ScoreBreakdown = ({ sections = [] }) => {
  return (
    <Card title="Section Breakdown" description="Performance analysis across individual topics.">
      <div className="flex flex-col gap-5">
        {sections.map((section, idx) => (
          <div key={idx} className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-sm font-semibold">
              <span className="text-slate-700 dark:text-slate-350">{section.name}</span>
              <span className="text-slate-900 dark:text-white font-bold">
                {section.score} / {section.max}{' '}
                <span className="text-xs text-slate-400 font-medium">({section.percentage}%)</span>
              </span>
            </div>
            <Progress
              value={section.score}
              max={section.max}
              color={section.color || 'bg-primary-600'}
            />
          </div>
        ))}
      </div>
    </Card>
  );
};
export default ScoreBreakdown;
