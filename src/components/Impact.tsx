import { TrendingUp, Globe, Award, Droplets } from "lucide-react";

const impacts = [
  {
    icon: Droplets,
    value: "500M+",
    label: "Gallons Saved Annually",
    description: "Through our leak detection and optimization systems",
  },
  {
    icon: TrendingUp,
    value: "35%",
    label: "Average Cost Reduction",
    description: "For our clients' water-related expenses",
  },
  {
    icon: Globe,
    value: "150+",
    label: "Communities Served",
    description: "Across residential, commercial, and municipal sectors",
  },
  {
    icon: Award,
    value: "12",
    label: "Industry Awards",
    description: "Recognizing our innovation and impact",
  },
];

const testimonial = {
  quote:
    "Veenero's solutions have transformed how we manage water resources. Their technology reduced our water loss by 42% in the first year alone.",
  author: "Sarah Chen",
  role: "Director of Utilities",
  company: "Metro Water District",
};

export const Impact = () => {
  return (
    <section id="impact" className="py-24 bg-gradient-hero relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary-foreground/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-aqua/10 rounded-full blur-3xl animate-float animation-delay-600" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-primary-foreground/80 font-medium mb-4 tracking-wider uppercase text-sm">
            Our Impact
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Making Every Drop Count
          </h2>
          <p className="text-lg text-primary-foreground/80 leading-relaxed">
            Our commitment to sustainable water management has created
            measurable positive impact for our partners and the planet.
          </p>
        </div>

        {/* Impact Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mb-20">
          {impacts.map((impact) => (
            <div
              key={impact.label}
              className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-primary-foreground/20 hover:bg-primary-foreground/15 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-primary-foreground/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <impact.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <p className="font-display text-4xl font-bold text-primary-foreground mb-2">
                {impact.value}
              </p>
              <p className="font-semibold text-primary-foreground mb-2">
                {impact.label}
              </p>
              <p className="text-sm text-primary-foreground/70">
                {impact.description}
              </p>
            </div>
          ))}
        </div>

        {/* Testimonial */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-primary-foreground rounded-3xl p-10 md:p-14 shadow-xl">
            <div className="text-6xl text-primary/20 font-serif mb-6">"</div>
            <blockquote className="font-display text-2xl md:text-3xl text-foreground leading-relaxed mb-8">
              {testimonial.quote}
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-accent rounded-full flex items-center justify-center">
                <span className="font-display text-xl font-semibold text-primary">
                  {testimonial.author.split(" ").map((n) => n[0]).join("")}
                </span>
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  {testimonial.author}
                </p>
                <p className="text-sm text-muted-foreground">
                  {testimonial.role}, {testimonial.company}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
