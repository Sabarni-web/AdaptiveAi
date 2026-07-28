import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';

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
}

export const adminController = new AdminController();
