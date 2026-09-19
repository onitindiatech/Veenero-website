import mongoose, { Schema, Document } from 'mongoose';

export interface IActivityLog extends Document {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  action: string;
  module: string;
  entity?: string;
  entityId?: string;
  description: string;
  metadata?: Record<string, any>;
  ip?: string;
  userAgent?: string;
  createdAt: Date;
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    user: {
      id: { type: String, required: true },
      name: { type: String, required: true },
      email: { type: String, required: true },
      role: { type: String, required: true },
    },
    action: {
      type: String,
      required: true,
      index: true,
    },
    module: {
      type: String,
      required: true,
      index: true,
    },
    entity: { type: String, default: '' },
    entityId: { type: String, default: '' },
    description: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed, default: {} },
    ip: { type: String, default: '' },
    userAgent: { type: String, default: '' },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: {
      transform: (_, ret: any) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

ActivityLogSchema.index({ createdAt: -1 });
ActivityLogSchema.index({ module: 1, action: 1 });

export const ActivityLogModel = mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);
