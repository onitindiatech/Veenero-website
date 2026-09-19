import { Request, Response, NextFunction } from 'express';
import { HomePageSettingsModel } from '../models/HomePageSettings';
import { AboutPageSettingsModel } from '../models/AboutPageSettings';
import { SolutionsPageSettings } from '../models/SolutionsPageSettings';
import { ApproachPageSettingsModel } from '../models/ApproachPageSettings';
import { ImpactPageSettingsModel } from '../models/ImpactPageSettings';
import { ContactPageSettingsModel } from '../models/ContactPageSettings';
import { CareerPageSettingsModel } from '../models/CareerPageSettings';
import { BlogLandingSettingsModel } from '../models/BlogLandingSettings';
import { SolutionDetailModel } from '../models/SolutionDetail';
import { logActivity } from '../services/activityLog.service';

export interface UnifiedSeoItem {
  pageKey: string;
  pageName: string;
  route: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  keywords?: string[];
  updatedAt?: Date;
  status: 'OPTIMIZED' | 'NEEDS_ATTENTION' | 'DEFAULT';
}

function calculateSeoStatus(title?: string, desc?: string): 'OPTIMIZED' | 'NEEDS_ATTENTION' | 'DEFAULT' {
  if (!title || !desc) return 'NEEDS_ATTENTION';
  if (title.length >= 30 && title.length <= 70 && desc.length >= 70 && desc.length <= 170) {
    return 'OPTIMIZED';
  }
  return 'DEFAULT';
}

// GET /api/admin/seo
export const listAllPagesSeo = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const [
      home,
      about,
      solutions,
      approach,
      impact,
      contact,
      careers,
      blog,
      solutionDetails,
    ] = await Promise.all([
      HomePageSettingsModel.findOne().lean(),
      AboutPageSettingsModel.findOne().lean(),
      SolutionsPageSettings.findOne().lean(),
      ApproachPageSettingsModel.findOne().lean(),
      ImpactPageSettingsModel.findOne().lean(),
      ContactPageSettingsModel.findOne().lean(),
      CareerPageSettingsModel.findOne().lean(),
      BlogLandingSettingsModel.findOne().lean(),
      SolutionDetailModel.find({ isPublished: true }).lean(),
    ]);

    const pages: UnifiedSeoItem[] = [
      {
        pageKey: 'home',
        pageName: 'Homepage',
        route: '/',
        metaTitle: (home?.seo as any)?.metaTitle || 'Veenero | Technology-Driven Water Conservation',
        metaDescription: (home?.seo as any)?.metaDescription || 'Smart water metering, automated valve telemetry, and water intelligence for enterprise and municipal networks.',
        ogImage: (home?.seo as any)?.ogImage || '',
        updatedAt: (home as any)?.updatedAt,
        status: calculateSeoStatus((home?.seo as any)?.metaTitle, (home?.seo as any)?.metaDescription),
      },
      {
        pageKey: 'about',
        pageName: 'About Us',
        route: '/about',
        metaTitle: (about?.seo as any)?.metaTitle || 'About Veenero | Sustainable Water Solutions',
        metaDescription: (about?.seo as any)?.metaDescription || 'Our mission, origins, and team engineering India’s foundational water intelligence network.',
        canonicalUrl: (about?.seo as any)?.canonicalUrl || '',
        ogTitle: (about?.seo as any)?.ogTitle || '',
        ogDescription: (about?.seo as any)?.ogDescription || '',
        ogImage: (about?.seo as any)?.ogImage || '',
        noIndex: (about?.seo as any)?.noIndex || false,
        updatedAt: (about as any)?.updatedAt,
        status: calculateSeoStatus((about?.seo as any)?.metaTitle, (about?.seo as any)?.metaDescription),
      },
      {
        pageKey: 'solutions',
        pageName: 'Solutions Overview',
        route: '/solutions',
        metaTitle: (solutions?.seo as any)?.metaTitle || 'Solutions | Enterprise Water Infrastructure',
        metaDescription: (solutions?.seo as any)?.metaDescription || 'Explore our integrated hardware and telemetry solutions for non-revenue water and automated distribution.',
        updatedAt: (solutions as any)?.updatedAt,
        status: calculateSeoStatus((solutions?.seo as any)?.metaTitle, (solutions?.seo as any)?.metaDescription),
      },
      {
        pageKey: 'approach',
        pageName: 'Our Approach',
        route: '/approach',
        metaTitle: (approach?.seo as any)?.metaTitle || 'Our Approach | Dual-Engine Water Intelligence',
        metaDescription: (approach?.seo as any)?.metaDescription || 'How Veenero combines edge IoT hardware with cloud telemetry for verification and conservation.',
        ogTitle: (approach?.seo as any)?.ogTitle || '',
        ogDescription: (approach?.seo as any)?.ogDescription || '',
        ogImage: (approach?.seo as any)?.ogImage || '',
        updatedAt: (approach as any)?.updatedAt,
        status: calculateSeoStatus((approach?.seo as any)?.metaTitle, (approach?.seo as any)?.metaDescription),
      },
      {
        pageKey: 'impact',
        pageName: 'Impact & ESG',
        route: '/impact',
        metaTitle: (impact?.seo as any)?.metaTitle || 'Impact | Measurable Water Conservation & ESG',
        metaDescription: (impact?.seo as any)?.metaDescription || 'Quantified water savings, ESG metrics, and audit-ready sustainability data for industrial facilities.',
        ogImage: (impact?.seo as any)?.ogImage || '',
        updatedAt: (impact as any)?.updatedAt,
        status: calculateSeoStatus((impact?.seo as any)?.metaTitle, (impact?.seo as any)?.metaDescription),
      },
      {
        pageKey: 'careers',
        pageName: 'Careers',
        route: '/careers',
        metaTitle: (careers?.seo as any)?.metaTitle || 'Careers | Build the Future of Water Intelligence',
        metaDescription: (careers?.seo as any)?.metaDescription || 'Join Veenero engineering, telemetry, and field operations teams solving water sustainability.',
        ogImage: (careers?.seo as any)?.ogImage || '',
        updatedAt: (careers as any)?.updatedAt,
        status: calculateSeoStatus((careers?.seo as any)?.metaTitle, (careers?.seo as any)?.metaDescription),
      },
      {
        pageKey: 'blog',
        pageName: 'Blog / Insights',
        route: '/blog',
        metaTitle: (blog?.seo as any)?.metaTitle || 'Veenero Insights | Water Industry Analysis',
        metaDescription: (blog?.seo as any)?.metaDescription || 'Technical articles, industry audits, and thought leadership in water conservation.',
        ogImage: (blog?.seo as any)?.ogImage || '',
        updatedAt: (blog as any)?.updatedAt,
        status: calculateSeoStatus((blog?.seo as any)?.metaTitle, (blog?.seo as any)?.metaDescription),
      },
      {
        pageKey: 'contact',
        pageName: 'Contact Us',
        route: '/contact',
        metaTitle: (contact?.seo as any)?.metaTitle || 'Contact Veenero | Water Intelligence Network',
        metaDescription: (contact?.seo as any)?.metaDescription || 'Schedule a live facility pilot or request technical telemetry specifications.',
        ogImage: (contact?.seo as any)?.ogImage || '',
        updatedAt: (contact as any)?.updatedAt,
        status: calculateSeoStatus((contact?.seo as any)?.metaTitle, (contact?.seo as any)?.metaDescription),
      },
    ];

    // Append individual Solution Details
    for (const sd of solutionDetails) {
      pages.push({
        pageKey: `solution_${sd.slug}`,
        pageName: `Solution: ${sd.title}`,
        route: `/solutions/${sd.slug}`,
        metaTitle: (sd as any).seo?.metaTitle || `${sd.title} | Veenero Water Solutions`,
        metaDescription: (sd as any).seo?.metaDescription || (sd as any).overview?.description || (sd as any).hero?.description || '',
        ogImage: (sd as any).seo?.ogImage || '',
        updatedAt: (sd as any).updatedAt,
        status: calculateSeoStatus((sd as any).seo?.metaTitle, (sd as any).seo?.metaDescription),
      });
    }

    res.status(200).json({
      success: true,
      data: pages,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/seo/:pageKey
export const updatePageSeo = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const rawPageKey = req.params.pageKey;
    const pageKey = Array.isArray(rawPageKey) ? rawPageKey[0] ?? '' : rawPageKey ?? '';
    const { metaTitle, metaDescription, canonicalUrl, ogTitle, ogDescription, ogImage, noIndex, keywords } = req.body;

    const seoPatch: Record<string, any> = {
      metaTitle: typeof metaTitle === 'string' ? metaTitle.trim() : undefined,
      metaDescription: typeof metaDescription === 'string' ? metaDescription.trim() : undefined,
      canonicalUrl: typeof canonicalUrl === 'string' ? canonicalUrl.trim() : undefined,
      ogTitle: typeof ogTitle === 'string' ? ogTitle.trim() : undefined,
      ogDescription: typeof ogDescription === 'string' ? ogDescription.trim() : undefined,
      ogImage: typeof ogImage === 'string' ? ogImage.trim() : undefined,
      noIndex: typeof noIndex === 'boolean' ? noIndex : undefined,
      keywords: Array.isArray(keywords) ? keywords : undefined,
    };

    // Remove undefined values
    Object.keys(seoPatch).forEach((k) => seoPatch[k] === undefined && delete seoPatch[k]);

    let targetDoc: any = null;

    if (pageKey === 'home') {
      targetDoc = await HomePageSettingsModel.findOne();
      if (targetDoc) targetDoc.seo = { ...targetDoc.seo, ...seoPatch };
    } else if (pageKey === 'about') {
      targetDoc = await AboutPageSettingsModel.findOne();
      if (targetDoc) targetDoc.seo = { ...targetDoc.seo, ...seoPatch };
    } else if (pageKey === 'solutions') {
      targetDoc = await SolutionsPageSettings.findOne();
      if (targetDoc) targetDoc.seo = { ...targetDoc.seo, ...seoPatch };
    } else if (pageKey === 'approach') {
      targetDoc = await ApproachPageSettingsModel.findOne();
      if (targetDoc) targetDoc.seo = { ...targetDoc.seo, ...seoPatch };
    } else if (pageKey === 'impact') {
      targetDoc = await ImpactPageSettingsModel.findOne();
      if (targetDoc) targetDoc.seo = { ...targetDoc.seo, ...seoPatch };
    } else if (pageKey === 'careers') {
      targetDoc = await CareerPageSettingsModel.findOne();
      if (targetDoc) targetDoc.seo = { ...targetDoc.seo, ...seoPatch };
    } else if (pageKey === 'blog') {
      targetDoc = await BlogLandingSettingsModel.findOne();
      if (targetDoc) targetDoc.seo = { ...targetDoc.seo, ...seoPatch };
    } else if (pageKey === 'contact') {
      targetDoc = await ContactPageSettingsModel.findOne();
      if (targetDoc) targetDoc.seo = { ...targetDoc.seo, ...seoPatch };
    } else if (pageKey.startsWith('solution_')) {
      const slug = pageKey.replace('solution_', '');
      targetDoc = await SolutionDetailModel.findOne({ slug });
      if (targetDoc) targetDoc.seo = { ...targetDoc.seo, ...seoPatch };
    }

    if (!targetDoc) {
      res.status(404).json({ success: false, message: `Page '${pageKey}' not found.` });
      return;
    }

    await targetDoc.save();

    await logActivity({
      req,
      action: 'UPDATE',
      module: 'SEO',
      entity: `Page: ${pageKey}`,
      description: `Updated SEO meta tags for ${pageKey}`,
      metadata: seoPatch,
    });

    res.status(200).json({
      success: true,
      data: {
        pageKey,
        seo: targetDoc.seo,
      },
    });
  } catch (error) {
    next(error);
  }
};
