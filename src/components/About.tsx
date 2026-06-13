import { Target, Heart, Users } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Our Mission",
    description:
      "To drive sustainable development by delivering technology-enabled solutions that address environmental challenges across water, energy, and resource management.",
  },
  {
    icon: Heart,
    title: "Our Vision",
    description:
      "A future where communities thrive through responsible resource use, smart infrastructure, and sustainable innovations that protect the planet.",
  },
  {
    icon: Users,
    title: "Our Values",
    description:
      "Sustainability, innovation, and integrity guide our work. We believe in building solutions that create measurable impact and long-term resilience.",
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
            Innovating for a Sustainable Future
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Veenero Sustainable Solutions is committed to building smart, scalable,
            and eco-friendly technologies that help communities reduce waste,
            conserve resources, and adopt sustainable living. Our expertise spans
            water stewardship, environmental monitoring, and responsible resource
            management.
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
            { value: "15+", label: "Years of Sustainable Innovation" },
            { value: "500+", label: "Impact-Driven Projects" },
            { value: "2M+", label: "Resources Conserved Daily" },
            { value: "98%", label: "Partner Satisfaction" },
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