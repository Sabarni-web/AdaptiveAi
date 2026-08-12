import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Zap, Clock, Flame, CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import apiClient from '../../services/apiClient';

export const DailyChallengeCard = () => {
  const navigate = useNavigate();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['dailyChallengeToday'],
    queryFn: async () => {
      const res = await apiClient.get('/daily-challenge/today');
      return res.data;
    },
    retry: false
  });

  if (isLoading) {
    return (
      <Card>
        <div className="flex flex-col gap-4 animate-pulse">
          <div className="h-6 w-1/3 bg-slate-800 rounded"></div>
          <div className="h-4 w-1/2 bg-slate-800 rounded"></div>
          <div className="h-10 w-full bg-slate-800 rounded mt-2"></div>
        </div>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <div className="flex flex-col items-center justify-center p-4 text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
          <p className="text-slate-400 text-sm">Unable to load today's challenge.</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  const status = data?.status;
  const challenge = data?.challenge;
  
  const currentStreak = data?.currentStreak || 0;
  
  // Calculate remaining time if in progress
  let remainingTime = 90;
  if (status === 'in_progress' && challenge?.startedAt) {
     const elapsed = Math.floor((new Date().getTime() - new Date(challenge.startedAt).getTime()) / 1000);
     remainingTime = Math.max(90 - elapsed, 0);
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-cyan-500/20 bg-black backdrop-blur shadow-[0_0_15px_rgba(6,182,212,0.15)] flex flex-col p-5 h-full">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
      
      <div className="flex items-center gap-2 mb-2">
        <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
        <h3 className="font-bold text-lg text-white">TODAY'S CHALLENGE</h3>
      </div>
      
      {status === 'not_started' && (
        <>
          <p className="text-sm text-slate-300 mb-4">Test your knowledge in 90 seconds. Keep your streak alive!</p>
          <div className="flex items-center justify-between mb-6 text-sm text-slate-400">
            <span className="flex items-center gap-1"><Clock className="w-4 h-4"/> 90 seconds</span>
          </div>
          <div className="mt-auto">
            <Button className="w-full bg-cyan-600 hover:bg-cyan-500 text-white" onClick={() => navigate('/daily-challenge')}>
              Start Challenge
            </Button>
          </div>
        </>
      )}

      {status === 'in_progress' && (
        <>
          <p className="text-sm text-slate-300 mb-4">Your challenge is currently in progress.</p>
          <div className="flex items-center justify-between mb-6 text-sm font-bold">
            <span className="flex items-center gap-1 text-cyan-400"><Clock className="w-4 h-4"/> {remainingTime > 0 ? `00:${remainingTime.toString().padStart(2, '0')}` : '00:00'} remaining</span>
          </div>
          <div className="mt-auto">
            <Button className="w-full bg-yellow-600 hover:bg-yellow-500 text-white" onClick={() => navigate('/daily-challenge')}>
              Continue Challenge
            </Button>
          </div>
        </>
      )}

      {status === 'completed' && (
        <>
          <p className="text-sm text-slate-300 mb-4">Great job! You've completed today's challenge.</p>
          <div className="flex items-center justify-between mb-6 text-sm font-bold">
            <span className="flex items-center gap-1 text-green-400"><CheckCircle className="w-4 h-4"/> Score: {challenge?.score}/10</span>
          </div>
          <div className="mt-auto">
            <div className="w-full text-center bg-green-500/10 text-green-400 py-2.5 rounded-lg border border-green-500/20 font-bold">
              CHALLENGE COMPLETED
            </div>
          </div>
        </>
      )}
    </div>
  );
};
