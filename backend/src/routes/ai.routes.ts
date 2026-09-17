import { Router } from 'express';
import { aiChat } from '../controllers/ai.controller';
import { aiRateLimiter } from '../middleware/rateLimit.middleware';

const aiRouter = Router();

// POST /api/ai/chat
// Public endpoint — no auth required, but strict rate limiting applied.
aiRouter.post('/chat', aiRateLimiter, aiChat);

export default aiRouter;
