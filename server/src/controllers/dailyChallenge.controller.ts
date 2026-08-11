import { Request, Response } from 'express';
import { DailyChallengeService } from '../services/dailyChallenge.service';
import { DailyChallenge } from '../models/DailyChallenge';
import { User } from '../models/User';

export const getTodayChallenge = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId || (req as any).user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const user = await User.findById(userId).select('gamification');
    const currentStreak = user?.gamification?.currentStreak || 0;

    const challenge = await DailyChallengeService.getTodayChallenge(userId);
    if (!challenge) {
      return res.status(200).json({ status: 'not_started', currentStreak });
    }

    if (challenge.status === 'started') {
      return res.status(200).json({ status: 'in_progress', challenge, currentStreak });
    }

    return res.status(200).json({ status: 'completed', challenge, currentStreak });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const startChallenge = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId || (req as any).user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const challenge = await DailyChallengeService.startChallenge(userId);
    
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    // Strip correctAnswer and answerExplanation from the question before sending to frontend
    const challengeObj = challenge.toObject();
    if (challengeObj.questionId) {
      delete (challengeObj.questionId as any).correctAnswer;
      delete (challengeObj.questionId as any).answerExplanation;
    }

    return res.status(200).json(challengeObj);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const submitChallenge = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId || (req as any).user?.id;
    const { id } = req.params;
    const { answer } = req.body;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const result = await DailyChallengeService.submitChallenge(userId, id as string, answer);

    return res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getStats = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId || (req as any).user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const user = await User.findById(userId).select('gamification');
    
    // Calculate accuracy
    const completedChallenges = user?.gamification?.totalChallengesCompleted || 0;
    const correctChallenges = await DailyChallenge.countDocuments({ userId, isCorrect: true });
    
    const accuracy = completedChallenges > 0 ? (correctChallenges / completedChallenges) * 100 : 0;

    return res.status(200).json({
      currentStreak: user?.gamification?.currentStreak || 0,
      longestStreak: user?.gamification?.longestStreak || 0,
      totalCompleted: completedChallenges,
      correctCount: correctChallenges,
      accuracy: parseFloat(accuracy.toFixed(2)),
      xp: user?.gamification?.xp || 0
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId || (req as any).user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const history = await DailyChallenge.find({ userId })
      .sort({ challengeDate: -1 })
      .limit(30)
      .populate('questionId', 'questionText');

    return res.status(200).json(history);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
