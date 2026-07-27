import React from 'react';
import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { Card } from '../common/Card';

export const RadarChart = ({ data = [], compareData = [], title = 'Skill Analysis' }) => {
  // Merge main data with compareData if exists
  const chartData = data.map((d, idx) => {
    const item = {
      skill: d.skill,
      student: d.score,
    };
    if (compareData[idx]) {
      item.average = compareData[idx].score;
    }
    return item;
  });

  return (
    <Card title={title} description="Student skill profiling compared against class average.">
      <div className="h-72 w-full mt-4">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400 text-sm">
            No skill profile data available.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsRadarChart cx="50%" cy="50%" r="80%" data={chartData}>
              <PolarGrid className="stroke-slate-200 dark:stroke-slate-700" />
              <PolarAngleAxis dataKey="skill" className="text-[10px] font-bold fill-slate-500" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} className="text-[10px] fill-slate-400" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff',
                }}
              />
              <Radar
                name="Student Profile"
                dataKey="student"
                stroke="#4f46e5"
                fill="#4f46e5"
                fillOpacity={0.25}
              />
              {compareData.length > 0 && (
                <Radar
                  name="Class Average"
                  dataKey="average"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.1}
                />
              )}
              <Legend className="text-xs font-semibold mt-4" />
            </RechartsRadarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};
export default RadarChart;
