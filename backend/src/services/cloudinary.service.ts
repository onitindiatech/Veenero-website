import { UploadApiResponse } from 'cloudinary';
import { cloudinary, CloudinaryFolder } from '../config/cloudinary';
import { MediaResourceType } from '../models/Media';

// --- Safe Media Result ---
// Only safe, non-sensitive Cloudinary data is returned from this service.
// API secret, signature, and internal credentials are NEVER included.
export interface MediaResult {
  assetId:          string;
  publicId:         string;
  resourceType:     MediaResourceType;
  format:           string;
  secureUrl:        string;
  width?:           number;
  height?:          number;
  duration?:        number;
  bytes:            number;
  folder:           string;
  originalFilename: string;
  createdAt:        string;
}

// --- Upload Options ---
export interface UploadOptions {
  folder:           CloudinaryFolder;
  publicId?:        string;   // Optional — Cloudinary auto-generates if omitted
  displayName?:     string;
  tags?:            string[];
  overwrite?:       boolean;
}

// --- Upload Service ---
export async function uploadMedia(
  fileBuffer: Buffer,
  mimeType:   string,
  options:    UploadOptions
): Promise<MediaResult> {
  // Determine resource_type from MIME type
  const resourceType: 'image' | 'video' = mimeType.startsWith('video/') ? 'video' : 'image';

  const uploadOptions: Record<string, unknown> = {
    folder:        options.folder,
    resource_type: resourceType,
    overwrite:     options.overwrite ?? false,
    use_filename:  false,
    unique_filename: true,
  };

  if (options.publicId) {
    uploadOptions['public_id'] = options.publicId;
  }

  if (options.tags && options.tags.length > 0) {
    uploadOptions['tags'] = options.tags;
  }

  if (options.displayName) {
    uploadOptions['context'] = { alt: options.displayName };
  }

  // Upload via buffer using upload_stream wrapped in a Promise
  const result = await new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error('Cloudinary upload failed with no result'));
        } else {
          resolve(result);
        }
      }
    );
    stream.end(fileBuffer);
  });

  console.log('[Cloudinary] Upload success:', result.public_id, '(' + result.resource_type + ')');

  return mapToMediaResult(result);
}

// --- Delete Service ---
export async function deleteMedia(
  publicId:     string,
  resourceType: MediaResourceType
): Promise<void> {
  const result = await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
    invalidate:    true,  // Purge from CDN cache
  });

  if (result.result !== 'ok' && result.result !== 'not found') {
    throw new Error('Cloudinary deletion failed: ' + result.result);
  }

  console.log('[Cloudinary] Delete success:', publicId, '(' + resourceType + ')');
}

// --- Signature Service (for future signed-upload admin UI) ---
export interface UploadSignatureParams {
  folder:    string;
  timestamp: number;
}

export interface UploadSignatureResult {
  signature:   string;
  timestamp:   number;
  cloudName:   string;
  apiKey:      string;
  folder:      string;
}

export function generateUploadSignature(folder: string): UploadSignatureResult {
  const timestamp = Math.round(Date.now() / 1000);
  const params: UploadSignatureParams = { folder, timestamp };

  // The API secret is used server-side to compute the signature.
  // Only the resulting signature (not the secret) is sent to the client.
  const signature = cloudinary.utils.api_sign_request(
    params as unknown as Record<string, string>,
    process.env['CLOUDINARY_API_SECRET'] as string
  );

  return {
    signature,
    timestamp,
    cloudName: cloudinary.config().cloud_name as string,
    apiKey:    cloudinary.config().api_key as string,
    folder,
    // NOTE: api_secret is intentionally NOT included
  };
}

// --- Internal: map Cloudinary response to safe MediaResult ---
function mapToMediaResult(result: UploadApiResponse): MediaResult {
  return {
    assetId:          result.asset_id,
    publicId:         result.public_id,
    resourceType:     result.resource_type as MediaResourceType,
    format:           result.format,
    secureUrl:        result.secure_url,
    width:            result.width,
    height:           result.height,
    duration:         (result as UploadApiResponse & { duration?: number }).duration,
    bytes:            result.bytes,
    folder:           result.folder ?? '',
    originalFilename: result.original_filename ?? '',
    createdAt:        result.created_at,
  };
}
