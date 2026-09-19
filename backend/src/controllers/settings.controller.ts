import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { AdminSettingsModel } from '../models/AdminSettings';
import { config } from '../config/env';
import { logActivity } from '../services/activityLog.service';

// ─── GET /api/admin/settings ─────────────────────────────────────────────────
export const getAdminSettings = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let settings = await AdminSettingsModel.findOne();
    if (!settings) {
      settings = await AdminSettingsModel.create({});
    }

    const memoryUsage = process.memoryUsage();
    const uptimeSeconds = Math.floor(process.uptime());

    const diagnostics = {
      serverTime: new Date(),
      uptimeSeconds,
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      environment: config.nodeEnv,
      memory: {
        rssMb: Math.round(memoryUsage.rss / 1024 / 1024),
        heapUsedMb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        heapTotalMb: Math.round(memoryUsage.heapTotal / 1024 / 1024),
      },
      database: {
        status: mongoose.connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED',
        name: mongoose.connection.name,
        host: mongoose.connection.host,
      },
      storage: {
        provider: 'Cloudinary',
        cloudName: config.cloudinaryCloudName ? config.cloudinaryCloudName : 'Not Configured',
        configured: Boolean(config.cloudinaryCloudName && config.cloudinaryApiKey),
      },
    };

    res.status(200).json({
      success: true,
      data: {
        settings,
        diagnostics,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── PUT /api/admin/settings ─────────────────────────────────────────────────
export const updateAdminSettings = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { maintenanceMode, security, notifications, system } = req.body;

    let settings = await AdminSettingsModel.findOne();
    if (!settings) {
      settings = new AdminSettingsModel();
    }

    if (maintenanceMode) {
      settings.maintenanceMode = {
        enabled: Boolean(maintenanceMode.enabled),
        message: maintenanceMode.message || settings.maintenanceMode.message,
      };
    }

    if (security) {
      settings.security = {
        sessionTimeoutMinutes: Number(security.sessionTimeoutMinutes) || settings.security.sessionTimeoutMinutes,
        maxLoginAttempts: Number(security.maxLoginAttempts) || settings.security.maxLoginAttempts,
      };
    }

    if (notifications) {
      settings.notifications = {
        adminAlertEmail: notifications.adminAlertEmail || settings.notifications.adminAlertEmail,
        emailOnNewLead: typeof notifications.emailOnNewLead === 'boolean' ? notifications.emailOnNewLead : settings.notifications.emailOnNewLead,
        emailOnNewJobApp: typeof notifications.emailOnNewJobApp === 'boolean' ? notifications.emailOnNewJobApp : settings.notifications.emailOnNewJobApp,
      };
    }

    if (system) {
      settings.system = {
        enableContactForm: typeof system.enableContactForm === 'boolean' ? system.enableContactForm : settings.system.enableContactForm,
        enableJobApplications: typeof system.enableJobApplications === 'boolean' ? system.enableJobApplications : settings.system.enableJobApplications,
        maxUploadSizeMb: Number(system.maxUploadSizeMb) || settings.system.maxUploadSizeMb,
      };
    }

    await settings.save();

    await logActivity({
      req,
      action: 'UPDATE',
      module: 'SETTINGS',
      entity: 'Platform Settings',
      description: 'Updated system settings and security controls',
      metadata: { maintenanceMode: settings.maintenanceMode, system: settings.system },
    });

    res.status(200).json({
      success: true,
      message: 'System settings updated successfully.',
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};
