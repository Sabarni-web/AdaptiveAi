import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { GraduationCap, Award, Play, BookOpen } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { DataTable } from '../components/common/DataTable';
import { Button } from '../components/common/Button';
import { useExam } from '../hooks/useExam';
import { TeacherDashboard } from './TeacherDashboard';
import { AdminDashboard } from './AdminDashboard';
import examService from '../services/examService';

export const Dashboard = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const { startExam } = useExam();

  const role = user?.role || 'student';

  const { data: history = [], isLoading } = useQuery({
    queryKey: ['studentHistory'],
    queryFn: examService.getHistory,
    enabled: role === 'student',
  });

  if (role === 'teacher') {
    return <TeacherDashboard />;
  }

  if (role === 'admin') {
    return <AdminDashboard />;
  }

  const handleStartExam = () => {
    // Starts the seeded Full Stack evaluation config
    startExam('65f1a2b3c4d5e6f7a8b9c0d1');
  };

  const columns = [
    { key: 'title', header: 'Exam Title' },
    {
      key: 'score',
      header: 'Score',
      render: (val) => `${val}%`,
    },
    { key: 'grade', header: 'Grade' },
    {
      key: 'completedAt',
      header: 'Completed On',
      render: (val) => new Date(val).toLocaleDateString(),
    },
    {
      key: 'sessionId',
      header: 'Report',
      render: (val) => (
        <Button variant="outline" size="sm" onClick={() => navigate(`/result/${val}`)}>
          View Report
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <PageHeader
        title={`Welcome back, ${user?.name || 'Student'}`}
        description="Select an available evaluation test to start or view past performance certificates."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Start Exam Card */}
        <Card
          className="lg:col-span-2 bg-gradient-to-br from-primary-600 to-indigo-650 text-white border-0 flex flex-col justify-between gap-6 !p-8"
        >
          <div className="flex flex-col gap-2">
            <span className="bg-primary-500/30 text-primary-200 border border-primary-400/20 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider w-fit">
              Assigned Evaluation
            </span>
            <h2 className="text-xl md:text-2xl font-black leading-tight mt-1">
              Full Stack Engineering Evaluation
            </h2>
            <p className="text-sm text-primary-100 max-w-md font-medium">
              Take the computer science adaptive evaluation test containing algorithmic and system design questions.
            </p>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex gap-4 text-xs font-semibold text-primary-200">
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> 30 Minutes
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" /> Adaptive limit
              </span>
            </div>
            <Button
              onClick={handleStartExam}
              className="!bg-white !text-primary-750 hover:!bg-slate-50 flex items-center gap-2 border-0 font-bold"
            >
              <Play className="h-4 w-4 fill-current" />
              <span>Start Exam</span>
            </Button>
          </div>
        </Card>

        {/* Quick Stats Widget */}
        <Card title="Quick Stats" description="Your aggregate progress.">
          <div className="flex flex-col gap-4 mt-2">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Exams Completed</span>
              <span className="text-lg font-black text-slate-800 dark:text-white">{history.length}</span>
            </div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Average Grade</span>
              <span className="text-lg font-black text-slate-800 dark:text-white">B+</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-200">System Standing</span>
              <span className="text-sm font-bold text-green-500">Active</span>
            </div>
          </div>
        </Card>
      </div>

      {/* History Table */}
      <Card title="Evaluation History" description="Access reports and certificate prints from past runs.">
        <DataTable
          columns={columns}
          data={history}
          isLoading={isLoading}
          emptyState={
            <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <GraduationCap className="h-12 w-12 text-slate-500 mb-2" />
              <p className="font-bold">No evaluation history found.</p>
            </div>
          }
        />
      </Card>
    </div>
  );
};

// Simple Clock local mock to prevent import breaks
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

export default Dashboard;
