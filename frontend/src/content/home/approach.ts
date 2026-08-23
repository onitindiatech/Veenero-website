import { HomeApproach } from "@/services/home.service";

// Foundation: Static Approach Content (Fallback)
export const approachContent: HomeApproach = {
  visible: true,
  eyebrow: "Our Approach",
  title: "A Proven Path to Water Sustainability",
  description: "Our methodical four-step process ensures successful outcomes for every project, from initial assessment to long-term optimization.",
  steps: [
    {
      number: "01",
      title: "Sense: Measure Every Litre",
      description: "Onboard your water data sources to build Water Visibility—so usage is measurable across sites, assets, and operations.",
      points: ["Data capture mapping", "Baseline measurement", "Integrity & validation checks"],
    },
    {
      number: "02",
      title: "Intelligence: Monitor & Benchmark",
      description: "Use real-time analytics to track performance, compare across peers, and surface Water Risk early.",
      points: ["Real-time analytics", "Benchmarking", "Operational anomaly signals"],
    },
    {
      number: "03",
      title: "Optimize: Act with Evidence",
      description: "Transform insights into interventions—improving Water Efficiency through quantified recommendations and measurable outcomes.",
      points: ["Optimization scenarios", "Efficiency tracking", "Actionable workflows"],
    },
    {
      number: "04",
      title: "Verify: Prove Accountability",
      description: "Verification-ready reporting and audit trails help teams demonstrate Water Accountability with confidence.",
      points: ["Verification trails", "Audit-ready dashboards", "Ongoing assurance"],
    },
  ],
};
