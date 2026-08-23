import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import {
  getPublicPosts,
  getPublicPostBySlug,
  getPublicSettings,
  getAdminPosts,
  getAdminPostById,
  createPost,
  updatePost,
  updatePostStatus,
  toggleFeatured,
  duplicatePost,
  softDeletePost,
  getRecycleBin,
  restorePost,
  permanentlyDeletePost,
  getAdminSettings,
  updateAdminSettings,
} from '../controllers/blog.controller';

// ─── Public Router ────────────────────────────────────────────────────────────
export const publicBlogRouter = Router();

// Settings must be before /:slug to avoid route collision
publicBlogRouter.get('/settings', getPublicSettings);
publicBlogRouter.get('/', getPublicPosts);
publicBlogRouter.get('/:slug', getPublicPostBySlug);

// ─── Admin Router ─────────────────────────────────────────────────────────────
export const adminBlogRouter = Router();

// All admin routes require authentication
adminBlogRouter.use(authenticate);

// Settings — EDITOR+
adminBlogRouter.get(
  '/settings',
  requireRole(['VIEWER', 'EDITOR', 'ADMIN']),
  getAdminSettings
);
adminBlogRouter.put(
  '/settings',
  requireRole(['EDITOR', 'ADMIN']),
  updateAdminSettings
);

// Recycle bin — ADMIN+
adminBlogRouter.get(
  '/recycle-bin',
  requireRole(['ADMIN', 'VIEWER']),
  getRecycleBin
);
adminBlogRouter.patch(
  '/:id/restore',
  requireRole(['ADMIN']),
  restorePost
);
adminBlogRouter.delete(
  '/:id/permanent',
  requireRole(['ADMIN']),
  permanentlyDeletePost
);

// Post list + create — VIEWER read, EDITOR+ write
adminBlogRouter.get(
  '/',
  requireRole(['VIEWER', 'EDITOR', 'ADMIN']),
  getAdminPosts
);
adminBlogRouter.post(
  '/',
  requireRole(['EDITOR', 'ADMIN']),
  createPost
);

// Individual post operations
adminBlogRouter.get(
  '/:id',
  requireRole(['VIEWER', 'EDITOR', 'ADMIN']),
  getAdminPostById
);
adminBlogRouter.put(
  '/:id',
  requireRole(['EDITOR', 'ADMIN']),
  updatePost
);
adminBlogRouter.patch(
  '/:id/status',
  requireRole(['EDITOR', 'ADMIN']),
  updatePostStatus
);
adminBlogRouter.patch(
  '/:id/featured',
  requireRole(['EDITOR', 'ADMIN']),
  toggleFeatured
);
adminBlogRouter.post(
  '/:id/duplicate',
  requireRole(['EDITOR', 'ADMIN']),
  duplicatePost
);
adminBlogRouter.delete(
  '/:id',
  requireRole(['ADMIN']),
  softDeletePost
);
