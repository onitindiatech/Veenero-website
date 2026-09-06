import React from "react";
import * as LucideIcons from "lucide-react";
import { PublicAboutImpactStats, PublicAboutStatItem } from "@/services/about.service";
import { OneShotCounter } from "@/components/ui/OneShotCounter";

interface AboutImpactStatsProps {
  data?: PublicAboutImpactStats;
}

const defaultStats: PublicAboutStatItem[] = [
  {
    value: "Billions of Litres",
    label: "Monitored Every Day",
    sublabel: "Across municipal & enterprise networks",
    icon: "Droplets",
    order: 1,
  },
  {
    value: "10,000+",
    label: "Sensors Deployed",
    sublabel: "Active sub-second IoT edge nodes",
    icon: "Radio",
    order: 2,
  },
  {
    value: "1M+",
    label: "Data Points Processed",
    sublabel: "Streamed daily to anomaly models",
    icon: "Activity",
    order: 3,
  },
  {
    value: "100+",
    label: "Facilities & Cities",
    sublabel: "Nationwide water resilience",
    icon: "Building2",
    order: 4,
  },
];

export const AboutImpactStats: React.FC<AboutImpactStatsProps> = ({ data }) => {
  if (data?.visible === false) return null;

  const statList =
    data?.list && data.list.length > 0 ? data.list : defaultStats;

  return (
    <section
      id="impact-stats"
      className="relative bg-[#021318] dark:bg-[#010c0f] text-white overflow-hidden select-none"
    >
      {/* 1. Flowing Organic Water Wave Transition Header */}
      <div className="relative w-full overflow-hidden leading-none pointer-events-none select-none -mb-1">
        <svg
          className="w-full h-16 sm:h-24 lg:h-32 text-[#021318] dark:text-[#010c0f]"
          viewBox="0 0 1440 160"
          fill="none"
          preserveAspectRatio="none"
        >
          {/* Layer 1: Back Aqua Shimmer */}
          <path
            d="M0,80 C240,160 480,20 720,80 C960,140 1200,40 1440,90 L1440,160 L0,160 Z"
            fill="#0ea5e9"
            fillOpacity="0.25"
          />
          {/* Layer 2: Mid Aqua Flow */}
          <path
            d="M0,50 C320,130 560,0 840,65 C1120,130 1320,30 1440,60 L1440,160 L0,160 Z"
            fill="#14b8a6"
            fillOpacity="0.4"
          />
          {/* Layer 3: Solid Crest transitioning into dark section */}
          <path
            d="M0,40 C360,110 680,10 1020,70 C1240,105 1380,45 1440,55 L1440,160 L0,160 Z"
            fill="currentColor"
          />
        </svg>

        {/* Dynamic Water Caustic Glow */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-teal-400/20 via-cyan-400/50 to-teal-400/20 blur-xs" />
      </div>

      <div className="container mx-auto px-6 md:px-12 max-w-7xl pt-4 sm:pt-6 pb-16 sm:pb-20 lg:pb-24 font-sans relative z-10 space-y-12">
        
        {/* Centered Header with Leaf Eyebrow & Semantic H2 */}
        <div className="text-center font-sans max-w-2xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-400/10 border border-teal-400/25 backdrop-blur-xs mb-3">
            <LucideIcons.Leaf className="w-3 h-3 text-teal-300" />
            <span className="text-teal-300 font-bold uppercase tracking-widest text-[10px] sm:text-[11px] font-mono">
              {data?.eyebrow ?? "MEASURABLE IMPACT"}
            </span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.6rem] font-bold text-white mb-3 leading-[1.18] tracking-tight">
            {data?.title ?? "Impact Backed by Verified Data"}
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl">
            {data?.description ?? "Real-time telemetry, continuous validation, and tamper-resistant auditing at scale."}
          </p>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statList.map((stat, idx) => {
            const Icon = (LucideIcons as any)[stat.icon] || LucideIcons.Droplets;
            return (
              <div
                key={stat.id || stat._id || idx}
                className="group bg-[#041a22]/80 border border-teal-900/40 hover:border-teal-500/50 hover:bg-[#05222c] rounded-2xl p-7 sm:p-8 shadow-md hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between relative overflow-hidden font-sans h-full"
              >
                <div>
                  {/* Circular Icon Container */}
                  <div className="w-11 h-11 rounded-xl bg-teal-500/15 border border-teal-400/30 flex items-center justify-center text-teal-300 group-hover:scale-105 group-hover:bg-teal-500/25 transition-all duration-300 mb-5 shadow-2xs shrink-0">
                    <Icon className="w-5 h-5 stroke-[1.9]" />
                  </div>

                  {/* Value */}
                  <h3 className="font-display text-3xl sm:text-4xl lg:text-[2.5rem] font-extrabold text-teal-400 tracking-tight mb-2 group-hover:text-teal-300 transition-colors leading-tight font-mono">
                    <OneShotCounter value={stat.value} />
                  </h3>

                  {/* Label */}
                  <h4 className="font-display text-base sm:text-lg font-bold text-white leading-snug mb-1">
                    {stat.label}
                  </h4>

                  {/* Sublabel */}
                  {stat.sublabel && (
                    <p className="text-xs text-slate-300/85 leading-relaxed mt-1">
                      {stat.sublabel}
                    </p>
                  )}
                </div>

                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-teal-500/40 to-transparent mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            );
          })}
        </div>

      </div>

      {/* 2. Bottom Organic Wave Transition into light section */}
      <div className="relative w-full overflow-hidden leading-none pointer-events-none select-none -mt-1">
        <svg
          className="w-full h-10 sm:h-14 lg:h-18 text-[#f8fafb] dark:text-[#071317]"
          viewBox="0 0 1440 80"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C320,60 640,10 960,50 C1200,80 1360,20 1440,40 L1440,80 L0,80 Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </section>
  );
};

export default AboutImpactStats;
