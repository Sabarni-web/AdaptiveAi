import { Request, Response, NextFunction } from 'express';
import { AuditLog } from '../models/AuditLog';

export const auditLog = (entityType: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Only log state-changing methods
    if (!['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
      return next();
    }

    const originalSend = res.send;
    
    // Intercept response to log after successful operation
    res.send = function (body) {
      if (res.statusCode >= 200 && res.statusCode < 300) {
         try {
           const user = (req as any).user;
           if (user) {
             const log = new AuditLog({
               userId: user.userId,
               action: req.method,
               entityType,
               entityId: req.params.id || null, // Best effort
               ipAddress: req.ip || 'unknown',
               userAgent: req.headers['user-agent'] || 'unknown',
               timestamp: new Date()
             });
             log.save().catch(err => console.error('Failed to save audit log:', err));
           }
         } catch (e) {
           console.error('Audit log error', e);
         }
      }
      return originalSend.call(this, body);
    };

    next();
  };
};
