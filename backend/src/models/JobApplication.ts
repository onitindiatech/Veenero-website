import mongoose, { Schema, Document } from 'mongoose';

export type ApplicationStatus = 'PENDING' | 'UNDER_REVIEW' | 'SELECTED' | 'NOT_SELECTED';
export type DecisionEmailType = 'SELECTED' | 'NOT_SELECTED';

export interface IJobApplication extends Document {
  careerId: mongoose.Types.ObjectId;
  jobTitle: string;
  jobDepartment?: string;
  candidateName: string;
  email: string;
  phone: string;
  resumeUrl: string;
  resumeFilename: string;
  resumePublicId?: string;
  coverLetter: string;
  linkedInUrl?: string;
  portfolioUrl?: string;
  status: ApplicationStatus;
  notes?: string;
  decisionEmailSent: boolean;
  decisionEmailType?: DecisionEmailType;
  decisionEmailSentAt?: Date;
  decisionSentBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const JobApplicationSchema = new Schema<IJobApplication>(
  {
    careerId: {
      type: Schema.Types.ObjectId,
      ref: 'Career',
      required: true,
      index: true,
    },
    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },
    jobDepartment: {
      type: String,
      trim: true,
      default: '',
    },
    candidateName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    resumeUrl: {
      type: String,
      required: true,
      trim: true,
    },
    resumeFilename: {
      type: String,
      required: true,
      trim: true,
    },
    resumePublicId: {
      type: String,
      trim: true,
    },
    coverLetter: {
      type: String,
      required: true,
      trim: true,
    },
    linkedInUrl: {
      type: String,
      trim: true,
      default: '',
    },
    portfolioUrl: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['PENDING', 'UNDER_REVIEW', 'SELECTED', 'NOT_SELECTED'],
      default: 'PENDING',
      index: true,
    },
    notes: {
      type: String,
      default: '',
    },
    decisionEmailSent: {
      type: Boolean,
      default: false,
    },
    decisionEmailType: {
      type: String,
      enum: ['SELECTED', 'NOT_SELECTED'],
    },
    decisionEmailSentAt: {
      type: Date,
    },
    decisionSentBy: {
      type: String,
      trim: true,
    },
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

JobApplicationSchema.index({ createdAt: -1 });
JobApplicationSchema.index({ email: 1, careerId: 1 });

export const JobApplicationModel = mongoose.model<IJobApplication>('JobApplication', JobApplicationSchema);
export default JobApplicationModel;
