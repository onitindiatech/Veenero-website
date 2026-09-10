import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowLeft,
  Mail,
  ShieldCheck,
  BarChart3,
  FileText,
  Droplets,
} from "lucide-react";
import { SolutionDetailData } from "@/content/solutionDetailsData";

interface SolutionHeroProps {
  data: SolutionDetailData;
  onDemoClick?: () => void;
  onExpertClick?: () => void;
}

export const SolutionHero: React.FC<SolutionHeroProps> = ({
  data,
  onDemoClick,
  onExpertClick,
}) => {
  const scrollToInquiry = () => {
    if (onDemoClick) {
      onDemoClick();
      return;
    }
    const el = document.getElementById("inquiry-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToExpert = () => {
    if (onExpertClick) {
      onExpertClick();
      return;
    }
    const el = document.getElementById("inquiry-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Determine line 1 and line 2 for the display headline
  const headlineLine1 = data.tagline?.line1 || data.title;
  const headlineLine2 =
    data.tagline?.line2 || data.tagline?.line3 || "Absolute Balance.";

  return (
    <section className="relative w-full overflow-hidden bg-[#031518] text-white pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pt-32 lg:pb-24 select-none font-sans">
      {/* ── Ambient Background & Concentric Rings ─────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none -z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_75%_60%_at_50%_-10%,rgba(20,184,166,0.12),transparent_70%)]" />
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-teal-500/[0.08] rounded-full blur-3xl" />
        <div className="absolute -bottom-24 left-0 w-[400px] h-[400px] bg-cyan-500/[0.06] rounded-full blur-3xl" />

        {/* Concentric circular lines behind image area matching reference */}
        <svg
          className="absolute right-0 top-1/2 -translate-y-1/2 w-[700px] lg:w-[900px] h-[700px] lg:h-[900px] opacity-[0.12] translate-x-1/4"
          viewBox="0 0 900 900"
          fill="none"
        >
          <circle
            cx="450"
            cy="450"
            r="320"
            stroke="#5eead4"
            strokeWidth="1"
          />
          <circle
            cx="450"
            cy="450"
            r="440"
            stroke="#5eead4"
            strokeWidth="1"
          />
        </svg>
      </div>

      <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10">
        {/* ── Breadcrumb Navigation matching reference ──────────────────────── */}
        <div className="flex items-center gap-2.5 text-xs font-mono mb-8">
          <Link
            to="/solutions"
            className="flex items-center gap-1.5 text-slate-300 hover:text-teal-300 transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-teal-400 group-hover:-translate-x-0.5 transition-transform" />
            <span>Solutions</span>
          </Link>
          <span className="text-slate-500">&gt;</span>
          <span className="text-[#5eead4] font-semibold">{data.title}</span>
        </div>

        {/* ── Main Hero Two-Column Grid ────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Typography, CTAs, Highlights */}
          <div className="lg:col-span-6 xl:col-span-6 space-y-6 text-left">
            {/* Category / Label with Underline matching reference */}
            <div>
              <span className="text-xs font-mono font-bold tracking-wider text-[#5eead4] uppercase block">
                {data.badge || data.title.toUpperCase()}
              </span>
              <div className="w-16 h-0.5 bg-teal-400 mt-2 mb-6 rounded-full" />
            </div>

            {/* Display Headline — Balanced line height preventing any letter collisions */}
            <h1 className="font-display text-3xl sm:text-4xl lg:text-[3.25rem] font-bold leading-[1.22] sm:leading-[1.24] lg:leading-[1.26] tracking-tight">
              <span className="text-white block">{headlineLine1}</span>
              <span className="text-[#5eead4] block mt-2 sm:mt-2.5">
                {headlineLine2}
              </span>
            </h1>

            {/* Short Concise Description */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              {data.heroDescription}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <button
                onClick={scrollToInquiry}
                className="px-7 py-3.5 bg-[#5eead4] hover:bg-[#48d5b5] text-slate-950 font-bold rounded-xl shadow-[0_4px_20px_rgba(94,234,212,0.25)] hover:shadow-[0_4px_24px_rgba(94,234,212,0.4)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-sm flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Request a Demo</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
              <button
                onClick={scrollToExpert}
                className="px-7 py-3.5 bg-[#071f24]/80 hover:bg-[#0c2a32] text-white border border-teal-500/30 hover:border-teal-400/60 rounded-xl font-bold hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-sm flex items-center justify-center shadow-xs backdrop-blur-md cursor-pointer"
              >
                <span>Talk to an Expert</span>
              </button>
            </div>

            {/* Direct Email Contact Link */}
            <div className="flex items-center gap-2 text-xs text-slate-300 pt-1">
              <Mail className="w-3.5 h-3.5 text-[#5eead4]" />
              <span>Prefer email? Reach us at</span>
              <a
                href="mailto:solutions@veenerosolutions.com"
                className="text-[#5eead4] underline decoration-[#5eead4]/60 hover:decoration-[#5eead4] transition-colors font-medium"
              >
                solutions@veenerosolutions.com
              </a>
            </div>

            {/* 3 Highlights / Trust Badges matching reference */}
            <div className="pt-6 border-t border-teal-900/30">
              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                {/* 1. Verified Measurement */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#072429] border border-teal-500/30 flex items-center justify-center text-[#5eead4] shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-semibold text-slate-200 leading-tight">
                    <span>Verified</span>
                    <br />
                    <span>Measurement</span>
                  </div>
                </div>

                {/* Separator */}
                <div className="hidden sm:block h-7 w-px bg-teal-500/20" />

                {/* 2. Real-Time Reconciliation */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#072429] border border-teal-500/30 flex items-center justify-center text-[#5eead4] shrink-0">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-semibold text-slate-200 leading-tight">
                    <span>Real-Time</span>
                    <br />
                    <span>Reconciliation</span>
                  </div>
                </div>

                {/* Separator */}
                <div className="hidden sm:block h-7 w-px bg-teal-500/20" />

                {/* 3. Audit-Ready Data */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#072429] border border-teal-500/30 flex items-center justify-center text-[#5eead4] shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-semibold text-slate-200 leading-tight">
                    <span>Audit-Ready</span>
                    <br />
                    <span>Data</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Area matching reference image */}
          <div className="lg:col-span-6 xl:col-span-6">
            <div className="relative w-full rounded-[26px] overflow-hidden border border-teal-500/25 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-slate-950">
              <div className="aspect-[4/3] w-full overflow-hidden relative">
                <img
                  src={data.heroImage}
                  alt={`${data.title} Infrastructure`}
                  className="w-full h-full object-cover"
                  loading="eager"
                />

                {/* Subtle dark vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#021316]/70 via-transparent to-transparent pointer-events-none" />

                {/* Top-Right Overlaid Water Mission Text matching reference */}
                <div className="absolute top-5 right-6 text-right pointer-events-none select-none">
                  <p className="text-[10px] sm:text-[11px] font-mono tracking-widest text-white/80 uppercase leading-[1.35]">
                    Smarter
                    <br />
                    Water Systems
                    <br />
                    For A More
                    <br />
                    Sustainable
                    <br />
                    Tomorrow
                  </p>
                </div>

                {/* Bottom-Right Overlaid Frosted Card matching reference */}
                <div className="absolute bottom-5 right-5 pointer-events-none select-none">
                  <div className="px-4 py-3 rounded-2xl bg-[#06181b]/80 border border-teal-500/30 backdrop-blur-md flex items-center gap-3 shadow-xl">
                    <div className="w-9 h-9 rounded-full bg-teal-900/60 border border-teal-400/40 flex items-center justify-center text-[#5eead4] shrink-0">
                      <Droplets className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">
                        From Data to Decisions
                      </h4>
                      <p className="text-[10px] sm:text-[11px] text-slate-300/80 leading-tight mt-0.5">
                        Reliable. Transparent. Impactful.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionHero;
