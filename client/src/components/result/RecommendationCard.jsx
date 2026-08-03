import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { BookOpen, ExternalLink, Video } from 'lucide-react';

export const RecommendationCard = ({ recommendations = [] }) => {
  const getPriorityColor = (p) => {
    switch (p.toLowerCase()) {
      case 'high':
        return 'danger';
      case 'medium':
        return 'warning';
      default:
        return 'info';
    }
  };

  return (
    <Card title="Personalized Study Recommendations" description="Actionable resources mapped to your weaknesses.">
      <div className="flex flex-col gap-6">
        {recommendations.length === 0 ? (
          <p className="text-slate-400 text-sm">All topics passed! No study resources recommended.</p>
        ) : (
          recommendations.map((rec, idx) => (
            <div
              key={idx}
              className="border border-slate-100 dark:border-slate-800 p-5 rounded-2xl flex flex-col gap-3.5 bg-slate-50/50 dark:bg-slate-900/10"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-slate-850 dark:text-white">
                  Focus: {rec.topic}
                </span>
                <Badge variant={getPriorityColor(rec.priority)} size="sm">
                  {rec.priority} Priority
                </Badge>
              </div>

              <div className="flex flex-col gap-2">
                {rec.resources?.map((res, rIdx) => (
                  <a
                    key={rIdx}
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between text-xs font-semibold text-primary-650 hover:underline dark:text-primary-400 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800"
                  >
                    <div className="flex items-center gap-2">
                      {res.type === 'video' ? (
                        <Video className="h-4 w-4 text-red-500 shrink-0" />
                      ) : (
                        <BookOpen className="h-4 w-4 text-slate-400 shrink-0" />
                      )}
                      <span>{res.title}</span>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
export default RecommendationCard;
