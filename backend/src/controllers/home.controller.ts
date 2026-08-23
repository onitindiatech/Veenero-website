import { Request, Response, NextFunction } from 'express';
import { HomePageSettingsModel } from '../models/HomePageSettings';
import { ApiError } from '../middleware/errorHandler';

/**
 * GET /api/home
 * Public endpoint to fetch active, published homepage configuration.
 */
export const getPublicHome = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = await HomePageSettingsModel.findOne({});
    if (!settings) {
      throw new ApiError(500, 'Home page settings not found. Please seed the database.');
    }
    res.json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/home
 * Admin endpoint to retrieve all homepage settings.
 */
export const getAdminHome = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = await HomePageSettingsModel.findOne({});
    if (!settings) {
      throw new ApiError(500, 'Home page settings not found. Please seed the database.');
    }
    res.json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/admin/home
 * Admin endpoint to update homepage settings.
 */
export const updateAdminHome = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { hero, about, solutions, approach, impact, partners, careers, contact, footer, seo } = req.body;

    // Validate Hero section if it is being updated (since it's Phase 6 focus)
    if (hero) {
      if (typeof hero !== 'object') {
        throw new ApiError(400, 'Hero section must be an object');
      }
      const requiredHeroFields = [
        'title',
        'eyebrow',
        'description',
        'primaryCtaText',
        'primaryCtaLink',
        'secondaryCtaText',
        'secondaryCtaLink',
        'image',
        'imageAlt',
        'bottomText',
      ];
      for (const field of requiredHeroFields) {
        if (hero[field] === undefined) {
          throw new ApiError(400, `Hero section is missing required field: ${field}`);
        }
      }
      if (typeof hero.visible !== 'boolean') {
        throw new ApiError(400, 'Hero field visible must be a boolean');
      }
    }

    const userName = req.user?.name || 'Admin User';

    // Construct updates object
    const updates: any = {
      updatedBy: userName,
    };

    if (hero) updates.hero = hero;
    if (about) updates.about = about;
    if (solutions) updates.solutions = solutions;
    if (approach) updates.approach = approach;
    if (impact) updates.impact = impact;
    if (partners) updates.partners = partners;
    if (careers) updates.careers = careers;
    if (contact) updates.contact = contact;
    if (footer) updates.footer = footer;
    if (seo) updates.seo = seo;

    const settings = await HomePageSettingsModel.findOneAndUpdate(
      {},
      updates,
      { upsert: true, new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: settings,
      message: 'Home page CMS configuration updated successfully',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/home/sections/:section
 * Admin endpoint to retrieve a specific section configuration.
 */
export const getHomeSection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const section = req.params.section as string;
    const settings = await HomePageSettingsModel.findOne({});
    if (!settings) {
      throw new ApiError(500, 'Home page settings not found. Please seed the database.');
    }

    const validSections = ['hero', 'about', 'solutions', 'approach', 'impact', 'partners', 'careers', 'contact', 'footer', 'seo'];
    if (!validSections.includes(section)) {
      throw new ApiError(400, `Invalid section requested: ${section}`);
    }

    const sectionData = (settings as any)[section];
    res.json({ success: true, data: sectionData });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/admin/home/sections/:section
 * Admin endpoint to update a specific section configuration.
 */
export const updateHomeSection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const section = req.params.section as string;
    const validSections = ['hero', 'about', 'solutions', 'approach', 'impact', 'partners', 'careers', 'contact', 'footer', 'seo'];
    if (!validSections.includes(section)) {
      throw new ApiError(400, `Invalid section requested: ${section}`);
    }

    const userName = req.user?.name || 'Admin User';
    const updates: any = {
      [section]: req.body,
      updatedBy: userName,
    };

    const settings = await HomePageSettingsModel.findOneAndUpdate(
      {},
      updates,
      { upsert: true, new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: (settings as any)[section],
      message: `Section ${section} updated successfully`,
    });
  } catch (err) {
    next(err);
  }
};

// ─── Repeatable Solutions CRUD ───────────────────────────────────────────────

export const getSolutionsCollection = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = await HomePageSettingsModel.findOne({});
    res.json({ success: true, data: settings?.solutions?.list || [] });
  } catch (err) {
    next(err);
  }
};

export const createSolutionItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = await HomePageSettingsModel.findOne({});
    if (!settings) throw new ApiError(500, 'Settings not found');

    const newSolution = req.body;
    settings.solutions.list.push(newSolution);
    settings.updatedBy = req.user?.name || 'Admin User';
    await settings.save();

    res.json({ success: true, data: settings.solutions.list, message: 'Solution added successfully' });
  } catch (err) {
    next(err);
  }
};

export const updateSolutionItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const indexParam = req.params.index as string;
    const index = parseInt(indexParam, 10);
    const settings = await HomePageSettingsModel.findOne({});
    if (!settings) throw new ApiError(500, 'Settings not found');
    if (isNaN(index) || index < 0 || index >= settings.solutions.list.length) {
      throw new ApiError(404, 'Solution item not found');
    }

    Object.assign(settings.solutions.list[index], req.body);
    settings.updatedBy = req.user?.name || 'Admin User';
    await settings.save();

    res.json({ success: true, data: settings.solutions.list[index], message: 'Solution updated successfully' });
  } catch (err) {
    next(err);
  }
};

export const deleteSolutionItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const indexParam = req.params.index as string;
    const index = parseInt(indexParam, 10);
    const settings = await HomePageSettingsModel.findOne({});
    if (!settings) throw new ApiError(500, 'Settings not found');
    if (isNaN(index) || index < 0 || index >= settings.solutions.list.length) {
      throw new ApiError(404, 'Solution item not found');
    }

    settings.solutions.list.splice(index, 1);
    settings.updatedBy = req.user?.name || 'Admin User';
    await settings.save();

    res.json({ success: true, data: settings.solutions.list, message: 'Solution deleted successfully' });
  } catch (err) {
    next(err);
  }
};

export const reorderSolutionsCollection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { list } = req.body;
    if (!Array.isArray(list)) throw new ApiError(400, 'List must be an array');
    const settings = await HomePageSettingsModel.findOne({});
    if (!settings) throw new ApiError(500, 'Settings not found');

    settings.solutions.list = list;
    settings.updatedBy = req.user?.name || 'Admin User';
    await settings.save();

    res.json({ success: true, data: settings.solutions.list, message: 'Solutions reordered successfully' });
  } catch (err) {
    next(err);
  }
};

// ─── Repeatable Partners CRUD ────────────────────────────────────────────────

export const getPartnersCollection = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = await HomePageSettingsModel.findOne({});
    res.json({ success: true, data: settings?.partners?.list || [] });
  } catch (err) {
    next(err);
  }
};

export const createPartnerItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = await HomePageSettingsModel.findOne({});
    if (!settings) throw new ApiError(500, 'Settings not found');

    const newPartner = req.body;
    settings.partners.list.push(newPartner);
    settings.updatedBy = req.user?.name || 'Admin User';
    await settings.save();

    res.json({ success: true, data: settings.partners.list, message: 'Partner added successfully' });
  } catch (err) {
    next(err);
  }
};

export const updatePartnerItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const indexParam = req.params.index as string;
    const index = parseInt(indexParam, 10);
    const settings = await HomePageSettingsModel.findOne({});
    if (!settings) throw new ApiError(500, 'Settings not found');
    if (isNaN(index) || index < 0 || index >= settings.partners.list.length) {
      throw new ApiError(404, 'Partner item not found');
    }

    Object.assign(settings.partners.list[index], req.body);
    settings.updatedBy = req.user?.name || 'Admin User';
    await settings.save();

    res.json({ success: true, data: settings.partners.list[index], message: 'Partner updated successfully' });
  } catch (err) {
    next(err);
  }
};

export const deletePartnerItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const indexParam = req.params.index as string;
    const index = parseInt(indexParam, 10);
    const settings = await HomePageSettingsModel.findOne({});
    if (!settings) throw new ApiError(500, 'Settings not found');
    if (isNaN(index) || index < 0 || index >= settings.partners.list.length) {
      throw new ApiError(404, 'Partner item not found');
    }

    settings.partners.list.splice(index, 1);
    settings.updatedBy = req.user?.name || 'Admin User';
    await settings.save();

    res.json({ success: true, data: settings.partners.list, message: 'Partner deleted successfully' });
  } catch (err) {
    next(err);
  }
};

