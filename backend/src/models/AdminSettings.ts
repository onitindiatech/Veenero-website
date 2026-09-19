import mongoose, { Document, Schema } from 'mongoose';

export interface IAdminSettings extends Document {
  maintenanceMode: {
    enabled: boolean;
    message: string;
  };
  security: {
    sessionTimeoutMinutes: number;
    maxLoginAttempts: number;
  };
  notifications: {
    adminAlertEmail: string;
    emailOnNewLead: boolean;
    emailOnNewJobApp: boolean;
  };
  system: {
    enableContactForm: boolean;
    enableJobApplications: boolean;
    maxUploadSizeMb: number;
  };
  updatedAt: Date;
}

const AdminSettingsSchema = new Schema<IAdminSettings>(
  {
    maintenanceMode: {
      enabled: { type: Boolean, default: false },
      message: { type: String, default: 'Veenero is currently undergoing scheduled infrastructure upgrades. Please check back shortly.' },
    },
    security: {
      sessionTimeoutMinutes: { type: Number, default: 480 },
      maxLoginAttempts: { type: Number, default: 5 },
    },
    notifications: {
      adminAlertEmail: { type: String, default: 'admin@veenero.com' },
      emailOnNewLead: { type: Boolean, default: true },
      emailOnNewJobApp: { type: Boolean, default: true },
    },
    system: {
      enableContactForm: { type: Boolean, default: true },
      enableJobApplications: { type: Boolean, default: true },
      maxUploadSizeMb: { type: Number, default: 10 },
    },
  },
  { timestamps: true }
);

export const AdminSettingsModel = mongoose.model<IAdminSettings>('AdminSettings', AdminSettingsSchema);
