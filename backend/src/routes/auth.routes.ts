import { Router } from 'express';
import { login, logout, me } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authLimiter, resetAuthLimiter } from '../middleware/rateLimit.middleware';
import { config } from '../config/env';

const router = Router();

// Only POST /login uses authLimiter
router.post('/login', authLimiter, login);
router.post('/logout', logout);
router.get('/me', authenticate, me);

// In development, provide an endpoint to clear rate limit state on demand
if (config.isDev) {
  router.post('/reset-rate-limit', (_req, res) => {
    resetAuthLimiter();
    res.status(200).json({ success: true, message: 'Authentication rate limit store cleared.' });
  });
}

export default router;
