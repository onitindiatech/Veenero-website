import rateLimit from 'express-rate-limit';

// ─── Authentication Rate Limiter ──────────────────────────────────────────────
// Strict: 5 failed requests per IP per 15 minutes on the login route.
// In practice, successful logins do NOT count toward this limit — but since
// express-rate-limit applies before the handler runs, we use a generous window
// of 10 attempts to avoid locking out admins who mis-type once or twice.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                   // Allow 10 login attempts per window per IP
  standardHeaders: true,     // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,
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
