import { Request, Response, NextFunction } from 'express';
import { ApproachPageSettingsModel, IApproachPageSettings } from '../models/ApproachPageSettings';
import { resolveApproachMedia } from '../services/mediaSync.service';

/**
 * Helper to ensure a singleton ApproachPageSettings document exists.
 */
async function getOrCreateApproachSettings(): Promise<IApproachPageSettings> {
  let doc = await ApproachPageSettingsModel.findOne();
  if (!doc) {
    doc = await ApproachPageSettingsModel.create({});
  }
  return doc;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * GET /api/approach
 * Returns the published Approach page settings for the public website.
 * Resolves active Media Library assets dynamically for all approach page slots.
 */
export const getPublicApproach = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const settings = await getOrCreateApproachSettings();

    // Clean up any legacy fields stored in MongoDB
    if ((settings as any).partnership || (settings.philosophy as any)?.values) {
      await ApproachPageSettingsModel.updateOne(
        { _id: settings._id },
        { $unset: { partnership: '', 'philosophy.values': '' } }
      );
    }

    const publicData = settings.toJSON() as any;
    delete publicData.partnership;
    if (publicData.philosophy?.values) {
      delete publicData.philosophy.values;
    }

    // ── Media Library dynamic resolution ──────────────────────────────────────
    await resolveApproachMedia(publicData);

    res.status(200).json({
      success: true,
      data: publicData,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Admin APIs ───────────────────────────────────────────────────────────────

/**
 * GET /api/admin/approach
 * Returns the full Approach page settings for the admin CMS editor.
 */
export const getAdminApproach = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const settings = await getOrCreateApproachSettings();
    const adminData = settings.toJSON ? settings.toJSON() : (settings as any);
    await resolveApproachMedia(adminData);
    res.status(200).json({
      success: true,
      data: adminData,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/admin/approach
 * Updates the complete Approach page settings.
 */
export const updateAdminApproach = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const settings = await getOrCreateApproachSettings();
    const updateData = { ...req.body };

    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    if ((req as any).user?.userId) {
      updateData.lastUpdatedBy = (req as any).user.userId;
    }

    Object.assign(settings, updateData);
    await settings.save();

    res.status(200).json({
      success: true,
      data: settings,
      message: 'Approach page settings updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/approach/sections/:section
 * Retrieves a single section by key.
 */
export const getApproachSection = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const section = req.params.section as string;
    const validSections = [
      'hero',
      'philosophy',
      'framework',
      'technology',
      'execution',
      'impact',
      'governance',
      'cta',
      'seo',
    ];

    if (!validSections.includes(section)) {
      res.status(400).json({
        success: false,
        error: { message: `Invalid section: ${section}` },
      });
      return;
    }

    const settings = await getOrCreateApproachSettings();
    res.status(200).json({
      success: true,
      data: (settings as any)[section],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/admin/approach/sections/:section
 * Updates a single section by key.
 */
export const updateApproachSection = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const section = req.params.section as string;
    const validSections = [
      'hero',
      'philosophy',
      'framework',
      'technology',
      'execution',
      'impact',
      'governance',
      'cta',
      'seo',
    ];

    if (!validSections.includes(section)) {
      res.status(400).json({
        success: false,
        error: { message: `Invalid section: ${section}` },
      });
      return;
    }

    const settings = await getOrCreateApproachSettings();
    const updateData = req.body;

    (settings as any)[section] = {
      ...(settings as any)[section]?.toObject?.() || (settings as any)[section],
      ...updateData,
    };

    if ((req as any).user?.userId) {
      settings.lastUpdatedBy = (req as any).user.userId;
    }

    await settings.save();

    res.status(200).json({
      success: true,
      data: (settings as any)[section],
      message: `Section '${section}' updated successfully`,
    });
  } catch (error) {
    next(error);
  }
};
