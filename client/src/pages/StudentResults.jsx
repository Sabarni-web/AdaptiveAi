import React from 'react';
import { useQuery } from '@tanstack/react-query';
import examService from '../services/examService';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { DataTable } from '../components/common/DataTable';
import { CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const StudentResults = () => {
  const navigate = useNavigate();
  const { data: history = [], isLoading } = useQuery({
    queryKey: ['studentHistory'],
    queryFn: examService.getHistory,
  });

  const columns = [
    { header: 'Exam Title', accessor: 'title' },
    {
      header: 'Score',
      accessor: (row) => (
        <span className="font-semibold text-slate-800 dark:text-slate-200">
          {row.score}%
        </span>
      ),
    },
    {
      header: 'Grade',
      accessor: (row) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
          {row.grade}
        </span>
      ),
    },
    {
      header: 'Completed At',
      accessor: (row) => new Date(row.completedAt).toLocaleDateString(),
    },
    {
      header: 'Action',
      accessor: (row) => (
        <button
          onClick={() => navigate(`/result/${row.sessionId}`)}
          className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-semibold transition-colors"
        >
          View Details
        </button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <PageHeader
        title="My Results"
        description="View your past exams, scores, and detailed performance analytics."
      />

      <Card title="Exam History" description="Your recently completed assessments.">
        <DataTable
          columns={columns}
          data={history}
          isLoading={isLoading}
          emptyMessage="You haven't completed any exams yet."
        />
      </Card>
    </div>
  );
};
export default StudentResults;
