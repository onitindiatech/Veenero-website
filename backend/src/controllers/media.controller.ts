import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { ApiError } from '../middleware/errorHandler';
import { uploadMedia, deleteMedia } from '../services/cloudinary.service';
import { MediaModel } from '../models/Media';
import { CLOUDINARY_FOLDERS, CloudinaryFolder } from '../config/cloudinary';
import {
  isImageMimeType,
  isVideoMimeType,
  MAX_IMAGE_BYTES,
  MAX_VIDEO_BYTES,
} from '../middleware/upload.middleware';
import { SolutionDetailModel } from '../models/SolutionDetail';
import { SolutionsPageSettings } from '../models/SolutionsPageSettings';
import { AboutPageSettingsModel } from '../models/AboutPageSettings';
import { ApproachPageSettingsModel } from '../models/ApproachPageSettings';
import { ImpactPageSettingsModel } from '../models/ImpactPageSettings';
import { ContactPageSettingsModel } from '../models/ContactPageSettings';
import { BlogPostModel } from '../models/BlogPost';

// =========================================================================
// POST /api/admin/media/upload
// =========================================================================
export const uploadMediaHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      throw new ApiError(400, 'No file provided. Attach a file as multipart/form-data field named file.');
    }
    const { mimetype, buffer, originalname, size } = req.file;

    if (isImageMimeType(mimetype) && size > MAX_IMAGE_BYTES) {
      throw new ApiError(413, 'Image exceeds the 10 MB size limit.');
    }
    if (isVideoMimeType(mimetype) && size > MAX_VIDEO_BYTES) {
      throw new ApiError(413, 'Video exceeds the 50 MB size limit.');
    }

    const rawFolder = typeof req.body.folder === 'string' ? (req.body.folder as string).trim() : '';
    let folder: CloudinaryFolder = CLOUDINARY_FOLDERS.SHARED;

    if (Object.values(CLOUDINARY_FOLDERS).includes(rawFolder as CloudinaryFolder)) {
      folder = rawFolder as CloudinaryFolder;
    } else if (rawFolder) {
      const normalizedKey = rawFolder.toLowerCase().replace(/^veenero\//i, '');
      const matchingFolder = Object.entries(CLOUDINARY_FOLDERS).find(
        ([key, val]) =>
          key.toLowerCase() === normalizedKey ||
          val.toLowerCase() === `veenero/${normalizedKey}` ||
          val.toLowerCase() === normalizedKey
      );
      if (matchingFolder) {
        folder = matchingFolder[1];
      } else {
        folder = `veenero/${normalizedKey}` as CloudinaryFolder;
      }
    }

    const displayName =
      typeof req.body.displayName === 'string' && req.body.displayName.trim()
        ? (req.body.displayName as string).trim()
        : originalname;

    const altText =
      typeof req.body.altText === 'string' ? (req.body.altText as string).trim() : '';

    const rawTags = typeof req.body.tags === 'string' ? (req.body.tags as string) : '';
    const tags: string[] = rawTags
      ? rawTags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    const cloudinaryResult = await uploadMedia(buffer, mimetype, { folder, displayName, tags });

    let page = typeof req.body.page === 'string' ? (req.body.page as string).trim() : '';
    if (!page && folder) {
      const extractedPage = folder.replace(/^veenero\//i, '');
      if (extractedPage !== 'shared' && extractedPage !== 'general') {
        page = extractedPage;
      }
    }

    const section     = typeof req.body.section     === 'string' ? (req.body.section     as string).trim() : '';
    const slot        = typeof req.body.slot        === 'string' ? (req.body.slot        as string).trim() : '';
    const description = typeof req.body.description === 'string' ? (req.body.description as string).trim() : '';

    const mediaDoc = await MediaModel.create({
      assetId:          cloudinaryResult.assetId,
      publicId:         cloudinaryResult.publicId,
      resourceType:     cloudinaryResult.resourceType,
      format:           cloudinaryResult.format,
      secureUrl:        cloudinaryResult.secureUrl,
      width:            cloudinaryResult.width,
      height:           cloudinaryResult.height,
      duration:         cloudinaryResult.duration,
      bytes:            cloudinaryResult.bytes,
      folder:           cloudinaryResult.folder || folder,
      originalFilename: cloudinaryResult.originalFilename || originalname,
      displayName,
      altText,
      tags,
      page,
      section,
      slot,
      description,
      createdBy: req.user?._id
        ? new Types.ObjectId(String(req.user._id))
        : undefined,
    });

    res.status(201).json({
      success: true,
      data: {
        id:               String(mediaDoc.id),
        assetId:          mediaDoc.assetId,
        publicId:         mediaDoc.publicId,
        resourceType:     mediaDoc.resourceType,
        format:           mediaDoc.format,
        secureUrl:        mediaDoc.secureUrl,
        width:            mediaDoc.width,
        height:           mediaDoc.height,
        duration:         mediaDoc.duration,
        bytes:            mediaDoc.bytes,
        folder:           mediaDoc.folder,
        displayName:      mediaDoc.displayName,
        altText:          mediaDoc.altText,
        tags:             mediaDoc.tags,
        page:             mediaDoc.page,
        section:          mediaDoc.section,
        slot:             mediaDoc.slot,
        description:      mediaDoc.description,
        originalFilename: mediaDoc.originalFilename,
        createdAt:        mediaDoc.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// =========================================================================
// GET /api/admin/media
// Query params: folder, type (image|video), search, deleted ("true" = recycle bin)
// =========================================================================
export const listMediaHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { folder, type, search, deleted, sort, usage } = req.query as Record<string, string>;

    const andConditions: Record<string, unknown>[] = [];
    andConditions.push({ deletedAt: deleted === 'true' ? { $ne: null } : null });

    if (folder && folder !== 'all') {
      const escapedFolder = folder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      andConditions.push({
        $or: [
          { folder: folder },
          { folder: `veenero/${folder}` },
          { folder: new RegExp(`(^|/)${escapedFolder}($|/)`, 'i') },
          { page: new RegExp(`^${escapedFolder}$`, 'i') },
        ],
      });
    }

    if (type === 'image' || type === 'video') {
      andConditions.push({ resourceType: type });
    }

    if (usage === 'used') {
      andConditions.push({ page: { $exists: true, $nin: ['', null] } });
    } else if (usage === 'unused') {
      andConditions.push({
        $or: [
          { page: { $exists: false } },
          { page: '' },
          { page: null },
        ],
      });
    }

    if (search && search.trim()) {
      const searchRegex = { $regex: search.trim(), $options: 'i' };
      andConditions.push({
        $or: [
          { displayName: searchRegex },
          { originalFilename: searchRegex },
          { altText: searchRegex },
          { tags: searchRegex },
          { section: searchRegex },
          { slot: searchRegex },
          { page: searchRegex },
        ],
      });
    }

    const filter: Record<string, unknown> =
      andConditions.length > 1 ? { $and: andConditions } : andConditions[0] || {};

    let sortOptions: Record<string, 1 | -1> = { createdAt: -1 };
    if (sort === 'oldest') {
      sortOptions = { createdAt: 1 };
    } else if (sort === 'name') {
      sortOptions = { displayName: 1 };
    }

    const docs = await MediaModel.find(filter).sort(sortOptions).lean();

    // Stats (only over non-deleted)
    const all = await MediaModel.find({ deletedAt: null }).lean();
    const usedCount = all.filter((d) => Boolean(d.page && d.page.trim())).length;
    const stats = {
      total:         all.length,
      images:        all.filter((d) => d.resourceType === 'image').length,
      videos:        all.filter((d) => d.resourceType === 'video').length,
      used:          usedCount,
      unused:        all.length - usedCount,
      recentlyAdded: all.filter((d) => {
        const ms = Date.now() - new Date(d.createdAt as Date).getTime();
        return ms < 7 * 24 * 60 * 60 * 1000; // last 7 days
      }).length,
    };

    res.status(200).json({
      success: true,
      data: docs.map((d) => ({
        id:               String(d._id),
        assetId:          d.assetId,
        publicId:         d.publicId,
        resourceType:     d.resourceType,
        format:           d.format,
        secureUrl:        d.secureUrl,
        width:            d.width,
        height:           d.height,
        duration:         d.duration,
        bytes:            d.bytes,
        folder:           d.folder,
        displayName:      d.displayName,
        altText:          d.altText,
        tags:             d.tags,
        page:             d.page,
        section:          d.section,
        slot:             d.slot,
        description:      d.description,
        seedKey:          d.seedKey,
        originalFilename: d.originalFilename,
        isUsed:           Boolean(d.page && d.page.trim()),
        deletedAt:        d.deletedAt,
        createdAt:        d.createdAt,
      })),
      stats,
    });
  } catch (error) {
    next(error);
  }
};

// =========================================================================
// POST /api/admin/media/:publicId/replace
// Replaces the Cloudinary file for an existing Media document IN PLACE.
// Preserves _id, page, section, slot, seedKey, createdBy, createdAt.
// Updates: assetId, publicId, secureUrl, format, width, height, bytes,
//          originalFilename, and optionally displayName/altText/tags.
// After DB update succeeds, the OLD Cloudinary asset is deleted.
// =========================================================================
export const replaceMediaHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      throw new ApiError(400, 'No file provided. Attach a file as multipart/form-data field named file.');
    }

    const rawPublicId = req.params.publicId;
    const oldPublicId = decodeURIComponent(
      Array.isArray(rawPublicId) ? rawPublicId[0] ?? '' : rawPublicId ?? ''
    ).trim();
    if (!oldPublicId) {
      throw new ApiError(400, 'publicId parameter is required.');
    }

    const mediaDoc = await MediaModel.findOne({ publicId: oldPublicId, deletedAt: null });
    if (!mediaDoc) {
      throw new ApiError(404, 'Media asset not found or has been deleted.');
    }

    const { mimetype, buffer, originalname, size } = req.file;

    if (isImageMimeType(mimetype) && size > MAX_IMAGE_BYTES) {
      throw new ApiError(413, 'Image exceeds the 10 MB size limit.');
    }
    if (isVideoMimeType(mimetype) && size > MAX_VIDEO_BYTES) {
      throw new ApiError(413, 'Video exceeds the 50 MB size limit.');
    }

    // Determine display name to use for the new Cloudinary asset
    const newDisplayName =
      typeof req.body.displayName === 'string' && req.body.displayName.trim()
        ? req.body.displayName.trim()
        : mediaDoc.displayName;

    // Upload new file to Cloudinary (preserve the same folder)
    const cloudinaryResult = await uploadMedia(buffer, mimetype, {
      folder: mediaDoc.folder as CloudinaryFolder,
      displayName: newDisplayName,
      tags: mediaDoc.tags,
    });

    // Remember old Cloudinary identifiers so we can clean up after DB update
    const previousPublicId     = mediaDoc.publicId;
    const previousResourceType = mediaDoc.resourceType;

    // --- Update the existing document in place ---
    // Slot identity fields preserved: page, section, slot, seedKey, createdBy, createdAt, _id
    mediaDoc.assetId          = cloudinaryResult.assetId;
    mediaDoc.publicId         = cloudinaryResult.publicId;
    mediaDoc.resourceType     = cloudinaryResult.resourceType;
    mediaDoc.format           = cloudinaryResult.format;
    mediaDoc.secureUrl        = cloudinaryResult.secureUrl;
    mediaDoc.width            = cloudinaryResult.width;
    mediaDoc.height           = cloudinaryResult.height;
    mediaDoc.duration         = cloudinaryResult.duration;
    mediaDoc.bytes            = cloudinaryResult.bytes;
    mediaDoc.originalFilename = cloudinaryResult.originalFilename || originalname;
    mediaDoc.displayName      = newDisplayName;

    if (typeof req.body.altText === 'string') {
      mediaDoc.altText = req.body.altText.trim();
    }
    if (req.body.tags) {
      const rawTags = typeof req.body.tags === 'string' ? req.body.tags : '';
      if (rawTags) {
        mediaDoc.tags = rawTags.split(',').map((t: string) => t.trim()).filter(Boolean);
      }
    }

    await mediaDoc.save();

    // Synchronize any CMS references that stored the old publicId to the new one
    if (previousPublicId && previousPublicId !== cloudinaryResult.publicId) {
      try {
        await Promise.all([
          SolutionDetailModel.updateMany(
            { 'useCases.items.mediaPublicId': previousPublicId },
            { $set: { 'useCases.items.$[elem].mediaPublicId': cloudinaryResult.publicId } },
            { arrayFilters: [{ 'elem.mediaPublicId': previousPublicId }] }
          ),
          SolutionDetailModel.updateMany(
            { 'industries.mediaPublicId': previousPublicId },
            { $set: { 'industries.$[elem].mediaPublicId': cloudinaryResult.publicId } },
            { arrayFilters: [{ 'elem.mediaPublicId': previousPublicId }] }
          ),
          SolutionsPageSettings.updateMany(
            { 'categories.mediaPublicId': previousPublicId },
            { $set: { 'categories.$[elem].mediaPublicId': cloudinaryResult.publicId } },
            { arrayFilters: [{ 'elem.mediaPublicId': previousPublicId }] }
          ),
          SolutionsPageSettings.updateMany(
            { 'solutions.mediaPublicId': previousPublicId },
            { $set: { 'solutions.$[elem].mediaPublicId': cloudinaryResult.publicId } },
            { arrayFilters: [{ 'elem.mediaPublicId': previousPublicId }] }
          ),
          SolutionsPageSettings.updateMany(
            { 'hero.mediaPublicId': previousPublicId },
            { $set: { 'hero.mediaPublicId': cloudinaryResult.publicId } }
          ),
          SolutionsPageSettings.updateMany(
            { 'intro.mediaPublicId': previousPublicId },
            { $set: { 'intro.mediaPublicId': cloudinaryResult.publicId } }
          ),
          SolutionsPageSettings.updateMany(
            { 'featuredSolution.mediaPublicId': previousPublicId },
            { $set: { 'featuredSolution.mediaPublicId': cloudinaryResult.publicId } }
          ),
          SolutionsPageSettings.updateMany(
            { 'gridHeader.calloutCard.mediaPublicId': previousPublicId },
            { $set: { 'gridHeader.calloutCard.mediaPublicId': cloudinaryResult.publicId } }
          ),
          AboutPageSettingsModel.updateMany(
            { 'hero.mediaPublicId': previousPublicId },
            { $set: { 'hero.mediaPublicId': cloudinaryResult.publicId } }
          ),
          AboutPageSettingsModel.updateMany(
            { 'story.mediaPublicId': previousPublicId },
            { $set: { 'story.mediaPublicId': cloudinaryResult.publicId } }
          ),
        ]);
      } catch (syncErr) {
        console.warn('[ReplaceSync] Warning syncing CMS references to new publicId:', syncErr);
      }
    }

    // Delete the OLD Cloudinary asset (best-effort — log but don't fail the request)
    if (previousPublicId && !previousPublicId.startsWith('local:')) {
      try {
        await deleteMedia(previousPublicId, previousResourceType);
      } catch (cloudErr) {
        console.warn(
          `[Cloudinary] Could not delete replaced asset ${previousPublicId}:`,
          (cloudErr as Error).message
        );
      }
    }

    res.status(200).json({
      success: true,
      data: {
        id:               String(mediaDoc.id),
        assetId:          mediaDoc.assetId,
        publicId:         mediaDoc.publicId,
        resourceType:     mediaDoc.resourceType,
        format:           mediaDoc.format,
        secureUrl:        mediaDoc.secureUrl,
        width:            mediaDoc.width,
        height:           mediaDoc.height,
        duration:         mediaDoc.duration,
        bytes:            mediaDoc.bytes,
        folder:           mediaDoc.folder,
        displayName:      mediaDoc.displayName,
        altText:          mediaDoc.altText,
        tags:             mediaDoc.tags,
        page:             mediaDoc.page,
        section:          mediaDoc.section,
        slot:             mediaDoc.slot,
        description:      mediaDoc.description,
        seedKey:          mediaDoc.seedKey,
        originalFilename: mediaDoc.originalFilename,
        createdAt:        mediaDoc.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// =========================================================================
// GET /api/media/asset?page=about&section=Hero+Section&slot=Hero+Visual
// PUBLIC (no auth) — returns the active asset for a given page/section/slot.
// Used by the public website to resolve current Media Library URLs.
// =========================================================================
export const getPublicAssetBySlot = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page    = typeof req.query.page    === 'string' ? req.query.page.trim()    : '';
    const section = typeof req.query.section === 'string' ? req.query.section.trim() : '';
    const slot    = typeof req.query.slot    === 'string' ? req.query.slot.trim()    : '';

    if (!page || !section || !slot) {
      throw new ApiError(400, 'Query params page, section, and slot are all required.');
    }

    const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    let asset = await MediaModel.findOne({
      page:      new RegExp(`^${escapeRegex(page)}$`,    'i'),
      section:   new RegExp(`^${escapeRegex(section)}$`, 'i'),
      slot:      new RegExp(`^${escapeRegex(slot)}$`,    'i'),
      deletedAt: null,
    }).lean();

    // Relaxed section fallback (e.g. 'Our Story' matching 'Our Story & Origin')
    if (!asset) {
      asset = await MediaModel.findOne({
        page:      new RegExp(`^${escapeRegex(page)}$`,  'i'),
        section:   new RegExp(escapeRegex(section),      'i'),
        slot:      new RegExp(`^${escapeRegex(slot)}$`,  'i'),
        deletedAt: null,
      }).lean();
    }

    if (!asset) {
      res.status(404).json({ success: false, data: null });
      return;
    }


    res.status(200).json({
      success: true,
      data: {
        id:           String(asset._id),
        publicId:     asset.publicId,
        secureUrl:    asset.secureUrl,
        altText:      asset.altText,
        width:        asset.width,
        height:       asset.height,
        resourceType: asset.resourceType,
        format:       asset.format,
        page:         asset.page,
        section:      asset.section,
        slot:         asset.slot,
      },
    });
  } catch (error) {
    next(error);
  }
};

// =========================================================================
// PATCH /api/admin/media/:publicId
// Updates displayName, altText, tags (non-Cloudinary metadata only)
// =========================================================================

export const updateMediaHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const rawPublicId = req.params.publicId;
    const publicId = decodeURIComponent(Array.isArray(rawPublicId) ? rawPublicId[0] ?? '' : rawPublicId ?? '').trim();
    if (!publicId) {
      throw new ApiError(400, 'publicId parameter is required.');
    }

    const mediaDoc = await MediaModel.findOne({ publicId, deletedAt: null });
    if (!mediaDoc) {
      throw new ApiError(404, 'Media asset not found.');
    }

    const { displayName, altText, tags, page, section, slot, description } = req.body;
    if (typeof displayName === 'string') mediaDoc.displayName = displayName.trim();
    if (typeof altText     === 'string') mediaDoc.altText     = altText.trim();
    if (typeof page        === 'string') mediaDoc.page        = page.trim();
    if (typeof section     === 'string') mediaDoc.section     = section.trim();
    if (typeof slot        === 'string') mediaDoc.slot        = slot.trim();
    if (typeof description === 'string') mediaDoc.description = description.trim();
    if (Array.isArray(tags))             mediaDoc.tags        = tags.map(String).map((t) => t.trim()).filter(Boolean);
    else if (typeof tags === 'string')   mediaDoc.tags        = tags.split(',').map((t) => t.trim()).filter(Boolean);

    await mediaDoc.save();

    res.status(200).json({
      success: true,
      data: {
        id:          String(mediaDoc.id),
        publicId:    mediaDoc.publicId,
        displayName: mediaDoc.displayName,
        altText:     mediaDoc.altText,
        tags:        mediaDoc.tags,
        page:        mediaDoc.page,
        section:     mediaDoc.section,
        slot:        mediaDoc.slot,
        description: mediaDoc.description,
      },
    });
  } catch (error) {
    next(error);
  }
};

// =========================================================================
// PATCH /api/admin/media/:publicId/restore
// Restores a soft-deleted asset (clears deletedAt)
// =========================================================================
export const restoreMediaHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const rawPublicId = req.params.publicId;
    const publicId = decodeURIComponent(Array.isArray(rawPublicId) ? rawPublicId[0] ?? '' : rawPublicId ?? '').trim();
    if (!publicId) {
      throw new ApiError(400, 'publicId parameter is required.');
    }

    const mediaDoc = await MediaModel.findOne({ publicId, deletedAt: { $ne: null } });
    if (!mediaDoc) {
      throw new ApiError(404, 'Deleted media asset not found.');
    }

    mediaDoc.deletedAt = null;
    await mediaDoc.save();

    res.status(200).json({
      success: true,
      data: { message: 'Media asset restored successfully.', publicId: mediaDoc.publicId },
    });
  } catch (error) {
    next(error);
  }
};

// =========================================================================
// DELETE /api/admin/media/:publicId  (Soft delete — moves to recycle bin)
// =========================================================================
export const deleteMediaHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const rawPublicId = req.params.publicId;
    const publicId = decodeURIComponent(Array.isArray(rawPublicId) ? rawPublicId[0] ?? '' : rawPublicId ?? '').trim();
    if (!publicId) {
      throw new ApiError(400, 'publicId parameter is required.');
    }

    const mediaDoc = await MediaModel.findOne({ publicId, deletedAt: null });
    if (!mediaDoc) {
      throw new ApiError(404, 'Media asset not found.');
    }

    // Soft delete only: preserve on Cloudinary so it can be restored from Recycle Bin
    mediaDoc.deletedAt = new Date();
    await mediaDoc.save();

    res.status(200).json({
      success: true,
      data: {
        message:  'Media asset moved to recycle bin successfully.',
        publicId: mediaDoc.publicId,
      },
    });
  } catch (error) {
    next(error);
  }
};

// =========================================================================
// DELETE /api/admin/media/:publicId/permanent  (Hard delete from Cloudinary & DB)
// =========================================================================
export const hardDeleteMediaHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const rawPublicId = req.params.publicId;
    const publicId = decodeURIComponent(Array.isArray(rawPublicId) ? rawPublicId[0] ?? '' : rawPublicId ?? '').trim();
    if (!publicId) {
      throw new ApiError(400, 'publicId parameter is required.');
    }

    const mediaDoc = await MediaModel.findOne({ publicId });
    if (!mediaDoc) {
      throw new ApiError(404, 'Media asset not found.');
    }

    // Delete from Cloudinary if not local placeholder
    if (!publicId.startsWith('local:')) {
      try {
        await deleteMedia(mediaDoc.publicId, mediaDoc.resourceType);
      } catch (cloudErr) {
        console.warn(`[Cloudinary] Delete warning for ${publicId}:`, (cloudErr as Error).message);
      }
    }

    await MediaModel.deleteOne({ _id: mediaDoc._id });

    res.status(200).json({
      success: true,
      data: {
        message:  'Media asset permanently deleted.',
        publicId: mediaDoc.publicId,
      },
    });
  } catch (error) {
    next(error);
  }
};

// =========================================================================
// GET /api/admin/media/:publicId/usage
// Scans CMS models to locate where an asset is referenced by publicId.
// =========================================================================
export const getMediaUsageHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const rawPublicId = req.params.publicId;
    const publicId = decodeURIComponent(
      Array.isArray(rawPublicId) ? rawPublicId[0] ?? '' : rawPublicId ?? ''
    ).trim();

    if (!publicId) {
      throw new ApiError(400, 'publicId parameter is required.');
    }

    const mediaDoc = await MediaModel.findOne({ publicId }).lean();
    if (!mediaDoc) {
      throw new ApiError(404, 'Media asset not found.');
    }

    const usages: Array<{
      page: string;
      entity: string;
      section: string;
      field: string;
      cmsId?: string;
      route?: string;
    }> = [];

    const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // 1. Scan SolutionDetailModel
    try {
      const solutionDetails = await SolutionDetailModel.find({
        $or: [
          { 'useCases.items.mediaPublicId': publicId },
          { 'industries.mediaPublicId': publicId },
        ],
      }).lean();

      for (const sd of solutionDetails) {
        sd.useCases?.items?.forEach((item: any, idx: number) => {
          if (item.mediaPublicId === publicId) {
            usages.push({
              page: 'solutions',
              entity: `Solution: ${sd.title || sd.slug || 'Detail Page'}`,
              section: sd.useCases?.eyebrow || 'Deployment Scenarios / Use Cases',
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
              entity: `Solution: ${sd.title || sd.slug || 'Detail Page'}`,
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

    // 2. Scan SolutionsPageSettings
    try {
      const solutionsSettings = await SolutionsPageSettings.find({}).lean();
      for (const s of solutionsSettings) {
        if (s.hero?.mediaPublicId === publicId) {
          usages.push({ page: 'solutions', entity: 'Solutions Landing Page', section: 'Hero Section', field: 'hero.mediaPublicId', route: '/admin/solutions' });
        }
        if (s.intro?.mediaPublicId === publicId) {
          usages.push({ page: 'solutions', entity: 'Solutions Landing Page', section: 'Intro Section', field: 'intro.mediaPublicId', route: '/admin/solutions' });
        }
        if (s.featuredSolution?.mediaPublicId === publicId) {
          usages.push({ page: 'solutions', entity: 'Solutions Landing Page', section: 'Featured Solution', field: 'featuredSolution.mediaPublicId', route: '/admin/solutions' });
        }
        if (s.gridHeader?.calloutCard?.mediaPublicId === publicId) {
          usages.push({ page: 'solutions', entity: 'Solutions Landing Page', section: 'Grid Callout Card', field: 'gridHeader.calloutCard.mediaPublicId', route: '/admin/solutions' });
        }
        s.categories?.forEach((cat: any, idx: number) => {
          if (cat.mediaPublicId === publicId) {
            usages.push({ page: 'solutions', entity: 'Solutions Landing Page', section: 'Solution Categories', field: `category[${idx}]: ${cat.displayLabel || cat.key || 'Category'}`, route: '/admin/solutions' });
          }
        });
        s.solutions?.forEach((sol: any, idx: number) => {
          if (sol.mediaPublicId === publicId) {
            usages.push({ page: 'solutions', entity: 'Solutions Landing Page', section: 'Solution Cards', field: `solution[${idx}]: ${sol.title || 'Card'}`, route: '/admin/solutions' });
          }
        });
      }
    } catch (e) {
      console.error('[UsageScan] Error scanning SolutionsPageSettings:', e);
    }

    // 3. Scan AboutPageSettingsModel
    try {
      const aboutSettings = await AboutPageSettingsModel.find({}).lean();
      for (const a of aboutSettings) {
        if ((a as any).hero?.mediaPublicId === publicId) {
          usages.push({ page: 'about', entity: 'About Page', section: 'Hero Section', field: 'hero.mediaPublicId', route: '/admin/about' });
        }
        if ((a as any).story?.mediaPublicId === publicId) {
          usages.push({ page: 'about', entity: 'About Page', section: 'Our Story & Origin', field: 'story.mediaPublicId', route: '/admin/about' });
        }
        if ((a as any).visionMission?.mediaPublicId === publicId) {
          usages.push({ page: 'about', entity: 'About Page', section: 'Vision & Mission', field: 'visionMission.mediaPublicId', route: '/admin/about' });
        }
        if ((a as any).foundersNote?.mediaPublicId === publicId) {
          usages.push({ page: 'about', entity: 'About Page', section: "Founder's Note", field: 'foundersNote.mediaPublicId', route: '/admin/about' });
        }
        (a as any).leadership?.members?.forEach((m: any, idx: number) => {
          if (m.mediaPublicId === publicId) {
            usages.push({ page: 'about', entity: 'About Page', section: 'Leadership', field: `member[${idx}]: ${m.name || 'Member'}`, route: '/admin/about' });
          }
        });
        (a as any).timeline?.milestones?.forEach((m: any, idx: number) => {
          if (m.mediaPublicId === publicId) {
            usages.push({ page: 'about', entity: 'About Page', section: 'Timeline', field: `milestone[${idx}]: ${m.year || 'Milestone'}`, route: '/admin/about' });
          }
        });
      }
    } catch (e) {
      console.error('[UsageScan] Error scanning AboutPageSettings:', e);
    }

    // 4. Scan ApproachPageSettingsModel
    try {
      const approachSettings = await ApproachPageSettingsModel.find({}).lean();
      for (const ap of approachSettings) {
        if ((ap as any).hero?.mediaPublicId === publicId) {
          usages.push({ page: 'approach', entity: 'Approach Page', section: 'Hero Section', field: 'hero.mediaPublicId', route: '/admin/approach' });
        }
        if ((ap as any).methodology?.mediaPublicId === publicId) {
          usages.push({ page: 'approach', entity: 'Approach Page', section: 'Methodology', field: 'methodology.mediaPublicId', route: '/admin/approach' });
        }
        if ((ap as any).technology?.mediaPublicId === publicId) {
          usages.push({ page: 'approach', entity: 'Approach Page', section: 'Technology', field: 'technology.mediaPublicId', route: '/admin/approach' });
        }
        (ap as any).pillars?.forEach((p: any, idx: number) => {
          if (p.mediaPublicId === publicId) {
            usages.push({ page: 'approach', entity: 'Approach Page', section: 'Core Pillars', field: `pillar[${idx}]: ${p.title || 'Pillar'}`, route: '/admin/approach' });
          }
        });
        if ((ap as any).stats?.mediaPublicId === publicId) {
          usages.push({ page: 'approach', entity: 'Approach Page', section: 'Impact Stats', field: 'stats.mediaPublicId', route: '/admin/approach' });
        }
      }
    } catch (e) {
      console.error('[UsageScan] Error scanning ApproachPageSettings:', e);
    }

    // 5. Scan ImpactPageSettingsModel
    try {
      const impactSettings = await ImpactPageSettingsModel.find({}).lean();
      for (const imp of impactSettings) {
        if ((imp as any).hero?.mediaPublicId === publicId) {
          usages.push({ page: 'impact', entity: 'Impact Page', section: 'Hero Section', field: 'hero.mediaPublicId', route: '/admin/impact' });
        }
        if ((imp as any).esgFramework?.mediaPublicId === publicId) {
          usages.push({ page: 'impact', entity: 'Impact Page', section: 'ESG Framework', field: 'esgFramework.mediaPublicId', route: '/admin/impact' });
        }
      }
    } catch (e) {
      console.error('[UsageScan] Error scanning ImpactPageSettings:', e);
    }

    // 6. Scan ContactPageSettingsModel
    try {
      const contactSettings = await ContactPageSettingsModel.find({}).lean();
      for (const c of contactSettings) {
        if ((c as any).hero?.mediaPublicId === publicId) {
          usages.push({ page: 'contact', entity: 'Contact Page', section: 'Hero Section', field: 'hero.mediaPublicId', route: '/admin/contact' });
        }
      }
    } catch (e) {
      console.error('[UsageScan] Error scanning ContactPageSettings:', e);
    }

    // 7. Scan BlogPostModel
    try {
      const blogPosts = await BlogPostModel.find({
        $or: [
          { featuredImage: publicId },
          { featuredImage: mediaDoc.secureUrl },
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

    // 8. Registered Slot Placement
    const slotPlacement = mediaDoc.page ? {
      page: mediaDoc.page,
      section: mediaDoc.section || '',
      slot: mediaDoc.slot || '',
      description: mediaDoc.description || '',
    } : undefined;

    // If registered on a page, ensure that slot assignment is acknowledged in usages
    if (mediaDoc.page) {
      const alreadyIn = usages.some(
        (u) =>
          u.page.toLowerCase() === mediaDoc.page?.toLowerCase() &&
          u.section.toLowerCase() === (mediaDoc.section || '').toLowerCase()
      );
      if (!alreadyIn) {
        usages.unshift({
          page: mediaDoc.page,
          entity: `${mediaDoc.page.charAt(0).toUpperCase() + mediaDoc.page.slice(1)} Page (Slot Assignment)`,
          section: mediaDoc.section || 'General Section',
          field: mediaDoc.slot || 'Primary Visual',
          route: `/admin/${mediaDoc.page}`,
        });
      }
    }

    res.status(200).json({
      success: true,
      data: {
        asset: {
          id:               String(mediaDoc._id),
          assetId:          mediaDoc.assetId,
          publicId:         mediaDoc.publicId,
          resourceType:     mediaDoc.resourceType,
          format:           mediaDoc.format,
          secureUrl:        mediaDoc.secureUrl,
          width:            mediaDoc.width,
          height:           mediaDoc.height,
          duration:         mediaDoc.duration,
          bytes:            mediaDoc.bytes,
          folder:           mediaDoc.folder,
          displayName:      mediaDoc.displayName,
          altText:          mediaDoc.altText,
          tags:             mediaDoc.tags,
          page:             mediaDoc.page,
          section:          mediaDoc.section,
          slot:             mediaDoc.slot,
          description:      mediaDoc.description,
          seedKey:          mediaDoc.seedKey,
          originalFilename: mediaDoc.originalFilename,
          deletedAt:        mediaDoc.deletedAt,
          createdAt:        mediaDoc.createdAt,
        },
        usageCount: usages.length,
        usages,
        slotPlacement,
      },
    });
  } catch (error) {
    next(error);
  }
};


