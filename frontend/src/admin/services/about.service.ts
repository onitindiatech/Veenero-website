// frontend/src/admin/services/about.service.ts
// Admin API service for About Page CMS

export interface AboutHeroBadge {
  icon: string;
  label1: string;
  label2: string;
}

export interface AboutHeroStatsWidgets {
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
    ctaLink?: string;
  };
}

export interface AboutHero {
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
  badges?: AboutHeroBadge[];
  statsWidgets?: AboutHeroStatsWidgets;
}

export interface AboutCapabilityItem {
  icon: string;
  title: string;
  description: string;
}

export interface AboutStory {
  visible: boolean;
  eyebrow: string;
  title: string;
  paragraphs: string[];
  badgePillars: string[];
  capabilities?: AboutCapabilityItem[];
  video: string;
  videoPoster: string;
  mediaPublicId?: string;
}

export interface AboutStatItem {
  id?: string;
  _id?: string;
  value: string;
  label: string;
  sublabel: string;
  icon: string;
  order: number;
  isActive: boolean;
}

export interface AboutImpactStats {
  visible: boolean;
  eyebrow?: string;
  title?: string;
  description?: string;
  list: AboutStatItem[];
}

export interface AboutJourneyMilestone {
  id?: string;
  _id?: string;
  year: string;
  title: string;
  description: string;
  iconType: string;
  order: number;
  isActive: boolean;
}

export interface AboutJourney {
  visible: boolean;
  eyebrow: string;
  title: string;
  description: string;
  journeyImage: string;
  journeyCaption: string;
  mediaPublicId?: string;
  milestones: AboutJourneyMilestone[];
}

export interface AboutVisionItem {
  badge: string;
  title: string;
  description: string;
  isActive: boolean;
}

export interface AboutMissionItem {
  badge: string;
  title: string;
  description: string;
  isActive: boolean;
}

export interface AboutPurposeDirection {
  visible: boolean;
  eyebrow: string;
  title: string;
  description: string;
  vision: AboutVisionItem;
  mission: AboutMissionItem;
}

export interface AboutPillarItem {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  image: string;
  mediaPublicId?: string;
  order: number;
  isActive: boolean;
}

export interface AboutPillars {
  visible: boolean;
  eyebrow: string;
  title: string;
  description: string;
  list: AboutPillarItem[];
}

export interface AboutWhyChooseItem {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  icon: string;
  image: string;
  mediaPublicId?: string;
  order: number;
  isActive: boolean;
}

export interface AboutWhyChoose {
  visible: boolean;
  eyebrow: string;
  title: string;
  highlightedText: string;
  description: string;
  bottomTrustText: string;
  list: AboutWhyChooseItem[];
}

export interface AboutTeamMember {
  id?: string;
  _id?: string;
  name: string;
  role: string;
  bio: string;
  icon: string;
  image: string;
  mediaPublicId?: string;
  order: number;
  isActive: boolean;
}

export interface AboutLeadership {
  visible: boolean;
  eyebrow: string;
  title: string;
  description: string;
  team: AboutTeamMember[];
}

export interface AboutCTA {
  visible: boolean;
  eyebrow: string;
  title: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
}

export interface AboutSEO {
  metaTitle: string;
  metaDescription: string;
}

export interface AboutPageSettings {
  id?: string;
  _id?: string;
  hero: AboutHero;
  ourStory: AboutStory;
  impactStats: AboutImpactStats;
  ourJourney: AboutJourney;
  purposeDirection: AboutPurposeDirection;
  pillars: AboutPillars;
  whyChoose: AboutWhyChoose;
  leadership: AboutLeadership;
  cta: AboutCTA;
  seo: AboutSEO;
  isPublished: boolean;
  lastUpdatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

import { API_BASE_URL } from '@/config/api';

const API_BASE = `${API_BASE_URL}/api`;

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    ...options,
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error?.message || `API Error: ${res.status}`);
  }
  return json as T;
}

export async function getAdminAboutSettings(): Promise<AboutPageSettings> {
  const res = await apiFetch<{ success: boolean; data: AboutPageSettings }>(
    `${API_BASE}/admin/about`
  );
  return res.data;
}

export async function updateAdminAboutSettings(
  data: Partial<AboutPageSettings>
): Promise<AboutPageSettings> {
  const res = await apiFetch<{ success: boolean; data: AboutPageSettings }>(
    `${API_BASE}/admin/about`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    }
  );
  return res.data;
}

export async function getAdminAboutSection<T = any>(section: string): Promise<T> {
  const res = await apiFetch<{ success: boolean; data: T }>(
    `${API_BASE}/admin/about/sections/${section}`
  );
  return res.data;
}

export async function updateAdminAboutSection<T = any>(
  section: string,
  sectionData: any
): Promise<T> {
  const res = await apiFetch<{ success: boolean; data: T }>(
    `${API_BASE}/admin/about/sections/${section}`,
    {
      method: 'PUT',
      body: JSON.stringify(sectionData),
    }
  );
  return res.data;
}
