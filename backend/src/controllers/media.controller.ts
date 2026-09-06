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
    const { folder, type, search, deleted } = req.query as Record<string, string>;

    const filter: Record<string, unknown> = {
      deletedAt: deleted === 'true' ? { $ne: null } : null,
    };

    if (folder && folder !== 'all') {
      const escapedFolder = folder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter['$or'] = [
        { folder: folder },
        { folder: `veenero/${folder}` },
        { folder: new RegExp(`(^|/)${escapedFolder}($|/)`, 'i') },
        { page: new RegExp(`^${escapedFolder}$`, 'i') },
      ];
    }
    if (type === 'image' || type === 'video') {
      filter['resourceType'] = type;
    }
    if (search && search.trim()) {
      const searchRegex = { $regex: search.trim(), $options: 'i' };
      const searchConditions = [
        { displayName: searchRegex },
        { originalFilename: searchRegex },
        { altText: searchRegex },
        { tags: searchRegex },
        { section: searchRegex },
        { slot: searchRegex },
        { page: searchRegex },
      ];

      if (filter['$or']) {
        filter['$and'] = [
          { $or: filter['$or'] },
          { $or: searchConditions },
        ];
        delete filter['$or'];
      } else {
        filter['$or'] = searchConditions;
      }
    }

    const docs = await MediaModel.find(filter).sort({ createdAt: -1 }).lean();

    // Stats (only over non-deleted)
    const all = await MediaModel.find({ deletedAt: null }).lean();
    const stats = {
      total:        all.length,
      images:       all.filter((d) => d.resourceType === 'image').length,
      videos:       all.filter((d) => d.resourceType === 'video').length,
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

