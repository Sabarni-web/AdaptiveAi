import { Request, Response, NextFunction } from 'express';
import { ExamSession } from '../models/ExamSession';
import { Question } from '../models/Question';
import mongoose from 'mongoose';

export class RecommendationController {
  async getRecommendation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const studentId = req.user?.userId;
      if (!studentId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      // 1. Fetch completed exam sessions
      const sessions = await ExamSession.find({
        studentId,
        status: 'completed'
      }).sort({ createdAt: -1 });

      if (sessions.length === 0) {
        // STATE 2: No exam history
        res.status(200).json({
          success: true,
          recommendation: {
            type: 'FIRST_ASSESSMENT',
            title: 'Start your personalized learning journey',
            description: 'Choose a domain and take your first assessment. AdaptiveAI will analyze your performance and create personalized recommendations after your first exam.',
            reason: 'You have not completed any exams yet.'
          }
        });
        return;
      }

      // 2. Aggregate performance by subject
      const subjectStats: Record<string, {
        domain: string;
        totalQuestions: number;
        correctAnswers: number;
        recentScores: number[];
      }> = {};

      for (const session of sessions) {
        const subject = session.subject;
        const domain = session.domain;
        
        if (!subject || !domain) {
          continue; // Skip legacy sessions without subject/domain
        }
        
        if (!subjectStats[subject]) {
          subjectStats[subject] = {
            domain,
            totalQuestions: 0,
            correctAnswers: 0,
            recentScores: []
          };
        }

        let correctInSession = 0;
        let totalInSession = 0;

        for (const qa of session.questionsAsked) {
          if (qa.isCorrect !== undefined) {
            totalInSession++;
            if (qa.isCorrect) correctInSession++;
          }
        }

        subjectStats[subject].totalQuestions += totalInSession;
        subjectStats[subject].correctAnswers += correctInSession;
        
        if (totalInSession > 0) {
          subjectStats[subject].recentScores.push(correctInSession / totalInSession);
        }
      }

      // 3. Calculate weakness score for each subject
      let weakestSubject = null;
      let lowestScore = Infinity;
      let highestAccuracy = 0;

      const subjectAccuracies = [];

      for (const [subject, stats] of Object.entries(subjectStats)) {
        if (stats.totalQuestions === 0) continue;
        
        const accuracy = stats.correctAnswers / stats.totalQuestions;
        subjectAccuracies.push({ subject, domain: stats.domain, accuracy });

        // Simple recency weighting: recent exams (first in array since we sorted desc) weigh more
        const recentAccuracy = stats.recentScores.length > 0 ? stats.recentScores[0] : accuracy;
        const weaknessScore = (accuracy * 0.4) + (recentAccuracy * 0.6);

        if (weaknessScore < lowestScore) {
          lowestScore = weaknessScore;
          weakestSubject = { subject, domain: stats.domain, accuracy, recentAccuracy };
        }
        if (accuracy > highestAccuracy) {
          highestAccuracy = accuracy;
        }
      }

      // 4. Handle EXCELLENT PERFORMANCE (accuracy > 85% for everything)
      const isExcellent = subjectAccuracies.every(s => s.accuracy >= 0.85);
      if (isExcellent && subjectAccuracies.length > 0) {
        // Pick any subject to challenge
        const challengeSubject = subjectAccuracies[0];
        res.status(200).json({
          success: true,
          recommendation: {
            type: 'CHALLENGE',
            domain: challengeSubject.domain,
            subject: challengeSubject.subject,
            questionType: 'Mixed',
            difficulty: 'Hard',
            questionCount: 20,
            estimatedMinutes: 30,
            title: `Challenge yourself with ${challengeSubject.subject}`,
            description: 'Your performance is consistently strong. Take a hard challenge.',
            reason: `Your overall accuracy is excellent (${Math.round(highestAccuracy * 100)}%).`
          }
        });
        return;
      }

      if (!weakestSubject) {
        // Fallback
        res.status(200).json({ success: true, recommendation: null });
        return;
      }

      // 5. Build recommendation for weakest subject
      const accuracyPct = Math.round(weakestSubject.accuracy * 100);
      let difficulty = 'Medium';
      let qCount = 20;
      let time = 25;

      if (accuracyPct < 50) {
        difficulty = 'Easy';
        qCount = 15;
        time = 20;
      } else if (accuracyPct > 70) {
        difficulty = 'Medium';
        qCount = 20;
        time = 25;
      }

      // Get some topics from the DB for this subject
      const sampleQuestions = await Question.find({ subject: weakestSubject.subject, isActive: true }).limit(20);
      const uniqueTopics = [...new Set(sampleQuestions.map(q => q.topic).filter(Boolean))].slice(0, 3);

      res.status(200).json({
        success: true,
        recommendation: {
          type: 'WEAK_SUBJECT',
          domain: weakestSubject.domain,
          subject: weakestSubject.subject,
          topics: uniqueTopics.length > 0 ? uniqueTopics : ['General Practice'],
          questionType: 'MCQ', // Defaulting to MCQ for practice
          difficulty,
          questionCount: qCount,
          estimatedMinutes: time,
          title: `Strengthen ${weakestSubject.subject}`,
          description: 'AdaptiveAI identified areas where you can improve based on your recent performance.',
          reason: `Your recent accuracy in ${weakestSubject.subject} is ${Math.round(weakestSubject.recentAccuracy * 100)}%.`
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

export const recommendationController = new RecommendationController();
