import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import {
  getPublicNavigation,
  getAdminNavigation,
  updateAdminNavigation,
} from '../controllers/navigation.controller';

// ── Public Router ─────────────────────────────────────────────────────────────
export const publicNavigationRouter = Router();
publicNavigationRouter.get('/', getPublicNavigation);

// ── Admin Router ──────────────────────────────────────────────────────────────
export const adminNavigationRouter = Router();
adminNavigationRouter.use(authenticate);

adminNavigationRouter.get('/', requireRole(['VIEWER', 'EDITOR', 'ADMIN', 'SUPER_ADMIN']), getAdminNavigation);
adminNavigationRouter.put('/', requireRole(['EDITOR', 'ADMIN', 'SUPER_ADMIN']), updateAdminNavigation);

export default {
  publicNavigationRouter,
  adminNavigationRouter,
};
