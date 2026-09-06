// ─── Public Approach Page Service & Interfaces ───────────────────────────────

export interface PublicApproachHeroBadge {
  icon: string;
  label1: string;
  label2: string;
}

export interface PublicApproachHeroStatsWidgets {
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

export interface PublicApproachHero {
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
  badges: PublicApproachHeroBadge[];
  statsWidgets: PublicApproachHeroStatsWidgets;
}

export interface PublicApproachPhilosophy {
  visible: boolean;
  eyebrow: string;
  title: string;
  highlightedText: string;
  paragraphs: string[];
  image: string;
  mediaPublicId?: string;
  badgeText: string;
}

export interface PublicApproachFrameworkPillar {
  number: string;
  title: string;
  icon: string;
  description: string;
}

export interface PublicApproachFramework {
  visible: boolean;
  eyebrow: string;
  title: string;
  highlightedText: string;
  description: string;
  pillars: PublicApproachFrameworkPillar[];
}

export interface PublicApproachCapabilityItem {
  icon: string;
  title: string;
  description: string;
}

export interface PublicApproachTechnologyTelemetry {
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

export interface PublicApproachTechnology {
  visible: boolean;
  eyebrow: string;
  title: string;
  highlightedText: string;
  description: string;
  image: string;
  mediaPublicId?: string;
  capabilities: PublicApproachCapabilityItem[];
  telemetry: PublicApproachTechnologyTelemetry;
}

export interface PublicApproachExecutionStage {
  number: string;
  icon: string;
  title: string;
  description: string;
  image: string;
  mediaPublicId?: string;
}

export interface PublicApproachExecution {
  visible: boolean;
  eyebrow: string;
  title: string;
  highlightedText: string;
  description: string;
  stages: PublicApproachExecutionStage[];
}

export interface PublicApproachOutcomeMetric {
  icon: string;
  range: [string, string];
  suffix: string;
  joined?: boolean;
  label: string;
  sublabel: string;
}

export interface PublicApproachImpact {
  visible: boolean;
  eyebrow: string;
  title: string;
  highlightedText: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  metrics: PublicApproachOutcomeMetric[];
}

export interface PublicApproachGovernanceCard {
  icon: string;
  title: string;
  description: string;
  tag?: string;
}

export interface PublicApproachGovernance {
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
  cards: PublicApproachGovernanceCard[];
}

export interface PublicApproachCTA {
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

export interface PublicApproachSEO {
  metaTitle: string;
  metaDescription: string;
}

export interface PublicApproachData {
  hero: PublicApproachHero;
  philosophy: PublicApproachPhilosophy;
  framework: PublicApproachFramework;
  technology: PublicApproachTechnology;
  execution: PublicApproachExecution;
  impact: PublicApproachImpact;
  governance: PublicApproachGovernance;
  cta: PublicApproachCTA;
  seo: PublicApproachSEO;
  isPublished: boolean;
}

const API_BASE = import.meta.env.VITE_API_URL
  ? (import.meta.env.VITE_API_URL.endsWith('/api')
      ? import.meta.env.VITE_API_URL
      : `${import.meta.env.VITE_API_URL}/api`)
  : 'http://localhost:4000/api';

export async function getPublicApproachContent(): Promise<PublicApproachData> {
  const res = await fetch(`${API_BASE}/approach`);
  if (!res.ok) {
    throw new Error(`Failed to fetch Approach content: ${res.status}`);
  }
  const json = await res.json();
  return json.data as PublicApproachData;
}
