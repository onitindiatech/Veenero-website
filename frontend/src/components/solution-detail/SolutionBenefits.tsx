import React from "react";
import { TrendingUp, ShieldCheck, Zap, Droplets, CheckCircle2 } from "lucide-react";
import { BenefitMetric } from "@/content/solutionDetailsData";
import { DigitCounter } from "./DigitCounter";

interface SolutionBenefitsProps {
  data: {
    eyebrow: string;
    title: string;
    description: string;
    metrics: BenefitMetric[];
  };
}

export const SolutionBenefits: React.FC<SolutionBenefitsProps> = ({ data }) => {
  return (
    <section
      id="benefits-section"
      className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-[#070f12] border-b border-[#e2eded] dark:border-teal-900/30 select-none font-sans relative"
    >
      <div className="container mx-auto px-6 md:px-12 max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-18 reveal-on-scroll">
          <span className="text-teal-700 dark:text-teal-400 font-bold uppercase tracking-widest text-xs font-mono block mb-2">
            {data.eyebrow}
          </span>
          <div className="w-12 h-0.5 bg-teal-600 mx-auto rounded-full mb-3.5" />
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
            {data.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed mt-3">
            {data.description}
          </p>
        </div>

        {/* 4 to 6 Concise Benefit Blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.metrics.map((metric, idx) => {
            const stagger =
              idx === 0
                ? ""
                : idx === 1
                ? "reveal-delay-100"
                : idx === 2
                ? "reveal-delay-200"
                : "reveal-delay-300";

            return (
              <div
                key={idx}
                className={`p-6 sm:p-7 rounded-2xl bg-[#fafcfc] dark:bg-[#0b1f24] border border-[#dce9e6] dark:border-teal-900/40 hover:border-teal-500/50 shadow-xs hover:shadow-soft hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between text-left reveal-on-scroll ${stagger}`}
              >
                <div>
                  {/* Top Metric Value with Digit Loading */}
                  <div className="flex items-baseline gap-1 text-3xl sm:text-4xl font-extrabold text-teal-600 dark:text-teal-400 font-sans tracking-tight mb-3">
                    <DigitCounter
                      target={metric.target}
                      decimals={metric.decimals || 0}
                      suffix={metric.suffix}
                      prefix={metric.prefix || ""}
                      displayValueOverride={metric.displayRange}
                    />
                  </div>

                  <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                    {metric.label}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {metric.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#ebf0f0] dark:border-teal-900/30 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Verified Outcome</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SolutionBenefits;
