import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { listActivityLogsHandler } from '../controllers/activityLog.controller';

const router = Router();

router.use(authenticate);

// GET /api/admin/activity-logs
router.get('/', requireRole(['VIEWER', 'EDITOR', 'ADMIN', 'SUPER_ADMIN']), listActivityLogsHandler);

export default router;
