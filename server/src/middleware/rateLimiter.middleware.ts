import { RateLimiterRedis } from 'rate-limiter-flexible';
import { redis } from '../config/redis';
import { Request, Response, NextFunction } from 'express';

const generalLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: 'middleware',
  points: 100, // 100 requests
  duration: 15 * 60, // per 15 minutes by IP
});

const authLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: 'auth_limit',
  points: 10,
  duration: 15 * 60,
});

const examLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: 'exam_limit',
  points: 30, // 30 requests
  duration: 60, // per 1 minute by user
});

export const rateLimiter = (type: 'general' | 'auth' | 'exam' = 'general') => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let key = req.ip || 'unknown';
      let limiter = generalLimiter;

      if (type === 'auth') {
        limiter = authLimiter;
      } else if (type === 'exam') {
        limiter = examLimiter;
        if ((req as any).user) {
          key = (req as any).user.userId;
        }
      }

      await limiter.consume(key);
      next();
    } catch (rejRes: any) {
      res.status(429).set('Retry-After', String(Math.round(rejRes.msBeforeNext / 1000) || 1)).json({
        success: false,
        error: { message: 'Too Many Requests' }
      });
    }
  };
};
