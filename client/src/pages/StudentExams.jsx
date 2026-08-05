import React from 'react';
import { Play, BookOpen } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useExam } from '../hooks/useExam';

export const StudentExams = () => {
  const { startExam } = useExam();

  const handleStartExam = () => {
    startExam('65f1a2b3c4d5e6f7a8b9c0d1');
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <PageHeader
        title="My Assigned Exams"
        description="Select and begin one of your currently scheduled adaptive assessments."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card
          className="card animate-in flex flex-col justify-between gap-6 !p-8"
          style={{ animationDelay: '80ms' }}
        >
          <div className="flex flex-col gap-2">
            <span className="bg-mint/10 text-mint border border-mint/20 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider w-fit">
              Assigned Evaluation
            </span>
            <h2 className="text-xl md:text-2xl font-black leading-tight mt-1">
              Full Stack Engineering Evaluation
            </h2>
            <p className="text-sm text-secondary font-medium">
              Take the computer science adaptive evaluation test containing algorithmic and system design questions.
            </p>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex gap-4 text-xs font-semibold text-secondary">
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> 30 Minutes
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" /> Adaptive limit
              </span>
            </div>
            <Button
              onClick={handleStartExam}
              variant="primary"
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4 fill-current" />
              <span>Start Exam</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

const Clock = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export default StudentExams;
