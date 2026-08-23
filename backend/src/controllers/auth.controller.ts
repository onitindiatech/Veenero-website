import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User';
import { ApiError } from '../middleware/errorHandler';
import { config } from '../config/env';

// ─── POST /api/auth/login ────────────────────────────────────────────────────
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, 'Email and password are required');
    }

    const user = await UserModel.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    if (!user.isActive) {
      throw new ApiError(403, 'Account is deactivated. Please contact support.');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn as any }
    );

    // Cookie configuration
    const isProduction = config.nodeEnv === 'production';
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax' as const,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days matching JWT_EXPIRES_IN
    };

    res.cookie('token', token, cookieOptions);

    user.lastLogin = new Date();
    await user.save();

    // Return safe user info — never expose passwordHash or internal fields
    const safeUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      lastLogin: user.lastLogin,
    };

    res.status(200).json({
      success: true,
      user: safeUser,
    });
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/auth/logout ───────────────────────────────────────────────────
export const logout = (_req: Request, res: Response): void => {
  const isProduction = config.nodeEnv === 'production';
  res.clearCookie('token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax' as const,
  });
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};

// ─── GET /api/auth/me ────────────────────────────────────────────────────────
export const me = (req: Request, res: Response): void => {
  // req.user is set by the authenticate middleware
  const u = req.user as any;
  res.status(200).json({
    success: true,
    authenticated: true,
    user: {
      id: u._id,
      name: u.name,
      email: u.email,
      role: u.role,
      lastLogin: u.lastLogin,
    },
  });
};
