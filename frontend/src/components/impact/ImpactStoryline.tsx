import React from "react";
import { ImpactContent } from "@/content/impact";
import { Radio, Sparkles, BarChart3, FileCheck2, CheckCircle2, ChevronRight } from "lucide-react";

interface ImpactStorylineProps {
  data: ImpactContent["storyline"];
}

const stepIcons: Record<string, React.ElementType> = {
  Radio,
  Sparkles,
  BarChart3,
  FileCheck2,
};

export const ImpactStoryline: React.FC<ImpactStorylineProps> = ({ data }) => {
  return (
    <section id="impact-storyline" className="py-12 md:py-16 bg-transparent relative border-b border-border/10">
      {/* Background Water Light Gradient */}
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

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

        {/* 4-Step Connected Journey Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {data.steps.map((step, idx) => {
            const Icon = stepIcons[step.icon] || Radio;
            return (
              <div
                key={idx}
                className="group bg-card p-6 md:p-8 rounded-2xl border border-border/40 hover:border-teal-600/30 shadow-sm hover:shadow-soft hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between font-sans h-full relative"
              >
                <div>
                  {/* Step Header */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-display text-2xl font-bold text-teal-600/40 dark:text-teal-400/30 group-hover:text-teal-600 transition-colors">
                      {step.number}
                    </span>
                    <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-5 w-5 stroke-[2]" />
                    </div>
                  </div>

                  {/* Stage Eyebrow */}
                  <p className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-1">
                    {step.stage}
                  </p>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-foreground mb-3 leading-snug group-hover:text-teal-700 transition-colors">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6">
                    {step.description}
                  </p>
                </div>

                {/* Outcome Badge */}
                <div className="pt-4 border-t border-border/20 bg-teal-50/50 dark:bg-teal-950/20 -mx-6 -mb-6 md:-mx-8 md:-mb-8 p-4 rounded-b-2xl flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
                  <p className="text-xs font-semibold text-teal-900 dark:text-teal-200 leading-tight">
                    {step.outcome}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default ImpactStoryline;
