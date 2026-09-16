import mongoose, { Schema, Document } from 'mongoose';

export type SolutionStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'TRASHED';

export interface IHeroMetric {
  title: string;
  value: string;
  rawValue?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  subtext?: string;
  change?: string;
  isPositive?: boolean;
  type?: 'sparkline' | 'gauge' | 'counter' | 'status';
  sparklineData?: number[];
  gaugePercent?: number;
}

export interface IOverviewBlock {
  title: string;
  description: string;
  icon: string;
}

export interface ICapabilityItem {
  icon: string;
  title: string;
  description: string;
}

export interface IUseCaseItem {
  title: string;
  description: string;
  stats?: string;
  image?: string;
  mediaPublicId?: string;
}

export interface IHeroHighlight {
  icon: string;
  title: string;
  subtitle?: string;
}

export interface ISolutionDetail extends Document {
  title: string;
  slug: string;
  badge: string;
  categoryKey: string;
  tagline: {
    line1: string;
    line2: string;
    line3: string;
  };
  heroDescription: string;
  heroPills: string[];
  heroImage: string;
  heroImageAlt?: string;
  heroMediaPublicId?: string;
  contactEmail: string;
  primaryCtaText: string;
  primaryCtaLink?: string;
  secondaryCtaText: string;
  secondaryCtaLink?: string;
  heroHighlights: IHeroHighlight[];
  heroBadgeText?: {
    title: string;
    subtitle: string;
    watermarkText?: string;
  };
  heroMetrics: IHeroMetric[];

  overview: {
    eyebrow: string;
    title: string;
    highlightTitle?: string;
    description: string;
    blocks: IOverviewBlock[];
  };

  capabilities: {
    eyebrow: string;
    title: string;
    description: string;
    items: ICapabilityItem[];
  };

  useCases: {
    eyebrow: string;
    title: string;
    description: string;
    items: IUseCaseItem[];
  };

  finalCta: {
    eyebrow: string;
    title: string;
    highlightTitle?: string;
    description: string;
    primaryCtaText: string;
    primaryCtaLink?: string;
    secondaryCtaText: string;
    secondaryCtaLink?: string;
    contactEmail?: string;
  };

  seo: {
    metaTitle: string;
    metaDescription: string;
    metaKeywords?: string;
    ogImage?: string;
    ogImagePublicId?: string;
  };

  status: SolutionStatus;
  previousStatus?: SolutionStatus;
  isFeatured: boolean;
  sortOrder: number;
  publishedAt?: Date;

  createdBy: string;
  updatedBy: string;
  deletedBy?: string;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const SolutionDetailSchema = new Schema<ISolutionDetail>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true, trim: true },
    badge: { type: String, default: 'CORE CONSERVATION SOLUTION', trim: true },
    categoryKey: { type: String, default: 'General', trim: true },

    tagline: {
      line1: { type: String, default: '' },
      line2: { type: String, default: '' },
      line3: { type: String, default: '' },
    },
    heroDescription: { type: String, default: '' },
    heroPills: { type: [String], default: [] },
    heroImage: { type: String, default: '' },
    heroImageAlt: { type: String, default: '' },
    heroMediaPublicId: { type: String },
    contactEmail: { type: String, default: 'solutions@veenerosolutions.com', trim: true },
    primaryCtaText: { type: String, default: 'Request a Demo' },
    primaryCtaLink: { type: String, default: '#inquiry-section' },
    secondaryCtaText: { type: String, default: 'Talk to an Expert' },
    secondaryCtaLink: { type: String, default: '#inquiry-section' },

    heroHighlights: [
      {
        icon: { type: String, default: 'ShieldCheck' },
        title: { type: String, default: '' },
        subtitle: { type: String, default: '' },
      },
    ],

    heroBadgeText: {
      title: { type: String, default: 'From Data to Decisions' },
      subtitle: { type: String, default: 'Reliable. Transparent. Impactful.' },
      watermarkText: { type: String, default: 'Smarter\nWater Systems\nFor A More\nSustainable\nTomorrow' },
    },

    heroMetrics: [
      {
        title: { type: String, default: '' },
        value: { type: String, default: '' },
        rawValue: { type: Number },
        suffix: { type: String },
        prefix: { type: String },
        decimals: { type: Number },
        subtext: { type: String },
        change: { type: String },
        isPositive: { type: Boolean },
        type: { type: String, default: 'counter' },
        sparklineData: { type: [Number], default: [] },
        gaugePercent: { type: Number },
      },
    ],

    overview: {
      eyebrow: { type: String, default: 'OVERVIEW' },
      title: { type: String, default: '' },
      highlightTitle: { type: String, default: '' },
      description: { type: String, default: '' },
      blocks: [
        {
          title: { type: String, default: '' },
          description: { type: String, default: '' },
          icon: { type: String, default: 'Activity' },
        },
      ],
    },

    capabilities: {
      eyebrow: { type: String, default: 'KEY CAPABILITIES' },
      title: { type: String, default: '' },
      description: { type: String, default: '' },
      items: [
        {
          icon: { type: String, default: 'Cpu' },
          title: { type: String, default: '' },
          description: { type: String, default: '' },
        },
      ],
    },

    useCases: {
      eyebrow: { type: String, default: 'DEPLOYMENT SCENARIOS' },
      title: { type: String, default: '' },
      description: { type: String, default: '' },
      items: [
        {
          title: { type: String, default: '' },
          description: { type: String, default: '' },
          stats: { type: String, default: '' },
          image: { type: String, default: '' },
          mediaPublicId: { type: String },
        },
      ],
    },

    finalCta: {
      eyebrow: { type: String, default: 'NEXT STEPS' },
      title: { type: String, default: '' },
      highlightTitle: { type: String, default: '' },
      description: { type: String, default: '' },
      primaryCtaText: { type: String, default: 'Request a Demo' },
      primaryCtaLink: { type: String, default: '#inquiry-section' },
      secondaryCtaText: { type: String, default: 'Talk to an Expert' },
      secondaryCtaLink: { type: String, default: '#inquiry-section' },
      contactEmail: { type: String, default: 'solutions@veenerosolutions.com' },
    },

    seo: {
      metaTitle: { type: String, default: '' },
      metaDescription: { type: String, default: '' },
      metaKeywords: { type: String, default: '' },
      ogImage: { type: String, default: '' },
      ogImagePublicId: { type: String },
    },

    status: {
      type: String,
      required: true,
      enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED', 'TRASHED'],
      default: 'PUBLISHED',
      index: true,
    },
    previousStatus: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
    },
    isFeatured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    publishedAt: { type: Date, default: Date.now },

    createdBy: { type: String, default: 'Admin' },
    updatedBy: { type: String, default: 'Admin' },
    deletedBy: { type: String },
    deletedAt: { type: Date, default: null, index: true },
  },
  {
    timestamps: true,
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
  }
);

// Slug unique constraint among non-deleted solutions
SolutionDetailSchema.index(
  { slug: 1 },
  { unique: true, partialFilterExpression: { deletedAt: null } }
);

export const SolutionDetailModel = mongoose.model<ISolutionDetail>(
  'SolutionDetail',
  SolutionDetailSchema
);

export default SolutionDetailModel;
