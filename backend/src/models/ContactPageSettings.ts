import mongoose, { Schema, Document } from 'mongoose';

export interface IContactInfoItem {
  iconName: string;
  label: string;
  value: string;
  href?: string;
  note?: string;
}

export interface IContactInquiryType {
  id: string;
  label: string;
}

export interface IContactFAQItem {
  question: string;
  answer: string;
}

export interface IContactHero {
  visible: boolean;
  eyebrow: string;
  title: string;
  description: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  backgroundImage?: string;
  mediaPublicId?: string;
}

export interface IContactInfoSection {
  visible: boolean;
  eyebrow: string;
  title: string;
  description: string;
  items: IContactInfoItem[];
}

export interface IContactDemoCard {
  visible: boolean;
  badge: string;
  title: string;
  description: string;
  bulletPoints: string[];
  buttonText: string;
}

export interface IContactFormConfig {
  visible: boolean;
  title: string;
  subtitle: string;
  inquiryTypes: IContactInquiryType[];
  submitButtonText: string;
  successTitle: string;
  successMessage: string;
}

export interface IContactFAQSection {
  visible: boolean;
  eyebrow: string;
  title: string;
  description: string;
  items: IContactFAQItem[];
}

export interface IContactCTA {
  visible: boolean;
  title: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
}

export interface IContactSEO {
  metaTitle: string;
  metaDescription: string;
}

export interface IContactPageSettings extends Document {
  hero: IContactHero;
  contactInfo: IContactInfoSection;
  demoCard: IContactDemoCard;
  form: IContactFormConfig;
  faq: IContactFAQSection;
  cta: IContactCTA;
  seo: IContactSEO;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContactInfoItemSchema = new Schema<IContactInfoItem>({
  iconName: { type: String, default: 'MapPin' },
  label: { type: String, default: '' },
  value: { type: String, default: '' },
  href: { type: String, default: '' },
  note: { type: String, default: '' },
}, { _id: false });

const InquiryTypeSchema = new Schema<IContactInquiryType>({
  id: { type: String, default: '' },
  label: { type: String, default: '' },
}, { _id: false });

const FAQItemSchema = new Schema<IContactFAQItem>({
  question: { type: String, default: '' },
  answer: { type: String, default: '' },
}, { _id: false });

const ContactPageSettingsSchema = new Schema<IContactPageSettings>(
  {
    hero: {
      visible: { type: Boolean, default: true },
      eyebrow: { type: String, default: 'GET IN TOUCH' },
      title: { type: String, default: 'Connect with Our Water Intelligence Team' },
      description: { type: String, default: 'Whether you are an enterprise seeking multi-site water visibility, a municipal utility modernizing telemetry, or an organization preparing audit-ready ESG disclosures—we are here to help.' },
      primaryCtaText: { type: String, default: 'Send a Message' },
      secondaryCtaText: { type: String, default: 'Platform Demo' },
      backgroundImage: { type: String },
      mediaPublicId: { type: String },
    },
    contactInfo: {
      visible: { type: Boolean, default: true },
      eyebrow: { type: String, default: 'DIRECT REACH' },
      title: { type: String, default: 'Contact Details' },
      description: { type: String, default: 'Reach out directly to our engineering and sustainability team for technical consultations, pilots, or partnerships.' },
      items: [ContactInfoItemSchema],
    },
    demoCard: {
      visible: { type: Boolean, default: true },
      badge: { type: String, default: 'SCHEDULE DEMO' },
      title: { type: String, default: 'See Veenero in Action' },
      description: { type: String, default: 'Experience real-time telemetry, micro-leak detection algorithms, and automated ESG reporting on your infrastructure.' },
      bulletPoints: [{ type: String }],
      buttonText: { type: String, default: 'Schedule a Platform Demo' },
    },
    form: {
      visible: { type: Boolean, default: true },
      title: { type: String, default: 'Send an Inquiry' },
      subtitle: { type: String, default: 'Fill out the form below and an engineer will respond within 24 business hours.' },
      inquiryTypes: [InquiryTypeSchema],
      submitButtonText: { type: String, default: 'Send Message' },
      successTitle: { type: String, default: 'Message Received' },
      successMessage: { type: String, default: 'Thank you for reaching out. A water intelligence specialist will be in touch shortly.' },
    },
    faq: {
      visible: { type: Boolean, default: true },
      eyebrow: { type: String, default: 'FREQUENTLY ASKED' },
      title: { type: String, default: 'Common Questions' },
      description: { type: String, default: 'Quick answers about telemetry deployments, retrofits, and trial pilots.' },
      items: [FAQItemSchema],
    },
    cta: {
      visible: { type: Boolean, default: true },
      title: { type: String, default: 'Ready to Transform Water Management?' },
      description: { type: String, default: 'Join enterprise facilities and utilities across India turning water blindspots into verifiable intelligence.' },
      primaryButtonText: { type: String, default: 'Explore Solutions' },
      primaryButtonLink: { type: String, default: '/solutions' },
      secondaryButtonText: { type: String, default: 'Read Our Story' },
      secondaryButtonLink: { type: String, default: '/about' },
    },
    seo: {
      metaTitle: { type: String, default: 'Contact Us | Veenero - Water Intelligence Network' },
      metaDescription: { type: String, default: 'Get in touch with Veenero for industrial water monitoring, IoT edge telemetry, and enterprise water accounting.' },
    },
    updatedBy: { type: String },
  },
  { timestamps: true }
);

export const ContactPageSettingsModel = mongoose.model<IContactPageSettings>(
  'ContactPageSettings',
  ContactPageSettingsSchema
);
