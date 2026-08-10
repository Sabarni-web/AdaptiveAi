import React from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { HeatMap } from '../components/analytics/HeatMap';

import { StudentSelfImprovement } from '../components/analytics/StudentSelfImprovement';

export const AnalyticsPage = () => {
  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <PageHeader
        title="Analytics Panel"
        description="Comprehensive evaluation statistics, proficiency mappings, and self-improvement insights."
      />

      <div className="grid grid-cols-1 gap-8">
        <StudentSelfImprovement />
        <HeatMap
          data={[
            { topic: 'Recursion Depth', score: 85, attempts: 2 },
            { topic: 'Database Normalization', score: 72, attempts: 1 },
            { topic: 'Optimistic Locking', score: 55, attempts: 3 },
            { topic: 'WebSockets & TCP', score: 38, attempts: 1 },
            { topic: 'Tree Traversals', score: 92, attempts: 2 },
            { topic: 'CSS Grid & Flexbox', score: 64, attempts: 1 },
          ]}
        />
      </div>
    </div>
  );
};
export default AnalyticsPage;
