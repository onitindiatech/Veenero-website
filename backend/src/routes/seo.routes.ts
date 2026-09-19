import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { listAllPagesSeo, updatePageSeo } from '../controllers/seo.controller';

export const adminSeoRouter = Router();

adminSeoRouter.use(authenticate);

adminSeoRouter.get('/', requireRole(['VIEWER', 'EDITOR', 'ADMIN', 'SUPER_ADMIN']), listAllPagesSeo);
adminSeoRouter.put('/:pageKey', requireRole(['EDITOR', 'ADMIN', 'SUPER_ADMIN']), updatePageSeo);

export default adminSeoRouter;
