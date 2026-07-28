import { Request, Response, NextFunction } from 'express';
import { analyticsClient } from '../services/analyticsClient';

export class AnalyticsController {
  async predictPerformance(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = req.body;
      const result = await analyticsClient.predictPerformance(data);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async recommendStudy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = req.body;
      const result = await analyticsClient.recommendStudy(data);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

export const analyticsController = new AnalyticsController();
