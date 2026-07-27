import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { AlertTriangle } from 'lucide-react';

export const SubmitConfirmation = ({
  isOpen,
  onConfirm,
  onCancel,
  answeredCount = 0,
  totalCount = 10,
  flaggedCount = 0,
}) => {
  const [confirmText, setConfirmText] = useState('');
  const unattemptedCount = totalCount - answeredCount;

  const handleConfirm = () => {
    if (confirmText === 'SUBMIT') {
      onConfirm();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title="Submit Evaluation Session"
      description="Please review your answers before submitting."
      footer={
        <div className="flex gap-3">
          <Button variant="outline" onClick={onCancel}>
            Cancel and Return
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirm}
            disabled={confirmText !== 'SUBMIT'}
          >
            Submit and Finish
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Quick statistics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl text-center">
            <span className="block text-xl font-black text-slate-800 dark:text-white">
              {answeredCount}
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Answered
            </span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl text-center">
            <span className="block text-xl font-black text-yellow-500">
              {flaggedCount}
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Flagged
            </span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl text-center">
            <span className="block text-xl font-black text-red-500">
              {unattemptedCount}
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Unattempted
            </span>
          </div>
        </div>

        {/* Warning Alert if there are unattempted questions */}
        {unattemptedCount > 0 && (
          <div className="flex gap-3 bg-red-50 dark:bg-red-950/20 p-4 rounded-xl border border-red-200 dark:border-red-900/50 text-red-650 dark:text-red-400">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <div className="text-xs font-semibold leading-relaxed">
              You still have {unattemptedCount} unattempted questions. Submitting now will submit these as empty answers and cannot be undone.
            </div>
          </div>
        )}

        {/* Safety Type-to-Confirm validation */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
            Confirm Submission
          </label>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            To prevent accidental submissions, please type <span className="font-extrabold text-slate-800 dark:text-slate-200">SUBMIT</span> in the input field below to unlock the finish button.
          </p>
          <input
            type="text"
            placeholder="Type SUBMIT"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm font-semibold"
          />
        </div>
      </div>
    </Modal>
  );
};
export default SubmitConfirmation;
