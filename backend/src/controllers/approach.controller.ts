import { Request, Response, NextFunction } from 'express';
import { ApproachPageSettingsModel, IApproachPageSettings } from '../models/ApproachPageSettings';
import { MediaModel } from '../models/Media';

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
    const approachMedia = await MediaModel.find({
      page: new RegExp('^approach$', 'i'),
    })
      .sort({ createdAt: -1 })
      .lean();

    if (approachMedia.length > 0) {
      const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      const findMedia = (sectionPattern: RegExp, slotPattern: RegExp) => {
        return approachMedia.find(
          (m: any) =>
            m.isActive !== false &&
            sectionPattern.test(m.section || '') &&
            slotPattern.test(m.slot || '')
        );
      };

      // 1. Hero background
      const heroMedia = findMedia(/hero/i, /hero|background|visual|infra/i);
      if (heroMedia) {
        publicData.hero.image = heroMedia.secureUrl;
        publicData.hero.mediaPublicId = heroMedia.publicId;
      }

      // 2. Philosophy ecosystem
      const philosophyMedia = findMedia(/philosophy/i, /illustration|ecosystem|visual/i);
      if (philosophyMedia) {
        publicData.philosophy.image = philosophyMedia.secureUrl;
        publicData.philosophy.mediaPublicId = philosophyMedia.publicId;
      }

      // 3. Technology dashboard
      const techMedia = findMedia(/technology|capabilities/i, /dashboard|sensor|architecture/i);
      if (techMedia) {
        publicData.technology.image = techMedia.secureUrl;
        publicData.technology.mediaPublicId = techMedia.publicId;
      }

      // 4. Execution stages (01 - 04)
      if (publicData.execution?.stages?.length > 0) {
        publicData.execution.stages = publicData.execution.stages.map((stage: any, idx: number) => {
          const stageMedia = approachMedia.find(
            (m: any) =>
              m.isActive !== false &&
              /execution|flow/i.test(m.section || '') &&
              (new RegExp(escapeRegex(stage.title), 'i').test(m.slot || '') ||
                new RegExp(`stage\\s*0?${idx + 1}`, 'i').test(m.slot || ''))
          );
          if (stageMedia) {
            return {
              ...stage,
              image: stageMedia.secureUrl,
              mediaPublicId: stageMedia.publicId,
            };
          }
          return stage;
        });
      }

      // 5. Governance infrastructure / trust image
      const govMedia = findMedia(/governance|security|compliance/i, /architecture|sensor|trust|audit/i);
      if (govMedia) {
        publicData.governance.image = govMedia.secureUrl;
        publicData.governance.mediaPublicId = govMedia.publicId;
      }
    }

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
    res.status(200).json({
      success: true,
      data: settings,
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
