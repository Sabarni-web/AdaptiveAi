import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { BrainCircuit, Clock, Target, ArrowRight, Activity, RefreshCw } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { useNavigate } from 'react-router-dom';
import examService from '../../services/examService';
import { useExam } from '../../hooks/useExam';

export const RecommendationCard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { startExam } = useExam();
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const { data: recommendation, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ['recommendation'],
    queryFn: examService.getRecommendation,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleStartTest = () => {
    if (!recommendation) return;
    startExam({
      domain: recommendation.domain,
      subject: recommendation.subject,
      questionType: recommendation.questionType || 'Mixed',
      numberOfQuestions: recommendation.questionCount || 10,
    }, selectedLanguage);
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['studentHistory'] });
    refetch();
  };

  // State 1: Loading
  if (isLoading) {
    return (
      <Card className="card card--float lg:col-span-2 flex flex-col justify-between gap-6 !p-8 animate-pulse">
        <div className="flex flex-col gap-4">
          <div className="h-6 bg-slate-800 rounded w-1/3"></div>
          <div className="h-8 bg-slate-800 rounded w-3/4"></div>
          <div className="h-4 bg-slate-800 rounded w-1/2"></div>
        </div>
      </Card>
    );
  }

  // State 5: API Error
  if (isError) {
    return (
      <Card className="card card--float lg:col-span-2 flex flex-col justify-between gap-6 !p-8">
        <div className="flex flex-col gap-2">
          <span className="flex items-center gap-2 bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider w-fit">
            <Activity className="h-4 w-4" /> Recommendation Unavailable
          </span>
          <h2 className="text-xl md:text-2xl font-black leading-tight mt-1 text-slate-300">
            Unable to fetch AI recommendation at this time.
          </h2>
          <Button variant="outline" className="mt-4 w-fit" onClick={() => navigate('/exams')}>
            Explore Exams
          </Button>
        </div>
      </Card>
    );
  }

  // State 2: No exam history
  if (recommendation?.type === 'FIRST_ASSESSMENT') {
    return (
      <Card className="card card--float lg:col-span-2 flex flex-col justify-between gap-6 !p-8 border-t-4 border-t-mint">
        <div className="flex flex-col gap-2">
          <span className="flex items-center gap-2 bg-mint/10 text-mint border border-mint/20 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider w-fit">
            <BrainCircuit className="h-4 w-4" /> AI Recommendation
          </span>
          <h2 className="text-xl md:text-2xl font-black leading-tight mt-1 text-white">
            {recommendation.title}
          </h2>
          <p className="text-sm text-secondary font-medium max-w-lg mt-1">
            {recommendation.description}
          </p>
        </div>
        <div className="mt-4">
          <Button onClick={() => navigate('/exams')} variant="primary" className="flex items-center gap-2">
            <span>Explore Exams</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    );
  }

  // State 4: Excellent Performance
  if (recommendation?.type === 'CHALLENGE') {
    return (
      <Card className="card card--float lg:col-span-2 flex flex-col justify-between gap-6 !p-8 border-t-4 border-t-yellow-400">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-2">
            <span className="flex items-center gap-2 bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider w-fit">
              🏆 You're on a great run
            </span>
            <h2 className="text-xl md:text-2xl font-black leading-tight mt-1 text-white">
              {recommendation.title}
            </h2>
            <p className="text-sm text-secondary font-medium max-w-lg mt-1">
              {recommendation.description}
            </p>
          </div>
          <button onClick={handleRefresh} className={`p-2 text-slate-500 hover:text-white transition-colors ${isRefetching ? 'animate-spin text-mint' : ''}`} title="Refresh Recommendation">
             <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        <div className="flex gap-2 mt-4">
          <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-md text-xs font-semibold">
            Difficulty: {recommendation.difficulty}
          </span>
          <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-md text-xs font-semibold">
            {recommendation.questionCount} Questions
          </span>
        </div>

        <div className="flex items-center justify-between mt-6 pt-6 border-t border-hair">
          <Button onClick={handleStartTest} variant="primary" className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black">
            <Target className="h-4 w-4" />
            <span>Take Challenge</span>
          </Button>
        </div>
      </Card>
    );
  }

  // State 3: Recommendation Available (Weak Subject/Topic)
  return (
    <Card className="card card--float lg:col-span-2 flex flex-col justify-between gap-6 !p-8 border-t-4 border-t-mint">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-2">
          <span className="flex items-center gap-2 bg-mint/10 text-mint border border-mint/20 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider w-fit">
            <BrainCircuit className="h-4 w-4" /> AI Recommendation
          </span>
          <h2 className="text-xl md:text-2xl font-black leading-tight mt-1 text-white">
            {recommendation?.title || 'Your Personalized Learning Mission'}
          </h2>
          <p className="text-sm text-secondary font-medium max-w-lg mt-1">
            {recommendation?.description}
          </p>
          <p className="text-xs text-mint/80 mt-1 italic">
            Reason: {recommendation?.reason}
          </p>
        </div>
        <button onClick={handleRefresh} className={`p-2 text-slate-500 hover:text-white transition-colors ${isRefetching ? 'animate-spin text-mint' : ''}`} title="Refresh Recommendation">
           <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {recommendation?.topics && recommendation.topics.length > 0 && (
        <div className="mt-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Focus Areas</p>
          <div className="flex flex-wrap gap-2">
            {recommendation.topics.map((topic, i) => (
              <span key={i} className="bg-slate-800/80 border border-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-sm font-medium">
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col xl:flex-row xl:items-center justify-between mt-4 pt-6 border-t border-hair gap-4">
        <div className="flex flex-wrap gap-4 text-sm font-semibold text-slate-300">
          <span className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-mint" /> ~{recommendation?.estimatedMinutes || 25} Minutes
          </span>
          <span className="flex items-center gap-2">
            <Target className="h-4 w-4 text-mint" /> {recommendation?.difficulty || 'Adaptive'} Difficulty
          </span>
          <span className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-mint" /> {recommendation?.questionCount || 20} Questions
          </span>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
           <select
             value={selectedLanguage}
             onChange={(e) => setSelectedLanguage(e.target.value)}
             className="bg-transparent border border-hair rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-mint text-white"
           >
             <option value="en" className="bg-slate-900">English</option>
             <option value="hi" className="bg-slate-900">हिन्दी (Hindi)</option>
             <option value="bn" className="bg-slate-900">বাংলা (Bengali)</option>
           </select>
          <Button onClick={handleStartTest} variant="primary" className="flex items-center gap-2 whitespace-nowrap">
            <span>Start Recommended Test</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => navigate('/analytics')} className="whitespace-nowrap">
            View Analysis
          </Button>
        </div>
      </div>
    </Card>
  );
};
