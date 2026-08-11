import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import apiClient from '../services/apiClient';
import { Zap, Clock, Flame, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';

export const DailyChallengePage = () => {
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [timeLeft, setTimeLeft] = useState(90);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [result, setResult] = useState(null);

  // Start challenge mutation
  const startMutation = useMutation({
    mutationFn: async () => {
      const res = await apiClient.post('/daily-challenge/start', {});
      return res.data;
    },
    onSuccess: (data) => {
      setChallenge(data);
      if (data.status === 'completed' || data.status === 'timed_out') {
        // Already done for today, redirect back or show completed
        navigate('/dashboard');
      } else if (data.startedAt) {
        // Calculate remaining time
        const elapsed = Math.floor((new Date().getTime() - new Date(data.startedAt).getTime()) / 1000);
        const remaining = Math.max(90 - elapsed, 0);
        setTimeLeft(remaining);
        if (remaining === 0) {
          submitMutation.mutate({ answer: null });
        }
      }
    },
    onError: () => {
      navigate('/dashboard');
    }
  });

  // Submit challenge mutation
  const submitMutation = useMutation({
    mutationFn: async ({ answer }) => {
      const res = await apiClient.post(`/daily-challenge/${challenge._id}/submit`, { answer });
      return res.data;
    },
    onSuccess: (data) => {
      setResult(data);
    }
  });

  useEffect(() => {
    startMutation.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let timer;
    if (challenge && !result && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            // Auto submit
            submitMutation.mutate({ answer: selectedAnswer });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [challenge, result, timeLeft, selectedAnswer, submitMutation]);

  if (startMutation.isPending) {
    return (
      <div className="flex h-[80vh] items-center justify-center animate-fade-in">
        <Loader2 className="w-10 h-10 animate-spin text-cyan-500" />
      </div>
    );
  }

  if (!challenge || !challenge.questionId) return null;

  const question = challenge.questionId;

  if (result) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4 animate-fade-in">
        <Card>
          <div className="text-center py-6">
            {result.isCorrect ? (
              <div className="flex flex-col items-center">
                <span className="text-6xl mb-4">🎉</span>
                <h2 className="text-3xl font-black text-green-400 mb-2">CORRECT!</h2>
                <div className="flex items-center gap-6 mt-4">
                  <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full font-bold">+{result.xpEarned} XP</span>
                  <span className="bg-orange-500/20 text-orange-400 px-4 py-2 rounded-full font-bold flex items-center gap-1">
                    <Flame className="w-5 h-5 fill-orange-400" /> {result.streak} DAY STREAK
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <span className="text-6xl mb-4 text-red-500">❌</span>
                <h2 className="text-3xl font-black text-red-500 mb-2">Not quite!</h2>
                {challenge.status === 'timed_out' && (
                  <p className="text-orange-400 font-bold mb-4">Time's Up!</p>
                )}
                <div className="flex items-center gap-6 mt-4">
                  <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full font-bold">+{result.xpEarned} XP</span>
                  <span className="bg-slate-700/50 text-slate-400 px-4 py-2 rounded-full font-bold flex items-center gap-1">
                    <Flame className="w-5 h-5 fill-slate-500" /> STREAK RESET
                  </span>
                </div>
              </div>
            )}

            <div className="text-left mt-8 bg-slate-800/50 p-6 rounded-xl border border-slate-700">
              <div className="mb-4">
                <p className="text-sm text-slate-400 mb-1">Your Answer:</p>
                <p className="font-bold text-white">{selectedAnswer || 'None'}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm text-slate-400 mb-1">Correct Answer:</p>
                <p className="font-bold text-green-400">{result.correctAnswer}</p>
              </div>
              
              {result.explanation && (
                <div className="mt-6 border-t border-slate-700 pt-4">
                  <p className="text-sm text-slate-400 font-bold mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" /> EXPLANATION
                  </p>
                  <p className="text-slate-300">{result.explanation}</p>
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-center">
              <Button onClick={() => navigate('/dashboard')} className="w-full sm:w-auto">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 animate-fade-in">
      <Card>
        <div className="flex items-center justify-between border-b border-slate-700 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            <h2 className="text-xl font-bold">DAILY CHALLENGE</h2>
          </div>
          <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-full">
            <Clock className={`w-5 h-5 ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-cyan-400'}`} />
            <span className={`font-mono text-xl font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-cyan-400'}`}>
              00:{timeLeft.toString().padStart(2, '0')}
            </span>
          </div>
        </div>

        <div className="mb-4">
          <span className="bg-slate-800 text-slate-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {challenge.domain} • {challenge.difficulty}
          </span>
        </div>

        <h3 className="text-lg text-white mb-8 leading-relaxed">
          {question.questionText}
        </h3>

        <div className="space-y-3 mb-8">
          {question.options.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setSelectedAnswer(opt.key)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selectedAnswer === opt.key 
                  ? 'border-cyan-500 bg-cyan-500/10 text-cyan-300' 
                  : 'border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:border-slate-600'
              }`}
            >
              <span className="font-bold mr-3 text-slate-500">{opt.key}.</span>
              {opt.text}
            </button>
          ))}
        </div>

        <Button 
          className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-4 text-lg font-bold"
          disabled={!selectedAnswer || submitMutation.isPending}
          onClick={() => submitMutation.mutate({ answer: selectedAnswer })}
        >
          {submitMutation.isPending ? 'Submitting...' : 'Submit Answer'}
        </Button>
      </Card>
    </div>
  );
};
