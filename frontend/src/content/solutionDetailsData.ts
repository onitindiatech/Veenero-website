import { solutionsPageContent } from "@/content/solutions";
import waterVisibilityImg from "@/assets/about/about-journey-water-infrastructure.webp";
import operationalIntelImg from "@/assets/about/about-industrial-water-system.webp";
import waterAccountImg from "@/assets/about/about-field-verification.webp";
import waterVerifyImg from "@/assets/about/about-vision-water-infrastructure.webp";
import analyticsImg from "@/assets/about/about-real-time-analytics.webp";

export interface HeroMetric {
  title: string;
  value: string;
  rawValue: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  subtext: string;
  change?: string;
  isPositive?: boolean;
  type: "sparkline" | "gauge" | "counter" | "status";
  sparklineData?: number[];
  gaugePercent?: number;
}

export interface CapabilityCard {
  icon: string;
  title: string;
  description: string;
}

export interface HowItWorksStep {
  step: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
  tag?: string;
}

export interface UseCaseItem {
  icon: string;
  title: string;
  description: string;
  stats?: string;
  image?: string;
}

export interface BenefitMetric {
  target: number;
  decimals?: number;
  prefix?: string;
  suffix: string;
  displayRange: string;
  label: string;
  description: string;
}

export interface SolutionDetailData {
  slug: string;
  badge: string;
  title: string;
  tagline: {
    line1: string;
    line2: string;
    line3: string;
  };
  heroDescription: string;
  heroPills: string[];
  heroImage: string;
  heroMetrics: HeroMetric[];
  
  overview: {
    eyebrow: string;
    title: string;
    highlightTitle?: string;
    description: string;
    blocks: {
      title: string;
      description: string;
      icon: string;
    }[];
  };

  howItWorks: {
    eyebrow: string;
    title: string;
    description: string;
    steps: HowItWorksStep[];
  };

  techSection: {
    eyebrow: string;
    title: string;
    subtitle: string;
    description: string;
    diagramSteps: {
      label: string;
      desc: string;
      icon: string;
    }[];
  };

  capabilities: {
    eyebrow: string;
    title: string;
    description: string;
    items: CapabilityCard[];
  };

  features: {
    eyebrow: string;
    title: string;
    description: string;
    items: FeatureItem[];
  };

  useCases: {
    eyebrow: string;
    title: string;
    description: string;
    items: UseCaseItem[];
  };

  benefits: {
    eyebrow: string;
    title: string;
    description: string;
    metrics: BenefitMetric[];
  };

  analyticsVisual: {
    eyebrow: string;
    title: string;
    description: string;
    stats: {
      label: string;
      value: string;
      numericValue: number;
      suffix?: string;
      change?: string;
    }[];
  };

  finalCta: {
    eyebrow: string;
    title: string;
    highlightTitle: string;
    description: string;
    primaryCtaText: string;
    secondaryCtaText: string;
  };
}

export const solutionDetailsMap: Record<string, SolutionDetailData> = {
  "water-visibility": {
    slug: "water-visibility",
    badge: "WATER VISIBILITY",
    title: "Water Visibility",
    tagline: {
      line1: "Real-time Visibility.",
      line2: "Complete Clarity.",
      line3: "Every Drop.",
    },
    heroDescription:
      "Veenero Water Visibility gives you real-time monitoring of water assets, flow, quality, and infrastructure across locations — so you can detect issues early, reduce losses, and make confident decisions.",
    heroPills: ["Real-time Data", "Always-On Monitoring", "Unified Platform"],
    heroImage: waterVisibilityImg,
    heroMetrics: [
      {
        title: "Live Flow Rate",
        value: "1,245",
        rawValue: 1245,
        suffix: " m³/hr",
        subtext: "vs yesterday",
        change: "+10.5%",
        isPositive: true,
        type: "sparkline",
        sparklineData: [24, 38, 30, 48, 42, 60, 56, 75, 88],
      },
      {
        title: "Water Quality",
        value: "98",
        rawValue: 98,
        suffix: "%",
        subtext: "pH 7.2 · Turbidity 1.2 NTU",
        change: "Healthy",
        isPositive: true,
        type: "gauge",
        gaugePercent: 98,
      },
      {
        title: "Active Alerts",
        value: "3",
        rawValue: 3,
        subtext: "View All 4 Alerts",
        type: "counter",
      },
      {
        title: "Asset Overview",
        value: "Plant 01",
        rawValue: 1,
        subtext: "Telemetry Latency: 14ms",
        change: "Online",
        isPositive: true,
        type: "status",
      },
    ],
    overview: {
      eyebrow: "OVERVIEW",
      title: "One Platform.",
      highlightTitle: "Total Water Visibility.",
      description:
        "From source to tap, Veenero connects sensors, telemetry, and analytics into a single view of your water infrastructure. You get real-time insights that help you reduce NRW, optimize operations, and ensure reliability across your system.",
      blocks: [
        {
          title: "360° Asset Monitoring",
          description: "Monitor reservoirs, pipelines, pumps, valves, and treatment tanks in real time.",
          icon: "Activity",
        },
        {
          title: "Flow & Pressure Tracking",
          description: "Track hydraulic flow, pressure gradients, and storage levels continuously.",
          icon: "Gauge",
        },
        {
          title: "Water Quality Monitoring",
          description: "Inspect key physical and chemical quality parameters with 24/7 telemetry.",
          icon: "Droplets",
        },
        {
          title: "Smart Alerts",
          description: "Get notified instantly when parameters violate baseline operational thresholds.",
          icon: "Bell",
        },
      ],
    },
    howItWorks: {
      eyebrow: "HOW IT WORKS",
      title: "Simple. Connected. Intelligent.",
      description:
        "A streamlined 5-stage telemetry lifecycle that turns raw physical pipe flow into board-level operational certainty.",
      steps: [
        {
          step: "01",
          title: "Sense",
          subtitle: "Edge Data Capture",
          description: "Rugged IoT sensors collect high-frequency telemetry from your distributed water assets.",
          icon: "Radio",
        },
        {
          step: "02",
          title: "Connect",
          subtitle: "Secure Transmission",
          description: "Secure data transmission via LoRaWAN, NB-IoT, 4G/5G and battery-backed edge gateways.",
          icon: "Wifi",
        },
        {
          step: "03",
          title: "Understand",
          subtitle: "AI Processing",
          description: "Data is normalized and analyzed to detect anomalies, micro-leaks, and seasonal baselines.",
          icon: "Cpu",
        },
        {
          step: "04",
          title: "Act",
          subtitle: "Decision Execution",
          description: "Field teams act on verified insights with confidence to optimize flows and prevent loss.",
          icon: "SlidersHorizontal",
        },
        {
          step: "05",
          title: "Verify",
          subtitle: "Governance Assurance",
          description: "Outcomes are verified with immutable audit trails, reports, and ESG compliance exports.",
          icon: "ShieldCheck",
        },
      ],
    },
    techSection: {
      eyebrow: "TECHNICAL ARCHITECTURE",
      title: "Engineered for High-Frequency Telemetry",
      subtitle: "Physical Water Infrastructure Meets Modern Cloud Resilience",
      description:
        "Veenero unifies hardware-agnostic edge ingestion, cryptographically verifiable data streaming, and scalable microservices to deliver sub-second telemetry across demanding industrial and municipal environments.",
      diagramSteps: [
        {
          label: "Rugged Edge Sensing",
          desc: "Non-invasive ultrasonic & electromagnetic pulse readers",
          icon: "Radio",
        },
        {
          label: "Encrypted Edge Gateway",
          desc: "TLS 1.3 encrypted data buffering during network outages",
          icon: "Lock",
        },
        {
          label: "Time-Series Pipeline",
          desc: "High-throughput ingestion processing 10,000+ events/sec",
          icon: "Layers",
        },
        {
          label: "Enterprise SCADA & API",
          desc: "Native connectors for Siemens, Schneider, and ERP platforms",
          icon: "Network",
        },
      ],
    },
    capabilities: {
      eyebrow: "KEY CAPABILITIES",
      title: "Enterprise Capabilities for Complete Oversight",
      description:
        "Designed to eliminate physical blindspots and unify utility engineering, plant operations, and executive leadership.",
      items: [
        {
          icon: "Radio",
          title: "Real-time Telemetry",
          description: "Continuous sub-second data streaming from rugged sensors across your entire water network.",
        },
        {
          icon: "Sparkles",
          title: "AI-Powered Insights",
          description: "Machine learning models detect anomalies and predict supply disruptions before downtime occurs.",
        },
        {
          icon: "MapPin",
          title: "Map-based Monitoring",
          description: "Visualize geographic asset distributions, DMA zones, and pipeline statuses on GIS maps.",
        },
        {
          icon: "Shield",
          title: "Role-based Access",
          description: "Granular enterprise access controls for operators, reliability engineers, and compliance auditors.",
        },
        {
          icon: "BarChart3",
          title: "Automated Reporting",
          description: "Schedule daily, weekly, and monthly regulatory and ESG compliance water consumption reports.",
        },
        {
          icon: "Cpu",
          title: "Edge Resilience",
          description: "Autonomous edge controllers buffer data locally and continue monitoring even through network dropouts.",
        },
      ],
    },
    features: {
      eyebrow: "FEATURES & FUNCTIONALITY",
      title: "Engineered for Precision & Operational Scale",
      description:
        "Every feature is purpose-built to transform fragmented field measurements into reliable, actionable intelligence.",
      items: [
        {
          icon: "Gauge",
          title: "Dynamic Pressure Profiling",
          description: "Identify pressure transients and water hammer events that accelerate pipe fatigue and fatigue bursts.",
          tag: "Hydraulic Integrity",
        },
        {
          icon: "Activity",
          title: "Bidirectional Flow Tracking",
          description: "High-resolution telemetry for booster stations, reservoirs, and gravity feed distribution mains.",
          tag: "Flow Telemetry",
        },
        {
          icon: "Droplets",
          title: "Continuous Quality Index",
          description: "Multiparameter probes evaluate pH, turbidity, TDS, and dissolved oxygen with auto-drift calibration.",
          tag: "Water Quality",
        },
        {
          icon: "Bell",
          title: "Multi-Channel Escalations",
          description: "Automated instant alerts dispatched via SMS, Email, and Webhook when thresholds are breached.",
          tag: "Alert Automation",
        },
        {
          icon: "Layers",
          title: "Asset Lifecycle Indexing",
          description: "Track pump run-hours, valve actuation counts, and maintenance schedules across all distributed sites.",
          tag: "Asset Health",
        },
        {
          icon: "Network",
          title: "SCADA & ERP Integration",
          description: "Pre-built REST, GraphQL, and MQTT connectors bridge edge sensors directly with central control rooms.",
          tag: "Open Ecosystem",
        },
      ],
    },
    useCases: {
      eyebrow: "USE CASES",
      title: "Proven Across Real-World Operational Environments",
      description:
        "From smart cities managing district metered areas to heavy process manufacturing, Veenero scales seamlessly.",
      items: [
        {
          icon: "Building2",
          title: "Municipal Water Utilities",
          description: "Monitor city-wide distribution networks, manage district metered areas (DMAs), and curb Non-Revenue Water.",
          stats: "Up to 35% NRW Reduction",
          image: waterVisibilityImg,
        },
        {
          icon: "Factory",
          title: "Industrial Plants",
          description: "Optimize cooling towers, process recycling loops, and boiler feeds with closed-loop water balances.",
          stats: "24/7 Process Continuity",
          image: operationalIntelImg,
        },
        {
          icon: "Radio",
          title: "Rural Water Systems",
          description: "Ensure equitable, uninterrupted water access across remote community distribution schemes.",
          stats: "99.8% Uptime Assurance",
          image: waterAccountImg,
        },
        {
          icon: "Building",
          title: "Commercial Campuses",
          description: "Sub-meter corporate real estate, verify tenant billing, and eliminate overnight plumbing leakages.",
          stats: "Zero Unmetered Waste",
          image: waterVerifyImg,
        },
      ],
    },
    benefits: {
      eyebrow: "BENEFITS & IMPACT",
      title: "Quantifiable Impact From Day One",
      description:
        "Veenero converts operational blindspots into measurable savings, reduced downtime, and verified water stewardship.",
      metrics: [
        {
          target: 30,
          suffix: "%",
          displayRange: "20-40%",
          label: "Reduction in Non-Revenue Water",
          description: "Pinpoint hidden distribution bursts and unmetered extraction before millions of litres are lost.",
        },
        {
          target: 40,
          suffix: "%",
          displayRange: "30-50%",
          label: "Faster Issue Detection",
          description: "Automated anomaly algorithms flag anomalies in under 60 seconds, preventing major pipe ruptures.",
        },
        {
          target: 30,
          suffix: "%",
          displayRange: "25-35%",
          label: "Lower Operational Costs",
          description: "Cut unnecessary technician dispatch runs with precision telemetry and remote diagnostic clarity.",
        },
        {
          target: 99.9,
          decimals: 1,
          suffix: "%",
          displayRange: "99.9%",
          label: "Data Reliability & Availability",
          description: "Military-grade edge buffering and redundant cloud pipelines ensure your records never miss a beat.",
        },
      ],
    },
    analyticsVisual: {
      eyebrow: "REAL-TIME TELEMETRY STREAM",
      title: "Live Water Visibility Dashboard",
      description: "Interactive real-time parameters streaming continuously across monitored treatment and distribution assets.",
      stats: [
        { label: "Total Monitored Assets", value: "236", numericValue: 236 },
        { label: "Active Gateways Online", value: "198", numericValue: 198, change: "100% Operational" },
        { label: "Live System Flow Rate", value: "1,245", numericValue: 1245, suffix: " m³/hr", change: "+10.5%" },
        { label: "Water Quality Index", value: "98", numericValue: 98, suffix: "%", change: "Healthy" },
      ],
    },
    finalCta: {
      eyebrow: "READY TO TRANSFORM",
      title: "Ready to Gain Complete Visibility of Your",
      highlightTitle: "Water Infrastructure?",
      description:
        "Join municipal utilities, industrial leaders, and commercial campuses already optimizing their water systems with Veenero.",
      primaryCtaText: "Request a Demo",
      secondaryCtaText: "Talk to an Expert",
    },
  },

  "operational-intelligence": {
    slug: "operational-intelligence",
    badge: "OPERATIONAL INTELLIGENCE",
    title: "Operational Intelligence",
    tagline: {
      line1: "Predictive Analytics.",
      line2: "Autonomous Intelligence.",
      line3: "Zero Surprises.",
    },
    heroDescription:
      "Transform raw telemetry streams into proactive operations with automated micro-leak detection, pressure transient analysis, and self-learning consumption baselines.",
    heroPills: ["Predictive Models", "Autonomous Detection", "Real-Time Action"],
    heroImage: operationalIntelImg,
    heroMetrics: [
      {
        title: "Anomaly Detection Rate",
        value: "99.4",
        rawValue: 99.4,
        decimals: 1,
        suffix: "%",
        subtext: "vs manual logs",
        change: "+28.4%",
        isPositive: true,
        type: "gauge",
        gaugePercent: 99,
      },
      {
        title: "Response Time",
        value: "28",
        rawValue: 28,
        suffix: "s",
        subtext: "Instant alert trigger",
        change: "-75%",
        isPositive: true,
        type: "counter",
      },
      {
        title: "Active Predictions",
        value: "14",
        rawValue: 14,
        subtext: "Micro-leaks localized",
        type: "counter",
      },
      {
        title: "Pump Efficiency Index",
        value: "94.2",
        rawValue: 94.2,
        decimals: 1,
        suffix: "%",
        subtext: "Energy optimized",
        change: "Optimized",
        isPositive: true,
        type: "status",
      },
    ],
    overview: {
      eyebrow: "OVERVIEW",
      title: "Intelligent Automation.",
      highlightTitle: "Proactive Water Control.",
      description:
        "Empower operations teams with AI that spots anomalies before failures occur, optimizes pumping energy, and pinpoints micro-leaks with precision across complex distribution networks.",
      blocks: [
        {
          title: "Micro-Leak Localization",
          description: "Acoustic and mass-balance AI identifies sub-surface pinhole leaks before catastrophic burst.",
          icon: "Sparkles",
        },
        {
          title: "Pressure Transient Analysis",
          description: "Detect destructive pressure surges and water hammer in high-velocity industrial loops.",
          icon: "Gauge",
        },
        {
          title: "Energy & Pump Optimization",
          description: "Align variable frequency drives (VFD) with dynamic demand curves to slash utility power bills.",
          icon: "Zap",
        },
        {
          title: "Root-Cause Diagnostics",
          description: "Automated event correlation explains why anomalies occur, not just where they occurred.",
          icon: "Cpu",
        },
      ],
    },
    howItWorks: {
      eyebrow: "HOW IT WORKS",
      title: "From Predictive Signals to Automated Control",
      description: "Continuous machine learning pipelines that learn your baseline and optimize hydraulics 24/7.",
      steps: [
        {
          step: "01",
          title: "Baseline",
          subtitle: "Hydraulic Modeling",
          description: "AI continuously models normal diurnal flow and pressure patterns across weather and shifts.",
          icon: "Activity",
        },
        {
          step: "02",
          title: "Detect",
          subtitle: "Anomaly Flagging",
          description: "Algorithms identify deviations from expected baselines with statistical confidence scoring.",
          icon: "Sparkles",
        },
        {
          step: "03",
          title: "Diagnose",
          subtitle: "Root Cause Engine",
          description: "Correlates multi-sensor telemetry to distinguish physical leaks from operational usage surges.",
          icon: "Cpu",
        },
        {
          step: "04",
          title: "Recommend",
          subtitle: "Prescriptive Dispatch",
          description: "Generates geo-located work orders and optimal valve settings for immediate field intervention.",
          icon: "SlidersHorizontal",
        },
        {
          step: "05",
          title: "Validate",
          subtitle: "Impact Tracking",
          description: "Measures post-intervention hydraulic stability and quantifies saved volume and energy.",
          icon: "CheckCircle2",
        },
      ],
    },
    techSection: {
      eyebrow: "AI ENGINE ARCHITECTURE",
      title: "Hydraulic Machine Learning at Scale",
      subtitle: "Deterministic Physics Correlated with Statistical Learning",
      description:
        "Veenero combines real-time hydraulic physics modeling with convolutional anomaly detectors to separate normal operational noise from genuine infrastructure threats.",
      diagramSteps: [
        {
          label: "Transient Sensor Stream",
          desc: "100Hz transient pressure sampling at critical nodes",
          icon: "Radio",
        },
        {
          label: "Baseline Model Inference",
          desc: "Dynamic time-warping models adaptive seasonal patterns",
          icon: "Sparkles",
        },
        {
          label: "Automated Diagnostic Engine",
          desc: "Pattern recognition classifies leaks, bursts, and valve failure",
          icon: "Cpu",
        },
        {
          label: "Control Loop Triggers",
          desc: "Automated notifications and SCADA PLC setpoint updates",
          icon: "Zap",
        },
      ],
    },
    capabilities: {
      eyebrow: "KEY CAPABILITIES",
      title: "Actionable Operational AI",
      description: "Equip your teams with autonomous intelligence that transforms reactive maintenance into proactive control.",
      items: [
        {
          icon: "Sparkles",
          title: "Predictive Burst Prevention",
          description: "Forecast pipe fatigue hotspots weeks before rupture based on cumulative pressure shocks.",
        },
        {
          icon: "Zap",
          title: "Pumping Energy Optimization",
          description: "Schedule pumping cycles to take advantage of off-peak electric tariffs while maintaining head.",
        },
        {
          icon: "Gauge",
          title: "Transient Water Hammer Detection",
          description: "Capture sub-second hydraulic pressure spikes caused by sudden valve closures or power trips.",
        },
        {
          icon: "SlidersHorizontal",
          title: "Dynamic Pressure Moderation",
          description: "Automatically adjust pressure reducing valves (PRVs) during off-peak hours to reduce leakage volume.",
        },
        {
          icon: "Radio",
          title: "Asset Health Scorecards",
          description: "Real-time mechanical wear and vibration indices for critical pumps, motors, and blowers.",
        },
        {
          icon: "Layers",
          title: "Incident Playbooks",
          description: "Automated step-by-step SOP dispatch guides field technicians through rapid isolation.",
        },
      ],
    },
    features: {
      eyebrow: "FEATURES & FUNCTIONALITY",
      title: "Built for Mission-Critical Reliability",
      description: "Robust, deterministic intelligence designed for utility control rooms and industrial water engineers.",
      items: [
        {
          icon: "Sparkles",
          title: "Self-Calibrating Baselines",
          description: "Models self-adjust for holidays, weather shifts, and process recipe changes without manual retuning.",
          tag: "Machine Learning",
        },
        {
          icon: "Bell",
          title: "False-Positive Suppression",
          description: "Multi-parameter verification eliminates alert fatigue by filtering transient operational spikes.",
          tag: "Alert Hygiene",
        },
        {
          icon: "Cpu",
          title: "Edge Anomaly Inference",
          description: "Lightweight neural models run locally on edge hardware to trigger emergency shutoffs in milliseconds.",
          tag: "Edge AI",
        },
        {
          icon: "Activity",
          title: "Loss Volume Quantification",
          description: "Instant volumetric calculation of lost water and associated monetary cost per ongoing leak.",
          tag: "Loss Economics",
        },
        {
          icon: "MapPin",
          title: "GIS Leak Vectoring",
          description: "Pinpoint estimated leak coordinates along pipeline corridors with acoustic triangulation.",
          tag: "Spatial Intelligence",
        },
        {
          icon: "Network",
          title: "Bidirectional PLC Feedback",
          description: "Close the loop by feeding recommended pressure setpoints back into Allen-Bradley or Siemens PLCs.",
          tag: "SCADA Control",
        },
      ],
    },
    useCases: {
      eyebrow: "USE CASES",
      title: "Engineered for Complex Hydraulic Infrastructure",
      description: "Delivering real ROI across heavy process manufacturing, district water grids, and institutional campuses.",
      items: [
        {
          icon: "Factory",
          title: "Heavy Process Industry",
          description: "Safeguard cooling tower cycles, optimize RO membranes, and stop unmetered leaks in refinery loops.",
          stats: "18% Energy Savings",
          image: operationalIntelImg,
        },
        {
          icon: "Building2",
          title: "Smart Municipal Distribution",
          description: "Automate pressure management across hilly terrain, extending pipe lifespan and eliminating bursts.",
          stats: "45% Faster Resolution",
          image: waterVisibilityImg,
        },
        {
          icon: "Server",
          title: "Hyperscale Data Centers",
          description: "Ensure evaporative chiller loops remain balanced with continuous leak surveillance.",
          stats: "99.999% Loop Uptime",
          image: waterVerifyImg,
        },
        {
          icon: "Building",
          title: "Healthcare & Campus Networks",
          description: "Maintain sterile water pressure lines and protect multi-story plumbing from sudden pipe ruptures.",
          stats: "Zero Outage Risk",
          image: waterAccountImg,
        },
      ],
    },
    benefits: {
      eyebrow: "BENEFITS & IMPACT",
      title: "Measurable Efficiency Gains",
      description: "Quantified savings across energy, lost volume, and equipment replacement cycles.",
      metrics: [
        {
          target: 50,
          suffix: "%",
          displayRange: "45-60%",
          label: "Faster Anomaly Resolution",
          description: "Automated root-cause diagnostics mean maintenance technicians arrive on-site with the right tools.",
        },
        {
          target: 20,
          suffix: "%",
          displayRange: "15-25%",
          label: "Pumping & Energy Savings",
          description: "Dynamic pressure optimization and off-peak scheduling significantly lower electrical demand charges.",
        },
        {
          target: 80,
          suffix: "%",
          displayRange: "80%",
          label: "Fewer Unplanned Outages",
          description: "Predictive transient modeling catches stress points before they manifest as catastrophic pipe bursts.",
        },
        {
          target: 24,
          suffix: "/7",
          displayRange: "24/7",
          label: "Autonomous Surveillance",
          description: "Continuous AI vigilance guards distributed pipelines around the clock without manual supervision.",
        },
      ],
    },
    analyticsVisual: {
      eyebrow: "AUTONOMOUS ANOMALY STREAM",
      title: "Predictive Anomaly Dashboard",
      description: "Live algorithm output displaying baseline deviations, classified hydraulic events, and confidence levels.",
      stats: [
        { label: "Surveillance Active", value: "24/7", numericValue: 24 },
        { label: "Anomaly Accuracy", value: "99.4", numericValue: 99.4, suffix: "%", change: "+0.4% this week" },
        { label: "Active Predictions", value: "14", numericValue: 14, change: "All Verified" },
        { label: "Pumping Power Optimized", value: "21.8", numericValue: 21.8, suffix: "%", change: "-420 kWh" },
      ],
    },
    finalCta: {
      eyebrow: "READY TO OPTIMIZE",
      title: "Ready to Put AI to Work Across Your",
      highlightTitle: "Water Operations?",
      description: "Schedule a technical consultation to see how Veenero Operational Intelligence automates your network.",
      primaryCtaText: "Request a Demo",
      secondaryCtaText: "Talk to an Expert",
    },
  },

  "water-accountability": {
    slug: "water-accountability",
    badge: "WATER ACCOUNTABILITY",
    title: "Water Accountability",
    tagline: {
      line1: "Every Drop Measured.",
      line2: "Every Litre Accounted.",
      line3: "Absolute Balance.",
    },
    heroDescription:
      "End unaccounted water loss and billing disputes with a connected view of your water network. Veenero brings metering, reconciliation and cost visibility together — so every litre can be traced, verified and governed.",
    heroPills: ["DMA Balancing", "Tenant Sub-Metering", "Audit-Ready Logs"],
    heroImage: waterAccountImg,
    heroMetrics: [
      {
        title: "Reconciliation Rate",
        value: "99.8",
        rawValue: 99.8,
        decimals: 1,
        suffix: "%",
        subtext: "System water balance",
        change: "+14.2%",
        isPositive: true,
        type: "gauge",
        gaugePercent: 99,
      },
      {
        title: "Unmetered Loss Located",
        value: "18.4",
        rawValue: 18.4,
        decimals: 1,
        suffix: "%",
        subtext: "Recovered revenue",
        change: "+$240k",
        isPositive: true,
        type: "counter",
      },
      {
        title: "Active DMA Zones",
        value: "54",
        rawValue: 54,
        subtext: "Continuous reconciliation",
        type: "counter",
      },
      {
        title: "Billing Disputes",
        value: "0",
        rawValue: 0,
        subtext: "Verified meter data",
        change: "Zero Discrepancy",
        isPositive: true,
        type: "status",
      },
    ],
    overview: {
      eyebrow: "OVERVIEW",
      title: "Complete Transparency.",
      highlightTitle: "Uncompromising Governance.",
      description:
        "Eliminate unaccounted water loss and billing disputes. Veenero bridges physical meters and operational ledgers with end-to-end reconciliation, DMA water balancing, and department-level cost allocations.",
      blocks: [
        {
          title: "District Metered Area (DMA) Balancing",
          description: "Continuously reconcile bulk inlet flow against customer meters to identify localized losses.",
          icon: "Layers",
        },
        {
          title: "Tenant & Process Sub-Metering",
          description: "Accurately allocate consumption and utility costs across tenants, departments, and production lines.",
          icon: "Building",
        },
        {
          title: "Tamper-Evident Data Ledger",
          description: "Ensure meter readings cannot be forged, manipulated, or lost during billing transmission.",
          icon: "ShieldCheck",
        },
        {
          title: "Automated Tariff & Cost Engine",
          description: "Apply tiered pricing models, peak-hour surcharges, and sewer discharge fees automatically.",
          icon: "DollarSign",
        },
      ],
    },
    howItWorks: {
      eyebrow: "HOW IT WORKS",
      title: "End-to-End Water Accounting Pipeline",
      description: "From physical bulk meters to audited billing journals with verified reconciliation.",
      steps: [
        {
          step: "01",
          title: "Meter",
          subtitle: "Precision Sub-Metering",
          description: "High-resolution smart meters capture volumetric consumption at every branch and boundary.",
          icon: "Radio",
        },
        {
          step: "02",
          title: "Reconcile",
          subtitle: "DMA Mass Balance",
          description: "Automated engines calculate the difference between bulk inputs and distributed consumption.",
          icon: "Activity",
        },
        {
          step: "03",
          title: "Isolate",
          subtitle: "Discrepancy Pinpointing",
          description: "Discrepancies exceeding allowable thresholds are localized to specific pipes or sub-meters.",
          icon: "AlertTriangle",
        },
        {
          step: "04",
          title: "Allocate",
          subtitle: "Cost & Department Assignment",
          description: "Assign usage and billing directly to cost centers, tenants, and operational processes.",
          icon: "PieChart",
        },
        {
          step: "05",
          title: "Audit",
          subtitle: "Assurance Journal",
          description: "Generate dispute-free, auditor-certified ledgers with complete provenance history.",
          icon: "FileCheck",
        },
      ],
    },
    techSection: {
      eyebrow: "ACCOUNTING ARCHITECTURE",
      title: "Mathematical Water Mass Balance",
      subtitle: "Deterministic Conservation of Mass Across Every Pipeline Zone",
      description:
        "Veenero models your physical water grid as a conservation of mass network, continuously balancing inputs, storage fluctuations, and metered withdrawals to catch even minor unmetered losses.",
      diagramSteps: [
        {
          label: "Bulk Inflow Capture",
          desc: "Main transmission line custody transfer meters",
          icon: "Radio",
        },
        {
          label: "Storage Differential Sync",
          desc: "Reservoir and tank level telemetry adjustment",
          icon: "Layers",
        },
        {
          label: "Distributed Consumption",
          desc: "Aggregated customer sub-meter readings",
          icon: "Building",
        },
        {
          label: "Net Balance Ledger",
          desc: "Real-time non-revenue water index calculation",
          icon: "ShieldCheck",
        },
      ],
    },
    capabilities: {
      eyebrow: "KEY CAPABILITIES",
      title: "Enterprise Accounting & Governance",
      description: "Turn every drop into a verified transaction with granular accountability.",
      items: [
        {
          icon: "Layers",
          title: "Dynamic DMA Balancing",
          description: "Isolate distribution zones and track water balance in near real time to locate unmetered extraction.",
        },
        {
          icon: "Building",
          title: "Automated Tenant Billing",
          description: "Generate compliant tenant billing invoices based on actual certified smart meter consumption.",
        },
        {
          icon: "ShieldCheck",
          title: "Tamper & Reverse Flow Alarms",
          description: "Instant notifications for physical meter bypass, magnetic tampering, or backflow contamination.",
        },
        {
          icon: "BarChart3",
          title: "Water Efficiency Indexing (WEI)",
          description: "Score and compare water efficiency across industrial process lines or commercial tenants.",
        },
        {
          icon: "FileCheck",
          title: "Audit Trail Exports",
          description: "Export timestamped, tamper-evident usage logs for financial auditors and ESG reporting.",
        },
        {
          icon: "DollarSign",
          title: "Revenue Protection",
          description: "Detect under-registering meters and unbilled connections to protect utility revenue.",
        },
      ],
    },
    features: {
      eyebrow: "FEATURES & FUNCTIONALITY",
      title: "Built for Financial & Operational Certainty",
      description: "Eliminate disputes, recover lost revenue, and drive sustainable corporate water stewardship.",
      items: [
        {
          icon: "PieChart",
          title: "Process Water Allocation",
          description: "Break down water consumption by individual production batch, cooling cycle, or tenant lease.",
          tag: "Cost Allocation",
        },
        {
          icon: "Radio",
          title: "Smart AMI Network Sync",
          description: "Interoperable with LoRaWAN, Cellular, and Wireless M-Bus smart water meter deployments.",
          tag: "Smart Metering",
        },
        {
          icon: "Activity",
          title: "Night Flow Profiling",
          description: "Analyze Minimum Night Flow (MNF) to isolate legitimate baseline usage from background leakage.",
          tag: "Loss Analysis",
        },
        {
          icon: "Shield",
          title: "Cryptographic Provenance",
          description: "Every reading is signed with a cryptographic checksum to ensure data integrity.",
          tag: "Security",
        },
        {
          icon: "Bell",
          title: "Leakage Budgeting",
          description: "Set allowed threshold limits per department and alert managers before budget overruns.",
          tag: "Budget Controls",
        },
        {
          icon: "FileText",
          title: "Dispute Mitigation Reports",
          description: "Detailed hourly consumption breakdowns resolve tenant billing inquiries within minutes.",
          tag: "Customer Service",
        },
      ],
    },
    useCases: {
      eyebrow: "USE CASES",
      title: "Trusted Across Diverse Water Environments",
      description: "Empowering cities, commercial real estate developers, and corporate campuses to account for every litre.",
      items: [
        {
          icon: "Building2",
          title: "Urban Water Boards",
          description: "Establish district metered areas, identify illegal connections, and increase utility collection efficiency.",
          stats: "14% Revenue Recovery",
          image: waterAccountImg,
        },
        {
          icon: "Building",
          title: "Commercial Real Estate (SEZs)",
          description: "Automate sub-metering for hundreds of corporate tenants with verified monthly billing statements.",
          stats: "Zero Billing Disputes",
          image: waterVisibilityImg,
        },
        {
          icon: "Factory",
          title: "Chemical & Textile Parks",
          description: "Track effluent discharge quotas and allocate shared wastewater treatment costs accurately.",
          stats: "100% Cost Reconciled",
          image: operationalIntelImg,
        },
        {
          icon: "Home",
          title: "Smart Residential Townships",
          description: "Equip modern residential complexes with prepaid and postpaid automated water metering.",
          stats: "25% Water Conservation",
          image: waterVerifyImg,
        },
      ],
    },
    benefits: {
      eyebrow: "BENEFITS & IMPACT",
      title: "Concrete Financial & Governance Returns",
      description: "Proven returns on investment through recovered revenue and reduced administrative overhead.",
      metrics: [
        {
          target: 30,
          suffix: "%",
          displayRange: "25-35%",
          label: "Reduction in Unbilled Water",
          description: "Close the gap between water produced and water billed across municipal and commercial grids.",
        },
        {
          target: 100,
          suffix: "%",
          displayRange: "100%",
          label: "Granular Cost Allocation",
          description: "Attribute every litre of consumed water directly to the responsible tenant or production process.",
        },
        {
          target: 99.8,
          decimals: 1,
          suffix: "%",
          displayRange: "99.8%",
          label: "Water Balance Reconciliation",
          description: "Maintain near-perfect mathematical balance across reservoirs, trunk mains, and consumer meters.",
        },
        {
          target: 3,
          suffix: "x",
          displayRange: "3x ROI",
          label: "Capital Investment Payback",
          description: "Average Veenero Water Accountability deployments pay for themselves within 6 to 9 months.",
        },
      ],
    },
    analyticsVisual: {
      eyebrow: "WATER RECONCILIATION STREAM",
      title: "Live Water Accountability Dashboard",
      description: "Real-time mass balance calculations comparing bulk input feeds against downstream metered consumption.",
      stats: [
        { label: "Active DMA Zones", value: "54", numericValue: 54 },
        { label: "Water Balance Index", value: "99.8", numericValue: 99.8, suffix: "%", change: "+0.3%" },
        { label: "Unmetered Volume Located", value: "18.4", numericValue: 18.4, suffix: "%", change: "Recovered" },
        { label: "Tenant Reconciliation", value: "100", numericValue: 100, suffix: "%", change: "Verified" },
      ],
    },
    finalCta: {
      eyebrow: "READY TO GOVERN",
      title: "Ready to Ensure Total Accountability for",
      highlightTitle: "Every Litre of Water?",
      description: "Connect with our water accounting specialists to review your network and deploy smart DMA balancing.",
      primaryCtaText: "Request a Demo",
      secondaryCtaText: "Talk to an Expert",
    },
  },

  "water-verification": {
    slug: "water-verification",
    badge: "WATER VERIFICATION",
    title: "Water Verification",
    tagline: {
      line1: "Audit-Ready Truth.",
      line2: "Certified Assurance.",
      line3: "Verifiable ESG.",
    },
    heroDescription:
      "Generate cryptographically verifiable proof of water stewardship, regulatory compliance, and ESG progress for BRSR, GRI, CDP, and third-party assurance auditors.",
    heroPills: ["Audit-Ready Trails", "BRSR & GRI Ready", "Certified Governance"],
    heroImage: waterVerifyImg,
    heroMetrics: [
      {
        title: "Audit Assurance Index",
        value: "100",
        rawValue: 100,
        suffix: "%",
        subtext: "Third-party verified",
        change: "Full Assurance",
        isPositive: true,
        type: "gauge",
        gaugePercent: 100,
      },
      {
        title: "Verifiable Data Records",
        value: "12.8",
        rawValue: 12.8,
        decimals: 1,
        suffix: "M+",
        subtext: "Immutable time-series",
        type: "counter",
      },
      {
        title: "ESG Reporting Time",
        value: "85",
        rawValue: 85,
        suffix: "%",
        subtext: "Automated disclosure",
        change: "-85% Effort",
        isPositive: true,
        type: "counter",
      },
      {
        title: "Regulatory Compliance",
        value: "99.9",
        rawValue: 99.9,
        decimals: 1,
        suffix: "%",
        subtext: "CPCB / SPCB Standards",
        change: "Compliant",
        isPositive: true,
        type: "status",
      },
    ],
    overview: {
      eyebrow: "OVERVIEW",
      title: "Verifiable Governance.",
      highlightTitle: "Audit-Proof Compliance.",
      description:
        "Move beyond self-reported estimates. Veenero provides immutable time-series data trails, automated compliance documentation, and auditor-ready verification portals that stand up to rigorous scrutiny.",
      blocks: [
        {
          title: "Immutable Data Provenance",
          description: "Every telemetry datapoint is cryptographically signed and stored with tamper-evident audit logs.",
          icon: "ShieldCheck",
        },
        {
          title: "Automated BRSR & GRI Frameworks",
          description: "One-click export formatting for SEBI BRSR, GRI 303, CDP Water, and SDG 6 disclosures.",
          icon: "FileText",
        },
        {
          title: "Effluent & Quality Verification",
          description: "Continuous compliance tracking against CPCB and State Pollution Control Board discharge norms.",
          icon: "Droplets",
        },
        {
          title: "Auditor Access Portals",
          description: "Provide third-party assurance auditors with read-only cryptographic verification portals.",
          icon: "Users",
        },
      ],
    },
    howItWorks: {
      eyebrow: "HOW IT WORKS",
      title: "The Architecture of Trust",
      description: "From physical sensor calibration to board-certified ESG disclosures.",
      steps: [
        {
          step: "01",
          title: "Capture",
          subtitle: "Certified Instrumentation",
          description: "Sensors capture flow and quality readings with calibration timestamps and serial numbers.",
          icon: "Radio",
        },
        {
          step: "02",
          title: "Seal",
          subtitle: "Cryptographic Hashing",
          description: "Telemetry packets are hashed and stored with immutable change journals to prevent backdating.",
          icon: "Lock",
        },
        {
          step: "03",
          title: "Benchmark",
          subtitle: "Regulatory Assessment",
          description: "Readings are evaluated against environmental discharge norms and corporate sustainability goals.",
          icon: "BarChart3",
        },
        {
          step: "04",
          title: "Assemble",
          subtitle: "Disclosure Generation",
          description: "Automated compilers assemble compliant BRSR, GRI, and CDP reporting packages.",
          icon: "FileCheck",
        },
        {
          step: "05",
          title: "Assure",
          subtitle: "Third-Party Verification",
          description: "Auditors verify data trails with cryptographic integrity checks and generate assurance certifications.",
          icon: "ShieldCheck",
        },
      ],
    },
    techSection: {
      eyebrow: "ASSURANCE ARCHITECTURE",
      title: "Cryptographic Water Provenance",
      subtitle: "Immutable Time-Series Ledger for Corporate Disclosures",
      description:
        "Veenero incorporates tamper-evident Merkle-tree hashing into our time-series database. Any retroactive modification or deletion creates an immediate audit alert, guaranteeing 100% data integrity.",
      diagramSteps: [
        {
          label: "Hardware-Signed Telemetry",
          desc: "Edge gateways embed cryptographic public key signatures",
          icon: "Radio",
        },
        {
          label: "Tamper-Evident Storage",
          desc: "Append-only time-series ledger prevents retrospective edits",
          icon: "Lock",
        },
        {
          label: "Automated Norm Checking",
          desc: "Instant flagging of BOD, COD, pH, and flow limit violations",
          icon: "AlertCircle",
        },
        {
          label: "Auditor Verification Portal",
          desc: "Secure API access for Big 4 ESG assurance teams",
          icon: "ShieldCheck",
        },
      ],
    },
    capabilities: {
      eyebrow: "KEY CAPABILITIES",
      title: "Verification-First Water Data",
      description: "Give stakeholders, investors, and regulators complete trust in your sustainability metrics.",
      items: [
        {
          icon: "FileCheck",
          title: "Audit-Ready ESG Exports",
          description: "Pre-formatted reporting templates for BRSR Core, GRI 303: Water and Effluents, and CDP disclosures.",
        },
        {
          icon: "ShieldCheck",
          title: "Tamper-Evident Historical Logs",
          description: "Zero backdating or data manipulation with append-only cryptographic time-series storage.",
        },
        {
          icon: "Droplets",
          title: "Continuous Effluent Compliance",
          description: "Real-time compliance monitoring for Zero Liquid Discharge (ZLD) plants and industrial ETPs.",
        },
        {
          icon: "Users",
          title: "Third-Party Assurance Access",
          description: "Dedicated auditor roles allowing external sustainability assurance teams to inspect raw logs.",
        },
        {
          icon: "Activity",
          title: "Calibration & Maintenance Trails",
          description: "Track sensor calibration certificates and maintenance logs directly alongside telemetry data.",
        },
        {
          icon: "Layers",
          title: "Chain of Custody Tracking",
          description: "Track water sourcing from municipal, borewell, or tanker delivery with verified custody receipts.",
        },
      ],
    },
    features: {
      eyebrow: "FEATURES & FUNCTIONALITY",
      title: "Enterprise Governance & Regulatory Precision",
      description: "Designed to meet the stringent demands of global sustainability auditors and environmental regulators.",
      items: [
        {
          icon: "FileText",
          title: "BRSR Core Alignment",
          description: "Directly populates mandatory Principle 6 water metrics for listed Indian enterprises.",
          tag: "Regulatory Standards",
        },
        {
          icon: "Lock",
          title: "Cryptographic Provenance",
          description: "Every data point contains metadata indicating device serial, firmware, and calibration dates.",
          tag: "Integrity",
        },
        {
          icon: "AlertTriangle",
          title: "Exceedance Prevention",
          description: "Predictive warnings before cumulative monthly withdrawal caps are exceeded.",
          tag: "Risk Mitigation",
        },
        {
          icon: "CheckCircle2",
          title: "Water Positive (Replenishment) Proof",
          description: "Verify rainwater harvesting and recharge volumes with tamper-evident flow and level logs.",
          tag: "Stewardship",
        },
        {
          icon: "Download",
          title: "One-Click Assurance Packages",
          description: "Download fully reconciled audit packages with source telemetry, charts, and methodology notes.",
          tag: "Reporting",
        },
        {
          icon: "Network",
          title: "Environmental Portal Connectors",
          description: "Automate reporting directly to regional environmental protection databases and cloud registries.",
          tag: "Interoperability",
        },
      ],
    },
    useCases: {
      eyebrow: "USE CASES",
      title: "Powering Sustainability Governance Across Industries",
      description: "Trusted by publicly listed companies, pharmaceutical manufacturers, and commercial campuses.",
      items: [
        {
          icon: "Building2",
          title: "NSE/BSE Listed Enterprises",
          description: "Meet SEBI BRSR Core mandatory assurance requirements with verified water consumption data.",
          stats: "100% Audit Compliance",
          image: waterVerifyImg,
        },
        {
          icon: "Factory",
          title: "Pharmaceuticals & Chemicals",
          description: "Demonstrate strict Zero Liquid Discharge (ZLD) compliance with continuous effluent verification.",
          stats: "Zero Regulatory Violations",
          image: operationalIntelImg,
        },
        {
          icon: "Building",
          title: "Green Building Developers (LEED)",
          description: "Certify rainwater harvesting, graywater recycling, and water reduction points for LEED Platinum.",
          stats: "Certified LEED Credits",
          image: waterAccountImg,
        },
        {
          icon: "Coffee",
          title: "Food & Beverage Manufacturers",
          description: "Provide global retail brands with verifiable proof of water replenishment and watershed neutrality.",
          stats: "Verified Neutrality",
          image: waterVisibilityImg,
        },
      ],
    },
    benefits: {
      eyebrow: "BENEFITS & IMPACT",
      title: "Eliminate ESG Assurance Risks",
      description: "Transform sustainability reporting from a stressful annual scramble into continuous compliance.",
      metrics: [
        {
          target: 100,
          suffix: "%",
          displayRange: "100%",
          label: "Traceable Audit Trails",
          description: "Every single published sustainability metric is directly traceable back to raw sensor telemetry.",
        },
        {
          target: 85,
          suffix: "%",
          displayRange: "85%",
          label: "Reduction in ESG Reporting Effort",
          description: "Eliminate weeks of manual spreadsheet compilation with automated data extraction and formatting.",
        },
        {
          target: 0,
          suffix: "",
          displayRange: "Zero",
          label: "Regulatory Non-Compliance Penalties",
          description: "Continuous limit surveillance protects your enterprise from costly discharge and withdrawal penalties.",
        },
        {
          target: 99.9,
          decimals: 1,
          suffix: "%",
          displayRange: "99.9%",
          label: "Third-Party Auditor Confidence",
          description: "Independent auditors verify disclosures effortlessly with cryptographic log validation.",
        },
      ],
    },
    analyticsVisual: {
      eyebrow: "VERIFIED GOVERNANCE STREAM",
      title: "Live ESG Verification Portal",
      description: "Cryptographically validated time-series metrics ready for immediate auditor verification.",
      stats: [
        { label: "Assurance Status", value: "Certified", numericValue: 100, change: "100% Traceable" },
        { label: "Verified Data Records", value: "12.8", numericValue: 12.8, suffix: "M", change: "Immutable" },
        { label: "BRSR Core Readiness", value: "100", numericValue: 100, suffix: "%", change: "Complete" },
        { label: "Compliance Score", value: "99.9", numericValue: 99.9, suffix: "%", change: "CPCB Compliant" },
      ],
    },
    finalCta: {
      eyebrow: "READY TO VERIFY",
      title: "Ready to Make Your Water Disclosures",
      highlightTitle: "Audit-Proof and Verifiable?",
      description: "Speak with Veenero ESG water experts to evaluate your reporting readiness and automate compliance.",
      primaryCtaText: "Request a Demo",
      secondaryCtaText: "Talk to an Expert",
    },
  },

  "analytics-insights": {
    slug: "analytics-insights",
    badge: "ANALYTICS & INSIGHTS",
    title: "Analytics & Insights",
    tagline: {
      line1: "Macroscopic Clarity.",
      line2: "Predictive Models.",
      line3: "Network Intelligence.",
    },
    heroDescription:
      "Unify SCADA, IoT telemetry, regional watershed data, and enterprise ERP systems into an executive water intelligence command center for strategic capital planning and risk resilience.",
    heroPills: ["Enterprise Platform", "Predictive Forecasting", "SCADA & ERP Ready"],
    heroImage: analyticsImg,
    heroMetrics: [
      {
        title: "Daily Data Ingestion",
        value: "50",
        rawValue: 50,
        suffix: "M+",
        subtext: "Telemetry events / day",
        change: "+35% Growth",
        isPositive: true,
        type: "counter",
      },
      {
        title: "Multi-Site Benchmarks",
        value: "120",
        rawValue: 120,
        suffix: "+",
        subtext: "Cross-facility indexing",
        type: "counter",
      },
      {
        title: "API Ingestion Latency",
        value: "42",
        rawValue: 42,
        suffix: "ms",
        subtext: "Enterprise time-series",
        change: "Ultra-low",
        isPositive: true,
        type: "status",
      },
      {
        title: "Forecast Accuracy",
        value: "97.6",
        rawValue: 97.6,
        decimals: 1,
        suffix: "%",
        subtext: "Seasonal demand model",
        change: "High Precision",
        isPositive: true,
        type: "gauge",
        gaugePercent: 98,
      },
    ],
    overview: {
      eyebrow: "OVERVIEW",
      title: "Enterprise Backbone.",
      highlightTitle: "Network-Wide Intelligence.",
      description:
        "Gain macroscopic clarity across distributed facilities and regional supply catchments. Leverage predictive scenario forecasting, cross-facility benchmarking, and open API connectivity to drive long-term water resilience.",
      blocks: [
        {
          title: "Multi-Site Performance Benchmarking",
          description: "Compare water efficiency indices (WEI) across factories, campuses, and municipal divisions.",
          icon: "BarChart3",
        },
        {
          title: "Hydrological Risk Modeling",
          description: "Overlay local watershed stress, seasonal groundwater depletion, and climate risk scenarios.",
          icon: "Compass",
        },
        {
          title: "Predictive Demand Forecasting",
          description: "Machine learning models project water requirements across future production cycles.",
          icon: "TrendingUp",
        },
        {
          title: "Open Enterprise API Connectors",
          description: "Seamless bi-directional integration with SAP, Oracle, Microsoft Azure, and legacy SCADA systems.",
          icon: "Network",
        },
      ],
    },
    howItWorks: {
      eyebrow: "HOW IT WORKS",
      title: "Data Unification to Strategic Decisions",
      description: "Transforming disparate operational silos into an executive command center.",
      steps: [
        {
          step: "01",
          title: "Ingest",
          subtitle: "Universal Data Gateway",
          description: "Aggregate data from IoT edge sensors, SCADA PLCs, weather feeds, and ERP consumption records.",
          icon: "Layers",
        },
        {
          step: "02",
          title: "Harmonize",
          subtitle: "Data Normalization",
          description: "Cleanse, synchronize time-stamps, and normalize multi-source data streams into a unified data lake.",
          icon: "Activity",
        },
        {
          step: "03",
          title: "Model",
          subtitle: "Advanced Analytics",
          description: "Run statistical benchmarks, water efficiency scores, and climate risk scenario simulations.",
          icon: "Cpu",
        },
        {
          step: "04",
          title: "Benchmark",
          subtitle: "Comparative Insights",
          description: "Identify top-performing facilities and surface actionable recommendations for underperformers.",
          icon: "BarChart3",
        },
        {
          step: "05",
          title: "Integrate",
          subtitle: "Enterprise Intelligence",
          description: "Push verified metrics and forecasts directly to executive dashboards and business intelligence tools.",
          icon: "Network",
        },
      ],
    },
    techSection: {
      eyebrow: "PLATFORM ARCHITECTURE",
      title: "Enterprise Water Intelligence Core",
      subtitle: "High-Throughput Time-Series Engine Built for Network-Scale Operations",
      description:
        "Veenero Analytics & Insights is powered by a cloud-native microservices architecture capable of ingesting millions of telemetry events per second while maintaining sub-second query latency for executive dashboards.",
      diagramSteps: [
        {
          label: "Universal Ingestion API",
          desc: "REST, GraphQL, MQTT, and OPC-UA connectivity",
          icon: "Network",
        },
        {
          label: "Distributed Time-Series Lake",
          desc: "Petabyte-scale analytical data warehouse with retention tiers",
          icon: "Layers",
        },
        {
          label: "Analytical Computation Engine",
          desc: "Automated benchmarking, statistical models, and ML pipelines",
          icon: "Cpu",
        },
        {
          label: "BI & ERP Connectors",
          desc: "Pre-built connectors for Power BI, Tableau, SAP, and SCADA",
          icon: "BarChart3",
        },
      ],
    },
    capabilities: {
      eyebrow: "KEY CAPABILITIES",
      title: "Strategic Macro-Level Water Intelligence",
      description: "Scale from individual asset telemetry to multi-region infrastructure governance.",
      items: [
        {
          icon: "BarChart3",
          title: "Cross-Facility Benchmarking",
          description: "Rank efficiency and consumption across hundreds of operational sites in normalized units.",
        },
        {
          icon: "TrendingUp",
          title: "Predictive Demand Curves",
          description: "Forecast water demand based on weather projections, production schedules, and historical patterns.",
        },
        {
          icon: "ShieldAlert",
          title: "Watershed Stress Mapping",
          description: "Evaluate regional aquifer depletion and seasonal availability risks to protect business continuity.",
        },
        {
          icon: "Network",
          title: "Open Enterprise APIs",
          description: "Connect telemetry directly to central business intelligence platforms, data warehouses, and ERPs.",
        },
        {
          icon: "SlidersHorizontal",
          title: "Conservation ROI Tracking",
          description: "Quantify financial and volumetric payback for water efficiency and recycling capital investments.",
        },
        {
          icon: "Sliders",
          title: "Custom Analytical Workspaces",
          description: "Build custom role-based dashboards, KPI scorecards, and automated executive email digests.",
        },
      ],
    },
    features: {
      eyebrow: "FEATURES & FUNCTIONALITY",
      title: "Built for Enterprise Decision Makers",
      description: "Equip leadership and operational strategists with the macro tools needed to secure water resilience.",
      items: [
        {
          icon: "BarChart3",
          title: "Multi-Tenant Cloud Scale",
          description: "Enterprise multi-tenancy with dedicated organizational silos and custom role permissions.",
          tag: "Scalability",
        },
        {
          icon: "Calendar",
          title: "Seasonal Scenario Modeling",
          description: "Simulate operational constraints during monsoons, droughts, or municipal water curtailments.",
          tag: "Resilience",
        },
        {
          icon: "Database",
          title: "Granular Time-Series Queries",
          description: "Query years of historical high-resolution telemetry without performance degradation.",
          tag: "Performance",
        },
        {
          icon: "Share2",
          title: "Automated Executive Briefings",
          description: "Deliver scheduled weekly PDF briefings highlighting savings, efficiency leaders, and emerging risks.",
          tag: "Executive View",
        },
        {
          icon: "Lock",
          title: "Enterprise Security (SOC 2)",
          description: "Bank-grade encryption in transit and at rest, SAML 2.0 Single Sign-On, and audit logging.",
          tag: "Security",
        },
        {
          icon: "Network",
          title: "Open Data Export",
          description: "Full data portability with automated exports to AWS S3, Google BigQuery, or Azure Blob.",
          tag: "Open Data",
        },
      ],
    },
    useCases: {
      eyebrow: "USE CASES",
      title: "Strategic Impact at Enterprise Scale",
      description: "Unifying water governance across distributed supply chains, smart cities, and critical infrastructure.",
      items: [
        {
          icon: "Building2",
          title: "Multi-Site Industrial Conglomerates",
          description: "Compare water efficiency across 50+ manufacturing plants and standardize best practices across regions.",
          stats: "28% Average Savings",
          image: analyticsImg,
        },
        {
          icon: "Building",
          title: "State & Regional Water Authorities",
          description: "Consolidate regional reservoir, canal, and urban telemetry into a centralized hydrological dashboard.",
          stats: "Unified Regional View",
          image: waterVisibilityImg,
        },
        {
          icon: "Server",
          title: "Global Data Center Portfolios",
          description: "Optimize portfolio-wide Water Usage Effectiveness (WUE) across geographically distributed data centers.",
          stats: "1.15 Target WUE",
          image: operationalIntelImg,
        },
        {
          icon: "Globe",
          title: "ESG & Sustainability Directors",
          description: "Consolidate global corporate water footprints for board presentations and investor relations.",
          stats: "100% Portfolio Clarity",
          image: waterVerifyImg,
        },
      ],
    },
    benefits: {
      eyebrow: "BENEFITS & IMPACT",
      title: "Transform Data into Strategic Enterprise Value",
      description: "Empower executives and engineers with macro intelligence that mitigates risk and protects margins.",
      metrics: [
        {
          target: 35,
          suffix: "%",
          displayRange: "30-40%",
          label: "Capital Planning Accuracy",
          description: "Prevent over-engineering and optimize capital allocation for water treatment infrastructure.",
        },
        {
          target: 120,
          suffix: "+",
          displayRange: "120+",
          label: "Multi-Facility Benchmarks",
          description: "Standardize best practices by identifying high-performing plants and surfacing key efficiencies.",
        },
        {
          target: 42,
          suffix: "ms",
          displayRange: "<45ms",
          label: "Real-Time Query Latency",
          description: "Sub-second query responses across billions of historical time-series telemetry events.",
        },
        {
          target: 97.6,
          decimals: 1,
          suffix: "%",
          displayRange: "97.6%",
          label: "Predictive Forecast Accuracy",
          description: "High-precision seasonal models protect facilities from unexpected water supply shortages.",
        },
      ],
    },
    analyticsVisual: {
      eyebrow: "ENTERPRISE PLATFORM STREAM",
      title: "Enterprise Water Intelligence Command Center",
      description: "Live macro telemetry aggregated across facilities, regional DMAs, and supply basins.",
      stats: [
        { label: "Data Ingestion Rate", value: "50M+", numericValue: 50, suffix: " events/day", change: "Real-time" },
        { label: "Facilities Connected", value: "120+", numericValue: 120, change: "All Systems Online" },
        { label: "Query Latency", value: "<45ms", numericValue: 42, suffix: "ms", change: "Sub-second" },
        { label: "Prediction Accuracy", value: "97.6%", numericValue: 97.6, change: "High Precision" },
      ],
    },
    finalCta: {
      eyebrow: "READY FOR ENTERPRISE SCALE",
      title: "Ready to Build Your Enterprise Water",
      highlightTitle: "Data Command Center?",
      description: "Consult with our solutions architects to design an open, scalable water intelligence architecture.",
      primaryCtaText: "Request a Demo",
      secondaryCtaText: "Talk to an Expert",
    },
  },
};

/**
 * Helper to resolve solution data by slug with automatic fallback
 */
export function getSolutionBySlug(slug?: string): SolutionDetailData {
  if (!slug) return solutionDetailsMap["water-accountability"] || solutionDetailsMap["water-visibility"];
  const normalized = slug.toLowerCase().trim();

  // Authentic Veenero source slugs
  if (normalized === "aqua-saver") {
    const base = solutionDetailsMap["water-accountability"];
    return {
      ...base,
      title: "Aqua Saver",
      badge: "CORE SOLUTION: HARDWARE & SOFTWARE",
      heroDescription: "Aqua Saver and the Aqua Saver 3D-Module provide water conservative devices and software to eliminate water waste from leaks in overhead tanks, pipelines, and taps.",
    };
  }
  if (normalized === "water-quality-assessment" || normalized === "water-verification") {
    return solutionDetailsMap["water-verification"];
  }
  if (normalized === "water-pumping-automation" || normalized === "operational-intelligence") {
    return solutionDetailsMap["operational-intelligence"];
  }
  if (normalized === "water-tracking-informatics" || normalized === "water-visibility") {
    return solutionDetailsMap["water-visibility"];
  }
  if (normalized === "water-credits") {
    const base = solutionDetailsMap["water-accountability"];
    return {
      ...base,
      title: "Water Credits",
      badge: "APPLICATION FEATURE CONCEPT",
      heroDescription: "An application concept where users earn coins based on how much water they consume, prescribed under conservation guidelines. (Currently in development).",
    };
  }
  if (normalized === "leak-identification" || normalized === "analytics-insights") {
    return solutionDetailsMap["analytics-insights"];
  }

  // Legacy module id aliases
  if (normalized === "sense") return solutionDetailsMap["water-visibility"];
  if (normalized === "intelligence") return solutionDetailsMap["operational-intelligence"];
  if (normalized === "insights") return solutionDetailsMap["water-accountability"];
  if (normalized === "verification") return solutionDetailsMap["water-verification"];
  if (normalized === "platform" || normalized === "risk") return solutionDetailsMap["analytics-insights"];

  return solutionDetailsMap[normalized] || solutionDetailsMap["water-accountability"] || solutionDetailsMap["water-visibility"];
}
