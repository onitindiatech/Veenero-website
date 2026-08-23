import { Router } from 'express';
import { healthCheck } from '../controllers/health.controller';

// ─── Health Routes ────────────────────────────────────────────────────────────

const router = Router();

/**
 * GET /api/health
 * Returns service status, database connectivity, uptime, and environment.
 */
router.get('/', healthCheck);

export default router;
