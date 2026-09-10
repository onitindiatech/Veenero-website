import { Router } from 'express';
import {
  uploadResumeMiddleware,
  submitJobApplication,
  getAdminApplications,
  getAdminApplicationById,
  updateApplicationStatus,
  sendDecisionEmailAction,
  deleteApplication,
} from '../controllers/application.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

// ─── Public Application Router ────────────────────────────────────────────────
export const publicApplicationRouter = Router();

// POST /api/applications/apply (or /api/applications)
publicApplicationRouter.post('/apply', uploadResumeMiddleware, submitJobApplication);
publicApplicationRouter.post('/', uploadResumeMiddleware, submitJobApplication);

// ─── Admin Application Router ─────────────────────────────────────────────────
export const adminApplicationRouter = Router();

adminApplicationRouter.use(authenticate);

// GET /api/admin/applications
adminApplicationRouter.get('/', requireRole(['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'VIEWER']), getAdminApplications);

// GET /api/admin/applications/:id
adminApplicationRouter.get('/:id', requireRole(['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'VIEWER']), getAdminApplicationById);

// PATCH /api/admin/applications/:id/status
adminApplicationRouter.patch('/:id/status', requireRole(['SUPER_ADMIN', 'ADMIN', 'EDITOR']), updateApplicationStatus);

// POST /api/admin/applications/:id/decision-email
adminApplicationRouter.post('/:id/decision-email', requireRole(['SUPER_ADMIN', 'ADMIN', 'EDITOR']), sendDecisionEmailAction);

// DELETE /api/admin/applications/:id
adminApplicationRouter.delete('/:id', requireRole(['SUPER_ADMIN', 'ADMIN']), deleteApplication);

export default {
  publicApplicationRouter,
  adminApplicationRouter,
};
