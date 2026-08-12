import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Accordion } from '../common/Accordion';
import { Badge } from '../common/Badge';
import { CheckCircle2, XCircle } from 'lucide-react';
import DOMPurify from 'dompurify';

export const AnswerReview = ({ answers = [] }) => {
  const [filter, setFilter] = useState('all');

  const filteredAnswers = answers.filter((ans) => {
    if (filter === 'correct') return ans.isCorrect;
    if (filter === 'incorrect') return !ans.isCorrect;
    return true;
  });

  const getAccordionItems = () => {
    return filteredAnswers.map((ans, idx) => {
      const q = ans.question;
      
      if (!q) {
        return {
          id: `ans-${idx}`,
          title: (
            <div className="flex items-center justify-between w-full pr-4 text-xs md:text-sm">
              <span className="font-bold text-slate-800 dark:text-slate-200">
                Question {idx + 1} (Deleted)
              </span>
            </div>
          ),
          content: <div className="text-sm text-slate-500">This question was removed from the database.</div>,
        };
      }

      const cleanText = DOMPurify.sanitize(q.questionText || q.text || '');

      const title = (
        <div className="flex items-center justify-between w-full pr-4 text-xs md:text-sm">
          <div className="flex items-center gap-2.5">
            {ans.isCorrect ? (
              <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500 shrink-0" />
            )}
            <span className="font-bold text-slate-800 dark:text-slate-200">
              Question {idx + 1} ({q.type})
            </span>
          </div>
          <Badge variant={ans.isCorrect ? 'success' : 'danger'} size="sm">
            {ans.marksObtained} / {ans.maxMarks} Marks
          </Badge>
        </div>
      );

      const content = (
        <div className="flex flex-col gap-4">
          <div
            className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: cleanText }}
          />

          {q.type === 'MCQ' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              {q.options?.map((opt, i) => {
                if (!opt) return null;
                const optLabel = opt.label || opt.key || String.fromCharCode(65 + i);
                const isSelected = ans.studentAnswer === optLabel || ans.studentAnswer === opt.text;
                const isCorrect = (q.correctOption || q.correctAnswer || ans.correctAnswer) === optLabel || (ans.correctAnswer) === opt.text;
                let cardStyle = 'border-slate-200 dark:border-slate-800';
                if (isSelected) cardStyle = 'border-red-500 bg-red-50/10 dark:bg-red-950/10 text-red-500 font-medium';
                if (isCorrect) cardStyle = 'border-green-500 bg-green-50/10 dark:bg-green-950/10 text-green-500 font-medium';

                return (
                  <div
                    key={optLabel}
                    className={`px-4 py-3 rounded-xl border-2 text-xs md:text-sm flex items-center gap-3 ${cardStyle}`}
                  >
                    <span className="font-bold text-slate-400">{optLabel}</span>
                    <span>{opt.text || 'No text provided'}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col gap-4 mt-2 border-t border-slate-100 dark:border-slate-800 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Your Response
                  </span>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 text-xs font-mono whitespace-pre-wrap">
                    {ans.studentAnswer}
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Model Reference Answer
                  </span>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 text-xs font-mono whitespace-pre-wrap">
                    {q.modelAnswer || 'No model answer provided.'}
                  </div>
                </div>
              </div>

              {ans.aiExplanation && (
                <div className="flex flex-col gap-1 bg-primary-50/20 dark:bg-primary-950/10 border border-primary-200 dark:border-primary-900/50 p-4 rounded-xl">
                  <span className="text-[10px] text-primary-650 dark:text-primary-400 font-bold uppercase tracking-wider">
                    AI Evaluation &amp; Explanation
                  </span>
                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-350">
                    {ans.aiExplanation}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      );

      return {
        id: `ans-${idx}`,
        title,
        content,
      };
    });
  };

  return (
    <Card title="Detailed Responses Review" description="Review student choices and correct answers.">
      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {['all', 'correct', 'incorrect'].map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all uppercase tracking-wider ${
              filter === item
                ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 border-transparent'
                : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-205 dark:border-slate-700 hover:bg-slate-550'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <Accordion items={getAccordionItems()} allowMultiple />
    </Card>
  );
};
export default AnswerReview;
