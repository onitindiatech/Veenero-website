import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import { ApiError } from './errorHandler';

// --- Supported MIME Types ---
const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/avif',
]);

const ALLOWED_VIDEO_TYPES = new Set([
  'video/mp4',
  'video/webm',
  'video/quicktime', // .mov
]);

export const ALLOWED_MIME_TYPES = new Set([
  ...ALLOWED_IMAGE_TYPES,
  ...ALLOWED_VIDEO_TYPES,
]);

// --- File Size Limits ---
// Multer enforces the overall max. Controllers further validate image vs video.
const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB absolute ceiling

// --- MIME Type Filter ---
const fileFilter = (
  _req:     Request,
  file:     Express.Multer.File,
  callback: FileFilterCallback
): void => {
  if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
    callback(null, true);
  } else {
    callback(
      new ApiError(
        415,
        'Unsupported file type: ' + file.mimetype + '. ' +
        'Allowed: jpeg, jpg, png, webp, avif, mp4, webm, mov.'
      )
    );
  }
};

// --- Multer Instance ---
// memoryStorage: files are held in Buffer — never written to disk.
// Cloudinary receives the Buffer directly via upload_stream.
export const uploadMiddleware = multer({
  storage:   multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
    files:    1, // Single file per request in this phase
  },
  fileFilter,
});

// --- Helper: is the uploaded file an image? ---
export function isImageMimeType(mimeType: string): boolean {
  return ALLOWED_IMAGE_TYPES.has(mimeType);
}

// --- Helper: is the uploaded file a video? ---
export function isVideoMimeType(mimeType: string): boolean {
  return ALLOWED_VIDEO_TYPES.has(mimeType);
}

// Image-specific size limit: 10 MB
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
// Video-specific size limit: 50 MB
export const MAX_VIDEO_BYTES = 50 * 1024 * 1024;
