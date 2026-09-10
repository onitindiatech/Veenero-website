import React from "react";
import { CheckCircle2 } from "lucide-react";
import { SolutionDetailData } from "@/content/solutionDetailsData";

interface SolutionOverviewProps {
  data: SolutionDetailData;
}

export const SolutionOverview: React.FC<SolutionOverviewProps> = ({ data }) => {
  // Extract up to 3 subtle inline benefits from overview data
  const inlineBenefits =
    data.overview.blocks && data.overview.blocks.length > 0
      ? data.overview.blocks.slice(0, 3).map((b) => b.title)
      : data.heroPills && data.heroPills.length > 0
      ? data.heroPills.slice(0, 3)
      : [];

  return (
    <section
      id="overview-section"
      className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-[#070f12] border-b border-[#e2eded] dark:border-teal-900/30 select-none relative overflow-hidden font-sans"
    >
      {/* Subtle ambient gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-teal-500/[0.025] rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 max-w-4xl relative z-10 text-center">
        {/* Category / Section Label */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800/40 text-teal-700 dark:text-teal-300 text-xs font-mono font-bold uppercase tracking-widest mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
          <span>OVERVIEW</span>
        </div>

        {/* Section Heading */}
        <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white leading-[1.25] tracking-tight mb-6">
          <span>{data.overview.title} </span>
          {data.overview.highlightTitle && (
            <span className="text-teal-600 dark:text-teal-400">
              {data.overview.highlightTitle}
            </span>
          )}
        </h2>

        {/* Concise 2-3 sentence overview paragraph */}
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
          {data.overview.description}
        </p>

        {/* Subtle, compact inline benefits */}
        {inlineBenefits.length > 0 && (
          <div className="mt-8 pt-8 border-t border-slate-100 dark:border-teal-950/60 flex flex-wrap items-center justify-center gap-y-2 gap-x-3 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
            {inlineBenefits.map((benefit, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && (
                  <span className="text-teal-500/60 select-none">·</span>
                )}
                <span className="inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span>{benefit}</span>
                </span>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SolutionOverview;
