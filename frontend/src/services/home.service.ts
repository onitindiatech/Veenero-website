// ─── Frontend Home CMS Service ─────────────────────────────────────────────────

export interface HomeHero {
  visible: boolean;
  eyebrow: string;
  title: string;
  description: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  image: string;
  imageAlt: string;
  bottomText: string;
}

export interface HomeValueItem {
  iconName: string;
  title: string;
  description: string;
}

export interface HomeStatItem {
  value: string;
  label: string;
}

export interface HomeAbout {
  visible: boolean;
  eyebrow: string;
  title: string;
  description: string;
  values: HomeValueItem[];
  stats: HomeStatItem[];
}

export interface HomeSolutionItem {
  iconName: string;
  title: string;
  description: string;
  features: string[];
}

export interface HomeSolutions {
  visible: boolean;
  eyebrow: string;
  title: string;
  description: string;
  ctaText?: string;
  ctaLink?: string;
  list: HomeSolutionItem[];
}

export interface HomeStepItem {
  number: string;
  title: string;
  description: string;
  points: string[];
}

export interface HomeApproach {
  visible: boolean;
  eyebrow: string;
  title: string;
  description: string;
  steps: HomeStepItem[];
}

export interface HomeImpactItem {
  iconName: string;
  value: string;
  label: string;
  description: string;
}

export interface HomeTestimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
}

export interface HomeImpact {
  visible: boolean;
  eyebrow: string;
  title: string;
  description: string;
  impacts: HomeImpactItem[];
  testimonial: HomeTestimonial;
}

export interface HomePartnerItem {
  name: string;
  logo: string;
  description: string;
}

export interface HomePartners {
  visible: boolean;
  eyebrow: string;
  title: string;
  description: string;
  list: HomePartnerItem[];
}

export interface HomeCareerOpeningItem {
  title: string;
  location: string;
  department: string;
  isNew: boolean;
}

export interface HomeCareers {
  visible: boolean;
  eyebrow: string;
  title: string;
  description: string;
  openingsTitle: string;
  list: HomeCareerOpeningItem[];
  generalAppText: string;
  generalAppButtonText: string;
}

export interface HomeContactInfoItem {
  iconName: string;
  label: string;
  value: string;
}

export interface HomeContact {
  visible: boolean;
  eyebrow: string;
  title: string;
  description: string;
  infoTitle: string;
  infoList: HomeContactInfoItem[];
  demoTitle: string;
  demoDescription: string;
  demoButtonText: string;
  formTitle: string;
}

export interface HomeFooterLinkItem {
  label: string;
  href: string;
}

export interface HomeFooterLinks {
  solutions: HomeFooterLinkItem[];
  company: HomeFooterLinkItem[];
  resources: HomeFooterLinkItem[];
}

export interface HomeSocialLink {
  iconName: string;
  href: string;
  label: string;
}

export interface HomeFooter {
  description: string;
  address: string;
  mobile: string;
  links: HomeFooterLinks;
  socialLinks: HomeSocialLink[];
}

export interface HomeSeo {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
}

export interface HomePageSettings {
  id?: string;
  hero: HomeHero;
  about: HomeAbout;
  solutions: HomeSolutions;
  approach: HomeApproach;
  impact: HomeImpact;
  partners: HomePartners;
  careers: HomeCareers;
  contact: HomeContact;
  footer: HomeFooter;
  seo?: HomeSeo;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

import { API_BASE_URL } from '@/config/api';

const API_BASE = `${API_BASE_URL}/api`;

// ─── Helper API Fetcher ────────────────────────────────────────────────────────
async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options?.headers as Record<string, string>) || {}),
  };

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error?.message || `API Error: ${res.status}`);
  }
  return json as T;
}

// ─── CMS API Actions ───────────────────────────────────────────────────────────

export async function getPublicHome(): Promise<HomePageSettings> {
  const res = await apiFetch<{ success: boolean; data: HomePageSettings }>(
    `${API_BASE}/home`
  );
  return res.data;
}

export async function getAdminHomeSettings(): Promise<HomePageSettings> {
  const res = await apiFetch<{ success: boolean; data: HomePageSettings }>(
    `${API_BASE}/admin/home`
  );
  return res.data;
}

export async function updateAdminHomeSettings(
  data: Partial<HomePageSettings>
): Promise<HomePageSettings> {
  const res = await apiFetch<{ success: boolean; data: HomePageSettings }>(
    `${API_BASE}/admin/home`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    }
  );
  return res.data;
}

export async function getAdminHomeSection<T = any>(section: string): Promise<T> {
  const res = await apiFetch<{ success: boolean; data: T }>(
    `${API_BASE}/admin/home/sections/${section}`
  );
  return res.data;
}

export async function updateAdminHomeSection<T = any>(section: string, data: any): Promise<T> {
  const res = await apiFetch<{ success: boolean; data: T }>(
    `${API_BASE}/admin/home/sections/${section}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    }
  );
  return res.data;
}

export async function getSolutionsCollection(): Promise<HomeSolutionItem[]> {
  const res = await apiFetch<{ success: boolean; data: HomeSolutionItem[] }>(
    `${API_BASE}/admin/home/solutions`
  );
  return res.data;
}

export async function createSolutionItem(item: HomeSolutionItem): Promise<HomeSolutionItem[]> {
  const res = await apiFetch<{ success: boolean; data: HomeSolutionItem[] }>(
    `${API_BASE}/admin/home/solutions`,
    {
      method: 'POST',
      body: JSON.stringify(item),
    }
  );
  return res.data;
}

export async function updateSolutionItem(index: number, item: Partial<HomeSolutionItem>): Promise<HomeSolutionItem> {
  const res = await apiFetch<{ success: boolean; data: HomeSolutionItem }>(
    `${API_BASE}/admin/home/solutions/${index}`,
    {
      method: 'PUT',
      body: JSON.stringify(item),
    }
  );
  return res.data;
}

export async function deleteSolutionItem(index: number): Promise<HomeSolutionItem[]> {
  const res = await apiFetch<{ success: boolean; data: HomeSolutionItem[] }>(
    `${API_BASE}/admin/home/solutions/${index}`,
    {
      method: 'DELETE',
    }
  );
  return res.data;
}

export async function reorderSolutionsCollection(list: HomeSolutionItem[]): Promise<HomeSolutionItem[]> {
  const res = await apiFetch<{ success: boolean; data: HomeSolutionItem[] }>(
    `${API_BASE}/admin/home/solutions/reorder`,
    {
      method: 'POST',
      body: JSON.stringify({ list }),
    }
  );
  return res.data;
}

export async function getPartnersCollection(): Promise<HomePartnerItem[]> {
  const res = await apiFetch<{ success: boolean; data: HomePartnerItem[] }>(
    `${API_BASE}/admin/home/partners`
  );
  return res.data;
}

export async function createPartnerItem(item: HomePartnerItem): Promise<HomePartnerItem[]> {
  const res = await apiFetch<{ success: boolean; data: HomePartnerItem[] }>(
    `${API_BASE}/admin/home/partners`,
    {
      method: 'POST',
      body: JSON.stringify(item),
    }
  );
  return res.data;
}

export async function updatePartnerItem(index: number, item: Partial<HomePartnerItem>): Promise<HomePartnerItem> {
  const res = await apiFetch<{ success: boolean; data: HomePartnerItem }>(
    `${API_BASE}/admin/home/partners/${index}`,
    {
      method: 'PUT',
      body: JSON.stringify(item),
    }
  );
  return res.data;
}

export async function deletePartnerItem(index: number): Promise<HomePartnerItem[]> {
  const res = await apiFetch<{ success: boolean; data: HomePartnerItem[] }>(
    `${API_BASE}/admin/home/partners/${index}`,
    {
      method: 'DELETE',
    }
  );
  return res.data;
}

