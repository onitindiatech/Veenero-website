import React from "react";
import { CheckCircle2, Leaf } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import {
  StepSenseIllustration,
  StepIntelligenceIllustration,
  StepOptimizeIllustration,
  StepInnovateIllustration,
} from "./approachIllustrations";

interface ApproachProcessTimelineProps {
  data?: any;
}

interface ProcessStage {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  points: string[];
  Illustration: React.FC;
}

const FOUR_STAGE_JOURNEY: ProcessStage[] = [
  {
    id: "sense",
    number: "01",
    title: "Sense",
    subtitle: "Measure Every Litre",
    description:
      "Onboard your water data sources to build Water Visibility—so usage is measurable across sites, assets, and operations.",
    points: [
      "Data capture mapping",
      "Baseline measurement",
      "Integrity & validation checks",
    ],
    Illustration: StepSenseIllustration,
  },
  {
    id: "intelligence",
    number: "02",
    title: "Intelligence",
    subtitle: "Monitor & Benchmark",
    description:
      "Use real-time analytics to track performance, compare across peers, and surface Water Risk early.",
    points: [
      "Real-time monitoring",
      "Benchmarking & comparison",
      "Risk identification",
    ],
    Illustration: StepIntelligenceIllustration,
  },
  {
    id: "optimize",
    number: "03",
    title: "Optimize",
    subtitle: "Act with Evidence",
    description:
      "Transform insights into prioritized interventions—improving efficiency through quantified recommendations.",
    points: [
      "Optimization scenarios",
      "Efficiency tracking",
      "Actionable workflows",
    ],
    Illustration: StepOptimizeIllustration,
  },
  {
    id: "innovate",
    number: "04",
    title: "Innovate",
    subtitle: "Long-term Sustainability",
    description:
      "Continuously evolve strategies and technologies to build a resilient, audit-ready, and water-positive future.",
    points: [
      "Sustainable strategies",
      "Verification trails",
      "Continuous improvement",
    ],
    Illustration: StepInnovateIllustration,
  },
];

export const ApproachProcessTimeline: React.FC<ApproachProcessTimelineProps> = ({ data }) => {
  useScrollReveal([]);

  // Check if CMS data is carrying the old legacy 5-pillar text
  const isLegacyFivePillars =
    data?.title?.toLowerCase().includes("pillar") ||
    data?.eyebrow?.toLowerCase().includes("pillar") ||
    data?.highlightedText?.toLowerCase().includes("mission");

  const eyebrow = !isLegacyFivePillars && data?.eyebrow ? data.eyebrow : "OUR 4-STAGE PROCESS";
  const title = !isLegacyFivePillars && data?.title ? data.title : "A Proven Path to";
  const highlightedText = !isLegacyFivePillars && data?.highlightedText ? data.highlightedText : "Water Sustainability";
  const description = !isLegacyFivePillars && data?.description
    ? data.description
    : "Our methodical four-step process transforms raw water telemetry into actionable intelligence, driving verified outcomes and long-term sustainability.";

  const stages: ProcessStage[] = FOUR_STAGE_JOURNEY.map((defaultStage, idx) => {
    // Only use CMS stage if it's explicitly structured for stages and not legacy 5-pillars
    if (!isLegacyFivePillars && data?.stages?.[idx]) {
      const cmsItem = data.stages[idx];
      return {
        ...defaultStage,
        title: cmsItem.title || defaultStage.title,
        subtitle: cmsItem.subtitle || defaultStage.subtitle,
        description: cmsItem.description || defaultStage.description,
        points: Array.isArray(cmsItem.points) && cmsItem.points.length > 0 ? cmsItem.points : defaultStage.points,
      };
    }
    return defaultStage;
  });

  return (
    <section
      id="approach-process"
      className="relative py-16 sm:py-20 lg:py-24 bg-[#f8fcfe] dark:bg-[#030f14] border-b border-slate-200/70 dark:border-teal-900/25 select-none overflow-hidden font-sans"
    >
      {/* Ambient background caustics */}
      <div className="absolute inset-0 pointer-events-none -z-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-teal-500/[0.04] dark:bg-teal-400/[0.02] rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-cyan-500/[0.04] dark:bg-cyan-400/[0.02] rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10">
        
        {/* Section Header — Perfectly Centered & Aligned */}
        <div className="max-w-3xl mx-auto text-center mb-14 lg:mb-18 reveal-on-scroll">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-teal-600/10 dark:bg-teal-400/10 border border-teal-600/20 dark:border-teal-400/20 backdrop-blur-xs mb-3.5">
            <Leaf className="w-3.5 h-3.5 text-teal-700 dark:text-teal-300" />
            <span className="text-teal-800 dark:text-teal-300 font-bold uppercase tracking-widest text-[10px] sm:text-[11px] font-mono">
              {eyebrow}
            </span>
          </div>

          {/* Heading */}
          <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.65rem] font-bold text-slate-900 dark:text-white leading-[1.18] mb-4 tracking-tight">
            {title}{" "}
            <span className="text-[#136873] dark:text-teal-400">
              {highlightedText}
            </span>
          </h2>

          {/* Subtitle Description */}
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300/90 leading-relaxed max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {/* 4-Stage Connected Process Timeline */}
        <div className="relative max-w-7xl mx-auto">
          
          {/* Subtle Horizontal Connecting Flow Line (Desktop Only) */}
          <div
            className="hidden lg:block absolute top-[28px] left-[12%] right-[12%] h-[1.5px] bg-gradient-to-r from-teal-500/20 via-teal-500/40 to-teal-500/20 -z-0 pointer-events-none"
            aria-hidden="true"
          />

          {/* 4-Column Grid Aligned Across Desktop, Tablet & Mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8 relative z-10">
            {stages.map((stage, idx) => {
              const staggerDelay =
                idx === 0
                  ? "reveal-delay-100"
                  : idx === 1
                  ? "reveal-delay-200"
                  : idx === 2
                  ? "reveal-delay-300"
                  : "reveal-delay-400";

              const StageIllustration = stage.Illustration;

              return (
                <div
                  key={stage.id}
                  className={`group relative flex flex-col reveal-on-scroll ${staggerDelay}`}
                >
                  {/* Step Indicator Node (Desktop) */}
                  <div className="hidden lg:flex items-center justify-center mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-teal-800/40 group-hover:border-teal-500/60 group-hover:shadow-md flex items-center justify-center transition-all duration-300 shadow-xs relative">
                      <span className="font-mono text-sm font-bold text-teal-700 dark:text-teal-300">
                        {stage.number}
                      </span>
                      {/* Step Indicator Dot on Line */}
                      <div className="w-2.5 h-2.5 rounded-full bg-teal-500/30 group-hover:bg-teal-500 transition-colors absolute -bottom-1 ring-2 ring-white dark:ring-slate-900" />
                    </div>
                  </div>

                  {/* Stage Card */}
                  <div className="flex-1 bg-white dark:bg-[#071920] border border-slate-200/80 dark:border-teal-900/30 rounded-2xl p-6 xl:p-7 shadow-xs hover:border-teal-500/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between font-sans">
                    <div>
                      {/* Card Top: Stage Badge + Ghost Number */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-teal-500/10 text-teal-700 dark:text-teal-300 text-[11px] font-mono font-bold border border-teal-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                          STAGE {stage.number}
                        </span>
                        <span className="text-2xl font-display font-bold text-slate-300 dark:text-slate-700/50 select-none">
                          {stage.number}
                        </span>
                      </div>

                      {/* Stage Vector Illustration */}
                      <div className="flex justify-center mb-5 group-hover:scale-105 transition-transform duration-300">
                        <StageIllustration />
                      </div>

                      {/* Stage Title & Subtitle */}
                      <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
                        {stage.title}
                      </h3>
                      <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-3 font-mono">
                        {stage.subtitle}
                      </p>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300/85 leading-relaxed mb-5">
                        {stage.description}
                      </p>
                    </div>

                    {/* Checklist Points */}
                    <div className="border-t border-slate-100 dark:border-teal-900/30 pt-4 mt-auto">
                      <ul className="text-xs text-slate-600 dark:text-slate-300/80 space-y-2">
                        {stage.points.map((point, pIdx) => (
                          <li key={pIdx} className="flex items-start gap-2 text-left">
                            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                            <span className="leading-snug">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Subtle bottom detail accent line */}
                    <div className="w-8 h-0.5 bg-transparent group-hover:bg-teal-500/60 rounded-full mt-4 transition-all duration-300" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

export default ApproachProcessTimeline;
