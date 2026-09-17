import { Router } from 'express';
import { getDashboardStats, exportCmsBackup } from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

export const adminDashboardRouter = Router();

// All dashboard endpoints require authentication
adminDashboardRouter.use(authenticate);

// GET /api/admin/dashboard/stats - Real aggregated CMS stats, trends, feeds
adminDashboardRouter.get(
  '/stats',
  requireRole(['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'VIEWER']),
  getDashboardStats
);

// GET /api/admin/dashboard/backup - Full CMS database snapshot export
adminDashboardRouter.get(
  '/backup',
  requireRole(['SUPER_ADMIN', 'ADMIN']),
  exportCmsBackup
);

export default adminDashboardRouter;
