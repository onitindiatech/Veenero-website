import mongoose, { Schema, Document } from 'mongoose';

export interface ISocialLink {
  _id?: any;
  name: string;
  url: string;
  platform: string;
  icon?: string;
  iconSource?: 'platform' | 'favicon' | 'custom';
  enabled: boolean;
  order: number;
  openInNewTab: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IGlobalSettings extends Document {
  general: {
    websiteName: string;
    websiteUrl: string;
    defaultLanguage: string;
    timezone: string;
  };
  brand: {
    logoUrl: string;
    faviconUrl: string;
    defaultOgImage: string;
    primaryColor: string;
  };
  contact: {
    primaryEmail: string;
    phone: string;
    address: string;
    businessHours: string;
  };
  social: {
    linkedin: string;
    instagram: string;
    youtube: string;
    twitter: string;
    github: string;
  };
  socialLinks: ISocialLink[];
  behavior: {
    maintenanceMode: boolean;
    cookieConsentEnabled: boolean;
    defaultPagination: number;
  };
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SocialLinkSchema = new Schema<ISocialLink>(
  {
    name: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    platform: { type: String, default: 'custom', trim: true },
    icon: { type: String, default: '' },
    iconSource: { type: String, enum: ['platform', 'favicon', 'custom'], default: 'platform' },
    enabled: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    openInNewTab: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const GlobalSettingsSchema = new Schema<IGlobalSettings>(
  {
    general: {
      websiteName: { type: String, default: 'Veenero Sustainable Solutions' },
      websiteUrl: { type: String, default: 'https://veenero.com' },
      defaultLanguage: { type: String, default: 'en' },
      timezone: { type: String, default: 'Asia/Kolkata' },
    },
    brand: {
      logoUrl: { type: String, default: '/assets/veenero_logo.png' },
      faviconUrl: { type: String, default: '/favicon.ico' },
      defaultOgImage: { type: String, default: '' },
      primaryColor: { type: String, default: '#0d9488' }, // Teal 600
    },
    contact: {
      primaryEmail: { type: String, default: 'udaygedam@veenerosolutions.com' },
      phone: { type: String, default: '+91 9346517202' },
      address: { type: String, default: 'H-no 3-294/1/A/1 Tailors Colony Adilabad 504001' },
      businessHours: { type: String, default: 'Mon - Fri: 9:00 AM - 6:00 PM IST' },
    },
    social: {
      linkedin: { type: String, default: 'https://linkedin.com/company/veenero' },
      instagram: { type: String, default: '' },
      youtube: { type: String, default: '' },
      twitter: { type: String, default: 'https://twitter.com/veenero' },
      github: { type: String, default: '' },
    },
    socialLinks: { type: [SocialLinkSchema], default: [] },
    behavior: {
      maintenanceMode: { type: Boolean, default: false },
      cookieConsentEnabled: { type: Boolean, default: true },
      defaultPagination: { type: Number, default: 20 },
    },
    updatedBy: { type: String },
  },
  { timestamps: true }
);

export const GlobalSettingsModel = mongoose.model<IGlobalSettings>(
  'GlobalSettings',
  GlobalSettingsSchema
);
