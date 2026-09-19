import { Request, Response, NextFunction } from 'express';
import { AboutPageSettingsModel, IAboutPageSettings } from '../models/AboutPageSettings';
import { resolveAboutMedia } from '../services/mediaSync.service';

/**
 * Helper to ensure a singleton AboutPageSettings document exists.
 */
async function getOrCreateAboutSettings(): Promise<IAboutPageSettings> {
  let doc = await AboutPageSettingsModel.findOne();
  if (!doc) {
    doc = await AboutPageSettingsModel.create({
      hero: {},
      ourStory: {},
      impactStats: { list: [] },
      ourJourney: { milestones: [] },
      purposeDirection: {},
      pillars: { list: [] },
      whyChoose: { list: [] },
      leadership: { team: [] },
      cta: {},
      seo: {},
    });
  }
  return doc;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * GET /api/about
 * Returns the published About page settings for the public website.
 * Filters out inactive items from repeatable lists and hidden sections if not visible.
 *
 * Media Library integration:
 * For each section that has a corresponding Media Library slot, the secureUrl
 * from the active (non-deleted) Media record overrides the stored CMS image field.
 * This makes the Media Library the canonical source of truth for media assets.
 */
export const getPublicAbout = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const settings = await getOrCreateAboutSettings();

    // Deep clone to safely filter out inactive items for public consumption
    const publicData = settings.toJSON() as any;

    // ── Media Library injection ───────────────────────────────────────────────
    // Resolve active Media Library assets for ALL About page slots and inject
    // their secureUrls into the appropriate fields. This ensures that when an
    // admin replaces, uploads, or deletes an asset via the Media Library, the
    // public page immediately reflects the change without requiring a full restart.
    await resolveAboutMedia(publicData);


    // ── Filter inactive repeatable items ─────────────────────────────────────

    if (publicData.impactStats && Array.isArray(publicData.impactStats.list)) {
      publicData.impactStats.list = publicData.impactStats.list
        .filter((item: any) => item.isActive !== false)
        .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
    }

    if (publicData.ourJourney && Array.isArray(publicData.ourJourney.milestones)) {
      publicData.ourJourney.milestones = publicData.ourJourney.milestones
        .filter((item: any) => item.isActive !== false)
        .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
    }

    if (publicData.pillars && Array.isArray(publicData.pillars.list)) {
      publicData.pillars.list = publicData.pillars.list
        .filter((item: any) => item.isActive !== false)
        .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
    }

    if (publicData.whyChoose && Array.isArray(publicData.whyChoose.list)) {
      publicData.whyChoose.list = publicData.whyChoose.list
        .filter((item: any) => item.isActive !== false)
        .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
    }

    if (publicData.leadership && Array.isArray(publicData.leadership.team)) {
      publicData.leadership.team = publicData.leadership.team
        .filter((item: any) => item.isActive !== false)
        .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
    }

    // Ensure safe defaults for newly introduced CMS fields on older records
    if (publicData.hero) {
      if (!publicData.hero.badges || publicData.hero.badges.length === 0) {
        publicData.hero.badges = [
          { icon: 'Radio', label1: 'Real-time', label2: 'Visibility' },
          { icon: 'ShieldCheck', label1: '100%', label2: 'Data Integrity' },
          { icon: 'TrendingUp', label1: 'Actionable', label2: 'Intelligence' },
          { icon: 'Droplets', label1: 'Measurable', label2: 'Impact' },
        ];
      }
      if (!publicData.hero.statsWidgets) {
        publicData.hero.statsWidgets = {
          flowRate: { title: 'Live Flow Rate', value: '1,245', unit: 'm³/hr', trend: '↑ 12.5% vs yesterday' },
          systemHealth: { title: 'System Health', value: '98%', status: 'Healthy' },
          activeAlerts: { title: 'Active Alerts', count: '3', ctaText: 'View All Alerts', ctaLink: '#who-we-are' },
        };
      }
    }

    if (publicData.ourStory) {
      if (!publicData.ourStory.eyebrow) {
        publicData.ourStory.eyebrow = 'WHO WE ARE';
      }
      if (!publicData.ourStory.capabilities || publicData.ourStory.capabilities.length === 0) {
        publicData.ourStory.capabilities = [
          { icon: 'Users', title: 'Expert Team', description: 'Engineers, analysts, and water specialists.' },
          { icon: 'ShieldCheck', title: 'Evidence Driven', description: 'All insights are validated and audit-ready.' },
          { icon: 'TrendingUp', title: 'Scalable Solutions', description: 'Built for reliability. Designed for scale.' },
          { icon: 'Droplets', title: 'Sustainable Impact', description: 'Driving long-term value for people and planet.' },
        ];
      }
    }

    if (publicData.impactStats) {
      if (!publicData.impactStats.eyebrow) publicData.impactStats.eyebrow = 'MEASURABLE IMPACT';
      if (!publicData.impactStats.title) publicData.impactStats.title = 'Impact Backed by Verified Data';
      if (!publicData.impactStats.description) publicData.impactStats.description = 'Real-time telemetry, continuous validation, and tamper-resistant auditing at scale.';
    }

    res.json({
      success: true,
      data: publicData,
    });
  } catch (error) {
    next(error);
  }
};


// ─── Admin API ────────────────────────────────────────────────────────────────


/**
 * GET /api/admin/about
 * Returns full About page settings for admin CMS.
 */
export const getAdminAbout = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const settings = await getOrCreateAboutSettings();
    const adminData = settings.toJSON() as any;

    await resolveAboutMedia(adminData);

    if (adminData.hero) {
      if (!adminData.hero.badges || adminData.hero.badges.length === 0) {
        adminData.hero.badges = [
          { icon: 'Radio', label1: 'Real-time', label2: 'Visibility' },
          { icon: 'ShieldCheck', label1: '100%', label2: 'Data Integrity' },
          { icon: 'TrendingUp', label1: 'Actionable', label2: 'Intelligence' },
          { icon: 'Droplets', label1: 'Measurable', label2: 'Impact' },
        ];
      }
      if (!adminData.hero.statsWidgets) {
        adminData.hero.statsWidgets = {
          flowRate: { title: 'Live Flow Rate', value: '1,245', unit: 'm³/hr', trend: '↑ 12.5% vs yesterday' },
          systemHealth: { title: 'System Health', value: '98%', status: 'Healthy' },
          activeAlerts: { title: 'Active Alerts', count: '3', ctaText: 'View All Alerts', ctaLink: '#who-we-are' },
        };
      }
    }

    if (adminData.ourStory) {
      if (!adminData.ourStory.eyebrow) {
        adminData.ourStory.eyebrow = 'WHO WE ARE';
      }
      if (!adminData.ourStory.capabilities || adminData.ourStory.capabilities.length === 0) {
        adminData.ourStory.capabilities = [
          { icon: 'Users', title: 'Expert Team', description: 'Engineers, analysts, and water specialists.' },
          { icon: 'ShieldCheck', title: 'Evidence Driven', description: 'All insights are validated and audit-ready.' },
          { icon: 'TrendingUp', title: 'Scalable Solutions', description: 'Built for reliability. Designed for scale.' },
          { icon: 'Droplets', title: 'Sustainable Impact', description: 'Driving long-term value for people and planet.' },
        ];
      }
    }

    if (adminData.impactStats) {
      if (!adminData.impactStats.eyebrow) adminData.impactStats.eyebrow = 'MEASURABLE IMPACT';
      if (!adminData.impactStats.title) adminData.impactStats.title = 'Impact Backed by Verified Data';
      if (!adminData.impactStats.description) adminData.impactStats.description = 'Real-time telemetry, continuous validation, and tamper-resistant auditing at scale.';
    }

    res.json({
      success: true,
      data: adminData,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/admin/about
 * Updates the entire About page settings document.
 */
export const updateAdminAbout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const settings = await getOrCreateAboutSettings();
    const updateData = req.body;

    const user = (req as any).user;
    if (user?.name || user?.email) {
      updateData.lastUpdatedBy = user.name || user.email;
    }

    Object.assign(settings, updateData);
    const updated = await settings.save();

    res.json({
      success: true,
      message: 'About page settings updated successfully.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/about/sections/:section
 * Returns a single section of the About page.
 */
export const getAboutSection = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const section = String(req.params.section);
    const settings = await getOrCreateAboutSettings();

    if (!(section in settings.toObject())) {
      res.status(404).json({
        success: false,
        error: { message: `Section '${section}' not found in About Page settings.` },
      });
      return;
    }

    res.json({
      success: true,
      section,
      data: (settings as any)[section],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/admin/about/sections/:section
 * Updates a specific section of the About page settings.
 */
export const updateAboutSection = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const section = String(req.params.section);
    const sectionData = req.body;
    const settings = await getOrCreateAboutSettings();

    const allowedSections = [
      'hero',
      'ourStory',
      'impactStats',
      'ourJourney',
      'purposeDirection',
      'pillars',
      'whyChoose',
      'leadership',
      'cta',
      'seo',
      'isPublished',
    ];

    if (!allowedSections.includes(section)) {
      res.status(400).json({
        success: false,
        error: { message: `Invalid section '${section}'. Allowed sections: ${allowedSections.join(', ')}` },
      });
      return;
    }

    (settings as any)[section] = sectionData;

    const user = (req as any).user;
    if (user?.name || user?.email) {
      settings.lastUpdatedBy = user.name || user.email;
    }

    const updated = await settings.save();

    res.json({
      success: true,
      message: `Section '${section}' updated successfully.`,
      section,
      data: (updated as any)[section],
    });
  } catch (error) {
    next(error);
  }
};
