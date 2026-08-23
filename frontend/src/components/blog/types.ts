// ─── Article / BlogPost public type ───────────────────────────────────────────
export interface Article {
  _id?: string;
  id?: string; // kept for backwards compat with any remaining mock refs
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  featuredImageAlt?: string;
  /** @deprecated use featuredImage */
  image?: string;
  author: string;
  readingTime?: string;
  date?: string;
  publishedAt?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'TRASHED';
  previousStatus?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  featured?: boolean;
  sortOrder?: number;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
    noIndex?: boolean;
  };
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

// ─── Insight stat (for BlogLandingSettings) ───────────────────────────────────
export interface InsightStat {
  value: string;
  label: string;
  description?: string;
}

// ─── Blog Landing Settings type ───────────────────────────────────────────────
export interface BlogSettings {
  _id?: string;
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    image: string;
    imageAlt: string;
  };
  featuredSection: {
    eyebrow: string;
    title: string;
    description: string;
  };
  insightStats: InsightStat[];
  editorialQuote: {
    eyebrow: string;
    title: string;
    description: string;
  };
  cta: {
    eyebrow: string;
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
    noIndex?: boolean;
  };
  isPublished?: boolean;
  updatedAt?: string;
}

// ─── Admin stats ──────────────────────────────────────────────────────────────
export interface BlogStats {
  total: number;
  published: number;
  drafts: number;
  archived: number;
  featured: number;
}

// ─── Admin Blog Post form data ────────────────────────────────────────────────
export interface BlogPostFormData {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  featuredImageAlt: string;
  author: string;
  readingTime: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'TRASHED';
  featured: boolean;
  sortOrder: number;
  seo: {
    metaTitle: string;
    metaDescription: string;
    ogImage: string;
    noIndex: boolean;
  };
}
