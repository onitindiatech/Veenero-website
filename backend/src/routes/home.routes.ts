import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import {
  getPublicHome,
  getAdminHome,
  updateAdminHome,
  getHomeSection,
  updateHomeSection,
  getSolutionsCollection,
  createSolutionItem,
  updateSolutionItem,
  deleteSolutionItem,
  reorderSolutionsCollection,
  getPartnersCollection,
  createPartnerItem,
  updatePartnerItem,
  deletePartnerItem,
} from '../controllers/home.controller';

// ─── Public Router ────────────────────────────────────────────────────────────
export const publicHomeRouter = Router();

publicHomeRouter.get('/', getPublicHome);

// ─── Admin Router ─────────────────────────────────────────────────────────────
export const adminHomeRouter = Router();

// All admin endpoints require authentication
adminHomeRouter.use(authenticate);

// GET /api/admin/home — VIEWER, EDITOR, ADMIN, SUPER_ADMIN
adminHomeRouter.get('/', requireRole(['VIEWER', 'EDITOR', 'ADMIN', 'SUPER_ADMIN']), getAdminHome);

// PUT /api/admin/home — EDITOR, ADMIN, SUPER_ADMIN
adminHomeRouter.put('/', requireRole(['EDITOR', 'ADMIN', 'SUPER_ADMIN']), updateAdminHome);

// Section-level endpoints
adminHomeRouter.get('/sections/:section', requireRole(['VIEWER', 'EDITOR', 'ADMIN', 'SUPER_ADMIN']), getHomeSection);
adminHomeRouter.put('/sections/:section', requireRole(['EDITOR', 'ADMIN', 'SUPER_ADMIN']), updateHomeSection);

// Repeatable Solutions collection endpoints
adminHomeRouter.get('/solutions', requireRole(['VIEWER', 'EDITOR', 'ADMIN', 'SUPER_ADMIN']), getSolutionsCollection);
adminHomeRouter.post('/solutions', requireRole(['EDITOR', 'ADMIN', 'SUPER_ADMIN']), createSolutionItem);
adminHomeRouter.put('/solutions/:index', requireRole(['EDITOR', 'ADMIN', 'SUPER_ADMIN']), updateSolutionItem);
adminHomeRouter.delete('/solutions/:index', requireRole(['EDITOR', 'ADMIN', 'SUPER_ADMIN']), deleteSolutionItem);
adminHomeRouter.post('/solutions/reorder', requireRole(['EDITOR', 'ADMIN', 'SUPER_ADMIN']), reorderSolutionsCollection);

// Repeatable Partners collection endpoints
adminHomeRouter.get('/partners', requireRole(['VIEWER', 'EDITOR', 'ADMIN', 'SUPER_ADMIN']), getPartnersCollection);
adminHomeRouter.post('/partners', requireRole(['EDITOR', 'ADMIN', 'SUPER_ADMIN']), createPartnerItem);
adminHomeRouter.put('/partners/:index', requireRole(['EDITOR', 'ADMIN', 'SUPER_ADMIN']), updatePartnerItem);
adminHomeRouter.delete('/partners/:index', requireRole(['EDITOR', 'ADMIN', 'SUPER_ADMIN']), deletePartnerItem);

