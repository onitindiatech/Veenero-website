import { Request, Response, NextFunction } from 'express';
import { ActivityLogModel } from '../models/ActivityLog';

export const listActivityLogsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { module, action, search, user, page = '1', limit = '50' } = req.query as Record<string, string>;

    const filter: Record<string, any> = {};

    if (module && module !== 'all') {
      filter.module = new RegExp(`^${module}$`, 'i');
    }

    if (action && action !== 'all') {
      filter.action = new RegExp(`^${action}$`, 'i');
    }

    if (user && user !== 'all') {
      filter['$or'] = [
        { 'user.name': new RegExp(user, 'i') },
        { 'user.email': new RegExp(user, 'i') },
      ];
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter['$or'] = [
        { description: searchRegex },
        { entity: searchRegex },
        { 'user.name': searchRegex },
        { 'user.email': searchRegex },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const pageSize = Math.min(100, Math.max(10, parseInt(limit, 10) || 50));
    const skip = (pageNum - 1) * pageSize;

    const [logs, total] = await Promise.all([
      ActivityLogModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      ActivityLogModel.countDocuments(filter),
    ]);

    // Aggregate statistics
    const [moduleCounts, actionCounts] = await Promise.all([
      ActivityLogModel.aggregate([
        { $group: { _id: '$module', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      ActivityLogModel.aggregate([
        { $group: { _id: '$action', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    res.status(200).json({
      success: true,
      data: logs.map((l: any) => ({
        id: String(l._id),
        user: l.user,
        action: l.action,
        module: l.module,
        entity: l.entity,
        entityId: l.entityId,
        description: l.description,
        metadata: l.metadata,
        ip: l.ip,
        userAgent: l.userAgent,
        createdAt: l.createdAt,
      })),
      pagination: {
        page: pageNum,
        limit: pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
      stats: {
        total,
        modules: moduleCounts.map((m) => ({ module: m._id, count: m.count })),
        actions: actionCounts.map((a) => ({ action: a._id, count: a.count })),
      },
    });
  } catch (error) {
    next(error);
  }
};
