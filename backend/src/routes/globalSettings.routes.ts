import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import {
  getPublicGlobalSettings,
  getPublicSocialLinks,
  getAdminGlobalSettings,
  updateAdminGlobalSettings,
  getAdminSocialLinks,
  createAdminSocialLink,
  updateAdminSocialLink,
  deleteAdminSocialLink,
  reorderAdminSocialLinks,
  toggleAdminSocialLink,
} from '../controllers/globalSettings.controller';

// ── Public Router ─────────────────────────────────────────────────────────────
export const publicGlobalSettingsRouter = Router();
publicGlobalSettingsRouter.get('/', getPublicGlobalSettings);
publicGlobalSettingsRouter.get('/social-links', getPublicSocialLinks);

// ── Admin Router ──────────────────────────────────────────────────────────────
export const adminGlobalSettingsRouter = Router();
adminGlobalSettingsRouter.use(authenticate);

// Settings
adminGlobalSettingsRouter.get(
  '/',
  requireRole(['VIEWER', 'EDITOR', 'ADMIN', 'SUPER_ADMIN']),
  getAdminGlobalSettings
);
adminGlobalSettingsRouter.put(
  '/',
  requireRole(['EDITOR', 'ADMIN', 'SUPER_ADMIN']),
  updateAdminGlobalSettings
);

// Social & Contact Links CRUD
adminGlobalSettingsRouter.get(
  '/social-links',
  requireRole(['VIEWER', 'EDITOR', 'ADMIN', 'SUPER_ADMIN']),
  getAdminSocialLinks
);
adminGlobalSettingsRouter.post(
  '/social-links',
  requireRole(['EDITOR', 'ADMIN', 'SUPER_ADMIN']),
  createAdminSocialLink
);
adminGlobalSettingsRouter.patch(
  '/social-links/reorder',
  requireRole(['EDITOR', 'ADMIN', 'SUPER_ADMIN']),
  reorderAdminSocialLinks
);
adminGlobalSettingsRouter.put(
  '/social-links/:id',
  requireRole(['EDITOR', 'ADMIN', 'SUPER_ADMIN']),
  updateAdminSocialLink
);
adminGlobalSettingsRouter.patch(
  '/social-links/:id',
  requireRole(['EDITOR', 'ADMIN', 'SUPER_ADMIN']),
  updateAdminSocialLink
);
adminGlobalSettingsRouter.delete(
  '/social-links/:id',
  requireRole(['EDITOR', 'ADMIN', 'SUPER_ADMIN']),
  deleteAdminSocialLink
);
adminGlobalSettingsRouter.patch(
  '/social-links/:id/toggle',
  requireRole(['EDITOR', 'ADMIN', 'SUPER_ADMIN']),
  toggleAdminSocialLink
);

export default {
  publicGlobalSettingsRouter,
  adminGlobalSettingsRouter,
};
