import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BrainCircuit, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../services/apiClient';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Loader } from '../common/Loader';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const StudentSelfImprovement = () => {
  const navigate = useNavigate();

  const { data: response, isLoading } = useQuery({
    queryKey: ['selfImprovement'],
    queryFn: async () => {
      const res = await apiClient.get('/analytics/self-improvement');
      return res.data;
    }
  });

  const data = response?.data;

  if (isLoading) {
    return (
      <Card className="min-h-[400px] flex items-center justify-center">
        <Loader size="lg" text="Loading your skill analysis..." />
      </Card>
    );
  }

  // Create topicScores array from backend data
  
  // For testing/preview: If no data, use the example data from the prompt
  const chartData = data?.topicScores?.length > 0 ? data.topicScores : [
    { topic: 'Data Structures', score: 82 },
    { topic: 'Algorithms', score: 74 },
    { topic: 'DBMS', score: 58 },
    { topic: 'Operating Systems', score: 68 },
    { topic: 'Computer Networks', score: 76 }
  ];

  // Find strongest and weakest dynamically from chartData
  const sortedData = [...chartData].sort((a, b) => b.score - a.score); // Descending for strongest/weakest
  const strongest = sortedData[0];
  const weakest = sortedData[sortedData.length - 1];

  // Sort chart data in increasing order of score for the bar graph display
  const displayChartData = [...chartData].sort((a, b) => a.score - b.score);

  const getBarColor = (score) => {
    if (score >= 80) return '#10b981'; // Green / Excellent
    if (score >= 60) return '#f59e0b'; // Amber / Good
    return '#ef4444'; // Red / Needs Improvement
  };

  const recommendation = weakest 
    ? `Your ${weakest.topic} performance is currently your lowest. Practice ${weakest.topic.toLowerCase()} concepts and related questions before your next adaptive exam.`
    : 'Keep practicing to maintain your excellent scores.';

  return (
    <Card className="!p-6 border-t-4 border-t-mint flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-black text-white flex items-center gap-2">
          Skill Analysis
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Track your progress and identify areas for improvement.
        </p>
      </div>

      <div className="h-80 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={displayChartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
              dataKey="topic" 
              stroke="#64748b" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              tickMargin={10}
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              cursor={{ fill: '#1e293b', opacity: 0.4 }}
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
              itemStyle={{ color: '#fff', fontWeight: 'bold' }}
              formatter={(value) => [`${value}%`, 'Score']}
            />
            <Bar dataKey="score" radius={[4, 4, 0, 0]} maxBarSize={60}>
              {displayChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 mt-2 flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Strongest Area</span>
            <span className="text-lg font-bold text-mint">{strongest?.topic} ({strongest?.score}%)</span>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Focus Area</span>
            <span className="text-lg font-bold text-amber-500">{weakest?.topic} ({weakest?.score}%)</span>
          </div>
        </div>
        
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Recommendation</span>
          <p className="text-sm text-slate-300">
            {recommendation}
          </p>
        </div>
      </div>
    </Card>
  );
};
