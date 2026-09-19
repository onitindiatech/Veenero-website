import { Request } from 'express';
import { ActivityLogModel } from '../models/ActivityLog';

export interface LogActivityParams {
  req?: Request;
  action: string;
  module: string;
  entity?: string;
  entityId?: string;
  description: string;
  metadata?: Record<string, any>;
  userOverride?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export async function logActivity(params: LogActivityParams): Promise<void> {
  try {
    const { req, action, module, entity, entityId, description, metadata, userOverride } = params;

    let user = userOverride;
    if (!user && req && (req as any).user) {
      const u = (req as any).user;
      user = {
        id: String(u._id || u.id || ''),
        name: u.name || u.email || 'Admin',
        email: u.email || '',
        role: u.role || 'ADMIN',
      };
    }

    if (!user) {
      user = {
        id: 'system',
        name: 'System / Background',
        email: 'system@veenero.com',
        role: 'SUPER_ADMIN',
      };
    }

    const ip = req ? (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || '' : '';
    const userAgent = req ? req.headers['user-agent'] || '' : '';

    await ActivityLogModel.create({
      user,
      action,
      module,
      entity: entity || '',
      entityId: entityId || '',
      description,
      metadata: metadata || {},
      ip,
      userAgent,
    });
  } catch (err) {
    console.error('[ActivityLog] Failed to record activity log:', err);
  }
}
