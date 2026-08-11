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

  const { strongestSkill, needsAttention, recommendations } = data;

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

      <div className="h-80 w-full mt-4 overflow-x-auto overflow-y-hidden pb-2" style={{ scrollbarWidth: 'thin' }}>
        <div style={{ minWidth: `${Math.max(displayChartData.length * 80, 600)}px`, height: '100%' }}>
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
                angle={90}
                textAnchor="start"
                height={120}
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
              <Bar dataKey="currentScore" radius={[4, 4, 0, 0]} maxBarSize={60} minPointSize={4}>
                {displayChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.currentScore)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-4">
        <h3 className="text-xl font-bold text-white mb-2">Areas for Improvement</h3>
        
        {recommendations && recommendations.length > 0 ? (
          recommendations.map((rec, index) => {
            const isHigh = rec.priority === 'HIGH';
            const isMedium = rec.priority === 'MEDIUM';
            const priorityIcon = isHigh ? '🔴' : isMedium ? '🟠' : '🟡';
            const isDown = rec.trend === 'DOWN';
            const isUp = rec.trend === 'UP';

            return (
              <div key={index} className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-5 hover:border-slate-600 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                  <div>
                    <h4 className="text-lg font-bold text-white flex items-center gap-2">
                      <span>{priorityIcon}</span>
                      {rec.subject} — {rec.topic}
                    </h4>
                    <div className="flex items-center gap-3 mt-1 text-sm">
                      <span className="text-slate-400">Accuracy: <strong className="text-white">{rec.score}%</strong></span>
                      {rec.change !== 0 && (
                        <span className={`font-bold ${isDown ? 'text-red-400' : 'text-mint'}`}>
                          {isDown ? '↓ ' : '↑ '}{Math.abs(rec.change)}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-800/40 rounded-lg p-4 mb-4 border border-slate-700/30">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2 block">AI Recommendation</span>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {rec.recommendation}
                  </p>
                </div>

                <div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-2 border-slate-600 text-slate-300 hover:text-white"
                    onClick={() => navigate('/dashboard')}
                  >
                    {rec.nextAction} <ArrowRight size={14} />
                  </Button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 text-center">
            <span className="text-4xl mb-3 block">🎉</span>
            <h4 className="text-lg font-bold text-white mb-2">You're doing great!</h4>
            <p className="text-sm text-slate-400">Keep practicing to maintain your high scores.</p>
          </div>
        )}
      </div>
    </Card>
  );
};
