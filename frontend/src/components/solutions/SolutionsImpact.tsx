import React from "react";
import { ArrowRight, Building2, Factory, Sprout, Landmark, Leaf, TrendingUp, ShieldCheck, Droplets, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { AnimatedCounter } from "./AnimatedCounter";

export const SolutionsImpact: React.FC = () => {
  useScrollReveal([]);

  return (
    <section
      id="solutions-impact"
      className="relative bg-[#021318] dark:bg-[#010c0f] text-white overflow-hidden select-none"
    >
      {/* 5. Flowing Organic Water Wave Transition Header */}
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

      <div className="container mx-auto px-6 md:px-12 max-w-7xl pt-4 sm:pt-6 pb-16 sm:pb-20 lg:pb-24 font-sans relative z-10">

        {/* Section Header: Left Title + Right Description & CTA matching mockup */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-end mb-10 sm:mb-12 reveal-on-scroll">
          
          {/* Left: Eyebrow + H2 Title */}
          <div className="lg:col-span-7 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-400/10 border border-teal-400/25 backdrop-blur-xs mb-3">
              <Leaf className="w-3 h-3 text-teal-300" />
              <span className="text-teal-300 font-bold uppercase tracking-widest text-[10px] sm:text-[11px] font-mono">
                REAL-WORLD IMPACT
              </span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.65rem] font-bold text-white leading-[1.24] sm:leading-[1.26] tracking-tight">
              Trusted by Utilities, Industries
              <br />
              and Communities
            </h2>
          </div>

          {/* Right: Description + Explore Case Studies CTA */}
          <div className="lg:col-span-5 flex flex-col justify-between items-start lg:items-end text-left lg:text-right space-y-4">
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md">
              Our solutions are deployed across diverse environments, delivering measurable impact where it matters most.
            </p>

            <Link
              to="/impact"
              className="px-6 py-2.5 rounded-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 inline-flex items-center gap-2 group"
            >
              <span>Explore Case Studies</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* 4 Sectors Horizontal Bar matching mockup */}
        <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-4 sm:p-5 mb-10 sm:mb-12 reveal-on-scroll">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-white/10 text-center">
            
            {/* Sector 1: Urban Utilities */}
            <div className="flex items-center justify-center gap-2.5 p-2 sm:p-3">
              <div className="w-8 h-8 rounded-lg bg-teal-500/15 border border-teal-400/30 flex items-center justify-center text-teal-300 shrink-0">
                <Building2 className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-slate-200">
                Urban Utilities
              </span>
            </div>

            {/* Sector 2: Industrial Operations */}
            <div className="flex items-center justify-center gap-2.5 p-2 sm:p-3 pt-4 md:pt-3">
              <div className="w-8 h-8 rounded-lg bg-teal-500/15 border border-teal-400/30 flex items-center justify-center text-teal-300 shrink-0">
                <Factory className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-slate-200">
                Industrial Operations
              </span>
            </div>

            {/* Sector 3: Rural Communities */}
            <div className="flex items-center justify-center gap-2.5 p-2 sm:p-3 pt-4 md:pt-3">
              <div className="w-8 h-8 rounded-lg bg-teal-500/15 border border-teal-400/30 flex items-center justify-center text-teal-300 shrink-0">
                <Sprout className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-slate-200">
                Rural Communities
              </span>
            </div>

            {/* Sector 4: Government & Public Sector */}
            <div className="flex items-center justify-center gap-2.5 p-2 sm:p-3 pt-4 md:pt-3">
              <div className="w-8 h-8 rounded-lg bg-teal-500/15 border border-teal-400/30 flex items-center justify-center text-teal-300 shrink-0">
                <Landmark className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-slate-200">
                Government & Public Sector
              </span>
            </div>

          </div>
        </div>

        {/* 4 Animated Impact Statistic Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          
          {/* Stat 1: 42% Water Loss Reduction */}
          <div className="p-6 rounded-2xl bg-[#041a22]/80 border border-teal-900/40 hover:border-teal-500/50 hover:bg-[#05222c] transition-all duration-300 shadow-md text-left group">
            <div className="w-9 h-9 rounded-xl bg-teal-500/15 border border-teal-400/30 flex items-center justify-center text-teal-300 mb-4 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-4.5 h-4.5" />
            </div>
            <div className="font-mono text-3xl sm:text-4xl font-extrabold text-teal-400 tracking-tight mb-1">
              <AnimatedCounter value={42} suffix="%" duration={1800} />
            </div>
            <h3 className="font-display text-base font-bold text-white mb-2">
              Water Loss Reduction
            </h3>
            <p className="text-xs text-slate-300/85 leading-relaxed">
              Municipal distribution network optimization, acoustic leak pin-pointing, and transient pressure suppression.
            </p>
          </div>

          {/* Stat 2: 99.8% Data Verification */}
          <div className="p-6 rounded-2xl bg-[#041a22]/80 border border-teal-900/40 hover:border-teal-500/50 hover:bg-[#05222c] transition-all duration-300 shadow-md text-left group">
            <div className="w-9 h-9 rounded-xl bg-teal-500/15 border border-teal-400/30 flex items-center justify-center text-teal-300 mb-4 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-4.5 h-4.5" />
            </div>
            <div className="font-mono text-3xl sm:text-4xl font-extrabold text-teal-400 tracking-tight mb-1">
              <AnimatedCounter value={99.8} decimals={1} suffix="%" duration={2000} />
            </div>
            <h3 className="font-display text-base font-bold text-white mb-2">
              Data Integrity Guarantee
            </h3>
            <p className="text-xs text-slate-300/85 leading-relaxed">
              Cryptographically verified sensor payloads ready for statutory reporting and ESG assurance audits.
            </p>
          </div>

          {/* Stat 3: 185M+ Litres Conserved */}
          <div className="p-6 rounded-2xl bg-[#041a22]/80 border border-teal-900/40 hover:border-teal-500/50 hover:bg-[#05222c] transition-all duration-300 shadow-md text-left group">
            <div className="w-9 h-9 rounded-xl bg-teal-500/15 border border-teal-400/30 flex items-center justify-center text-teal-300 mb-4 group-hover:scale-110 transition-transform">
              <Droplets className="w-4.5 h-4.5" />
            </div>
            <div className="font-mono text-3xl sm:text-4xl font-extrabold text-teal-400 tracking-tight mb-1">
              <AnimatedCounter value={185} suffix="M+" duration={2200} />
            </div>
            <h3 className="font-display text-base font-bold text-white mb-2">
              Litres Conserved Monthly
            </h3>
            <p className="text-xs text-slate-300/85 leading-relaxed">
              Continuous feeder balancing and automated valve throttling across rural and regional water schemes.
            </p>
          </div>

          {/* Stat 4: 24/7 Active Observability */}
          <div className="p-6 rounded-2xl bg-[#041a22]/80 border border-teal-900/40 hover:border-teal-500/50 hover:bg-[#05222c] transition-all duration-300 shadow-md text-left group">
            <div className="w-9 h-9 rounded-xl bg-teal-500/15 border border-teal-400/30 flex items-center justify-center text-teal-300 mb-4 group-hover:scale-110 transition-transform">
              <Activity className="w-4.5 h-4.5" />
            </div>
            <div className="font-mono text-3xl sm:text-4xl font-extrabold text-teal-400 tracking-tight mb-1">
              24/7
            </div>
            <h3 className="font-display text-base font-bold text-white mb-2">
              Active Telemetry Stream
            </h3>
            <p className="text-xs text-slate-300/85 leading-relaxed">
              Hardware-agnostic edge nodes continuously piping flow, level, and quality indicators to unified cloud dashboards.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};

export default SolutionsImpact;
