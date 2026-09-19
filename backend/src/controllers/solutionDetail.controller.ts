import { Request, Response, NextFunction } from 'express';
import { SolutionDetailModel, SolutionStatus } from '../models/SolutionDetail';
import { MediaModel } from '../models/Media';
import { ApiError } from '../middleware/errorHandler';

// Helper to generate a URL-safe slug
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Helper: ensure slug uniqueness among non-deleted solutions
async function ensureUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;
  const query: Record<string, unknown> = excludeId
    ? { slug, deletedAt: null, _id: { $ne: excludeId } }
    : { slug, deletedAt: null };

  while (await SolutionDetailModel.findOne(query)) {
    slug = `${baseSlug}-${counter++}`;
    query.slug = slug;
  }
  return slug;
}

// ─── PUBLIC ACTIONS ──────────────────────────────────────────────────────────

/**
 * GET /api/solutions-detail/:slug
 * Retrieves public solution detail by slug (case-insensitive).
 */
export const getPublicSolutionDetailBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const rawSlug = String(req.params.slug || '').trim().toLowerCase();
    if (!rawSlug) {
      throw new ApiError(400, 'Solution slug parameter is required');
    }

    const solution = await SolutionDetailModel.findOne({
      slug: rawSlug,
      status: { $in: ['PUBLISHED', 'ACTIVE'] },
      deletedAt: null,
    }).lean();

    if (!solution) {
      throw new ApiError(404, `Solution detail not found for '${rawSlug}'`);
    }

    // Dynamic resolution from Media Library if mediaPublicId is defined
    if (solution.heroMediaPublicId) {
      const heroAsset = await MediaModel.findOne({ publicId: solution.heroMediaPublicId, deletedAt: null }).lean();
      if (heroAsset?.secureUrl) {
        solution.heroImage = heroAsset.secureUrl;
        if (heroAsset.altText) solution.heroImageAlt = heroAsset.altText;
      }
    }

    if (solution.useCases?.items && Array.isArray(solution.useCases.items)) {
      for (const item of solution.useCases.items) {
        if (item.mediaPublicId) {
          const asset = await MediaModel.findOne({ publicId: item.mediaPublicId, deletedAt: null }).lean();
          if (asset?.secureUrl) {
            item.image = asset.secureUrl;
          }
        }
      }
    }

    if (solution.industries && Array.isArray(solution.industries)) {
      for (const ind of solution.industries) {
        if (ind.mediaPublicId) {
          const asset = await MediaModel.findOne({ publicId: ind.mediaPublicId, deletedAt: null }).lean();
          if (asset?.secureUrl) {
            ind.image = asset.secureUrl;
          }
        }
      }
    }

    if (solution.seo?.ogImagePublicId) {
      const ogAsset = await MediaModel.findOne({ publicId: solution.seo.ogImagePublicId, deletedAt: null }).lean();
      if (ogAsset?.secureUrl) {
        solution.seo.ogImage = ogAsset.secureUrl;
      }
    }

    res.status(200).json({
      success: true,
      data: solution,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/solutions-detail
 * Retrieves all published solution details for public indexing.
 */
export const getPublicSolutionDetailsList = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const solutions = await SolutionDetailModel.find({
      status: { $in: ['PUBLISHED', 'ACTIVE'] },
      deletedAt: null,
    })
      .sort({ sortOrder: 1, createdAt: 1 })
      .lean();

    res.status(200).json({
      success: true,
      data: solutions,
    });
  } catch (error) {
    next(error);
  }
};

// ─── ADMIN ACTIONS ───────────────────────────────────────────────────────────

/**
 * GET /api/admin/solutions-detail
 * Retrieves all non-deleted solutions for admin panel.
 */
export const getAdminSolutionDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { search, category, status } = req.query;

    const query: Record<string, unknown> = {
      deletedAt: null,
      status: { $ne: 'TRASHED' },
    };

    if (status && typeof status === 'string' && status !== 'all') {
      query.status = status;
    }

    if (category && typeof category === 'string' && category !== 'all') {
      query.categoryKey = category;
    }

    if (search && typeof search === 'string' && search.trim()) {
      const q = search.trim();
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { slug: { $regex: q, $options: 'i' } },
        { badge: { $regex: q, $options: 'i' } },
        { heroDescription: { $regex: q, $options: 'i' } },
      ];
    }

    const solutions = await SolutionDetailModel.find(query).sort({ sortOrder: 1, createdAt: 1 });

    // Compute stats
    const allSolutions = await SolutionDetailModel.find({ deletedAt: null, status: { $ne: 'TRASHED' } });
    const total = allSolutions.length;
    const published = allSolutions.filter((s) => s.status === 'PUBLISHED').length;
    const drafts = allSolutions.filter((s) => s.status === 'DRAFT').length;

    const trashedCount = await SolutionDetailModel.countDocuments({
      $or: [{ status: 'TRASHED' }, { deletedAt: { $ne: null } }],
    });

    res.status(200).json({
      success: true,
      data: solutions,
      stats: {
        total,
        published,
        drafts,
        trashed: trashedCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/solutions-detail/recycle-bin
 * Retrieves soft-deleted solutions.
 */
export const getRecycleBin = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const trashed = await SolutionDetailModel.find({
      $or: [{ status: 'TRASHED' }, { deletedAt: { $ne: null } }],
    }).sort({ deletedAt: -1 });

    res.status(200).json({
      success: true,
      data: trashed,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/solutions-detail/:id
 * Retrieves single solution detail by ID.
 */
export const getAdminSolutionDetailById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const solution = await SolutionDetailModel.findById(req.params.id);
    if (!solution) {
      throw new ApiError(404, 'Solution detail not found');
    }

    res.status(200).json({
      success: true,
      data: solution,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/admin/solutions-detail
 * Creates a new solution detail.
 */
export const createSolutionDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const payload = req.body;
    if (!payload.title) {
      throw new ApiError(400, 'Solution title is required');
    }

    const baseSlug = payload.slug ? generateSlug(payload.slug) : generateSlug(payload.title);
    const finalSlug = await ensureUniqueSlug(baseSlug);

    const userName = (req as any).user?.name || (req as any).user?.email || 'Admin User';

    const count = await SolutionDetailModel.countDocuments({ deletedAt: null });

    const newSolution = await SolutionDetailModel.create({
      ...payload,
      slug: finalSlug,
      sortOrder: payload.sortOrder ?? count + 1,
      status: payload.status || 'DRAFT',
      publishedAt: payload.status === 'PUBLISHED' ? new Date() : undefined,
      createdBy: userName,
      updatedBy: userName,
    });

    res.status(201).json({
      success: true,
      data: newSolution,
      message: 'Solution detail created successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/admin/solutions-detail/:id
 * Updates an existing solution detail.
 */
export const updateSolutionDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const solution = await SolutionDetailModel.findOne({ _id: id, deletedAt: null });

    if (!solution) {
      throw new ApiError(404, 'Solution detail not found or is in recycle bin');
    }

    const payload = req.body;

    // Handle slug change if provided
    if (payload.slug && typeof payload.slug === 'string') {
      const baseSlug = generateSlug(payload.slug);
      if (baseSlug !== solution.slug) {
        payload.slug = await ensureUniqueSlug(baseSlug, String(id));
      }
    }

    // Handle status change
    if (payload.status && payload.status !== solution.status) {
      if (payload.status === 'PUBLISHED' && !solution.publishedAt) {
        payload.publishedAt = new Date();
      }
    }

    const userName = (req as any).user?.name || (req as any).user?.email || 'Admin User';
    payload.updatedBy = userName;

    Object.assign(solution, payload);
    await solution.save();

    res.status(200).json({
      success: true,
      data: solution,
      message: 'Solution detail updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/admin/solutions-detail/:id/status
 * Updates published / draft status.
 */
export const updateSolutionStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(status)) {
      throw new ApiError(400, 'Invalid status parameter. Allowed: DRAFT, PUBLISHED, ARCHIVED');
    }

    const solution = await SolutionDetailModel.findOne({ _id: id, deletedAt: null });
    if (!solution) {
      throw new ApiError(404, 'Solution detail not found');
    }

    if (status === 'PUBLISHED' && !solution.publishedAt) {
      solution.publishedAt = new Date();
    }

    solution.status = status as SolutionStatus;
    solution.updatedBy = (req as any).user?.name || (req as any).user?.email || 'Admin User';
    await solution.save();

    res.status(200).json({
      success: true,
      data: solution,
      message: `Solution status updated to ${status}`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/admin/solutions-detail/:id/duplicate
 * Duplicates a solution detail item.
 */
export const duplicateSolutionDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const original = await SolutionDetailModel.findOne({ _id: id, deletedAt: null });
    if (!original) {
      throw new ApiError(404, 'Solution detail not found to duplicate');
    }

    const baseSlug = `${original.slug}-copy`;
    const newSlug = await ensureUniqueSlug(baseSlug);
    const userName = (req as any).user?.name || (req as any).user?.email || 'Admin User';

    const copyData: any = original.toObject();
    delete copyData._id;
    delete copyData.id;
    delete copyData.createdAt;
    delete copyData.updatedAt;

    copyData.title = `${original.title} (Copy)`;
    copyData.slug = newSlug;
    copyData.status = 'DRAFT';
    copyData.sortOrder = (original.sortOrder || 0) + 1;
    copyData.createdBy = userName;
    copyData.updatedBy = userName;
    copyData.publishedAt = undefined;

    const duplicate = await SolutionDetailModel.create(copyData);

    res.status(201).json({
      success: true,
      data: duplicate,
      message: 'Solution detail duplicated successfully as Draft',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/admin/solutions-detail/:id (Soft Delete)
 * Moves solution to recycle bin.
 */
export const softDeleteSolutionDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const solution = await SolutionDetailModel.findOne({ _id: id, deletedAt: null });
    if (!solution) {
      throw new ApiError(404, 'Solution detail not found or already deleted');
    }

    const userName = (req as any).user?.name || (req as any).user?.email || 'Admin User';

    solution.previousStatus = solution.status === 'TRASHED' ? 'DRAFT' : solution.status;
    solution.status = 'TRASHED';
    solution.deletedAt = new Date();
    solution.deletedBy = userName;
    solution.updatedBy = userName;

    await solution.save();

    res.status(200).json({
      success: true,
      message: 'Solution moved to recycle bin successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/admin/solutions-detail/:id/restore
 * Restores solution from recycle bin.
 */
export const restoreSolutionDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const solution = await SolutionDetailModel.findOne({
      _id: id,
      $or: [{ status: 'TRASHED' }, { deletedAt: { $ne: null } }],
    });

    if (!solution) {
      throw new ApiError(404, 'Solution not found in recycle bin');
    }

    // Slug collision check
    const existing = await SolutionDetailModel.findOne({ slug: solution.slug, deletedAt: null });
    if (existing) {
      solution.slug = await ensureUniqueSlug(solution.slug);
    }

    const targetStatus = (solution.previousStatus && solution.previousStatus !== 'TRASHED')
      ? solution.previousStatus
      : 'DRAFT';

    solution.status = targetStatus;
    solution.previousStatus = undefined;
    solution.deletedAt = null;
    solution.deletedBy = undefined;
    solution.updatedBy = (req as any).user?.name || (req as any).user?.email || 'Admin User';

    await solution.save();

    res.status(200).json({
      success: true,
      data: solution,
      message: 'Solution restored successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/admin/solutions-detail/:id/permanent
 * Permanently destroys solution record.
 */
export const permanentlyDeleteSolutionDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userRole = (req as any).user?.role;

    if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
      throw new ApiError(403, 'Permanent deletion requires ADMIN or SUPER_ADMIN role');
    }

    const result = await SolutionDetailModel.findByIdAndDelete(id);
    if (!result) {
      throw new ApiError(404, 'Solution not found');
    }

    res.status(200).json({
      success: true,
      message: 'Solution permanently deleted',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/admin/solutions-detail/reorder
 * Reorders solutions with array of { id, sortOrder }.
 */
export const reorderSolutionDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      throw new ApiError(400, 'items array with id and sortOrder is required');
    }

    const updates = items.map((item) =>
      SolutionDetailModel.updateOne(
        { _id: item.id },
        { $set: { sortOrder: item.sortOrder } }
      )
    );

    await Promise.all(updates);

    res.status(200).json({
      success: true,
      message: 'Solution order updated successfully',
    });
  } catch (error) {
    next(error);
  }
};
