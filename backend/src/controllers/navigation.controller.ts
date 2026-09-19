import { Request, Response, NextFunction } from 'express';
import { NavigationModel, DEFAULT_NAVIGATION_ITEMS } from '../models/Navigation';
import { logActivity } from '../services/activityLog.service';

async function getOrCreateNavigation() {
  let nav = await NavigationModel.findOne();
  if (!nav) {
    nav = await NavigationModel.create({
      items: DEFAULT_NAVIGATION_ITEMS,
      cta: {
        label: 'Get in Touch',
        path: '/contact',
        isActive: true,
        openInNewTab: false,
      },
    });
  }
  return nav;
}

// GET /api/navigation (Public)
export const getPublicNavigation = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const nav = await getOrCreateNavigation();
    const activeItems = (nav.items || [])
      .filter((i) => i.isActive)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((i) => ({
        id: i.id,
        label: i.label,
        path: i.path,
        isExternal: i.isExternal,
        openInNewTab: i.openInNewTab,
        icon: i.icon,
        children: (i.children || [])
          .filter((c) => c.isActive)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
      }));

    res.status(200).json({
      success: true,
      data: {
        items: activeItems,
        cta: nav.cta,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/navigation (Admin)
export const getAdminNavigation = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const nav = await getOrCreateNavigation();
    res.status(200).json({
      success: true,
      data: {
        items: (nav.items || []).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
        cta: nav.cta,
        updatedAt: nav.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/navigation (Admin)
export const updateAdminNavigation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { items, cta } = req.body;
    let nav = await NavigationModel.findOne();
    if (!nav) {
      nav = new NavigationModel();
    }

    if (Array.isArray(items)) {
      nav.items = items;
    }
    if (cta && typeof cta === 'object') {
      nav.cta = {
        label: typeof cta.label === 'string' ? cta.label.trim() : nav.cta.label,
        path: typeof cta.path === 'string' ? cta.path.trim() : nav.cta.path,
        isActive: typeof cta.isActive === 'boolean' ? cta.isActive : nav.cta.isActive,
        openInNewTab: typeof cta.openInNewTab === 'boolean' ? cta.openInNewTab : nav.cta.openInNewTab,
      };
    }

    nav.updatedBy = (req as any).user?.email || 'admin';
    await nav.save();

    await logActivity({
      req,
      action: 'UPDATE',
      module: 'Navigation',
      entity: 'Header Navigation & CTA',
      description: `Updated header navigation items (${nav.items.length} items)`,
      metadata: { itemsCount: nav.items.length, cta: nav.cta },
    });

    res.status(200).json({
      success: true,
      data: {
        items: nav.items,
        cta: nav.cta,
        updatedAt: nav.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};
