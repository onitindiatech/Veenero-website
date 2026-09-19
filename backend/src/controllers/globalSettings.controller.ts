import { Request, Response, NextFunction } from 'express';
import { GlobalSettingsModel, ISocialLink } from '../models/GlobalSettings';
import { logActivity } from '../services/activityLog.service';

export const DEFAULT_SOCIAL_LINKS: Omit<ISocialLink, '_id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/company/veenero',
    platform: 'linkedin',
    icon: 'linkedin',
    iconSource: 'platform',
    enabled: true,
    order: 0,
    openInNewTab: true,
  },
  {
    name: 'GitHub',
    url: 'https://github.com/veenero',
    platform: 'github',
    icon: 'github',
    iconSource: 'platform',
    enabled: true,
    order: 1,
    openInNewTab: true,
  },
  {
    name: 'Twitter / X',
    url: 'https://twitter.com/veenero',
    platform: 'x',
    icon: 'twitter',
    iconSource: 'platform',
    enabled: true,
    order: 2,
    openInNewTab: true,
  },
  {
    name: 'Email',
    url: 'mailto:info@veenerosolutions.com',
    platform: 'email',
    icon: 'mail',
    iconSource: 'platform',
    enabled: true,
    order: 3,
    openInNewTab: false,
  },
  {
    name: 'WhatsApp',
    url: 'https://wa.me/919346517202',
    platform: 'whatsapp',
    icon: 'whatsapp',
    iconSource: 'platform',
    enabled: true,
    order: 4,
    openInNewTab: true,
  },
];

export async function getOrCreateGlobalSettings() {
  let settings = await GlobalSettingsModel.findOne();
  if (!settings) {
    settings = await GlobalSettingsModel.create({
      socialLinks: DEFAULT_SOCIAL_LINKS,
    });
  } else if (!settings.socialLinks || settings.socialLinks.length === 0) {
    settings.socialLinks = DEFAULT_SOCIAL_LINKS as any;
    await settings.save();
  }
  return settings;
}

/**
 * Validate and sanitize URLs safely without breaking deep links.
 */
function sanitizeUrl(rawUrl: string): string {
  let trimmed = (rawUrl || '').trim();
  if (!trimmed) return '';

  // Block dangerous javascript: or data: schemes
  if (/^(javascript|data|vbscript):/i.test(trimmed)) {
    throw new Error('Invalid URL protocol detected.');
  }

  // Preserve mailto: and tel:
  if (/^(mailto|tel):/i.test(trimmed)) {
    return trimmed;
  }

  // If email address entered without mailto:
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return `mailto:${trimmed}`;
  }

  // Prepend https:// if no scheme is provided
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }

  return trimmed;
}

// ─── GET /api/global-settings (Public) ─────────────────────────────────────────
export const getPublicGlobalSettings = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const settings = await getOrCreateGlobalSettings();
    const sortedLinks = (settings.socialLinks || [])
      .filter((link) => link.enabled)
      .sort((a, b) => a.order - b.order)
      .map((l) => ({
        _id: l._id,
        name: l.name,
        url: l.url,
        platform: l.platform,
        icon: l.icon,
        iconSource: l.iconSource,
        order: l.order,
        openInNewTab: l.openInNewTab,
      }));

    res.status(200).json({
      success: true,
      data: {
        general: settings.general,
        brand: settings.brand,
        contact: settings.contact,
        social: settings.social,
        socialLinks: sortedLinks,
        behavior: {
          maintenanceMode: settings.behavior.maintenanceMode,
          cookieConsentEnabled: settings.behavior.cookieConsentEnabled,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/global-settings/social-links (Public) ───────────────────────────
export const getPublicSocialLinks = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const settings = await getOrCreateGlobalSettings();
    const publicLinks = (settings.socialLinks || [])
      .filter((link) => link.enabled)
      .sort((a, b) => a.order - b.order)
      .map((l) => ({
        _id: l._id,
        name: l.name,
        url: l.url,
        platform: l.platform,
        icon: l.icon,
        iconSource: l.iconSource,
        order: l.order,
        openInNewTab: l.openInNewTab,
      }));

    res.status(200).json({
      success: true,
      data: publicLinks,
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/admin/global-settings (Admin) ───────────────────────────────────
export const getAdminGlobalSettings = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const settings = await getOrCreateGlobalSettings();
    // Sort social links by order ascending
    if (settings.socialLinks && settings.socialLinks.length > 0) {
      settings.socialLinks.sort((a, b) => a.order - b.order);
    }
    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

// ─── PUT /api/admin/global-settings (Admin) ───────────────────────────────────
export const updateAdminGlobalSettings = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const settings = await getOrCreateGlobalSettings();
    const { general, brand, contact, social, behavior, socialLinks } = req.body;

    if (general && typeof general === 'object') {
      settings.general = { ...settings.general, ...general };
    }
    if (brand && typeof brand === 'object') {
      settings.brand = { ...settings.brand, ...brand };
    }
    if (contact && typeof contact === 'object') {
      settings.contact = { ...settings.contact, ...contact };
    }
    if (social && typeof social === 'object') {
      settings.social = { ...settings.social, ...social };
    }
    if (behavior && typeof behavior === 'object') {
      settings.behavior = { ...settings.behavior, ...behavior };
    }
    if (Array.isArray(socialLinks)) {
      settings.socialLinks = socialLinks as any;
    }

    settings.updatedBy = (req as any).user?.email || 'admin';
    await settings.save();

    await logActivity({
      req,
      action: 'SETTINGS_UPDATED',
      module: 'Global Settings',
      entity: 'Global Website Settings',
      description: 'Updated global site configuration and social links',
      metadata: { general: settings.general, contact: settings.contact },
    });

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/admin/global-settings/social-links (Admin) ──────────────────────
export const getAdminSocialLinks = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const settings = await getOrCreateGlobalSettings();
    const sorted = [...(settings.socialLinks || [])].sort((a, b) => a.order - b.order);
    res.status(200).json({
      success: true,
      data: sorted,
    });
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/admin/global-settings/social-links (Admin) ─────────────────────
export const createAdminSocialLink = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, url, platform, icon, iconSource, enabled, order, openInNewTab } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      res.status(400).json({ success: false, message: 'Link name is required.' });
      return;
    }

    if (!url || typeof url !== 'string' || !url.trim()) {
      res.status(400).json({ success: false, message: 'Link URL is required.' });
      return;
    }

    const cleanUrl = sanitizeUrl(url);
    const settings = await getOrCreateGlobalSettings();

    // Determine max order
    const currentMaxOrder = settings.socialLinks.reduce(
      (max, item) => (item.order > max ? item.order : max),
      -1
    );
    const calculatedOrder = typeof order === 'number' ? order : currentMaxOrder + 1;

    const newLink = {
      name: name.trim(),
      url: cleanUrl,
      platform: (platform || 'custom').trim().toLowerCase(),
      icon: (icon || '').trim(),
      iconSource: iconSource || 'platform',
      enabled: enabled !== undefined ? Boolean(enabled) : true,
      order: calculatedOrder,
      openInNewTab: openInNewTab !== undefined ? Boolean(openInNewTab) : true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    settings.socialLinks.push(newLink as any);
    settings.updatedBy = (req as any).user?.email || 'admin';
    await settings.save();

    const created = settings.socialLinks[settings.socialLinks.length - 1];

    await logActivity({
      req,
      action: 'CREATE',
      module: 'Global Settings',
      entity: 'Social Link',
      description: `Added new social/contact link: ${name}`,
      metadata: { linkId: created._id, name, url: cleanUrl },
    });

    res.status(201).json({
      success: true,
      message: 'Social link created successfully.',
      data: created,
    });
  } catch (error: any) {
    if (error.message === 'Invalid URL protocol detected.') {
      res.status(400).json({ success: false, message: error.message });
      return;
    }
    next(error);
  }
};

// ─── PUT /api/admin/global-settings/social-links/:id (Admin) ──────────────────
export const updateAdminSocialLink = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, url, platform, icon, iconSource, enabled, order, openInNewTab } = req.body;

    const settings = await getOrCreateGlobalSettings();
    const link = settings.socialLinks.find((l: any) => String(l._id) === String(id));

    if (!link) {
      res.status(404).json({ success: false, message: 'Social link not found.' });
      return;
    }

    if (name !== undefined) {
      if (!name.trim()) {
        res.status(400).json({ success: false, message: 'Link name cannot be empty.' });
        return;
      }
      link.name = name.trim();
    }

    if (url !== undefined) {
      link.url = sanitizeUrl(url);
    }

    if (platform !== undefined) {
      link.platform = platform.trim().toLowerCase();
    }

    if (icon !== undefined) {
      link.icon = (icon || '').trim();
    }

    if (iconSource !== undefined) {
      link.iconSource = iconSource;
    }

    if (enabled !== undefined) {
      link.enabled = Boolean(enabled);
    }

    if (order !== undefined) {
      link.order = Number(order);
    }

    if (openInNewTab !== undefined) {
      link.openInNewTab = Boolean(openInNewTab);
    }

    link.updatedAt = new Date();
    settings.updatedBy = (req as any).user?.email || 'admin';
    await settings.save();

    await logActivity({
      req,
      action: 'UPDATE',
      module: 'Global Settings',
      entity: 'Social Link',
      description: `Updated social/contact link: ${link.name}`,
      metadata: { linkId: id, name: link.name },
    });

    res.status(200).json({
      success: true,
      message: 'Social link updated successfully.',
      data: link,
    });
  } catch (error: any) {
    if (error.message === 'Invalid URL protocol detected.') {
      res.status(400).json({ success: false, message: error.message });
      return;
    }
    next(error);
  }
};

// ─── DELETE /api/admin/global-settings/social-links/:id (Admin) ───────────────
export const deleteAdminSocialLink = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const settings = await getOrCreateGlobalSettings();
    const link = settings.socialLinks.find((l: any) => String(l._id) === String(id));

    if (!link) {
      res.status(404).json({ success: false, message: 'Social link not found.' });
      return;
    }

    const linkName = link.name;
    settings.socialLinks = settings.socialLinks.filter(
      (l: any) => String(l._id) !== String(id)
    ) as any;
    settings.updatedBy = (req as any).user?.email || 'admin';
    await settings.save();

    await logActivity({
      req,
      action: 'DELETE',
      module: 'Global Settings',
      entity: 'Social Link',
      description: `Deleted social/contact link: ${linkName}`,
      metadata: { linkId: id, name: linkName },
    });

    res.status(200).json({
      success: true,
      message: 'Social link deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// ─── PATCH /api/admin/global-settings/social-links/reorder (Admin) ───────────
export const reorderAdminSocialLinks = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { orderedIds } = req.body;

    if (!Array.isArray(orderedIds)) {
      res.status(400).json({ success: false, message: 'orderedIds array is required.' });
      return;
    }

    const settings = await getOrCreateGlobalSettings();

    orderedIds.forEach((id: string, index: number) => {
      const item = settings.socialLinks.find((l: any) => String(l._id) === String(id));
      if (item) {
        item.order = index;
      }
    });

    settings.updatedBy = (req as any).user?.email || 'admin';
    await settings.save();

    const sorted = [...settings.socialLinks].sort((a, b) => a.order - b.order);

    await logActivity({
      req,
      action: 'REORDER',
      module: 'Global Settings',
      entity: 'Social Links',
      description: 'Reordered footer social and contact links',
      metadata: { orderedIds },
    });

    res.status(200).json({
      success: true,
      message: 'Social links reordered successfully.',
      data: sorted,
    });
  } catch (error) {
    next(error);
  }
};

// ─── PATCH /api/admin/global-settings/social-links/:id/toggle (Admin) ─────────
export const toggleAdminSocialLink = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const settings = await getOrCreateGlobalSettings();
    const link = settings.socialLinks.find((l: any) => String(l._id) === String(id));

    if (!link) {
      res.status(404).json({ success: false, message: 'Social link not found.' });
      return;
    }

    link.enabled = req.body.enabled !== undefined ? Boolean(req.body.enabled) : !link.enabled;
    link.updatedAt = new Date();
    settings.updatedBy = (req as any).user?.email || 'admin';
    await settings.save();

    await logActivity({
      req,
      action: 'TOGGLE',
      module: 'Global Settings',
      entity: 'Social Link',
      description: `${link.enabled ? 'Enabled' : 'Disabled'} social link: ${link.name}`,
      metadata: { linkId: id, enabled: link.enabled },
    });

    res.status(200).json({
      success: true,
      message: `Social link ${link.enabled ? 'enabled' : 'disabled'} successfully.`,
      data: link,
    });
  } catch (error) {
    next(error);
  }
};
