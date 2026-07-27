import React, { useState, useEffect } from 'react';
import { Button } from '../common/Button';
import { Coffee } from 'lucide-react';

export const BreakScreen = ({ breakDuration = 60, onResume, message = 'Take a short break.' }) => {
  const [timeLeft, setTimeLeft] = useState(breakDuration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onResume();
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft, onResume]);

  const formatTime = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md animate-fade-in p-6">
      <div className="flex flex-col items-center gap-6 max-w-sm text-center">
        <div className="h-16 w-16 bg-slate-900 border border-slate-800 text-primary-400 rounded-full flex items-center justify-center shadow-lg">
          <Coffee className="h-7 w-7" />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-black text-white">Evaluation Paused</h2>
          <p className="text-sm text-slate-400 leading-relaxed">{message}</p>
        </div>
        <div className="text-4xl font-mono font-bold text-primary-400 tracking-widest my-2">
          {formatTime(timeLeft)}
        </div>
        <Button variant="primary" onClick={onResume} className="w-full">
          Resume Evaluation
        </Button>
      </div>
    </div>
  );
};
export default BreakScreen;
