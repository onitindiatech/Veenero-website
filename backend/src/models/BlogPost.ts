import mongoose, { Document, Schema, Types } from 'mongoose';

// ─── Enums ────────────────────────────────────────────────────────────────────
export type BlogPostStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'TRASHED';

// ─── Interfaces ───────────────────────────────────────────────────────────────
export interface IBlogPostSeo {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  noIndex?: boolean;
}

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  featuredImageAlt?: string;
  author: string;
  readingTime?: string;
  status: BlogPostStatus;
  previousStatus?: BlogPostStatus;
  featured: boolean;
  sortOrder: number;
  publishedAt?: Date;
  seo: IBlogPostSeo;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  deletedBy?: Types.ObjectId;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Schema ───────────────────────────────────────────────────────────────────
const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      trim: true,
      lowercase: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    excerpt: {
      type: String,
      required: [true, 'Excerpt is required'],
      trim: true,
      maxlength: [400, 'Excerpt cannot exceed 400 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    featuredImage: {
      type: String,
      trim: true,
    },
    featuredImageAlt: {
      type: String,
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true,
    },
    readingTime: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED', 'TRASHED'],
      default: 'DRAFT',
    },
    previousStatus: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    publishedAt: {
      type: Date,
    },
    seo: {
      metaTitle: { type: String, trim: true },
      metaDescription: { type: String, trim: true },
      ogImage: { type: String, trim: true },
      noIndex: { type: Boolean, default: false },
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    deletedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
// Unique slug only among non-deleted posts
BlogPostSchema.index(
  { slug: 1 },
  { unique: true, partialFilterExpression: { deletedAt: null } }
);
BlogPostSchema.index({ status: 1 });
BlogPostSchema.index({ category: 1 });
BlogPostSchema.index({ featured: 1 });
BlogPostSchema.index({ deletedAt: 1 });
BlogPostSchema.index({ publishedAt: -1 });
BlogPostSchema.index({ sortOrder: 1 });

// ─── Model ────────────────────────────────────────────────────────────────────
export const BlogPostModel = mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);
