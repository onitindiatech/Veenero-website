import React from "react";
import { SolutionsContent } from "@/content/solutions";
import { Factory, Building2, Building, Server, CheckCircle2 } from "lucide-react";

interface IndustrySolutionsProps {
  data: SolutionsContent["industries"];
}

const industryIcons: Record<string, React.ElementType> = {
  Factory,
  Building2,
  Building,
  Server,
};

export const IndustrySolutions: React.FC<IndustrySolutionsProps> = ({ data }) => {
  return (
    <section id="industry-solutions" className="py-12 md:py-16 bg-transparent relative border-b border-border/10">
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
            const Icon = industryIcons[industry.icon] || Factory;
            return (
              <div
                key={idx}
                className="group bg-card p-6 md:p-8 rounded-2xl border border-border/40 hover:border-teal-600/30 shadow-sm hover:shadow-soft hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between font-sans h-full"
              >
                <div>
                  {/* Icon Wrapper */}
                  <div className="p-4 rounded-full bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400 mb-6 w-fit group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-6 w-6 stroke-[2]" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-foreground mb-3 leading-snug group-hover:text-teal-700 transition-colors">
                    {industry.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6">
                    {industry.description}
                  </p>
                </div>

                {/* Key Use Cases */}
                <div className="pt-4 border-t border-border/20 space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
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
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default IndustrySolutions;
