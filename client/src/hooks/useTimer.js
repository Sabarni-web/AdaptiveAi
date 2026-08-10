import { useState, useEffect, useRef, useCallback } from 'react';

export const useTimer = ({ totalSeconds = 3600, warningThreshold = 300, startedAt, onTimeUp, onWarning }) => {
  const [timeRemaining, setTimeRemaining] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(false);

  const timerRef = useRef(null);

  const formatTime = (totalSeconds) => {
    if (totalSeconds <= 0) return '00:00';
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
  }, [isRunning]);

  const pause = useCallback(() => {
    if (!isRunning) return;
    setIsRunning(false);
    if (timerRef.current) {
      cancelAnimationFrame(timerRef.current);
    }
  }, [isRunning]);

  const stop = useCallback(() => {
    setIsRunning(false);
    if (timerRef.current) {
      cancelAnimationFrame(timerRef.current);
    }
  }, []);

  useEffect(() => {
    // Determine the precise start time
    const startTime = startedAt ? new Date(startedAt).getTime() : Date.now();
    const endTime = startTime + totalSeconds * 1000;

    const tick = () => {
      if (!isRunning) return;

      const now = Date.now();
      const diff = Math.max(0, Math.round((endTime - now) / 1000));

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
      // Calculate initial diff to avoid waiting for the first tick
      const now = Date.now();
      const diff = Math.max(0, Math.round((endTime - now) / 1000));
      setTimeRemaining(diff);
      if (diff <= 0) {
        setIsRunning(false);
        if (onTimeUp) onTimeUp();
      } else {
        timerRef.current = requestAnimationFrame(tick);
      }
    }

    return () => {
      if (timerRef.current) {
        cancelAnimationFrame(timerRef.current);
      }
    };
  }, [isRunning, totalSeconds, warningThreshold, onWarning, onTimeUp, startedAt]);

  return {
    timeRemaining,
    formattedTime: formatTime(timeRemaining),
    isWarning: timeRemaining <= warningThreshold && timeRemaining > 10,
    isCritical: timeRemaining <= 10,
    isRunning,
    start,
    pause,
    stop,
  };
};
