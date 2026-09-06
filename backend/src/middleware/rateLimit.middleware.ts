import { Request } from 'express';
import rateLimit, { MemoryStore } from 'express-rate-limit';

// ─── Dedicated In-Memory Store for Auth Limiter ───────────────────────────────
// Explicit MemoryStore instance allows deterministic clearing on server restart
// and per-key resets upon successful authentication.
export const authLimiterStore = new MemoryStore();

/**
 * Computes the rate-limit key based on normalized client IP and normalized email.
 * This ensures rate limiting is tracked per IP and account, preventing
 * lockout of legitimate users due to another user's or test's activity.
 */
export const getAuthRateLimitKey = (req: Request): string => {
  let ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
  if (ip.startsWith('::ffff:')) {
    ip = ip.substring(7);
  }
  if (ip === '::1') {
    ip = '127.0.0.1';
  }
  const rawEmail = typeof req.body?.email === 'string' ? req.body.email : '';
  const email = rawEmail.toLowerCase().trim();
  return email ? `${ip}::${email}` : ip;
};

/**
 * Resets the rate limiter key for a specific request (called on successful login).
 * Ensures that a legitimate user who logs in successfully does not keep a stale failed count.
 */
export const resetLoginAttempts = (req: Request): void => {
  try {
    const key = getAuthRateLimitKey(req);
    authLimiterStore.resetKey(key);
  } catch (err) {
    // Non-fatal if reset fails
  }
};

/**
 * Completely resets all authentication rate limits.
 * Called on server start/restart in development to clear any stale state.
 */
export const resetAuthLimiter = (): void => {
  try {
    authLimiterStore.resetAll();
  } catch (err) {
    // Non-fatal
  }
};

// ─── Authentication Rate Limiter ──────────────────────────────────────────────
// Allows 10 failed login attempts per (IP + account) per 15-minute window.
// Requirements fulfilled:
// - Only POST /api/auth/login is protected (GET /admin/login never consumes attempts)
// - Opening/rendering the login page never touches this limiter
// - Successful logins do NOT increment this counter (skipSuccessfulRequests: true)
// - A successful login explicitly resets any prior failed attempts (resetLoginAttempts)
// - Only failed authentication attempts increment the failed-login counter
// - State is tracked per IP + account, never via a global boolean
// - Stale locks are cleared on dev restart (resetAuthLimiter)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                   // Allow up to 10 failed attempts per window
  standardHeaders: true,     // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false,
  store: authLimiterStore,
  keyGenerator: getAuthRateLimitKey,
  validate: { default: false }, // Suppress express-rate-limit warnings for custom keyGenerator
  message: {
    success: false,
    error: {
      status: 429,
      message: 'Too many login attempts. Please try again in 15 minutes.',
    },
  },
  skipSuccessfulRequests: true, // Only count failed responses (non-2xx) toward the limit
});

// ─── General API Rate Limiter ─────────────────────────────────────────────────
// Generous limit — prevents API abuse without impacting normal CMS usage.
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500,                  // 500 requests per 15 min per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      status: 429,
      message: 'Too many requests. Please slow down and try again later.',
    },
  },
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path.startsWith('/api/health');
  },
});
