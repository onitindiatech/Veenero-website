import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';
import { MediaModel as Media } from '../models/Media';
import { config } from '../config/env';
import { logger } from '../utils/logger';

// Initialize Cloudinary
cloudinary.config({
  cloud_name: config.cloudinaryCloudName,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinaryApiSecret,
  secure: true,
});

const FRONTEND_ASSETS_DIR = path.join(__dirname, '../../../frontend/src/assets');

async function migrate() {
  await mongoose.connect(config.mongodbUri!);
  logger.info('Connected to MongoDB');

  const localMedia = await Media.find({ publicId: { $regex: '^local:' } });
  logger.info(`Found ${localMedia.length} local media assets to migrate`);

  for (const media of localMedia) {
    const filename = media.originalFilename;
    
    // We have to guess the subdirectory. Let's just search the images folder recursively.
    const findFile = (dir: string, name: string): string | null => {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
          const res = findFile(fullPath, name);
          if (res) return res;
        } else if (file === name) {
          return fullPath;
        }
      }
      return null;
    };

    const filePath = findFile(FRONTEND_ASSETS_DIR, filename);

    if (!filePath) {
      logger.warn(`File not found for ${filename}`);
      continue;
    }

    logger.info(`Uploading ${filename}...`);
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: `veenero/${media.page || 'general'}`,
        resource_type: 'auto',
      });

      // Update the document
      media.publicId = result.public_id;
      media.assetId = result.asset_id;
      media.secureUrl = result.secure_url;
      media.bytes = result.bytes;
      media.format = result.format;
      if (result.width) media.width = result.width;
      if (result.height) media.height = result.height;

      await media.save();
      logger.success(`Migrated ${filename} to Cloudinary`);
    } catch (err) {
      logger.error(`Failed to upload ${filename}: ${(err as Error).message}`);
    }
  }

  await mongoose.disconnect();
  logger.info('Done!');
}

migrate().catch(console.error);
