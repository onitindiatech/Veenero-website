import { BarChart3, Search, Shield, Waves, Leaf, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";

const solutions = [
  {
    icon: Search,
    title: "Veenero Sense",
    description:
      "Capture water data and create Water Visibility—integrating measurements across sites, assets, and operational contexts.",
    features: ["Real-time water data capture", "Multi-source integration", "Data integrity checks"],
  },
  {
    icon: BarChart3,
    title: "Veenero Intelligence",
    description:
      "Turn signals into decisions with Water Intelligence—analytics that measure usage, identify patterns, benchmark performance, and optimize performance.",
    features: ["Optimization insights", "Benchmarking reports", "Water Efficiency tracking"],
  },
  {
    icon: Waves,
    title: "Veenero Insights",
    description:
      "Communicate outcomes with Water Verification-ready reporting—auditable analytics designed for accountability across teams and stakeholders.",
    features: ["Audit-ready dashboards", "Verification workflows", "Actionable accountability"],
  },
  {
    icon: Shield,
    title: "Water Verification",
    description:
      "A verification-first approach that helps organizations demonstrate measurement validity, governance, and ongoing monitoring quality.",
    features: ["Verification trails", "Compliance-ready exports", "Change & assurance history"],
  },
  {
    icon: Cloud,
    title: "Water Data Platform",
    description:
      "The infrastructure layer that unifies water data across organizations—enabling benchmarking, governance, and future network-scale intelligence.",
    features: ["Network-ready architecture", "Role-based governance", "Benchmark datasets"],
  },
  {
    icon: Leaf,
    title: "Water Risk & Accountability",
    description:
      "Assess Water Risk and drive Water Accountability—so organizations can prioritize interventions based on evidence, not assumptions.",
    features: ["Risk scoring", "Operational accountability", "Verified performance outcomes"],
  },
];

export const Solutions = () => {
  return (
    <section id="solutions" className="py-24 bg-gradient-wave relative">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-primary font-medium mb-4 tracking-wider uppercase text-sm">
            Product Suite
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            India’s Water Intelligence Platform
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Veenero is building a shared water data infrastructure to help organizations measure, monitor, optimize,
            benchmark, and verify water usage—so every litre becomes visible and accountable.
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {solutions.map((solution) => (
            <div
              key={solution.title}
              className="group bg-card rounded-2xl p-8 shadow-card hover:shadow-glow transition-all duration-500 border border-border hover:border-primary/30 hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-gradient-ocean rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <solution.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                {solution.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {solution.description}
              </p>
              <ul className="space-y-2">
                {solution.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Button variant="ocean" size="xl">
            Explore the Suite
          </Button>
        </div>
      </div>
    </section>
  );
};

