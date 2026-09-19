import React from "react";
import {
  AlertTriangle,
  Droplets,
  Layers,
  Clock,
  ArrowRight,
  ShieldAlert,
  Flame,
  Activity,
  CheckCircle2,
} from "lucide-react";

interface ProblemItem {
  icon: string;
  title: string;
  description: string;
  severity: string;
  impact: string;
}

interface SolutionProblemSectionProps {
  data?: {
    eyebrow?: string;
    title?: string;
    highlightTitle?: string;
    description?: string;
    impactSummary?: string;
    items?: ProblemItem[];
  };
  onResolveClick?: () => void;
}

const problemIcons: Record<string, React.ElementType> = {
  AlertTriangle,
  Droplets,
  Layers,
  Clock,
  ShieldAlert,
  Flame,
  Activity,
};

export const SolutionProblemSection: React.FC<SolutionProblemSectionProps> = ({
  data,
  onResolveClick,
}) => {
  const eyebrow = data?.eyebrow || "THE PROBLEM WE SOLVE";
  const title = data?.title || "The Silent Cost of";
  const highlightTitle = data?.highlightTitle || "Unmonitored Water Infrastructure";
  const description =
    data?.description ||
    "Across residential societies, commercial campuses, and municipal networks, traditional water systems operate entirely unmonitored. By the time physical damage or bill shock is noticed, millions of litres of treated water have been irreversibly wasted.";
  const impactSummary =
    data?.impactSummary ||
    "Over 40% of pumped municipal and groundwater is lost to preventable distribution leaks and unmanaged tank overflows.";

  const rawItems = data?.items && data.items.length > 0
    ? data.items
    : [
        {
          icon: "AlertTriangle",
          title: "Unattended Overhead Tank Overflows",
          description:
            "Pumps running past capacity dump tens of thousands of litres across rooftops and storm drains daily, burning out motor coils and inflating society electricity bills.",
          severity: "Critical Waste",
          impact: "20,000–50,000L lost weekly per building",
        },
        {
          icon: "Droplets",
          title: "Silent Micro-Seepage & Wall Joint Leaks",
          description:
            "Internal plumbing cracks leak as little as 50ml/hr behind drywall and concrete risers, slowly destroying structural stability and creating severe mold hazards before surface dampness is visible.",
          severity: "Structural Threat",
          impact: "Undetected moisture erosion over months",
        },
      ];

  const items = rawItems.slice(0, 2);

  return (
    <section
      id="problem-section"
      className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-[#070f12] border-b border-[#e2eded] dark:border-teal-900/30 font-sans relative select-none"
    >
      <div className="container mx-auto px-6 md:px-12 max-w-7xl">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16 text-left reveal-on-scroll">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-teal-500" />
            <span className="text-teal-700 dark:text-teal-400 font-bold uppercase tracking-widest text-xs font-mono">
              {eyebrow}
            </span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white leading-[1.22] tracking-tight">
            <span>{title} </span>
            {highlightTitle && (
              <span className="text-teal-600 dark:text-teal-400">
                {highlightTitle}
              </span>
            )}
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mt-3 max-w-2xl">
            {description}
          </p>
        </div>

        {/* 2 Problem Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {items.map((item, idx) => {
            const Icon = problemIcons[item.icon] || AlertTriangle;
            const delayClass = idx === 1 ? "reveal-delay-100" : "";

            return (
              <div
                key={idx}
                className={`p-6 sm:p-7 rounded-2xl bg-[#f9fbfb] dark:bg-[#071d22] border border-teal-200/70 dark:border-teal-900/40 hover:border-teal-500/50 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group reveal-on-scroll ${delayClass}`}
              >
                <div>
                  {/* Top Bar: Icon & Category Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-teal-600/10 dark:bg-teal-500/15 border border-teal-500/20 text-teal-700 dark:text-teal-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 border border-teal-200/80 dark:border-teal-800/40">
                      {item.severity}
                    </span>
                  </div>

                  <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2.5 leading-snug group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Impact Indicator */}
                <div className="pt-4 mt-5 border-t border-[#e8f1f0] dark:border-teal-950/80 flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">
                    Calculated Loss:
                  </span>
                  <span className="font-semibold text-teal-800 dark:text-teal-300 font-mono">
                    {item.impact}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Transition to Solution Banner */}
        <div className="mt-10 sm:mt-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-teal-950 via-[#041e24] to-teal-950 border border-teal-500/30 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg reveal-on-scroll">
          <div className="flex items-start sm:items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300 shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-display text-base sm:text-lg font-bold text-white leading-snug">
                How Aqua Saver Eliminates These Failures
              </h4>
              <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed mt-0.5">
                {impactSummary} Aqua Saver unifies physical flow sensors and automated motor relays with real-time software alerts.
              </p>
            </div>
          </div>

          {onResolveClick && (
            <button
              onClick={onResolveClick}
              className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs uppercase tracking-wider whitespace-nowrap shadow-md hover:-translate-y-0.5 transition-all cursor-pointer flex items-center gap-2"
            >
              <span>See How It Works</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default SolutionProblemSection;
