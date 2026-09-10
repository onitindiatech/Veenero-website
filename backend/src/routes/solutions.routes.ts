import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import {
  getPublicSolutions,
  getAdminSolutions,
  updateAdminSolutions,
  getSolutionsSection,
  updateSolutionsSection,
  createCategory,
  updateCategory,
  deleteCategory,
  createSolutionItem,
  updateSolutionItem,
  deleteSolutionItem,
  getPublicSolutionBySlug,
} from '../controllers/solutions.controller';

// ─── Public Router ────────────────────────────────────────────────────────────
export const publicSolutionsRouter = Router();

publicSolutionsRouter.get('/', getPublicSolutions);
publicSolutionsRouter.get('/detail/:slug', getPublicSolutionBySlug);
publicSolutionsRouter.get('/:slug', getPublicSolutionBySlug);

// ─── Admin Router ─────────────────────────────────────────────────────────────
export const adminSolutionsRouter = Router();

// All admin endpoints require authentication
adminSolutionsRouter.use(authenticate);

// GET /api/admin/solutions — Full Solutions page settings
adminSolutionsRouter.get('/', requireRole(['VIEWER', 'EDITOR', 'ADMIN', 'SUPER_ADMIN']), getAdminSolutions);

// PUT /api/admin/solutions — Update entire settings document
adminSolutionsRouter.put('/', requireRole(['EDITOR', 'ADMIN', 'SUPER_ADMIN']), updateAdminSolutions);

// Section-level endpoints
adminSolutionsRouter.get('/sections/:section', requireRole(['VIEWER', 'EDITOR', 'ADMIN', 'SUPER_ADMIN']), getSolutionsSection);
adminSolutionsRouter.put('/sections/:section', requireRole(['EDITOR', 'ADMIN', 'SUPER_ADMIN']), updateSolutionsSection);

// Categories CRUD
adminSolutionsRouter.post('/categories', requireRole(['EDITOR', 'ADMIN', 'SUPER_ADMIN']), createCategory);
adminSolutionsRouter.put('/categories/:id', requireRole(['EDITOR', 'ADMIN', 'SUPER_ADMIN']), updateCategory);
adminSolutionsRouter.delete('/categories/:id', requireRole(['ADMIN', 'SUPER_ADMIN']), deleteCategory);

// Solutions items CRUD
adminSolutionsRouter.post('/items', requireRole(['EDITOR', 'ADMIN', 'SUPER_ADMIN']), createSolutionItem);
adminSolutionsRouter.put('/items/:id', requireRole(['EDITOR', 'ADMIN', 'SUPER_ADMIN']), updateSolutionItem);
adminSolutionsRouter.delete('/items/:id', requireRole(['ADMIN', 'SUPER_ADMIN']), deleteSolutionItem);
