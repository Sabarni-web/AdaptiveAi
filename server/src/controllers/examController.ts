import { Request, Response, NextFunction } from 'express';
import { examOrchestrator } from '../services/examOrchestrator';
import { ExamSession } from '../models/ExamSession';

export class ExamController {
  async startExam(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const studentId = (req as any).user.userId;
      const { examConfigId } = req.body;
      const session = await examOrchestrator.startExam(studentId, examConfigId);
      res.status(200).json({ 
        success: true, 
        data: {
          ...session.toObject(),
          sessionId: session._id,
          config: {
            title: 'Full Stack Engineering Evaluation',
            durationSeconds: 1800,
            questionLimit: 10
          }
        } 
      });
    } catch (error) {
      next(error);
    }
  }

  async getNextQuestion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sessionId } = req.params as { sessionId: string };
      const question = await examOrchestrator.getNextQuestion(sessionId);
      res.status(200).json({ success: true, data: question });
    } catch (error) {
      next(error);
    }
  }

  async submitAnswer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sessionId } = req.params as { sessionId: string };
      const { questionId, answer, timeSpent } = req.body;
      const result = await examOrchestrator.submitAnswer(sessionId, questionId, answer, timeSpent);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async submitExam(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sessionId } = req.params as { sessionId: string };
      const result = await examOrchestrator.submitExam(sessionId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sessionId } = req.params as { sessionId: string };
      const session = await ExamSession.findById(sessionId);
      if (!session) {
        res.status(404).json({ success: false, message: 'Session not found' });
        return;
      }
      res.status(200).json({ success: true, data: session });
    } catch (error) {
      next(error);
    }
  }

  async getResult(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sessionId } = req.params as { sessionId: string };
      const result = await examOrchestrator.getResult(sessionId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const studentId = (req as any).user.userId;
      const history = await ExamSession.find({ studentId, status: 'completed' })
        .populate('examConfigId')
        .sort({ completedAt: -1 });

      const formattedHistory = history.map((session: any) => ({
        sessionId: session._id,
        title: session.examConfigId?.title || 'Full Stack Engineering Evaluation',
        grade: session.grade || 'B',
        score: session.percentage || 75,
        completedAt: session.completedAt || session.updatedAt
      }));

      res.status(200).json({ success: true, data: formattedHistory });
    } catch (error) {
      next(error);
    }
  }
}

export const examController = new ExamController();
