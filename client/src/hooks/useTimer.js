import { useState, useEffect, useRef, useCallback } from 'react';

export const useTimer = (initialSeconds = 3600, warningThreshold = 300, onTimeUp, onWarning) => {
  const [timeRemaining, setTimeRemaining] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);

  const timerRef = useRef(null);
  const endTimeRef = useRef(null);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (num) => String(num).padStart(2, '0');

    if (hours > 0) {
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }
    return `${pad(minutes)}:${pad(seconds)}`;
  };

  const start = useCallback(() => {
    if (isRunning) return;
    setIsRunning(true);
    endTimeRef.current = Date.now() + timeRemaining * 1000;
  }, [isRunning, timeRemaining]);

  const pause = useCallback(() => {
    if (!isRunning) return;
    setIsRunning(false);
    if (timerRef.current) {
      cancelAnimationFrame(timerRef.current);
    }
  }, [isRunning]);

  const resume = useCallback(() => {
    start();
  }, [start]);

  const stop = useCallback(() => {
    setIsRunning(false);
    if (timerRef.current) {
      cancelAnimationFrame(timerRef.current);
    }
  }, []);

  useEffect(() => {
    const tick = () => {
      if (!isRunning) return;

      const now = Date.now();
      const diff = Math.max(0, Math.round((endTimeRef.current - now) / 1000));

      setTimeRemaining(diff);

      if (diff === warningThreshold && onWarning) {
        onWarning();
      }

      if (diff <= 0) {
        setIsRunning(false);
        if (onTimeUp) onTimeUp();
      } else {
        timerRef.current = requestAnimationFrame(tick);
      }
    };

    if (isRunning) {
      timerRef.current = requestAnimationFrame(tick);
    }

    return () => {
      if (timerRef.current) {
        cancelAnimationFrame(timerRef.current);
      }
    };
  }, [isRunning, warningThreshold, onWarning, onTimeUp]);

  // Sync with tab focus changes (prevent suspension drift)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab inactive: store remaining time
        if (timerRef.current) cancelAnimationFrame(timerRef.current);
      } else {
        // Tab active: recalculate exact end time
        if (isRunning) {
          endTimeRef.current = Date.now() + timeRemaining * 1000;
          timerRef.current = requestAnimationFrame(() => {});
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isRunning, timeRemaining]);

  return {
    timeRemaining,
    formattedTime: formatTime(timeRemaining),
    isWarning: timeRemaining <= warningThreshold && timeRemaining > 60,
    isCritical: timeRemaining <= 60,
    isRunning,
    start,
    pause,
    resume,
    stop,
    setTimeRemaining: (sec) => {
      setTimeRemaining(sec);
      endTimeRef.current = Date.now() + sec * 1000;
    },
  };
};
