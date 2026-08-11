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
        .populate('questionsAsked.questionId')
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

      // 1. Extract Topic Performance from Questions
      // Map: subject -> topic -> array of { date, correctCount, totalCount, score }
      const topicHistory: Record<string, Record<string, any[]>> = {};

      sessions.forEach(session => {
        const subject = session.subject || 'General';
        if (!topicHistory[subject]) topicHistory[subject] = {};

        // Aggregate question performance for this session by topic
        const sessionTopicStats: Record<string, { correct: number, total: number }> = {};
        
        session.questionsAsked.forEach(qa => {
          if (!qa.questionId) return; // Skip if question data is missing
          const question: any = qa.questionId;
          const topic = question.topic || subject;
          
          if (!sessionTopicStats[topic]) sessionTopicStats[topic] = { correct: 0, total: 0 };
          sessionTopicStats[topic].total += 1;
          if (qa.isCorrect) sessionTopicStats[topic].correct += 1;
        });

        // Push session aggregate to history
        Object.keys(sessionTopicStats).forEach(topic => {
          if (!topicHistory[subject][topic]) topicHistory[subject][topic] = [];
          const stats = sessionTopicStats[topic];
          const score = Math.round((stats.correct / stats.total) * 100);
          topicHistory[subject][topic].push({
            date: session.completedAt,
            correct: stats.correct,
            total: stats.total,
            score: score,
            examName: session.examConfigId ? `Exam ${subject}` : subject
          });
        });
      });

      // 2. Analyze Topics to generate Recommendations
      const recommendations: any[] = [];
      const topicScores: any[] = [];

      Object.keys(topicHistory).forEach(subject => {
        Object.keys(topicHistory[subject]).forEach(topic => {
          const history = topicHistory[subject][topic];
          if (history.length === 0) return;

          const latest = history[history.length - 1];
          const previous = history.length > 1 ? history[history.length - 2] : null;

          const currentScore = latest.score;
          const previousScore = previous ? previous.score : null;
          
          let change = 0;
          let trend = 'NEW';
          if (previousScore !== null) {
            change = currentScore - previousScore;
            if (change > 0) trend = 'UP';
            else if (change < 0) trend = 'DOWN';
            else trend = 'STABLE';
          }

          // Compute repeated mistakes (if they got < 60% in the last 2 attempts)
          let repeatedMistakes = false;
          if (history.length >= 2) {
            const last2 = history.slice(-2);
            repeatedMistakes = last2.every(h => h.score < 60);
          }

          // Store raw topic scores for charts
          topicScores.push({
            topic,
            subject,
            score: currentScore,
            currentScore,
            previousScore,
            change,
            trend,
            examCount: history.length,
            latestExam: latest.examName,
            lastAttempt: latest.date
          });

          // Priority Scoring
          let priorityScore = 0;
          priorityScore += Math.max(0, 100 - currentScore); // Low score weight (max 100)
          if (trend === 'DOWN') priorityScore += Math.abs(change) * 1.5; // Negative trend weight
          if (repeatedMistakes) priorityScore += 30; // Repeated mistake weight

          let priorityLevel = 'LOW';
          if (priorityScore > 80) priorityLevel = 'HIGH';
          else if (priorityScore > 50) priorityLevel = 'MEDIUM';

          // Generate Rule-Based Reason
          let reason = '';
          if (repeatedMistakes) reason = 'Repeated low performance across recent attempts.';
          else if (trend === 'DOWN' && change <= -15) reason = `Performance decreased significantly by ${Math.abs(change)}%.`;
          else reason = `Current accuracy is ${currentScore}%.`;

          // Generate Rule-Based AI Recommendation text
          let recommendationText = '';
          if (currentScore < 50) {
            recommendationText = `Review the fundamental concepts of ${topic}. Start with basic definitions and practice 5-10 easy questions before moving forward.`;
          } else if (currentScore <= 70) {
            recommendationText = `Strengthen your core understanding of ${topic}. Review any incorrect answers and practice targeted medium-difficulty questions.`;
          } else if (currentScore <= 85) {
            recommendationText = `Continue practicing ${topic} and focus on advanced applications and edge cases.`;
          } else {
            recommendationText = `Strong performance in ${topic}. Try more challenging questions to maintain mastery.`;
          }

          if (repeatedMistakes) {
            recommendationText = `Repeated difficulty detected in ${topic}. ${recommendationText} Consider reviewing related prerequisite topics.`;
          }

          let nextAction = `Practice ${topic}`;

          recommendations.push({
            subject,
            topic,
            priority: priorityLevel,
            priorityScore,
            score: currentScore,
            previousScore,
            change,
            trend,
            reason,
            recommendation: recommendationText,
            nextAction,
            attempts: history.length
          });
        });
      });

      // Sort recommendations by priority score (descending) and take top 3
      recommendations.sort((a, b) => b.priorityScore - a.priorityScore);
      const topRecommendations = recommendations.slice(0, 3);

      // Sort topicScores for the bar chart
      topicScores.sort((a, b) => b.score - a.score);
      const strongestSkill = topicScores.length > 0 ? topicScores[0] : null;
      const needsAttention = topicScores.length > 0 ? topicScores[topicScores.length - 1] : null;

      const data = {
        empty: false,
        overallProgress,
        weeklyImprovement,
        strongestSkill,
        needsAttention,
        recentProgress,
        recommendations: topRecommendations,
        topicScores,
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
