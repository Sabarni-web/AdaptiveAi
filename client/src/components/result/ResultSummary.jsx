import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, Share2, Download, Calendar, Percent } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export const ResultSummary = ({
  score = { total: 0, max: 100, percentage: 0 },
  grade = 'N/A',
  percentile = 0,
  ability = 0.0,
  confidenceInterval = [0, 0],
  examTitle = 'Evaluation Session',
  completedAt,
  onShare,
  onDownload,
}) => {
  useEffect(() => {
    if (score.percentage >= 60) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [score]);

  const getGradeColor = (g) => {
    switch (g.toUpperCase()) {
      case 'A':
      case 'S':
        return 'success';
      case 'B':
      case 'C':
        return 'info';
      case 'D':
        return 'warning';
      default:
        return 'danger';
    }
  };

  return (
    <Card className="flex flex-col gap-6 !p-8 border-slate-200 dark:border-slate-800">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 border-b border-slate-100 dark:border-slate-700/60 pb-6">
        <div className="flex flex-col gap-2">
          <Badge variant="default" className="w-fit">Completed Evaluation</Badge>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-tight">
            {examTitle}
          </h2>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Calendar className="h-4 w-4" />
            <span>Completed on {new Date(completedAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={onShare} className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            <span>Share Result</span>
          </Button>
          <Button variant="primary" size="sm" onClick={onDownload} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span>Download Certificate</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Core Percentage Score */}
        <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/50 flex flex-col items-center justify-center text-center gap-2">
          <span className="text-3xl font-black text-slate-900 dark:text-white">
            {score.total} <span className="text-sm font-semibold text-slate-400">/ {score.max}</span>
          </span>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Total Marks ({score.percentage}%)
          </span>
        </div>

        {/* Evaluation Grade */}
        <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/50 flex flex-col items-center justify-center text-center gap-2">
          <Badge variant={getGradeColor(grade)} size="md" className="text-base px-3 py-1 font-black">
            {grade}
          </Badge>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Assigned Grade
          </span>
        </div>

        {/* Global Percentile */}
        <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/50 flex flex-col items-center justify-center text-center gap-2">
          <span className="text-3xl font-black text-primary-600 dark:text-primary-400 flex items-center gap-0.5">
            {percentile} <Percent className="h-5 w-5 stroke-[2.5]" />
          </span>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Global Percentile
          </span>
        </div>

        {/* Ability Score */}
        <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/50 flex flex-col items-center justify-center text-center gap-2">
          <span className="text-2xl font-black text-indigo-650 dark:text-indigo-400">
            &theta; = {ability.toFixed(2)}
          </span>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Ability (IRT Score)
          </span>
        </div>
      </div>
    </Card>
  );
};
export default ResultSummary;
