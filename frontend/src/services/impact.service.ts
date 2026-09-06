// ─── Impact CMS Frontend Service ──────────────────────────────────────────

export interface PublicImpactPillar {
  value: string;
  label: string;
  description: string;
  icon: string;
  tag: string;
}

export interface PublicStorylineStep {
  number: string;
  stage: string;
  title: string;
  description: string;
  outcome: string;
  icon: string;
}

export interface PublicEcosystemDomain {
  title: string;
  icon: string;
  description: string;
  impactPoints: string[];
}

export interface PublicSustainabilityPillar {
  title: string;
  description: string;
}

export interface PublicImpactHero {
  visible: boolean;
  eyebrow: string;
  title: string;
  description: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  image?: string;
  mediaPublicId?: string;
}

export interface PublicImpactOutcomes {
  visible: boolean;
  eyebrow: string;
  title: string;
  description: string;
  pillars: PublicImpactPillar[];
}

export interface PublicImpactStoryline {
  visible: boolean;
  eyebrow: string;
  title: string;
  description: string;
  steps: PublicStorylineStep[];
}

export interface PublicImpactEcosystem {
  visible: boolean;
  eyebrow: string;
  title: string;
  description: string;
  domains: PublicEcosystemDomain[];
  quote: {
    text: string;
    author: string;
    role: string;
    organization: string;
  };
}

export interface PublicImpactSustainability {
  visible: boolean;
  eyebrow: string;
  title: string;
  description: string;
  videoUrl?: string;
  videoPoster?: string;
  videoPublicId?: string;
  pillars: PublicSustainabilityPillar[];
}

export interface PublicImpactCTA {
  visible: boolean;
  title: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
}

export interface PublicImpactSEO {
  metaTitle: string;
  metaDescription: string;
}

export interface PublicImpactData {
  hero: PublicImpactHero;
  outcomes: PublicImpactOutcomes;
  storyline: PublicImpactStoryline;
  ecosystem: PublicImpactEcosystem;
  sustainability: PublicImpactSustainability;
  cta: PublicImpactCTA;
  seo: PublicImpactSEO;
}

export type ImpactPageSettings = PublicImpactData;

const API_BASE = import.meta.env.VITE_API_URL
  ? (import.meta.env.VITE_API_URL.endsWith('/api')
      ? import.meta.env.VITE_API_URL
      : `${import.meta.env.VITE_API_URL}/api`)
  : 'http://localhost:4000/api';

/**
 * Fetch published Impact page content for the public website.
 */
export async function getPublicImpactContent(): Promise<PublicImpactData> {
  const res = await fetch(`${API_BASE}/impact`);
  if (!res.ok) {
    throw new Error(`Failed to fetch Impact content: ${res.status}`);
  }
  const json = await res.json();
  return json.data as PublicImpactData;
}

/**
 * Fetch full settings for the Admin CMS.
 */
export async function getAdminImpactSettings(): Promise<ImpactPageSettings> {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const res = await fetch(`${API_BASE}/admin/impact`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error(`Failed to load Impact admin settings: ${res.status}`);
  }
  const json = await res.json();
  return json.data as ImpactPageSettings;
}

/**
 * Save all settings for the Admin CMS.
 */
export async function updateAdminImpactSettings(data: Partial<ImpactPageSettings>): Promise<ImpactPageSettings> {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const res = await fetch(`${API_BASE}/admin/impact`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to save Impact settings: ${res.status}`);
  }
  const json = await res.json();
  return json.data as ImpactPageSettings;
}

/**
 * Save an individual section for the Admin CMS.
 */
export async function updateAdminImpactSection(
  sectionKey: string,
  sectionData: any
): Promise<any> {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const res = await fetch(`${API_BASE}/admin/impact/${sectionKey}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
    body: JSON.stringify(sectionData),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to save section '${sectionKey}': ${res.status}`);
  }
  const json = await res.json();
  return json.data;
}
