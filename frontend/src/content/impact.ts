// Types for Impact static content

export interface ImpactPillar {
  value: string;
  label: string;
  description: string;
  icon: string;
  tag: string;
}

export interface StorylineStep {
  number: string;
  stage: string;
  title: string;
  description: string;
  outcome: string;
  icon: string;
}

export interface EcosystemDomain {
  title: string;
  icon: string;
  description: string;
  impactPoints: string[];
}

export interface ImpactContent {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCtaText: string;
    secondaryCtaText: string;
  };
  outcomes: {
    eyebrow: string;
    title: string;
    description: string;
    pillars: ImpactPillar[];
  };
  storyline: {
    eyebrow: string;
    title: string;
    description: string;
    steps: StorylineStep[];
  };
  ecosystem: {
    eyebrow: string;
    title: string;
    description: string;
    domains: EcosystemDomain[];
    quote: {
      text: string;
      author: string;
      role: string;
      organization: string;
    };
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

export const impactPageContent: ImpactContent = {
  hero: {
    eyebrow: "MEASURABLE OUTCOMES",
    title: "Making Every Litre Visible & Accountable",
    description:
      "Water Visibility creates Water Accountability. Veenero helps organizations measure, monitor, optimize, benchmark, and verify water usage—transforming unmetered blindspots into evidence-based sustainability and verifiable compliance.",
    primaryCtaText: "Explore Outcomes",
    secondaryCtaText: "Impact Journey",
  },
  outcomes: {
    eyebrow: "CORE IMPACT PILLARS",
    title: "Real-World Value Delivered Across Networks",
    description:
      "Our water intelligence infrastructure transforms how enterprises and public utilities govern their most vital resource.",
    pillars: [
      {
        value: "100%",
        label: "Visibility Coverage",
        description:
          "Real-time continuous measurement across assets, sites, and operational systems—eliminating blindspots.",
        icon: "Droplets",
        tag: "Water Visibility",
      },
      {
        value: "Optimized",
        label: "Water Efficiency Gains",
        description:
          "Targeted interventions, instant micro-leak alerts, and actionable recommendations backed by verified analytics.",
        icon: "TrendingUp",
        tag: "Water Intelligence",
      },
      {
        value: "Pan-India",
        label: "Network Benchmarking",
        description:
          "Comparative peer insights across facilities to prioritize operational risks and capital interventions.",
        icon: "Globe",
        tag: "Cross-Site Intelligence",
      },
      {
        value: "Audit-Ready",
        label: "Verified Reporting",
        description:
          "Verification-ready data layers with traceable audit trails for ESG governance and regulatory compliance.",
        icon: "Award",
        tag: "Water Accountability",
      },
    ],
  },
  storyline: {
    eyebrow: "THE IMPACT JOURNEY",
    title: "From Telemetry to Verifiable Conservation",
    description:
      "How Veenero's digital infrastructure layer guides organizations from raw data collection to boardroom governance.",
    steps: [
      {
        number: "01",
        stage: "Sense & Unify",
        title: "Eliminating Water Blindspots",
        description:
          "Deploying rugged edge telemetry across distributed nodes to capture continuous flow, pressure, and volume data.",
        outcome: "100% real-time data visibility across all facility assets.",
        icon: "Radio",
      },
      {
        number: "02",
        stage: "Detect & Optimize",
        title: "Mitigating Unaccounted Loss",
        description:
          "AI analytics detect bursts, pressure drops, and baseline anomalies the instant they manifest, preventing costly losses.",
        outcome: "Rapid anomaly resolution before water loss compounds.",
        icon: "Sparkles",
      },
      {
        number: "03",
        stage: "Benchmark & Allocate",
        title: "Driving Operational Accountability",
        description:
          "Sub-metering and cross-facility indexing assign clear accountability and reveal hidden conservation opportunities.",
        outcome: "Data-driven efficiency targets for facility teams.",
        icon: "BarChart3",
      },
      {
        number: "04",
        stage: "Verify & Report",
        title: "Proving Impact with Assurance",
        description:
          "Generating cryptographic, tamper-evident audit logs designed for ESG disclosures, BRSR compliance, and green ratings.",
        outcome: "Zero-guesswork, verification-first compliance.",
        icon: "FileCheck2",
      },
    ],
  },
  ecosystem: {
    eyebrow: "BROADER ECOSYSTEM IMPACT",
    title: "Transforming Water Management Across Sectors",
    description:
      "Veenero's impact reaches beyond individual buildings to strengthen regional watershed resilience and corporate governance.",
    domains: [
      {
        title: "Enterprise ESG Governance",
        icon: "Building2",
        description:
          "Empowering corporations to meet stringent ESG disclosure requirements (BRSR, GRI, CDP) with verifiable, audit-grade water accounting.",
        impactPoints: [
          "Verifiable water stewardship proof",
          "Automated ESG compliance exports",
          "Transparent board-level reporting",
        ],
      },
      {
        title: "Municipal & Utility Resilience",
        icon: "Landmark",
        description:
          "Helping city water utilities curb Non-Revenue Water (NRW), stabilize district pressures, and safeguard civic drinking water distribution.",
        impactPoints: [
          "District Metered Area (DMA) telemetry",
          "Distribution loss prevention",
          "Equitable municipal water allocation",
        ],
      },
      {
        title: "Industrial Resource Stewardship",
        icon: "Factory",
        description:
          "Enabling manufacturing, power, and pharmaceutical plants to optimize cooling towers, effluent treatment, and zero liquid discharge (ZLD).",
        impactPoints: [
          "Process water recycling oversight",
          "Effluent compliance verification",
          "Cooling loop efficiency gains",
        ],
      },
      {
        title: "Civic & Watershed Protection",
        icon: "HeartHandshake",
        description:
          "Preserving shared groundwater reservoirs and local aquifers by reducing excessive drawdown through precision demand forecasting.",
        impactPoints: [
          "Aquifer drawdown prevention",
          "Watershed vulnerability tracking",
          "Sustainable community water security",
        ],
      },
    ],
    quote: {
      text: "Veenero gave us Water Visibility we could finally trust. With benchmarked intelligence and verification-ready reporting, our teams moved from estimates to evidence—faster decisions, stronger accountability.",
      author: "Sarah Chen",
      role: "Sustainability & Water Lead",
      organization: "Enterprise Infrastructure Partner",
    },
  },
  cta: {
    title: "Ready to Create Measurable Water Impact?",
    description:
      "Partner with Veenero to deploy verification-ready water intelligence across your facility network.",
    primaryButtonText: "Partner with Veenero",
    primaryButtonLink: "/contact",
    secondaryButtonText: "Explore Solutions Suite",
    secondaryButtonLink: "/solutions",
  },
};
