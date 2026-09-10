// Types for Solutions static content

export interface ArchitectureLayer {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  capabilities: string[];
}

export interface SolutionItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  icon: string;
  pillar: string;
  features: string[];
  metrics?: {
    value: string;
    label: string;
  };
}

export interface IndustryApplication {
  title: string;
  icon: string;
  description: string;
  useCases: string[];
}

export interface SolutionsContent {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCtaText: string;
    secondaryCtaText: string;
  };
  architecture: {
    eyebrow: string;
    title: string;
    description: string;
    layers: ArchitectureLayer[];
  };
  solutionsGrid: {
    eyebrow: string;
    title: string;
    description: string;
    solutions: SolutionItem[];
  };
  industries: {
    eyebrow: string;
    title: string;
    description: string;
    list: IndustryApplication[];
  };
  cta: {
    title: string;
    description: string;
    primaryButtonText: string;
    primaryButtonLink: string;
    secondaryButtonText: string;
    secondaryButtonLink: string;
  };
}

export const solutionsPageContent: SolutionsContent = {
  hero: {
    eyebrow: "VEENERO SOLUTION SUITE",
    title: "Intelligent Water Infrastructure for Enterprise & Cities",
    description:
      "A complete digital infrastructure layer for water management—unifying rugged edge telemetry, real-time cloud analytics, and verification-ready governance into one seamless platform.",
    primaryCtaText: "Explore Solutions",
    secondaryCtaText: "Platform Architecture",
  },
  architecture: {
    eyebrow: "PLATFORM ARCHITECTURE",
    title: "How Veenero's Water Intelligence Operates",
    description:
      "From physical flow in the pipe to board-level ESG reporting, our 4-layer architecture ensures end-to-end telemetry fidelity and verifiable governance.",
    layers: [
      {
        number: "01",
        title: "Sense & Ingest",
        subtitle: "Edge Telemetry & IoT Gateways",
        description:
          "High-precision non-invasive and inline sensors measure flow, pressure, temperature, and quality across distributed facilities with zero blindspots.",
        icon: "Cpu",
        capabilities: [
          "Multi-source hardware agnostic ingestion",
          "Ultra-low latency edge telemetry",
          "Encrypted local data buffering",
        ],
      },
      {
        number: "02",
        title: "Stream & Validate",
        subtitle: "Real-Time Data Pipeline",
        description:
          "Continuous data streaming with cryptographic integrity checks, noise filtering, and automated validation to ensure every data packet is authentic.",
        icon: "Activity",
        capabilities: [
          "Tamper-evident time-series storage",
          "Automated anomaly validation",
          "Scalable microservices architecture",
        ],
      },
      {
        number: "03",
        title: "Analyze & Optimize",
        subtitle: "AI Water Intelligence Engine",
        description:
          "Machine learning models establish consumption baselines, detect micro-leaks, flag operational anomalies, and calculate multi-site benchmarks.",
        icon: "BarChart3",
        capabilities: [
          "Predictive consumption forecasting",
          "Automated threshold alert triggers",
          "Multi-facility efficiency benchmarking",
        ],
      },
      {
        number: "04",
        title: "Verify & Govern",
        subtitle: "Audit-Ready ESG & Compliance",
        description:
          "Verification-first dashboards and export pipelines generate traceable audit trails for sustainability governance and compliance reporting.",
        icon: "ShieldCheck",
        capabilities: [
          "One-click audit trail exports",
          "Role-based enterprise permissions",
          "Open REST / SCADA / ERP API connectors",
        ],
      },
    ],
  },
  solutionsGrid: {
    eyebrow: "PRODUCT SUITE",
    title: "Modular Solutions for Every Water Asset",
    description:
      "Deploy individual modules or the unified platform to achieve complete water visibility, accountability, and verification.",
    solutions: [
      {
        id: "aqua-saver",
        title: "Aqua Saver",
        tagline: "Core Conservation Device & Software",
        description:
          "Our flagship water conservative device and 3D-Module combining hardware-level leakage mitigation with software management to reduce water waste.",
        icon: "Droplets",
        pillar: "Core Solution",
        features: [
          "Aqua Saver 3D-Module architecture",
          "Comprehensive leak identification across pipes, taps, and tanks",
          "Continuous distribution surveillance",
          "Automated usage and loss reporting",
        ],
        metrics: {
          value: "Core",
          label: "Hardware + Software",
        },
      },
      {
        id: "water-quality-assessment",
        title: "Water Quality Assessment",
        tagline: "Purity & Quality Evaluation",
        description:
          "Automated evaluation of water quality parameters to protect health, ensure potable standards, and detect contamination early.",
        icon: "ShieldCheck",
        pillar: "Quality Evaluation",
        features: [
          "Quality parameter tracking",
          "Contamination alerts",
          "Standards compliance reporting",
          "Distribution quality verification",
        ],
        metrics: {
          value: "Continuous",
          label: "Quality Surveillance",
        },
      },
      {
        id: "water-pumping-automation",
        title: "Water Pumping Automation",
        tagline: "Automated Motor & Pump Controls",
        description:
          "Automated on/off controls for pump motor systems based on real-time reservoir levels, eliminating overflows and manual errors.",
        icon: "Cpu",
        pillar: "Automation",
        features: [
          "Automated motor on/off scheduling",
          "Overhead tank overflow prevention",
          "Dry-run motor protection",
          "Energy demand optimization",
        ],
        metrics: {
          value: "Automated",
          label: "Pumping Control",
        },
      },
      {
        id: "water-tracking-informatics",
        title: "Water Tracking & Informatics",
        tagline: "Usage Analytics & Conservation",
        description:
          "Track precise water utilization across facilities, sectors, and societies with detailed usage analytics and conservation guidance.",
        icon: "Activity",
        pillar: "Informatics",
        features: [
          "Detailed utilization reports",
          "Sector-specific distribution analytics",
          "Actionable conservation steps",
          "Cross-facility usage comparison",
        ],
        metrics: {
          value: "Informatics",
          label: "Usage Visibility",
        },
      },
      {
        id: "water-credits",
        title: "Water Credits",
        tagline: "Incentive-Driven Conservation (In Development)",
        description:
          "An innovative water credit application concept where users earn coins based on how much water they consume under conservation guidelines.",
        icon: "Sparkles",
        pillar: "Application Concept",
        features: [
          "Coin-earning conservation incentives",
          "Prescribed consumption guidelines",
          "User engagement and awareness",
          "Digital conservation incentives",
        ],
        metrics: {
          value: "Concept",
          label: "In Development",
        },
      },
      {
        id: "leak-identification",
        title: "Leak Identification & Reporting",
        tagline: "Tap, Pipe, Seepage & Tank Leak Detection",
        description:
          "Structured detection, characteristic analysis, and resolution reporting for tap leaks, seepage, pipe bursts, and tank overflow issues.",
        icon: "Search",
        pillar: "Leak Resolution",
        features: [
          "Tap leak isolation",
          "Wall seepage identification",
          "Pipeline fracture detection",
          "Tank overflow and breach reporting",
        ],
        metrics: {
          value: "Targeted",
          label: "Leak Diagnostics",
        },
      },
    ],
  },
  industries: {
    eyebrow: "DEPLOYMENT SCENARIOS",
    title: "Engineered for Diverse Operational Environments",
    description:
      "Veenero's architecture scales seamlessly across heavy manufacturing, commercial campuses, and municipal infrastructure.",
    list: [
      {
        title: "Manufacturing & Industrial",
        icon: "Factory",
        description:
          "Monitor process water loops, cooling tower evaporation, and effluent discharge to ensure zero unmetered loss and regulatory compliance.",
        useCases: [
          "Cooling tower cycle optimization",
          "Process water balance & recycling",
          "Effluent discharge compliance monitoring",
        ],
      },
      {
        title: "Municipalities & Utilities",
        icon: "Building2",
        description:
          "Equip city water distribution networks with district metering, pressure zone management, and non-revenue water (NRW) reduction intelligence.",
        useCases: [
          "Non-Revenue Water (NRW) reduction",
          "District Metered Area (DMA) management",
          "Reservoir & booster pump telemetry",
        ],
      },
      {
        title: "Commercial Campuses & Real Estate",
        icon: "Building",
        description:
          "Gain granular visibility across multi-tenant buildings, HVAC systems, and landscape irrigation to lower utility bills and boost green ratings.",
        useCases: [
          "Tenant sub-metering & billing allocation",
          "HVAC chiller loop efficiency",
          "Overnight leak & overflow mitigation",
        ],
      },
      {
        title: "Data Centers & Critical Infrastructure",
        icon: "Server",
        description:
          "Ensure continuous uptime and optimize Water Usage Effectiveness (WUE) across closed-loop and evaporative cooling architectures.",
        useCases: [
          "Water Usage Effectiveness (WUE) tracking",
          "Chilled water loop integrity monitoring",
          "Redundancy & failover water telemetry",
        ],
      },
    ],
  },
  cta: {
    title: "Ready to Deploy Intelligent Water Infrastructure?",
    description:
      "Connect with our water engineers to evaluate your facility network, review architecture specifications, and explore live platform capabilities.",
    primaryButtonText: "Schedule Architecture Demo",
    primaryButtonLink: "/contact",
    secondaryButtonText: "Learn Our Approach",
    secondaryButtonLink: "/approach",
  },
};
