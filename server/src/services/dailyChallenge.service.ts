import mongoose from 'mongoose';
import { DailyChallenge } from '../models/DailyChallenge';
import { Question } from '../models/Question';
import { User } from '../models/User';

const TIMEZONE = process.env.APP_TIMEZONE || 'Asia/Kolkata';

export class DailyChallengeService {
  /**
   * Get today's date in YYYY-MM-DD format for the configured timezone.
   */
  static getTodayDateStr(): string {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: TIMEZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return formatter.format(new Date());
  }

  /**
   * Recalculate and synchronize the user's active streak based on challenge submission history.
   * If today or yesterday has a completed correct challenge, streak is maintained.
   * Otherwise if more than 1 day was missed, active streak resets to 0.
   */
  static async syncUserStreak(userId: string): Promise<number> {
    const user = await User.findById(userId);
    if (!user) return 0;
    if (!user.gamification) {
      user.gamification = { xp: 0, currentStreak: 0, longestStreak: 0, totalChallengesCompleted: 0 };
    }

    const todayStr = this.getTodayDateStr();
    const yesterdayStr = this.getYesterdayDateStr();

    // Find all completed correct challenges sorted from newest to oldest
    const correctChallenges = await DailyChallenge.find({
      userId,
      isCorrect: true,
      status: 'completed'
    }).sort({ challengeDate: -1 });

    if (correctChallenges.length === 0) {
      if (user.gamification.currentStreak !== 0) {
        user.gamification.currentStreak = 0;
        await user.save();
      }
      return 0;
    }

    const latestDateStr = correctChallenges[0].challengeDate;
    // Streak is active only if the most recent correct challenge was today or yesterday
    if (latestDateStr !== todayStr && latestDateStr !== yesterdayStr) {
      if (user.gamification.currentStreak !== 0) {
        user.gamification.currentStreak = 0;
        await user.save();
      }
      return 0;
    }

    // Count consecutive days backward
    let streak = 0;
    let expectedDate = new Date();
    // If completed today, check backwards starting today; else if yesterday, start yesterday
    if (latestDateStr === todayStr) {
      expectedDate = new Date();
    } else {
      expectedDate.setDate(expectedDate.getDate() - 1);
    }

    const completedDatesSet = new Set(correctChallenges.map(c => c.challengeDate));

    while (true) {
      const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: TIMEZONE,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
      const checkStr = formatter.format(expectedDate);

      if (completedDatesSet.has(checkStr)) {
        streak++;
        expectedDate.setDate(expectedDate.getDate() - 1);
      } else {
        break;
      }
    }

    if (user.gamification.currentStreak !== streak) {
      user.gamification.currentStreak = streak;
      if (streak > (user.gamification.longestStreak || 0)) {
        user.gamification.longestStreak = streak;
      }
      await user.save();
    }

    return streak;
  }

  /**
   * Get an existing challenge for a user for today.
   */
  static async getTodayChallenge(userId: string) {
    const today = this.getTodayDateStr();
    return DailyChallenge.findOne({ userId, challengeDate: today }).populate('questionId');
  }

  /**
   * Start a new challenge or return the existing one.
   */
  static async startChallenge(userId: string) {
    const today = this.getTodayDateStr();

    // Check if one already exists
    let challenge = await DailyChallenge.findOne({ userId, challengeDate: today }).populate('questionId');
    if (challenge) {
      return challenge;
    }

    // Select a random MCQ question (could be personalized later)
    // For MVP, just get a random active MCQ question.
    const questions = await Question.aggregate([
      { $match: { questionType: 'MCQ', isActive: true } },
      { $sample: { size: 1 } }
    ]);

    if (questions.length === 0) {
      throw new Error("No available questions for today's challenge.");
    }

    const selectedQuestion = questions[0];

    try {
      challenge = await DailyChallenge.create({
        userId,
        challengeDate: today,
        questionId: selectedQuestion._id,
        domain: selectedQuestion.domain,
        subject: selectedQuestion.subject,
        topic: selectedQuestion.topic,
        difficulty: selectedQuestion.difficulty,
        startedAt: new Date(),
        status: 'started',
      });
      // Populate question for frontend
      await challenge.populate('questionId');
      return challenge;
    } catch (error: any) {
      // Handle unique constraint duplicate error gracefully (race condition)
      if (error.code === 11000) {
        return DailyChallenge.findOne({ userId, challengeDate: today }).populate('questionId');
      }
      throw error;
    }
  }

  /**
   * Submit an answer for the challenge.
   */
  static async submitChallenge(userId: string, challengeId: string, answer: string | null) {
    const challenge = await DailyChallenge.findOne({ _id: challengeId, userId }).populate('questionId');

    if (!challenge) {
      throw new Error('Challenge not found');
    }

    if (challenge.status !== 'started') {
      throw new Error('Challenge is already completed or timed out.');
    }

    const question = challenge.questionId as any;
    const now = new Date();
    
    // Time limit validation (90 seconds + 5s buffer)
    const timeTakenSecs = Math.floor((now.getTime() - challenge.startedAt.getTime()) / 1000);
    const isTimeout = timeTakenSecs > 95;

    let isCorrect = false;
    let score = 0;
    let xpEarned = 0;

    if (isTimeout) {
      challenge.status = 'timed_out';
      challenge.isCorrect = false;
      challenge.answer = answer || '';
      xpEarned = 0;
    } else {
      challenge.status = 'completed';
      challenge.answer = answer || '';
      
      if (answer && question.correctAnswer && answer === question.correctAnswer) {
        isCorrect = true;
        score = 10;
        xpEarned = 10;
      } else {
        xpEarned = 2; // XP for trying
      }

      challenge.isCorrect = isCorrect;
      challenge.score = score;
    }

    challenge.timeTaken = timeTakenSecs;
    challenge.submittedAt = now;

    // Update User streak & XP
    const user = await User.findById(userId);
    if (user) {
      if (!user.gamification) {
        user.gamification = { xp: 0, currentStreak: 0, longestStreak: 0, totalChallengesCompleted: 0 };
      }

      user.gamification.xp += xpEarned;
      user.gamification.totalChallengesCompleted += 1;
      await user.save();

      // Recalculate streak cleanly based on chronological completed days
      const currentStreak = await this.syncUserStreak(userId);
      challenge.streakAfterCompletion = currentStreak;
    }

    await challenge.save();

    return {
      challenge,
      isCorrect,
      correctAnswer: question.correctAnswer,
      explanation: question.answerExplanation,
      xpEarned,
      streak: challenge.streakAfterCompletion || 0
    };
  }

  static getYesterdayDateStr(): string {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: TIMEZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return formatter.format(date);
  }
}
