import mongoose, { Document, Schema, Types } from 'mongoose';

// ─── Interfaces ───────────────────────────────────────────────────────────────
export interface IInsightStat {
  value: string;
  label: string;
  description?: string;
}

export interface IBlogLandingSettings extends Document {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    image: string;
    imageAlt: string;
  };
  featuredSection: {
    eyebrow: string;
    title: string;
    description: string;
  };
  insightStats: IInsightStat[];
  editorialQuote: {
    eyebrow: string;
    title: string;
    description: string;
  };
  cta: {
    eyebrow: string;
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
  };
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
    noIndex?: boolean;
  };
  isPublished: boolean;
  updatedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Schema ───────────────────────────────────────────────────────────────────
const BlogLandingSettingsSchema = new Schema<IBlogLandingSettings>(
  {
    hero: {
      eyebrow: { type: String, default: 'VEENERO INSIGHTS' },
      title: { type: String, default: 'Water Intelligence & Innovation' },
      description: { type: String, default: 'Insights, research and perspectives on smart water management, sustainability and real-time telemetry.' },
      image: { type: String, default: '' },
      imageAlt: { type: String, default: 'Water intelligence editorial' },
    },
    featuredSection: {
      eyebrow: { type: String, default: 'COVER STORY' },
      title: { type: String, default: 'Featured Insight' },
      description: { type: String, default: '' },
    },
    insightStats: [
      {
        value: { type: String, required: true },
        label: { type: String, required: true },
        description: { type: String },
      },
    ],
    editorialQuote: {
      eyebrow: { type: String, default: 'OUR MISSION' },
      title: { type: String, default: 'Every drop of water deserves to be measured, verified and understood.' },
      description: { type: String, default: 'At Veenero, we believe that data transparency is the foundation of sustainable water stewardship.' },
    },
    cta: {
      eyebrow: { type: String, default: 'CONTRIBUTE' },
      title: { type: String, default: 'Have an idea worth sharing?' },
      description: { type: String, default: 'We are always looking for perspectives on sustainability, measurement, and water infrastructure.' },
      buttonText: { type: String, default: 'Explore Veenero' },
      buttonLink: { type: String, default: '/#contact' },
    },
    seo: {
      metaTitle: { type: String, trim: true },
      metaDescription: { type: String, trim: true },
      ogImage: { type: String, trim: true },
      noIndex: { type: Boolean, default: false },
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// ─── Model ────────────────────────────────────────────────────────────────────
export const BlogLandingSettingsModel = mongoose.model<IBlogLandingSettings>(
  'BlogLandingSettings',
  BlogLandingSettingsSchema
);
