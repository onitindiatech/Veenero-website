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
  return res.data;
}

export async function deleteCategory(id: string): Promise<void> {
  await apiFetch<{ success: boolean }>(
    `${API_BASE}/admin/solutions/categories/${id}`,
    {
      method: 'DELETE',
    }
  );
}

export async function createSolutionItem(solution: Partial<AdminSolutionItem>): Promise<AdminSolutionItem> {
  const res = await apiFetch<{ success: boolean; data: AdminSolutionItem }>(
    `${API_BASE}/admin/solutions/items`,
    {
      method: 'POST',
      body: JSON.stringify(solution),
    }
  );
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
  return res.data;
}

export async function deleteSolutionItem(id: string): Promise<void> {
  await apiFetch<{ success: boolean }>(
    `${API_BASE}/admin/solutions/items/${id}`,
    {
      method: 'DELETE',
    }
  );
}
