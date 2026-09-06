import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import {
  getPublicAbout,
  getAdminAbout,
  updateAdminAbout,
  getAboutSection,
  updateAboutSection,
} from '../controllers/about.controller';

// ─── Public Router ────────────────────────────────────────────────────────────
export const publicAboutRouter = Router();

publicAboutRouter.get('/', getPublicAbout);

// ─── Admin Router ─────────────────────────────────────────────────────────────
export const adminAboutRouter = Router();

// All admin endpoints require authentication
adminAboutRouter.use(authenticate);

// GET /api/admin/about — Full about page settings
adminAboutRouter.get('/', requireRole(['VIEWER', 'EDITOR', 'ADMIN', 'SUPER_ADMIN']), getAdminAbout);

// PUT /api/admin/about — Update entire settings document
adminAboutRouter.put('/', requireRole(['EDITOR', 'ADMIN', 'SUPER_ADMIN']), updateAdminAbout);

// Section-level endpoints
adminAboutRouter.get('/sections/:section', requireRole(['VIEWER', 'EDITOR', 'ADMIN', 'SUPER_ADMIN']), getAboutSection);
adminAboutRouter.put('/sections/:section', requireRole(['EDITOR', 'ADMIN', 'SUPER_ADMIN']), updateAboutSection);
