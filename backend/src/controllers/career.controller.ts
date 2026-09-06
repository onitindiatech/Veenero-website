import { Request, Response, NextFunction } from 'express';
import { CareerModel, CareerStatus } from '../models/Career';
import { ApiError } from '../middleware/errorHandler';

// Helper to generate a URL-safe slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Helper: ensure slug uniqueness among non-deleted careers
async function ensureUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;
  const query: Record<string, unknown> = excludeId
    ? { slug, deletedAt: null, _id: { $ne: excludeId } }
    : { slug, deletedAt: null };

  while (await CareerModel.findOne(query)) {
    slug = `${baseSlug}-${counter++}`;
    query.slug = slug;
  }
  return slug;
}

// ─── PUBLIC ACTIONS ──────────────────────────────────────────────────────────

// GET /api/careers
export const getPublicCareers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { search, department, location, employmentType } = req.query;

    const query: Record<string, unknown> = {
      status: { $in: ['PUBLISHED', 'ACTIVE'] },
      deletedAt: null,
    };

    if (department && typeof department === 'string' && department !== 'all') {
      query.department = department;
    }

    if (location && typeof location === 'string' && location !== 'all') {
      query.location = location;
    }

    if (employmentType && typeof employmentType === 'string' && employmentType !== 'all') {
      query.employmentType = employmentType;
    }

    if (search && typeof search === 'string' && search.trim()) {
      const q = search.trim();
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { department: { $regex: q, $options: 'i' } },
        { location: { $regex: q, $options: 'i' } },
        { shortDescription: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { skills: { $regex: q, $options: 'i' } },
      ];
    }

    const careers = await CareerModel.find(query).sort({ sortOrder: 1, createdAt: -1 });

    res.status(200).json(careers);
  } catch (error) {
    next(error);
  }
};

// GET /api/careers/:slug
export const getPublicCareerBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const slugParam = req.params.slug;
    const cleanSlug = typeof slugParam === 'string' ? slugParam.toLowerCase().trim() : '';
    const career = await CareerModel.findOne({
      slug: cleanSlug,
      status: { $in: ['PUBLISHED', 'ACTIVE'] },
      deletedAt: null,
    });

    if (!career) {
      throw new ApiError(404, 'Job opening not found or inactive');
    }

    res.status(200).json(career);
  } catch (error) {
    next(error);
  }
};

// ─── ADMIN CMS ACTIONS ────────────────────────────────────────────────────────

// GET /api/admin/careers
export const getAdminCareers = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const careers = await CareerModel.find({
      deletedAt: null,
      status: { $ne: 'TRASHED' },
    }).sort({ createdAt: -1 });

    // Compute stats
    const total = careers.length;
    const published = careers.filter((c) => c.status === 'PUBLISHED' || c.status === 'ACTIVE').length;
    const drafts = careers.filter((c) => c.status === 'DRAFT').length;
    const archived = careers.filter((c) => c.status === 'ARCHIVED' || c.status === 'CLOSED').length;
    const featured = careers.filter((c) => c.isFeatured).length;

    res.status(200).json({
      success: true,
      data: careers,
      stats: { total, published, drafts, archived, featured },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/careers/recycle-bin
export const getRecycleBin = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const careers = await CareerModel.find({
      $or: [{ status: 'TRASHED' }, { deletedAt: { $ne: null } }],
    }).sort({ deletedAt: -1 });

    res.status(200).json({ success: true, data: careers });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/careers/:id
export const getAdminCareerById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const career = await CareerModel.findOne({
      _id: req.params.id,
      deletedAt: null,
    });

    if (!career) {
      throw new ApiError(404, 'Career opening not found');
    }

    res.status(200).json({ success: true, data: career });
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/careers
export const createCareer = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      title,
      slug: rawSlug,
      department,
      location,
      employmentType,
      description,
      shortDescription,
      responsibilities,
      requirements,
      niceToHave,
      qualifications,
      skills,
      experience,
      salaryRange,
      applicationUrl,
      applicationEmail,
      status,
      isFeatured,
      sortOrder,
    } = req.body;

    if (!title || !department || !location || !employmentType || !shortDescription || !description || !experience) {
      throw new ApiError(400, 'Required fields missing: title, department, location, employmentType, shortDescription, description, experience are all required.');
    }

    const baseSlug = rawSlug ? generateSlug(rawSlug) : generateSlug(title);
    const finalSlug = await ensureUniqueSlug(baseSlug);

    const initialStatus: CareerStatus = status || 'DRAFT';
    const isPublishedStatus = initialStatus === 'PUBLISHED' || initialStatus === 'ACTIVE';

    const userName = req.user?.name || req.user?.email || 'Admin User';

    const career = await CareerModel.create({
      title,
      slug: finalSlug,
      department,
      location,
      employmentType,
      description,
      shortDescription,
      responsibilities: responsibilities || [],
      requirements: requirements || [],
      niceToHave: niceToHave || [],
      qualifications: qualifications || [],
      skills: skills || [],
      experience,
      salaryRange,
      applicationUrl,
      applicationEmail,
      status: initialStatus,
      isFeatured: !!isFeatured,
      sortOrder: sortOrder || 0,
      publishedAt: isPublishedStatus ? new Date() : undefined,
      createdBy: userName,
      updatedBy: userName,
    });

    res.status(201).json({ success: true, data: career });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/careers/:id
export const updateCareer = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      title,
      slug: rawSlug,
      department,
      location,
      employmentType,
      description,
      shortDescription,
      responsibilities,
      requirements,
      niceToHave,
      qualifications,
      skills,
      experience,
      salaryRange,
      applicationUrl,
      applicationEmail,
      status,
      isFeatured,
      sortOrder,
    } = req.body;

    const career = await CareerModel.findOne({ _id: id, deletedAt: null });
    if (!career) {
      throw new ApiError(404, 'Career opening not found');
    }

    if (title) career.title = title;
    if (department) career.department = department;
    if (location) career.location = location;
    if (employmentType) career.employmentType = employmentType;
    if (description) career.description = description;
    if (shortDescription) career.shortDescription = shortDescription;
    if (responsibilities) career.responsibilities = responsibilities;
    if (requirements) career.requirements = requirements;
    if (niceToHave) career.niceToHave = niceToHave;
    if (qualifications) career.qualifications = qualifications;
    if (skills) career.skills = skills;
    if (experience) career.experience = experience;
    if (salaryRange !== undefined) career.salaryRange = salaryRange;
    career.applicationUrl = applicationUrl;
    career.applicationEmail = applicationEmail;
    if (isFeatured !== undefined) career.isFeatured = !!isFeatured;
    if (sortOrder !== undefined) career.sortOrder = sortOrder;

    // Handle slug change
    if (rawSlug && typeof rawSlug === 'string') {
      const baseSlug = generateSlug(rawSlug);
      if (baseSlug !== career.slug) {
        career.slug = await ensureUniqueSlug(baseSlug, String(id));
      }
    }

    // Handle status change
    if (status && status !== career.status) {
      const isNewPublished = status === 'PUBLISHED' || status === 'ACTIVE';
      if (isNewPublished && !career.publishedAt) {
        career.publishedAt = new Date();
      }
      career.status = status as CareerStatus;
    }

    career.updatedBy = req.user?.name || req.user?.email || 'Admin User';
    await career.save();

    res.status(200).json({ success: true, data: career });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/careers/:id/status
export const updateCareerStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['DRAFT', 'PUBLISHED', 'ACTIVE', 'ARCHIVED', 'CLOSED'].includes(status)) {
      throw new ApiError(400, 'Invalid status parameter');
    }

    const career = await CareerModel.findOne({ _id: id, deletedAt: null });
    if (!career) {
      throw new ApiError(404, 'Career opening not found');
    }

    const isNewPublished = status === 'PUBLISHED' || status === 'ACTIVE';
    if (isNewPublished && !career.publishedAt) {
      career.publishedAt = new Date();
    }

    career.status = status as CareerStatus;
    career.updatedBy = req.user?.name || req.user?.email || 'Admin User';

    await career.save();
    res.status(200).json({ success: true, data: career });
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/careers/:id/duplicate
export const duplicateCareer = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const original = await CareerModel.findOne({ _id: id, deletedAt: null });
    if (!original) {
      throw new ApiError(404, 'Career opening not found');
    }

    const baseSlug = `${original.slug}-copy`;
    const newSlug = await ensureUniqueSlug(baseSlug);
    const userName = req.user?.name || req.user?.email || 'Admin User';

    const duplicate = await CareerModel.create({
      title: `${original.title} (Copy)`,
      slug: newSlug,
      department: original.department,
      location: original.location,
      employmentType: original.employmentType,
      description: original.description,
      shortDescription: original.shortDescription,
      responsibilities: original.responsibilities,
      requirements: original.requirements,
      niceToHave: original.niceToHave,
      qualifications: original.qualifications,
      skills: original.skills,
      experience: original.experience,
      salaryRange: original.salaryRange,
      applicationUrl: original.applicationUrl,
      applicationEmail: original.applicationEmail,
      status: 'DRAFT',
      isFeatured: false,
      sortOrder: original.sortOrder + 1,
      createdBy: userName,
      updatedBy: userName,
    });

    res.status(201).json({ success: true, data: duplicate });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/careers/:id (Soft Delete)
export const softDeleteCareer = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const career = await CareerModel.findOne({ _id: id, deletedAt: null });
    if (!career) {
      throw new ApiError(404, 'Career opening not found or already deleted');
    }

    const userName = req.user?.name || req.user?.email || 'Admin User';

    career.previousStatus = career.status === 'TRASHED' ? 'DRAFT' : career.status;
    career.status = 'TRASHED';
    career.deletedAt = new Date();
    career.deletedBy = userName;
    career.updatedBy = userName;

    await career.save();
    res.status(200).json({ success: true, message: 'Career moved to recycle bin successfully' });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/careers/:id/restore
export const restoreCareer = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const career = await CareerModel.findOne({
      _id: id,
      $or: [{ status: 'TRASHED' }, { deletedAt: { $ne: null } }],
    });

    if (!career) {
      throw new ApiError(404, 'Career not found in recycle bin');
    }

    // Check slug collision before restoring among active careers
    const existing = await CareerModel.findOne({ slug: career.slug, deletedAt: null });
    if (existing) {
      career.slug = await ensureUniqueSlug(career.slug);
    }

    const targetStatus = (career.previousStatus && career.previousStatus !== 'TRASHED') ? career.previousStatus : 'DRAFT';
    career.status = targetStatus;
    career.previousStatus = undefined;
    career.deletedAt = null;
    career.deletedBy = undefined;
    career.updatedBy = req.user?.name || req.user?.email || 'Admin User';

    await career.save();
    res.status(200).json({ success: true, data: career, message: 'Career restored successfully' });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/careers/:id/permanent
export const permanentlyDeleteCareer = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const role = req.user?.role;
    if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
      throw new ApiError(403, 'Requires ADMIN or SUPER_ADMIN role to permanently delete careers');
    }

    const career = await CareerModel.findOneAndDelete({
      _id: id,
      $or: [{ status: 'TRASHED' }, { deletedAt: { $ne: null } }],
    });

    if (!career) {
      throw new ApiError(404, 'Career opening not found in recycle bin');
    }

    res.status(200).json({ success: true, message: 'Career deleted permanently from MongoDB' });
  } catch (error) {
    next(error);
  }
};

// ─── Career Page Settings Controller Methods ─────────────────────────────────

import { CareerPageSettingsModel, ICareerPageSettings } from '../models/CareerPageSettings';

export async function getOrCreateCareerSettings(): Promise<ICareerPageSettings> {
  let doc = await CareerPageSettingsModel.findOne();
  if (!doc) {
    doc = await CareerPageSettingsModel.create({
      hiringProcess: {
        steps: [
          {
            num: "01",
            icon: "Search",
            title: "Explore",
            subtitle: "Find Your Fit",
            description: "Browse our open roles across engineering, hardware, data science, and operations. Find the position that matches your passion and expertise.",
          },
          {
            num: "02",
            icon: "FileText",
            title: "Apply",
            subtitle: "Share Your Story",
            description: "Submit your application with your resume and a note about what drives you. We read every application — no black boxes here.",
          },
          {
            num: "03",
            icon: "Users",
            title: "Interview",
            subtitle: "Meaningful Conversations",
            description: "We run focused, respectful interviews designed to understand your thinking, values, and technical depth. Typically two to three rounds.",
          },
          {
            num: "04",
            icon: "Rocket",
            title: "Join & Build",
            subtitle: "Welcome to Veenero",
            description: "Receive your offer, onboard with your team, and start building the water intelligence infrastructure that India needs.",
          },
        ],
      },
    });
  }
  return doc;
}

export const getPublicCareerSettings = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const settings = await getOrCreateCareerSettings();
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

export const getAdminCareerSettings = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const settings = await getOrCreateCareerSettings();
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

export const updateAdminCareerSettings = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const updateData = req.body;
    let doc = await getOrCreateCareerSettings();

    const allowed = ['hero', 'hiringProcess', 'cta', 'seo'];
    for (const key of allowed) {
      if (updateData[key] !== undefined) {
        (doc as any)[key] = updateData[key];
      }
    }

    doc.updatedBy = req.user?.email || 'admin';
    await doc.save();

    res.status(200).json({ success: true, data: doc, message: 'Career page settings saved successfully' });
  } catch (error) {
    next(error);
  }
};

