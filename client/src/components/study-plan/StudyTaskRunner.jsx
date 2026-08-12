import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, Loader2, Play } from 'lucide-react';
import { Button } from '../common/Button';
import { Descriptive } from '../exam/Descriptive';
import { studyPlanService } from '../../services/studyPlanService';

export const StudyTaskRunner = ({ planId, task, onFinish, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [error, setError] = useState(null);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        setLoading(true);
        const res = await studyPlanService.startTask(planId, task._id);
        if (res.success) {
          setQuestions(res.questions || []);
        } else {
          setError(res.message);
        }
      } catch (err) {
        setError('Failed to start task.');
      } finally {
        setLoading(false);
      }
    };
    fetchTaskData();
  }, [planId, task._id]);

  const handleSelectAnswer = (key) => {
    if (!isAnswered) setSelectedAnswer(key);
  };

  const handleSubmitAnswer = () => {
    setIsAnswered(true);
  };

  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(c => c + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      // Complete Task
      try {
        setCompleting(true);
        await studyPlanService.completeTask(planId, task._id);
        setTaskCompleted(true);
      } catch (err) {
        console.error(err);
      } finally {
        setCompleting(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-text-secondary">Preparing {task.title} questions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 h-[400px]">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={onBack} variant="outline">Go Back</Button>
      </div>
    );
  }

  if (taskCompleted) {
    return (
      <div className="flex flex-col items-center justify-center p-12 h-[400px]">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Task Complete!</h2>
        <p className="text-text-secondary mb-8">You finished {task.title} for {task.durationMinutes} minutes.</p>
        <Button onClick={onFinish} className="w-full max-w-xs">
          Return to Plan
        </Button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 h-[400px] text-center">
        <h2 className="text-xl font-bold mb-2">No Questions Found</h2>
        <p className="text-text-secondary mb-6">We couldn't find enough specific questions for {task.topic || task.subject}. We'll mark this as done for now.</p>
        <Button onClick={async () => {
          setCompleting(true);
          await studyPlanService.completeTask(planId, task._id);
          onFinish();
        }} disabled={completing}>
          {completing ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Mark as Complete'}
        </Button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const isDescriptive = currentQ.type !== 'MCQ' && (!currentQ.options || currentQ.options.length === 0);
  const isCorrect = isDescriptive ? true : selectedAnswer === currentQ.correctAnswer;

  return (
    <div className="flex flex-col h-full max-h-[80vh]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-hair bg-surface">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-text-secondary" />
          </button>
          <div>
            <div className="text-xs text-primary font-bold uppercase tracking-wider">{task.subject}</div>
            <div className="font-medium text-sm text-text-secondary">{task.topic}</div>
          </div>
        </div>
        <div className="text-sm font-medium">
          Question {currentIndex + 1} of {questions.length}
        </div>
      </div>

      {/* Progress */}
      <div className="w-full h-1 bg-surface-lighter">
        <div 
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-xl text-text-primary leading-relaxed mb-8">
            {currentQ.questionText}
          </h3>

          <div className="space-y-3">
            {isDescriptive ? (
              <Descriptive 
                value={selectedAnswer || ''} 
                onChange={(val) => handleSelectAnswer(val)} 
                disabled={isAnswered}
                placeholder="Type your comprehensive response here..."
              />
            ) : (
              currentQ.options?.map((opt) => {
                const isSelected = selectedAnswer === opt.key;
                let btnClass = "w-full text-left p-4 rounded-xl border border-hair hover:border-primary/50 hover:bg-surface-lighter transition-all flex items-center gap-3";
                
                if (isSelected) btnClass += " bg-primary/10 border-primary shadow-[0_0_15px_rgba(var(--primary),0.1)]";
                
                if (isAnswered) {
                  if (opt.key === currentQ.correctAnswer) {
                    btnClass = "w-full text-left p-4 rounded-xl border border-green-500 bg-green-500/10 flex items-center gap-3 text-green-400";
                  } else if (isSelected && opt.key !== currentQ.correctAnswer) {
                    btnClass = "w-full text-left p-4 rounded-xl border border-red-500 bg-red-500/10 flex items-center gap-3 text-red-400 opacity-70";
                  } else {
                    btnClass = "w-full text-left p-4 rounded-xl border border-hair opacity-40 flex items-center gap-3";
                  }
                }

                return (
                  <button
                    key={opt.key}
                    onClick={() => handleSelectAnswer(opt.key)}
                    disabled={isAnswered}
                    className={btnClass}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                      isSelected ? 'bg-primary text-background' : 
                      (isAnswered && opt.key === currentQ.correctAnswer) ? 'bg-green-500 text-white' :
                      (isAnswered && isSelected) ? 'bg-red-500 text-white' :
                      'bg-surface-lighter text-text-secondary border border-hair'
                    }`}>
                      {opt.key}
                    </div>
                    <span className="flex-1 leading-relaxed text-sm">{opt.text}</span>
                  </button>
                );
              })
            )}
          </div>

          {isAnswered && currentQ.answerExplanation && (
            <div className="mt-8 p-4 bg-surface rounded-xl border border-hair animate-fade-in">
              <h4 className="font-bold mb-2 text-sm text-text-secondary uppercase">Explanation</h4>
              <p className="text-sm text-text-primary leading-relaxed">{currentQ.answerExplanation}</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-hair bg-surface">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <div>
             {isAnswered && (
                <span className={`font-bold ${isDescriptive ? 'text-blue-500' : isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                  {isDescriptive ? 'Answer Submitted' : isCorrect ? 'Correct!' : 'Incorrect'}
                </span>
             )}
          </div>
          <Button 
            disabled={!selectedAnswer || completing} 
            onClick={isAnswered ? handleNext : handleSubmitAnswer}
            className="min-w-[140px]"
          >
            {completing ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> :
             !isAnswered ? 'Check Answer' :
             currentIndex < questions.length - 1 ? 'Next Question' : 'Complete Task'}
          </Button>
        </div>
      </div>
    </div>
  );
};
