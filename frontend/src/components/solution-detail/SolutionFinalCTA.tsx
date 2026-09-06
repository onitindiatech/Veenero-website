import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, CheckCircle2, Droplets, LayoutGrid } from "lucide-react";
import { SolutionDetailData } from "@/content/solutionDetailsData";

interface SolutionFinalCTAProps {
  data: SolutionDetailData["finalCta"];
  onDemoClick?: () => void;
  onExpertClick?: () => void;
}

export const SolutionFinalCTA: React.FC<SolutionFinalCTAProps> = ({
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

  return (
    <section className="relative w-full py-20 sm:py-24 lg:py-28 overflow-hidden bg-[#021316] text-white text-center select-none font-sans">
      {/* Background Animated Water Flow & Ripples */}
      <div className="absolute inset-0 pointer-events-none -z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-teal-500/[0.12] rounded-full blur-3xl" />
        <div className="absolute -bottom-10 right-1/4 w-72 h-72 bg-cyan-500/[0.08] rounded-full blur-2xl" />

        {/* Dynamic Water Ripple SVG Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-25">
          <svg className="w-[800px] h-[400px]" viewBox="0 0 800 400">
            <ellipse cx="400" cy="200" rx="360" ry="140" fill="none" stroke="#2dd4bf" strokeWidth="1" strokeDasharray="6 6" opacity="0.3" />
            <ellipse cx="400" cy="200" rx="280" ry="100" fill="none" stroke="#2dd4bf" strokeWidth="1.2" opacity="0.5" />
            <ellipse cx="400" cy="200" rx="190" ry="70" fill="none" stroke="#2dd4bf" strokeWidth="1.5" opacity="0.7" className="animate-pulse" />
            <ellipse cx="400" cy="200" rx="90" ry="35" fill="none" stroke="#38bdf8" strokeWidth="2" opacity="0.9" />
            <circle cx="400" cy="200" r="8" fill="#2dd4bf" className="animate-ping" />
            <circle cx="400" cy="200" r="4" fill="#ffffff" />
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 max-w-4xl relative z-10 space-y-6">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-950/80 border border-teal-400/40 text-teal-300 text-xs font-mono font-bold uppercase tracking-widest backdrop-blur-md shadow-xs reveal-on-scroll">
          <Droplets className="w-3.5 h-3.5 text-teal-400" />
          <span>{data.eyebrow}</span>
        </div>

        {/* Main H2 Heading */}
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight reveal-on-scroll reveal-delay-100">
          <span>{data.title} </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-teal-400 to-cyan-300">
            {data.highlightTitle}
          </span>
        </h2>

        {/* Supporting sentence */}
        <p className="text-sm sm:text-base text-slate-300/90 leading-relaxed max-w-xl mx-auto reveal-on-scroll reveal-delay-200">
          {data.description}
        </p>

        {/* Triple Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3 reveal-on-scroll reveal-delay-300">
          <button
            onClick={scrollToInquiry}
            className="w-full sm:w-auto px-7 py-3.5 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl font-bold shadow-[0_4px_20px_rgba(20,184,166,0.4)] hover:shadow-[0_4px_28px_rgba(20,184,166,0.6)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-sm flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>{data.primaryCtaText || "Request a Demo"}</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
          <button
            onClick={scrollToExpert}
            className="w-full sm:w-auto px-7 py-3.5 bg-slate-900/80 hover:bg-slate-800 text-white border border-teal-400/30 hover:border-teal-400/60 rounded-xl font-bold hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-sm flex items-center justify-center shadow-soft backdrop-blur-md cursor-pointer"
          >
            <span>{data.secondaryCtaText || "Talk to an Expert →"}</span>
          </button>
          <Link
            to="/solutions"
            className="w-full sm:w-auto px-6 py-3.5 bg-teal-950/80 hover:bg-teal-900 text-teal-300 hover:text-white border border-teal-500/30 hover:border-teal-400 rounded-xl font-bold hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-sm flex items-center justify-center gap-2 shadow-soft backdrop-blur-md cursor-pointer"
          >
            <LayoutGrid className="w-4 h-4 text-teal-400" />
            <span>View All Solutions</span>
          </Link>
        </div>

        {/* Trust Points */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-slate-400 font-medium reveal-on-scroll reveal-delay-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
            <span>No commitment</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>Secure &amp; Confidential</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionFinalCTA;
