import { Request, Response, NextFunction } from 'express';
import { GlobalSettingsModel } from '../models/GlobalSettings';
import { logActivity } from '../services/activityLog.service';

async function getOrCreateGlobalSettings() {
  let settings = await GlobalSettingsModel.findOne();
  if (!settings) {
    settings = await GlobalSettingsModel.create({});
  }
  return settings;
}

// GET /api/global-settings (Public)
export const getPublicGlobalSettings = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const settings = await getOrCreateGlobalSettings();
    res.status(200).json({
      success: true,
      data: {
        general: settings.general,
        brand: settings.brand,
        contact: settings.contact,
        social: settings.social,
        behavior: {
          maintenanceMode: settings.behavior.maintenanceMode,
          cookieConsentEnabled: settings.behavior.cookieConsentEnabled,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/global-settings (Admin)
export const getAdminGlobalSettings = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const settings = await getOrCreateGlobalSettings();
    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/global-settings (Admin)
export const updateAdminGlobalSettings = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const settings = await getOrCreateGlobalSettings();

    const { general, brand, contact, social, behavior } = req.body;

    if (general && typeof general === 'object') {
      settings.general = { ...settings.general, ...general };
    }
    if (brand && typeof brand === 'object') {
      settings.brand = { ...settings.brand, ...brand };
    }
    if (contact && typeof contact === 'object') {
      settings.contact = { ...settings.contact, ...contact };
    }
    if (social && typeof social === 'object') {
      settings.social = { ...settings.social, ...social };
    }
    if (behavior && typeof behavior === 'object') {
      settings.behavior = { ...settings.behavior, ...behavior };
    }

    settings.updatedBy = (req as any).user?.email || 'admin';
    await settings.save();

    await logActivity({
      req,
      action: 'SETTINGS_UPDATED',
      module: 'Global Settings',
      entity: 'Global Website Settings',
      description: 'Updated global site configuration',
      metadata: { general: settings.general, contact: settings.contact },
    });

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};
