import mongoose, { Schema } from 'mongoose';

export interface ICmsPageSection {
  id: string;
  name: string;
  type: 'hero' | 'content' | 'gallery' | 'testimonials' | 'cta' | 'custom';
  visible: boolean;
}

export interface ICmsPage {
  _id?: string;
  name: string;
  slug: string;
  status: 'published' | 'draft';
  featuredImage: string | null;
  seoMetaTitle: string;
  seoMetaDescription: string;
  seoStatus: 'good' | 'needs-work' | 'poor';
  lastUpdated: string;
  updatedBy: string;
  sections: ICmsPageSection[];
  isCoreSystemPage: boolean;
}

const CmsPageSectionSchema = new Schema<ICmsPageSection>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: ['hero', 'content', 'gallery', 'testimonials', 'cta', 'custom'],
  },
  visible: { type: Boolean, required: true, default: true },
}, { _id: false });

const CmsPageSchema = new Schema<ICmsPage>({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  status: {
    type: String,
    required: true,
    enum: ['published', 'draft'],
    default: 'draft',
  },
  featuredImage: { type: String, default: null },
  seoMetaTitle: { type: String, required: true },
  seoMetaDescription: { type: String, default: '' },
  seoStatus: {
    type: String,
    required: true,
    enum: ['good', 'needs-work', 'poor'],
    default: 'poor',
  },
  lastUpdated: {
    type: String,
    required: true,
    default: () => new Date().toISOString(),
  },
  updatedBy: { type: String, required: true, default: 'Aditya Choubey' },
  sections: { type: [CmsPageSectionSchema], default: [] },
  isCoreSystemPage: { type: Boolean, required: true, default: false },
}, {
  timestamps: false,
  toJSON: {
    transform: (_, ret: any) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
  toObject: {
    transform: (_, ret: any) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
});

export const CmsPageModel = mongoose.model<ICmsPage>('CmsPage', CmsPageSchema);
