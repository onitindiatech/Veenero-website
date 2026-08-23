import { Request, Response, NextFunction } from 'express';
import { ApiError } from './errorHandler';
import { UserRole } from '../models/User';

export const requireRole = (allowedRoles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required'));
    }

    // SUPER_ADMIN has access to everything
    if (req.user.role === 'SUPER_ADMIN') {
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, 'Access denied: insufficient permissions'));
    }

    next();
  };
};
