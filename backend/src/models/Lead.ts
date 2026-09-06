import mongoose, { Schema, Document } from 'mongoose';

export type LeadStatus = 'NEW' | 'IN_PROGRESS' | 'RESOLVED' | 'CONTACTED' | 'QUALIFIED' | 'CLOSED';
export type LeadType = 'ENQUIRY' | 'DEMO';

export interface ILead extends Document {
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  inquiryType?: string;
  type: LeadType;
  message: string;
  status: LeadStatus;
  notes?: string;
  source?: string;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    organization: { type: String, trim: true },
    inquiryType: { type: String, default: 'General' },
    type: {
      type: String,
      enum: ['ENQUIRY', 'DEMO'],
      default: 'ENQUIRY',
      index: true,
    },
    message: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['NEW', 'IN_PROGRESS', 'RESOLVED', 'CONTACTED', 'QUALIFIED', 'CLOSED'],
      default: 'NEW',
      index: true,
    },
    notes: { type: String, default: '' },
    source: { type: String, default: 'Contact Page' },
  },
  { timestamps: true }
);

LeadSchema.index({ createdAt: -1 });

export const LeadModel = mongoose.model<ILead>('Lead', LeadSchema);
