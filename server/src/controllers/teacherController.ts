import { Request, Response, NextFunction } from 'express';
import { ExamConfig } from '../models/ExamConfig';

export class TeacherController {
  async getExamConfigs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const createdBy = (req as any).user.userId;
      const configs = await ExamConfig.find({ createdBy });
      res.status(200).json({ success: true, data: configs });
    } catch (error) {
      next(error);
    }
  }

  async createExamConfig(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = { ...req.body, createdBy: (req as any).user.userId };
      const config = new ExamConfig(data);
      await config.save();
      res.status(201).json({ success: true, data: config });
    } catch (error) {
      next(error);
    }
  }

  async getPendingGrading(req: Request, res: Response, next: NextFunction): Promise<void> {
     // Stub
     res.status(200).json({ success: true, message: 'Pending grading' });
  }

  async overrideGrade(req: Request, res: Response, next: NextFunction): Promise<void> {
     // Stub
     res.status(200).json({ success: true, message: 'Grade overridden' });
  }
}

export const teacherController = new TeacherController();
