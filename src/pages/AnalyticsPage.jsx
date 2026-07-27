import React from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { RadarChart } from '../components/analytics/RadarChart';
import { HeatMap } from '../components/analytics/HeatMap';

export const AnalyticsPage = () => {
  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <PageHeader
        title="Analytics Panel"
        description="Comprehensive evaluation statistics, proficiency mappings, and radar charts."
      />

      <div className="grid grid-cols-1 gap-8">
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
        <RadarChart
          data={[
            { skill: 'Data Structures', score: 90 },
            { skill: 'Systems design', score: 40 },
            { skill: 'DBMS normalizations', score: 72 },
            { skill: 'Concurrency locks', score: 55 },
            { skill: 'Algorithms search', score: 85 },
          ]}
          compareData={[
            { skill: 'Data Structures', score: 75 },
            { skill: 'Systems design', score: 50 },
            { skill: 'DBMS normalizations', score: 65 },
            { skill: 'Concurrency locks', score: 60 },
            { skill: 'Algorithms search', score: 70 },
          ]}
        />
      </div>
    </div>
  );
};
export default AnalyticsPage;
