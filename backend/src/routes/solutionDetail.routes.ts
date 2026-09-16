import { Router } from 'express';
import {
  getPublicSolutionDetailBySlug,
  getPublicSolutionDetailsList,
  getAdminSolutionDetails,
  getRecycleBin,
  getAdminSolutionDetailById,
  createSolutionDetail,
  updateSolutionDetail,
  updateSolutionStatus,
  duplicateSolutionDetail,
  softDeleteSolutionDetail,
  restoreSolutionDetail,
  permanentlyDeleteSolutionDetail,
  reorderSolutionDetails,
} from '../controllers/solutionDetail.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

// ─── PUBLIC ROUTER ───────────────────────────────────────────────────────────
export const publicSolutionDetailRouter = Router();

publicSolutionDetailRouter.get('/', getPublicSolutionDetailsList);
publicSolutionDetailRouter.get('/:slug', getPublicSolutionDetailBySlug);

// ─── ADMIN ROUTER ────────────────────────────────────────────────────────────
export const adminSolutionDetailRouter = Router();

adminSolutionDetailRouter.use(authenticate);

adminSolutionDetailRouter.get(
  '/',
  requireRole(['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'VIEWER']),
  getAdminSolutionDetails
);
adminSolutionDetailRouter.get(
  '/recycle-bin',
  requireRole(['SUPER_ADMIN', 'ADMIN', 'VIEWER']),
  getRecycleBin
);
adminSolutionDetailRouter.patch(
  '/reorder',
  requireRole(['SUPER_ADMIN', 'ADMIN', 'EDITOR']),
  reorderSolutionDetails
);
adminSolutionDetailRouter.get(
  '/:id',
  requireRole(['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'VIEWER']),
  getAdminSolutionDetailById
);
adminSolutionDetailRouter.post(
  '/',
  requireRole(['SUPER_ADMIN', 'ADMIN', 'EDITOR']),
  createSolutionDetail
);
adminSolutionDetailRouter.put(
  '/:id',
  requireRole(['SUPER_ADMIN', 'ADMIN', 'EDITOR']),
  updateSolutionDetail
);
adminSolutionDetailRouter.patch(
  '/:id/status',
  requireRole(['SUPER_ADMIN', 'ADMIN', 'EDITOR']),
  updateSolutionStatus
);
adminSolutionDetailRouter.post(
  '/:id/duplicate',
  requireRole(['SUPER_ADMIN', 'ADMIN', 'EDITOR']),
  duplicateSolutionDetail
);
adminSolutionDetailRouter.patch(
  '/:id/restore',
  requireRole(['SUPER_ADMIN', 'ADMIN']),
  restoreSolutionDetail
);
adminSolutionDetailRouter.delete(
  '/:id/permanent',
  requireRole(['SUPER_ADMIN', 'ADMIN']),
  permanentlyDeleteSolutionDetail
);
adminSolutionDetailRouter.delete(
  '/:id',
  requireRole(['SUPER_ADMIN', 'ADMIN']),
  softDeleteSolutionDetail
);
