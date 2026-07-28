import { Request, Response, NextFunction } from 'express';
import { Result } from '../models/Result';

export class ResultController {
  async getStudentResults(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const studentId = (req as any).user.userId;
      const results = await Result.find({ studentId }).populate('examConfigId');
      res.status(200).json({ success: true, data: results });
    } catch (error) {
      next(error);
    }
  }

  async getResultById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const result = await Result.findById(id).populate('examConfigId');
      if (!result) {
         res.status(404).json({ success: false, error: { message: 'Result not found' } });
         return;
      }
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

export const resultController = new ResultController();
