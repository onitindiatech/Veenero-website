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
    eyebrow: "THE REAL WATER PROBLEM",
    title: "Addressing 49 Billion Liters of Daily Water Waste",
    description:
      "India wastes 49 billion liters of water daily while 600 million people face severe water crisis. Veenero provides practical devices and software to eliminate leaks and build water security.",
    primaryCtaText: "Our Impact",
    secondaryCtaText: "View Statistics",
  },
  outcomes: {
    eyebrow: "SUPPORTED WATER STATISTICS",
    title: "Quantified Reality Across the Water Crisis",
    description:
      "Authentic research figures documenting the urgent necessity of water conservation devices and leakage management.",
    pillars: [
      {
        value: "49B L",
        label: "Daily Water Wasted in India",
        description:
          "Equivalent to 48.42 billion 1-liter bottles wasted every day across India due to leaks and lack of usage rules. (Neerain)",
        icon: "TrendingDown",
        tag: "India Crisis",
      },
      {
        value: "30%",
        label: "Global Supply Lost",
        description:
          "Lost each year due to leaks and inefficient usage, equating to around 2.1 trillion gallons of water wasted. (Gitnux)",
        icon: "Globe",
        tag: "Global Reality",
      },
      {
        value: "600M",
        label: "Facing Water Crisis",
        description:
          "Hundreds of millions experiencing severe water scarcity while billions of liters are lost to unaddressed leaks.",
        icon: "Users",
        tag: "Human Impact",
      },
      {
        value: "297k",
        label: "Child Deaths Annually",
        description:
          "Children under five dying every year from diarrheal diseases due to poor sanitation and unsafe water. (WHO/UNICEF)",
        icon: "ShieldAlert",
        tag: "Health & Sanitation",
      },
    ],
  },
  storyline: {
    eyebrow: "WORKING MODULE ROADMAP",
    title: "From Identification to Resolution",
    description:
      "Our structured 6-step conservation process.",
    steps: [
      {
        number: "01",
        stage: "Setup",
        title: "Setting up the Aqua Saver",
        description:
          "Deploying the Aqua Saver conservative device and 3D-Module across tanks, pumps, and pipe networks.",
        outcome: "Device active and measuring flow.",
        icon: "Cpu",
      },
      {
        number: "02",
        stage: "Monitor",
        title: "Monitoring the System",
        description:
          "Surveillance of overhead tanks, pipelines, and motor pumps to observe continuous operation.",
        outcome: "Active flow vigilance.",
        icon: "Activity",
      },
      {
        number: "03",
        stage: "Collect",
        title: "Collection of Data",
        description:
          "Feeding telemetry and distribution data directly into the water application software.",
        outcome: "Usage informatics compiled.",
        icon: "Database",
      },
      {
        number: "04",
        stage: "Detect",
        title: "Identification of Leakage",
        description:
          "Pinpointing tap leaks, seepage, pipeline breaks, and overhead tank overflows promptly.",
        outcome: "Anomalies isolated.",
        icon: "Search",
      },
      {
        number: "05",
        stage: "Evaluate",
        title: "Identifying Characteristics",
        description:
          "Assessing leak flow rate, pressure loss, and severity characteristics for swift action.",
        outcome: "Severity ranked and diagnosed.",
        icon: "Layers",
      },
      {
        number: "06",
        stage: "Resolve",
        title: "Resolving the Leak Problem",
        description:
          "Guiding maintenance, automating motor controls, and verifying water conserved.",
        outcome: "Water saved & network secured.",
        icon: "CheckCircle2",
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
      text: "Water is at the core of sustainable development and critical for socio-economic development, healthy ecosystems and human survival itself. We began working on water conservation to eliminate the leaks we observed and build lasting water security.",
      author: "Veenero Sustainable Solutions",
      role: "Core Team",
      organization: "Adilabad, Telangana",
    },
  },
  sustainability: {
    eyebrow: "VERIFIED RECOGNITION & GOALS",
    title: "Committed to Measurable Conservation & Security",
    description:
      "Our work on water management and conservation is supported by state-level incubators and grassroots innovation honors.",
    pillars: [
      {
        title: "We Hub POC Certification",
        description:
          "Received Proof of Concept (POC) certification from We Hub, Government of Telangana for our innovative water conservation methodology.",
      },
      {
        title: "Intinta Innovator Award",
        description:
          "Aqua Saver honored with the prestigious Intinta Innovator Award for two consecutive years at the district level.",
      },
      {
        title: "National Innovation Challenge",
        description:
          "Selected participant at the National Innovation Challenge held at PIET College, Haryana.",
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
