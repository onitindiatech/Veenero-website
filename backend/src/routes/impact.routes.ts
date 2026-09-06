import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import {
  getPublicImpact,
  getAdminImpactSettings,
  updateAdminImpactSettings,
  updateAdminImpactSection,
} from '../controllers/impact.controller';

// ─── Public Router ───────────────────────────────────────────────────────────
export const publicImpactRouter = Router();
publicImpactRouter.get('/', getPublicImpact);

// ─── Admin Router ────────────────────────────────────────────────────────────
export const adminImpactRouter = Router();
adminImpactRouter.use(authenticate);

adminImpactRouter.get(
  '/',
  requireRole(['VIEWER', 'EDITOR', 'ADMIN', 'SUPER_ADMIN']),
  getAdminImpactSettings
);

adminImpactRouter.put(
  '/',
  requireRole(['EDITOR', 'ADMIN', 'SUPER_ADMIN']),
  updateAdminImpactSettings
);

adminImpactRouter.put(
  '/:sectionKey',
  requireRole(['EDITOR', 'ADMIN', 'SUPER_ADMIN']),
  updateAdminImpactSection
);
