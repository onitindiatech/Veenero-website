import { Request, Response, NextFunction } from 'express';
import { FooterSettingsModel, IFooterSettings } from '../models/FooterSettings';

export async function getOrCreateFooterSettings(): Promise<IFooterSettings> {
  let doc = await FooterSettingsModel.findOne();
  if (!doc) {
    doc = await FooterSettingsModel.create({
      links: {
        solutions: [
          { label: "Veenero Sense", href: "/solutions" },
          { label: "Veenero Intelligence", href: "/solutions" },
          { label: "Veenero Insights", href: "/solutions" },
          { label: "Water Verification", href: "/solutions" },
        ],
        company: [
          { label: "About Veenero", href: "/about" },
          { label: "How the Platform Works", href: "/approach" },
          { label: "Benefits & Outcomes", href: "/impact" },
          { label: "Careers", href: "/careers" },
        ],
        resources: [
          { label: "Case Studies", href: "#" },
          { label: "Blog / Insights", href: "/blog" },
          { label: "White Papers", href: "#" },
          { label: "Contact Us", href: "/contact" },
        ],
      },
      socialLinks: [
        { iconName: "Linkedin", href: "#", label: "LinkedIn" },
        { iconName: "Twitter", href: "#", label: "Twitter" },
        { iconName: "Youtube", href: "#", label: "YouTube" },
        { iconName: "Mail", href: "mailto:udaygedam@veenerosolutions.com", label: "Email" },
      ],
    });
  }
  return doc;
}

export const getPublicFooter = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const settings = await getOrCreateFooterSettings();
    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (err) {
    next(err);
  }
};

export const getAdminFooterSettings = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const settings = await getOrCreateFooterSettings();
    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (err) {
    next(err);
  }
};

export const updateAdminFooterSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const updateData = req.body;
    let doc = await getOrCreateFooterSettings();

    const allowedFields = ['description', 'address', 'mobile', 'email', 'copyrightText', 'googleRating', 'links', 'socialLinks'];
    for (const key of allowedFields) {
      if (updateData[key] !== undefined) {
        (doc as any)[key] = updateData[key];
      }
    }

    doc.updatedBy = (req as any).user?.email || 'admin';
    await doc.save();

    res.status(200).json({
      success: true,
      data: doc,
      message: 'Footer settings updated successfully',
    });
  } catch (err) {
    next(err);
  }
};
