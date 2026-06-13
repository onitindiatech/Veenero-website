import { Droplet, Search, BarChart3, Shield, Waves, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

const solutions = [
  {
    icon: Search,
    title: "Advanced Leak Detection",
    description:
      "AI-powered sensors and analytics identify leaks before they become costly problems, reducing water loss by up to 40%.",
    features: ["Real-time monitoring", "Predictive alerts", "Underground detection"],
  },
  {
    icon: BarChart3,
    title: "Smart Water Analytics",
    description:
      "Comprehensive dashboards and reporting tools that provide actionable insights into water usage patterns and efficiency.",
    features: ["Usage forecasting", "Consumption trends", "Benchmark reports"],
  },
  {
    icon: Waves,
    title: "Flow Optimization",
    description:
      "Intelligent systems that automatically adjust water pressure and flow to minimize waste while maintaining service quality.",
    features: ["Pressure management", "Dynamic control", "Zone optimization"],
  },
  {
    icon: Droplet,
    title: "Rainwater Harvesting",
    description:
      "Sustainable collection and storage systems that capture and repurpose rainwater for non-potable applications.",
    features: ["Collection design", "Storage solutions", "Distribution systems"],
  },
  {
    icon: Shield,
    title: "Quality Monitoring",
    description:
      "Continuous water quality assessment ensuring compliance with regulations and protecting public health.",
    features: ["Contaminant detection", "pH monitoring", "Compliance reporting"],
  },
  {
    icon: Leaf,
    title: "Irrigation Management",
    description:
      "Smart irrigation solutions that use weather data and soil sensors to optimize water delivery for agriculture and landscaping.",
    features: ["Soil moisture sensing", "Weather integration", "Crop-specific plans"],
  },
];

export const Solutions = () => {
  return (
    <section id="solutions" className="py-24 bg-gradient-wave relative">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-primary font-medium mb-4 tracking-wider uppercase text-sm">
            Our Solutions
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Technology-Driven Water Conservation
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Our comprehensive suite of solutions addresses every aspect of water
            management, from detection to optimization to sustainability.
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
            View All Solutions
          </Button>
        </div>
      </div>
    </section>
  );
};
