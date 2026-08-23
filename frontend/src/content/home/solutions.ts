import { HomeSolutions } from "@/services/home.service";

// Foundation: Static Solutions Content (Fallback)
export const solutionsContent: HomeSolutions = {
  visible: true,
  eyebrow: "Product Suite",
  title: "India’s Water Intelligence Platform",
  description: "Veenero is building a shared water data infrastructure to help organizations measure, monitor, optimize, benchmark, and verify water usage—so every litre becomes visible and accountable.",
  ctaText: "Explore the Suite",
  ctaLink: "/#solutions",
  list: [
    {
      iconName: "Search",
      title: "Veenero Sense",
      description: "Capture water data and create Water Visibility—integrating measurements across sites, assets, and operational contexts.",
      features: ["Real-time water data capture", "Multi-source integration", "Data integrity checks"],
    },
    {
      iconName: "BarChart3",
      title: "Veenero Intelligence",
      description: "Turn signals into decisions with Water Intelligence—analytics that measure usage, identify patterns, benchmark performance, and optimize performance.",
      features: ["Optimization insights", "Benchmarking reports", "Water Efficiency tracking"],
    },
    {
      iconName: "Waves",
      title: "Veenero Insights",
      description: "Communicate outcomes with Water Verification-ready reporting—auditable analytics designed for accountability across teams and stakeholders.",
      features: ["Audit-ready dashboards", "Verification workflows", "Actionable accountability"],
    },
    {
      iconName: "Shield",
      title: "Water Verification",
      description: "A verification-first approach that helps organizations demonstrate measurement validity, governance, and ongoing monitoring quality.",
      features: ["Verification trails", "Compliance-ready exports", "Change & assurance history"],
    },
    {
      iconName: "Cloud",
      title: "Water Data Platform",
      description: "The infrastructure layer that unifies water data across organizations—enabling benchmarking, governance, and future network-scale intelligence.",
      features: ["Network-ready architecture", "Role-based governance", "Benchmark datasets"],
    },
    {
      iconName: "Leaf",
      title: "Water Risk & Accountability",
      description: "Assess Water Risk and drive Water Accountability—so organizations can prioritize interventions based on evidence, not assumptions.",
      features: ["Risk scoring", "Operational accountability", "Verified performance outcomes"],
    },
  ],
};
