import { Router } from 'express';
import {
  getPages,
  getPageById,
  createPage,
  updatePage,
  deletePage,
  publishPage,
} from '../controllers/cmsPage.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();

// Require authentication for all CMS page actions
router.use(authenticate);

router.get('/', requireRole(['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'VIEWER']), getPages);
router.get('/:id', requireRole(['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'VIEWER']), getPageById);
router.post('/', requireRole(['SUPER_ADMIN', 'ADMIN']), createPage);
router.put('/:id', requireRole(['SUPER_ADMIN', 'ADMIN', 'EDITOR']), updatePage);
router.delete('/:id', requireRole(['SUPER_ADMIN', 'ADMIN']), deletePage);
router.patch('/:id/publish', requireRole(['SUPER_ADMIN', 'ADMIN', 'EDITOR']), publishPage);

export default router;
