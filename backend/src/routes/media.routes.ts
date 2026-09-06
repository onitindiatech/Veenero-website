import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { uploadMiddleware } from '../middleware/upload.middleware';
import {
  uploadMediaHandler,
  deleteMediaHandler,
  hardDeleteMediaHandler,
  listMediaHandler,
  updateMediaHandler,
  restoreMediaHandler,
  replaceMediaHandler,
  getPublicAssetBySlot,
} from '../controllers/media.controller';

// ─── Public Media Router (no auth) ───────────────────────────────────────────
// GET /api/media/asset?page=&section=&slot=
export const publicMediaRouter = Router();

publicMediaRouter.get('/asset', getPublicAssetBySlot);

// ─── Admin Media Router ───────────────────────────────────────────────────────
// All media management routes require admin authentication.
const adminMediaRouter = Router();

adminMediaRouter.use(authenticate);

// GET /api/admin/media?folder=&type=&search=&deleted=true
adminMediaRouter.get('/', requireRole(['VIEWER', 'EDITOR', 'ADMIN', 'SUPER_ADMIN']), listMediaHandler);

// POST /api/admin/media/upload
adminMediaRouter.post('/upload', requireRole(['ADMIN', 'SUPER_ADMIN']), uploadMiddleware.single('file'), uploadMediaHandler);

// POST /api/admin/media/:publicId/replace  — in-place replacement (must come before generic PATCH)
adminMediaRouter.post('/:publicId(*)/replace', requireRole(['ADMIN', 'SUPER_ADMIN']), uploadMiddleware.single('file'), replaceMediaHandler);

// PATCH /api/admin/media/:publicId/restore  (must come before generic PATCH)
adminMediaRouter.patch('/:publicId(*)/restore', requireRole(['ADMIN', 'SUPER_ADMIN']), restoreMediaHandler);

// DELETE /api/admin/media/:publicId/permanent (permanent hard deletion)
adminMediaRouter.delete('/:publicId(*)/permanent', requireRole(['ADMIN', 'SUPER_ADMIN']), hardDeleteMediaHandler);

// PATCH /api/admin/media/:publicId  — update displayName, altText, tags
adminMediaRouter.patch('/:publicId(*)', requireRole(['ADMIN', 'SUPER_ADMIN']), updateMediaHandler);

// DELETE /api/admin/media/:publicId  — soft delete
adminMediaRouter.delete('/:publicId(*)', requireRole(['ADMIN', 'SUPER_ADMIN']), deleteMediaHandler);

export { adminMediaRouter };
