// Types for Contact static content

export interface ContactInfoItem {
  iconName: string;
  label: string;
  value: string;
  href?: string;
  note?: string;
}

export interface ContactInquiryType {
  id: string;
  label: string;
}

export interface ContactFAQItem {
  question: string;
  answer: string;
}

export interface ContactPageContent {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCtaText: string;
    secondaryCtaText: string;
  };
  contactInfo: {
    eyebrow: string;
    title: string;
    description: string;
    items: ContactInfoItem[];
  };
  demoCard: {
    title: string;
    description: string;
    badge: string;
    bulletPoints: string[];
    buttonText: string;
  };
  form: {
    title: string;
    subtitle: string;
    inquiryTypes: ContactInquiryType[];
    submitButtonText: string;
    successTitle: string;
    successMessage: string;
  };
  faq: {
    eyebrow: string;
    title: string;
    description: string;
    items: ContactFAQItem[];
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

export const contactPageContent: ContactPageContent = {
  hero: {
    eyebrow: "GET IN TOUCH",
    title: "Connect with Our Water Intelligence Team",
    description:
      "Whether you are an enterprise seeking multi-site water visibility, a municipal utility modernizing telemetry, or an organization preparing audit-ready ESG disclosures—we are here to help.",
    primaryCtaText: "Send a Message",
    secondaryCtaText: "Platform Demo",
  },
  contactInfo: {
    eyebrow: "DIRECT REACH",
    title: "Contact Details",
    description:
      "Reach out directly to our engineering and sustainability team for technical consultations, pilots, or partnerships.",
    items: [
      {
        iconName: "MapPin",
        label: "Registered Office",
        value: "H-no 3-294/1/A/1 Tailors Colony, Adilabad 504001, Telangana, India",
        note: "Headquarters & Operations",
      },
      {
        iconName: "Phone",
        label: "Direct Phone",
        value: "+91 9346517202",
        href: "tel:+919346517202",
        note: "Mon – Fri, 9:00 AM – 6:00 PM IST",
      },
      {
        iconName: "Mail",
        label: "General Inquiries",
        value: "info@veenerosolutions.com",
        href: "mailto:info@veenerosolutions.com",
        note: "Official company inbox",
      },
      {
        iconName: "Mail",
        label: "Founder & Leadership",
        value: "udaygedam@veenerosolutions.com",
        href: "mailto:udaygedam@veenerosolutions.com",
        note: "Direct leadership communication",
      },
      {
        iconName: "Globe",
        label: "Official Website",
        value: "www.veenerosolutions.com",
        href: "https://www.veenerosolutions.com",
        note: "Company online portal",
      },
    ],
  },
  demoCard: {
    title: "Schedule a Platform Demo",
    description:
      "Experience Veenero Sense, Intelligence, and Insights live. Our water engineers will walk through real-time telemetry dashboards and anomaly detection tailored to your facility.",
    badge: "Live Architecture Walkthrough",
    bulletPoints: [
      "Real-time sensor telemetry simulation",
      "Multi-site benchmarking & efficiency indices",
      "BRSR & ESG verification export workflows",
    ],
    buttonText: "Request Guided Walkthrough",
  },
  form: {
    title: "Send Us a Message",
    subtitle: "Fill out the details below and our team will get in touch promptly.",
    inquiryTypes: [
      { id: "enterprise", label: "Enterprise Water Management" },
      { id: "municipal", label: "Municipal & Utility Infrastructure" },
      { id: "esg", label: "ESG & Compliance Verification" },
      { id: "general", label: "General Consultation / Partnership" },
    ],
    submitButtonText: "Send Message",
    successTitle: "Thank you for reaching out!",
    successMessage:
      "Your inquiry has been received. Our water intelligence engineering team will review your requirements and respond within 24 hours.",
  },
  faq: {
    eyebrow: "COMMON INQUIRIES",
    title: "Frequently Asked Questions",
    description:
      "Everything you need to know about evaluating, piloting, and deploying Veenero's water intelligence platform.",
    items: [
      {
        question: "How quickly can Veenero telemetry be deployed at our facility?",
        answer:
          "Veenero's edge telemetry sensors and gateways are designed for rapid non-invasive or inline installation, typically becoming fully operational with live data streams within 48 to 72 hours of site onboarding.",
      },
      {
        question: "Can Veenero integrate with our existing SCADA, BMS, or ERP systems?",
        answer:
          "Yes. Veenero's Water Data Platform provides open enterprise REST and GraphQL APIs, alongside native integration hooks for industrial SCADA, building management systems (BMS), and ERP platforms.",
      },
      {
        question: "How does the platform support corporate ESG and BRSR water disclosures?",
        answer:
          "All telemetry data processed through Veenero is cryptographically validated and stored with immutable change logs, enabling one-click audit trail exports formatted for BRSR, GRI, and CDP compliance.",
      },
      {
        question: "Do you support multi-facility benchmarking across regional sites?",
        answer:
          "Yes. The platform aggregates sub-metered telemetry across unlimited geographic locations, generating normalized water efficiency indices (WEI) for comparative performance analysis.",
      },
    ],
  },
  cta: {
    title: "Ready to Transform Your Water Network?",
    description:
      "Join organizations across India establishing complete water visibility, accountability, and verifiable sustainability with Veenero.",
    primaryButtonText: "Explore Solutions",
    primaryButtonLink: "/solutions",
    secondaryButtonText: "Our Methodology",
    secondaryButtonLink: "/approach",
  },
};
