import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { BlogPostModel, BlogPostStatus } from '../models/BlogPost';
import { BlogLandingSettingsModel } from '../models/BlogLandingSettings';
import { ApiError } from '../middleware/errorHandler';

// ─── Helper: generate slug from title ─────────────────────────────────────────
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// ─── Helper: ensure slug uniqueness ───────────────────────────────────────────
async function ensureUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;
  const query = excludeId
    ? { slug, deletedAt: null, _id: { $ne: excludeId } }
    : { slug, deletedAt: null };

  while (await BlogPostModel.findOne(query)) {
    slug = `${baseSlug}-${counter++}`;
    query.slug = slug;
  }
  return slug;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLIC ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════════

/** GET /api/blog — published posts with category, search, and featured support */
export const getPublicPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, search, featured } = req.query;

    const query: Record<string, unknown> = {
      status: 'PUBLISHED',
      deletedAt: null,
    };

    if (category && typeof category === 'string' && category !== 'All') {
      query.category = category;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (search && typeof search === 'string' && search.trim()) {
      const q = search.trim();
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { excerpt: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
      ];
    }

    const posts = await BlogPostModel.find(query)
      .sort({ sortOrder: 1, publishedAt: -1 })
      .select('-createdBy -updatedBy -deletedBy -deletedAt -previousStatus -seo.noIndex')
      .lean();

    res.json({ success: true, data: posts });
  } catch (err) {
    next(err);
  }
};

/** GET /api/blog/:slug — single published post */
export const getPublicPostBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await BlogPostModel.findOne({
      slug: req.params.slug,
      status: 'PUBLISHED',
      deletedAt: null,
    }).lean();

    if (!post) throw new ApiError(404, 'Blog post not found');

    // Fetch related posts (same category, up to 3)
    const related = await BlogPostModel.find({
      category: post.category,
      status: 'PUBLISHED',
      deletedAt: null,
      _id: { $ne: post._id },
    })
      .sort({ publishedAt: -1 })
      .limit(3)
      .select('title slug category excerpt featuredImage featuredImageAlt author readingTime publishedAt')
      .lean();

    res.json({ success: true, data: { post, related } });
  } catch (err) {
    next(err);
  }
};

/** GET /api/blog/settings — public landing settings */
export const getPublicSettings = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    let settings = await BlogLandingSettingsModel.findOne({}).lean();
    if (!settings) {
      // Return sensible defaults if no settings document exists yet
      settings = null;
    }
    res.json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN ENDPOINTS — POSTS
// ═══════════════════════════════════════════════════════════════════════════════

/** GET /api/admin/blog — all non-trashed posts */
export const getAdminPosts = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = await BlogPostModel.find({ deletedAt: null, status: { $ne: 'TRASHED' } })
      .sort({ updatedAt: -1 })
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .lean();

    // Stats summary
    const total = posts.length;
    const published = posts.filter((p) => p.status === 'PUBLISHED').length;
    const drafts = posts.filter((p) => p.status === 'DRAFT').length;
    const archived = posts.filter((p) => p.status === 'ARCHIVED').length;
    const featured = posts.filter((p) => p.featured).length;

    res.json({ success: true, data: posts, stats: { total, published, drafts, archived, featured } });
  } catch (err) {
    next(err);
  }
};

/** GET /api/admin/blog/:id */
export const getAdminPostById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await BlogPostModel.findOne({ _id: req.params.id, deletedAt: null });
    if (!post) throw new ApiError(404, 'Blog post not found');
    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

/** POST /api/admin/blog */
export const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    const { title, slug: rawSlug, status, ...rest } = req.body;

    if (!title) throw new ApiError(400, 'Title is required');

    const baseSlug = rawSlug ? generateSlug(rawSlug) : generateSlug(title);
    const slug = await ensureUniqueSlug(baseSlug);

    const newStatus: BlogPostStatus = status || 'DRAFT';
    const publishedAt = newStatus === 'PUBLISHED' ? new Date() : undefined;

    const post = await BlogPostModel.create({
      title,
      slug,
      status: newStatus,
      publishedAt,
      ...rest,
      createdBy: userId,
      updatedBy: userId,
    });

    res.status(201).json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

/** PUT /api/admin/blog/:id */
export const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    const { slug: rawSlug, status, ...rest } = req.body;

    const post = await BlogPostModel.findOne({ _id: req.params.id, deletedAt: null });
    if (!post) throw new ApiError(404, 'Blog post not found');

    // Handle slug change
    if (rawSlug) {
      const baseSlug = generateSlug(rawSlug);
      if (baseSlug !== post.slug) {
        post.slug = await ensureUniqueSlug(baseSlug, post._id.toString());
      }
    }

    // Handle status transition
    if (status && status !== post.status) {
      post.status = status as BlogPostStatus;
      if (status === 'PUBLISHED' && !post.publishedAt) {
        post.publishedAt = new Date();
      }
    }

    // Apply all other fields
    Object.assign(post, rest, { updatedBy: userId });
    await post.save();

    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

/** PATCH /api/admin/blog/:id/status */
export const updatePostStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    const { status } = req.body;

    if (!['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(status)) {
      throw new ApiError(400, 'Invalid status value');
    }

    const post = await BlogPostModel.findOne({ _id: req.params.id, deletedAt: null });
    if (!post) throw new ApiError(404, 'Blog post not found');

    post.status = status as BlogPostStatus;
    if (status === 'PUBLISHED' && !post.publishedAt) {
      post.publishedAt = new Date();
    }
    post.updatedBy = userId as unknown as Types.ObjectId;
    await post.save();

    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

/** PATCH /api/admin/blog/:id/featured */
export const toggleFeatured = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    const { featured } = req.body;

    const post = await BlogPostModel.findOne({ _id: req.params.id, deletedAt: null });
    if (!post) throw new ApiError(404, 'Blog post not found');

    post.featured = Boolean(featured);
    post.updatedBy = userId as unknown as Types.ObjectId;
    await post.save();

    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

/** POST /api/admin/blog/:id/duplicate */
export const duplicatePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    const original = await BlogPostModel.findOne({ _id: req.params.id, deletedAt: null });
    if (!original) throw new ApiError(404, 'Blog post not found');

    const baseSlug = `${original.slug}-copy`;
    const slug = await ensureUniqueSlug(baseSlug);

    const duplicate = await BlogPostModel.create({
      title: `${original.title} (Copy)`,
      slug,
      category: original.category,
      excerpt: original.excerpt,
      content: original.content,
      featuredImage: original.featuredImage,
      featuredImageAlt: original.featuredImageAlt,
      author: original.author,
      readingTime: original.readingTime,
      status: 'DRAFT',
      featured: false,
      sortOrder: original.sortOrder,
      seo: original.seo,
      createdBy: userId,
      updatedBy: userId,
    });

    res.status(201).json({ success: true, data: duplicate });
  } catch (err) {
    next(err);
  }
};

/** DELETE /api/admin/blog/:id — soft delete (Move to Recycle Bin) */
export const softDeletePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await BlogPostModel.findOne({ _id: req.params.id, deletedAt: null });
    if (!post) throw new ApiError(404, 'Blog post not found');

    const userId = req.user?._id as unknown as Types.ObjectId;

    post.previousStatus = post.status === 'TRASHED' ? 'DRAFT' : post.status;
    post.status = 'TRASHED';
    post.deletedAt = new Date();
    post.deletedBy = userId;
    post.updatedBy = userId;
    await post.save();

    res.json({ success: true, message: 'Post moved to Recycle Bin' });
  } catch (err) {
    next(err);
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN ENDPOINTS — RECYCLE BIN
// ═══════════════════════════════════════════════════════════════════════════════

/** GET /api/admin/blog/recycle-bin */
export const getRecycleBin = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = await BlogPostModel.find({
      $or: [{ status: 'TRASHED' }, { deletedAt: { $ne: null } }],
    })
      .sort({ deletedAt: -1 })
      .populate('updatedBy', 'name email')
      .populate('deletedBy', 'name email')
      .lean();

    res.json({ success: true, data: posts });
  } catch (err) {
    next(err);
  }
};

/** PATCH /api/admin/blog/:id/restore */
export const restorePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await BlogPostModel.findOne({
      _id: req.params.id,
      $or: [{ status: 'TRASHED' }, { deletedAt: { $ne: null } }],
    });
    if (!post) throw new ApiError(404, 'Post not found in Recycle Bin');

    // Ensure slug is still unique after restore among active posts
    const existing = await BlogPostModel.findOne({ slug: post.slug, deletedAt: null });
    if (existing) {
      post.slug = await ensureUniqueSlug(post.slug);
    }

    // Restore to previous valid status or DRAFT
    const targetStatus = (post.previousStatus && post.previousStatus !== 'TRASHED') ? post.previousStatus : 'DRAFT';
    post.status = targetStatus;
    post.previousStatus = undefined;
    post.deletedAt = null;
    post.deletedBy = undefined;
    post.updatedBy = req.user?._id as unknown as Types.ObjectId;
    await post.save();

    res.json({ success: true, data: post, message: 'Post restored successfully' });
  } catch (err) {
    next(err);
  }
};

/** DELETE /api/admin/blog/:id/permanent — ADMIN or SUPER_ADMIN */
export const permanentlyDeletePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const role = req.user?.role;
    if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
      throw new ApiError(403, 'Requires ADMIN or SUPER_ADMIN role to permanently delete posts');
    }

    const post = await BlogPostModel.findOneAndDelete({
      _id: req.params.id,
      $or: [{ status: 'TRASHED' }, { deletedAt: { $ne: null } }],
    });

    if (!post) throw new ApiError(404, 'Post not found in Recycle Bin');

    res.json({ success: true, message: 'Post permanently deleted' });
  } catch (err) {
    next(err);
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN ENDPOINTS — LANDING SETTINGS
// ═══════════════════════════════════════════════════════════════════════════════

/** GET /api/admin/blog/settings */
export const getAdminSettings = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = await BlogLandingSettingsModel.findOne({});
    res.json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
};

/** PUT /api/admin/blog/settings */
export const updateAdminSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    const settings = await BlogLandingSettingsModel.findOneAndUpdate(
      {},
      { ...req.body, updatedBy: userId },
      { upsert: true, new: true, runValidators: true }
    );

    res.json({ success: true, data: settings, message: 'Blog landing settings updated' });
  } catch (err) {
    next(err);
  }
};
