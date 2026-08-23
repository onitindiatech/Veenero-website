import mongoose, { Schema, Document } from 'mongoose';

export type CareerStatus = 'DRAFT' | 'PUBLISHED' | 'ACTIVE' | 'ARCHIVED' | 'CLOSED' | 'TRASHED';

export interface ICareer extends Document {
  title: string;
  slug: string;
  department: string;
  location: string;
  employmentType: string;
  description: string;
  shortDescription: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  qualifications: string[];
  skills: string[];
  experience: string;
  salaryRange?: string;
  applicationUrl?: string;
  applicationEmail?: string;
  status: CareerStatus;
  previousStatus?: CareerStatus;
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

const CareerSchema = new Schema<ICareer>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true, trim: true, index: true },
    department: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    employmentType: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true },
    responsibilities: { type: [String], default: [] },
    requirements: { type: [String], default: [] },
    niceToHave: { type: [String], default: [] },
    qualifications: { type: [String], default: [] },
    skills: { type: [String], default: [] },
    experience: { type: String, required: true },
    salaryRange: { type: String, trim: true },
    applicationUrl: { type: String, trim: true },
    applicationEmail: { type: String, trim: true },
    status: {
      type: String,
      required: true,
      enum: ['DRAFT', 'PUBLISHED', 'ACTIVE', 'ARCHIVED', 'CLOSED', 'TRASHED'],
      default: 'DRAFT',
      index: true,
    },
    previousStatus: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'ACTIVE', 'ARCHIVED', 'CLOSED'],
    },
    isFeatured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    publishedAt: { type: Date },
    createdBy: { type: String, required: true },
    updatedBy: { type: String, required: true },
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

// Slug unique constraint among non-deleted careers
CareerSchema.index(
  { slug: 1 },
  { unique: true, partialFilterExpression: { deletedAt: null } }
);

export const CareerModel = mongoose.model<ICareer>('Career', CareerSchema);
export default CareerModel;
