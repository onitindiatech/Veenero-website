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
  icon?: string;
  title: string;
  description: string;
  stats?: string;
  image?: string;
  mediaPublicId?: string;
  order?: number;
  isActive?: boolean;
}

export interface IHeroHighlight {
  icon: string;
  title: string;
  subtitle?: string;
}

export interface IHowItWorksStep {
  step: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  order?: number;
  isActive?: boolean;
}

export interface ITechDiagramStep {
  label: string;
  desc: string;
  icon: string;
  statusText?: string;
  order?: number;
  isActive?: boolean;
}

export interface IFeatureItem {
  icon: string;
  title: string;
  description: string;
  tag?: string;
  order?: number;
  isActive?: boolean;
}

export interface IBenefitMetric {
  target: number;
  decimals?: number;
  prefix?: string;
  suffix: string;
  displayRange: string;
  label: string;
  description: string;
  isVerifiedOutcome?: boolean;
  order?: number;
  isActive?: boolean;
}

export interface IAnalyticsStat {
  label: string;
  value: string;
  numericValue: number;
  suffix?: string;
  change?: string;
  order?: number;
  isActive?: boolean;
}

export interface ISolutionFaq {
  question: string;
  answer: string;
  order?: number;
  isActive?: boolean;
}

export interface IIndustryItem {
  name: string;
  description: string;
  icon?: string;
  image?: string;
  mediaPublicId?: string;
  stats?: string;
  order?: number;
  isActive?: boolean;
}

export interface IProblemItem {
  icon: string;
  title: string;
  description: string;
  severity: string;
  impact: string;
  order?: number;
  isActive?: boolean;
}

export interface IDualEngineCard {
  tag: string;
  title: string;
  description: string;
  features: string[];
}

export interface ISolutionDetail extends Document {
  title: string;
  shortTitle?: string;
  shortDescription?: string;
  icon?: string;
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

  problemSection?: {
    eyebrow?: string;
    title?: string;
    highlightTitle?: string;
    description?: string;
    impactSummary?: string;
    items: IProblemItem[];
  };

  overview: {
    eyebrow: string;
    title: string;
    highlightTitle?: string;
    description: string;
    blocks: IOverviewBlock[];
    dualEngine?: {
      hardware: IDualEngineCard;
      software: IDualEngineCard;
    };
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

  howItWorks: {
    eyebrow: string;
    title: string;
    description: string;
    steps: IHowItWorksStep[];
  };

  techSection: {
    eyebrow: string;
    title: string;
    subtitle: string;
    description: string;
    diagramSteps: ITechDiagramStep[];
  };

  features: {
    eyebrow: string;
    title: string;
    description: string;
    items: IFeatureItem[];
  };

  benefits: {
    eyebrow: string;
    title: string;
    description: string;
    metrics: IBenefitMetric[];
  };

  analyticsVisual: {
    eyebrow: string;
    title: string;
    description: string;
    stats: IAnalyticsStat[];
  };

  faqs: ISolutionFaq[];
  industries: IIndustryItem[];

  inquiryForm: {
    eyebrow?: string;
    title?: string;
    description?: string;
    responseTime?: string;
    confidentiality?: string;
    pocText?: string;
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

  sections: Array<{
    id: string;
    title: string;
    content: string;
    isActive?: boolean;
  }>;

  seo: {
    metaTitle: string;
    metaDescription: string;
    metaKeywords?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    ogImagePublicId?: string;
    canonicalUrl?: string;
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
    shortTitle: { type: String, default: '', trim: true },
    shortDescription: { type: String, default: '', trim: true },
    icon: { type: String, default: 'Cpu', trim: true },
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

    problemSection: {
      eyebrow: { type: String, default: 'THE PROBLEM WE SOLVE' },
      title: { type: String, default: 'The Silent Cost of' },
      highlightTitle: { type: String, default: 'Unmonitored Water Infrastructure' },
      description: { type: String, default: '' },
      impactSummary: { type: String, default: '' },
      items: [
        {
          icon: { type: String, default: 'AlertTriangle' },
          title: { type: String, default: '' },
          description: { type: String, default: '' },
          severity: { type: String, default: 'Critical' },
          impact: { type: String, default: '' },
          order: { type: Number, default: 0 },
          isActive: { type: Boolean, default: true },
        },
      ],
    },

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
      dualEngine: {
        hardware: {
          tag: { type: String, default: 'FIELD HARDWARE' },
          title: { type: String, default: '' },
          description: { type: String, default: '' },
          features: { type: [String], default: [] },
        },
        software: {
          tag: { type: String, default: 'CLOUD & EDGE PLATFORM' },
          title: { type: String, default: '' },
          description: { type: String, default: '' },
          features: { type: [String], default: [] },
        },
      },
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
          icon: { type: String, default: 'Building2' },
          title: { type: String, default: '' },
          description: { type: String, default: '' },
          stats: { type: String, default: '' },
          image: { type: String, default: '' },
          mediaPublicId: { type: String },
          order: { type: Number, default: 0 },
          isActive: { type: Boolean, default: true },
        },
      ],
    },

    howItWorks: {
      eyebrow: { type: String, default: 'HOW IT WORKS' },
      title: { type: String, default: 'Simple. Connected. Intelligent.' },
      description: { type: String, default: '' },
      steps: [
        {
          step: { type: String, default: '01' },
          title: { type: String, default: '' },
          subtitle: { type: String, default: '' },
          description: { type: String, default: '' },
          icon: { type: String, default: 'Radio' },
          order: { type: Number, default: 0 },
          isActive: { type: Boolean, default: true },
        },
      ],
    },

    techSection: {
      eyebrow: { type: String, default: 'TECHNICAL ARCHITECTURE' },
      title: { type: String, default: 'Engineered for High-Frequency Telemetry' },
      subtitle: { type: String, default: '' },
      description: { type: String, default: '' },
      diagramSteps: [
        {
          label: { type: String, default: '' },
          desc: { type: String, default: '' },
          icon: { type: String, default: 'Radio' },
          statusText: { type: String, default: 'Stream Active' },
          order: { type: Number, default: 0 },
          isActive: { type: Boolean, default: true },
        },
      ],
    },

    features: {
      eyebrow: { type: String, default: 'FEATURES & FUNCTIONALITY' },
      title: { type: String, default: 'Engineered for Precision & Operational Scale' },
      description: { type: String, default: '' },
      items: [
        {
          icon: { type: String, default: 'Activity' },
          title: { type: String, default: '' },
          description: { type: String, default: '' },
          tag: { type: String, default: '' },
          order: { type: Number, default: 0 },
          isActive: { type: Boolean, default: true },
        },
      ],
    },

    benefits: {
      eyebrow: { type: String, default: 'BENEFITS & IMPACT' },
      title: { type: String, default: 'Quantifiable Impact From Day One' },
      description: { type: String, default: '' },
      metrics: [
        {
          target: { type: Number, default: 0 },
          decimals: { type: Number, default: 0 },
          prefix: { type: String, default: '' },
          suffix: { type: String, default: '%' },
          displayRange: { type: String, default: '' },
          label: { type: String, default: '' },
          description: { type: String, default: '' },
          isVerifiedOutcome: { type: Boolean, default: true },
          order: { type: Number, default: 0 },
          isActive: { type: Boolean, default: true },
        },
      ],
    },

    analyticsVisual: {
      eyebrow: { type: String, default: 'REAL-TIME TELEMETRY STREAM' },
      title: { type: String, default: 'Live Water Telemetry Dashboard' },
      description: { type: String, default: '' },
      stats: [
        {
          label: { type: String, default: '' },
          value: { type: String, default: '' },
          numericValue: { type: Number, default: 0 },
          suffix: { type: String, default: '' },
          change: { type: String, default: '' },
          order: { type: Number, default: 0 },
          isActive: { type: Boolean, default: true },
        },
      ],
    },

    faqs: [
      {
        question: { type: String, default: '' },
        answer: { type: String, default: '' },
        order: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true },
      },
    ],

    industries: [
      {
        name: { type: String, default: '' },
        description: { type: String, default: '' },
        icon: { type: String, default: 'Building2' },
        image: { type: String, default: '' },
        mediaPublicId: { type: String },
        stats: { type: String, default: '' },
        order: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true },
      },
    ],

    inquiryForm: {
      eyebrow: { type: String, default: 'DIRECT INQUIRY' },
      title: { type: String, default: "Have Questions? Let's Talk." },
      description: { type: String, default: '' },
      responseTime: { type: String, default: 'Direct callback from a senior water systems specialist within 24 hours.' },
      confidentiality: { type: String, default: 'Full NDA protection for your infrastructure layouts and volumetric data.' },
      pocText: { type: String, default: 'Live pilot telemetry setups available for industrial and utility networks.' },
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

    sections: [
      {
        id: { type: String, default: '' },
        title: { type: String, default: '' },
        content: { type: String, default: '' },
        isActive: { type: Boolean, default: true },
      },
    ],

    seo: {
      metaTitle: { type: String, default: '' },
      metaDescription: { type: String, default: '' },
      metaKeywords: { type: String, default: '' },
      ogTitle: { type: String, default: '' },
      ogDescription: { type: String, default: '' },
      ogImage: { type: String, default: '' },
      ogImagePublicId: { type: String },
      canonicalUrl: { type: String, default: '' },
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
