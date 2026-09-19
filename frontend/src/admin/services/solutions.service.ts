// frontend/src/admin/services/solutions.service.ts
// Admin API service for Solutions Page CMS

export interface AdminSolutionCategory {
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

export interface AdminSolutionItem {
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

export interface AdminSolutionsHero {
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

export interface AdminSolutionsIntro {
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

export interface AdminSolutionsGridHeader {
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

export interface AdminFeaturedSolutionSection {
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

export interface AdminWaterIntelligenceFlow {
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

export interface AdminSolutionsCTA {
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

export interface AdminSolutionsSEO {
  metaTitle: string;
  metaDescription: string;
}

export interface SolutionsPageSettings {
  _id?: string;
  id?: string;
  hero: AdminSolutionsHero;
  intro: AdminSolutionsIntro;
  gridHeader: AdminSolutionsGridHeader;
  categories: AdminSolutionCategory[];
  solutions: AdminSolutionItem[];
  featuredSolution: AdminFeaturedSolutionSection;
  flow: AdminWaterIntelligenceFlow;
  cta: AdminSolutionsCTA;
  seo: AdminSolutionsSEO;
  isPublished: boolean;
  lastUpdatedBy?: string;
  updatedAt?: string;
}

import { API_BASE_URL } from '@/config/api';

const API_BASE = `${API_BASE_URL}/api`;

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(endpoint, {
    ...options,
    headers,
    credentials: 'include',
  });

  const json = await res.json();

  if (!res.ok) {
    const errorMsg = json?.error?.message || json?.message || `Request failed with status ${res.status}`;
    throw new Error(errorMsg);
  }

  return json as T;
}

export async function getAdminSolutionsSettings(): Promise<SolutionsPageSettings> {
  const res = await apiFetch<{ success: boolean; data: SolutionsPageSettings }>(
    `${API_BASE}/admin/solutions`
  );
  return res.data;
}

import { clearSolutionsCache } from '@/services/solutions.service';

export async function updateAdminSolutionsSettings(
  data: Partial<SolutionsPageSettings>
): Promise<SolutionsPageSettings> {
  const res = await apiFetch<{ success: boolean; data: SolutionsPageSettings }>(
    `${API_BASE}/admin/solutions`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    }
  );
  clearSolutionsCache();
  return res.data;
}

export async function getAdminSolutionsSection<T = any>(section: string): Promise<T> {
  const res = await apiFetch<{ success: boolean; data: T }>(
    `${API_BASE}/admin/solutions/sections/${section}`
  );
  return res.data;
}

export async function updateAdminSolutionsSection<T = any>(
  section: string,
  sectionData: any
): Promise<T> {
  const res = await apiFetch<{ success: boolean; data: T }>(
    `${API_BASE}/admin/solutions/sections/${section}`,
    {
      method: 'PUT',
      body: JSON.stringify(sectionData),
    }
  );
  clearSolutionsCache();
  return res.data;
}

export async function createCategory(category: Partial<AdminSolutionCategory>): Promise<AdminSolutionCategory> {
  const res = await apiFetch<{ success: boolean; data: AdminSolutionCategory }>(
    `${API_BASE}/admin/solutions/categories`,
    {
      method: 'POST',
      body: JSON.stringify(category),
    }
  );
  clearSolutionsCache();
  return res.data;
}

export async function updateCategory(id: string, category: Partial<AdminSolutionCategory>): Promise<AdminSolutionCategory> {
  const res = await apiFetch<{ success: boolean; data: AdminSolutionCategory }>(
    `${API_BASE}/admin/solutions/categories/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(category),
    }
  );
  clearSolutionsCache();
  return res.data;
}

export async function deleteCategory(id: string): Promise<void> {
  await apiFetch<{ success: boolean }>(
    `${API_BASE}/admin/solutions/categories/${id}`,
    {
      method: 'DELETE',
    }
  );
  clearSolutionsCache();
}

export async function createSolutionItem(solution: Partial<AdminSolutionItem>): Promise<AdminSolutionItem> {
  const res = await apiFetch<{ success: boolean; data: AdminSolutionItem }>(
    `${API_BASE}/admin/solutions/items`,
    {
      method: 'POST',
      body: JSON.stringify(solution),
    }
  );
  clearSolutionsCache();
  return res.data;
}

export async function updateSolutionItem(id: string, solution: Partial<AdminSolutionItem>): Promise<AdminSolutionItem> {
  const res = await apiFetch<{ success: boolean; data: AdminSolutionItem }>(
    `${API_BASE}/admin/solutions/items/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(solution),
    }
  );
  clearSolutionsCache();
  return res.data;
}

export async function deleteSolutionItem(id: string): Promise<void> {
  await apiFetch<{ success: boolean }>(
    `${API_BASE}/admin/solutions/items/${id}`,
    {
      method: 'DELETE',
    }
  );
  clearSolutionsCache();
}

// ─── Complete Solution Detail CMS Types & Service Methods ─────────────────────

export interface AdminSolutionDetail {
  _id?: string;
  id?: string;
  title: string;
  shortTitle?: string;
  shortDescription?: string;
  icon?: string;
  slug: string;
  badge: string;
  categoryKey: string;
  tagline: {
    line1: string;
    line2: string;
    line3: string;
  };
  heroDescription: string;
  heroPills: string[];
  heroImage: string;
  heroImageAlt?: string;
  heroMediaPublicId?: string;
  contactEmail: string;
  primaryCtaText: string;
  primaryCtaLink?: string;
  secondaryCtaText: string;
  secondaryCtaLink?: string;
  heroHighlights: Array<{
    icon: string;
    title: string;
    subtitle?: string;
  }>;
  heroBadgeText?: {
    title: string;
    subtitle: string;
    watermarkText?: string;
  };
  heroMetrics: Array<{
    title: string;
    value: string;
    rawValue?: number;
    suffix?: string;
    prefix?: string;
    decimals?: number;
    subtext?: string;
    change?: string;
    isPositive?: boolean;
    type?: 'sparkline' | 'gauge' | 'counter' | 'status';
    sparklineData?: number[];
    gaugePercent?: number;
  }>;
  overview: {
    eyebrow: string;
    title: string;
    highlightTitle?: string;
    description: string;
    blocks: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
  };
  capabilities: {
    eyebrow: string;
    title: string;
    description: string;
    items: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
  useCases: {
    eyebrow: string;
    title: string;
    description: string;
    items: Array<{
      icon?: string;
      title: string;
      description: string;
      stats?: string;
      image?: string;
      mediaPublicId?: string;
      order?: number;
      isActive?: boolean;
    }>;
  };
  howItWorks: {
    eyebrow: string;
    title: string;
    description: string;
    steps: Array<{
      step: string;
      title: string;
      subtitle: string;
      description: string;
      icon: string;
      order?: number;
      isActive?: boolean;
    }>;
  };
  techSection: {
    eyebrow: string;
    title: string;
    subtitle: string;
    description: string;
    diagramSteps: Array<{
      label: string;
      desc: string;
      icon: string;
      statusText?: string;
      order?: number;
      isActive?: boolean;
    }>;
  };
  features: {
    eyebrow: string;
    title: string;
    description: string;
    items: Array<{
      icon: string;
      title: string;
      description: string;
      tag?: string;
      order?: number;
      isActive?: boolean;
    }>;
  };
  benefits: {
    eyebrow: string;
    title: string;
    description: string;
    metrics: Array<{
      target: number;
      decimals?: number;
      prefix?: string;
      suffix: string;
      displayRange: string;
      label: string;
      description: string;
      isVerifiedOutcome?: boolean;
      order?: number;
      isActive?: boolean;
    }>;
  };
  analyticsVisual: {
    eyebrow: string;
    title: string;
    description: string;
    stats: Array<{
      label: string;
      value: string;
      numericValue: number;
      suffix?: string;
      change?: string;
      order?: number;
      isActive?: boolean;
    }>;
  };
  faqs: Array<{
    question: string;
    answer: string;
    order?: number;
    isActive?: boolean;
  }>;
  industries: Array<{
    name: string;
    description: string;
    icon?: string;
    image?: string;
    mediaPublicId?: string;
    stats?: string;
    order?: number;
    isActive?: boolean;
  }>;
  inquiryForm: {
    eyebrow?: string;
    title?: string;
    description?: string;
    responseTime?: string;
    confidentiality?: string;
    pocText?: string;
  };
  finalCta: {
    eyebrow: string;
    title: string;
    highlightTitle?: string;
    description: string;
    primaryCtaText: string;
    primaryCtaLink?: string;
    secondaryCtaText: string;
    secondaryCtaLink?: string;
    contactEmail?: string;
  };
  sections?: Array<{
    id: string;
    title: string;
    content: string;
    isActive?: boolean;
  }>;
  seo: {
    metaTitle: string;
    metaDescription: string;
    metaKeywords?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    ogImagePublicId?: string;
    canonicalUrl?: string;
  };
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'TRASHED';
  isFeatured: boolean;
  sortOrder: number;
  publishedAt?: string;
  updatedAt?: string;
  createdAt?: string;
}

export async function getAdminSolutionDetails(params?: {
  search?: string;
  category?: string;
  status?: string;
}): Promise<{ data: AdminSolutionDetail[]; stats?: any }> {
  const query = new URLSearchParams();
  if (params?.search) query.append('search', params.search);
  if (params?.category) query.append('category', params.category);
  if (params?.status) query.append('status', params.status);

  const qs = query.toString();
  const url = `${API_BASE}/admin/solutions-detail${qs ? `?${qs}` : ''}`;
  const res = await apiFetch<{ success: boolean; data: AdminSolutionDetail[]; stats: any }>(url);
  return { data: res.data, stats: res.stats };
}

export async function getAdminSolutionDetailById(id: string): Promise<AdminSolutionDetail> {
  const res = await apiFetch<{ success: boolean; data: AdminSolutionDetail }>(
    `${API_BASE}/admin/solutions-detail/${id}`
  );
  return res.data;
}

export async function createSolutionDetail(
  payload: Partial<AdminSolutionDetail>
): Promise<AdminSolutionDetail> {
  const res = await apiFetch<{ success: boolean; data: AdminSolutionDetail }>(
    `${API_BASE}/admin/solutions-detail`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  );
  clearSolutionsCache();
  return res.data;
}

export async function updateSolutionDetail(
  id: string,
  payload: Partial<AdminSolutionDetail>
): Promise<AdminSolutionDetail> {
  const res = await apiFetch<{ success: boolean; data: AdminSolutionDetail }>(
    `${API_BASE}/admin/solutions-detail/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    }
  );
  clearSolutionsCache();
  return res.data;
}

export async function updateSolutionStatus(
  id: string,
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
): Promise<AdminSolutionDetail> {
  const res = await apiFetch<{ success: boolean; data: AdminSolutionDetail }>(
    `${API_BASE}/admin/solutions-detail/${id}/status`,
    {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }
  );
  clearSolutionsCache();
  return res.data;
}

export async function duplicateSolutionDetail(id: string): Promise<AdminSolutionDetail> {
  const res = await apiFetch<{ success: boolean; data: AdminSolutionDetail }>(
    `${API_BASE}/admin/solutions-detail/${id}/duplicate`,
    {
      method: 'POST',
    }
  );
  clearSolutionsCache();
  return res.data;
}

export async function softDeleteSolutionDetail(id: string): Promise<void> {
  await apiFetch<{ success: boolean }>(`${API_BASE}/admin/solutions-detail/${id}`, {
    method: 'DELETE',
  });
  clearSolutionsCache();
}

export async function restoreSolutionDetail(id: string): Promise<AdminSolutionDetail> {
  const res = await apiFetch<{ success: boolean; data: AdminSolutionDetail }>(
    `${API_BASE}/admin/solutions-detail/${id}/restore`,
    {
      method: 'PATCH',
    }
  );
  clearSolutionsCache();
  return res.data;
}

export async function permanentlyDeleteSolutionDetail(id: string): Promise<void> {
  await apiFetch<{ success: boolean }>(
    `${API_BASE}/admin/solutions-detail/${id}/permanent`,
    {
      method: 'DELETE',
    }
  );
  clearSolutionsCache();
}

export async function getAdminSolutionDetailRecycleBin(): Promise<AdminSolutionDetail[]> {
  const res = await apiFetch<{ success: boolean; data: AdminSolutionDetail[] }>(
    `${API_BASE}/admin/solutions-detail/recycle-bin`
  );
  return res.data;
}

export async function reorderSolutionDetails(
  items: Array<{ id: string; sortOrder: number }>
): Promise<void> {
  await apiFetch<{ success: boolean }>(`${API_BASE}/admin/solutions-detail/reorder`, {
    method: 'PATCH',
    body: JSON.stringify({ items }),
  });
  clearSolutionsCache();
}

