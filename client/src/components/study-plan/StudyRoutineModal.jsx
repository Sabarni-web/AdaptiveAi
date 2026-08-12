import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, BarChart2, AlertTriangle, BookOpen, CheckSquare, Square, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Button } from '../common/Button';
import { useNavigate } from 'react-router-dom';
import { StudyTaskRunner } from './StudyTaskRunner';

export const StudyRoutineModal = ({ isOpen, onClose, planData, refetchPlan }) => {
  const navigate = useNavigate();
  const [activeTask, setActiveTask] = useState(null);

  if (!isOpen || !planData?.plan) return null;

  const { plan, stats } = planData;
  const topPriorityTask = plan.tasks.find(t => t.type === 'practice' && !t.completed);
  const isCompleted = plan.completedMinutes >= plan.totalMinutes;

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

  const handleStartTask = (task) => {
    if (task.type === 'daily_challenge') {
      onClose();
      navigate('/daily-challenge');
    } else {
      setActiveTask(task);
    }
  };

  const getPriorityBadge = (task) => {
    if (task.completed) return null;
    const p = getTaskPriority(task).toLowerCase();
    if (p === 'high') return <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider shrink-0 mt-0.5">High Priority</span>;
    if (p === 'medium') return <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider shrink-0 mt-0.5">Medium Priority</span>;
    if (p === 'low') return <span className="bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider shrink-0 mt-0.5">Low Priority</span>;
    return null;
  };

  const handleTaskFinish = () => {
    setActiveTask(null);
    refetchPlan();
  };

  const TrendIcon = stats.trend === 'Improving' ? TrendingUp : stats.trend === 'Declining' ? TrendingDown : Minus;
  const trendColor = stats.trend === 'Improving' ? 'text-green-500' : stats.trend === 'Declining' ? 'text-red-500' : 'text-text-secondary';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-surface border border-hair rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {activeTask ? (
            <StudyTaskRunner 
              planId={plan._id} 
              task={activeTask} 
              onFinish={handleTaskFinish} 
              onBack={() => setActiveTask(null)}
            />
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-hair">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Target className="text-primary" />
                    YOUR PERSONALIZED STUDY ROUTINE
                  </h2>
                  <p className="text-sm text-text-secondary mt-1">Built from your recent {stats.examCount} exams</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-text-secondary" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6">
                
                {isCompleted ? (
                  <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 text-center">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckSquare className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-primary mb-2">🎉 STUDY PLAN COMPLETED!</h3>
                    <p className="text-text-secondary mb-4">You completed today's personalized routine.</p>
                    <div className="inline-block bg-surface px-4 py-2 rounded-lg font-mono text-xl font-bold text-text-primary">
                      {plan.completedMinutes} / {plan.totalMinutes} minutes
                    </div>
                    <p className="text-primary mt-4 font-medium">🔥 Great work!</p>
                  </div>
                ) : (
                  <>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-surface-lighter rounded-xl p-4 border border-hair">
                        <div className="flex items-center gap-2 text-sm text-text-secondary mb-2">
                          <BarChart2 className="w-4 h-4" /> Average
                        </div>
                        <div className="text-2xl font-bold">{stats.averageScore}%</div>
                      </div>
                      <div className="bg-surface-lighter rounded-xl p-4 border border-hair">
                        <div className="flex items-center gap-2 text-sm text-text-secondary mb-2">
                          <Target className="w-4 h-4" /> Latest
                        </div>
                        <div className="text-2xl font-bold">{stats.latestScore}%</div>
                      </div>
                      <div className="bg-surface-lighter rounded-xl p-4 border border-hair">
                        <div className="flex items-center gap-2 text-sm text-text-secondary mb-2">
                          <TrendIcon className={`w-4 h-4 ${trendColor}`} /> Trend
                        </div>
                        <div className={`text-xl font-bold ${trendColor}`}>{stats.trend}</div>
                      </div>
                    </div>



                    {/* Today's Plan List */}
                    <div>
                      <h3 className="font-bold flex items-center gap-2 mb-4 text-text-primary">
                        <BookOpen className="w-5 h-5 text-primary" />
                        TODAY'S PLAN
                      </h3>
                      <div className="space-y-3">
                        {sortedTasks.map((task) => (
                          <div key={task._id} className={`flex items-center justify-between p-4 rounded-xl border ${task.completed ? 'bg-surface-lighter/50 border-hair/50' : 'bg-surface-lighter border-hair hover:border-primary/50 transition-colors'}`}>
                            <div className="flex items-start gap-3">
                              <div>
                                <div className="flex items-center gap-3">
                                  <div className={`font-medium ${task.completed ? 'text-text-secondary line-through' : 'text-text-primary'}`}>
                                    {task.title}
                                  </div>
                                  {getPriorityBadge(task)}
                                </div>
                                {task.topic && (
                                  <div className={`text-sm mt-1 ${task.completed ? 'text-text-secondary/50' : 'text-text-secondary'}`}>
                                    {task.topic}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2 shrink-0">
                              <span className="text-sm font-medium text-text-secondary">{task.durationMinutes} minutes</span>
                              {!task.completed && (
                                <Button size="sm" variant="outline" className="h-8 text-xs px-3" onClick={() => handleStartTask(task)}>
                                  Start
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Footer Progress */}
              <div className="p-6 border-t border-hair bg-surface-lighter">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-text-secondary">Overall Progress</span>
                  <span className="font-bold text-primary">{Math.round((plan.completedMinutes / plan.totalMinutes) * 100)}%</span>
                </div>
                <div className="w-full h-3 bg-surface rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-1000 ease-out relative overflow-hidden"
                    style={{ width: `${Math.round((plan.completedMinutes / plan.totalMinutes) * 100)}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 w-full animate-shimmer" style={{
                      backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)'
                    }} />
                  </div>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
