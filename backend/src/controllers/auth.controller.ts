import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User';
import { ApiError } from '../middleware/errorHandler';
import { config } from '../config/env';
import { resetLoginAttempts } from '../middleware/rateLimit.middleware';

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

    // Reset rate limiter failed count for this IP + account upon successful login
    resetLoginAttempts(req);

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn as any }
    );

    // ── Cookie configuration ──────────────────────────────────────────────────
    // sameSite:'strict' prevents the cookie from being sent on any cross-site
    // request, closing the CSRF window that 'lax' leaves open for POST requests.
    // maxAge is derived from JWT_EXPIRES_IN so the cookie and token expire together.
    const isProduction = config.nodeEnv === 'production';

    // Parse "8h" / "7d" / "3600" → milliseconds for cookie maxAge
    const parseExpiresMs = (val: string): number => {
      const n = parseInt(val, 10);
      if (isNaN(n)) return 8 * 60 * 60 * 1000; // fallback: 8 h
      if (val.endsWith('d')) return n * 24 * 60 * 60 * 1000;
      if (val.endsWith('h')) return n * 60 * 60 * 1000;
      if (val.endsWith('m')) return n * 60 * 1000;
      return n * 1000; // bare number → seconds
    };

    const cookieMaxAge = parseExpiresMs(String(config.jwtExpiresIn));

    const cookieOptions = {
      httpOnly: true,              // Not accessible to JS — mitigates XSS token theft
      secure: isProduction,        // HTTPS-only in production
      sameSite: (isProduction ? 'none' : 'lax') as 'none' | 'lax', // 'none' allows cross-site requests (Vercel -> Render)
      maxAge: cookieMaxAge,
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
      token,
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
    sameSite: (isProduction ? 'none' : 'lax') as 'none' | 'lax',
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
