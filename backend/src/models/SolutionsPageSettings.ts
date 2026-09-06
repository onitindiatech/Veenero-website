import mongoose, { Schema, Document } from 'mongoose';

// ─── Sub-interfaces for Solutions Page ──────────────────────────────────────────

export interface ISolutionCategory {
  _id?: string;
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

export interface ISolutionItem {
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

export interface ISolutionsHero {
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
  badges: Array<{
    icon: string;
    label1: string;
    label2: string;
  }>;
  statsWidgets: {
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

export interface ISolutionsIntro {
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

export interface ISolutionsGridHeader {
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

export interface IFeaturedSolutionSection {
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

export interface IWaterIntelligenceFlow {
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

export interface ISolutionsCTA {
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

export interface ISolutionsSEO {
  metaTitle: string;
  metaDescription: string;
}

export interface ISolutionsPageSettings extends Document {
  hero: ISolutionsHero;
  intro: ISolutionsIntro;
  gridHeader: ISolutionsGridHeader;
  categories: ISolutionCategory[];
  solutions: ISolutionItem[];
  featuredSolution: IFeaturedSolutionSection;
  flow: IWaterIntelligenceFlow;
  cta: ISolutionsCTA;
  seo: ISolutionsSEO;
  isPublished: boolean;
  lastUpdatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Sub-schemas ──────────────────────────────────────────────────────────────

const SolutionCategorySchema = new Schema<ISolutionCategory>(
  {
    key: { type: String, required: true, trim: true },
    displayLabel: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    icon: { type: String, default: 'Eye', trim: true },
    image: { type: String, default: '', trim: true },
    mediaPublicId: { type: String, default: '', trim: true },
    pillarKeys: { type: [String], default: [] },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { _id: true, timestamps: true }
);

const SolutionItemSchema = new Schema<ISolutionItem>(
  {
    id: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    tagline: { type: String, default: '', trim: true },
    description: { type: String, default: '', trim: true },
    categoryKey: { type: String, required: true, trim: true },
    pillar: { type: String, default: '', trim: true },
    icon: { type: String, default: 'Radio', trim: true },
    image: { type: String, default: '', trim: true },
    mediaPublicId: { type: String, default: '', trim: true },
    features: { type: [String], default: [] },
    metrics: {
      value: { type: String, default: '' },
      label: { type: String, default: '' },
    },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { _id: true, timestamps: true }
);

const SolutionsHeroSchema = new Schema<ISolutionsHero>(
  {
    visible: { type: Boolean, default: true },
    eyebrow: { type: String, default: 'VEENERO SOLUTION SUITE', trim: true },
    title: { type: String, default: 'Water Intelligence Solutions', trim: true },
    highlightedText: { type: String, default: 'Built for Visibility, Accountability & Action.', trim: true },
    description: {
      type: String,
      default:
        'A complete digital infrastructure layer for water management—unifying rugged edge telemetry, real-time cloud analytics, and verification-ready governance into one seamless platform.',
      trim: true,
    },
    primaryCtaText: { type: String, default: 'Explore Solutions', trim: true },
    primaryCtaLink: { type: String, default: '#solutions-ecosystem', trim: true },
    secondaryCtaText: { type: String, default: 'Platform Architecture', trim: true },
    secondaryCtaLink: { type: String, default: '#platform-architecture', trim: true },
    image: { type: String, default: '', trim: true },
    imageAlt: {
      type: String,
      default: 'Veenero Water Intelligence Solutions — water treatment facility and telemetry network',
      trim: true,
    },
    mediaPublicId: { type: String, default: '', trim: true },
    badges: {
      type: [
        {
          icon: { type: String, default: 'Radio' },
          label1: { type: String, default: 'Real-time' },
          label2: { type: String, default: 'Visibility' },
        },
      ],
      default: [
        { icon: 'Radio', label1: 'Real-time', label2: 'Visibility' },
        { icon: 'ShieldCheck', label1: '100%', label2: 'Data Integrity' },
        { icon: 'TrendingUp', label1: 'Actionable', label2: 'Intelligence' },
        { icon: 'Droplets', label1: 'Measurable', label2: 'Impact' },
      ],
    },
    statsWidgets: {
      type: new Schema(
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
            count: { type: String, default: '3' },
            ctaText: { type: String, default: 'View All Alerts' },
            ctaLink: { type: String, default: '#solutions-ecosystem' },
          },
        },
        { _id: false }
      ),
      default: () => ({
        flowRate: { title: 'Live Flow Rate', value: '1,245', unit: 'm³/hr', trend: '↑ 12.5% vs yesterday' },
        systemHealth: { title: 'System Health', value: '98%', status: 'Healthy' },
        activeAlerts: { title: 'Active Alerts', count: '3', ctaText: 'View All Alerts', ctaLink: '#solutions-ecosystem' },
      }),
    },
  },
  { _id: false }
);

const SolutionsIntroSchema = new Schema<ISolutionsIntro>(
  {
    visible: { type: Boolean, default: true },
    eyebrow: { type: String, default: 'OUR SOLUTIONS', trim: true },
    title: { type: String, default: 'From Water Data', trim: true },
    highlightedText: { type: String, default: 'to Measurable Action', trim: true },
    paragraphs: {
      type: [String],
      default: [
        'Veenero unifies sensors, connectivity, and intelligence to deliver real-time visibility, drive operational efficiency, ensure accountability, and verify outcomes across the entire water lifecycle.',
        'Whether deployed across industrial campuses, municipal networks, or commercial real estate, our modular architecture adapts to any operational environment — without replacing existing SCADA or ERP systems.',
      ],
    },
    image: { type: String, default: '', trim: true },
    mediaPublicId: { type: String, default: '', trim: true },
    badges: {
      type: [
        {
          icon: { type: String, default: 'Eye' },
          label: { type: String, default: '' },
        },
      ],
      default: [
        { icon: 'Eye', label: 'Real-time Visibility' },
        { icon: 'ShieldCheck', label: 'Data-backed Decisions' },
        { icon: 'TrendingUp', label: 'Operational Efficiency' },
        { icon: 'Leaf', label: 'Verifiable Outcomes' },
      ],
    },
  },
  { _id: false }
);

const SolutionsGridHeaderSchema = new Schema<ISolutionsGridHeader>(
  {
    eyebrow: { type: String, default: 'OUR SOLUTION CATEGORIES', trim: true },
    title: { type: String, default: 'Modular Solutions for Every Water Challenge', trim: true },
    description: {
      type: String,
      default:
        'Deploy individual modules or the unified platform to achieve complete water visibility, operational excellence, accountability, and verified outcomes.',
      trim: true,
    },
    calloutCard: {
      title: { type: String, default: 'Analytics & Insights Platform' },
      subtitle: { type: String, default: 'Enterprise Digital Backbone' },
      description: {
        type: String,
        default:
          'Enterprise-grade analytics, cross-facility benchmarking, risk modeling, and open APIs. Connects Veenero telemetry with your existing ERP, SCADA, and BI systems for a single source of truth.',
      },
      ctaText: { type: String, default: 'Explore Platform Capabilities' },
      ctaLink: { type: String, default: '/solutions/analytics-insights' },
      image: { type: String, default: '' },
      mediaPublicId: { type: String, default: '' },
    },
  },
  { _id: false }
);

const FeaturedSolutionSectionSchema = new Schema<IFeaturedSolutionSection>(
  {
    visible: { type: Boolean, default: true },
    eyebrow: { type: String, default: 'FEATURED SOLUTION', trim: true },
    title: { type: String, default: 'Real-time Water', trim: true },
    highlightedText: { type: String, default: 'Visibility Platform', trim: true },
    subtitle: { type: String, default: 'WATER VISIBILITY PLATFORM', trim: true },
    description: {
      type: String,
      default:
        'A comprehensive platform that provides end-to-end visibility of your water infrastructure with real-time data, alerts, and intelligent dashboards.',
      trim: true,
    },
    ctaText: { type: String, default: 'Explore Solution', trim: true },
    ctaLink: { type: String, default: '/solutions/water-visibility', trim: true },
    image: { type: String, default: '', trim: true },
    mediaPublicId: { type: String, default: '', trim: true },
    videoUrl: { type: String, default: '', trim: true },
    capabilities: {
      type: [
        {
          title: { type: String, required: true },
          desc: { type: String, required: true },
        },
      ],
      default: [
        { title: 'Real-time Monitoring', desc: 'Live flow, pressure, quality, and telemetry.' },
        { title: 'Intelligent Alerts', desc: 'AI-powered anomaly detection across networks.' },
        { title: 'Unified Dashboards', desc: 'All your water data in one place.' },
        { title: 'Audit-Ready Reports', desc: 'Automated, export-ready reports and insights.' },
      ],
    },
  },
  { _id: false }
);

const WaterIntelligenceFlowSchema = new Schema<IWaterIntelligenceFlow>(
  {
    visible: { type: Boolean, default: true },
    eyebrow: { type: String, default: 'HOW VEENERO SOLUTIONS WORK', trim: true },
    title: { type: String, default: 'From Sensor Signal to Verified Outcome', trim: true },
    description: {
      type: String,
      default:
        'A single integrated flow where sensing, secure connectivity, analytics, operational action, and verification all work together — closing the loop on every drop of water.',
      trim: true,
    },
    stages: {
      type: [
        {
          number: { type: String, default: '01' },
          icon: { type: String, default: '●' },
          title: { type: String, default: '' },
          description: { type: String, default: '' },
        },
      ],
      default: [
        {
          number: '01',
          icon: '●',
          title: 'Sense',
          description: 'Rugged edge sensors capture high-resolution flow, pressure, and quality data across every water asset.',
        },
        {
          number: '02',
          icon: '◌',
          title: 'Connect',
          description: 'Encrypted data streams pipe telemetry to the cloud through hardware-agnostic IoT gateways.',
        },
        {
          number: '03',
          icon: '◈',
          title: 'Understand',
          description: 'AI-powered analytics establish baselines, detect anomalies, and surface operational intelligence.',
        },
        {
          number: '04',
          icon: '◆',
          title: 'Act',
          description: 'Operational intelligence to optimize water usage, reduce losses, and drive measurable outcomes.',
        },
        {
          number: '05',
          icon: '✓',
          title: 'Verify',
          description: 'Certified savings are verified with cryptographic audit trails, ready for ESG reporting and compliance.',
        },
      ],
    },
    layers: {
      type: [
        {
          number: { type: String, default: '01' },
          title: { type: String, default: '' },
          subtitle: { type: String, default: '' },
          description: { type: String, default: '' },
          icon: { type: String, default: 'Cpu' },
          capabilities: { type: [String], default: [] },
        },
      ],
      default: [
        {
          number: '01',
          title: 'Sense & Ingest',
          subtitle: 'Edge Telemetry & IoT Gateways',
          description:
            'High-precision non-invasive and inline sensors measure flow, pressure, temperature, and quality across distributed facilities with zero blindspots.',
          icon: 'Cpu',
          capabilities: [
            'Multi-source hardware agnostic ingestion',
            'Ultra-low latency edge telemetry',
            'Encrypted local data buffering',
          ],
        },
        {
          number: '02',
          title: 'Stream & Validate',
          subtitle: 'Real-Time Data Pipeline',
          description:
            'Continuous data streaming with cryptographic integrity checks, noise filtering, and automated validation to ensure every data packet is authentic.',
          icon: 'Activity',
          capabilities: [
            'Tamper-evident time-series storage',
            'Automated anomaly validation',
            'Scalable microservices architecture',
          ],
        },
        {
          number: '03',
          title: 'Analyze & Optimize',
          subtitle: 'AI Water Intelligence Engine',
          description:
            'Machine learning models establish consumption baselines, detect micro-leaks, flag operational anomalies, and calculate multi-site benchmarks.',
          icon: 'BarChart3',
          capabilities: [
            'Predictive consumption forecasting',
            'Automated threshold alert triggers',
            'Multi-facility efficiency benchmarking',
          ],
        },
        {
          number: '04',
          title: 'Verify & Govern',
          subtitle: 'Audit-Ready ESG & Compliance',
          description:
            'Verification-first dashboards and export pipelines generate traceable audit trails for sustainability governance and compliance reporting.',
          icon: 'ShieldCheck',
          capabilities: [
            'One-click audit trail exports',
            'Role-based enterprise permissions',
            'Open REST / SCADA / ERP API connectors',
          ],
        },
      ],
    },
  },
  { _id: false }
);

const SolutionsCTASchema = new Schema<ISolutionsCTA>(
  {
    visible: { type: Boolean, default: true },
    eyebrow: { type: String, default: 'READY TO GET STARTED', trim: true },
    title: { type: String, default: 'Ready to Make', trim: true },
    highlightedText: { type: String, default: 'Water Visible?', trim: true },
    description: {
      type: String,
      default:
        'Connect with our water engineers to evaluate your facility network, review architecture specifications, and explore live platform capabilities.',
      trim: true,
    },
    primaryButtonText: { type: String, default: 'Get in Touch', trim: true },
    primaryButtonLink: { type: String, default: '/contact', trim: true },
    secondaryButtonText: { type: String, default: 'Explore Our Approach', trim: true },
    secondaryButtonLink: { type: String, default: '/approach', trim: true },
  },
  { _id: false }
);

const SolutionsSEOSchema = new Schema<ISolutionsSEO>(
  {
    metaTitle: {
      type: String,
      default: 'Solutions | Veenero - Water Intelligence Infrastructure',
      trim: true,
    },
    metaDescription: {
      type: String,
      default:
        'A complete digital infrastructure layer for water management—unifying rugged edge telemetry, real-time cloud analytics, and verification-ready governance into one seamless platform.',
      trim: true,
    },
  },
  { _id: false }
);

// ─── Default Categories Seed Data ─────────────────────────────────────────────

const DEFAULT_CATEGORIES: ISolutionCategory[] = [
  {
    key: 'Water Visibility',
    displayLabel: 'Water Visibility',
    slug: 'water-visibility',
    description: 'Real-time monitoring of water assets, flow, quality, and infrastructure across locations.',
    icon: 'Eye',
    image: '',
    pillarKeys: ['Water Visibility'],
    order: 1,
    isActive: true,
  },
  {
    key: 'Water Intelligence',
    displayLabel: 'Operational Intelligence',
    slug: 'operational-intelligence',
    description: 'Streamline operations with automation, anomaly detection, and actionable intelligence.',
    icon: 'Cpu',
    image: '',
    pillarKeys: ['Water Intelligence'],
    order: 2,
    isActive: true,
  },
  {
    key: 'Water Optimization',
    displayLabel: 'Water Accountability',
    slug: 'water-accountability',
    description: 'Ensure transparency, compliance, and performance across utilities and operations.',
    icon: 'ShieldCheck',
    image: '',
    pillarKeys: ['Water Optimization'],
    order: 3,
    isActive: true,
  },
  {
    key: 'Water Accountability',
    displayLabel: 'Water Verification',
    slug: 'water-verification',
    description: 'Verify water quality, flow, and impact with certified data and audit-ready reports.',
    icon: 'FileCheck2',
    image: '',
    pillarKeys: ['Water Accountability'],
    order: 4,
    isActive: true,
  },
  {
    key: 'Infrastructure Layer',
    displayLabel: 'Analytics & Insights',
    slug: 'analytics-insights',
    description: 'Deep-dive analytics, benchmarking, forecasting, and enterprise data platform capabilities.',
    icon: 'BarChart3',
    image: '',
    pillarKeys: ['Infrastructure Layer', 'Resilience Management'],
    order: 5,
    isActive: true,
  },
];

// ─── Default Solutions Seed Data ──────────────────────────────────────────────

const DEFAULT_SOLUTIONS: ISolutionItem[] = [
  {
    id: 'sense',
    slug: 'water-visibility',
    title: 'Veenero Sense',
    tagline: 'Water Visibility & Telemetry',
    description:
      'Rugged edge sensing infrastructure that captures high-resolution water data across facilities, pipelines, and distributed assets in real time.',
    icon: 'Radio',
    pillar: 'Water Visibility',
    categoryKey: 'Water Visibility',
    features: [
      'Real-time continuous flow & pressure capture',
      'Multi-asset telemetry aggregation',
      'Battery-optimized edge gateway compatibility',
      'Zero-downtime over-the-air firmware updates',
    ],
    metrics: {
      value: 'Sub-second',
      label: 'Telemetry Ingestion Rate',
    },
    order: 1,
    isActive: true,
  },
  {
    id: 'intelligence',
    slug: 'operational-intelligence',
    title: 'Veenero Intelligence',
    tagline: 'AI Analytics & Anomaly Detection',
    description:
      'Transforms raw telemetry streams into actionable operational intelligence—detecting losses, pressure spikes, and usage anomalies before costs escalate.',
    icon: 'Sparkles',
    pillar: 'Water Intelligence',
    categoryKey: 'Water Intelligence',
    features: [
      'Automated micro-leak & burst detection',
      'Dynamic baseline & consumption pattern modeling',
      'Instant multi-channel alert dispatch (SMS, Email, Webhook)',
      'Root-cause diagnostic intelligence',
    ],
    metrics: {
      value: '24/7',
      label: 'Automated Anomaly Surveillance',
    },
    order: 2,
    isActive: true,
  },
  {
    id: 'insights',
    slug: 'water-accountability',
    title: 'Veenero Insights',
    tagline: 'Benchmarking & Efficiency',
    description:
      'Compare efficiency across multiple sites, production lines, and regional zones to identify optimization opportunities and track conservation ROI.',
    icon: 'LineChart',
    pillar: 'Water Optimization',
    categoryKey: 'Water Optimization',
    features: [
      'Cross-facility performance benchmarking',
      'Water efficiency index scoring (WEI)',
      'Departmental sub-meter allocation',
      'Quantified intervention recommendations',
    ],
    metrics: {
      value: 'Multi-site',
      label: 'Benchmarking & Ranking',
    },
    order: 3,
    isActive: true,
  },
  {
    id: 'verification',
    slug: 'water-verification',
    title: 'Water Verification',
    tagline: 'Audit-Ready ESG Governance',
    description:
      'A verification-first data layer providing cryptographically verifiable proof of water usage, savings, and compliance for corporate sustainability disclosures.',
    icon: 'FileCheck2',
    pillar: 'Water Accountability',
    categoryKey: 'Water Accountability',
    features: [
      'Traceable audit trails & provenance logs',
      'BRSR, GRI, and CDP compliant export formats',
      'Third-party auditor verification access',
      'Historical assurance records',
    ],
    metrics: {
      value: '100%',
      label: 'Traceable Audit Assurance',
    },
    order: 4,
    isActive: true,
  },
  {
    id: 'platform',
    slug: 'analytics-insights',
    title: 'Water Data Platform',
    tagline: 'Enterprise Digital Backbone',
    description:
      'The unified digital layer connecting legacy SCADA, modern IoT networks, and enterprise ERP systems into a centralized single source of truth.',
    icon: 'Layers',
    pillar: 'Infrastructure Layer',
    categoryKey: 'Infrastructure Layer',
    features: [
      'Enterprise REST & GraphQL APIs',
      'SCADA, BMS, and PLC interoperability',
      'Multi-tenant role-based access control (RBAC)',
      'High-throughput time-series data warehouse',
    ],
    metrics: {
      value: 'Open API',
      label: 'Enterprise SCADA & ERP Ready',
    },
    order: 5,
    isActive: true,
  },
  {
    id: 'risk',
    slug: 'analytics-insights',
    title: 'Water Risk Engine',
    tagline: 'Resilience & Continuity',
    description:
      'Quantify local watershed stress, seasonal supply vulnerabilities, and infrastructure failure risks to safeguard business continuity.',
    icon: 'ShieldAlert',
    pillar: 'Resilience Management',
    categoryKey: 'Infrastructure Layer',
    features: [
      'Geospatial water risk overlay mapping',
      'Seasonal supply disruption scenario modeling',
      'Regulatory compliance risk tracking',
    ],
    metrics: {
      value: 'Watershed',
      label: 'Geospatial Vulnerability Scoring',
    },
    order: 6,
    isActive: true,
  },
];

// ─── Main SolutionsPageSettings Schema ────────────────────────────────────────

const SolutionsPageSettingsSchema = new Schema<ISolutionsPageSettings>(
  {
    hero: { type: SolutionsHeroSchema, default: () => ({}) },
    intro: { type: SolutionsIntroSchema, default: () => ({}) },
    gridHeader: { type: SolutionsGridHeaderSchema, default: () => ({}) },
    categories: { type: [SolutionCategorySchema], default: () => DEFAULT_CATEGORIES },
    solutions: { type: [SolutionItemSchema], default: () => DEFAULT_SOLUTIONS },
    featuredSolution: { type: FeaturedSolutionSectionSchema, default: () => ({}) },
    flow: { type: WaterIntelligenceFlowSchema, default: () => ({}) },
    cta: { type: SolutionsCTASchema, default: () => ({}) },
    seo: { type: SolutionsSEOSchema, default: () => ({}) },
    isPublished: { type: Boolean, default: true },
    lastUpdatedBy: { type: String, default: 'system' },
  },
  { timestamps: true }
);

export const SolutionsPageSettings = mongoose.model<ISolutionsPageSettings>(
  'SolutionsPageSettings',
  SolutionsPageSettingsSchema
);

export default SolutionsPageSettings;
