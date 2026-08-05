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
          <div className="h-full flex items-center justify-center text-secondary text-sm">
            No skill profile data available.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsRadarChart cx="50%" cy="50%" r="80%" data={chartData}>
              <PolarGrid className="stroke-hair" />
              <PolarAngleAxis dataKey="skill" className="text-[10px] font-bold fill-secondary" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} className="text-[10px] fill-secondary" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0E1712',
                  border: '1px solid #22322A',
                  borderRadius: '12px',
                  color: '#F3FBF7',
                }}
              />
              <Radar
                name="Student Profile"
                dataKey="student"
                stroke="#39FFB0"
                fill="#39FFB0"
                fillOpacity={0.15}
              />
              {compareData.length > 0 && (
                <Radar
                  name="Class Average"
                  dataKey="average"
                  stroke="#FF6B6B"
                  fill="#FF6B6B"
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
