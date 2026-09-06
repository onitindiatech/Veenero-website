import { Request, Response, NextFunction } from 'express';
import { AboutPageSettingsModel, IAboutPageSettings } from '../models/AboutPageSettings';
import { MediaModel } from '../models/Media';

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

    const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Fetch all media documents for the About page in a single query
    const aboutMedia = await MediaModel.find({
      page: new RegExp('^about$', 'i'),
    })
      .sort({ createdAt: -1 })
      .lean();

    // Helper: find the newest non-deleted asset matching section and slot patterns
    const findActiveMedia = (sectionPattern: RegExp, slotPattern: RegExp) => {
      return aboutMedia.find(
        (m) =>
          !m.deletedAt &&
          sectionPattern.test(m.section || '') &&
          slotPattern.test(m.slot || '')
      );
    };

    // Helper: check if a slot has media records but ALL of them are deleted (soft-deleted)
    const isSlotDeleted = (sectionPattern: RegExp, slotPattern: RegExp) => {
      const hasActive = aboutMedia.some(
        (m) =>
          !m.deletedAt &&
          sectionPattern.test(m.section || '') &&
          slotPattern.test(m.slot || '')
      );
      if (hasActive) return false;
      return aboutMedia.some(
        (m) =>
          m.deletedAt &&
          sectionPattern.test(m.section || '') &&
          slotPattern.test(m.slot || '')
      );
    };

    // 1. Hero Section
    const heroAsset = findActiveMedia(/hero/i, /hero\s*visual/i);
    if (heroAsset && publicData.hero) {
      publicData.hero.image = heroAsset.secureUrl;
      if (heroAsset.altText) publicData.hero.imageAlt = heroAsset.altText;
      publicData.hero.mediaPublicId = heroAsset.publicId;
    } else if (isSlotDeleted(/hero/i, /hero\s*visual/i) && publicData.hero) {
      publicData.hero.image = '';
      publicData.hero.mediaPublicId = '';
    }

    // 2. Our Story & Origin
    const storyVideoAsset = findActiveMedia(/story/i, /story\s*overview\s*video|story\s*video/i);
    if (storyVideoAsset && publicData.ourStory) {
      publicData.ourStory.video = storyVideoAsset.secureUrl;
      publicData.ourStory.mediaPublicId = storyVideoAsset.publicId;
    } else if (isSlotDeleted(/story/i, /story\s*overview\s*video|story\s*video/i) && publicData.ourStory) {
      publicData.ourStory.video = '';
      publicData.ourStory.mediaPublicId = '';
    }
    // Story video poster: use dedicated poster slot or hero asset
    const storyPosterAsset = findActiveMedia(/story/i, /poster/i) || heroAsset;
    if (storyPosterAsset && publicData.ourStory) {
      publicData.ourStory.videoPoster = storyPosterAsset.secureUrl;
    }

    // 3. The Pillars of Veenero
    if (publicData.pillars && Array.isArray(publicData.pillars.list)) {
      for (const pillar of publicData.pillars.list) {
        if (!pillar.title) continue;
        const slotRegex = new RegExp(`^${escapeRegex(pillar.title.trim())}$`, 'i');
        const activePillarAsset = findActiveMedia(/pillar/i, slotRegex);
        if (activePillarAsset) {
          pillar.image = activePillarAsset.secureUrl;
          pillar.mediaPublicId = activePillarAsset.publicId;
        } else if (isSlotDeleted(/pillar/i, slotRegex)) {
          pillar.image = '';
          pillar.mediaPublicId = '';
        }
      }
    }

    // 4. Why Choose Veenero
    if (publicData.whyChoose && Array.isArray(publicData.whyChoose.list)) {
      for (const card of publicData.whyChoose.list) {
        if (!card.title) continue;
        const slotRegex = new RegExp(`^${escapeRegex(card.title.trim())}$`, 'i');
        const activeWhyAsset = findActiveMedia(/why\s*choose/i, slotRegex);
        if (activeWhyAsset) {
          card.image = activeWhyAsset.secureUrl;
          card.mediaPublicId = activeWhyAsset.publicId;
        } else if (isSlotDeleted(/why\s*choose/i, slotRegex)) {
          card.image = '';
          card.mediaPublicId = '';
        }
      }
    }

    // 5. Leadership & Team
    if (publicData.leadership && Array.isArray(publicData.leadership.team)) {
      for (const member of publicData.leadership.team) {
        if (!member.name) continue;
        const slotRegex = new RegExp(`^${escapeRegex(member.name.trim())}$`, 'i');
        const activeTeamAsset = findActiveMedia(/leadership/i, slotRegex);
        if (activeTeamAsset) {
          member.image = activeTeamAsset.secureUrl;
          member.mediaPublicId = activeTeamAsset.publicId;
        } else if (isSlotDeleted(/leadership/i, slotRegex)) {
          member.image = '';
          member.mediaPublicId = '';
        }
      }
    }

    // 6. Our Journey (Milestones timeline visual)
    const journeyAsset = findActiveMedia(/journey/i, /journey\s*visual|journey\s*infrastructure/i);
    if (journeyAsset && publicData.ourJourney) {
      publicData.ourJourney.journeyImage = journeyAsset.secureUrl;
      publicData.ourJourney.mediaPublicId = journeyAsset.publicId;
    } else if (isSlotDeleted(/journey/i, /journey\s*visual|journey\s*infrastructure/i) && publicData.ourJourney) {
      publicData.ourJourney.journeyImage = '';
      publicData.ourJourney.mediaPublicId = '';
    }


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
