import React from "react";
import { SolutionsContent } from "@/content/solutions";
import { CheckCircle2 } from "lucide-react";
import { ArchitectureFlowDiagram, BenefitBadgeItem } from "./solutionsIllustrations";

interface PlatformArchitectureProps {
  data: SolutionsContent["architecture"];
}

const benefitBadges = [
  {
    title: "End-to-End Visibility",
    description: "Complete visibility across the entire water lifecycle.",
    type: "visibility" as const,
  },
  {
    title: "Operational Efficiency",
    description: "Optimize operations and reduce water losses.",
    type: "efficiency" as const,
  },
  {
    title: "Verification Ready",
    description: "Built-in auditability for trust and compliance.",
    type: "verification" as const,
  },
  {
    title: "Sustainable Impact",
    description: "Data-driven decisions for a water-secure future.",
    type: "impact" as const,
  },
];

export const PlatformArchitecture: React.FC<PlatformArchitectureProps> = ({ data }) => {
  return (
    <section id="platform-architecture" className="py-16 sm:py-24 bg-transparent relative border-b border-border/10 select-none">
      {/* Background Water Caustic Light Glow */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="container mx-auto px-6 md:px-12 max-w-7xl space-y-12">
        
        {/* Section Header */}
        <div className="text-left font-sans max-w-3xl">
          {data.eyebrow && (
            <span className="text-teal-600 dark:text-teal-400 font-bold uppercase tracking-widest text-[10px] md:text-xs block mb-3">
              {data.eyebrow}
            </span>
          )}
          <h2 className="font-display text-3xl md:text-[2.5rem] font-bold text-foreground mb-3">
            {data.title}
          </h2>
          {data.description && (
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              {data.description}
            </p>
          )}
        </div>

        {/* 4-Step Vector Flow Bar */}
        <ArchitectureFlowDiagram />

        {/* 4 Layer Horizontal Architecture Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.layers.map((layer, idx) => {
            const staggerDelay = idx === 0 ? "reveal-delay-100" : idx === 1 ? "reveal-delay-200" : idx === 2 ? "reveal-delay-300" : "reveal-delay-400";
            return (
              <div
                key={idx}
                className={`group bg-card p-6 sm:p-7 rounded-2xl border border-border/40 hover:border-teal-500/50 shadow-sm hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between font-sans h-full relative overflow-hidden reveal-on-scroll ${staggerDelay}`}
              >
                <div>
                  {/* Header Tag & Layer Number */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-block px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 text-xs font-extrabold border border-teal-600/20">
                      LAYER {layer.number}
                    </span>
                    <span className="font-display text-2xl font-bold text-muted-foreground/30">
                      0{idx + 1}
                    </span>
                  </div>

                  {/* Layer Title */}
                  <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
                    {layer.title === "Sense & Ingest" ? "Data Collection" :
                     layer.title === "Stream & Validate" ? "Data Transmission" :
                     layer.title === "Analyze & Optimize" ? "Data Intelligence" :
                     "Governance & Action"}
                  </h3>

                  {/* Subtitle */}
                  <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 mb-3">
                    {layer.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                    {layer.description}
                  </p>

                  {/* Key Capabilities Checklist */}
                  <div className="space-y-2 pt-4 border-t border-border/20">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 mb-2">
                      Key Capabilities
                    </p>
                    {layer.capabilities.map((cap, cIdx) => (
                      <div key={cIdx} className="flex items-start gap-2 text-xs text-foreground/80">
                        <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 shrink-0 mt-0.5" />
                        <span className="leading-tight">{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 4 Benefit Badges Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          {benefitBadges.map((badge, idx) => {
            const staggerDelay = idx === 0 ? "reveal-delay-100" : idx === 1 ? "reveal-delay-200" : idx === 2 ? "reveal-delay-300" : "reveal-delay-400";
            return (
              <div key={idx} className={`reveal-on-scroll ${staggerDelay}`}>
                <BenefitBadgeItem
                  title={badge.title}
                  description={badge.description}
                  type={badge.type}
                />
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default PlatformArchitecture;
