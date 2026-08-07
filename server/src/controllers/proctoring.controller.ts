import { Request, Response } from 'express';
import { FaceViolation } from '../models/FaceViolation';
import { logger } from '../utils/logger';

export const logFaceViolation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, examId, event, duration, confidence, questionNumber } = req.body;
    
    // Use the authenticated user's ID if not provided in body, though typically the client will send it
    const actualUserId = userId || (req as any).user?.userId;

    if (!actualUserId || !examId) {
      res.status(400).json({ success: false, message: 'Missing userId or examId' });
      return;
    }

    const violation = new FaceViolation({
      userId: actualUserId,
      examId,
      questionNumber,
      event,
      duration,
      confidence,
    });

    await violation.save();
    
    logger.info(`Face violation logged for user ${actualUserId} in exam ${examId}`);

    res.status(201).json({
      success: true,
      data: violation
    });
  } catch (error) {
    logger.error(`Error logging face violation: ${error}`);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const getSessionLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { examId } = req.params;
    
    const logs = await FaceViolation.find({ examId }).sort({ timestamp: -1 }).populate('userId', 'firstName lastName email');
    
    res.status(200).json({
      success: true,
      data: logs
    });
  } catch (error) {
    logger.error(`Error fetching session logs: ${error}`);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const getStudentLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    
    const logs = await FaceViolation.find({ userId }).sort({ timestamp: -1 }).populate('examId', 'title courseId');
    
    res.status(200).json({
      success: true,
      data: logs
    });
  } catch (error) {
    logger.error(`Error fetching student logs: ${error}`);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
