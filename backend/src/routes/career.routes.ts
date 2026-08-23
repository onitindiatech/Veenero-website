import { Router } from 'express';
import {
  getPublicCareers,
  getPublicCareerBySlug,
  getAdminCareers,
  getAdminCareerById,
  createCareer,
  updateCareer,
  updateCareerStatus,
  duplicateCareer,
  softDeleteCareer,
  getRecycleBin,
  restoreCareer,
  permanentlyDeleteCareer,
} from '../controllers/career.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

// ─── PUBLIC ROUTER ───────────────────────────────────────────────────────────
export const publicRouter = Router();

publicRouter.get('/', getPublicCareers);
publicRouter.get('/:slug', getPublicCareerBySlug);

// ─── ADMIN ROUTER ────────────────────────────────────────────────────────────
export const adminRouter = Router();

adminRouter.use(authenticate);

adminRouter.get('/', requireRole(['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'VIEWER']), getAdminCareers);
adminRouter.get('/recycle-bin', requireRole(['SUPER_ADMIN', 'ADMIN', 'VIEWER']), getRecycleBin);
adminRouter.get('/:id', requireRole(['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'VIEWER']), getAdminCareerById);
adminRouter.post('/', requireRole(['SUPER_ADMIN', 'ADMIN', 'EDITOR']), createCareer);
adminRouter.put('/:id', requireRole(['SUPER_ADMIN', 'ADMIN', 'EDITOR']), updateCareer);
adminRouter.patch('/:id/status', requireRole(['SUPER_ADMIN', 'ADMIN', 'EDITOR']), updateCareerStatus);
adminRouter.post('/:id/duplicate', requireRole(['SUPER_ADMIN', 'ADMIN', 'EDITOR']), duplicateCareer);
adminRouter.patch('/:id/restore', requireRole(['SUPER_ADMIN', 'ADMIN']), restoreCareer);
adminRouter.delete('/:id/permanent', requireRole(['SUPER_ADMIN', 'ADMIN']), permanentlyDeleteCareer);
adminRouter.delete('/:id', requireRole(['SUPER_ADMIN', 'ADMIN']), softDeleteCareer);
