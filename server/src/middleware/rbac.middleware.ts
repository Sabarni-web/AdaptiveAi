import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';

export const rbac = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, error: { message: 'Unauthorized' } });
      return;
    }

    const { role } = req.user;
    
    const roleHierarchy: Record<string, number> = {
      'student': 1,
      'teacher': 2,
      'admin': 3,
      'super_admin': 4
    };

    const userLevel = roleHierarchy[role] || 0;
    
    // Check if user has exact role or higher in hierarchy if allowed role requires it
    // Wait, simpler to just check if user's role is in allowedRoles, or if user is super_admin
    if (role === 'super_admin' || allowedRoles.includes(role)) {
      next();
    } else {
      let isAllowed = false;
      for (const allowed of allowedRoles) {
         if (userLevel >= (roleHierarchy[allowed] || 99)) {
            isAllowed = true;
            break;
         }
      }
      
      if (isAllowed) {
         next();
      } else {
         res.status(403).json({ success: false, error: { message: 'Forbidden: Insufficient permissions' } });
      }
    }
  };
};
