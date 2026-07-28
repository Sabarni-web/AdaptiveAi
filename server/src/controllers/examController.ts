import { Request, Response, NextFunction } from 'express';
import { examOrchestrator } from '../services/examOrchestrator';

export class ExamController {
  async startExam(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const studentId = (req as any).user.userId;
      const { examConfigId } = req.body;
      const session = await examOrchestrator.startExam(studentId, examConfigId);
      res.status(200).json({ success: true, data: session });
    } catch (error) {
      next(error);
    }
  }

  async getNextQuestion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sessionId } = req.params;
      const question = await examOrchestrator.getNextQuestion(sessionId);
      res.status(200).json({ success: true, data: question });
    } catch (error) {
      next(error);
    }
  }

  async submitAnswer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sessionId } = req.params;
      const { questionId, answer, timeSpent } = req.body;
      await examOrchestrator.submitAnswer(sessionId, questionId, answer, timeSpent);
      res.status(200).json({ success: true, message: 'Answer submitted' });
    } catch (error) {
      next(error);
    }
  }

  async submitExam(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sessionId } = req.params;
      const result = await examOrchestrator.submitExam(sessionId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    // Implementation
    res.status(200).json({ success: true, message: 'Status endpoint' });
  }

  async getResult(req: Request, res: Response, next: NextFunction): Promise<void> {
    // Implementation
    res.status(200).json({ success: true, message: 'Result endpoint' });
  }

  async getHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    // Implementation
    res.status(200).json({ success: true, message: 'History endpoint' });
  }
}

export const examController = new ExamController();
