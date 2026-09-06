import mongoose, { Schema, Document } from 'mongoose';

export interface IHiringStep {
  num: string;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
}

export interface ICareerHeroSettings {
  visible: boolean;
  eyebrow: string;
  title: string;
  description: string;
  primaryCtaText: string;
  secondaryCtaText: string;
}

export interface IHiringProcessSettings {
  visible: boolean;
  eyebrow: string;
  title: string;
  description: string;
  steps: IHiringStep[];
}

export interface ICareerCTASettings {
  visible: boolean;
  eyebrow: string;
  title: string;
  description: string;
  buttonText: string;
  email: string;
}

export interface ICareerSEOSettings {
  metaTitle: string;
  metaDescription: string;
}

export interface ICareerPageSettings extends Document {
  hero: ICareerHeroSettings;
  hiringProcess: IHiringProcessSettings;
  cta: ICareerCTASettings;
  seo: ICareerSEOSettings;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const HiringStepSchema = new Schema<IHiringStep>({
  num: { type: String, default: '01' },
  icon: { type: String, default: 'Search' },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  description: { type: String, default: '' },
}, { _id: false });

const CareerPageSettingsSchema = new Schema<ICareerPageSettings>(
  {
    hero: {
      visible: { type: Boolean, default: true },
      eyebrow: { type: String, default: 'CAREERS AT VEENERO' },
      title: { type: String, default: 'Build the Future of Water Intelligence' },
      description: { type: String, default: "We are building India's water intelligence platform. Join our mission to make every litre visible, verifiable, and meaningful." },
      primaryCtaText: { type: String, default: 'Explore Opportunities' },
      secondaryCtaText: { type: String, default: 'Hiring Process' },
    },
    hiringProcess: {
      visible: { type: Boolean, default: true },
      eyebrow: { type: String, default: 'HOW WE HIRE' },
      title: { type: String, default: 'Our Hiring Process' },
      description: { type: String, default: 'Transparent, focused, and respectful of your time.' },
      steps: [HiringStepSchema],
    },
    cta: {
      visible: { type: Boolean, default: true },
      eyebrow: { type: String, default: "DON'T SEE YOUR ROLE?" },
      title: { type: String, default: 'We Are Always Looking for Exceptional Talent' },
      description: { type: String, default: 'If you are driven by solving complex water challenges at national scale, tell us how you can contribute.' },
      buttonText: { type: String, default: 'Get in Touch' },
      email: { type: String, default: 'careers@veenerosolutions.com' },
    },
    seo: {
      metaTitle: { type: String, default: 'Careers | Veenero - Build the Future of Water Intelligence' },
      metaDescription: { type: String, default: 'Join Veenero to build IoT telemetry, predictive water analytics, and verifiable water intelligence.' },
    },
    updatedBy: { type: String },
  },
  { timestamps: true }
);

export const CareerPageSettingsModel = mongoose.model<ICareerPageSettings>(
  'CareerPageSettings',
  CareerPageSettingsSchema
);
