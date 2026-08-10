import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Award, Zap, Target, Book, Brain, Activity, BookOpen, Clock, Settings, Edit3, X, Check } from 'lucide-react';
import { Card } from '../common/Card';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

// Utility for formatting dates
const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

// 1. Profile Hero
export const ProfileHero = ({ user, stats }) => {
  const completion = user.academicInfo ? 80 : 40; // Mock calculation
  const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-surface to-surface-2 border-hair">
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-mint/20 to-teal-500/20" />
      <div className="relative pt-16 px-6 pb-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
        
        <div className="w-24 h-24 rounded-full border-4 border-surface bg-gradient-to-tr from-mint to-teal-500 flex items-center justify-center text-dark-eval text-3xl font-bold shadow-xl shrink-0">
          {initials}
        </div>
        
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white mb-1">{user.name}</h1>
          <p className="text-secondary mb-3">{user.email} • {user.role === 'student' ? 'CSE Student & AdaptiveAI Learner' : user.role}</p>
          
          <div className="w-full max-w-md">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-secondary">Profile Completion</span>
              <span className="text-mint">{completion}%</span>
            </div>
            <div className="w-full bg-hair rounded-full h-1.5">
              <div className="bg-mint h-1.5 rounded-full transition-all duration-1000" style={{ width: `${completion}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 px-6 pb-6 border-t border-hair pt-6 mt-2">
        {[
          { label: 'Exams', value: stats.totalExams, icon: BookOpen },
          { label: 'Avg Score', value: `${stats.averageScore}%`, icon: Target },
          { label: 'Questions', value: stats.totalQuestions, icon: Brain },
          { label: 'Streak', value: `${stats.currentStreak} Days`, icon: Zap },
          { label: 'Best Score', value: `${stats.bestScore}%`, icon: Award },
        ].map((stat, i) => (
          <div key={i} className="flex flex-col">
            <div className="flex items-center gap-1.5 text-secondary text-xs mb-1">
              <stat.icon size={14} /> {stat.label}
            </div>
            <span className="text-xl font-bold text-white">{stat.value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

// 2. CSE Domain Performance
export const DomainPerformance = ({ domains }) => {
  if (!domains || domains.length === 0) {
    return (
      <Card title="CSE Domain Performance" description="Track your skill levels across different domains.">
        <div className="py-8 text-center text-secondary">
          <p>No assessment data yet.</p>
          <p className="text-sm mt-1">Domain insights will appear after you complete assessments.</p>
        </div>
      </Card>
    );
  }

  const getStatus = (score) => {
    if (score >= 85) return { label: 'Excellent', color: 'bg-green-500' };
    if (score >= 70) return { label: 'Strong', color: 'bg-mint' };
    if (score >= 50) return { label: 'Developing', color: 'bg-amber-soft' };
    return { label: 'Needs Attention', color: 'bg-red-soft' };
  };

  return (
    <Card title="CSE Domain Performance" description="Track your skill levels across different domains.">
      <div className="flex flex-col gap-5 mt-4">
        {domains.map((domain, i) => {
          const status = getStatus(domain.average);
          return (
            <div key={i}>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-sm font-medium text-white">{domain.name}</span>
                <span className="text-sm font-bold text-white">{domain.average}%</span>
              </div>
              <div className="w-full bg-hair rounded-full h-2 mb-1.5">
                <motion.div 
                  initial={{ width: 0 }} animate={{ width: `${domain.average}%` }} transition={{ duration: 1, delay: i * 0.1 }}
                  className={`h-2 rounded-full ${status.color}`} 
                />
              </div>
              <div className="text-xs text-secondary">{status.label}</div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

// 3. Strengths and Weaknesses
export const StrengthsWeaknesses = ({ strengths, weaknesses }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card title="Your Strengths" description="Areas where you excel.">
        <div className="mt-4 flex flex-col gap-2">
          {strengths?.length > 0 ? strengths.map((s, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-white bg-green-500/10 border border-green-500/20 p-2.5 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-green-500" /> {s}
            </div>
          )) : <p className="text-sm text-secondary">Complete assessments to unlock insights.</p>}
        </div>
      </Card>
      
      <Card title="Needs Attention" description="Areas to focus your revision.">
        <div className="mt-4 flex flex-col gap-2">
          {weaknesses?.length > 0 ? weaknesses.map((w, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-white bg-red-soft/10 border border-red-soft/20 p-2.5 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-red-soft" /> {w}
            </div>
          )) : <p className="text-sm text-secondary">Complete assessments to unlock insights.</p>}
        </div>
      </Card>
    </div>
  );
};

// 4. Learning DNA
export const LearningDNA = ({ dna }) => {
  if (!dna || Object.keys(dna).length === 0) return null;

  const metrics = [
    { label: 'Conceptual Understanding', value: dna.conceptualUnderstanding, color: 'bg-blue-500' },
    { label: 'Problem Solving', value: dna.problemSolving, color: 'bg-purple-500' },
    { label: 'Accuracy', value: dna.accuracy, color: 'bg-mint' },
    { label: 'Speed', value: dna.speed, color: 'bg-amber-soft' },
    { label: 'Consistency', value: dna.consistency, color: 'bg-pink-500' },
    { label: 'Retention', value: dna.retention, color: 'bg-teal-500' }
  ];

  return (
    <Card 
      title={<div className="flex items-center gap-2"><Brain size={18} className="text-mint" /> 🧬 Your Learning DNA</div>} 
      description="AI-generated learning profile based on your AdaptiveAI activity."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mt-6">
        {metrics.map((m, i) => (
          <div key={i}>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-gray-300">{m.label}</span>
              <span className="font-bold text-white">{m.value}%</span>
            </div>
            <div className="w-full bg-hair rounded-full h-1.5">
              <motion.div 
                initial={{ width: 0 }} animate={{ width: `${m.value}%` }} transition={{ duration: 1.5, delay: i * 0.1 }}
                className={`h-1.5 rounded-full ${m.color}`} 
              />
            </div>
          </div>
        ))}
      </div>
      
      {dna.problemSolving > 80 && (
        <div className="mt-6 p-4 bg-mint/5 border border-mint/20 rounded-xl">
          <div className="flex items-center gap-2 text-mint font-semibold text-sm mb-1">
            <Zap size={14} /> Learning Insight
          </div>
          <p className="text-xs text-secondary leading-relaxed">
            You demonstrate strong problem-solving performance. Your high accuracy indicates solid conceptual foundations. Keep challenging yourself with harder Adaptive difficulty levels!
          </p>
        </div>
      )}
    </Card>
  );
};

// 5. Achievements & Activity
export const Achievements = ({ achievements }) => {
  const availableAchievements = [
    { id: 'Exam Master', icon: Award, desc: 'Completed 10 exams' },
    { id: 'Accuracy Master', icon: Target, desc: 'Achieved 90%+ accuracy' },
    { id: 'Consistent Learner', icon: Zap, desc: 'Maintained a streak' },
    { id: 'CSE Explorer', icon: Book, desc: 'Practiced multiple domains' }
  ];

  return (
    <Card title="🏆 Achievements" description="Badges earned through your performance.">
      <div className="flex flex-col gap-3 mt-4">
        {availableAchievements.map((ach, i) => {
          const earned = achievements?.includes(ach.id);
          return (
            <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border ${earned ? 'bg-surface-2 border-mint/20' : 'bg-transparent border-hair opacity-50'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${earned ? 'bg-mint/10 text-mint' : 'bg-hair text-gray-500'}`}>
                <ach.icon size={18} />
              </div>
              <div>
                <h4 className={`text-sm font-semibold ${earned ? 'text-white' : 'text-gray-400'}`}>{ach.id}</h4>
                <p className="text-xs text-secondary">{ach.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export const RecentActivity = ({ activity }) => {
  return (
    <Card title="📈 Recent Learning Activity" description="Your latest interactions on the platform.">
      <div className="flex flex-col gap-4 mt-4 relative">
        <div className="absolute left-4 top-2 bottom-2 w-[1px] bg-hair"></div>
        {activity?.length > 0 ? activity.map((act, i) => (
          <div key={i} className="flex gap-4 relative z-10">
            <div className="w-8 h-8 rounded-full bg-surface-2 border border-hair flex items-center justify-center shrink-0 text-mint mt-1">
              <Activity size={14} />
            </div>
            <div className="bg-surface-2 border border-hair rounded-xl p-3 flex-1">
              <h4 className="text-sm font-semibold text-white">{act.title}</h4>
              <div className="flex justify-between items-center mt-1 text-xs text-secondary">
                <span>Score: {act.score}%</span>
                <span>{formatDate(act.date)}</span>
              </div>
            </div>
          </div>
        )) : (
          <p className="text-sm text-secondary pl-12">Take your first exam to see activity.</p>
        )}
      </div>
    </Card>
  );
};

// 6. Editable Sections Wrapper
export const EditableSection = ({ title, children, isEditing, onToggleEdit, onSave, icon: Icon }) => (
  <Card>
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2 text-lg font-semibold text-white">
        {Icon && <Icon size={20} className="text-mint" />} {title}
      </div>
      {!isEditing ? (
        <Button variant="outline" size="sm" onClick={onToggleEdit} className="gap-1">
          <Edit3 size={14} /> Edit
        </Button>
      ) : (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onToggleEdit} className="gap-1 border-red-500/20 text-red-400 hover:bg-red-500/10">
            <X size={14} /> Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={onSave} className="gap-1">
            <Check size={14} /> Save
          </Button>
        </div>
      )}
    </div>
    {children}
  </Card>
);
