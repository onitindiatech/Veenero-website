import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import {
  getPublicFooter,
  getAdminFooterSettings,
  updateAdminFooterSettings,
} from '../controllers/footer.controller';

export const publicFooterRouter = Router();
publicFooterRouter.get('/', getPublicFooter);

export const adminFooterRouter = Router();
adminFooterRouter.use(authenticate);

adminFooterRouter.get('/', requireRole(['VIEWER', 'EDITOR', 'ADMIN', 'SUPER_ADMIN']), getAdminFooterSettings);
adminFooterRouter.put('/', requireRole(['EDITOR', 'ADMIN', 'SUPER_ADMIN']), updateAdminFooterSettings);
