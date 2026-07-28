import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { ZodError } from 'zod';
import mongoose from 'mongoose';
import { randomUUID } from 'crypto';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  const requestId = randomUUID();
  logger.error(`[${requestId}] Error: ${err.message}`, { stack: err.stack, path: req.path });

  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input data',
        details: err.errors.map(e => ({ field: e.path.join('.'), issue: e.message })),
        timestamp: new Date().toISOString(),
        requestId
      }
    });
    return;
  }

  if (err instanceof mongoose.Error.ValidationError) {
    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: err.message,
        timestamp: new Date().toISOString(),
        requestId
      }
    });
    return;
  }
  
  if (err instanceof mongoose.Error.CastError) {
    res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_ID',
        message: 'Invalid resource ID format',
        timestamp: new Date().toISOString(),
        requestId
      }
    });
    return;
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid or expired token',
        timestamp: new Date().toISOString(),
        requestId
      }
    });
    return;
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: {
      code: statusCode === 404 ? 'NOT_FOUND' : 'INTERNAL_SERVER_ERROR',
      message: err.message || 'Internal server error',
      timestamp: new Date().toISOString(),
      requestId
    }
  });
};
