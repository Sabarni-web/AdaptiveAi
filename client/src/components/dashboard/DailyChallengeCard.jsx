import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, 
  Clock, 
  Flame, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Sparkles, 
  Trophy, 
  Target, 
  ChevronRight,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
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

  const status = data?.status;
  const challenge = data?.challenge;
  const currentStreak = data?.currentStreak || 0;
  
  // Realtime tick down if in progress
  const [inProgressRemaining, setInProgressRemaining] = useState(90);

  useEffect(() => {
    if (status === 'in_progress' && challenge?.startedAt) {
      const calculateRemaining = () => {
        const elapsed = Math.floor((Date.now() - new Date(challenge.startedAt).getTime()) / 1000);
        return Math.max(90 - elapsed, 0);
      };
      setInProgressRemaining(calculateRemaining());
      const interval = setInterval(() => {
        setInProgressRemaining(calculateRemaining());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [status, challenge?.startedAt]);

  if (isLoading) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0c1914] via-[#08100d] to-[#040806] p-6 h-full flex flex-col justify-between shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 animate-pulse" />
            <div className="space-y-2">
              <div className="w-32 h-4 bg-white/5 rounded animate-pulse" />
              <div className="w-20 h-3 bg-white/5 rounded animate-pulse" />
            </div>
          </div>
          <div className="w-24 h-7 rounded-full bg-white/5 animate-pulse" />
        </div>
        <div className="space-y-3 my-6">
          <div className="w-3/4 h-5 bg-white/5 rounded animate-pulse" />
          <div className="w-1/2 h-4 bg-white/5 rounded animate-pulse" />
        </div>
        <div className="w-full h-11 rounded-xl bg-white/5 animate-pulse" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-red-500/20 bg-[#08100d] p-6 h-full flex flex-col items-center justify-center text-center shadow-xl">
        <AlertCircle className="w-10 h-10 text-red-400 mb-3" />
        <h4 className="text-white font-bold text-base mb-1">Challenge Unavailable</h4>
        <p className="text-slate-400 text-xs mb-4 max-w-xs">Unable to load today's challenge. Please check your connection.</p>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="border-red-500/30 text-red-300 hover:bg-red-500/10">
          Retry
        </Button>
      </div>
    );
  }

  // Percentage & progress calculation for visual dials
  const isCompleted = status === 'completed';
  const isInProgress = status === 'in_progress';
  const isNotStarted = status === 'not_started';
  const score = challenge?.score ?? 0;
  const isPerfect = isCompleted && score === 10;
  const timeTaken = challenge?.timeTaken ?? (isCompleted ? 45 : 0);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-[#0b1713] via-[#060c09] to-[#030605] p-6 h-full flex flex-col justify-between shadow-[0_12px_40px_-15px_rgba(6,182,212,0.25)] hover:border-cyan-400/50 hover:shadow-[0_16px_50px_-12px_rgba(57,255,176,0.3)] transition-all duration-500 backdrop-blur-xl">
      
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/25 transition-all duration-700 animate-glow-pulse" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/20 transition-all duration-700" />

      {/* Top Animated Cyber Laser Border */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80 group-hover:opacity-100 transition-opacity overflow-hidden">
        <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white to-transparent animate-laser-shimmer" />
      </div>

      {/* HEADER ROW */}
      <div className="relative z-10 flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          {/* Animated Icon Orb */}
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/10 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.3)] group-hover:scale-105 group-hover:border-cyan-400 transition-all duration-300">
            <Zap className="w-5 h-5 text-cyan-300 fill-cyan-400/30 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base md:text-lg text-white tracking-wide flex items-center gap-1.5">
                TODAY'S CHALLENGE
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                LIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
              <Sparkles className="w-3 h-3 text-cyan-400 inline" />
              Daily cognitive rapid test (1 MCQ)
            </p>
          </div>
        </div>

        {/* Streak Pill Badge */}
        <div 
          onClick={() => navigate('/daily-challenge')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500/15 to-amber-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold shadow-[0_0_15px_rgba(249,115,22,0.15)] hover:scale-105 hover:border-orange-400/60 transition-all cursor-pointer"
          title="Daily Streak Count"
        >
          <Flame className={`w-4 h-4 ${currentStreak > 0 ? 'fill-orange-400 text-orange-400 animate-bounce' : 'text-slate-500'}`} />
          <span className="tracking-wide">{currentStreak} Day{currentStreak !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* BODY CONTENT - STATE SPECIFIC */}
      <div className="relative z-10 flex-1 flex flex-col justify-center my-2">
        {isNotStarted && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 backdrop-blur-md">
              <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
                <span className="font-medium text-slate-200">Earn +10 XP & reinforce your streak</span>
                <span className="flex items-center gap-1 text-cyan-300 font-semibold">
                  <Clock className="w-3.5 h-3.5" /> 90s Limit
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                One adaptive concept question designed to benchmark your daily retention and problem-solving agility.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                <div className="text-[10px] uppercase tracking-wider text-slate-400">Format</div>
                <div className="text-xs font-bold text-white mt-0.5">1 MCQ</div>
              </div>
              <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                <div className="text-[10px] uppercase tracking-wider text-slate-400">Reward</div>
                <div className="text-xs font-bold text-yellow-400 mt-0.5">+10 XP</div>
              </div>
              <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                <div className="text-[10px] uppercase tracking-wider text-slate-400">Duration</div>
                <div className="text-xs font-bold text-cyan-400 mt-0.5">90 Sec</div>
              </div>
            </div>
          </div>
        )}

        {isInProgress && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-yellow-400">In Progress</span>
                <h5 className="text-sm font-semibold text-white mt-0.5">Your timer is actively running!</h5>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs text-yellow-300/80">Time Left</span>
                <span className="font-mono text-xl font-black text-yellow-400">
                  {inProgressRemaining > 0 
                    ? `00:${inProgressRemaining.toString().padStart(2, '0')}` 
                    : '00:00'}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400">
              Return immediately to finish your challenge before the countdown expires.
            </p>
          </div>
        )}

        {isCompleted && (
          <div className="space-y-4">
            {/* Completion Highlight Card */}
            <div className={`p-4 rounded-xl border backdrop-blur-md relative overflow-hidden ${
              isPerfect 
                ? 'bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-transparent border-emerald-500/30' 
                : 'bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-transparent border-cyan-500/30'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isPerfect 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  }`}>
                    {isPerfect ? <Trophy className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                  </div>
                  <div>
                    <h5 className="text-sm font-black text-white flex items-center gap-1.5">
                      {isPerfect ? 'Perfect Score!' : 'Challenge Completed!'}
                      {isPerfect && <span className="text-xs text-yellow-400">★</span>}
                    </h5>
                    <p className="text-xs text-slate-300">
                      Streak maintained for today. Come back tomorrow!
                    </p>
                  </div>
                </div>

                {/* Score Pill */}
                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Today's Score</div>
                  <div className="text-lg font-black text-emerald-400 flex items-center justify-end gap-1">
                    <span>{score}</span>
                    <span className="text-xs text-slate-500 font-normal">/ 10</span>
                  </div>
                </div>
              </div>

              {/* Stat Chips */}
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5 text-[11px] text-slate-300">
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified
                </span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1 text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> {timeTaken}s elapsed
                </span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1 text-amber-400 font-medium">
                  <TrendingUp className="w-3.5 h-3.5" /> +{isPerfect ? '10' : '2'} XP
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ACTION FOOTER */}
      <div className="relative z-10 pt-3">
        {isNotStarted && (
          <button
            onClick={() => navigate('/daily-challenge')}
            className="w-full relative group/btn flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm text-black bg-gradient-to-r from-cyan-400 via-mint to-cyan-300 hover:opacity-95 shadow-[0_0_25px_rgba(57,255,176,0.4)] hover:shadow-[0_0_35px_rgba(57,255,176,0.6)] active:scale-[0.99] transition-all duration-300 cursor-pointer overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              Start Challenge
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
          </button>
        )}

        {isInProgress && (
          <button
            onClick={() => navigate('/daily-challenge')}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm text-black bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-300 hover:to-amber-300 shadow-[0_0_20px_rgba(250,204,21,0.4)] active:scale-[0.99] transition-all cursor-pointer"
          >
            Resume Challenge Now
            <ArrowRight className="w-4 h-4 animate-pulse" />
          </button>
        )}

        {isCompleted && (
          <div className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              STATUS: COMPLETE
            </span>
            <span className="text-[11px] text-emerald-300/80 font-medium">
              Next challenge unlocks at midnight
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

