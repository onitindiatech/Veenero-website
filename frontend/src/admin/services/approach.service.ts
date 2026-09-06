// ─── Admin Approach CMS Service & Interfaces ──────────────────────────────────

export interface AdminApproachHeroBadge {
  icon: string;
  label1: string;
  label2: string;
}

export interface AdminApproachHeroStatsWidgets {
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
}

export interface AdminApproachHero {
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
  mediaPublicId?: string;
  badges: AdminApproachHeroBadge[];
  statsWidgets: AdminApproachHeroStatsWidgets;
}

export interface AdminApproachPhilosophy {
  visible: boolean;
  eyebrow: string;
  title: string;
  highlightedText: string;
  paragraphs: string[];
  image: string;
  mediaPublicId?: string;
  badgeText: string;
}

export interface AdminApproachFrameworkPillar {
  number: string;
  title: string;
  icon: string;
  description: string;
}

export interface AdminApproachFramework {
  visible: boolean;
  eyebrow: string;
  title: string;
  highlightedText: string;
  description: string;
  pillars: AdminApproachFrameworkPillar[];
}

export interface AdminApproachCapabilityItem {
  icon: string;
  title: string;
  description: string;
}

export interface AdminApproachTechnologyTelemetry {
  flowRate: {
    label: string;
    value: string;
    unit: string;
  };
  systemHealth: {
    label: string;
    value: string;
  };
  anomalyDetection: {
    title: string;
    status: string;
    subtext: string;
  };
}

export interface AdminApproachTechnology {
  visible: boolean;
  eyebrow: string;
  title: string;
  highlightedText: string;
  description: string;
  image: string;
  mediaPublicId?: string;
  capabilities: AdminApproachCapabilityItem[];
  telemetry: AdminApproachTechnologyTelemetry;
}

export interface AdminApproachExecutionStage {
  number: string;
  icon: string;
  title: string;
  description: string;
  image: string;
  mediaPublicId?: string;
}

export interface AdminApproachExecution {
  visible: boolean;
  eyebrow: string;
  title: string;
  highlightedText: string;
  description: string;
  stages: AdminApproachExecutionStage[];
}

export interface AdminApproachOutcomeMetric {
  icon: string;
  range: [string, string];
  suffix: string;
  joined?: boolean;
  label: string;
  sublabel: string;
}

export interface AdminApproachImpact {
  visible: boolean;
  eyebrow: string;
  title: string;
  highlightedText: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  metrics: AdminApproachOutcomeMetric[];
}

export interface AdminApproachGovernanceCard {
  icon: string;
  title: string;
  description: string;
  tag?: string;
}

export interface AdminApproachGovernance {
  visible: boolean;
  eyebrow: string;
  title: string;
  highlightedText: string;
  description: string;
  supportingContent: string;
  image: string;
  mediaPublicId?: string;
  ctaText: string;
  ctaLink: string;
  cards: AdminApproachGovernanceCard[];
}

export interface AdminApproachCTA {
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

export interface AdminApproachSEO {
  metaTitle: string;
  metaDescription: string;
}

export interface ApproachPageSettings {
  _id?: string;
  hero: AdminApproachHero;
  philosophy: AdminApproachPhilosophy;
  framework: AdminApproachFramework;
  technology: AdminApproachTechnology;
  execution: AdminApproachExecution;
  impact: AdminApproachImpact;
  governance: AdminApproachGovernance;
  cta: AdminApproachCTA;
  seo: AdminApproachSEO;
  isPublished: boolean;
  lastUpdatedBy?: string;
  updatedAt?: string;
}

const API_BASE = import.meta.env.VITE_API_URL
  ? (import.meta.env.VITE_API_URL.endsWith('/api')
      ? import.meta.env.VITE_API_URL
      : `${import.meta.env.VITE_API_URL}/api`)
  : 'http://localhost:4000/api';

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

export async function getAdminApproachSettings(): Promise<ApproachPageSettings> {
  const res = await apiFetch<{ success: boolean; data: ApproachPageSettings }>(
    `${API_BASE}/admin/approach`
  );
  return res.data;
}

export async function updateAdminApproachSettings(
  data: Partial<ApproachPageSettings>
): Promise<ApproachPageSettings> {
  const res = await apiFetch<{ success: boolean; data: ApproachPageSettings }>(
    `${API_BASE}/admin/approach`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    }
  );
  return res.data;
}

export async function getApproachSection<T = any>(section: string): Promise<T> {
  const res = await apiFetch<{ success: boolean; data: T }>(
    `${API_BASE}/admin/approach/sections/${section}`
  );
  return res.data;
}

export async function updateApproachSection<T = any>(section: string, data: Partial<T>): Promise<T> {
  const res = await apiFetch<{ success: boolean; data: T; message: string }>(
    `${API_BASE}/admin/approach/sections/${section}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    }
  );
  return res.data;
}
