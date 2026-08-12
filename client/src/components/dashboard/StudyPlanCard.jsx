import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Target, CheckSquare, Square, ArrowRight, Loader2 } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { studyPlanService } from '../../services/studyPlanService';
import { StudyRoutineModal } from '../study-plan/StudyRoutineModal';
import { motion } from 'framer-motion';

export const StudyPlanCard = () => {
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: planData, isLoading, error, refetch } = useQuery({
    queryKey: ['todayStudyPlan'],
    queryFn: studyPlanService.getTodayPlan
  });

  const dailyGoal = settings?.study?.dailyStudyGoal || '30 minutes';

  if (isLoading) {
    return (
      <Card title={
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          <span>TODAY'S STUDY PLAN</span>
        </div>
      } className="h-full flex flex-col justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary opacity-50" />
        <span className="text-sm text-text-secondary mt-2">Analyzing your recent performance...</span>
      </Card>
    );
  }

  if (error || !planData?.success) {
    return (
      <Card title={
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          <span>TODAY'S STUDY PLAN</span>
        </div>
      } className="h-full flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
          <p className="text-sm text-text-secondary mb-4">Unable to generate your study plan right now. Please try again.</p>
          <Button onClick={() => refetch()} variant="outline" size="sm">Retry</Button>
        </div>
      </Card>
    );
  }

  if (planData.needsData) {
    return (
      <Card title={
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          <span>BUILD YOUR FIRST STUDY PLAN</span>
        </div>
      } className="h-full flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4 gap-4">
          <p className="text-sm text-text-secondary">
            We need some exam performance data before we can personalize your routine.
          </p>
          <Button onClick={() => navigate('/exams')} className="w-full">
            Take an Exam
          </Button>
        </div>
      </Card>
    );
  }

  const { plan } = planData;
  const progressPercent = plan.totalMinutes > 0 ? Math.round((plan.completedMinutes / plan.totalMinutes) * 100) : 0;

  const priorityWeight = { high: 3, medium: 2, low: 1, HIGH: 3, MEDIUM: 2, LOW: 1 };
  
  const getTaskPriority = (task) => {
    if (task.priority) return task.priority;
    if (task.durationMinutes >= 10) return 'high';
    if (task.durationMinutes >= 7) return 'medium';
    return 'low';
  };

  const sortedTasks = [...plan.tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    const pA = priorityWeight[getTaskPriority(a).toLowerCase()] || 0;
    const pB = priorityWeight[getTaskPriority(b).toLowerCase()] || 0;
    return pB - pA;
  });

  const getPriorityBadge = (task) => {
    if (task.completed) return null;
    const p = getTaskPriority(task).toLowerCase();
    if (p === 'high') return <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider shrink-0 ml-2">High</span>;
    if (p === 'medium') return <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 px-1.5 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider shrink-0 ml-2">Medium</span>;
    if (p === 'low') return <span className="bg-green-500/20 text-green-400 border border-green-500/30 px-1.5 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider shrink-0 ml-2">Low</span>;
    return null;
  };

  return (
    <>
      <Card 
        title={
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <span>TODAY'S STUDY PLAN</span>
          </div>
        } 
        className="h-full flex flex-col"
      >
        <div className="flex flex-col h-full gap-4 mt-2">
          <div className="text-sm font-medium text-text-secondary">
            Goal: <span className="text-primary font-bold">{plan.goalMinutes} minutes</span>
          </div>
          
          <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
            {sortedTasks.map((task, index) => (
              <div key={index} className="flex items-center justify-between group cursor-pointer hover:bg-surface/50 p-2 -mx-2 rounded transition-colors" onClick={() => setIsModalOpen(true)}>
                <div className="flex items-center gap-3 truncate mr-2">
                  <span className={`text-sm font-medium truncate flex items-center ${task.completed ? 'text-text-secondary line-through opacity-70' : 'text-text-primary'}`}>
                    {task.title}
                    {getPriorityBadge(task)}
                  </span>
                </div>
                <span className="text-xs text-text-secondary whitespace-nowrap">{task.durationMinutes} min</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-hair">
            <div className="flex items-center justify-between text-xs text-text-secondary">
              <span>Progress</span>
              <span className="text-primary font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-1000 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            
            <Button 
              className="w-full mt-3 group" 
              variant="outline" 
              onClick={() => setIsModalOpen(true)}
            >
              Continue Plan
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </Card>

      {isModalOpen && (
        <StudyRoutineModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          planData={planData} 
          refetchPlan={refetch}
        />
      )}
    </>
  );
};
