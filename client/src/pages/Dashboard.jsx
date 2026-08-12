import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { GraduationCap, Award, Play, BookOpen, Flame } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { DataTable } from '../components/common/DataTable';
import { Button } from '../components/common/Button';
import { useExam } from '../hooks/useExam';
import { TeacherDashboard } from './TeacherDashboard';
import { AdminDashboard } from './AdminDashboard';
import examService from '../services/examService';
import { RecommendationCard } from '../components/dashboard/RecommendationCard';
import { DailyChallengeCard } from '../components/dashboard/DailyChallengeCard';
import { FloatingTutor } from '../components/tutor/FloatingTutor';
import apiClient from '../services/apiClient';
import { StudyPlanCard } from '../components/dashboard/StudyPlanCard';
import { PerformanceTrendContent } from '../components/dashboard/PerformanceTrendCard';
import { AiBrainVisualization } from '../components/dashboard/AiBrainVisualization';

export const Dashboard = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const { startExam } = useExam();
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const role = user?.role || 'student';

  const { data: history = [], isLoading } = useQuery({
    queryKey: ['studentHistory'],
    queryFn: examService.getHistory,
    enabled: role === 'student',
  });

  const { data: challengeData } = useQuery({
    queryKey: ['dailyChallengeToday'],
    queryFn: async () => {
      const res = await apiClient.get('/daily-challenge/today');
      return res.data;
    },
    enabled: role === 'student',
  });
  
  const currentStreak = challengeData?.currentStreak || 0;

  if (role === 'teacher') {
    return <TeacherDashboard />;
  }

  if (role === 'admin') {
    return <AdminDashboard />;
  }

  const handleStartExam = () => {
    // Starts the seeded Full Stack evaluation config
    startExam('65f1a2b3c4d5e6f7a8b9c0d1', selectedLanguage);
  };

  const getAverageGrade = () => {
    if (!history || history.length === 0) return 'N/A';
    const total = history.reduce((acc, curr) => acc + (curr.score || 0), 0);
    const avg = total / history.length;
    if (avg >= 90) return 'A';
    if (avg >= 80) return 'B';
    if (avg >= 70) return 'C';
    if (avg >= 60) return 'D';
    return 'F';
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
        title={
          <div className="flex items-center gap-3">
            <span>Welcome back, {user?.name || 'Student'}</span>
            {currentStreak > 0 && (
              <div className="flex items-center gap-1.5 text-orange-400 text-sm md:text-lg bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20 shadow-[0_0_10px_rgba(249,115,22,0.2)]">
                <Flame className="w-5 h-5 md:w-6 md:h-6 fill-orange-400" />
                <span>{currentStreak} Day Streak</span>
              </div>
            )}
          </div>
        }
        description="Select an available evaluation test to start or view past performance certificates."
      />

      {/* TOP ROW: Daily Challenge & AI Brain Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_0.65fr] gap-8 items-stretch">
        <DailyChallengeCard />
        <AiBrainVisualization />
      </div>

      {/* SECOND ROW: AI Recommendation */}
      <div className="grid grid-cols-1 gap-8">
        <RecommendationCard />
      </div>

      {/* SECOND ROW: Quick Stats (Left) | Study Plan + Trend (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT: Quick Stats */}
        <div className="lg:col-span-1">
          <Card title="Quick Stats" description="Your aggregate progress." className="h-full">
            <div className="flex flex-col gap-4 mt-2">
              <div className="flex items-center justify-between pb-3 border-b border-hair">
                <span className="text-sm font-bold text-primary">Exams Completed</span>
                <span className="adaptive-ring"><span className="text-lg font-black text-primary relative z-10">{history.length}</span></span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-hair">
                <span className="text-sm font-bold text-primary">Average Grade</span>
                <span className="adaptive-ring"><span className="text-lg font-black text-primary relative z-10">{getAverageGrade()}</span></span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-primary">System Standing</span>
                <span className="text-sm font-bold text-green-500">Active</span>
              </div>
            </div>
          </Card>
        </div>

        {/* RIGHT: New Content Area */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
          <StudyPlanCard />
          <PerformanceTrendContent history={history} />
        </div>
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
      
      <FloatingTutor />
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
