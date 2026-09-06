import mongoose, { Schema, Types } from 'mongoose';

// --- Media Resource Types ---
export type MediaResourceType = 'image' | 'video';

// --- Media Document Interface ---
export interface IMedia {
  _id?: Types.ObjectId;
  // Cloudinary identifiers
  assetId:          string;       // Cloudinary asset_id (stable identifier)
  publicId:         string;       // Cloudinary public_id (used for delivery + deletion)
  resourceType:     MediaResourceType;
  format:           string;       // e.g. 'webp', 'jpg', 'mp4'
  secureUrl:        string;       // https:// delivery URL — only safe URL stored

  // Dimensions (populated for images; optional for video)
  width?:           number;
  height?:          number;

  // Video-specific
  duration?:        number;       // Seconds

  // File info
  bytes:            number;
  folder:           string;       // e.g. 'veenero/about'
  originalFilename: string;       // Client-side filename at upload time

  // CMS display fields
  displayName:      string;       // Human-readable name for the media manager
  altText:          string;       // Accessibility alt text

  // Page / section organisation — used by the Media Library admin UI
  page?:            string;       // e.g. 'about', 'home', 'solutions'
  section?:         string;       // e.g. 'Hero Section', 'Our Story & Origin'
  slot?:            string;       // e.g. 'Hero Visual', 'Story Overview Video'
  description?:     string;       // Brief human description for the admin

  // Stable seed key — used for idempotent seeding (page|section|slot)
  // Example: 'ABOUT|HERO|HERO_VISUAL'
  seedKey?:         string;

  // Organisation
  tags:             string[];

  // Audit
  createdBy?:       Types.ObjectId;  // ref: User

  // Soft-delete (future-proofing)
  deletedAt?:       Date | null;

  createdAt?: Date;
  updatedAt?: Date;
}

// --- Mongoose Schema ---
const MediaSchema = new Schema<IMedia>(
  {
    assetId: {
      type:     String,
      required: true,
      unique:   true,
      trim:     true,
      index:    true,
    },
    publicId: {
      type:     String,
      required: true,
      unique:   true,
      trim:     true,
      index:    true,
    },
    resourceType: {
      type:     String,
      required: true,
      enum:     ['image', 'video'],
      index:    true,
    },
    format: {
      type:     String,
      required: true,
      trim:     true,
      lowercase: true,
    },
    secureUrl: {
      type:     String,
      required: true,
      trim:     true,
    },
    width:    { type: Number },
    height:   { type: Number },
    duration: { type: Number }, // seconds — populated for video
    bytes: {
      type:     Number,
      required: true,
    },
    folder: {
      type:     String,
      required: true,
      trim:     true,
      index:    true,
    },
    originalFilename: {
      type:    String,
      trim:    true,
      default: '',
    },
    displayName: {
      type:    String,
      trim:    true,
      default: '',
    },
    altText: {
      type:    String,
      trim:    true,
      default: '',
    },
    // Page / section organisation
    page:        { type: String, trim: true, default: '', index: true },
    section:     { type: String, trim: true, default: '' },
    slot:        { type: String, trim: true, default: '' },
    description: { type: String, trim: true, default: '' },
    // Stable seed key for idempotent seeding
    seedKey: {
      type:   String,
      trim:   true,
      sparse: true,   // null values are excluded from index
      index:  true,
    },
    tags: {
      type:    [String],
      default: [],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref:  'User',
    },
    deletedAt: {
      type:    Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, unknown>) => {
        ret['id'] = ret['_id'];
        delete ret['_id'];
        delete ret['__v'];
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (_doc, ret: Record<string, unknown>) => {
        ret['id'] = ret['_id'];
        delete ret['_id'];
        delete ret['__v'];
        return ret;
      },
    },
  }
);

// Compound index: folder + resourceType for efficient media-manager queries
MediaSchema.index({ folder: 1, resourceType: 1, deletedAt: 1 });

export const MediaModel = mongoose.model<IMedia>('Media', MediaSchema);
