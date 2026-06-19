import { Target, Heart, Users } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Water Intelligence",
    description:
      "We help organizations measure, monitor, optimize, benchmark, and verify water usage—turning fragmented data into actionable accountability.",
  },
  {
    icon: Heart,
    title: "Water Visibility",
    description:
      "Making every litre measurable across assets, sites, and systems—so decisions are data-driven, timely, and transparent.",
  },
  {
    icon: Users,
    title: "Water Accountability",
    description:
      "A verification-ready water data layer that supports reporting, governance, and performance improvement over time.",
  },
];

export const About = () => {
  return (
    <section id="about" className="py-24 bg-background relative">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-primary font-medium mb-4 tracking-wider uppercase text-sm">
            About Veenero
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Building India's Water Intelligence Network
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Veenero is not a leak detection company, not a hardware provider, and not a single device approach.
            We are the future digital infrastructure layer for water management—helping organizations create
            Water Visibility, Water Accountability, and Water Verification through real-time analytics and a shared
            water data platform.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {values.map((value) => (
            <div
              key={value.title}
              className="group relative bg-card rounded-2xl p-8 shadow-card hover:shadow-glow transition-all duration-500 border border-border hover:border-primary/30"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-ocean rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="w-14 h-14 bg-accent rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <value.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-4">
                {value.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {[
            { value: "24/7", label: "Water Monitoring Coverage" },
            { value: "Multi-site", label: "Benchmarking & Comparison" },
            { value: "Audit-ready", label: "Verification-First Reporting" },
            { value: "India", label: "Network Growth Focus" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-4xl md:text-5xl font-bold text-primary mb-2">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
