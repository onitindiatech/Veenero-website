import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import {
  getPublicContact,
  submitContactInquiry,
  submitDemoRequest,
  getAdminContactSettings,
  updateAdminContactSettings,
  updateAdminContactSection,
  getAdminLeads,
  getAdminLeadById,
  updateLeadStatus,
  deleteLead,
} from '../controllers/contact.controller';

// ─── Public Router ───────────────────────────────────────────────────────────
export const publicContactRouter = Router();

// GET /api/contact
publicContactRouter.get('/', getPublicContact);

// POST /api/contact/submit
publicContactRouter.post('/submit', submitContactInquiry);

// POST /api/contact/demo
publicContactRouter.post('/demo', submitDemoRequest);

// ─── Admin Router ────────────────────────────────────────────────────────────
export const adminContactRouter = Router();
adminContactRouter.use(authenticate);

// Page Settings
adminContactRouter.get('/', requireRole(['VIEWER', 'EDITOR', 'ADMIN', 'SUPER_ADMIN']), getAdminContactSettings);
adminContactRouter.put('/', requireRole(['EDITOR', 'ADMIN', 'SUPER_ADMIN']), updateAdminContactSettings);
adminContactRouter.put('/:sectionKey', requireRole(['EDITOR', 'ADMIN', 'SUPER_ADMIN']), updateAdminContactSection);

// Leads Management (mounted at /api/admin/contact/leads)
adminContactRouter.get('/leads', requireRole(['VIEWER', 'EDITOR', 'ADMIN', 'SUPER_ADMIN']), getAdminLeads);
adminContactRouter.get('/leads/all', requireRole(['VIEWER', 'EDITOR', 'ADMIN', 'SUPER_ADMIN']), getAdminLeads);
adminContactRouter.get('/leads/:id', requireRole(['VIEWER', 'EDITOR', 'ADMIN', 'SUPER_ADMIN']), getAdminLeadById);
adminContactRouter.patch('/leads/:id/status', requireRole(['EDITOR', 'ADMIN', 'SUPER_ADMIN']), updateLeadStatus);
adminContactRouter.delete('/leads/:id', requireRole(['ADMIN', 'SUPER_ADMIN']), deleteLead);

// Dedicated Router for /api/admin/leads
export const adminLeadsRouter = Router();
adminLeadsRouter.use(authenticate);
adminLeadsRouter.get('/', requireRole(['VIEWER', 'EDITOR', 'ADMIN', 'SUPER_ADMIN']), getAdminLeads);
adminLeadsRouter.get('/all', requireRole(['VIEWER', 'EDITOR', 'ADMIN', 'SUPER_ADMIN']), getAdminLeads);
adminLeadsRouter.get('/:id', requireRole(['VIEWER', 'EDITOR', 'ADMIN', 'SUPER_ADMIN']), getAdminLeadById);
adminLeadsRouter.patch('/:id/status', requireRole(['EDITOR', 'ADMIN', 'SUPER_ADMIN']), updateLeadStatus);
adminLeadsRouter.delete('/:id', requireRole(['ADMIN', 'SUPER_ADMIN']), deleteLead);

