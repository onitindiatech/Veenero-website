// ─── CMS Types ────────────────────────────────────────────────────────────────
// Central TypeScript interfaces for the Veenero CMS module.
// Used by mock data, components, and future API integration.

export type PageStatus = 'published' | 'draft';

export type SeoStatus = 'good' | 'needs-work' | 'poor';

export interface CmsPageSection {
  id: string;
  name: string;
  type: 'hero' | 'content' | 'gallery' | 'testimonials' | 'cta' | 'custom';
  visible: boolean;
}

export interface CmsPage {
  id: string;
  name: string;
  slug: string;
  status: PageStatus;
  featuredImage: string | null;
  seoMetaTitle: string;
  seoMetaDescription: string;
  seoStatus: SeoStatus;
  lastUpdated: string;       // ISO 8601 date string
  updatedBy: string;         // User display name
  sections: CmsPageSection[];
  isCoreSystemPage: boolean; // Core pages cannot be deleted
}

// ─── Editor Form State ────────────────────────────────────────────────────────
// Used by PageEditorDrawer form state — partial shape for the editor form

export interface CmsPageFormValues {
  name: string;
  slug: string;
  status: PageStatus;
  featuredImage: string;
  seoMetaTitle: string;
  seoMetaDescription: string;
}
