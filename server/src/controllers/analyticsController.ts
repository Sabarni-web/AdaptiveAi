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
      const studentId = (req as any).user._id;
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

      // Calculate subject performance
      const subjectPerformance: Record<string, { total: number, count: number }> = {};
      sessions.forEach(s => {
        if (!subjectPerformance[s.subject]) {
          subjectPerformance[s.subject] = { total: 0, count: 0 };
        }
        subjectPerformance[s.subject].total += s.percentage || 0;
        subjectPerformance[s.subject].count += 1;
      });

      const subjects = Object.entries(subjectPerformance).map(([name, data]) => ({
        name,
        score: Math.round(data.total / data.count)
      })).sort((a, b) => b.score - a.score);

      const strongestSkill = subjects.length > 0 ? subjects[0] : null;
      const needsAttention = subjects.length > 1 ? subjects[subjects.length - 1] : (subjects.length === 1 && subjects[0].score < 70 ? subjects[0] : null);

      const focusAreas = subjects.filter(s => s.score < 75).map(s => ({
        topic: s.name,
        performance: s.score,
        difficulty: s.score < 50 ? 'HIGH' : 'MEDIUM',
        recommendation: `Practice ${s.score < 50 ? 'easy to medium' : 'medium'} level questions in ${s.name} to improve accuracy.`,
      })).slice(0, 3);

      let aiRecommendation = '';
      if (strongestSkill && needsAttention) {
        aiRecommendation = `Your strongest area is ${strongestSkill.name}. Your ${needsAttention.name} accuracy has decreased in recent attempts. Focus on ${needsAttention.name} before your next exam.`;
      } else if (strongestSkill) {
        aiRecommendation = `Great job! Your strongest area is ${strongestSkill.name}. Keep practicing to maintain your high score.`;
      } else {
        aiRecommendation = 'Keep practicing to generate personalized AI recommendations.';
      }

      const topicScores = subjects.map(s => ({
        topic: s.name,
        score: s.score
      }));

      const data = {
        empty: false,
        overallProgress,
        weeklyImprovement,
        strongestSkill,
        needsAttention,
        focusAreas,
        recentProgress,
        aiRecommendation,
        topicScores,
        goals: [
          { title: `Improve ${needsAttention?.name || 'performance'} to 75%`, target: 75, current: needsAttention?.score || 0 },
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
