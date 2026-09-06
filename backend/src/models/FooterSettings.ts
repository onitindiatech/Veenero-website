import mongoose, { Schema, Document } from 'mongoose';

export interface IFooterLink {
  label: string;
  href: string;
}

export interface IFooterSocial {
  iconName: string;
  href: string;
  label: string;
}

export interface IFooterSettings extends Document {
  description: string;
  address: string;
  mobile: string;
  email: string;
  copyrightText: string;
  googleRating: {
    rating: string;
    reviewsCount: string;
    href: string;
  };
  links: {
    solutions: IFooterLink[];
    company: IFooterLink[];
    resources: IFooterLink[];
  };
  socialLinks: IFooterSocial[];
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FooterLinkSchema = new Schema<IFooterLink>({
  label: { type: String, required: true },
  href: { type: String, required: true },
}, { _id: false });

const FooterSocialSchema = new Schema<IFooterSocial>({
  iconName: { type: String, required: true },
  href: { type: String, required: true },
  label: { type: String, required: true },
}, { _id: false });

const FooterSettingsSchema = new Schema<IFooterSettings>(
  {
    description: {
      type: String,
      default: "Building India’s Water Intelligence Network—making every litre visible through a real-time water data platform.",
    },
    address: {
      type: String,
      default: "H-no 3-294/1/A/1 Tailors Colony Adilabad 504001",
    },
    mobile: {
      type: String,
      default: "+91 9346517202",
    },
    email: {
      type: String,
      default: "udaygedam@veenerosolutions.com",
    },
    copyrightText: {
      type: String,
      default: "© {year} Veenero Sustainable Solutions Pvt Ltd. All rights reserved.",
    },
    googleRating: {
      rating: { type: String, default: "4.9" },
      reviewsCount: { type: String, default: "50+ Enterprise Reviews" },
      href: { type: String, default: "#" },
    },
    links: {
      solutions: [FooterLinkSchema],
      company: [FooterLinkSchema],
      resources: [FooterLinkSchema],
    },
    socialLinks: [FooterSocialSchema],
    updatedBy: { type: String },
  },
  { timestamps: true }
);

export const FooterSettingsModel = mongoose.model<IFooterSettings>(
  'FooterSettings',
  FooterSettingsSchema
);
