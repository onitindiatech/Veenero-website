import { Request, Response, NextFunction } from 'express';
import { CmsPageModel } from '../models/CmsPage';
import { ApiError } from '../middleware/errorHandler';

// ─── GET /api/cms/pages ───────────────────────────────────────────────────────
export const getPages = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { search, status } = req.query;
    const filter: any = {};

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (search) {
      const q = String(search).trim();
      if (q) {
        const searchRegex = new RegExp(q, 'i');
        filter.$or = [
          { name: searchRegex },
          { slug: searchRegex },
          { updatedBy: searchRegex },
        ];
      }
    }

    const pages = await CmsPageModel.find(filter).sort({ lastUpdated: -1 });
    res.status(200).json(pages);
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/cms/pages/:id ───────────────────────────────────────────────────
export const getPageById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const page = await CmsPageModel.findById(id);
    if (!page) {
      throw new ApiError(404, 'Page not found');
    }
    res.status(200).json(page);
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/cms/pages ──────────────────────────────────────────────────────
export const createPage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      name,
      slug,
      status,
      featuredImage,
      seoMetaTitle,
      seoMetaDescription,
      sections,
    } = req.body;

    if (!name || !name.trim()) {
      throw new ApiError(400, 'Page name is required');
    }
    if (!slug || !slug.trim()) {
      throw new ApiError(400, 'Slug is required');
    }

    const cleanSlug = slug.trim();
    const existingPage = await CmsPageModel.findOne({ slug: cleanSlug });
    if (existingPage) {
      throw new ApiError(400, `A page with slug '${cleanSlug}' already exists`);
    }

    // Recompute SEO Status
    const seoTitle = seoMetaTitle || '';
    const seoDesc = seoMetaDescription || '';
    let seoStatus: 'good' | 'needs-work' | 'poor' = 'poor';
    if (seoTitle.length >= 30 && seoDesc.length >= 80) {
      seoStatus = 'good';
    } else if (seoTitle.length >= 30 || seoDesc.length >= 50) {
      seoStatus = 'needs-work';
    }

    const newPage = new CmsPageModel({
      name: name.trim(),
      slug: cleanSlug,
      status: status || 'draft',
      featuredImage: featuredImage || null,
      seoMetaTitle: seoTitle,
      seoMetaDescription: seoDesc,
      seoStatus,
      lastUpdated: new Date().toISOString(),
      updatedBy: 'Aditya Choubey',
      sections: sections || [],
      isCoreSystemPage: false,
    });

    await newPage.save();
    res.status(201).json(newPage);
  } catch (error) {
    next(error);
  }
};

// ─── PUT /api/cms/pages/:id ───────────────────────────────────────────────────
export const updatePage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const page = await CmsPageModel.findById(id);
    if (!page) {
      throw new ApiError(404, 'Page not found');
    }

    if (updateData.slug && updateData.slug.trim() !== page.slug) {
      const cleanSlug = updateData.slug.trim();
      const existingPage = await CmsPageModel.findOne({ slug: cleanSlug });
      if (existingPage) {
        throw new ApiError(400, `A page with slug '${cleanSlug}' already exists`);
      }
      page.slug = cleanSlug;
    }

    if (updateData.name !== undefined) page.name = updateData.name.trim();
    if (updateData.status !== undefined) page.status = updateData.status;
    if (updateData.featuredImage !== undefined) {
      page.featuredImage = updateData.featuredImage || null;
    }
    if (updateData.seoMetaTitle !== undefined) {
      page.seoMetaTitle = updateData.seoMetaTitle;
    }
    if (updateData.seoMetaDescription !== undefined) {
      page.seoMetaDescription = updateData.seoMetaDescription;
    }
    if (updateData.sections !== undefined) {
      page.sections = updateData.sections;
    }

    // Recompute SEO Status
    const seoTitle = page.seoMetaTitle || '';
    const seoDesc = page.seoMetaDescription || '';
    let seoStatus: 'good' | 'needs-work' | 'poor' = 'poor';
    if (seoTitle.length >= 30 && seoDesc.length >= 80) {
      seoStatus = 'good';
    } else if (seoTitle.length >= 30 || seoDesc.length >= 50) {
      seoStatus = 'needs-work';
    }
    page.seoStatus = seoStatus;
    page.lastUpdated = new Date().toISOString();
    page.updatedBy = 'Aditya Choubey';

    await page.save();
    res.status(200).json(page);
  } catch (error) {
    next(error);
  }
};

// ─── DELETE /api/cms/pages/:id ────────────────────────────────────────────────
export const deletePage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const page = await CmsPageModel.findById(id);
    if (!page) {
      throw new ApiError(404, 'Page not found');
    }
    if (page.isCoreSystemPage) {
      throw new ApiError(400, 'Core system pages cannot be deleted');
    }

    await CmsPageModel.deleteOne({ _id: id });
    res.status(200).json({ success: true, message: 'Page deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// ─── PATCH /api/cms/pages/:id/publish ──────────────────────────────────────────
export const publishPage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { publish } = req.body;

    const page = await CmsPageModel.findById(id);
    if (!page) {
      throw new ApiError(404, 'Page not found');
    }

    page.status = publish ? 'published' : 'draft';
    page.lastUpdated = new Date().toISOString();

    await page.save();
    res.status(200).json(page);
  } catch (error) {
    next(error);
  }
};
