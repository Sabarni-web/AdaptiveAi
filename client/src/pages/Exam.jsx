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
import { ProctoringPanel } from '../components/exam/ProctoringPanel';
import { LookingAwayWarning } from '../components/exam/LookingAwayWarning';
import { Button } from '../components/common/Button';
import { toast } from 'sonner';
import { ProctoringProvider } from '../components/proctoring/ProctoringProvider';
import { useTranslation } from 'react-i18next';

export const Exam = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

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
        if (import.meta.env.DEV) {
          console.warn('Development: Leaving the exam tab (Compliance event suppressed)');
        } else {
          toast.warning('Warning: Leaving the exam tab is recorded as a compliance event!');
        }
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

  const [feedback, setFeedback] = useState(null); // { isCorrect, correctAnswer, explanation, marksAwarded }

  const handleNext = async () => {
    setSaveStatus('saving');
    const response = await submitAnswer(localAnswer || 'SKIP', 30);
    setSaveStatus('saved');

    if (response) {
      setFeedback(response);
      setTimeout(async () => {
        setFeedback(null);
        await loadNextQuestion(sessionId);
      }, 2000);
    }
  };

  const handleTimeUp = () => {
    toast.error('Time is up! Auto-submitting your answer.');
    handleNext();
  };

  const getQuestionTimeLimit = (question) => {
    if (!question) return 20;
    if (question.type === 'MCQ') return 20;
    if (question.type === 'SAQ' || question.type === 'Descriptive' || question.type === 'DESCRIPTIVE') return 180;
    return 20; // Default fallback
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
    <ProctoringProvider sessionId={sessionId}>
      <div className="flex-1 flex flex-col justify-between p-6 bg-slate-900 text-slate-100 relative">
        {/* Header Info */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white">{config?.title || 'Evaluation Session'}</h2>
            <div className="mt-1 flex items-center gap-2">
              <span className="bg-primary-900/50 text-primary-300 text-xs px-2 py-0.5 rounded font-bold uppercase tracking-wider border border-primary-800">
                {currentQuestion.difficulty || 'Adaptive'}
              </span>
              <AutoSaveIndicator status={saveStatus} />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Timer
              key={currentQuestion?.id || 'timer'}
              totalSeconds={getQuestionTimeLimit(currentQuestion)}
              warningAt={getQuestionTimeLimit(currentQuestion) === 60 ? 10 : 30}
              startedAt={currentQuestion?.startedAt}
              onTimeUp={handleTimeUp}
              isRunning={!isPaused && !feedback}
            />
            <Button variant="danger" size="sm" onClick={() => setShowExitModal(true)}>
              {t('cancel', 'Exit Exam')}
            </Button>
          </div>
        </div>

        {/* Main Question Body */}
        <div className="flex-1 flex flex-col items-center py-8">
          <QuestionCard
            question={currentQuestion}
            answer={localAnswer}
            onAnswer={setLocalAnswer}
            isFlagged={flagged.includes(currentQuestionIndex)}
            onFlag={flagQuestion}
            isLoading={saveStatus === 'saving' || !!feedback}
          />
          
          {/* Instant Feedback Overlay */}
          {feedback && (
            <div className="mt-6 w-full max-w-3xl animate-fade-in">
              <div className={`p-4 rounded-xl border ${feedback.isCorrect ? 'bg-green-900/30 border-green-500 text-green-100' : 'bg-red-900/30 border-red-500 text-red-100'}`}>
                <h3 className="text-xl font-bold mb-2">
                  {feedback.isCorrect ? '✅ Correct!' : '❌ Incorrect'}
                </h3>
                {!feedback.isCorrect && (
                  <p className="mb-2"><strong>Correct Answer:</strong> {feedback.correctAnswer}</p>
                )}
                <p className="text-sm opacity-90"><strong>Explanation:</strong> {feedback.explanation}</p>
                {feedback.isCorrect && (
                  <p className="mt-2 text-sm font-semibold text-green-300">+{feedback.marksAwarded} Marks Awarded</p>
                )}
              </div>
            </div>
          )}
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
                disabled={saveStatus === 'saving' || !!feedback}
              >
                {t('nextQuestion', 'Submit & Next →')}
              </Button>
              <Button variant="danger" onClick={() => setShowSubmitModal(true)}>
                {t('submitExam', 'Submit Exam')}
              </Button>
            </div>
          </div>
          <ProgressBar
            current={currentQuestionIndex}
            total={config?.questionLimit || 5}
            answered={Array.from({ length: currentQuestionIndex }).map((_, i) => i)}
            flagged={flagged}
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
        {/* Floating Proctoring Panel */}
        <div className="absolute bottom-6 left-6 z-50">
          <ProctoringPanel examId={sessionId} questionNumber={currentQuestionIndex + 1} />
        </div>

        <LookingAwayWarning />
      </div>
    </ProctoringProvider>
  );
};

export default Exam;
