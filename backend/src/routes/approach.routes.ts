import { Router } from 'express';
import {
  getPublicApproach,
  getAdminApproach,
  updateAdminApproach,
  getApproachSection,
  updateApproachSection,
} from '../controllers/approach.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

// ─── Public Router ────────────────────────────────────────────────────────────
export const publicApproachRouter = Router();

// GET /api/approach — Public page payload with Media Library resolution
publicApproachRouter.get('/', getPublicApproach);

// ─── Admin Router ─────────────────────────────────────────────────────────────
export const adminApproachRouter = Router();

// Require authenticated user for all admin CMS routes
adminApproachRouter.use(authenticate);

// Full Approach page settings
adminApproachRouter.get('/', requireRole(['VIEWER', 'EDITOR', 'ADMIN', 'SUPER_ADMIN']), getAdminApproach);
adminApproachRouter.put('/', requireRole(['EDITOR', 'ADMIN', 'SUPER_ADMIN']), updateAdminApproach);

// Single section endpoints
adminApproachRouter.get('/sections/:section', requireRole(['VIEWER', 'EDITOR', 'ADMIN', 'SUPER_ADMIN']), getApproachSection);
adminApproachRouter.put('/sections/:section', requireRole(['EDITOR', 'ADMIN', 'SUPER_ADMIN']), updateApproachSection);
