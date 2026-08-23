import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { UserModel } from '../models/User';
import { ApiError } from './errorHandler';

interface JwtPayload {
  userId: string;
  role: string;
}

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      throw new ApiError(401, 'Authentication required');
    }

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
    } catch {
      throw new ApiError(401, 'Invalid or expired authentication token');
    }

    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      throw new ApiError(401, 'Authentication user not found');
    }

    if (!user.isActive) {
      throw new ApiError(401, 'User account is deactivated');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
