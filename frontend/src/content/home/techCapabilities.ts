export interface TechCapabilityItem {
  id: string;
  iconName: string;
  category: string;
  title: string;
  badge?: string;
}

export interface TechCapabilitiesContent {
  eyebrow: string;
  title: string;
  description: string;
  items: TechCapabilityItem[];
}

export const techCapabilitiesContent: TechCapabilitiesContent = {
  eyebrow: "CONNECTED CAPABILITIES",
  title: "Integrated Water Intelligence Ecosystem",
  description:
    "From rugged edge sensing to real-time AI anomaly detection and audit-grade ESG verification.",
  items: [
    {
      id: "edge-telemetry",
      iconName: "Cpu",
      category: "Edge Infrastructure",
      title: "Rugged Edge Telemetry",
      badge: "IoT Gateways",
    },
    {
      id: "flow-pressure",
      iconName: "Radio",
      category: "Water Visibility",
      title: "Real-Time Flow & Pressure",
      badge: "Sub-second",
    },
    {
      id: "cryptographic-integrity",
      iconName: "ShieldCheck",
      category: "Data Assurance",
      title: "Cryptographic Integrity",
      badge: "Tamper-Proof",
    },
    {
      id: "ai-anomaly",
      iconName: "Sparkles",
      category: "Water Intelligence",
      title: "AI Micro-Leak Detection",
      badge: "24/7 Monitoring",
    },
    {
      id: "multi-site-benchmark",
      iconName: "LineChart",
      category: "Performance Indexing",
      title: "Multi-Site Benchmarking",
      badge: "Cross-Facility",
    },
    {
      id: "esg-verification",
      iconName: "FileCheck2",
      category: "Water Accountability",
      title: "Audit-Ready ESG Exports",
      badge: "BRSR / GRI Ready",
    },
    {
      id: "enterprise-apis",
      iconName: "Network",
      category: "Open Ecosystem",
      title: "SCADA, BMS & ERP Connectors",
      badge: "Open APIs",
    },
    {
      id: "predictive-analytics",
      iconName: "BarChart3",
      category: "Machine Learning",
      title: "Predictive Consumption Curves",
      badge: "Forecasting",
    },
    {
      id: "risk-modeling",
      iconName: "ShieldAlert",
      category: "Resilience Engine",
      title: "Watershed Stress Mapping",
      badge: "Risk Index",
    },
    {
      id: "sub-metering",
      iconName: "Layers",
      category: "Operational Governance",
      title: "Sub-Meter Cost Allocation",
      badge: "Granular Visibility",
    },
  ],
};
