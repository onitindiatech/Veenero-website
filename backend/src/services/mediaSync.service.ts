import { MediaModel, IMedia } from '../models/Media';
import { SolutionDetailModel } from '../models/SolutionDetail';
import { SolutionsPageSettings } from '../models/SolutionsPageSettings';
import { AboutPageSettingsModel } from '../models/AboutPageSettings';
import { ApproachPageSettingsModel } from '../models/ApproachPageSettings';
import { ImpactPageSettingsModel } from '../models/ImpactPageSettings';
import { ContactPageSettingsModel } from '../models/ContactPageSettings';
import { HomePageSettingsModel } from '../models/HomePageSettings';
import { CareerPageSettingsModel } from '../models/CareerPageSettings';
import { BlogPostModel } from '../models/BlogPost';
import { BlogLandingSettingsModel } from '../models/BlogLandingSettings';

export interface CmsUsageEntry {
  page: string;
  entity: string;
  section: string;
  field: string;
  cmsId?: string;
  route?: string;
}

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Finds the latest active (non-deleted) Media Library asset for a given page, section, and slot.
 */
export async function findActiveMedia(
  page: string,
  sectionPattern: RegExp | string,
  slotPattern: RegExp | string
): Promise<IMedia | null> {
  const pageRegex = new RegExp(`^${escapeRegex(page)}$`, 'i');
  const sPattern = typeof sectionPattern === 'string' ? new RegExp(escapeRegex(sectionPattern), 'i') : sectionPattern;
  const slPattern = typeof slotPattern === 'string' ? new RegExp(escapeRegex(slotPattern), 'i') : slotPattern;

  const candidates = await MediaModel.find({
    page: pageRegex,
    deletedAt: null,
  }).sort({ createdAt: -1 }).lean();

  const match = candidates.find(
    (m) => sPattern.test(m.section || '') && slPattern.test(m.slot || '')
  );

  return match || null;
}

/**
 * Retrieves all active (non-deleted) media assets for a given page name.
 */
export async function getPageMedia(pageName: string): Promise<IMedia[]> {
  const pageRegex = new RegExp(`^${escapeRegex(pageName)}$`, 'i');
  return MediaModel.find({
    page: pageRegex,
  })
    .sort({ createdAt: -1 })
    .lean();
}

/**
 * Resolves active Hero Media for any CMS page settings document.
 * If an active Media Library asset exists for this page's Hero slot,
 * returns the updated hero object with `image` and `mediaPublicId`.
 * Also falls back to resolving by `mediaPublicId` if present.
 */
export async function resolvePageHero(
  pageName: string,
  heroData: any,
  slotPattern: RegExp = /hero\s*(image|visual)?/i
): Promise<any> {
  if (!heroData) return heroData;

  const heroAsset = await findActiveMedia(pageName, /hero/i, slotPattern);
  if (heroAsset?.secureUrl) {
    return {
      ...heroData,
      image: heroAsset.secureUrl,
      mediaPublicId: heroAsset.publicId,
      ...(heroAsset.altText ? { imageAlt: heroAsset.altText } : {}),
    };
  } else if (heroData.mediaPublicId) {
    const assetByPublicId = await MediaModel.findOne({
      publicId: heroData.mediaPublicId,
      deletedAt: null,
    }).lean();
    if (assetByPublicId?.secureUrl) {
      return {
        ...heroData,
        image: assetByPublicId.secureUrl,
        ...(assetByPublicId.altText && !heroData.imageAlt ? { imageAlt: assetByPublicId.altText } : {}),
      };
    }
  }

  return heroData;
}

/**
 * Centralized dynamic media resolution for Impact page.
 */
export async function resolveImpactMedia(data: any): Promise<void> {
  if (!data) return;
  const impactMedia = await getPageMedia('impact');
  if (impactMedia.length === 0) return;

  const heroBg = impactMedia.find(
    (m) => !m.deletedAt && (/hero/i.test(m.section || '') || /hero/i.test(m.slot || ''))
  );
  if (heroBg?.secureUrl) {
    if (!data.hero) data.hero = {};
    data.hero.image = heroBg.secureUrl;
    data.hero.mediaPublicId = heroBg.publicId;
    if (heroBg.altText && !data.hero.imageAlt) data.hero.imageAlt = heroBg.altText;
  }

  const videoAsset = impactMedia.find(
    (m) => !m.deletedAt && (m.resourceType === 'video' || /sustainability/i.test(m.section || ''))
  );
  if (videoAsset?.secureUrl) {
    if (!data.sustainability) data.sustainability = {};
    data.sustainability.videoUrl = videoAsset.secureUrl;
    data.sustainability.videoPublicId = videoAsset.publicId;
  }
}

/**
 * Centralized dynamic media resolution for About page.
 */
export async function resolveAboutMedia(data: any): Promise<void> {
  if (!data) return;
  const aboutMedia = await getPageMedia('about');

  const findActive = (sectionPattern: RegExp, slotPattern: RegExp) => {
    return aboutMedia.find(
      (m) =>
        !m.deletedAt &&
        sectionPattern.test(m.section || '') &&
        slotPattern.test(m.slot || '')
    );
  };

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
  const heroAsset = findActive(/hero/i, /hero\s*visual/i);
  if (heroAsset && data.hero) {
    data.hero.image = heroAsset.secureUrl;
    if (heroAsset.altText) data.hero.imageAlt = heroAsset.altText;
    data.hero.mediaPublicId = heroAsset.publicId;
  } else if (isSlotDeleted(/hero/i, /hero\s*visual/i) && data.hero) {
    data.hero.image = '';
    data.hero.mediaPublicId = '';
  }

  // 2. Our Story & Origin
  const storyVideoAsset = findActive(/story/i, /story\s*overview\s*video|story\s*video/i);
  if (storyVideoAsset && data.ourStory) {
    data.ourStory.video = storyVideoAsset.secureUrl;
    data.ourStory.mediaPublicId = storyVideoAsset.publicId;
  } else if (isSlotDeleted(/story/i, /story\s*overview\s*video|story\s*video/i) && data.ourStory) {
    data.ourStory.video = '';
    data.ourStory.mediaPublicId = '';
  }
  const storyPosterAsset = findActive(/story/i, /poster/i) || heroAsset;
  if (storyPosterAsset && data.ourStory) {
    data.ourStory.videoPoster = storyPosterAsset.secureUrl;
  }

  // 3. The Pillars of Veenero
  if (data.pillars && Array.isArray(data.pillars.list)) {
    for (const pillar of data.pillars.list) {
      if (!pillar.title) continue;
      const slotRegex = new RegExp(`^${escapeRegex(pillar.title.trim())}$`, 'i');
      const activePillarAsset = findActive(/pillar/i, slotRegex);
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
  if (data.whyChoose && Array.isArray(data.whyChoose.list)) {
    for (const card of data.whyChoose.list) {
      if (!card.title) continue;
      const slotRegex = new RegExp(`^${escapeRegex(card.title.trim())}$`, 'i');
      const activeWhyAsset = findActive(/why\s*choose/i, slotRegex);
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
  if (data.leadership && Array.isArray(data.leadership.team)) {
    for (const member of data.leadership.team) {
      if (!member.name) continue;
      const slotRegex = new RegExp(`^${escapeRegex(member.name.trim())}$`, 'i');
      const activeTeamAsset = findActive(/leadership/i, slotRegex);
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
  const journeyAsset = findActive(/journey/i, /journey\s*visual|journey\s*infrastructure/i);
  if (journeyAsset && data.ourJourney) {
    data.ourJourney.journeyImage = journeyAsset.secureUrl;
    data.ourJourney.mediaPublicId = journeyAsset.publicId;
  } else if (isSlotDeleted(/journey/i, /journey\s*visual|journey\s*infrastructure/i) && data.ourJourney) {
    data.ourJourney.journeyImage = '';
    data.ourJourney.mediaPublicId = '';
  }
}

/**
 * Centralized dynamic media resolution for Solutions page.
 */
export async function resolveSolutionsMedia(data: any): Promise<void> {
  if (!data) return;
  const solutionsMedia = await getPageMedia('solutions');

  const findActive = (sectionPattern: RegExp, slotPattern: RegExp) => {
    return solutionsMedia.find(
      (m) =>
        !m.deletedAt &&
        sectionPattern.test(m.section || '') &&
        slotPattern.test(m.slot || '')
    );
  };

  // 1. Hero Section Image
  const heroAsset = findActive(/hero/i, /hero\s*visual/i);
  if (heroAsset && data.hero) {
    data.hero.image = heroAsset.secureUrl;
    if (heroAsset.altText) data.hero.imageAlt = heroAsset.altText;
    data.hero.mediaPublicId = heroAsset.publicId;
  }

  // 2. Ecosystem Intro Image
  const introAsset = findActive(/intro|ecosystem/i, /illustration|visual/i);
  if (introAsset && data.intro) {
    data.intro.image = introAsset.secureUrl;
    data.intro.mediaPublicId = introAsset.publicId;
  }

  // 3. Featured Solution Image
  const featuredAsset = findActive(/featured/i, /visual|image/i);
  if (featuredAsset && data.featuredSolution) {
    data.featuredSolution.image = featuredAsset.secureUrl;
    data.featuredSolution.mediaPublicId = featuredAsset.publicId;
  }

  // 4. Analytics Platform Callout Card Image
  const analyticsAsset = findActive(/grid|analytics/i, /analytics|callout/i);
  if (analyticsAsset && data.gridHeader?.calloutCard) {
    data.gridHeader.calloutCard.image = analyticsAsset.secureUrl;
    data.gridHeader.calloutCard.mediaPublicId = analyticsAsset.publicId;
  }

  // 5. Category Images resolution from Media Library
  if (data.categories && Array.isArray(data.categories)) {
    data.categories = data.categories.map((cat: any) => {
      const catAsset = solutionsMedia.find(
        (m) =>
          !m.deletedAt &&
          /category|capabilities/i.test(m.section || '') &&
          new RegExp(escapeRegex(cat.title), 'i').test(m.slot || '')
      );
      if (catAsset) {
        return { ...cat, image: catAsset.secureUrl, mediaPublicId: catAsset.publicId };
      }
      return cat;
    });
  }

  // 6. Solution Cards Image resolution from Media Library
  if (data.solutions && Array.isArray(data.solutions)) {
    data.solutions = data.solutions.map((sol: any) => {
      const solAsset = solutionsMedia.find(
        (m) =>
          !m.deletedAt &&
          /solution|offering|card/i.test(m.section || '') &&
          new RegExp(escapeRegex(sol.title), 'i').test(m.slot || '')
      );
      if (solAsset) {
        return { ...sol, image: solAsset.secureUrl, mediaPublicId: solAsset.publicId };
      }
      return sol;
    });
  }
}

/**
 * Centralized dynamic media resolution for Approach page.
 */
export async function resolveApproachMedia(data: any): Promise<void> {
  if (!data) return;
  const approachMedia = await getPageMedia('approach');
  if (approachMedia.length === 0) return;

  const findMedia = (sectionPattern: RegExp, slotPattern: RegExp) => {
    return approachMedia.find(
      (m: any) =>
        !m.deletedAt &&
        sectionPattern.test(m.section || '') &&
        slotPattern.test(m.slot || '')
    );
  };

  // 1. Hero background
  const heroMedia = findMedia(/hero/i, /hero|background|visual|infra/i);
  if (heroMedia && data.hero) {
    data.hero.image = heroMedia.secureUrl;
    data.hero.mediaPublicId = heroMedia.publicId;
  }

  // 2. Philosophy ecosystem
  const philosophyMedia = findMedia(/philosophy/i, /illustration|ecosystem|visual/i);
  if (philosophyMedia && data.philosophy) {
    data.philosophy.image = philosophyMedia.secureUrl;
    data.philosophy.mediaPublicId = philosophyMedia.publicId;
  }

  // 3. Technology dashboard
  const techMedia = findMedia(/technology|capabilities/i, /dashboard|sensor|architecture/i);
  if (techMedia && data.technology) {
    data.technology.image = techMedia.secureUrl;
    data.technology.mediaPublicId = techMedia.publicId;
  }

  // 4. Execution stages (01 - 04)
  if (data.execution?.stages?.length > 0) {
    data.execution.stages = data.execution.stages.map((stage: any, idx: number) => {
      const stageMedia = approachMedia.find(
        (m: any) =>
          !m.deletedAt &&
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
  if (govMedia && data.governance) {
    data.governance.image = govMedia.secureUrl;
    data.governance.mediaPublicId = govMedia.publicId;
  }
}

/**
 * Centralized dynamic media resolution for individual SolutionDetail documents.
 */
export async function resolveSolutionDetailMedia(solutionDetail: any): Promise<void> {
  if (!solutionDetail) return;

  if (solutionDetail.heroMediaPublicId) {
    const heroAsset = await MediaModel.findOne({ publicId: solutionDetail.heroMediaPublicId, deletedAt: null }).lean();
    if (heroAsset?.secureUrl) {
      solutionDetail.heroImage = heroAsset.secureUrl;
      if (heroAsset.altText) solutionDetail.heroImageAlt = heroAsset.altText;
    }
  }

  if (solutionDetail.useCases?.items && Array.isArray(solutionDetail.useCases.items)) {
    for (const item of solutionDetail.useCases.items) {
      if (item.mediaPublicId) {
        const asset = await MediaModel.findOne({ publicId: item.mediaPublicId, deletedAt: null }).lean();
        if (asset?.secureUrl) {
          item.image = asset.secureUrl;
        }
      }
    }
  }

  if (solutionDetail.industries && Array.isArray(solutionDetail.industries)) {
    for (const ind of solutionDetail.industries) {
      if (ind.mediaPublicId) {
        const asset = await MediaModel.findOne({ publicId: ind.mediaPublicId, deletedAt: null }).lean();
        if (asset?.secureUrl) {
          ind.image = asset.secureUrl;
        }
      }
    }
  }

  if (solutionDetail.seo?.ogImagePublicId) {
    const ogAsset = await MediaModel.findOne({ publicId: solutionDetail.seo.ogImagePublicId, deletedAt: null }).lean();
    if (ogAsset?.secureUrl) {
      solutionDetail.seo.ogImage = ogAsset.secureUrl;
    }
  }
}

/**
 * Synchronizes ALL CMS references across all 10 collections atomically
 * when an asset is replaced in the Media Library.
 */
export async function syncAllCmsReferences(
  previousPublicId: string,
  previousSecureUrl: string,
  newAsset: { publicId: string; secureUrl: string; page?: string; section?: string; slot?: string }
): Promise<number> {
  const syncPromises: Promise<any>[] = [];
  const { publicId: newPublicId, secureUrl: newSecureUrl, page, section, slot } = newAsset;

  const pageLower = (page || '').toLowerCase();
  const isHero = /hero/i.test(section || '') && (/hero/i.test(slot || '') || !slot);

  // 1. SolutionDetailModel
  if (previousPublicId) {
    syncPromises.push(
      SolutionDetailModel.updateMany(
        { 'useCases.items.mediaPublicId': previousPublicId },
        { $set: { 'useCases.items.$[elem].mediaPublicId': newPublicId } },
        { arrayFilters: [{ 'elem.mediaPublicId': previousPublicId }] }
      ),
      SolutionDetailModel.updateMany(
        { 'industries.mediaPublicId': previousPublicId },
        { $set: { 'industries.$[elem].mediaPublicId': newPublicId } },
        { arrayFilters: [{ 'elem.mediaPublicId': previousPublicId }] }
      ),
      SolutionDetailModel.updateMany(
        { heroMediaPublicId: previousPublicId },
        { $set: { heroMediaPublicId: newPublicId, heroImage: newSecureUrl } }
      ),
      SolutionDetailModel.updateMany(
        { 'seo.ogImagePublicId': previousPublicId },
        { $set: { 'seo.ogImagePublicId': newPublicId } }
      )
    );
  }
  if (previousSecureUrl) {
    syncPromises.push(
      SolutionDetailModel.updateMany(
        { heroImage: previousSecureUrl },
        { $set: { heroImage: newSecureUrl, heroMediaPublicId: newPublicId } }
      )
    );
  }

  // 2. SolutionsPageSettings
  if (previousPublicId) {
    syncPromises.push(
      SolutionsPageSettings.updateMany(
        { 'categories.mediaPublicId': previousPublicId },
        { $set: { 'categories.$[elem].mediaPublicId': newPublicId } },
        { arrayFilters: [{ 'elem.mediaPublicId': previousPublicId }] }
      ),
      SolutionsPageSettings.updateMany(
        { 'solutions.mediaPublicId': previousPublicId },
        { $set: { 'solutions.$[elem].mediaPublicId': newPublicId, 'solutions.$[elem].image': newSecureUrl } },
        { arrayFilters: [{ 'elem.mediaPublicId': previousPublicId }] }
      ),
      SolutionsPageSettings.updateMany(
        { 'hero.mediaPublicId': previousPublicId },
        { $set: { 'hero.mediaPublicId': newPublicId, 'hero.image': newSecureUrl } }
      ),
      SolutionsPageSettings.updateMany(
        { 'intro.mediaPublicId': previousPublicId },
        { $set: { 'intro.mediaPublicId': newPublicId } }
      ),
      SolutionsPageSettings.updateMany(
        { 'featuredSolution.mediaPublicId': previousPublicId },
        { $set: { 'featuredSolution.mediaPublicId': newPublicId } }
      ),
      SolutionsPageSettings.updateMany(
        { 'gridHeader.calloutCard.mediaPublicId': previousPublicId },
        { $set: { 'gridHeader.calloutCard.mediaPublicId': newPublicId } }
      )
    );
  }
  if (pageLower === 'solutions' && isHero) {
    syncPromises.push(
      SolutionsPageSettings.updateMany(
        {},
        { $set: { 'hero.mediaPublicId': newPublicId, 'hero.image': newSecureUrl } }
      )
    );
  }

  // 3. ImpactPageSettingsModel
  if (pageLower === 'impact' && isHero) {
    syncPromises.push(
      ImpactPageSettingsModel.updateMany(
        {},
        { $set: { 'hero.mediaPublicId': newPublicId, 'hero.image': newSecureUrl } }
      )
    );
  } else if (previousPublicId || previousSecureUrl) {
    syncPromises.push(
      ImpactPageSettingsModel.updateMany(
        {
          $or: [
            ...(previousPublicId ? [{ 'hero.mediaPublicId': previousPublicId }] : []),
            ...(previousSecureUrl ? [{ 'hero.image': previousSecureUrl }] : []),
          ],
        },
        { $set: { 'hero.mediaPublicId': newPublicId, 'hero.image': newSecureUrl } }
      )
    );
  }

  // 4. BlogLandingSettingsModel
  if (pageLower === 'blog' && isHero) {
    syncPromises.push(
      BlogLandingSettingsModel.updateMany(
        {},
        { $set: { 'hero.mediaPublicId': newPublicId, 'hero.image': newSecureUrl } }
      )
    );
  } else if (previousPublicId || previousSecureUrl) {
    syncPromises.push(
      BlogLandingSettingsModel.updateMany(
        {
          $or: [
            ...(previousPublicId ? [{ 'hero.mediaPublicId': previousPublicId }] : []),
            ...(previousSecureUrl ? [{ 'hero.image': previousSecureUrl }] : []),
          ],
        },
        { $set: { 'hero.mediaPublicId': newPublicId, 'hero.image': newSecureUrl } }
      )
    );
  }

  // 5. BlogPostModel
  if (previousPublicId || previousSecureUrl) {
    syncPromises.push(
      BlogPostModel.updateMany(
        {
          $or: [
            ...(previousPublicId ? [{ featuredImage: previousPublicId }] : []),
            ...(previousSecureUrl ? [{ featuredImage: previousSecureUrl }] : []),
            ...(previousPublicId ? [{ featuredImage: { $regex: escapeRegex(previousPublicId), $options: 'i' } }] : []),
          ],
        },
        { $set: { featuredImage: newSecureUrl } }
      )
    );
  }

  // 6. AboutPageSettingsModel
  if (pageLower === 'about' && isHero) {
    syncPromises.push(
      AboutPageSettingsModel.updateMany(
        {},
        { $set: { 'hero.mediaPublicId': newPublicId, 'hero.image': newSecureUrl } }
      )
    );
  } else if (previousPublicId || previousSecureUrl) {
    syncPromises.push(
      AboutPageSettingsModel.updateMany(
        {
          $or: [
            ...(previousPublicId ? [{ 'hero.mediaPublicId': previousPublicId }] : []),
            ...(previousSecureUrl ? [{ 'hero.image': previousSecureUrl }] : []),
          ],
        },
        { $set: { 'hero.mediaPublicId': newPublicId, 'hero.image': newSecureUrl } }
      )
    );
  }
  if (previousPublicId) {
    syncPromises.push(
      AboutPageSettingsModel.updateMany(
        { 'story.mediaPublicId': previousPublicId },
        { $set: { 'story.mediaPublicId': newPublicId } }
      ),
      AboutPageSettingsModel.updateMany(
        { 'visionMission.mediaPublicId': previousPublicId },
        { $set: { 'visionMission.mediaPublicId': newPublicId } }
      ),
      AboutPageSettingsModel.updateMany(
        { 'foundersNote.mediaPublicId': previousPublicId },
        { $set: { 'foundersNote.mediaPublicId': newPublicId } }
      ),
      AboutPageSettingsModel.updateMany(
        { 'leadership.team.mediaPublicId': previousPublicId },
        { $set: { 'leadership.team.$[elem].mediaPublicId': newPublicId, 'leadership.team.$[elem].image': newSecureUrl } },
        { arrayFilters: [{ 'elem.mediaPublicId': previousPublicId }] }
      ),
      AboutPageSettingsModel.updateMany(
        { 'whyChoose.list.mediaPublicId': previousPublicId },
        { $set: { 'whyChoose.list.$[elem].mediaPublicId': newPublicId, 'whyChoose.list.$[elem].image': newSecureUrl } },
        { arrayFilters: [{ 'elem.mediaPublicId': previousPublicId }] }
      ),
      AboutPageSettingsModel.updateMany(
        { 'pillars.list.mediaPublicId': previousPublicId },
        { $set: { 'pillars.list.$[elem].mediaPublicId': newPublicId, 'pillars.list.$[elem].image': newSecureUrl } },
        { arrayFilters: [{ 'elem.mediaPublicId': previousPublicId }] }
      )
    );
  }

  // 7. ApproachPageSettingsModel
  if (pageLower === 'approach' && isHero) {
    syncPromises.push(
      ApproachPageSettingsModel.updateMany(
        {},
        { $set: { 'hero.mediaPublicId': newPublicId, 'hero.image': newSecureUrl } }
      )
    );
  } else if (previousPublicId || previousSecureUrl) {
    syncPromises.push(
      ApproachPageSettingsModel.updateMany(
        {
          $or: [
            ...(previousPublicId ? [{ 'hero.mediaPublicId': previousPublicId }] : []),
            ...(previousSecureUrl ? [{ 'hero.image': previousSecureUrl }] : []),
          ],
        },
        { $set: { 'hero.mediaPublicId': newPublicId, 'hero.image': newSecureUrl } }
      )
    );
  }

  // 8. ContactPageSettingsModel
  if (pageLower === 'contact' && isHero) {
    syncPromises.push(
      ContactPageSettingsModel.updateMany(
        {},
        { $set: { 'hero.mediaPublicId': newPublicId, 'hero.image': newSecureUrl } }
      )
    );
  } else if (previousPublicId || previousSecureUrl) {
    syncPromises.push(
      ContactPageSettingsModel.updateMany(
        {
          $or: [
            ...(previousPublicId ? [{ 'hero.mediaPublicId': previousPublicId }] : []),
            ...(previousSecureUrl ? [{ 'hero.image': previousSecureUrl }] : []),
          ],
        },
        { $set: { 'hero.mediaPublicId': newPublicId, 'hero.image': newSecureUrl } }
      )
    );
  }

  // 9. HomePageSettingsModel
  if (pageLower === 'home' && isHero) {
    syncPromises.push(
      HomePageSettingsModel.updateMany(
        {},
        { $set: { 'hero.mediaPublicId': newPublicId, 'hero.image': newSecureUrl } }
      )
    );
  } else if (previousPublicId || previousSecureUrl) {
    syncPromises.push(
      HomePageSettingsModel.updateMany(
        {
          $or: [
            ...(previousPublicId ? [{ 'hero.mediaPublicId': previousPublicId }] : []),
            ...(previousSecureUrl ? [{ 'hero.image': previousSecureUrl }] : []),
          ],
        },
        { $set: { 'hero.mediaPublicId': newPublicId, 'hero.image': newSecureUrl } }
      )
    );
  }

  // 10. CareerPageSettingsModel
  if (pageLower === 'careers' && isHero) {
    syncPromises.push(
      CareerPageSettingsModel.updateMany(
        {},
        { $set: { 'hero.mediaPublicId': newPublicId, 'hero.image': newSecureUrl } }
      )
    );
  } else if (previousPublicId || previousSecureUrl) {
    syncPromises.push(
      CareerPageSettingsModel.updateMany(
        {
          $or: [
            ...(previousPublicId ? [{ 'hero.mediaPublicId': previousPublicId }] : []),
            ...(previousSecureUrl ? [{ 'hero.image': previousSecureUrl }] : []),
          ],
        },
        { $set: { 'hero.mediaPublicId': newPublicId, 'hero.image': newSecureUrl } }
      )
    );
  }

  const results = await Promise.all(syncPromises);
  return results.length;
}

/**
 * Scans all CMS models to return genuine database references for an asset.
 * Checks publicId, secureUrl, and active slot assignments.
 */
export async function scanRealCmsUsage(
  publicId: string,
  secureUrl: string = '',
  page: string = '',
  section: string = '',
  slot: string = ''
): Promise<CmsUsageEntry[]> {
  const usages: CmsUsageEntry[] = [];
  const pageLower = (page || '').toLowerCase();
  const isHero = /hero/i.test(section || '') && (/hero/i.test(slot || '') || !slot);

  const isMatch = (val?: string | null) => {
    if (!val) return false;
    return val === publicId || (secureUrl && val === secureUrl) || (publicId && val.includes(publicId));
  };

  // 1. SolutionDetailModel
  try {
    const solutionDetails = await SolutionDetailModel.find({
      $or: [
        { 'useCases.items.mediaPublicId': publicId },
        { 'industries.mediaPublicId': publicId },
        { heroMediaPublicId: publicId },
        ...(secureUrl ? [{ heroImage: secureUrl }] : []),
      ],
    }).lean();

    for (const sd of solutionDetails) {
      if (sd.heroMediaPublicId === publicId || (secureUrl && sd.heroImage === secureUrl)) {
        usages.push({
          page: 'solutions',
          entity: `Solution: ${sd.title || sd.slug}`,
          section: 'Hero Section',
          field: 'heroImage',
          cmsId: String(sd._id),
          route: '/admin/solutions',
        });
      }
      sd.useCases?.items?.forEach((item: any, idx: number) => {
        if (item.mediaPublicId === publicId) {
          usages.push({
            page: 'solutions',
            entity: `Solution: ${sd.title || sd.slug}`,
            section: sd.useCases?.eyebrow || 'Use Cases',
            field: `useCases[${idx}] (${item.title || 'Scenario'})`,
            cmsId: String(sd._id),
            route: '/admin/solutions',
          });
        }
      });
      sd.industries?.forEach((item: any, idx: number) => {
        if (item.mediaPublicId === publicId) {
          usages.push({
            page: 'solutions',
            entity: `Solution: ${sd.title || sd.slug}`,
            section: 'Industries Served',
            field: `industries[${idx}] (${item.name || 'Industry'})`,
            cmsId: String(sd._id),
            route: '/admin/solutions',
          });
        }
      });
    }
  } catch (e) {
    console.error('[UsageScan] Error scanning SolutionDetail:', e);
  }

  // 2. SolutionsPageSettings
  try {
    const solutionsSettings = await SolutionsPageSettings.find({}).lean();
    for (const s of solutionsSettings) {
      if (isMatch(s.hero?.mediaPublicId) || isMatch(s.hero?.image) || (pageLower === 'solutions' && isHero)) {
        usages.push({ page: 'solutions', entity: 'Solutions Landing Page', section: 'Hero Section', field: 'hero.image', route: '/admin/solutions' });
      }
      if (isMatch(s.intro?.mediaPublicId)) {
        usages.push({ page: 'solutions', entity: 'Solutions Landing Page', section: 'Intro Section', field: 'intro.mediaPublicId', route: '/admin/solutions' });
      }
      if (isMatch(s.featuredSolution?.mediaPublicId)) {
        usages.push({ page: 'solutions', entity: 'Solutions Landing Page', section: 'Featured Solution', field: 'featuredSolution.mediaPublicId', route: '/admin/solutions' });
      }
      if (isMatch(s.gridHeader?.calloutCard?.mediaPublicId)) {
        usages.push({ page: 'solutions', entity: 'Solutions Landing Page', section: 'Grid Callout Card', field: 'gridHeader.calloutCard.mediaPublicId', route: '/admin/solutions' });
      }
      s.categories?.forEach((cat: any, idx: number) => {
        if (isMatch(cat.mediaPublicId)) {
          usages.push({ page: 'solutions', entity: 'Solutions Landing Page', section: 'Solution Categories', field: `category[${idx}]: ${cat.displayLabel || cat.key}`, route: '/admin/solutions' });
        }
      });
      s.solutions?.forEach((sol: any, idx: number) => {
        if (isMatch(sol.mediaPublicId) || isMatch(sol.image)) {
          usages.push({ page: 'solutions', entity: 'Solutions Landing Page', section: 'Solution Cards', field: `solution[${idx}]: ${sol.title}`, route: '/admin/solutions' });
        }
      });
    }
  } catch (e) {
    console.error('[UsageScan] Error scanning SolutionsPageSettings:', e);
  }

  // 3. ImpactPageSettingsModel
  try {
    const impactSettings = await ImpactPageSettingsModel.find({}).lean();
    for (const imp of impactSettings) {
      if (isMatch(imp.hero?.mediaPublicId) || isMatch(imp.hero?.image) || (pageLower === 'impact' && isHero)) {
        usages.push({ page: 'impact', entity: 'Impact Page', section: 'Hero Section', field: 'hero.image', route: '/admin/impact' });
      }
      if (isMatch(imp.sustainability?.videoPublicId) || isMatch(imp.sustainability?.videoUrl)) {
        usages.push({ page: 'impact', entity: 'Impact Page', section: 'Sustainability & ESG', field: 'sustainability.videoUrl', route: '/admin/impact' });
      }
    }
  } catch (e) {
    console.error('[UsageScan] Error scanning ImpactPageSettings:', e);
  }

  // 4. BlogLandingSettingsModel
  try {
    const blogSettings = await BlogLandingSettingsModel.find({}).lean();
    for (const bs of blogSettings) {
      if (isMatch(bs.hero?.mediaPublicId) || isMatch(bs.hero?.image) || (pageLower === 'blog' && isHero)) {
        usages.push({ page: 'blog', entity: 'Blog Landing Settings', section: 'Hero Section', field: 'hero.image', route: '/admin/blog/settings' });
      }
    }
  } catch (e) {
    console.error('[UsageScan] Error scanning BlogLandingSettings:', e);
  }

  // 5. BlogPostModel
  try {
    const blogPosts = await BlogPostModel.find({
      $or: [
        { featuredImage: publicId },
        ...(secureUrl ? [{ featuredImage: secureUrl }] : []),
        { featuredImage: { $regex: escapeRegex(publicId), $options: 'i' } },
      ],
    }).lean();

    for (const bp of blogPosts) {
      usages.push({
        page: 'blog',
        entity: `Blog Post: ${bp.title}`,
        section: 'Featured Image',
        field: 'featuredImage',
        cmsId: String(bp._id),
        route: '/admin/blog',
      });
    }
  } catch (e) {
    console.error('[UsageScan] Error scanning BlogPost:', e);
  }

  // 6. AboutPageSettingsModel
  try {
    const aboutSettings = await AboutPageSettingsModel.find({}).lean();
    for (const a of aboutSettings) {
      if (isMatch(a.hero?.mediaPublicId) || isMatch(a.hero?.image) || (pageLower === 'about' && isHero)) {
        usages.push({ page: 'about', entity: 'About Page', section: 'Hero Section', field: 'hero.image', route: '/admin/about' });
      }
      if (isMatch(a.ourStory?.mediaPublicId) || isMatch(a.ourStory?.video)) {
        usages.push({ page: 'about', entity: 'About Page', section: 'Our Story & Origin', field: 'ourStory.video', route: '/admin/about' });
      }
      a.pillars?.list?.forEach((p: any, idx: number) => {
        if (isMatch(p.mediaPublicId) || isMatch(p.image)) {
          usages.push({ page: 'about', entity: 'About Page', section: 'Pillars', field: `pillar[${idx}]: ${p.title}`, route: '/admin/about' });
        }
      });
      a.whyChoose?.list?.forEach((w: any, idx: number) => {
        if (isMatch(w.mediaPublicId) || isMatch(w.image)) {
          usages.push({ page: 'about', entity: 'About Page', section: 'Why Choose Veenero', field: `item[${idx}]: ${w.title}`, route: '/admin/about' });
        }
      });
      a.leadership?.team?.forEach((l: any, idx: number) => {
        if (isMatch(l.mediaPublicId) || isMatch(l.image)) {
          usages.push({ page: 'about', entity: 'About Page', section: 'Leadership & Team', field: `member[${idx}]: ${l.name}`, route: '/admin/about' });
        }
      });
    }
  } catch (e) {
    console.error('[UsageScan] Error scanning AboutPageSettings:', e);
  }

  // 7. ApproachPageSettingsModel
  try {
    const approachSettings = await ApproachPageSettingsModel.find({}).lean();
    for (const ap of approachSettings) {
      if (isMatch(ap.hero?.mediaPublicId) || isMatch(ap.hero?.image) || (pageLower === 'approach' && isHero)) {
        usages.push({ page: 'approach', entity: 'Approach Page', section: 'Hero Section', field: 'hero.image', route: '/admin/approach' });
      }
      if (isMatch(ap.governance?.mediaPublicId) || isMatch(ap.governance?.image)) {
        usages.push({ page: 'approach', entity: 'Approach Page', section: 'Governance', field: 'governance.image', route: '/admin/approach' });
      }
    }
  } catch (e) {
    console.error('[UsageScan] Error scanning ApproachPageSettings:', e);
  }

  // 8. ContactPageSettingsModel
  try {
    const contactSettings = await ContactPageSettingsModel.find({}).lean();
    for (const c of contactSettings) {
      if (isMatch((c.hero as any)?.mediaPublicId) || isMatch((c.hero as any)?.image) || (pageLower === 'contact' && isHero)) {
        usages.push({ page: 'contact', entity: 'Contact Page', section: 'Hero Section', field: 'hero.image', route: '/admin/contact' });
      }
    }
  } catch (e) {
    console.error('[UsageScan] Error scanning ContactPageSettings:', e);
  }

  // 9. HomePageSettingsModel
  try {
    const homeSettings = await HomePageSettingsModel.find({}).lean();
    for (const h of homeSettings) {
      if (isMatch((h.hero as any)?.mediaPublicId) || isMatch((h.hero as any)?.image) || (pageLower === 'home' && isHero)) {
        usages.push({ page: 'home', entity: 'Home Page', section: 'Hero Section', field: 'hero.image', route: '/admin/home' });
      }
    }
  } catch (e) {
    console.error('[UsageScan] Error scanning HomePageSettings:', e);
  }

  // 10. CareerPageSettingsModel
  try {
    const careerSettings = await CareerPageSettingsModel.find({}).lean();
    for (const cr of careerSettings) {
      if (isMatch((cr.hero as any)?.mediaPublicId) || isMatch((cr.hero as any)?.image) || (pageLower === 'careers' && isHero)) {
        usages.push({ page: 'careers', entity: 'Careers Page', section: 'Hero Section', field: 'hero.image', route: '/admin/careers' });
      }
    }
  } catch (e) {
    console.error('[UsageScan] Error scanning CareerPageSettings:', e);
  }

  return usages;
}

/**
 * Checks if an asset is actively referenced by any CMS page before deletion.
 */
export async function isAssetReferencedInCms(
  publicId: string,
  secureUrl: string = '',
  page: string = '',
  section: string = '',
  slot: string = ''
): Promise<{ isReferenced: boolean; usages: CmsUsageEntry[] }> {
  const usages = await scanRealCmsUsage(publicId, secureUrl, page, section, slot);
  return {
    isReferenced: usages.length > 0,
    usages,
  };
}
