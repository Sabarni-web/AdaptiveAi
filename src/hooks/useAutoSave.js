import { useState, useEffect, useRef } from 'react';

export const useAutoSave = (sessionId, questionId, value, onSave, delay = 3000) => {
  const [status, setStatus] = useState('saved'); // 'saving' | 'saved' | 'error'
  const [lastSaved, setLastSaved] = useState(null);
  const timeoutRef = useRef(null);

  // Restore draft from localStorage on load
  const getDraft = () => {
    try {
      const draft = localStorage.getItem(`exam_draft_${sessionId}`);
      if (draft) {
        const parsed = JSON.parse(draft);
        if (parsed.questionId === questionId) {
          return parsed.value;
        }
      }
    } catch (e) {
      console.error('Error reading draft:', e);
    }
    return null;
  };

  useEffect(() => {
    if (value === undefined || value === null) return;

    setStatus('saving');

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        // Save to local storage first
        localStorage.setItem(
          `exam_draft_${sessionId}`,
          JSON.stringify({ questionId, value, timestamp: new Date().toISOString() })
        );

        if (onSave) {
          await onSave(value);
        }

        setStatus('saved');
        setLastSaved(new Date());
      } catch (err) {
        setStatus('error');
      }
    }, delay);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [value, questionId, sessionId, delay, onSave]);

  const clearDraft = () => {
    localStorage.removeItem(`exam_draft_${sessionId}`);
  };

  return {
    status,
    lastSaved,
    getDraft,
    clearDraft,
  };
};
export default useAutoSave;
