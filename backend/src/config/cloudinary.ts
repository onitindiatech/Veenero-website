import { v2 as cloudinary } from 'cloudinary';
import { logger } from '../utils/logger';
import { config } from './env';

// --- Cloudinary Configuration ---
// Initializes the Cloudinary Node.js SDK from backend env vars only.
// API secret NEVER reaches the frontend or API responses.
// All upload/delete operations must go through cloudinary.service.ts.

if (!config.cloudinaryCloudName || !config.cloudinaryApiKey || !config.cloudinaryApiSecret) {
  logger.warn('[Cloudinary] Missing configuration in .env. Image uploads will fail.');
} else {
  cloudinary.config({
    cloud_name: config.cloudinaryCloudName,
    api_key:    config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret,
    secure:     true, // Always deliver assets via https://
  });
  logger.success('[Cloudinary] SDK initialized successfully');
}

export { cloudinary };

// --- Folder Strategy ---
// Cloudinary auto-creates folders on first upload.
// Use these constants — never hardcode folder strings elsewhere.

export const CLOUDINARY_FOLDERS = {
  ROOT:      'veenero',
  ABOUT:     'veenero/about',
  HOME:      'veenero/home',
  SOLUTIONS: 'veenero/solutions',
  APPROACH:  'veenero/approach',
  IMPACT:    'veenero/impact',
  CAREERS:   'veenero/careers',
  BLOG:      'veenero/blog',
  CONTACT:   'veenero/contact',
  SHARED:    'veenero/shared',
} as const;

export type CloudinaryFolder = (typeof CLOUDINARY_FOLDERS)[keyof typeof CLOUDINARY_FOLDERS];
