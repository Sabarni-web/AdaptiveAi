import { Request, Response, NextFunction } from 'express';
import { analyticsClient } from '../services/analyticsClient';

export class AnalyticsController {
  async predictPerformance(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = req.body;
      const result = await analyticsClient.predictPerformance(data);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async recommendStudy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = req.body;
      const result = await analyticsClient.recommendStudy(data);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
  async getSelfImprovementData(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const studentId = (req as any).user?.userId || (req as any).user?.id || (req as any).user?._id;
      const { ExamSession } = await import('../models/ExamSession');
      
      const sessions = await ExamSession.find({ studentId, status: 'completed' })
        .sort({ completedAt: 1 })
        .exec();

      if (sessions.length === 0) {
        res.status(200).json({ success: true, data: { empty: true } });
        return;
      }

      const recentProgress = sessions.slice(-5).map(s => ({
        title: s.examConfigId ? `Exam ${s.subject}` : s.subject,
        score: s.percentage || 0,
        date: s.completedAt
      }));

      const overallProgress = Math.round(
        sessions.reduce((acc, s) => acc + (s.percentage || 0), 0) / sessions.length
      );

      let weeklyImprovement = 0;
      if (sessions.length >= 2) {
        const last = sessions[sessions.length - 1].percentage || 0;
        const prev = sessions[sessions.length - 2].percentage || 0;
        weeklyImprovement = Math.round(last - prev);
      }

      // Calculate subject performance keeping history
      const subjectHistory: Record<string, any[]> = {};
      sessions.forEach(s => {
        if (!subjectHistory[s.subject]) {
          subjectHistory[s.subject] = [];
        }
        subjectHistory[s.subject].push({
          score: s.percentage || 0,
          date: s.completedAt,
          examName: s.examConfigId ? `Exam ${s.subject}` : s.subject
        });
      });

      const topicScores = Object.entries(subjectHistory).map(([name, history]) => {
        // history is already sorted by date because sessions are sorted by completedAt: 1
        const latest = history[history.length - 1];
        const previous = history.length > 1 ? history[history.length - 2] : null;
        
        const currentScore = Math.round(latest.score);
        const previousScore = previous ? Math.round(previous.score) : null;
        
        let change = 0;
        let trend = 'NEW';
        
        if (previousScore !== null) {
          change = currentScore - previousScore;
          if (change > 0) trend = 'UP';
          else if (change < 0) trend = 'DOWN';
          else trend = 'STABLE';
        }

        return {
          topic: name,
          score: currentScore, // alias for currentScore to maintain compatibility
          currentScore,
          previousScore,
          change,
          trend,
          examCount: history.length,
          latestExam: latest.examName,
          lastAttempt: latest.date
        };
      }).sort((a, b) => b.score - a.score); // sort highest to lowest for insight generation

      const strongestSkill = topicScores.length > 0 ? topicScores[0] : null;
      let needsAttention = null;

      if (topicScores.length > 1) {
        // Find the one with the biggest negative drop, or just the lowest score
        const drops = topicScores.filter(s => s.trend === 'DOWN').sort((a, b) => a.change - b.change);
        if (drops.length > 0) {
          needsAttention = drops[0];
        } else {
          needsAttention = topicScores[topicScores.length - 1];
        }
      } else if (topicScores.length === 1 && topicScores[0].score < 70) {
        needsAttention = topicScores[0];
      }

      const focusAreas = topicScores.filter(s => s.score < 75).map(s => ({
        topic: s.topic,
        performance: s.score,
        difficulty: s.score < 50 ? 'HIGH' : 'MEDIUM',
        recommendation: `Practice ${s.score < 50 ? 'easy to medium' : 'medium'} level questions in ${s.topic} to improve accuracy.`,
      })).slice(0, 3);

      let aiRecommendation = '';
      if (strongestSkill && needsAttention) {
        if (needsAttention.trend === 'DOWN') {
          aiRecommendation = `Your ${needsAttention.topic} score decreased by ${Math.abs(needsAttention.change)}% in your latest attempt. Consider reviewing the topics you missed.`;
        } else {
          aiRecommendation = `Your strongest current area is ${strongestSkill.topic}, while ${needsAttention.topic} needs more practice.`;
        }
      } else if (strongestSkill) {
        if (strongestSkill.trend === 'UP') {
          aiRecommendation = `Your ${strongestSkill.topic} performance improved by ${strongestSkill.change}% compared with your previous attempt.`;
        } else if (strongestSkill.trend === 'NEW') {
          aiRecommendation = `You have completed your first ${strongestSkill.topic} exam. Complete another attempt to start tracking your improvement.`;
        } else {
          aiRecommendation = `Great job! Your strongest area is ${strongestSkill.topic}. Keep practicing to maintain your high score.`;
        }
      } else {
        aiRecommendation = 'Keep practicing to generate personalized AI recommendations.';
      }

      const data = {
        empty: false,
        overallProgress,
        weeklyImprovement,
        strongestSkill,
        needsAttention,
        focusAreas,
        recentProgress,
        aiRecommendation,
        topicScores, // this is our new rich data array
        goals: [
          { title: `Improve ${needsAttention?.topic || 'performance'} to 75%`, target: 75, current: needsAttention?.score || 0 },
          { title: 'Complete one adaptive practice test', target: 1, current: 0 }
        ]
      };

      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}

export const analyticsController = new AnalyticsController();
