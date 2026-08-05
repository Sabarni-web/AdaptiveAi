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
    <Card className="card animate-in flex flex-col gap-6 !p-8">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 border-b border-hair pb-6">
        <div className="flex flex-col gap-2">
          <Badge variant="default" className="w-fit">Completed Evaluation</Badge>
          <h2 className="text-xl md:text-2xl font-black text-primary leading-tight">
            {examTitle}
          </h2>
          <div className="flex items-center gap-2 text-xs font-semibold text-secondary">
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
        <div className="bg-surface-2 p-5 rounded-2xl border border-hair flex flex-col items-center justify-center text-center gap-2">
          <span className="adaptive-ring">
            <span className="text-3xl font-black text-primary relative z-10">
              {score.total} <span className="text-sm font-semibold text-secondary">/ {score.max}</span>
            </span>
          </span>
          <span className="text-[10px] text-secondary font-bold uppercase tracking-wider">
            Total Marks ({score.percentage}%)
          </span>
        </div>

        {/* Evaluation Grade */}
        <div className="bg-surface-2 p-5 rounded-2xl border border-hair flex flex-col items-center justify-center text-center gap-2">
          <span className="adaptive-ring">
            <Badge variant={getGradeColor(grade)} size="md" className="text-base px-3 py-1 font-black relative z-10">
              {grade}
            </Badge>
          </span>
          <span className="text-[10px] text-secondary font-bold uppercase tracking-wider">
            Assigned Grade
          </span>
        </div>

        {/* Global Percentile */}
        <div className="bg-surface-2 p-5 rounded-2xl border border-hair flex flex-col items-center justify-center text-center gap-2">
          <span className="text-3xl font-black text-primary flex items-center gap-0.5">
            {percentile} <Percent className="h-5 w-5 stroke-[2.5]" />
          </span>
          <span className="text-[10px] text-secondary font-bold uppercase tracking-wider">
            Global Percentile
          </span>
        </div>

        {/* Ability Score */}
        <div className="bg-surface-2 p-5 rounded-2xl border border-hair flex flex-col items-center justify-center text-center gap-2">
          <span className="text-2xl font-black text-primary">
            &theta; = {ability.toFixed(2)}
          </span>
          <span className="text-[10px] text-secondary font-bold uppercase tracking-wider">
            Ability (IRT Score)
          </span>
        </div>
      </div>
    </Card>
  );
};
export default ResultSummary;
