import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useExam } from '../hooks/useExam';
import { useFullscreen } from '../hooks/useFullscreen';
import { useSocket } from '../hooks/useSocket';
import { Timer } from '../components/exam/Timer';
import { ProgressBar } from '../components/exam/ProgressBar';
import { QuestionCard } from '../components/exam/QuestionCard';
import { SubmitConfirmation } from '../components/exam/SubmitConfirmation';
import { ExitConfirmation } from '../components/exam/ExitConfirmation';
import { AutoSaveIndicator } from '../components/exam/AutoSaveIndicator';
import { BreakScreen } from '../components/exam/BreakScreen';
import { Button } from '../components/common/Button';
import { toast } from 'sonner';

export const Exam = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const {
    currentQuestion,
    currentQuestionIndex,
    answers,
    flagged,
    timeRemaining,
    config,
    isLoading,
    loadNextQuestion,
    submitAnswer,
    flagQuestion,
    finishExam,
  } = useExam();

  const socket = useSocket(sessionId);
  const { isFullscreen, enter, exit } = useFullscreen();

  const [localAnswer, setLocalAnswer] = useState('');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [saveStatus, setSaveStatus] = useState('saved');

  // Trigger fullscreen on start
  useEffect(() => {
    enter();
    loadNextQuestion(sessionId);
  }, [sessionId]);

  // Anti-Cheating tab focus detection
  useEffect(() => {
    const handleVisibility = () => {
      const isFocused = !document.hidden;
      socket.emitFocusChange(sessionId, isFocused);
      if (!isFocused) {
        toast.warning('Warning: Leaving the exam tab is recorded as a compliance event!');
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [sessionId, socket]);

  // Disable Right-Click context menus
  useEffect(() => {
    const disableRightClick = (e) => e.preventDefault();
    document.addEventListener('contextmenu', disableRightClick);
    return () => document.removeEventListener('contextmenu', disableRightClick);
  }, []);

  // Update local answer state when question shifts
  useEffect(() => {
    if (currentQuestion) {
      setLocalAnswer(answers[currentQuestion.id] || '');
    }
  }, [currentQuestion, answers]);

  // Real-time socket commands handling
  useEffect(() => {
    socket.onExamControl(({ action }) => {
      if (action === 'pause') setIsPaused(true);
      if (action === 'resume') setIsPaused(false);
    });
    socket.onForceSubmitNotice(() => {
      toast.info('Exam duration reached. Auto-submitting session.');
      handleFinalSubmit();
    });
    return () => socket.removeListeners();
  }, [socket]);

  const handleNext = async () => {
    setSaveStatus('saving');
    await submitAnswer(localAnswer, 30);
    setSaveStatus('saved');
  };

  const handleFinalSubmit = async () => {
    await finishExam(sessionId);
    exit();
  };

  const handleAbandon = () => {
    exit();
    navigate('/dashboard');
  };

  if (isLoading || !currentQuestion) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-400">
        Initializing adaptive exam workspace...
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-slate-900 text-slate-100 relative">
      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white">{config?.title || 'Evaluation Session'}</h2>
          <div className="mt-1">
            <AutoSaveIndicator status={saveStatus} />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Timer
            totalSeconds={timeRemaining}
            onTimeUp={handleFinalSubmit}
            isRunning={!isPaused}
          />
          <Button variant="danger" size="sm" onClick={() => setShowExitModal(true)}>
            Exit Exam
          </Button>
        </div>
      </div>

      {/* Main Question Body */}
      <div className="flex-1 flex items-center py-8">
        <QuestionCard
          question={currentQuestion}
          answer={localAnswer}
          onAnswer={setLocalAnswer}
          isFlagged={flagged.includes(currentQuestion.id)}
          onFlag={flagQuestion}
          isLoading={saveStatus === 'saving'}
        />
      </div>

      {/* Footer Navigation Controls */}
      <div className="flex flex-col gap-4 border-t border-slate-800 pt-4">
        <div className="flex items-center justify-between">
          <div className="text-xs text-slate-500 font-semibold">
            Press <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">Enter</kbd> to submit answer
          </div>
          <div className="flex gap-3">
            <Button
              variant="primary"
              onClick={handleNext}
              disabled={saveStatus === 'saving'}
            >
              Submit &amp; Next &rarr;
            </Button>
            <Button variant="danger" onClick={() => setShowSubmitModal(true)}>
              Submit Exam
            </Button>
          </div>
        </div>
        <ProgressBar
          current={currentQuestionIndex}
          total={config?.questionLimit || 5}
          answered={Object.keys(answers).map((_, i) => i)}
          flagged={flagged.map((id) => currentQuestionIndex)}
        />
      </div>

      {/* Confirmation Modals */}
      <SubmitConfirmation
        isOpen={showSubmitModal}
        onCancel={() => setShowSubmitModal(false)}
        onConfirm={handleFinalSubmit}
        answeredCount={answeredCount}
        totalCount={config?.questionLimit || 5}
        flaggedCount={flagged.length}
      />

      <ExitConfirmation
        isOpen={showExitModal}
        onCancel={() => setShowExitModal(false)}
        onConfirm={handleAbandon}
      />

      {isPaused && (
        <BreakScreen
          breakDuration={120}
          onResume={() => setIsPaused(false)}
          message="Evaluation is temporarily paused by the proctor."
        />
      )}
    </div>
  );
};
export default Exam;
