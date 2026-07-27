import React from 'react';
import { useQuery } from '@tanstack/react-query';
import teacherService from '../services/teacherService';
import { StatCard } from '../components/analytics/StatCard';
import { RadarChart } from '../components/analytics/RadarChart';
import { GradeDistribution } from '../components/analytics/GradeDistribution';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { Loader } from '../components/common/Loader';
import { GraduationCap, Users, Clock, AlertCircle } from 'lucide-react';

export const TeacherDashboard = () => {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['teacherStats'],
    queryFn: teacherService.getStats,
  });

  if (statsLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader size="lg" text="Loading dashboard metrics..." />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <PageHeader
        title="Teacher Dashboard"
        description="Overview of current courses, students progress, and manual grading queues."
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Exams"
          value={stats?.activeExams || 0}
          trend="up"
          change={12}
          changeLabel="vs last week"
          icon={<GraduationCap className="h-5 w-5" />}
          color="bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
        />
        <StatCard
          title="Total Evaluated Students"
          value={stats?.totalStudents || 0}
          trend="up"
          change={8}
          changeLabel="vs last month"
          icon={<Users className="h-5 w-5" />}
          color="bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400"
        />
        <StatCard
          title="Pending Grade Reviews"
          value={stats?.pendingGrades || 0}
          trend="down"
          change={20}
          changeLabel="completed today"
          icon={<AlertCircle className="h-5 w-5" />}
          color="bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400"
        />
        <StatCard
          title="Avg Completion Time"
          value={stats?.avgCompletionTime || '0m'}
          trend="neutral"
          change={0}
          changeLabel="consistent pace"
          icon={<Clock className="h-5 w-5" />}
          color="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RadarChart
          data={[
            { skill: 'Recursion', score: 85 },
            { skill: 'Normalization', score: 72 },
            { skill: 'Concurrency', score: 55 },
            { skill: 'System Design', score: 40 },
            { skill: 'Data Structures', score: 90 },
          ]}
          compareData={[
            { skill: 'Recursion', score: 70 },
            { skill: 'Normalization', score: 65 },
            { skill: 'Concurrency', score: 60 },
            { skill: 'System Design', score: 50 },
            { skill: 'Data Structures', score: 75 },
          ]}
        />
        <GradeDistribution distribution={{ A: 45, B: 30, C: 15, D: 8, F: 4 }} />
      </div>
    </div>
  );
};
export default TeacherDashboard;
