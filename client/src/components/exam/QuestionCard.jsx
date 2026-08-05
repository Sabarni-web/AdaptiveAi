import React from 'react';
import DOMPurify from 'dompurify';
import { Star } from 'lucide-react';
import clsx from 'clsx';
import { MCQ } from './MCQ';
import { Descriptive } from './Descriptive';

export const QuestionCard = ({
  question,
  answer = '',
  onAnswer,
  isLoading = false,
  isFlagged = false,
  onFlag,
}) => {
  if (!question) return null;

  const sanitizedHTML = DOMPurify.sanitize(question.text);

  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto bg-surface border border-hair p-6 rounded-2xl shadow-lg transition-colors">
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between border-b border-hair pb-4">
        <div className="flex items-center gap-3">
          <span className="bg-mint/10 text-mint border border-mint/20 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
            Question {question.questionNumber} of {question.totalQuestions}
          </span>
          <span className="bg-surface-2 text-secondary border border-hair px-3 py-1 rounded-lg text-xs font-semibold">
            {question.marks} {question.marks === 1 ? 'Mark' : 'Marks'}
          </span>
        </div>
        <button
          onClick={onFlag}
          className={clsx(
            'flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border transition-all',
            isFlagged
              ? 'border-amber-soft bg-amber-soft/10 text-amber-soft font-bold'
              : 'border-hair hover:border-mint/50 text-secondary hover:text-primary'
          )}
        >
          <Star className={clsx('h-3.5 w-3.5', isFlagged && 'fill-current')} />
          <span>Flag for Review</span>
        </button>
      </div>

      {/* Question Text */}
      <div
        className="text-base md:text-lg text-primary font-medium leading-relaxed"
        dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
      />

      {/* Options or Textarea depending on Question Type */}
      <div className="mt-2">
        {question.type === 'MCQ' ? (
          <MCQ
            options={question.options}
            selected={answer}
            onSelect={onAnswer}
            disabled={isLoading}
          />
        ) : (
          <Descriptive
            value={answer || ''}
            onChange={onAnswer}
            disabled={isLoading}
          />
        )}
      </div>
    </div>
  );
};
export default QuestionCard;
