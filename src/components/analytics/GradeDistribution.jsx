import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Card } from '../common/Card';

export const GradeDistribution = ({ distribution = { A: 0, B: 0, C: 0, D: 0, F: 0 } }) => {
  const chartData = Object.keys(distribution).map((key) => ({
    grade: key,
    students: distribution[key],
  }));

  const colors = {
    A: '#22c55e',
    B: '#3b82f6',
    C: '#eab308',
    D: '#f97316',
    F: '#ef4444',
  };

  return (
    <Card title="Grade Distribution" description="Aggregated grade stats for the evaluated class.">
      <div className="h-72 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
            <XAxis
              dataKey="grade"
              className="text-xs font-semibold fill-slate-500"
            />
            <YAxis className="text-xs font-semibold fill-slate-500" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: 'none',
                borderRadius: '12px',
                color: '#fff',
              }}
            />
            <Bar dataKey="students" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[entry.grade] || '#4f46e5'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
export default GradeDistribution;
