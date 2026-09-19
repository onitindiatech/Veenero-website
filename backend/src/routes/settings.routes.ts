import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { getAdminSettings, updateAdminSettings } from '../controllers/settings.controller';

export const adminSettingsRouter = Router();

adminSettingsRouter.use(authenticate);

adminSettingsRouter.get('/', requireRole(['VIEWER', 'EDITOR', 'ADMIN', 'SUPER_ADMIN']), getAdminSettings);
adminSettingsRouter.put('/', requireRole(['ADMIN', 'SUPER_ADMIN']), updateAdminSettings);

export default adminSettingsRouter;
