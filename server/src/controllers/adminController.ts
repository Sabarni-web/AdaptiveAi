import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { Question } from '../models/Question';
import { aiService } from '../services/aiService';

export class AdminController {
  async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await User.find();
      res.status(200).json({ success: true, data: users });
    } catch (error) {
      next(error);
    }
  }

  async getSystemHealth(req: Request, res: Response, next: NextFunction): Promise<void> {
    res.status(200).json({
       success: true,
       data: {
          status: 'ok',
          uptime: process.uptime(),
       }
    });
  }

  async generateQuestions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { subject, difficulty, count } = req.body;
      const questions = await aiService.generateQuestions(subject, difficulty, count);
      
      const savedQuestions = await Question.insertMany(questions);
      
      res.status(200).json({ success: true, data: savedQuestions });
    } catch (error) {
      next(error);
    }
  }

  async getQuestions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { subject, difficulty, page = 1, limit = 10 } = req.query;
      const query: any = {};
      if (subject) query.subject = subject;
      if (difficulty) query.difficulty = difficulty;

      const questions = await Question.find(query)
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
        .sort({ createdAt: -1 });

      const total = await Question.countDocuments(query);
      
      res.status(200).json({ success: true, data: { questions, total, page: Number(page), limit: Number(limit) } });
    } catch (error) {
      next(error);
    }
  }

  async deleteQuestion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await Question.findByIdAndDelete(id);
      res.status(200).json({ success: true, message: 'Question deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async updateQuestionTranslations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { translations } = req.body;
      
      const question = await Question.findById(id);
      if (!question) {
        res.status(404).json({ success: false, message: 'Question not found' });
        return;
      }

      if (!question.translations) {
        question.translations = new Map();
      }

      for (const [lang, translation] of Object.entries(translations)) {
        question.translations.set(lang, translation as any);
      }
      
      await question.save();
      res.status(200).json({ success: true, data: question });
    } catch (error) {
      next(error);
    }
  }
}

export const adminController = new AdminController();
