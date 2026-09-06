import mongoose, { Schema, Document } from 'mongoose';

// ─── Sub-interfaces for Our Approach Page ──────────────────────────────────────

export interface IApproachHeroBadge {
  icon: string;
  label1: string;
  label2: string;
}

export interface IApproachHeroStatsWidgets {
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

export interface IApproachHero {
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
  badges: IApproachHeroBadge[];
  statsWidgets: IApproachHeroStatsWidgets;
}

export interface IApproachPhilosophy {
  visible: boolean;
  eyebrow: string;
  title: string;
  highlightedText: string;
  paragraphs: string[];
  image: string;
  mediaPublicId?: string;
  badgeText: string;
}

export interface IApproachFrameworkPillar {
  number: string;
  title: string;
  icon: string;
  description: string;
}

export interface IApproachFramework {
  visible: boolean;
  eyebrow: string;
  title: string;
  highlightedText: string;
  description: string;
  pillars: IApproachFrameworkPillar[];
}

export interface IApproachCapabilityItem {
  icon: string;
  title: string;
  description: string;
}

export interface IApproachTechnologyTelemetry {
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

export interface IApproachTechnology {
  visible: boolean;
  eyebrow: string;
  title: string;
  highlightedText: string;
  description: string;
  image: string;
  mediaPublicId?: string;
  capabilities: IApproachCapabilityItem[];
  telemetry: IApproachTechnologyTelemetry;
}

export interface IApproachExecutionStage {
  number: string;
  icon: string;
  title: string;
  description: string;
  image: string;
  mediaPublicId?: string;
}

export interface IApproachExecution {
  visible: boolean;
  eyebrow: string;
  title: string;
  highlightedText: string;
  description: string;
  stages: IApproachExecutionStage[];
}

export interface IApproachOutcomeMetric {
  icon: string;
  range: [string, string];
  suffix: string;
  joined?: boolean;
  label: string;
  sublabel: string;
}

export interface IApproachImpact {
  visible: boolean;
  eyebrow: string;
  title: string;
  highlightedText: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  metrics: IApproachOutcomeMetric[];
}

export interface IApproachGovernanceCard {
  icon: string;
  title: string;
  description: string;
  tag?: string;
}

export interface IApproachGovernance {
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
  cards: IApproachGovernanceCard[];
}

export interface IApproachCTA {
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

export interface IApproachSEO {
  metaTitle: string;
  metaDescription: string;
}

// ─── Main Document Interface ──────────────────────────────────────────────────

export interface IApproachPageSettings extends Document {
  hero: IApproachHero;
  philosophy: IApproachPhilosophy;
  framework: IApproachFramework;
  technology: IApproachTechnology;
  execution: IApproachExecution;
  impact: IApproachImpact;
  governance: IApproachGovernance;
  cta: IApproachCTA;
  seo: IApproachSEO;
  isPublished: boolean;
  lastUpdatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Default Seed Constants Matching Live Site Copy ─────────────────────────

const DEFAULT_HERO: IApproachHero = {
  visible: true,
  eyebrow: 'OUR APPROACH',
  title: 'A Smarter Way to Manage Water',
  highlightedText: 'Visibility. Intelligence. Accountability.',
  description: "Veenero's approach unifies IoT telemetry, advanced data pipelines, and field expertise to turn water blindspots into real-time visibility, operational excellence, and verified outcomes.",
  primaryCtaText: 'Explore Our Approach',
  primaryCtaLink: '#approach-philosophy',
  secondaryCtaText: 'Explore Solutions',
  secondaryCtaLink: '/solutions',
  image: '',
  mediaPublicId: '',
  badges: [
    { icon: 'Radio', label1: 'Real-time', label2: 'Visibility' },
    { icon: 'ShieldCheck', label1: '100%', label2: 'Data Integrity' },
    { icon: 'TrendingUp', label1: 'Actionable', label2: 'Intelligence' },
    { icon: 'Droplets', label1: 'Measurable', label2: 'Impact' },
  ],
  statsWidgets: {
    flowRate: {
      title: 'Live Flow Rate',
      value: '1,245',
      unit: 'm³/hr',
      trend: '↑ 12.5% vs yesterday',
    },
    systemHealth: {
      title: 'System Health',
      value: '98%',
      status: 'Healthy',
    },
    activeAlerts: {
      title: 'Active Alerts',
      count: '0 Critical',
      ctaText: 'View Network Map',
      ctaLink: '/solutions',
    },
  },
};

const DEFAULT_PHILOSOPHY: IApproachPhilosophy = {
  visible: true,
  eyebrow: 'OUR PHILOSOPHY',
  title: 'Visibility. Intelligence.',
  highlightedText: 'Accountability. Impact.',
  paragraphs: [
    'We believe every drop tells a story.',
    'Our approach is built on the belief that with the right data, the right technology, and the right partnerships, we can solve water challenges at scale.',
    'It begins with visibility — knowing exactly what happens across every pipe, pump, tank and process. From there we apply intelligence to surface insights, build accountability through governance, and deliver outcomes that can be independently verified.',
  ],
  image: '',
  mediaPublicId: '',
  badgeText: 'PLATFORM ECOSYSTEM',
};

const DEFAULT_FRAMEWORK: IApproachFramework = {
  visible: true,
  eyebrow: 'OUR 5-PILLAR FRAMEWORK',
  title: 'Five Pillars.',
  highlightedText: 'One Mission.',
  description: 'Our approach is built on five interconnected pillars that work together to create a complete water intelligence ecosystem.',
  pillars: [
    {
      number: '01',
      title: 'Sense',
      icon: 'Radio',
      description: 'Deploy rugged IoT sensors to capture real-time data from water assets.',
    },
    {
      number: '02',
      title: 'Connect',
      icon: 'Wifi',
      description: 'Secure connectivity via LoRa, NB-IoT, 4G/5G and edge gateways.',
    },
    {
      number: '03',
      title: 'Understand',
      icon: 'Cloud',
      description: 'Data is processed and analyzed to build baselines and prevent insights.',
    },
    {
      number: '04',
      title: 'Act',
      icon: 'Users',
      description: 'Operational teams act on contextual intelligence to optimize and resolve issues.',
    },
    {
      number: '05',
      title: 'Verify',
      icon: 'ShieldCheck',
      description: 'Outcomes are measured, verified, and continuously improved.',
    },
  ],
};

const DEFAULT_TECHNOLOGY: IApproachTechnology = {
  visible: true,
  eyebrow: 'ENABLED BY TECHNOLOGY',
  title: 'Built on a Modern,',
  highlightedText: 'Scalable Architecture',
  description: 'We combine best-in-class technologies with domain expertise to build solutions that are secure, scalable, and future-ready.',
  image: '',
  mediaPublicId: '',
  capabilities: [
    {
      icon: 'Radio',
      title: 'IoT Sensors',
      description: 'High-precision, industrial-grade telemetry devices.',
    },
    {
      icon: 'Cloud',
      title: 'Cloud Platform',
      description: 'Scalable, encrypted, and highly available data streams.',
    },
    {
      icon: 'Cpu',
      title: 'AI & Analytics',
      description: 'Advanced ML models for anomaly detection and forecasting.',
    },
    {
      icon: 'PlugZap',
      title: 'Open Integrations',
      description: 'Seamless API integration with existing SCADA and ERPs.',
    },
  ],
  telemetry: {
    flowRate: {
      label: 'Water Flow Rate',
      value: '1,245',
      unit: 'm³/hr',
    },
    systemHealth: {
      label: 'System Health',
      value: '98%',
    },
    anomalyDetection: {
      title: 'Anomaly Detection',
      status: '0 Critical Events',
      subtext: '24/7 AI-monitored',
    },
  },
};

const DEFAULT_EXECUTION: IApproachExecution = {
  visible: true,
  eyebrow: 'REAL-WORLD EXECUTION',
  title: 'From Strategy to',
  highlightedText: 'On-Ground Impact',
  description: 'Our approach is proven in diverse operational environments — from municipal utilities to large-scale industrial plants.',
  stages: [
    {
      number: '01',
      icon: 'Search',
      title: 'Understand the Context',
      description: 'We study your water systems, challenges, and operational baselines.',
      image: '',
      mediaPublicId: '',
    },
    {
      number: '02',
      icon: 'Wrench',
      title: 'Design the Right Solution',
      description: 'Tailored hardware, sensor placements, and analytics architecture.',
      image: '',
      mediaPublicId: '',
    },
    {
      number: '03',
      icon: 'Rocket',
      title: 'Deploy & Integrate',
      description: 'Fast, non-disruptive edge deployment with existing SCADA systems.',
      image: '',
      mediaPublicId: '',
    },
    {
      number: '04',
      icon: 'Activity',
      title: 'Monitor & Improve',
      description: 'Continuous monitoring, closed-loop alerts, and verified impact.',
      image: '',
      mediaPublicId: '',
    },
  ],
};

const DEFAULT_IMPACT: IApproachImpact = {
  visible: true,
  eyebrow: 'IMPACT-DRIVEN APPROACH',
  title: 'Our Approach Creates',
  highlightedText: 'Measurable Outcomes',
  description: "We don't just deploy technology — we create lasting, verifiable impact across water networks and industrial utilities.",
  ctaText: 'Explore Our Impact',
  ctaLink: '/impact',
  metrics: [
    {
      icon: 'Droplets',
      range: ['20', '40'],
      suffix: '%',
      label: 'Reduction in',
      sublabel: 'Non-Revenue Water',
    },
    {
      icon: 'Zap',
      range: ['30', '50'],
      suffix: '%',
      label: 'Faster Issue',
      sublabel: 'Detection',
    },
    {
      icon: 'ArrowDownToLine',
      range: ['25', '35'],
      suffix: '%',
      label: 'Lower Operational',
      sublabel: 'Costs',
    },
    {
      icon: 'ShieldCheck',
      range: ['99', '9'],
      suffix: '%',
      joined: true,
      label: 'Data Reliability',
      sublabel: '& Availability',
    },
  ],
};

const DEFAULT_GOVERNANCE: IApproachGovernance = {
  visible: true,
  eyebrow: 'ENTERPRISE GOVERNANCE',
  title: 'Engineered for Scale,',
  highlightedText: 'Governed for Trust',
  description: 'Our approach embeds end-to-end data security, regulatory compliance, and verifiable telemetry governance directly into the operational fabric of water infrastructure.',
  supportingContent: 'From municipal distribution networks to zero-liquid discharge industrial facilities, every data point captured by Veenero undergoes encrypted edge processing, redundant validation, and tamper-evident audit logging.',
  image: '',
  mediaPublicId: '',
  ctaText: 'Explore Infrastructure Security',
  ctaLink: '/solutions',
  cards: [
    {
      icon: 'ShieldCheck',
      title: 'Tamper-Evident Data Integrity',
      description: 'Cryptographic signing of field sensor packets ensuring zero data manipulation from edge to dashboard.',
      tag: 'AES-256',
    },
    {
      icon: 'FileCheck2',
      title: 'Regulatory Compliance Ready',
      description: 'Automated compliance reporting structured for regional water boards and environmental auditing standards.',
      tag: 'ISO Aligned',
    },
    {
      icon: 'Cpu',
      title: 'Edge-Resilient Telemetry',
      description: 'Local storage caching during network outages with automated delta backfill upon link restoration.',
      tag: '99.9% Uptime',
    },
    {
      icon: 'Lock',
      title: 'Enterprise Access Control',
      description: 'Role-based permissions (RBAC), multi-factor authentication, and partitioned multi-tenant architecture.',
      tag: 'SOC 2 Ready',
    },
  ],
};

const DEFAULT_CTA: IApproachCTA = {
  visible: true,
  eyebrow: 'READY TO GET STARTED',
  title: 'Ready to Transform',
  highlightedText: 'Water Future?',
  description: "Let's build smarter, more resilient water systems together with real-time intelligence.",
  primaryButtonText: 'Get in Touch',
  primaryButtonLink: '/contact',
  secondaryButtonText: 'Explore Solutions',
  secondaryButtonLink: '/solutions',
};

const DEFAULT_SEO: IApproachSEO = {
  metaTitle: 'Our Approach | Veenero - Water Intelligence Journey',
  metaDescription: "Explore Veenero's five-pillar approach to water management: Sense, Connect, Understand, Act, and Verify for industrial and utility operations.",
};

// ─── Mongoose Sub-schemas ─────────────────────────────────────────────────────

const ApproachHeroBadgeSchema = new Schema(
  {
    icon: { type: String, default: 'Radio' },
    label1: { type: String, default: '' },
    label2: { type: String, default: '' },
  },
  { _id: false }
);

const ApproachHeroStatsWidgetsSchema = new Schema(
  {
    flowRate: {
      title: { type: String, default: 'Live Flow Rate' },
      value: { type: String, default: '1,245' },
      unit: { type: String, default: 'm³/hr' },
      trend: { type: String, default: '↑ 12.5% vs yesterday' },
    },
    systemHealth: {
      title: { type: String, default: 'System Health' },
      value: { type: String, default: '98%' },
      status: { type: String, default: 'Healthy' },
    },
    activeAlerts: {
      title: { type: String, default: 'Active Alerts' },
      count: { type: String, default: '0 Critical' },
      ctaText: { type: String, default: 'View Network Map' },
      ctaLink: { type: String, default: '/solutions' },
    },
  },
  { _id: false }
);

const ApproachHeroSchema = new Schema(
  {
    visible: { type: Boolean, default: true },
    eyebrow: { type: String, default: DEFAULT_HERO.eyebrow },
    title: { type: String, default: DEFAULT_HERO.title },
    highlightedText: { type: String, default: DEFAULT_HERO.highlightedText },
    description: { type: String, default: DEFAULT_HERO.description },
    primaryCtaText: { type: String, default: DEFAULT_HERO.primaryCtaText },
    primaryCtaLink: { type: String, default: DEFAULT_HERO.primaryCtaLink },
    secondaryCtaText: { type: String, default: DEFAULT_HERO.secondaryCtaText },
    secondaryCtaLink: { type: String, default: DEFAULT_HERO.secondaryCtaLink },
    image: { type: String, default: '' },
    mediaPublicId: { type: String, default: '' },
    badges: { type: [ApproachHeroBadgeSchema], default: DEFAULT_HERO.badges },
    statsWidgets: { type: ApproachHeroStatsWidgetsSchema, default: () => ({ ...DEFAULT_HERO.statsWidgets }) },
  },
  { _id: false }
);

const ApproachPhilosophySchema = new Schema(
  {
    visible: { type: Boolean, default: true },
    eyebrow: { type: String, default: DEFAULT_PHILOSOPHY.eyebrow },
    title: { type: String, default: DEFAULT_PHILOSOPHY.title },
    highlightedText: { type: String, default: DEFAULT_PHILOSOPHY.highlightedText },
    paragraphs: { type: [String], default: DEFAULT_PHILOSOPHY.paragraphs },
    image: { type: String, default: '' },
    mediaPublicId: { type: String, default: '' },
    badgeText: { type: String, default: DEFAULT_PHILOSOPHY.badgeText },
  },
  { _id: false }
);

const ApproachFrameworkPillarSchema = new Schema(
  {
    number: { type: String, default: '01' },
    title: { type: String, default: '' },
    icon: { type: String, default: 'Radio' },
    description: { type: String, default: '' },
  },
  { _id: false }
);

const ApproachFrameworkSchema = new Schema(
  {
    visible: { type: Boolean, default: true },
    eyebrow: { type: String, default: DEFAULT_FRAMEWORK.eyebrow },
    title: { type: String, default: DEFAULT_FRAMEWORK.title },
    highlightedText: { type: String, default: DEFAULT_FRAMEWORK.highlightedText },
    description: { type: String, default: DEFAULT_FRAMEWORK.description },
    pillars: { type: [ApproachFrameworkPillarSchema], default: DEFAULT_FRAMEWORK.pillars },
  },
  { _id: false }
);

const ApproachCapabilityItemSchema = new Schema(
  {
    icon: { type: String, default: 'Radio' },
    title: { type: String, default: '' },
    description: { type: String, default: '' },
  },
  { _id: false }
);

const ApproachTechnologySchema = new Schema(
  {
    visible: { type: Boolean, default: true },
    eyebrow: { type: String, default: DEFAULT_TECHNOLOGY.eyebrow },
    title: { type: String, default: DEFAULT_TECHNOLOGY.title },
    highlightedText: { type: String, default: DEFAULT_TECHNOLOGY.highlightedText },
    description: { type: String, default: DEFAULT_TECHNOLOGY.description },
    image: { type: String, default: '' },
    mediaPublicId: { type: String, default: '' },
    capabilities: { type: [ApproachCapabilityItemSchema], default: DEFAULT_TECHNOLOGY.capabilities },
    telemetry: {
      flowRate: {
        label: { type: String, default: 'Water Flow Rate' },
        value: { type: String, default: '1,245' },
        unit: { type: String, default: 'm³/hr' },
      },
      systemHealth: {
        label: { type: String, default: 'System Health' },
        value: { type: String, default: '98%' },
      },
      anomalyDetection: {
        title: { type: String, default: 'Anomaly Detection' },
        status: { type: String, default: '0 Critical Events' },
        subtext: { type: String, default: '24/7 AI-monitored' },
      },
    },
  },
  { _id: false }
);

const ApproachExecutionStageSchema = new Schema(
  {
    number: { type: String, default: '01' },
    icon: { type: String, default: 'Search' },
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    mediaPublicId: { type: String, default: '' },
  },
  { _id: false }
);

const ApproachExecutionSchema = new Schema(
  {
    visible: { type: Boolean, default: true },
    eyebrow: { type: String, default: DEFAULT_EXECUTION.eyebrow },
    title: { type: String, default: DEFAULT_EXECUTION.title },
    highlightedText: { type: String, default: DEFAULT_EXECUTION.highlightedText },
    description: { type: String, default: DEFAULT_EXECUTION.description },
    stages: { type: [ApproachExecutionStageSchema], default: DEFAULT_EXECUTION.stages },
  },
  { _id: false }
);

const ApproachOutcomeMetricSchema = new Schema(
  {
    icon: { type: String, default: 'Droplets' },
    range: { type: [String], default: ['20', '40'] },
    suffix: { type: String, default: '%' },
    joined: { type: Boolean, default: false },
    label: { type: String, default: '' },
    sublabel: { type: String, default: '' },
  },
  { _id: false }
);

const ApproachImpactSchema = new Schema(
  {
    visible: { type: Boolean, default: true },
    eyebrow: { type: String, default: DEFAULT_IMPACT.eyebrow },
    title: { type: String, default: DEFAULT_IMPACT.title },
    highlightedText: { type: String, default: DEFAULT_IMPACT.highlightedText },
    description: { type: String, default: DEFAULT_IMPACT.description },
    ctaText: { type: String, default: DEFAULT_IMPACT.ctaText },
    ctaLink: { type: String, default: DEFAULT_IMPACT.ctaLink },
    metrics: { type: [ApproachOutcomeMetricSchema], default: DEFAULT_IMPACT.metrics },
  },
  { _id: false }
);

const ApproachGovernanceCardSchema = new Schema(
  {
    icon: { type: String, default: 'ShieldCheck' },
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    tag: { type: String, default: '' },
  },
  { _id: false }
);

const ApproachGovernanceSchema = new Schema(
  {
    visible: { type: Boolean, default: true },
    eyebrow: { type: String, default: DEFAULT_GOVERNANCE.eyebrow },
    title: { type: String, default: DEFAULT_GOVERNANCE.title },
    highlightedText: { type: String, default: DEFAULT_GOVERNANCE.highlightedText },
    description: { type: String, default: DEFAULT_GOVERNANCE.description },
    supportingContent: { type: String, default: DEFAULT_GOVERNANCE.supportingContent },
    image: { type: String, default: '' },
    mediaPublicId: { type: String, default: '' },
    ctaText: { type: String, default: DEFAULT_GOVERNANCE.ctaText },
    ctaLink: { type: String, default: DEFAULT_GOVERNANCE.ctaLink },
    cards: { type: [ApproachGovernanceCardSchema], default: DEFAULT_GOVERNANCE.cards },
  },
  { _id: false }
);

const ApproachCTASchema = new Schema(
  {
    visible: { type: Boolean, default: true },
    eyebrow: { type: String, default: DEFAULT_CTA.eyebrow },
    title: { type: String, default: DEFAULT_CTA.title },
    highlightedText: { type: String, default: DEFAULT_CTA.highlightedText },
    description: { type: String, default: DEFAULT_CTA.description },
    primaryButtonText: { type: String, default: DEFAULT_CTA.primaryButtonText },
    primaryButtonLink: { type: String, default: DEFAULT_CTA.primaryButtonLink },
    secondaryButtonText: { type: String, default: DEFAULT_CTA.secondaryButtonText },
    secondaryButtonLink: { type: String, default: DEFAULT_CTA.secondaryButtonLink },
  },
  { _id: false }
);

const ApproachSEOSchema = new Schema(
  {
    metaTitle: { type: String, default: DEFAULT_SEO.metaTitle },
    metaDescription: { type: String, default: DEFAULT_SEO.metaDescription },
  },
  { _id: false }
);

// ─── Main Schema ─────────────────────────────────────────────────────────────

const ApproachPageSettingsSchema = new Schema<IApproachPageSettings>(
  {
    hero: { type: ApproachHeroSchema, default: () => ({ ...DEFAULT_HERO }) },
    philosophy: { type: ApproachPhilosophySchema, default: () => ({ ...DEFAULT_PHILOSOPHY }) },
    framework: { type: ApproachFrameworkSchema, default: () => ({ ...DEFAULT_FRAMEWORK }) },
    technology: { type: ApproachTechnologySchema, default: () => ({ ...DEFAULT_TECHNOLOGY }) },
    execution: { type: ApproachExecutionSchema, default: () => ({ ...DEFAULT_EXECUTION }) },
    impact: { type: ApproachImpactSchema, default: () => ({ ...DEFAULT_IMPACT }) },
    governance: { type: ApproachGovernanceSchema, default: () => ({ ...DEFAULT_GOVERNANCE }) },
    cta: { type: ApproachCTASchema, default: () => ({ ...DEFAULT_CTA }) },
    seo: { type: ApproachSEOSchema, default: () => ({ ...DEFAULT_SEO }) },
    isPublished: { type: Boolean, default: true },
    lastUpdatedBy: { type: String },
  },
  {
    timestamps: true,
  }
);

export const ApproachPageSettingsModel = mongoose.model<IApproachPageSettings>(
  'ApproachPageSettings',
  ApproachPageSettingsSchema
);
