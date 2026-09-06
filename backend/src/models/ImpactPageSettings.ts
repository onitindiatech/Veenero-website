import mongoose, { Schema, Document } from 'mongoose';

export interface IImpactPillar {
  value: string;
  label: string;
  description: string;
  icon: string;
  tag: string;
}

export interface IStorylineStep {
  number: string;
  stage: string;
  title: string;
  description: string;
  outcome: string;
  icon: string;
}

export interface IEcosystemDomain {
  title: string;
  icon: string;
  description: string;
  impactPoints: string[];
}

export interface ISustainabilityPillar {
  title: string;
  description: string;
}

export interface IImpactHero {
  visible: boolean;
  eyebrow: string;
  title: string;
  description: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  image?: string;
  mediaPublicId?: string;
}

export interface IImpactOutcomes {
  visible: boolean;
  eyebrow: string;
  title: string;
  description: string;
  pillars: IImpactPillar[];
}

export interface IImpactStoryline {
  visible: boolean;
  eyebrow: string;
  title: string;
  description: string;
  steps: IStorylineStep[];
}

export interface IImpactEcosystem {
  visible: boolean;
  eyebrow: string;
  title: string;
  description: string;
  domains: IEcosystemDomain[];
  quote: {
    text: string;
    author: string;
    role: string;
    organization: string;
  };
}

export interface IImpactSustainability {
  visible: boolean;
  eyebrow: string;
  title: string;
  description: string;
  videoUrl?: string;
  videoPoster?: string;
  videoPublicId?: string;
  pillars: ISustainabilityPillar[];
}

export interface IImpactCTA {
  visible: boolean;
  title: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
}

export interface IImpactSEO {
  metaTitle: string;
  metaDescription: string;
}

export interface IImpactPageSettings extends Document {
  hero: IImpactHero;
  outcomes: IImpactOutcomes;
  storyline: IImpactStoryline;
  ecosystem: IImpactEcosystem;
  sustainability: IImpactSustainability;
  cta: IImpactCTA;
  seo: IImpactSEO;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ImpactPillarSchema = new Schema<IImpactPillar>({
  value: { type: String, default: '' },
  label: { type: String, default: '' },
  description: { type: String, default: '' },
  icon: { type: String, default: 'Droplets' },
  tag: { type: String, default: '' },
}, { _id: false });

const StorylineStepSchema = new Schema<IStorylineStep>({
  number: { type: String, default: '01' },
  stage: { type: String, default: '' },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  outcome: { type: String, default: '' },
  icon: { type: String, default: 'Activity' },
}, { _id: false });

const EcosystemDomainSchema = new Schema<IEcosystemDomain>({
  title: { type: String, default: '' },
  icon: { type: String, default: 'Layers' },
  description: { type: String, default: '' },
  impactPoints: [{ type: String }],
}, { _id: false });

const SustainabilityPillarSchema = new Schema<ISustainabilityPillar>({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
}, { _id: false });

const ImpactPageSettingsSchema = new Schema<IImpactPageSettings>(
  {
    hero: {
      visible: { type: Boolean, default: true },
      eyebrow: { type: String, default: 'MEASURING WHAT MATTERS' },
      title: { type: String, default: 'Turning Water Intelligence Into Measurable Impact' },
      description: { type: String, default: 'Water Visibility creates Water Accountability.' },
      primaryCtaText: { type: String, default: 'Explore Impact' },
      secondaryCtaText: { type: String, default: 'View Metrics' },
      image: { type: String, default: '' },
      mediaPublicId: { type: String, default: '' },
    },
    outcomes: {
      visible: { type: Boolean, default: true },
      eyebrow: { type: String, default: 'IMPACT METRICS' },
      title: { type: String, default: 'Quantified Performance Across 4 Core Areas' },
      description: { type: String, default: 'Our water intelligence infrastructure delivers measurable value across water visibility, waste reduction, operational efficiency, and ESG verification.' },
      pillars: [ImpactPillarSchema],
    },
    storyline: {
      visible: { type: Boolean, default: true },
      eyebrow: { type: String, default: 'IMPACT JOURNEY' },
      title: { type: String, default: 'From Blindspot to Verified Accountability' },
      description: { type: String, default: 'How Veenero transforms physical water movement into auditable intelligence.' },
      steps: [StorylineStepSchema],
    },
    ecosystem: {
      visible: { type: Boolean, default: true },
      eyebrow: { type: String, default: 'CROSS-SECTOR DEPLOYMENTS' },
      title: { type: String, default: 'Measurable Impact Across Industries' },
      description: { type: String, default: 'From multi-facility commercial campuses to municipal networks and industrial operations.' },
      domains: [EcosystemDomainSchema],
      quote: {
        text: { type: String, default: 'Veenero replaced estimation with telemetry across our 14 manufacturing facilities.' },
        author: { type: String, default: 'VP Infrastructure & ESG Operations' },
        role: { type: String, default: 'Enterprise Manufacturing Conglomerate' },
        organization: { type: String, default: 'National Water Compliance Committee' },
      },
    },
    sustainability: {
      visible: { type: Boolean, default: true },
      eyebrow: { type: String, default: 'LONG-TERM RESILIENCE' },
      title: { type: String, default: 'Built for India’s Water Future' },
      description: { type: String, default: 'Sustainable water intelligence for climate adaptation and long-term enterprise resilience.' },
      videoUrl: { type: String, default: '' },
      videoPoster: { type: String, default: '' },
      videoPublicId: { type: String, default: '' },
      pillars: [SustainabilityPillarSchema],
    },
    cta: {
      visible: { type: Boolean, default: true },
      title: { type: String, default: 'Start Measuring What Matters' },
      description: { type: String, default: 'Schedule a discovery session with our water systems engineering team.' },
      primaryButtonText: { type: String, default: 'Request Demo' },
      primaryButtonLink: { type: String, default: '/contact' },
      secondaryButtonText: { type: String, default: 'View Solutions' },
      secondaryButtonLink: { type: String, default: '/solutions' },
    },
    seo: {
      metaTitle: { type: String, default: 'Impact | Veenero - Water Intelligence Infrastructure' },
      metaDescription: { type: String, default: 'Discover how Veenero turns water visibility into verifiable ESG impact and resource stewardship.' },
    },
    updatedBy: { type: String },
  },
  { timestamps: true }
);

export const ImpactPageSettingsModel = mongoose.model<IImpactPageSettings>(
  'ImpactPageSettings',
  ImpactPageSettingsSchema
);
