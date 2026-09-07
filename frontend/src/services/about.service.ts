// frontend/src/services/about.service.ts
// Public client service for /about page

export interface PublicAboutHeroBadge {
  icon: string;
  label1: string;
  label2: string;
}

export interface PublicAboutHeroStatsWidgets {
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

export interface PublicAboutHero {
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
  badges?: PublicAboutHeroBadge[];
  statsWidgets?: PublicAboutHeroStatsWidgets;
}

export interface PublicAboutCapabilityItem {
  icon: string;
  title: string;
  description: string;
}

export interface PublicAboutStory {
  visible: boolean;
  eyebrow: string;
  title: string;
  paragraphs: string[];
  badgePillars: string[];
  capabilities?: PublicAboutCapabilityItem[];
  video: string;
  videoPoster: string;
  mediaPublicId?: string;
}

export interface PublicAboutStatItem {
  id?: string;
  _id?: string;
  value: string;
  label: string;
  sublabel: string;
  icon: string;
  order: number;
}

export interface PublicAboutImpactStats {
  visible: boolean;
  eyebrow?: string;
  title?: string;
  description?: string;
  list: PublicAboutStatItem[];
}

export interface PublicAboutMilestone {
  id?: string;
  _id?: string;
  year: string;
  title: string;
  description: string;
  iconType: string;
  order: number;
}

export interface PublicAboutJourney {
  visible: boolean;
  eyebrow: string;
  title: string;
  description: string;
  journeyImage: string;
  journeyCaption: string;
  mediaPublicId?: string;
  milestones: PublicAboutMilestone[];
}

export interface PublicAboutVisionItem {
  badge: string;
  title: string;
  description: string;
}

export interface PublicAboutMissionItem {
  badge: string;
  title: string;
  description: string;
}

export interface PublicAboutPurposeDirection {
  visible: boolean;
  eyebrow: string;
  title: string;
  description: string;
  vision: PublicAboutVisionItem;
  mission: PublicAboutMissionItem;
}

export interface PublicAboutPillarItem {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  image: string;
  mediaPublicId?: string;
  order: number;
}

export interface PublicAboutPillars {
  visible: boolean;
  eyebrow: string;
  title: string;
  description: string;
  list: PublicAboutPillarItem[];
}

export interface PublicAboutWhyChooseItem {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  icon: string;
  image: string;
  mediaPublicId?: string;
  order: number;
}

export interface PublicAboutWhyChoose {
  visible: boolean;
  eyebrow: string;
  title: string;
  highlightedText: string;
  description: string;
  bottomTrustText: string;
  list: PublicAboutWhyChooseItem[];
}

export interface PublicAboutTeamMember {
  id?: string;
  _id?: string;
  name: string;
  role: string;
  bio: string;
  icon: string;
  image: string;
  mediaPublicId?: string;
  order: number;
}

export interface PublicAboutLeadership {
  visible: boolean;
  eyebrow: string;
  title: string;
  description: string;
  team: PublicAboutTeamMember[];
}

export interface PublicAboutCTA {
  visible: boolean;
  eyebrow: string;
  title: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
}

export interface PublicAboutSEO {
  metaTitle: string;
  metaDescription: string;
}

export interface PublicAboutData {
  hero: PublicAboutHero;
  ourStory: PublicAboutStory;
  impactStats: PublicAboutImpactStats;
  ourJourney: PublicAboutJourney;
  purposeDirection: PublicAboutPurposeDirection;
  pillars: PublicAboutPillars;
  whyChoose: PublicAboutWhyChoose;
  leadership: PublicAboutLeadership;
  cta: PublicAboutCTA;
  seo: PublicAboutSEO;
  isPublished: boolean;
  updatedAt?: string;
}

import { API_BASE_URL } from '@/config/api';

const API_BASE = `${API_BASE_URL}/api`;

export const getPublicAboutContent = async (): Promise<PublicAboutData> => {
  const res = await fetch(`${API_BASE}/about`);
  if (!res.ok) {
    throw new Error('Failed to fetch About page content.');
  }
  const json = await res.json();
  if (!json.success || !json.data) {
    throw new Error(json.error?.message || 'Invalid API response for About page.');
  }
  return json.data;
};
