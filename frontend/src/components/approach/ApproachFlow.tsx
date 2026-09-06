import React from "react";
import { ArrowRight, Search, Wrench, Rocket, Activity, Leaf } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

// Reuse existing real imagery from the assets folder
import stageUnderstandImg from "@/assets/about/about-journey-water-infrastructure.webp";
import stageDesignImg from "@/assets/about/about-field-verification.webp";
import stageDeployImg from "@/assets/about/about-real-time-analytics.webp";
import stageMonitorImg from "@/assets/about/about-industrial-water-system.webp";

interface ApproachFlowProps {
  data?: any;
}

// Real-World Execution stages: Understand → Design → Deploy → Monitor & Improve
const defaultExecutionStages = [
  {
    number: "01",
    icon: Search,
    title: "Understand the Context",
    description:
      "We study your water systems, challenges, and operational baselines.",
    image: stageUnderstandImg,
  },
  {
    number: "02",
    icon: Wrench,
    title: "Design the Right Solution",
    description:
      "Tailored hardware, sensor placements, and analytics architecture.",
    image: stageDesignImg,
  },
  {
    number: "03",
    icon: Rocket,
    title: "Deploy & Integrate",
    description:
      "Fast, non-disruptive edge deployment with existing SCADA systems.",
    image: stageDeployImg,
  },
  {
    number: "04",
    icon: Activity,
    title: "Monitor & Improve",
    description:
      "Continuous monitoring, closed-loop alerts, and verified impact.",
    image: stageMonitorImg,
  },
];

const flowIconMap: Record<string, any> = {
  Search,
  Wrench,
  Rocket,
  Activity,
  ArrowRight,
};

export const ApproachFlow: React.FC<ApproachFlowProps> = ({ data }) => {
  useScrollReveal([]);

  const eyebrow = data?.eyebrow || "REAL-WORLD EXECUTION";
  const title = data?.title || "From Strategy to";
  const highlightedText = data?.highlightedText || "On-Ground Impact";
  const description =
    data?.description ||
    "Our approach is proven in diverse operational environments — from municipal utilities to large-scale industrial plants.";

  const stages =
    data?.stages && data.stages.length > 0
      ? data.stages.map((s: any, i: number) => ({
          number: s.number || `0${i + 1}`,
          icon: flowIconMap[s.icon] || defaultExecutionStages[i % defaultExecutionStages.length]?.icon || Search,
          title: s.title,
          description: s.description,
          image: s.image || defaultExecutionStages[i % defaultExecutionStages.length]?.image || stageUnderstandImg,
        }))
      : defaultExecutionStages;

  return (
    <section
      id="approach-execution"
      className="relative py-14 sm:py-16 lg:py-20 bg-white dark:bg-[#071317] border-b border-slate-200/60 dark:border-teal-900/20 select-none overflow-hidden"
    >
      <div className="container mx-auto px-6 md:px-12 max-w-7xl space-y-10 sm:space-y-12">

        {/* Section Header */}
        <div className="text-left font-sans max-w-3xl reveal-on-scroll">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-600/10 dark:bg-teal-400/10 border border-teal-600/20 dark:border-teal-400/20 backdrop-blur-xs mb-1">
            <Leaf className="w-3 h-3 text-teal-700 dark:text-teal-300" />
            <span className="text-teal-800 dark:text-teal-300 font-bold uppercase tracking-widest text-[10px] sm:text-[11px] font-mono">
              {eyebrow}
            </span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.6rem] font-bold text-slate-900 dark:text-white mb-3 leading-[1.18] tracking-tight">
            {title}{" "}
            <span className="text-[#136873] dark:text-teal-400">{highlightedText}</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300/90 leading-relaxed max-w-2xl">
            {description}
          </p>
        </div>

        {/* 4 Stage Cards — Desktop connected horizontal arrows */}
        <div className="relative reveal-on-scroll reveal-delay-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {stages.map((stage: any, i: number) => {
              const Icon = stage.icon;
              const stagger = ["", "reveal-delay-100", "reveal-delay-200", "reveal-delay-300"][i];
              const isLast = i === stages.length - 1;
              return (
                <div key={stage.title} className={`relative reveal-on-scroll ${stagger}`}>
                  <div className="group bg-[#f8fafb] dark:bg-[#0c1f26] rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/80 dark:border-teal-900/35 hover:border-teal-500/40 shadow-xs hover:shadow-[0_16px_32px_-8px_rgba(19,104,115,0.12)] hover:-translate-y-1.5 transition-all duration-300 font-sans flex flex-col h-full">
                    {/* Top image area with floating stage number */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img
                        src={stage.image}
                        alt={stage.title}
                        className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700 ease-out"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/55 via-transparent to-transparent pointer-events-none" />
                      {/* Stage number */}
                      <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-teal-600/95 backdrop-blur-sm text-white text-[11px] font-bold font-mono flex items-center justify-center ring-2 ring-white/20 shadow-sm">
                        {stage.number.replace(/^0/, "")}
                      </div>
                      {/* Icon in bottom-left overlay */}
                      <div className="absolute bottom-3 left-3 w-9 h-9 rounded-xl bg-white/95 dark:bg-slate-950/80 backdrop-blur-sm border border-white/30 dark:border-teal-500/30 flex items-center justify-center shadow-sm">
                        <Icon className="w-4.5 h-4.5 text-teal-700 dark:text-teal-400" strokeWidth={1.8} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-display text-base font-bold text-slate-900 dark:text-white mb-1.5 group-hover:text-[#136873] dark:group-hover:text-teal-300 transition-colors leading-snug">
                        {stage.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {stage.description}
                      </p>
                    </div>
                  </div>

                  {/* Connecting arrows between cards (desktop only, non-last) */}
                  {!isLast && (
                    <>
                      <div className="hidden lg:flex absolute top-[30%] -right-3 z-20 items-center justify-center pointer-events-none">
                        <div className="w-6 h-6 rounded-full bg-white dark:bg-[#062429] border border-teal-500/30 shadow-md flex items-center justify-center">
                          <ArrowRight className="w-3 h-3 text-teal-600" />
                        </div>
                      </div>
                      <div className="hidden sm:flex lg:hidden absolute top-[28%] -right-2.5 z-20 items-center justify-center pointer-events-none">
                        <div className="w-5 h-5 rounded-full bg-white dark:bg-[#062429] border border-teal-500/30 shadow-sm flex items-center justify-center">
                          <ArrowRight className="w-2.5 h-2.5 text-teal-600" />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Mobile vertical arrow (non-last) */}
                  {!isLast && (
                    <div className="sm:hidden flex justify-center py-2.5">
                      <div className="w-6 h-6 rounded-full bg-white dark:bg-[#062429] border border-teal-500/30 shadow-sm flex items-center justify-center rotate-90">
                        <ArrowRight className="w-3 h-3 text-teal-600" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApproachFlow;
