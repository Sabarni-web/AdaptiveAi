import { Request, Response } from 'express';
import { MultiplePersonViolation } from '../models/MultiplePersonViolation';
import { HeadDirectionViolation } from '../models/HeadDirectionViolation';
import { ExamSession } from '../models/ExamSession';
import { logger } from '../utils/logger';

export const logMultiplePersonViolation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { examId, questionNumber, personsDetected, duration, warningLevel, integrityPenalty } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const violation = new MultiplePersonViolation({
      userId,
      examId,
      questionNumber,
      personsDetected,
      duration,
      warningLevel,
      integrityPenalty
    });

    await violation.save();

    // Deduct integrity score from the active session if one exists
    const session = await ExamSession.findOne({ studentId: userId, examConfigId: examId, status: 'in_progress' });
    if (session) {
      session.integrityScore = Math.max(0, (session.integrityScore || 100) - integrityPenalty);
      await session.save();
    }

    res.status(201).json({ message: 'Violation logged', violation });
  } catch (error) {
    logger.error('Error logging multiple person violation:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getViolationsForExam = async (req: Request, res: Response): Promise<void> => {
  try {
    const { examId } = req.params;
    const violations = await MultiplePersonViolation.find({ examId }).populate('userId', 'name email');
    res.json(violations);
  } catch (error) {
    logger.error('Error fetching violations:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getIntegrityScore = async (req: Request, res: Response): Promise<void> => {
  try {
    const { examId } = req.params;
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const session = await ExamSession.findOne({ studentId: userId, examConfigId: examId });
    if (session) {
      res.json({ integrityScore: session.integrityScore || 100 });
    } else {
      res.status(404).json({ message: 'Session not found' });
    }
  } catch (error) {
    logger.error('Error fetching integrity score:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const logHeadDirectionViolation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { examId, questionNumber, direction, duration, warningLevel, integrityPenalty } = req.body;
    const userId = req.user?.userId || (req.user as any)?.id;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const violation = new HeadDirectionViolation({
      userId,
      examId,
      questionNumber,
      direction,
      duration,
      warningLevel,
      integrityPenalty
    });

    await violation.save();

    const session = await ExamSession.findOne({ studentId: userId, examConfigId: examId, status: 'in_progress' });
    if (session) {
      session.integrityScore = Math.max(0, (session.integrityScore || 100) - integrityPenalty);
      await session.save();
    }

    res.status(201).json({ message: 'Violation logged', violation });
  } catch (error) {
    logger.error('Error logging head direction violation:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getHeadDirectionViolations = async (req: Request, res: Response): Promise<void> => {
  try {
    const { examId } = req.params;
    const violations = await HeadDirectionViolation.find({ examId }).populate('userId', 'name email');
    res.json(violations);
  } catch (error) {
    logger.error('Error fetching head direction violations:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
