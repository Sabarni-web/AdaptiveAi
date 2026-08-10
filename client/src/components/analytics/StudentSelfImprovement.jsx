import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BrainCircuit, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../services/apiClient';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Loader } from '../common/Loader';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isUp = data.trend === 'UP';
    const isDown = data.trend === 'DOWN';
    
    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl text-sm min-w-[220px]">
        <h4 className="font-bold text-white mb-2">{label}</h4>
        
        <div className="flex justify-between items-center mb-1">
          <span className="text-slate-400">Current Score:</span>
          <span className="font-bold text-white">{data.currentScore}%</span>
        </div>
        
        {data.previousScore !== null && (
          <div className="flex justify-between items-center mb-1">
            <span className="text-slate-400">Previous Score:</span>
            <span className="font-bold text-white">{data.previousScore}%</span>
          </div>
        )}
        
        {data.trend !== 'NEW' && (
          <div className="flex justify-between items-center mb-1">
            <span className="text-slate-400">Change:</span>
            <span className={`font-bold flex items-center gap-1 ${isUp ? 'text-mint' : isDown ? 'text-red-500' : 'text-slate-300'}`}>
              {isUp ? '↑ +' : isDown ? '↓ ' : '→ '}{data.change}%
            </span>
          </div>
        )}
        
        <div className="border-t border-slate-700 my-2 pt-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-slate-400 text-xs">Exams Completed:</span>
            <span className="font-bold text-white text-xs">{data.examCount}</span>
          </div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-slate-400 text-xs">Latest Exam:</span>
            <span className="font-bold text-white text-xs truncate max-w-[120px] text-right" title={data.latestExam}>{data.latestExam}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-xs">Last Attempt:</span>
            <span className="font-bold text-white text-xs">{new Date(data.lastAttempt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const TrendDisplay = ({ item }) => {
  if (!item) return null;
  const isUp = item.trend === 'UP';
  const isDown = item.trend === 'DOWN';
  const isStable = item.trend === 'STABLE';
  
  if (item.trend === 'NEW') return <span className="text-sm font-bold text-blue-400 ml-2">NEW</span>;
  
  return (
    <span className={`text-sm font-bold ml-2 ${isUp ? 'text-mint' : isDown ? 'text-red-500' : 'text-slate-400'}`}>
      {isUp ? '↑ +' : isDown ? '↓ ' : '→ '}{item.change}%
    </span>
  );
};

export const StudentSelfImprovement = () => {
  const navigate = useNavigate();

  const { data: response, isLoading, isError } = useQuery({
    queryKey: ['selfImprovement'],
    queryFn: async () => {
      const res = await apiClient.get('/analytics/self-improvement');
      return res.data;
    },
    refetchOnWindowFocus: true // Auto-refresh when returning from exam
  });

  const data = response?.data;

  if (isLoading) {
    return (
      <Card className="min-h-[400px] flex items-center justify-center">
        <Loader size="lg" text="Loading your skill analysis..." />
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="min-h-[400px] flex flex-col gap-4 items-center justify-center border-t-4 border-t-red-500">
        <div className="text-red-500 mb-2">
          <HelpCircle size={48} className="mx-auto" />
        </div>
        <h3 className="text-lg font-bold text-white">Unable to load skill analysis</h3>
        <Button onClick={() => window.location.reload()} variant="outline">
          Retry
        </Button>
      </Card>
    );
  }

  if (data?.empty || !data?.topicScores || data.topicScores.length === 0) {
    return (
      <Card className="min-h-[400px] !p-6 border-t-4 border-t-slate-700 flex flex-col">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            Skill Analysis
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Track your progress and identify areas for improvement.
          </p>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center text-center mt-8">
          <div className="bg-slate-800/50 p-6 rounded-full mb-6 border border-slate-700">
            <span className="text-5xl">📊</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-3">No exam results yet</h3>
          <p className="text-slate-400 max-w-sm mx-auto mb-8">
            Complete an exam to start tracking your skill progress.
          </p>
        </div>
      </Card>
    );
  }

  // We are guaranteed to have real data here
  const chartData = data.topicScores;

  // The backend returns them sorted highest to lowest for insights.
  // We want to sort them increasing for the bar graph visually.
  const displayChartData = [...chartData].sort((a, b) => a.currentScore - b.currentScore);

  const getBarColor = (score) => {
    if (score >= 80) return '#10b981'; // Green / Excellent
    if (score >= 60) return '#f59e0b'; // Amber / Good
    return '#ef4444'; // Red / Needs Improvement
  };

  const { strongestSkill, needsAttention, aiRecommendation } = data;

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
              interval={0}
              tick={{ width: 100, style: { wordWrap: 'break-word' } }}
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
              content={<CustomTooltip />}
            />
            <Bar dataKey="currentScore" radius={[4, 4, 0, 0]} maxBarSize={60}>
              {displayChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.currentScore)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 mt-2 flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Strongest Area</span>
            <span className="text-lg font-bold text-mint flex items-center">
              {strongestSkill ? `${strongestSkill.topic} (${strongestSkill.currentScore}%)` : 'N/A'}
              <TrendDisplay item={strongestSkill} />
            </span>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Focus Area</span>
            <span className="text-lg font-bold text-amber-500 flex items-center">
              {needsAttention ? `${needsAttention.topic} (${needsAttention.currentScore}%)` : 'N/A'}
              <TrendDisplay item={needsAttention} />
            </span>
          </div>
        </div>
        
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Recommendation</span>
          <p className="text-sm text-slate-300">
            {aiRecommendation}
          </p>
        </div>
      </div>
    </Card>
  );
};
