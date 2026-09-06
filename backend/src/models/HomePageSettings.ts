import mongoose, { Schema, Document } from 'mongoose';

// ─── Sub-schemas for each Home Page section ────────────────────────────────────

export interface IHomeHero {
  visible: boolean;
  eyebrow: string;
  title: string;
  description: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  image: string;
  imageAlt: string;
  bottomText: string;
}

export interface IHomeValueItem {
  iconName: string;
  title: string;
  description: string;
}

export interface IHomeStatItem {
  value: string;
  label: string;
}

export interface IHomeAbout {
  visible: boolean;
  eyebrow: string;
  title: string;
  description: string;
  values: IHomeValueItem[];
  stats: IHomeStatItem[];
}

export interface IHomeSolutionItem {
  iconName: string;
  title: string;
  description: string;
  features: string[];
}

export interface IHomeSolutions {
  visible: boolean;
  eyebrow: string;
  title: string;
  description: string;
  ctaText?: string;
  ctaLink?: string;
  list: IHomeSolutionItem[];
}

export interface IHomeStepItem {
  number: string;
  title: string;
  description: string;
  points: string[];
}

export interface IHomeApproach {
  visible: boolean;
  eyebrow: string;
  title: string;
  description: string;
  steps: IHomeStepItem[];
}

export interface IHomeImpactItem {
  iconName: string;
  value: string;
  label: string;
  description: string;
}

export interface IHomeTestimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
}

export interface IHomeImpact {
  visible: boolean;
  eyebrow: string;
  title: string;
  description: string;
  impacts: IHomeImpactItem[];
  testimonial: IHomeTestimonial;
}

export interface IHomePartnerItem {
  name: string;
  logo: string;
  description: string;
}

export interface IHomePartners {
  visible: boolean;
  eyebrow: string;
  title: string;
  description: string;
  list: IHomePartnerItem[];
}

export interface IHomeCareerOpeningItem {
  title: string;
  location: string;
  department: string;
  isNew: boolean;
}

export interface IHomeCareers {
  visible: boolean;
  eyebrow: string;
  title: string;
  description: string;
  openingsTitle: string;
  list: IHomeCareerOpeningItem[];
  generalAppText: string;
  generalAppButtonText: string;
}

export interface IHomeContactInfoItem {
  iconName: string;
  label: string;
  value: string;
}

export interface IHomeContact {
  visible: boolean;
  eyebrow: string;
  title: string;
  description: string;
  infoTitle: string;
  infoList: IHomeContactInfoItem[];
  demoTitle: string;
  demoDescription: string;
  demoButtonText: string;
  formTitle: string;
}

export interface IHomeFooterLinkItem {
  label: string;
  href: string;
}

export interface IHomeFooterLinks {
  solutions: IHomeFooterLinkItem[];
  company: IHomeFooterLinkItem[];
  resources: IHomeFooterLinkItem[];
}

export interface IHomeSocialLink {
  iconName: string;
  href: string;
  label: string;
}

export interface IHomeFooter {
  description: string;
  address: string;
  mobile: string;
  links: IHomeFooterLinks;
  socialLinks: IHomeSocialLink[];
}

export interface IHomeSeo {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
}

// ─── Main HomePageSettings Document Interface ───────────────────────────────────

export interface IHomePageSettings extends Document {
  hero: IHomeHero;
  about: IHomeAbout;
  solutions: IHomeSolutions;
  approach: IHomeApproach;
  impact: IHomeImpact;
  partners: IHomePartners;
  careers: IHomeCareers;
  contact: IHomeContact;
  footer: IHomeFooter;
  seo?: IHomeSeo;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Sub-schemas Definitions ──────────────────────────────────────────────────

const HomeHeroSchema = new Schema<IHomeHero>({
  visible: { type: Boolean, default: true },
  eyebrow: { type: String, default: '' },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  primaryCtaText: { type: String, default: '' },
  primaryCtaLink: { type: String, default: '' },
  secondaryCtaText: { type: String, default: '' },
  secondaryCtaLink: { type: String, default: '' },
  image: { type: String, default: '' },
  imageAlt: { type: String, default: '' },
  bottomText: { type: String, default: '' },
}, { _id: false });

const HomeValueItemSchema = new Schema<IHomeValueItem>({
  iconName: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
}, { _id: false });

const HomeStatItemSchema = new Schema<IHomeStatItem>({
  value: { type: String, required: true },
  label: { type: String, required: true },
}, { _id: false });

const HomeAboutSchema = new Schema<IHomeAbout>({
  visible: { type: Boolean, default: true },
  eyebrow: { type: String, default: '' },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  values: { type: [HomeValueItemSchema], default: [] },
  stats: { type: [HomeStatItemSchema], default: [] },
}, { _id: false });

const HomeSolutionItemSchema = new Schema<IHomeSolutionItem>({
  iconName: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  features: { type: [String], default: [] },
}, { _id: false });

const HomeSolutionsSchema = new Schema<IHomeSolutions>({
  visible: { type: Boolean, default: true },
  eyebrow: { type: String, default: '' },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  ctaText: { type: String, default: 'Explore the Suite' },
  ctaLink: { type: String, default: '/#solutions' },
  list: { type: [HomeSolutionItemSchema], default: [] },
}, { _id: false });

const HomeStepItemSchema = new Schema<IHomeStepItem>({
  number: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  points: { type: [String], default: [] },
}, { _id: false });

const HomeApproachSchema = new Schema<IHomeApproach>({
  visible: { type: Boolean, default: true },
  eyebrow: { type: String, default: '' },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  steps: { type: [HomeStepItemSchema], default: [] },
}, { _id: false });

const HomeImpactItemSchema = new Schema<IHomeImpactItem>({
  iconName: { type: String, required: true },
  value: { type: String, required: true },
  label: { type: String, required: true },
  description: { type: String, required: true },
}, { _id: false });

const HomeTestimonialSchema = new Schema<IHomeTestimonial>({
  quote: { type: String, required: true },
  author: { type: String, required: true },
  role: { type: String, required: true },
  company: { type: String, required: true },
}, { _id: false });

const HomeImpactSchema = new Schema<IHomeImpact>({
  visible: { type: Boolean, default: true },
  eyebrow: { type: String, default: '' },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  impacts: { type: [HomeImpactItemSchema], default: [] },
  testimonial: { type: HomeTestimonialSchema, required: true },
}, { _id: false });

const HomePartnerItemSchema = new Schema<IHomePartnerItem>({
  name: { type: String, required: true },
  logo: { type: String, required: true },
  description: { type: String, required: true },
}, { _id: false });

const HomePartnersSchema = new Schema<IHomePartners>({
  visible: { type: Boolean, default: true },
  eyebrow: { type: String, default: '' },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  list: { type: [HomePartnerItemSchema], default: [] },
}, { _id: false });

const HomeCareerOpeningItemSchema = new Schema<IHomeCareerOpeningItem>({
  title: { type: String, required: true },
  location: { type: String, required: true },
  department: { type: String, required: true },
  isNew: { type: Boolean, default: true },
}, { _id: false });

const HomeCareersSchema = new Schema<IHomeCareers>({
  visible: { type: Boolean, default: true },
  eyebrow: { type: String, default: '' },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  openingsTitle: { type: String, default: '' },
  list: { type: [HomeCareerOpeningItemSchema], default: [] },
  generalAppText: { type: String, default: '' },
  generalAppButtonText: { type: String, default: '' },
}, { _id: false });

const HomeContactInfoItemSchema = new Schema<IHomeContactInfoItem>({
  iconName: { type: String, required: true },
  label: { type: String, required: true },
  value: { type: String, required: true },
}, { _id: false });

const HomeContactSchema = new Schema<IHomeContact>({
  visible: { type: Boolean, default: true },
  eyebrow: { type: String, default: '' },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  infoTitle: { type: String, default: '' },
  infoList: { type: [HomeContactInfoItemSchema], default: [] },
  demoTitle: { type: String, default: '' },
  demoDescription: { type: String, default: '' },
  demoButtonText: { type: String, default: '' },
  formTitle: { type: String, default: '' },
}, { _id: false });

const HomeFooterLinkItemSchema = new Schema<IHomeFooterLinkItem>({
  label: { type: String, required: true },
  href: { type: String, required: true },
}, { _id: false });

const HomeFooterLinksSchema = new Schema<IHomeFooterLinks>({
  solutions: { type: [HomeFooterLinkItemSchema], default: [] },
  company: { type: [HomeFooterLinkItemSchema], default: [] },
  resources: { type: [HomeFooterLinkItemSchema], default: [] },
}, { _id: false });

const HomeSocialLinkSchema = new Schema<IHomeSocialLink>({
  iconName: { type: String, required: true },
  href: { type: String, required: true },
  label: { type: String, required: true },
}, { _id: false });

const HomeFooterSchema = new Schema<IHomeFooter>({
  description: { type: String, default: '' },
  address: { type: String, default: '' },
  mobile: { type: String, default: '' },
  links: { type: HomeFooterLinksSchema, required: true },
  socialLinks: { type: [HomeSocialLinkSchema], default: [] },
}, { _id: false });

const HomeSeoSchema = new Schema<IHomeSeo>({
  metaTitle: { type: String, default: 'Veenero | Technology-Driven Water Conservation' },
  metaDescription: { type: String, default: 'Pioneering sustainable water management through innovative technology. Leak detection, efficiency optimization, and lasting conservation impact.' },
  metaKeywords: { type: String, default: 'water intelligence, water conservation, IoT telemetry, water verification' },
}, { _id: false });

// ─── Main Schema Definition ───────────────────────────────────────────────────

const HomePageSettingsSchema = new Schema<IHomePageSettings>(
  {
    hero: { type: HomeHeroSchema, required: true },
    about: { type: HomeAboutSchema, required: true },
    solutions: { type: HomeSolutionsSchema, required: true },
    approach: { type: HomeApproachSchema, required: true },
    impact: { type: HomeImpactSchema, required: true },
    partners: { type: HomePartnersSchema, required: true },
    careers: { type: HomeCareersSchema, required: true },
    contact: { type: HomeContactSchema, required: true },
    footer: { type: HomeFooterSchema, required: true },
    seo: { type: HomeSeoSchema, default: () => ({ metaTitle: 'Veenero | Technology-Driven Water Conservation', metaDescription: 'Pioneering sustainable water management through innovative technology.', metaKeywords: 'water intelligence, IoT telemetry' }) },
    updatedBy: { type: String, default: 'System Seed' },
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

export const HomePageSettingsModel = mongoose.model<IHomePageSettings>(
  'HomePageSettings',
  HomePageSettingsSchema,
  'homepagesettings' // Explicit collection name
);

export default HomePageSettingsModel;
