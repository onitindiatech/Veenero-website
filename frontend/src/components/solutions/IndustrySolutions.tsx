import React from "react";
import { SolutionsContent } from "@/content/solutions";
import { CheckCircle2 } from "lucide-react";
import { IndustryCardIcon } from "./solutionsIllustrations";

interface IndustrySolutionsProps {
  data: SolutionsContent["industries"];
}

export const IndustrySolutions: React.FC<IndustrySolutionsProps> = ({ data }) => {
  return (
    <section id="industry-solutions" className="py-16 sm:py-24 bg-transparent relative border-b border-border/10 select-none">
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

        {/* 4 Industry Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.list.map((industry, idx) => {
            const staggerDelay = idx === 0 ? "reveal-delay-100" : idx === 1 ? "reveal-delay-200" : idx === 2 ? "reveal-delay-300" : "reveal-delay-400";
            return (
              <div
                key={idx}
                className={`group bg-card p-7 sm:p-8 rounded-2xl border border-border/40 hover:border-teal-500/50 shadow-sm hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between font-sans h-full relative overflow-hidden reveal-on-scroll ${staggerDelay}`}
              >
                <div>
                  {/* Icon Badge */}
                  <IndustryCardIcon index={idx} />

                {/* Title */}
                <h3 className="text-lg font-bold text-foreground mb-3 leading-snug group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
                  {industry.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6">
                  {industry.description}
                </p>
              </div>

              {/* Primary Use Cases List */}
              <div className="pt-4 border-t border-border/20 space-y-2">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-teal-700 dark:text-teal-400 mb-2">
                  Primary Use Cases
                </p>
                <div className="space-y-1.5">
                  {industry.useCases.map((useCase, uIdx) => (
                    <div key={uIdx} className="flex items-start gap-1.5 text-xs text-foreground/80">
                      <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 shrink-0 mt-0.5" />
                      <span className="leading-tight">{useCase}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default IndustrySolutions;
