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
    title: "Veenero Sustainable Solutions Pvt Ltd",
    description:
      "Water is at the core of sustainable development, climate adaptation, and human survival. We engineer conservative devices and intelligent software to enforce water management, reduce waste, and ensure water security.",
    primaryCtaText: "Our Story",
    secondaryCtaText: "Our Goals",
  },
  ourStory: {
    eyebrow: "OUR STORY & ORIGIN",
    title: "From Village Roots to Water Security",
    paragraphs: [
      "Water is at the core of sustainable development and is critical for socio-economic development, energy and food production, healthy ecosystems and for human survival itself. Water is also at the heart of adaptation to climate change, serving as the crucial link between society and the environment.",
      "We are from a village background, and we have seen precisely how many liters of water are wasted every day as a result of leaks in overhead tanks, pipelines, and taps. After conducting a thorough analysis of the issue, we discovered that there are no appropriate water management systems or water usage rules.",
      "We began working on water management and conservation after conducting an extensive study on the use and distribution of water across multiple sectors. Our primary goals are to enforce appropriate water management, reduce water waste, and ensure future water security.",
    ],
    stats: [
      { value: "49B L", label: "Daily Water Wasted in India (Neerain)" },
      { value: "30%", label: "Global Supply Lost to Leaks (Gitnux)" },
      { value: "600M", label: "People Facing Water Crisis" },
      { value: "297k", label: "Annual Child Diarrheal Deaths (WHO/UNICEF)" },
    ],
    image: "", // Resolved dynamically to defaultHeroImage in component
  },
  visionMission: {
    eyebrow: "PURPOSE & DIRECTION",
    title: "A Disciplined Approach to Conservation",
    vision: {
      title: "Our Vision",
      description:
        "A water-secure world where zero water is lost to unaddressed leaks, driven by appropriate water management systems and proactive conservation rules.",
    },
    mission: {
      title: "Our Mission",
      description:
        "To deliver effective water conservative devices (Aqua Saver) and software solutions that analyze usage, stop leakages, and protect precious water resources across societies and government sectors.",
    },
  },
  values: {
    eyebrow: "CORE PRINCIPLES",
    title: "The Pillars of Veenero",
    description:
      "Our engineering and software solutions are rooted in rigorous water management and verifiable conservation.",
    list: [
      {
        title: "Appropriate Management",
        description:
          "Enforcing structured rules and systematic oversight over water distribution networks.",
        icon: "Cpu",
      },
      {
        title: "Waste Reduction",
        description:
          "Systematic detection and prompt resolution of tap, pipe, seepage, and tank leaks.",
        icon: "Eye",
      },
      {
        title: "Water Security",
        description:
          "Safeguarding water access for communities, societies, and public administration.",
        icon: "ShieldCheck",
      },
      {
        title: "Hardware & Software",
        description:
          "Combining Aqua Saver device hardware with digital monitoring informatics.",
        icon: "Activity",
      },
      {
        title: "Community Collaboration",
        description:
          "Partnering with local societies, government bodies, and communities to protect every drop.",
        icon: "Users",
      },
    ],
  },
  whyVeenero: {
    eyebrow: "WHY CHOOSE VEENERO",
    title: "What Sets Veenero Apart",
    description:
      "While others focus on water treatment, Veenero targets the root cause of systemic loss: physical leakages and unmanaged distribution.",
    list: [
      {
        title: "Focused on Leakage Resolution",
        description:
          "Targeting tap leaks, seepage, pipe bursts, and overhead tank overflows directly.",
        icon: "Layers",
      },
      {
        title: "Unique Manufacturing Methods",
        description:
          "Innovative technology and conservation mechanisms utilized in Aqua Saver manufacturing.",
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
