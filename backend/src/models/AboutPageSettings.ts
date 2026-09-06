import mongoose, { Schema, Document } from 'mongoose';

// ─── Sub-interfaces for About Page Sections ───────────────────────────────────

export interface IAboutHeroBadge {
  icon: string;
  label1: string;
  label2: string;
}

export interface IAboutHeroStatsWidgets {
  flowRate: {
    title: string;
    value: string;
    unit: string;
    trend: string;
  };
  systemHealth: {
    title: string;
    value: string;
    status: string;
  };
  activeAlerts: {
    title: string;
    count: string;
    ctaText: string;
    ctaLink: string;
  };
}

export interface IAboutHero {
  visible: boolean;
  eyebrow: string;
  title: string;
  highlightedText: string;
  description: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  image: string;
  imageAlt: string;
  mediaPublicId?: string;
  badges?: IAboutHeroBadge[];
  statsWidgets?: IAboutHeroStatsWidgets;
}

export interface IAboutCapabilityItem {
  icon: string;
  title: string;
  description: string;
}

export interface IAboutStory {
  visible: boolean;
  eyebrow: string;
  title: string;
  paragraphs: string[];
  badgePillars: string[];
  capabilities?: IAboutCapabilityItem[];
  video: string;
  videoPoster: string;
  mediaPublicId?: string;
}

export interface IAboutStatItem {
  _id?: string;
  value: string;
  label: string;
  sublabel: string;
  icon: string;
  order: number;
  isActive: boolean;
}

export interface IAboutImpactStats {
  visible: boolean;
  eyebrow?: string;
  title?: string;
  description?: string;
  list: IAboutStatItem[];
}

export interface IAboutJourneyMilestone {
  _id?: string;
  year: string;
  title: string;
  description: string;
  iconType: string;
  order: number;
  isActive: boolean;
}

export interface IAboutJourney {
  visible: boolean;
  eyebrow: string;
  title: string;
  description: string;
  journeyImage: string;
  journeyCaption: string;
  mediaPublicId?: string;
  milestones: IAboutJourneyMilestone[];
}

export interface IAboutVisionItem {
  badge: string;
  title: string;
  description: string;
  isActive: boolean;
}

export interface IAboutMissionItem {
  badge: string;
  title: string;
  description: string;
  isActive: boolean;
}

export interface IAboutPurposeDirection {
  visible: boolean;
  eyebrow: string;
  title: string;
  description: string;
  vision: IAboutVisionItem;
  mission: IAboutMissionItem;
}

export interface IAboutPillarItem {
  _id?: string;
  title: string;
  description: string;
  image: string;
  mediaPublicId?: string;
  order: number;
  isActive: boolean;
}

export interface IAboutPillars {
  visible: boolean;
  eyebrow: string;
  title: string;
  description: string;
  list: IAboutPillarItem[];
}

export interface IAboutWhyChooseItem {
  _id?: string;
  title: string;
  description: string;
  icon: string;
  image: string;
  mediaPublicId?: string;
  order: number;
  isActive: boolean;
}

export interface IAboutWhyChoose {
  visible: boolean;
  eyebrow: string;
  title: string;
  highlightedText: string;
  description: string;
  bottomTrustText: string;
  list: IAboutWhyChooseItem[];
}

export interface IAboutTeamMember {
  _id?: string;
  name: string;
  role: string;
  bio: string;
  icon: string;
  image: string;
  mediaPublicId?: string;
  order: number;
  isActive: boolean;
}

export interface IAboutLeadership {
  visible: boolean;
  eyebrow: string;
  title: string;
  description: string;
  team: IAboutTeamMember[];
}

export interface IAboutCTA {
  visible: boolean;
  eyebrow: string;
  title: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
}

export interface IAboutSEO {
  metaTitle: string;
  metaDescription: string;
}

export interface IAboutPageSettings extends Document {
  hero: IAboutHero;
  ourStory: IAboutStory;
  impactStats: IAboutImpactStats;
  ourJourney: IAboutJourney;
  purposeDirection: IAboutPurposeDirection;
  pillars: IAboutPillars;
  whyChoose: IAboutWhyChoose;
  leadership: IAboutLeadership;
  cta: IAboutCTA;
  seo: IAboutSEO;
  isPublished: boolean;
  lastUpdatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Sub-schemas ──────────────────────────────────────────────────────────────

const AboutHeroSchema = new Schema<IAboutHero>(
  {
    visible: { type: Boolean, default: true },
    eyebrow: { type: String, default: 'ABOUT VEENERO', trim: true },
    title: { type: String, default: "Building India's", trim: true },
    highlightedText: { type: String, default: 'Water Intelligence', trim: true },
    description: {
      type: String,
      default:
        'We are the digital infrastructure layer for water management—creating Water Visibility, Water Accountability, and Water Verification through real-time telemetry and advanced analytics.',
      trim: true,
    },
    primaryCtaText: { type: String, default: 'Our Story', trim: true },
    primaryCtaLink: { type: String, default: '#our-story', trim: true },
    secondaryCtaText: { type: String, default: 'Core Values', trim: true },
    secondaryCtaLink: { type: String, default: '#core-values', trim: true },
    image: { type: String, default: '', trim: true },
    imageAlt: {
      type: String,
      default: 'Veenero Water Intelligence Infrastructure, Telemetry Network, and Verification Platform',
      trim: true,
    },
    mediaPublicId: { type: String, default: '', trim: true },
    badges: {
      type: [
        {
          icon: { type: String, default: 'Radio', trim: true },
          label1: { type: String, default: 'Real-time', trim: true },
          label2: { type: String, default: 'Visibility', trim: true },
        },
      ],
      default: [
        { icon: 'Radio', label1: 'Real-time', label2: 'Visibility' },
        { icon: 'ShieldCheck', label1: '100%', label2: 'Data Integrity' },
        { icon: 'TrendingUp', label1: 'Actionable', label2: 'Intelligence' },
        { icon: 'Droplets', label1: 'Measurable', label2: 'Impact' },
      ],
    },
    statsWidgets: {
      type: new Schema(
        {
          flowRate: {
            title: { type: String, default: 'Live Flow Rate' },
            value: { type: String, default: '1,245' },
            unit: { type: String, default: 'm³/hr' },
            trend: { type: String, default: '↑ 12.5% vs yesterday' },
          },
          systemHealth: {
            title: { type: String, default: 'System Health' },
            value: { type: String, default: '98%' },
            status: { type: String, default: 'Healthy' },
          },
          activeAlerts: {
            title: { type: String, default: 'Active Alerts' },
            count: { type: String, default: '3' },
            ctaText: { type: String, default: 'View All Alerts' },
            ctaLink: { type: String, default: '#who-we-are' },
          },
        },
        { _id: false }
      ),
      default: () => ({
        flowRate: { title: 'Live Flow Rate', value: '1,245', unit: 'm³/hr', trend: '↑ 12.5% vs yesterday' },
        systemHealth: { title: 'System Health', value: '98%', status: 'Healthy' },
        activeAlerts: { title: 'Active Alerts', count: '3', ctaText: 'View All Alerts', ctaLink: '#who-we-are' },
      }),
    },
  },
  { _id: false }
);

const AboutStorySchema = new Schema<IAboutStory>(
  {
    visible: { type: Boolean, default: true },
    eyebrow: { type: String, default: 'WHO WE ARE', trim: true },
    title: { type: String, default: 'From Water Blindspots to Real-Time Intelligence', trim: true },
    paragraphs: {
      type: [String],
      default: [
        'Veenero was founded with a singular conviction: organizations cannot manage or preserve what they cannot measure. Across municipal systems, industrial plants, and commercial facilities, billions of litres of water move unmonitored every single day.',
        'Traditional approaches relied on static hardware or isolated leak detectors. Veenero is fundamentally different—we build the future digital infrastructure layer for water management.',
        'By unifying rugged edge sensors, cloud telemetry, and AI-driven anomaly signals into a shared water data platform, we empower enterprise leaders and utilities to make every litre visible, accountable, and verifiable.',
      ],
    },
    badgePillars: {
      type: [String],
      default: ['Water Visibility', 'Water Accountability', 'Water Verification'],
    },
    capabilities: {
      type: [
        {
          icon: { type: String, default: 'Users', trim: true },
          title: { type: String, default: '', trim: true },
          description: { type: String, default: '', trim: true },
        },
      ],
      default: [
        { icon: 'Users', title: 'Expert Team', description: 'Engineers, analysts, and water specialists.' },
        { icon: 'ShieldCheck', title: 'Evidence Driven', description: 'All insights are validated and audit-ready.' },
        { icon: 'TrendingUp', title: 'Scalable Solutions', description: 'Built for reliability. Designed for scale.' },
        { icon: 'Droplets', title: 'Sustainable Impact', description: 'Driving long-term value for people and planet.' },
      ],
    },
    video: { type: String, default: '', trim: true },
    videoPoster: { type: String, default: '', trim: true },
    mediaPublicId: { type: String, default: '', trim: true },
  },
  { _id: false }
);

const AboutStatItemSchema = new Schema<IAboutStatItem>(
  {
    value: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
    sublabel: { type: String, default: '', trim: true },
    icon: { type: String, default: 'Droplets', trim: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { _id: true, timestamps: true }
);

const AboutImpactStatsSchema = new Schema<IAboutImpactStats>(
  {
    visible: { type: Boolean, default: true },
    eyebrow: { type: String, default: 'MEASURABLE IMPACT', trim: true },
    title: { type: String, default: 'Impact Backed by Verified Data', trim: true },
    description: { type: String, default: 'Real-time telemetry, continuous validation, and tamper-resistant auditing at scale.', trim: true },
    list: { type: [AboutStatItemSchema], default: [] },
  },
  { _id: false }
);

const AboutJourneyMilestoneSchema = new Schema<IAboutJourneyMilestone>(
  {
    year: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    iconType: { type: String, default: 'idea', trim: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { _id: true, timestamps: true }
);

const AboutJourneySchema = new Schema<IAboutJourney>(
  {
    visible: { type: Boolean, default: true },
    eyebrow: { type: String, default: 'OUR JOURNEY', trim: true },
    title: { type: String, default: 'Milestones That Flow Forward', trim: true },
    description: {
      type: String,
      default: 'From our founding vision to nationwide water intelligence infrastructure across India.',
      trim: true,
    },
    journeyImage: { type: String, default: '', trim: true },
    journeyCaption: {
      type: String,
      default:
        'Rugged edge sensors and IoT transmission units monitoring high-pressure water conduits, clarifiers, and urban distribution networks in real time.',
      trim: true,
    },
    mediaPublicId: { type: String, default: '', trim: true },
    milestones: { type: [AboutJourneyMilestoneSchema], default: [] },
  },
  { _id: false }
);

const AboutVisionItemSchema = new Schema<IAboutVisionItem>(
  {
    badge: { type: String, default: 'Universal Visibility', trim: true },
    title: { type: String, default: 'Our Vision', trim: true },
    description: {
      type: String,
      default:
        'A world where zero water goes unmeasured, unaccounted, or wasted. We envision sustainable, resilient ecosystems powered by universal water visibility and real-time intelligence.',
      trim: true,
    },
    isActive: { type: Boolean, default: true },
  },
  { _id: false }
);

const AboutMissionItemSchema = new Schema<IAboutMissionItem>(
  {
    badge: { type: String, default: 'Digital Infrastructure', trim: true },
    title: { type: String, default: 'Our Mission', trim: true },
    description: {
      type: String,
      default:
        "To deliver India's most reliable and scalable telemetry infrastructure and water data platform, empowering organizations, utilities, and communities to secure their water future.",
      trim: true,
    },
    isActive: { type: Boolean, default: true },
  },
  { _id: false }
);

const AboutPurposeDirectionSchema = new Schema<IAboutPurposeDirection>(
  {
    visible: { type: Boolean, default: true },
    eyebrow: { type: String, default: 'PURPOSE & DIRECTION', trim: true },
    title: { type: String, default: 'Shaping a Water-Secure Future', trim: true },
    description: {
      type: String,
      default:
        'Guiding our engineering, partnerships, and operations toward verifiable water accountability across every level of infrastructure.',
      trim: true,
    },
    vision: { type: AboutVisionItemSchema, default: () => ({}) },
    mission: { type: AboutMissionItemSchema, default: () => ({}) },
  },
  { _id: false }
);

const AboutPillarItemSchema = new Schema<IAboutPillarItem>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    image: { type: String, default: '', trim: true },
    mediaPublicId: { type: String, default: '', trim: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { _id: true, timestamps: true }
);

const AboutPillarsSchema = new Schema<IAboutPillars>(
  {
    visible: { type: Boolean, default: true },
    eyebrow: { type: String, default: 'WHAT DRIVES US', trim: true },
    title: { type: String, default: 'The Pillars of Veenero', trim: true },
    description: {
      type: String,
      default:
        'Our engineering, culture, and products are rooted in rigorous water accountability and sustainable impact.',
      trim: true,
    },
    list: { type: [AboutPillarItemSchema], default: [] },
  },
  { _id: false }
);

const AboutWhyChooseItemSchema = new Schema<IAboutWhyChooseItem>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    icon: { type: String, default: 'Layers', trim: true },
    image: { type: String, default: '', trim: true },
    mediaPublicId: { type: String, default: '', trim: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { _id: true, timestamps: true }
);

const AboutWhyChooseSchema = new Schema<IAboutWhyChoose>(
  {
    visible: { type: Boolean, default: true },
    eyebrow: { type: String, default: 'WHY CHOOSE VEENERO', trim: true },
    title: { type: String, default: 'What Sets', trim: true },
    highlightedText: { type: String, default: 'Veenero Apart', trim: true },
    description: {
      type: String,
      default:
        'We do not provide single-point devices or surface-level charts. We deliver a complete digital infrastructure layer for enterprise water management.',
      trim: true,
    },
    bottomTrustText: {
      type: String,
      default: 'Built for reliability. Designed for scale. Driven by impact.',
      trim: true,
    },
    list: { type: [AboutWhyChooseItemSchema], default: [] },
  },
  { _id: false }
);

const AboutTeamMemberSchema = new Schema<IAboutTeamMember>(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    bio: { type: String, required: true, trim: true },
    icon: { type: String, default: 'Users2', trim: true },
    image: { type: String, default: '', trim: true },
    mediaPublicId: { type: String, default: '', trim: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { _id: true, timestamps: true }
);

const AboutLeadershipSchema = new Schema<IAboutLeadership>(
  {
    visible: { type: Boolean, default: true },
    eyebrow: { type: String, default: 'OUR TEAM', trim: true },
    title: { type: String, default: 'Driven by Water & Technology Pioneers', trim: true },
    description: {
      type: String,
      default:
        'Our multidisciplinary team unites IoT systems engineers, data scientists, and water conservation advocates.',
      trim: true,
    },
    team: { type: [AboutTeamMemberSchema], default: [] },
  },
  { _id: false }
);

const AboutCTASchema = new Schema<IAboutCTA>(
  {
    visible: { type: Boolean, default: true },
    eyebrow: { type: String, default: 'JOIN THE WATER REVOLUTION', trim: true },
    title: { type: String, default: 'The future of water is intelligent, accountable, and sustainable.', trim: true },
    description: {
      type: String,
      default:
        'Join forward-thinking enterprises and utilities creating water visibility and verifiable sustainability with Veenero.',
      trim: true,
    },
    primaryButtonText: { type: String, default: 'Join Us in Our Mission', trim: true },
    primaryButtonLink: { type: String, default: '/contact', trim: true },
  },
  { _id: false }
);

const AboutSEOSchema = new Schema<IAboutSEO>(
  {
    metaTitle: { type: String, default: 'About Us | Veenero - Building India’s Water Intelligence', trim: true },
    metaDescription: {
      type: String,
      default:
        'Learn about Veenero’s mission to transform water management through AI-driven intelligence, IoT telemetry, and verifiable data infrastructure.',
      trim: true,
    },
  },
  { _id: false }
);

// ─── Main AboutPageSettings Schema ────────────────────────────────────────────

const AboutPageSettingsSchema = new Schema<IAboutPageSettings>(
  {
    hero: { type: AboutHeroSchema, default: () => ({}) },
    ourStory: { type: AboutStorySchema, default: () => ({}) },
    impactStats: { type: AboutImpactStatsSchema, default: () => ({}) },
    ourJourney: { type: AboutJourneySchema, default: () => ({}) },
    purposeDirection: { type: AboutPurposeDirectionSchema, default: () => ({}) },
    pillars: { type: AboutPillarsSchema, default: () => ({}) },
    whyChoose: { type: AboutWhyChooseSchema, default: () => ({}) },
    leadership: { type: AboutLeadershipSchema, default: () => ({}) },
    cta: { type: AboutCTASchema, default: () => ({}) },
    seo: { type: AboutSEOSchema, default: () => ({}) },
    isPublished: { type: Boolean, default: true },
    lastUpdatedBy: { type: String, default: 'System' },
  },
  {
    timestamps: true,
    suppressReservedKeysWarning: true,
    toJSON: {
      transform: (_, ret: any) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const AboutPageSettingsModel = mongoose.model<IAboutPageSettings>(
  'AboutPageSettings',
  AboutPageSettingsSchema
);
