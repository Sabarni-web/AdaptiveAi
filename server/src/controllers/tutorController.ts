import { Request, Response, NextFunction } from 'express';
import { aiService } from '../services/aiService';

export class TutorController {
  async askDoubt(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { history } = req.body;

      if (!history || !Array.isArray(history) || history.length === 0) {
        res.status(400).json({ success: false, message: 'Invalid conversation history' });
        return;
      }

      // We might want to cap the history length to avoid excessive token usage
      const limitedHistory = history.slice(-15); 
      
      const answer = await aiService.askTutor(limitedHistory);

      res.status(200).json({
        success: true,
        answer
      });
    } catch (error) {
      next(error);
    }
  }
}

export const tutorController = new TutorController();
