import { HomeImpact } from "@/services/home.service";

// Foundation: Static Impact Content (Fallback)
export const impactContent: HomeImpact = {
  visible: true,
  eyebrow: "Benefits & Outcomes",
  title: "Making Every Litre Visible",
  description: "Water Visibility creates Water Accountability. Veenero helps organizations measure, monitor, optimize, benchmark, and verify water usage—so decisions are evidence-based and reporting is audit-ready.",
  impacts: [
    {
      iconName: "Droplets",
      value: "100%+",
      label: "Visibility Coverage",
      description: "Real-time measurement coverage across sites and systems",
    },
    {
      iconName: "TrendingUp",
      value: "Optimized",
      label: "Water Efficiency Gains",
      description: "Actionable recommendations backed by verified analytics",
    },
    {
      iconName: "Globe",
      value: "India-wide",
      label: "Network Benchmarking",
      description: "Comparative insights that help prioritize Water Risk",
    },
    {
      iconName: "Award",
      value: "Audit-ready",
      label: "Verified Reporting",
      description: "Water Accountability with traceable data and governance",
    },
  ],
  testimonial: {
    quote: "Veenero gave us Water Visibility we could finally trust. With benchmarked intelligence and verification-ready reporting, our teams moved from estimates to evidence—faster decisions, stronger accountability.",
    author: "Sarah Chen",
    role: "Sustainability & Water Lead",
    company: "Metro Water District",
  },
};
