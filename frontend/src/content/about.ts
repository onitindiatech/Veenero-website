// Types for About Us static content

export interface AboutValue {
  title: string;
  description: string;
  icon: string;
}

export interface AboutDifferentiator {
  title: string;
  description: string;
  icon: string;
}

export interface LeadershipProfile {
  name: string;
  role: string;
  bio: string;
  image?: string;
  linkedin?: string;
}

export interface AboutStat {
  value: string;
  label: string;
}

export interface AboutContent {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCtaText: string;
    secondaryCtaText: string;
  };
  ourStory: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    stats: AboutStat[];
    image: string;
  };
  visionMission: {
    eyebrow: string;
    title: string;
    vision: {
      title: string;
      description: string;
    };
    mission: {
      title: string;
      description: string;
    };
  };
  values: {
    eyebrow: string;
    title: string;
    description: string;
    list: AboutValue[];
  };
  whyVeenero: {
    eyebrow: string;
    title: string;
    description: string;
    list: AboutDifferentiator[];
  };
  leadership: {
    eyebrow: string;
    title: string;
    description: string;
    team: LeadershipProfile[];
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

export const aboutContent: AboutContent = {
  hero: {
    eyebrow: "ABOUT VEENERO",
    title: "Building India's Water Intelligence Network",
    description:
      "We are the digital infrastructure layer for water management—creating Water Visibility, Water Accountability, and Water Verification through real-time telemetry and advanced analytics.",
    primaryCtaText: "Our Story",
    secondaryCtaText: "Core Values",
  },
  ourStory: {
    eyebrow: "OUR STORY & ORIGIN",
    title: "From Water Blindspots to Real-Time Intelligence",
    paragraphs: [
      "Veenero was founded with a singular conviction: organizations cannot manage or preserve what they cannot measure. Across municipal systems, industrial plants, and commercial facilities, billions of litres of water move unmonitored every single day.",
      "Traditional approaches relied on static hardware or isolated leak detectors. Veenero is fundamentally different—we build the future digital infrastructure layer for water management.",
      "By unifying rugged edge sensors, cloud telemetry, and AI-driven anomaly signals into a shared water data platform, we empower enterprise leaders and utilities to make every litre visible, accountable, and verifiable.",
    ],
    stats: [
      { value: "24/7", label: "Real-Time Monitoring Coverage" },
      { value: "Multi-site", label: "Benchmarking & Anomaly Alerts" },
      { value: "Audit-ready", label: "Verification-First Reporting" },
      { value: "Pan-India", label: "Scalable Infrastructure" },
    ],
    image: "", // Resolved dynamically to defaultHeroImage in component
  },
  visionMission: {
    eyebrow: "PURPOSE & DIRECTION",
    title: "Shaping a Water-Secure Future",
    vision: {
      title: "Our Vision",
      description:
        "A world where zero water goes unmeasured, unaccounted, or wasted. We envision sustainable, resilient ecosystems powered by universal water visibility and real-time intelligence.",
    },
    mission: {
      title: "Our Mission",
      description:
        "To deliver India's most reliable and scalable telemetry infrastructure and water data platform, empowering organizations, utilities, and communities to secure their water future.",
    },
  },
  values: {
    eyebrow: "CORE PRINCIPLES",
    title: "The Pillars of Veenero",
    description:
      "Our engineering, culture, and products are rooted in rigorous water accountability and sustainable impact.",
    list: [
      {
        title: "Water Intelligence",
        description:
          "Turning fragmented telemetry data into predictive insights, benchmarking, and actionable governance.",
        icon: "Cpu",
      },
      {
        title: "Water Visibility",
        description:
          "Making every single litre measurable across assets, operations, and networks with zero blindspots.",
        icon: "Eye",
      },
      {
        title: "Water Accountability",
        description:
          "Verification-ready data trails that support transparent ESG reporting and measurable conservation.",
        icon: "ShieldCheck",
      },
      {
        title: "Resilient Engineering",
        description:
          "Rugged edge hardware and cloud architectures designed to perform reliably in demanding environments.",
        icon: "Activity",
      },
    ],
  },
  whyVeenero: {
    eyebrow: "WHY CHOOSE VEENERO",
    title: "What Sets Veenero Apart",
    description:
      "We do not provide single-point devices or surface-level charts. We deliver a complete digital infrastructure layer for enterprise water management.",
    list: [
      {
        title: "End-to-End Infrastructure",
        description:
          "From edge telemetry sensors and gateway hardware to cloud intelligence and executive dashboards.",
        icon: "Layers",
      },
      {
        title: "Real-Time Actionability",
        description:
          "Instant anomaly detection and threshold triggers so teams can intervene before losses compound.",
        icon: "Zap",
      },
      {
        title: "Verification-Ready Auditing",
        description:
          "Tamper-resistant audit trails designed to meet stringent ESG compliance and regulatory requirements.",
        icon: "FileCheck2",
      },
      {
        title: "Open & Scalable Ecosystem",
        description:
          "Seamless API integrations with enterprise ERPs, SCADA systems, and facility management platforms.",
        icon: "Network",
      },
    ],
  },
  leadership: {
    eyebrow: "OUR TEAM",
    title: "Driven by Water & Technology Pioneers",
    description:
      "Our multidisciplinary team unites IoT systems engineers, data scientists, and water conservation advocates.",
    team: [
      {
        name: "Founding Team",
        role: "Leadership & Strategy",
        bio: "Steering the mission to establish India's most comprehensive digital water intelligence network.",
      },
      {
        name: "Telemetry & Edge Engineering",
        role: "Hardware & IoT Systems",
        bio: "Designing rugged, industrial-grade sensors and edge gateways for high-precision water metering.",
      },
      {
        name: "Data Science & Cloud Platform",
        role: "Water Analytics & AI",
        bio: "Developing predictive consumption models, anomaly detection algorithms, and verification pipelines.",
      },
    ],
  },
  cta: {
    title: "Ready to Transform Your Water Network?",
    description:
      "Join forward-thinking enterprises and utilities creating water visibility and verifiable sustainability with Veenero.",
    primaryButtonText: "Explore Our Solutions",
    primaryButtonLink: "/solutions",
    secondaryButtonText: "Get in Touch",
    secondaryButtonLink: "/contact",
  },
};
