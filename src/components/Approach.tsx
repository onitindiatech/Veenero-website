import { CheckCircle2 } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Assessment & Analysis",
    description:
      "We begin with a comprehensive audit of your current water systems, identifying inefficiencies and opportunities for improvement.",
    points: [
      "Infrastructure evaluation",
      "Usage pattern analysis",
      "Baseline measurements",
    ],
  },
  {
    number: "02",
    title: "Custom Solution Design",
    description:
      "Our engineers develop a tailored strategy that addresses your specific challenges while maximizing ROI and sustainability impact.",
    points: [
      "Technology selection",
      "Integration planning",
      "Cost-benefit analysis",
    ],
  },
  {
    number: "03",
    title: "Implementation & Integration",
    description:
      "Expert installation and seamless integration with your existing systems, minimizing disruption while maximizing results.",
    points: [
      "Professional deployment",
      "System calibration",
      "Staff training",
    ],
  },
  {
    number: "04",
    title: "Monitoring & Optimization",
    description:
      "Continuous oversight and refinement ensure your water management systems perform at peak efficiency over time.",
    points: [
      "24/7 monitoring",
      "Performance reports",
      "Ongoing support",
    ],
  },
];

export const Approach = () => {
  return (
    <section id="approach" className="py-24 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-sage-light/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-primary font-medium mb-4 tracking-wider uppercase text-sm">
            Our Approach
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            A Proven Path to Water Sustainability
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Our methodical four-step process ensures successful outcomes for
            every project, from initial assessment to long-term optimization.
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="relative flex flex-col md:flex-row gap-8 pb-16 last:pb-0"
            >
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute left-[39px] top-20 w-0.5 h-[calc(100%-80px)] bg-gradient-to-b from-primary to-primary/20" />
              )}

              {/* Number */}
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-gradient-ocean rounded-2xl flex items-center justify-center shadow-soft">
                  <span className="font-display text-2xl font-bold text-primary-foreground">
                    {step.number}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-grow bg-card rounded-2xl p-8 shadow-card border border-border hover:border-primary/20 transition-all duration-300">
                <h3 className="font-display text-2xl font-semibold text-foreground mb-4">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {step.description}
                </p>
                <ul className="grid sm:grid-cols-3 gap-3">
                  {step.points.map((point) => (
                    <li key={point} className="flex items-center gap-2 text-sm text-foreground">
                      <CheckCircle2 className="h-4 w-4 text-secondary flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
