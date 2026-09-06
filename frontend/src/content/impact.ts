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

export interface SustainabilityContent {
  eyebrow: string;
  title: string;
  description: string;
  pillars: Array<{
    title: string;
    description: string;
  }>;
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
  sustainability: SustainabilityContent;
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
    eyebrow: "MEASURING WHAT MATTERS",
    title: "Turning Water Intelligence Into Measurable Impact",
    description:
      "Water Visibility creates Water Accountability. Veenero helps organizations measure, monitor, optimize, benchmark, and verify water usage—transforming unmetered blindspots into evidence-based sustainability and verifiable compliance.",
    primaryCtaText: "Explore Impact",
    secondaryCtaText: "View Metrics",
  },
  outcomes: {
    eyebrow: "IMPACT METRICS",
    title: "Quantified Performance Across 4 Core Areas",
    description:
      "Our water intelligence infrastructure delivers measurable value across water visibility, waste reduction, operational efficiency, and ESG verification.",
    pillars: [
      {
        value: "100%",
        label: "Water Visibility",
        description:
          "Real-time continuous measurement across assets, sites, and operational systems—eliminating unmetered blindspots.",
        icon: "Eye",
        tag: "Water Visibility",
      },
      {
        value: "40%",
        label: "Waste Reduction",
        description:
          "Targeted interventions, instant micro-leak alerts, and pressure optimization to curb non-revenue water losses.",
        icon: "TrendingDown",
        tag: "Waste Reduction",
      },
      {
        value: "25%+",
        label: "Operational Efficiency",
        description:
          "Automated pumping schedule optimization, energy savings, and cross-site efficiency benchmarking.",
        icon: "TrendingUp",
        tag: "Operational Efficiency",
      },
      {
        value: "Audit-Ready",
        label: "Accountability & Verification",
        description:
          "Verification-ready data layers with traceable audit trails for ESG governance and regulatory compliance.",
        icon: "ShieldCheck",
        tag: "Accountability & Verification",
      },
    ],
  },
  storyline: {
    eyebrow: "IMPACT JOURNEY",
    title: "Measure → Understand → Optimize → Verify → Improve",
    description:
      "A structured 5-step visual roadmap guiding organizations from physical flow telemetry to continuous boardroom governance.",
    steps: [
      {
        number: "01",
        stage: "Measure",
        title: "Telemetry & Edge Sensing",
        description:
          "Deploy rugged edge sensors across pipes, pumps, tanks, and treatment facilities to measure every drop in real time.",
        outcome: "100% telemetry coverage with zero blindspots.",
        icon: "Radio",
      },
      {
        number: "02",
        stage: "Understand",
        title: "Baseline & Anomaly Analysis",
        description:
          "AI analytics establish consumption baselines, detect pressure drops, and analyze usage patterns across connected assets.",
        outcome: "Contextual understanding of network health.",
        icon: "Search",
      },
      {
        number: "03",
        stage: "Optimize",
        title: "Targeted Interventions",
        description:
          "Execute instant leak resolution, pressure zone balancing, and automated pumping schedules to eliminate wasteful loss.",
        outcome: "Immediate reduction in unmetered water loss.",
        icon: "Sliders",
      },
      {
        number: "04",
        stage: "Verify",
        title: "Audit-Grade Assurance",
        description:
          "Generate tamper-evident provenance logs and traceable audit trails for third-party ESG governance and compliance.",
        outcome: "100% audit-ready reporting confidence.",
        icon: "FileCheck2",
      },
      {
        number: "05",
        stage: "Improve",
        title: "Long-Term Water Resilience",
        description:
          "Continuously refine conservation targets, benchmark multi-site assets, and build a water-positive future.",
        outcome: "Sustainable, resilient infrastructure.",
        icon: "Sparkles",
      },
    ],
  },
  ecosystem: {
    eyebrow: "REAL-WORLD IMPACT",
    title: "Creating Value Across Industries & Infrastructure",
    description:
      "Veenero's impact reaches across municipal distribution networks, heavy industrial facilities, commercial real estate, and regional water networks.",
    domains: [
      {
        title: "Municipalities & Utilities",
        icon: "Landmark",
        description:
          "Equip city water distribution networks with district metering, pressure management, and non-revenue water (NRW) reduction intelligence.",
        impactPoints: [
          "District Metered Area (DMA) telemetry",
          "Distribution leak & burst prevention",
          "Equitable civic drinking water allocation",
        ],
      },
      {
        title: "Industrial Facilities",
        icon: "Factory",
        description:
          "Monitor process water loops, cooling tower evaporation, and effluent discharge to ensure zero unmetered loss and compliance.",
        impactPoints: [
          "Cooling tower cycle optimization",
          "Process water balance & recycling",
          "Effluent discharge compliance monitoring",
        ],
      },
      {
        title: "Commercial Operations",
        icon: "Building",
        description:
          "Gain granular visibility across multi-tenant buildings, HVAC systems, and landscape irrigation to lower utility bills.",
        impactPoints: [
          "Tenant sub-metering & billing allocation",
          "HVAC chiller loop efficiency",
          "Overnight leak & overflow mitigation",
        ],
      },
      {
        title: "Water Networks & Aquifers",
        icon: "Globe",
        description:
          "Preserve shared groundwater reservoirs and local aquifers by reducing excessive drawdown through precision demand forecasting.",
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
  sustainability: {
    eyebrow: "RESPONSIBLE INFRASTRUCTURE",
    title: "Connecting Water Intelligence to Long-Term Sustainability",
    description:
      "Water security is the foundation of economic resilience. Veenero bridges the gap between physical water management and ESG governance.",
    pillars: [
      {
        title: "Audit-Ready ESG Disclosure",
        description:
          "Generate verifiable, tamper-evident data trails designed to satisfy rigorous BRSR, GRI, and CDP sustainability reporting frameworks.",
      },
      {
        title: "Resource Efficiency & Decarbonization",
        description:
          "Optimizing water pumping schedules reduces energy consumption and operational carbon emissions across municipal and industrial assets.",
      },
      {
        title: "Aquifer & Watershed Preservation",
        description:
          "Preventing excessive groundwater extraction safeguards regional aquifers and secures water availability for local communities.",
      },
    ],
  },
  cta: {
    title: "Making Every Litre Measurable & Meaningful",
    description:
      "Partner with Veenero to deploy verification-ready water intelligence across your facility network.",
    primaryButtonText: "Partner with Veenero",
    primaryButtonLink: "/contact",
    secondaryButtonText: "Explore Solutions Suite",
    secondaryButtonLink: "/solutions",
  },
};
