import React from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Target, CheckSquare, Square, ArrowRight } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import { useNavigate } from 'react-router-dom';

export const StudyPlanCard = () => {
  const { settings } = useSettings();
  const navigate = useNavigate();

  // Determine user preferences or fallback to defaults
  const dailyGoal = settings?.study?.dailyStudyGoal || '30 minutes';
  
  // Calculate mock tasks (could be connected to real challenge status)
  // Assuming total goal is mapped to numbers roughly
  const minutes = parseInt(dailyGoal) || 30;
  const challengeTime = Math.round(minutes * 0.2) || 5;
  const weakSubjectTime = Math.round(minutes * 0.5) || 15;
  const practiceTime = Math.round(minutes * 0.3) || 10;
  
  // Hardcoded progress for now, could be derived from gamification streak or today's xp
  const progressPercent = 40;

  return (
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
          Goal: <span className="text-primary font-bold">{dailyGoal}</span>
        </div>
        
        <div className="flex flex-col gap-3 flex-1">
          <div className="flex items-center justify-between group cursor-pointer hover:bg-surface/50 p-2 -mx-2 rounded transition-colors">
            <div className="flex items-center gap-3">
              <CheckSquare className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-text-primary line-through opacity-70">Daily Challenge</span>
            </div>
            <span className="text-xs text-text-secondary">{challengeTime} min</span>
          </div>
          
          <div className="flex items-center justify-between group cursor-pointer hover:bg-surface/50 p-2 -mx-2 rounded transition-colors">
            <div className="flex items-center gap-3">
              <Square className="h-5 w-5 text-text-secondary group-hover:text-primary transition-colors" />
              <span className="text-sm font-medium text-text-primary">Weak Subject</span>
            </div>
            <span className="text-xs text-text-secondary">{weakSubjectTime} min</span>
          </div>
          
          <div className="flex items-center justify-between group cursor-pointer hover:bg-surface/50 p-2 -mx-2 rounded transition-colors">
            <div className="flex items-center gap-3">
              <Square className="h-5 w-5 text-text-secondary group-hover:text-primary transition-colors" />
              <span className="text-sm font-medium text-text-primary">Practice</span>
            </div>
            <span className="text-xs text-text-secondary">{practiceTime} min</span>
          </div>
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
            onClick={() => navigate('/daily-challenge')}
          >
            Continue Plan
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
