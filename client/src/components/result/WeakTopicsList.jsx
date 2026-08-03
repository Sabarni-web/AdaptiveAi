import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

export const WeakTopicsList = ({ topics = [] }) => {
  // Sort lowest percentage first
  const sortedTopics = [...topics].sort((a, b) => a.percentage - b.percentage);

  const getTopicColor = (percentage) => {
    if (percentage < 40) return 'danger';
    if (percentage < 70) return 'warning';
    return 'success';
  };

  return (
    <Card title="Topic-wise Strength Analysis" description="Topics sorted by lowest percentage first.">
      <div className="flex flex-col gap-4">
        {sortedTopics.length === 0 ? (
          <p className="text-slate-400 text-sm">No topic statistics available.</p>
        ) : (
          sortedTopics.map((topic, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800/80 pb-3 last:border-0 last:pb-0"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                  {topic.name}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase">
                  Attempted: {topic.questionsAttempted} {topic.questionsAttempted === 1 ? 'question' : 'questions'}
                </span>
              </div>
              <Badge variant={getTopicColor(topic.percentage)} size="md" className="font-extrabold">
                {topic.percentage}%
              </Badge>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
export default WeakTopicsList;
