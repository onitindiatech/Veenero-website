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
        id: "sense",
        title: "Veenero Sense",
        tagline: "Water Visibility & Telemetry",
        description:
          "Rugged edge sensing infrastructure that captures high-resolution water data across facilities, pipelines, and distributed assets in real time.",
        icon: "Radio",
        pillar: "Water Visibility",
        features: [
          "Real-time continuous flow & pressure capture",
          "Multi-asset telemetry aggregation",
          "Battery-optimized edge gateway compatibility",
          "Zero-downtime over-the-air firmware updates",
        ],
        metrics: {
          value: "Sub-second",
          label: "Telemetry Ingestion Rate",
        },
      },
      {
        id: "intelligence",
        title: "Veenero Intelligence",
        tagline: "AI Analytics & Anomaly Detection",
        description:
          "Transforms raw telemetry streams into actionable operational intelligence—detecting losses, pressure spikes, and usage anomalies before costs escalate.",
        icon: "Sparkles",
        pillar: "Water Intelligence",
        features: [
          "Automated micro-leak & burst detection",
          "Dynamic baseline & consumption pattern modeling",
          "Instant multi-channel alert dispatch (SMS, Email, Webhook)",
          "Root-cause diagnostic intelligence",
        ],
        metrics: {
          value: "24/7",
          label: "Automated Anomaly Surveillance",
        },
      },
      {
        id: "insights",
        title: "Veenero Insights",
        tagline: "Benchmarking & Efficiency",
        description:
          "Compare efficiency across multiple sites, production lines, and regional zones to identify optimization opportunities and track conservation ROI.",
        icon: "LineChart",
        pillar: "Water Optimization",
        features: [
          "Cross-facility performance benchmarking",
          "Water efficiency index scoring (WEI)",
          "Departmental sub-meter allocation",
          "Quantified intervention recommendations",
        ],
        metrics: {
          value: "Multi-site",
          label: "Benchmarking & Ranking",
        },
      },
      {
        id: "verification",
        title: "Water Verification",
        tagline: "Audit-Ready ESG Governance",
        description:
          "A verification-first data layer providing cryptographically verifiable proof of water usage, savings, and compliance for corporate sustainability disclosures.",
        icon: "FileCheck2",
        pillar: "Water Accountability",
        features: [
          "Traceable audit trails & provenance logs",
          "BRSR, GRI, and CDP compliant export formats",
          "Third-party auditor verification access",
          "Historical assurance records",
        ],
        metrics: {
          value: "100%",
          label: "Traceable Audit Assurance",
        },
      },
      {
        id: "platform",
        title: "Water Data Platform",
        tagline: "Enterprise Digital Backbone",
        description:
          "The unified digital layer connecting legacy SCADA, modern IoT networks, and enterprise ERP systems into a centralized single source of truth.",
        icon: "Layers",
        pillar: "Infrastructure Layer",
        features: [
          "Enterprise REST & GraphQL APIs",
          "SCADA, BMS, and PLC interoperability",
          "Multi-tenant role-based access control (RBAC)",
          "High-throughput time-series data warehouse",
        ],
        metrics: {
          value: "Open API",
          label: "Enterprise SCADA & ERP Ready",
        },
      },
      {
        id: "risk",
        title: "Water Risk Engine",
        tagline: "Resilience & Continuity",
        description:
          "Quantify local watershed stress, seasonal supply vulnerabilities, and infrastructure failure risks to safeguard business continuity.",
        icon: "ShieldAlert",
        pillar: "Resilience Management",
        features: [
          "Geospatial water risk overlay mapping",
          "Seasonal supply disruption scenario modeling",
          "Regulatory compliance risk tracking",
          "Business continuity contingency playbooks",
        ],
        metrics: {
          value: "Proactive",
          label: "Risk & Continuity Indexing",
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
