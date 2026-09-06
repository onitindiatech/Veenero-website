import React from "react";
import { Eye, TrendingDown, TrendingUp, ShieldCheck, Leaf } from "lucide-react";
import { ImpactContent } from "@/content/impact";
import { DigitCounter } from "@/components/solution-detail/DigitCounter";

interface ImpactMetricsProps {
  data: ImpactContent["outcomes"];
}

const metricConfigs = [
  {
    icon: Eye,
    target: 100,
    suffix: "%",
    displayRange: "100%",
    progress: 100,
  },
  {
    icon: TrendingDown,
    target: 40,
    suffix: "%",
    displayRange: "40%",
    progress: 80,
  },
  {
    icon: TrendingUp,
    target: 25,
    suffix: "%+",
    displayRange: "25%+",
    progress: 75,
  },
  {
    icon: ShieldCheck,
    target: 99.8,
    decimals: 1,
    suffix: "%",
    displayRange: "Audit-Ready",
    progress: 99,
  },
];

export const ImpactMetrics: React.FC<ImpactMetricsProps> = ({ data }) => {
  return (
    <section
      id="impact-metrics"
      className="relative bg-[#021318] text-white select-none overflow-hidden font-sans"
    >
      {/* Wave Transition from previous section */}
      <div className="relative w-full overflow-hidden leading-none pointer-events-none select-none -mb-1">
        <svg className="w-full h-16 sm:h-24 lg:h-32 text-[#021318]" viewBox="0 0 1440 160" fill="none" preserveAspectRatio="none">
          <path d="M0,80 C240,160 480,20 720,80 C960,140 1200,40 1440,90 L1440,160 L0,160 Z" fill="#0ea5e9" fillOpacity="0.25" />
          <path d="M0,50 C320,130 560,0 840,65 C1120,130 1320,30 1440,60 L1440,160 L0,160 Z" fill="#14b8a6" fillOpacity="0.4" />
          <path d="M0,40 C360,110 680,10 1020,70 C1240,105 1380,45 1440,55 L1440,160 L0,160 Z" fill="currentColor" />
        </svg>
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-teal-400/20 via-cyan-400/50 to-teal-400/20 blur-xs" />
      </div>

      {/* Background Ambient Caustics */}
      <div className="absolute inset-0 pointer-events-none -z-0 overflow-hidden">
        <div className="absolute top-1/3 -left-20 w-96 h-96 bg-teal-500/[0.07] rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -right-20 w-96 h-96 bg-cyan-500/[0.06] rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 md:px-12 max-w-7xl pt-4 sm:pt-6 pb-16 sm:pb-20 lg:pb-24 relative z-10 space-y-12 sm:space-y-14">
        
        {/* Section Header */}
        <div className="text-left font-sans max-w-3xl">
          {/* Eyebrow Capsule */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-400/10 border border-teal-400/25 backdrop-blur-xs mb-3.5">
            <Leaf className="w-3 h-3 text-teal-300" />
            <span className="text-teal-300 font-bold uppercase tracking-widest text-[10px] sm:text-[11px] font-mono">
              {data.eyebrow || "QUANTIFIABLE METRICS"}
            </span>
          </div>

          {/* H2 Title */}
          <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.65rem] font-bold text-white leading-[1.18] mb-4 tracking-tight">
            Quantified Performance Across{" "}
            <span className="text-teal-400">
              4 Core Areas
            </span>
          </h2>
          
          {data.description && (
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              {data.description}
            </p>
          )}
        </div>

        {/* 4 Impact Metric Cards Grid with Equal Heights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(data?.pillars || []).map((pillar, idx) => {
            const cfg = metricConfigs[idx] || metricConfigs[0];
            const Icon = cfg.icon;
            const staggerDelay = idx === 0 ? "reveal-delay-100" : idx === 1 ? "reveal-delay-200" : idx === 2 ? "reveal-delay-300" : "reveal-delay-400";

            return (
              <div
                key={idx}
                className={`group bg-white/5 backdrop-blur-xs p-6 sm:p-7 rounded-2xl border border-teal-900/40 hover:border-teal-500/50 hover:bg-white/8 shadow-xs hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between font-sans h-full relative overflow-hidden reveal-on-scroll ${staggerDelay}`}
              >
                {/* Top Corner Icon & Tag */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-teal-400/15 text-teal-300 flex items-center justify-center border border-teal-400/30 shadow-2xs group-hover:scale-105 hover-ripple-subtle transition-all duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-teal-400/10 text-teal-300 text-[10px] font-bold font-mono border border-teal-400/25">
                      {pillar.tag}
                    </span>
                  </div>

                  {/* Stat Value with One-Shot Digit Counter */}
                  <div className="mb-2">
                    <h3 className="font-display text-3xl sm:text-4xl lg:text-[2.6rem] font-bold text-white tracking-tight flex items-baseline gap-1">
                      <DigitCounter
                        target={cfg.target}
                        decimals={cfg.decimals || 0}
                        suffix={cfg.suffix}
                      />
                    </h3>
                  </div>

                  {/* Metric Label */}
                  <h4 className="font-display text-base font-bold text-white mb-2 group-hover:text-teal-300 transition-colors">
                    {pillar.label}
                  </h4>

                  {/* Description */}
                  <p className="text-xs sm:text-[13px] text-slate-300/85 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                {/* Bottom Progress Bar */}
                <div className="mt-5 pt-4 border-t border-teal-900/40">
                  <div className="w-full bg-teal-950/60 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-400 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${cfg.progress}%` }}
                    />
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

export default ImpactMetrics;
