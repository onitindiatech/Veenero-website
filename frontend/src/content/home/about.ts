import { HomeAbout } from "@/services/home.service";

// Foundation: Static About Content (Fallback)
export const aboutContent: HomeAbout = {
  visible: true,
  eyebrow: "About Veenero",
  title: "Building India's Water Intelligence Network",
  description: "Veenero is not a leak detection company, not a hardware provider, and not a single device approach. We are the future digital infrastructure layer for water management—helping organizations create Water Visibility, Water Accountability, and Water Verification through real-time analytics and a shared water data platform.",
  values: [
    {
      iconName: "Target",
      title: "Water Intelligence",
      description: "We help organizations measure, monitor, optimize, benchmark, and verify water usage—turning fragmented data into actionable accountability.",
    },
    {
      iconName: "Heart",
      title: "Water Visibility",
      description: "Making every litre measurable across assets, sites, and systems—so decisions are data-driven, timely, and transparent.",
    },
    {
      iconName: "Users",
      title: "Water Accountability",
      description: "A verification-ready water data layer that supports reporting, governance, and performance improvement over time.",
    },
  ],
  stats: [
    { value: "24/7", label: "Water Monitoring Coverage" },
    { value: "Multi-site", label: "Benchmarking & Comparison" },
    { value: "Audit-ready", label: "Verification-First Reporting" },
    { value: "India", label: "Network Growth Focus" },
  ],
};
