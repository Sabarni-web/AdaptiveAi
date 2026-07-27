import React, { useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { AlertCircle } from 'lucide-react';

export const ExitConfirmation = ({ isOpen, onConfirm, onCancel }) => {
  // beforeunload listener to warn user when attempting window close/refresh
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = 'Your exam progress will be lost. Are you sure you want to exit?';
      return e.returnValue;
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title="Exit Exam Session?"
      description="Leaving the examination workspace now will void this session."
      footer={
        <div className="flex gap-3">
          <Button variant="outline" onClick={onCancel}>
            Resume Exam
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Leave Exam Anyway
          </Button>
        </div>
      }
    >
      <div className="flex gap-4 items-start bg-red-50 dark:bg-red-950/20 p-5 rounded-2xl border border-red-200 dark:border-red-900/50">
        <AlertCircle className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
        <div className="flex flex-col gap-1 text-red-650 dark:text-red-400 text-sm">
          <h4 className="font-bold">Important Notice:</h4>
          <p className="leading-relaxed">
            By leaving the exam, your responses will not be evaluated, and this session will be recorded as abandoned. This action cannot be reversed.
          </p>
        </div>
      </div>
    </Modal>
  );
};
export default ExitConfirmation;
