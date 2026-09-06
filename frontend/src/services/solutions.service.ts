// frontend/src/services/solutions.service.ts
// Public client service for /solutions page

export interface PublicSolutionCategory {
  _id?: string;
  id?: string;
  key: string;
  displayLabel: string;
  slug: string;
  description: string;
  icon: string;
  image: string;
  mediaPublicId?: string;
  pillarKeys: string[];
  order: number;
  isActive: boolean;
}

export interface PublicSolutionItem {
  _id?: string;
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  categoryKey: string;
  pillar: string;
  icon: string;
  image?: string;
  mediaPublicId?: string;
  features: string[];
  metrics?: {
    value: string;
    label: string;
  };
  order: number;
  isActive: boolean;
}

export interface PublicSolutionsHero {
  visible: boolean;
  eyebrow: string;
  title: string;
  highlightedText: string;
  description: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  image: string;
  imageAlt: string;
  mediaPublicId?: string;
  badges?: Array<{
    icon: string;
    label1: string;
    label2: string;
  }>;
  statsWidgets?: {
    flowRate: {
      title: string;
      value: string;
      unit: string;
      trend: string;
    };
    systemHealth: {
      title: string;
      value: string;
      status: string;
    };
    activeAlerts: {
      title: string;
      count: string;
      ctaText: string;
      ctaLink: string;
    };
  };
}

export interface PublicSolutionsIntro {
  visible: boolean;
  eyebrow: string;
  title: string;
  highlightedText: string;
  paragraphs: string[];
  image: string;
  mediaPublicId?: string;
  badges: Array<{
    icon: string;
    label: string;
  }>;
}

export interface PublicSolutionsGridHeader {
  eyebrow: string;
  title: string;
  description: string;
  calloutCard: {
    title: string;
    subtitle: string;
    description: string;
    ctaText: string;
    ctaLink: string;
    image: string;
    mediaPublicId?: string;
  };
}

export interface PublicFeaturedSolutionSection {
  visible: boolean;
  eyebrow: string;
  title: string;
  highlightedText: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  image: string;
  mediaPublicId?: string;
  videoUrl?: string;
  capabilities: Array<{
    title: string;
    desc: string;
  }>;
}

export interface PublicWaterIntelligenceFlow {
  visible: boolean;
  eyebrow: string;
  title: string;
  description: string;
  stages: Array<{
    number: string;
    icon: string;
    title: string;
    description: string;
  }>;
  layers: Array<{
    number: string;
    title: string;
    subtitle: string;
    description: string;
    icon: string;
    capabilities: string[];
  }>;
}

export interface PublicSolutionsCTA {
  visible: boolean;
  eyebrow: string;
  title: string;
  highlightedText: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
}

export interface PublicSolutionsSEO {
  metaTitle: string;
  metaDescription: string;
}

export interface PublicSolutionsData {
  hero: PublicSolutionsHero;
  intro: PublicSolutionsIntro;
  gridHeader: PublicSolutionsGridHeader;
  categories: PublicSolutionCategory[];
  solutions: PublicSolutionItem[];
  featuredSolution: PublicFeaturedSolutionSection;
  flow: PublicWaterIntelligenceFlow;
  cta: PublicSolutionsCTA;
  seo: PublicSolutionsSEO;
  isPublished: boolean;
  updatedAt?: string;
}

const API_BASE = import.meta.env.VITE_API_URL
  ? (import.meta.env.VITE_API_URL.endsWith('/api')
      ? import.meta.env.VITE_API_URL
      : `${import.meta.env.VITE_API_URL}/api`)
  : 'http://localhost:4000/api';

export const getPublicSolutionsContent = async (): Promise<PublicSolutionsData> => {
  const res = await fetch(`${API_BASE}/solutions`);
  if (!res.ok) {
    throw new Error('Failed to fetch Solutions page content.');
  }
  const json = await res.json();
  if (!json.success || !json.data) {
    throw new Error(json.error?.message || 'Invalid API response for Solutions page.');
  }
  return json.data;
};
