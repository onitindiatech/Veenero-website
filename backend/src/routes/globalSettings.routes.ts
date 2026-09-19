import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import {
  getPublicGlobalSettings,
  getAdminGlobalSettings,
  updateAdminGlobalSettings,
} from '../controllers/globalSettings.controller';

// ── Public Router ─────────────────────────────────────────────────────────────
export const publicGlobalSettingsRouter = Router();
publicGlobalSettingsRouter.get('/', getPublicGlobalSettings);

// ── Admin Router ──────────────────────────────────────────────────────────────
export const adminGlobalSettingsRouter = Router();
adminGlobalSettingsRouter.use(authenticate);

adminGlobalSettingsRouter.get('/', requireRole(['VIEWER', 'EDITOR', 'ADMIN', 'SUPER_ADMIN']), getAdminGlobalSettings);
adminGlobalSettingsRouter.put('/', requireRole(['EDITOR', 'ADMIN', 'SUPER_ADMIN']), updateAdminGlobalSettings);

export default {
  publicGlobalSettingsRouter,
  adminGlobalSettingsRouter,
};
