import { Request, Response } from 'express';
import { User } from '../models/User';
import { ExamSession } from '../models/ExamSession';
import { Result } from '../models/Result';
import { logger } from '../utils/logger';
import mongoose from 'mongoose';

export const getIntelligenceProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId || (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    // 1. Fetch User Data
    const user = await User.findById(userId).select('-password');
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    // 2. Fetch Exam Sessions and Results
    const completedSessions = await ExamSession.find({ studentId: userId, status: 'completed' }).sort({ completedAt: -1 });
    const results = await Result.find({ studentId: userId }).populate('examConfigId');

    // 3. Quick Stats Calculation
    const totalExams = completedSessions.length;
    let totalScore = 0;
    let totalQuestions = 0;
    let bestScore = 0;
    let currentStreak = 0;

    results.forEach(result => {
      totalScore += result.score;
      totalQuestions += result.maxScore;
      if (result.score > bestScore) bestScore = result.score;
    });

    const averageScore = totalExams > 0 ? Math.round(totalScore / totalExams) : 0;

    // Calculate Streak (naive implementation: count consecutive days)
    if (completedSessions.length > 0) {
      let streak = 1;
      let lastDate = new Date(completedSessions[0].completedAt as Date);
      lastDate.setHours(0, 0, 0, 0);

      for (let i = 1; i < completedSessions.length; i++) {
        const currentDate = new Date(completedSessions[i].completedAt as Date);
        currentDate.setHours(0, 0, 0, 0);
        const diffTime = Math.abs(lastDate.getTime() - currentDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          streak++;
          lastDate = currentDate;
        } else if (diffDays > 1) {
          break;
        }
      }
      currentStreak = streak;
    }

    // 4. Domain Performance
    const domainScores: Record<string, { totalScore: number; count: number }> = {};
    
    results.forEach(result => {
      // Mocking domain classification based on subject/exam title for now
      const subject = (result as any).subjectName || 'CSE Core'; 
      if (!domainScores[subject]) {
        domainScores[subject] = { totalScore: 0, count: 0 };
      }
      domainScores[subject].totalScore += result.score;
      domainScores[subject].count += 1;
    });

    const domains = Object.keys(domainScores).map(domain => ({
      name: domain,
      average: Math.round(domainScores[domain].totalScore / domainScores[domain].count)
    }));

    // 5. Strengths & Weaknesses
    const sortedDomains = [...domains].sort((a, b) => b.average - a.average);
    const strengths = sortedDomains.slice(0, 3).filter(d => d.average >= 70).map(d => d.name);
    const weaknesses = sortedDomains.slice(-2).filter(d => d.average < 70).map(d => d.name);

    // 6. Learning DNA
    const conceptualUnderstanding = averageScore > 0 ? averageScore : 0;
    const problemSolving = averageScore > 0 ? Math.min(100, averageScore + 5) : 0;
    const consistency = totalExams > 2 ? Math.min(100, 50 + (currentStreak * 5)) : 0;
    const speed = 75; // Mock for now
    const accuracy = totalQuestions > 0 ? Math.round((totalScore / (totalExams * 100)) * 100) : 0; // Rough mock
    const retention = averageScore > 0 ? Math.min(100, averageScore + Math.floor(Math.random() * 10)) : 0;

    const learningDNA = {
      conceptualUnderstanding,
      problemSolving,
      accuracy: averageScore, 
      speed,
      consistency,
      retention
    };

    // 7. Achievements
    const achievements = [];
    if (totalExams >= 10) achievements.push('Exam Master');
    if (averageScore >= 90) achievements.push('Accuracy Master');
    if (currentStreak >= 3) achievements.push('Consistent Learner');
    if (domains.length >= 3) achievements.push('CSE Explorer');

    // 8. Recent Activity
    const recentActivity = completedSessions.slice(0, 3).map(session => {
      const relatedResult = results.find(r => r.sessionId?.toString() === session._id.toString());
      return {
        id: session._id,
        title: 'Completed Assessment',
        date: session.completedAt,
        score: relatedResult ? relatedResult.score : 'N/A'
      };
    });

    res.status(200).json({
      success: true,
      data: {
        user,
        stats: {
          totalExams,
          averageScore,
          totalQuestions,
          currentStreak: user.gamification?.currentStreak || currentStreak, // Prefer gamification streak
          bestScore,
          certificates: 0, // Mock for now
          xp: user.gamification?.xp || 0,
          longestStreak: user.gamification?.longestStreak || 0,
          totalDailyChallenges: user.gamification?.totalChallengesCompleted || 0
        },
        domains,
        strengths,
        weaknesses,
        learningDNA,
        achievements,
        recentActivity
      }
    });

  } catch (error: any) {
    logger.error('Error fetching intelligence profile:', error);
    require('fs').writeFileSync('profile_error.txt', error.stack || error.message || String(error));
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId || (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { name, academicInfo, learningPreferences } = req.body;

    const updateData: any = {};
    if (name) updateData.name = name;
    if (academicInfo) updateData.academicInfo = academicInfo;
    if (learningPreferences) updateData.learningPreferences = learningPreferences;

    const user = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true }).select('-password');
    
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    logger.error('Error updating profile:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
