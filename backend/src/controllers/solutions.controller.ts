import { Request, Response, NextFunction } from 'express';
import { SolutionsPageSettings, ISolutionsPageSettings } from '../models/SolutionsPageSettings';
import { MediaModel } from '../models/Media';

/**
 * Helper: retrieves existing Solutions settings or creates one with defaults.
 */
export const getOrCreateSolutionsSettings = async (): Promise<ISolutionsPageSettings> => {
  let settings = await SolutionsPageSettings.findOne();
  if (!settings) {
    settings = await SolutionsPageSettings.create({});
  }
  return settings;
};

// ─── Public Controller ────────────────────────────────────────────────────────

/**
 * GET /api/solutions
 * Returns the public Solutions Landing Page content, dynamically resolving
 * active Media Library / Cloudinary assets and filtering inactive items.
 */
export const getPublicSolutions = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const settings = await getOrCreateSolutionsSettings();
    const publicData: any = settings.toJSON();

    // ── Media Library Dynamic Resolution ─────────────────────────────────────
    const solutionsMedia = await MediaModel.find({
      page: new RegExp('^solutions$', 'i'),
    })
      .sort({ createdAt: -1 })
      .lean();

    const findActiveMedia = (sectionPattern: RegExp, slotPattern: RegExp) => {
      return solutionsMedia.find(
        (m) =>
          !m.deletedAt &&
          sectionPattern.test(m.section || '') &&
          slotPattern.test(m.slot || '')
      );
    };

    // 1. Hero Section Image
    const heroAsset = findActiveMedia(/hero/i, /hero\s*visual/i);
    if (heroAsset && publicData.hero) {
      publicData.hero.image = heroAsset.secureUrl;
      if (heroAsset.altText) publicData.hero.imageAlt = heroAsset.altText;
      publicData.hero.mediaPublicId = heroAsset.publicId;
    }

    // 2. Ecosystem Intro Image
    const introAsset = findActiveMedia(/intro|ecosystem/i, /illustration|visual/i);
    if (introAsset && publicData.intro) {
      publicData.intro.image = introAsset.secureUrl;
      publicData.intro.mediaPublicId = introAsset.publicId;
    }

    // 3. Featured Solution Image
    const featuredAsset = findActiveMedia(/featured/i, /visual|image/i);
    if (featuredAsset && publicData.featuredSolution) {
      publicData.featuredSolution.image = featuredAsset.secureUrl;
      publicData.featuredSolution.mediaPublicId = featuredAsset.publicId;
    }

    // 4. Analytics Platform Callout Card Image
    const analyticsAsset = findActiveMedia(/grid|analytics/i, /analytics|callout/i);
    if (analyticsAsset && publicData.gridHeader?.calloutCard) {
      publicData.gridHeader.calloutCard.image = analyticsAsset.secureUrl;
      publicData.gridHeader.calloutCard.mediaPublicId = analyticsAsset.publicId;
    }

    // 5. Category Images resolution from Media Library
    if (publicData.categories && Array.isArray(publicData.categories)) {
      publicData.categories = publicData.categories.map((cat: any) => {
        const catAsset = solutionsMedia.find(
          (m) =>
            !m.deletedAt &&
            /category|categories/i.test(m.section || '') &&
            (new RegExp(cat.key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i').test(m.slot || '') ||
              new RegExp(cat.slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i').test(m.slot || ''))
        );
        if (catAsset) {
          cat.image = catAsset.secureUrl;
          cat.mediaPublicId = catAsset.publicId;
        }
        return cat;
      });
    }

    // 6. Solution Cards Image resolution from Media Library
    if (publicData.solutions && Array.isArray(publicData.solutions)) {
      publicData.solutions = publicData.solutions.map((sol: any) => {
        const solAsset = solutionsMedia.find(
          (m) =>
            !m.deletedAt &&
            /solution|card/i.test(m.section || '') &&
            (new RegExp(sol.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i').test(m.slot || '') ||
              new RegExp(sol.slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i').test(m.slot || ''))
        );
        if (solAsset) {
          sol.image = solAsset.secureUrl;
          sol.mediaPublicId = solAsset.publicId;
        }
        return sol;
      });
    }

    // ── Filter inactive repeatable items and sort by order ───────────────────
    if (publicData.categories && Array.isArray(publicData.categories)) {
      publicData.categories = publicData.categories
        .filter((c: any) => c.isActive !== false)
        .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
    }

    if (publicData.solutions && Array.isArray(publicData.solutions)) {
      publicData.solutions = publicData.solutions
        .filter((s: any) => s.isActive !== false)
        .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
    }

    res.json({
      success: true,
      data: publicData,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Admin Controller ─────────────────────────────────────────────────────────

/**
 * GET /api/admin/solutions
 * Returns full Solutions Page settings for Admin CMS dashboard.
 */
export const getAdminSolutions = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const settings = await getOrCreateSolutionsSettings();
    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/admin/solutions
 * Updates the entire Solutions settings document.
 */
export const updateAdminSolutions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const settings = await getOrCreateSolutionsSettings();
    const updateData = req.body;

    const user = (req as any).user;
    if (user?.name || user?.email) {
      updateData.lastUpdatedBy = user.name || user.email;
    }

    Object.assign(settings, updateData);
    const updated = await settings.save();

    res.json({
      success: true,
      message: 'Solutions settings updated successfully.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/solutions/sections/:section
 * Retrieves a single section of the Solutions Page.
 */
export const getSolutionsSection = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const section = String(req.params.section);
    const settings = await getOrCreateSolutionsSettings();

    if (!(section in settings.toObject())) {
      res.status(404).json({
        success: false,
        error: { message: `Section '${section}' not found in Solutions settings.` },
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
 * PUT /api/admin/solutions/sections/:section
 * Updates a specific section of the Solutions settings.
 */
export const updateSolutionsSection = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const section = String(req.params.section);
    const sectionData = req.body;
    const settings = await getOrCreateSolutionsSettings();

    const allowedSections = [
      'hero',
      'intro',
      'gridHeader',
      'categories',
      'solutions',
      'featuredSolution',
      'flow',
      'cta',
      'seo',
      'isPublished',
    ];

    if (!allowedSections.includes(section)) {
      res.status(400).json({
        success: false,
        error: { message: `Invalid section '${section}'. Allowed: ${allowedSections.join(', ')}` },
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

// ─── Categories CRUD ──────────────────────────────────────────────────────────

/**
 * POST /api/admin/solutions/categories
 * Creates a new category item.
 */
export const createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const settings = await getOrCreateSolutionsSettings();
    const newCategoryData = req.body;

    if (!newCategoryData.displayLabel || !newCategoryData.slug) {
      res.status(400).json({
        success: false,
        error: { message: 'Category displayLabel and slug are required.' },
      });
      return;
    }

    if (!newCategoryData.key) {
      newCategoryData.key = newCategoryData.displayLabel;
    }

    if (!newCategoryData.order) {
      newCategoryData.order = settings.categories.length + 1;
    }

    settings.categories.push(newCategoryData);
    await settings.save();

    const created = settings.categories[settings.categories.length - 1];

    res.status(201).json({
      success: true,
      message: 'Category created successfully.',
      data: created,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/admin/solutions/categories/:id
 * Updates an existing category by ID.
 */
export const updateCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = String(req.params.id);
    const updateData = req.body;
    const settings = await getOrCreateSolutionsSettings();

    const category = settings.categories.find((c: any) => String(c._id || c.id) === id);
    if (!category) {
      res.status(404).json({
        success: false,
        error: { message: `Category with ID '${id}' not found.` },
      });
      return;
    }

    Object.assign(category, updateData);
    await settings.save();

    res.json({
      success: true,
      message: 'Category updated successfully.',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/admin/solutions/categories/:id
 * Deletes a category by ID.
 */
export const deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = String(req.params.id);
    const settings = await getOrCreateSolutionsSettings();

    const initialLength = settings.categories.length;
    settings.categories = settings.categories.filter((c: any) => String(c._id || c.id) !== id);

    if (settings.categories.length === initialLength) {
      res.status(404).json({
        success: false,
        error: { message: `Category with ID '${id}' not found.` },
      });
      return;
    }

    await settings.save();

    res.json({
      success: true,
      message: 'Category deleted successfully.',
      data: { id },
    });
  } catch (error) {
    next(error);
  }
};

// ─── Solutions CRUD ───────────────────────────────────────────────────────────

/**
 * POST /api/admin/solutions/items
 * Creates a new solution item.
 */
export const createSolutionItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const settings = await getOrCreateSolutionsSettings();
    const newSolutionData = req.body;

    if (!newSolutionData.title || !newSolutionData.categoryKey) {
      res.status(400).json({
        success: false,
        error: { message: 'Solution title and categoryKey are required.' },
      });
      return;
    }

    if (!newSolutionData.id) {
      newSolutionData.id = newSolutionData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }

    if (!newSolutionData.slug) {
      newSolutionData.slug = newSolutionData.id;
    }

    if (!newSolutionData.pillar) {
      newSolutionData.pillar = newSolutionData.categoryKey;
    }

    if (!newSolutionData.order) {
      newSolutionData.order = settings.solutions.length + 1;
    }

    settings.solutions.push(newSolutionData);
    await settings.save();

    const created = settings.solutions[settings.solutions.length - 1];

    res.status(201).json({
      success: true,
      message: 'Solution item created successfully.',
      data: created,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/admin/solutions/items/:id
 * Updates an existing solution item by ID.
 */
export const updateSolutionItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = String(req.params.id);
    const updateData = req.body;
    const settings = await getOrCreateSolutionsSettings();

    const solution = settings.solutions.find((s: any) => String(s._id || s.id) === id);
    if (!solution) {
      res.status(404).json({
        success: false,
        error: { message: `Solution item with ID '${id}' not found.` },
      });
      return;
    }

    Object.assign(solution, updateData);
    await settings.save();

    res.json({
      success: true,
      message: 'Solution item updated successfully.',
      data: solution,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/admin/solutions/items/:id
 * Deletes a solution item by ID.
 */
export const deleteSolutionItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = String(req.params.id);
    const settings = await getOrCreateSolutionsSettings();

    const initialLength = settings.solutions.length;
    settings.solutions = settings.solutions.filter((s: any) => String(s._id || s.id) !== id);

    if (settings.solutions.length === initialLength) {
      res.status(404).json({
        success: false,
        error: { message: `Solution item with ID '${id}' not found.` },
      });
      return;
    }

    await settings.save();

    res.json({
      success: true,
      message: 'Solution item deleted successfully.',
      data: { id },
    });
  } catch (error) {
    next(error);
  }
};
