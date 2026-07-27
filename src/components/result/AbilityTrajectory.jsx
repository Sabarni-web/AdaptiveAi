import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Card } from '../common/Card';

export const AbilityTrajectory = ({ history = [] }) => {
  const chartData = history.map((h) => ({
    question: `Q${h.questionIndex + 1}`,
    ability: parseFloat(h.ability.toFixed(2)),
  }));

  return (
    <Card title="Ability Trajectory" description="Real-time estimated student ability trajectory (IRT theta).">
      <div className="h-72 w-full mt-4">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400 text-sm">
            No trajectory data recorded.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-slate-205 dark:stroke-slate-800" />
              <XAxis
                dataKey="question"
                className="text-xs font-semibold fill-slate-400"
              />
              <YAxis
                domain={[-3.0, 3.0]}
                className="text-xs font-semibold fill-slate-400"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff',
                }}
              />
              <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="3 3" />
              <Line
                type="monotone"
                dataKey="ability"
                stroke="#6366f1"
                strokeWidth={3}
                activeDot={{ r: 6 }}
                dot={{ stroke: '#6366f1', strokeWidth: 2, r: 4, fill: '#fff' }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};
export default AbilityTrajectory;
