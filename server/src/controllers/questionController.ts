import { Request, Response, NextFunction } from 'express';
import { Question } from '../models/Question';

export class QuestionController {
  async createQuestion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = { ...req.body, createdBy: (req as any).user.userId };
      const question = new Question(data);
      await question.save();
      res.status(201).json({ success: true, data: question });
    } catch (error) {
      next(error);
    }
  }

  async getQuestions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const questions = await Question.find({ isActive: true });
      res.status(200).json({ success: true, data: questions });
    } catch (error) {
      next(error);
    }
  }

  async getQuestion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const question = await Question.findById(req.params.id);
      if (!question) {
        res.status(404).json({ success: false, error: { message: 'Question not found' } });
        return;
      }
      res.status(200).json({ success: true, data: question });
    } catch (error) {
      next(error);
    }
  }

  async updateQuestion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.status(200).json({ success: true, data: question });
    } catch (error) {
      next(error);
    }
  }

  async deleteQuestion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await Question.findByIdAndUpdate(req.params.id, { isActive: false });
      res.status(200).json({ success: true, message: 'Question soft deleted' });
    } catch (error) {
      next(error);
    }
  }
}

export const questionController = new QuestionController();
