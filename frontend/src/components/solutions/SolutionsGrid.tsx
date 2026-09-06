import React from "react";
import { SolutionsContent } from "@/content/solutions";
import { Check } from "lucide-react";
import { ProductSolutionIcon } from "./solutionsIllustrations";

interface SolutionsGridProps {
  data: SolutionsContent["solutionsGrid"];
}

export const SolutionsGrid: React.FC<SolutionsGridProps> = ({ data }) => {
  return (
    <section id="solutions-grid" className="py-16 sm:py-24 bg-transparent relative border-b border-border/10 select-none">
      {/* Background Water Caustic Glow */}
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

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

        {/* 6 Modular Solution Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.solutions.map((solution, idx) => {
            const staggerDelay = idx % 3 === 0 ? "reveal-delay-100" : idx % 3 === 1 ? "reveal-delay-200" : "reveal-delay-300";
            return (
              <div
                key={solution.id || idx}
                className={`group bg-card p-7 sm:p-8 rounded-2xl border border-border/40 hover:border-teal-500/50 shadow-sm hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between font-sans h-full relative overflow-hidden reveal-on-scroll ${staggerDelay}`}
              >
                <div>
                  {/* Top Bar: Icon + Pillar Tag */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:border-teal-500/60 hover-ripple-subtle transition-all duration-300">
                      <ProductSolutionIcon id={solution.id} />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-3 py-1 rounded-full border border-teal-600/20">
                      {solution.pillar}
                    </span>
                  </div>

                {/* Title & Tagline */}
                <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
                  {solution.title}
                </h3>
                <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 mb-3">
                  {solution.tagline}
                </p>

                {/* Description */}
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6">
                  {solution.description}
                </p>

                {/* Feature Checkpoints */}
                <div className="space-y-2 mb-6">
                  {solution.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2 text-xs text-foreground/80">
                      <Check className="h-3.5 w-3.5 text-teal-600 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Metric Callout Footer */}
              {solution.metrics && (
                <div className="pt-4 border-t border-border/20 flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground font-medium">
                    {solution.metrics.label}
                  </span>
                  <span className="text-xs font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/40 px-2.5 py-1 rounded-md border border-teal-600/20">
                    {solution.metrics.value}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default SolutionsGrid;
