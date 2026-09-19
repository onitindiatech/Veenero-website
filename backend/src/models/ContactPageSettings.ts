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
  // Section header
  sectionEyebrow: string;
  sectionHeading: string;
  sectionDescription: string;
  // Legacy / form card
  title: string;
  subtitle: string;
  // Field labels
  nameLabel: string;
  emailLabel: string;
  organizationLabel: string;
  focusAreaLabel: string;
  messageLabel: string;
  // Field placeholders
  namePlaceholder: string;
  emailPlaceholder: string;
  organizationPlaceholder: string;
  messagePlaceholder: string;
  // Inquiry types (dropdown options)
  inquiryTypes: IContactInquiryType[];
  // Submission
  submitButtonText: string;
  successTitle: string;
  successMessage: string;
  errorMessage: string;
}

export interface IContactOffice {
  visible: boolean;
  sectionEyebrow: string;
  sectionHeading: string;
  companyName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  phoneHref: string;
  email: string;
  emailHref: string;
  mapEmbedUrl: string;
  mapLinkUrl: string;
  mapLinkText: string;
}

export interface IContactOfficeHours {
  visible: boolean;
  eyebrow: string;
  text: string;
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
  office: IContactOffice;
  officeHours: IContactOfficeHours;
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
      title: { type: String, default: "Let's Build Better Water Systems Together." },
      description: { type: String, default: 'Whether you are an enterprise seeking multi-site water visibility, a municipal utility modernizing telemetry, or an organization preparing audit-ready ESG disclosures—we are here to help.' },
      primaryCtaText: { type: String, default: 'Start a Conversation' },
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
      // Section header
      sectionEyebrow: { type: String, default: 'START A CONVERSATION' },
      sectionHeading: { type: String, default: "How Can We Help Your Water Operations?" },
      sectionDescription: { type: String, default: 'Fill out the form below and our team will get back to you shortly. Select your focus area to help us route your inquiry faster.' },
      // Legacy card header
      title: { type: String, default: 'Send Us a Message' },
      subtitle: { type: String, default: 'Fill out the details below and our team will get in touch promptly.' },
      // Field labels
      nameLabel: { type: String, default: 'Full Name' },
      emailLabel: { type: String, default: 'Work Email' },
      organizationLabel: { type: String, default: 'Organization' },
      focusAreaLabel: { type: String, default: 'Focus Area' },
      messageLabel: { type: String, default: 'Your Message' },
      // Placeholders
      namePlaceholder: { type: String, default: 'e.g. Rahul Sharma' },
      emailPlaceholder: { type: String, default: 'name@company.com' },
      organizationPlaceholder: { type: String, default: 'e.g. Enterprise Ltd / Municipal Water Board' },
      messagePlaceholder: { type: String, default: 'Tell us about your facility nodes, telemetry requirements, or water management goals...' },
      // Inquiry types
      inquiryTypes: [InquiryTypeSchema],
      // Submission
      submitButtonText: { type: String, default: 'Send Message' },
      successTitle: { type: String, default: 'Thank you for reaching out!' },
      successMessage: { type: String, default: "Your inquiry has been received. Our water intelligence engineering team will review your requirements and respond within 24 hours." },
      errorMessage: { type: String, default: 'Failed to send message. Please try again.' },
    },
    office: {
      visible: { type: Boolean, default: true },
      sectionEyebrow: { type: String, default: 'OUR OFFICE' },
      sectionHeading: { type: String, default: 'Visit Us in Adilabad, India' },
      companyName: { type: String, default: 'Veenero Solutions Pvt. Ltd.' },
      addressLine1: { type: String, default: 'H-no 3-294/1/A/1, Tailors Colony' },
      addressLine2: { type: String, default: '' },
      city: { type: String, default: 'Adilabad' },
      state: { type: String, default: 'Telangana' },
      zip: { type: String, default: '504001' },
      country: { type: String, default: 'India' },
      phone: { type: String, default: '+91 9346517202' },
      phoneHref: { type: String, default: 'tel:+919346517202' },
      email: { type: String, default: 'info@veenerosolutions.com' },
      emailHref: { type: String, default: 'mailto:info@veenerosolutions.com' },
      mapEmbedUrl: { type: String, default: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3785.0!2d78.5322!3d19.6641!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcf5c2b!2sAdilabad%2C+Telangana!5e0!3m2!1sen!2sin!4v1' },
      mapLinkUrl: { type: String, default: 'https://maps.google.com/?q=Adilabad,Telangana,India' },
      mapLinkText: { type: String, default: 'View on Google Maps' },
    },
    officeHours: {
      visible: { type: Boolean, default: true },
      eyebrow: { type: String, default: 'Office Hours' },
      text: { type: String, default: 'Monday – Friday, 9:00 AM to 6:00 PM IST. For urgent matters, email us directly.' },
    },
    faq: {
      visible: { type: Boolean, default: true },
      eyebrow: { type: String, default: 'COMMON INQUIRIES' },
      title: { type: String, default: 'Frequently Asked Questions' },
      description: { type: String, default: "Everything you need to know about evaluating, piloting, and deploying Veenero's water intelligence platform." },
      items: [FAQItemSchema],
    },
    cta: {
      visible: { type: Boolean, default: true },
      title: { type: String, default: "Ready to Transform Your Water Network?" },
      description: { type: String, default: 'Join organizations across India establishing complete water visibility, accountability, and verifiable sustainability with Veenero.' },
      primaryButtonText: { type: String, default: 'Explore Solutions' },
      primaryButtonLink: { type: String, default: '/solutions' },
      secondaryButtonText: { type: String, default: 'Our Methodology' },
      secondaryButtonLink: { type: String, default: '/approach' },
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
