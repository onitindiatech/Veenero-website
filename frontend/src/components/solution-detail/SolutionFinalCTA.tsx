import React from "react";
import { ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
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
    <section className="relative w-full py-16 sm:py-20 lg:py-24 bg-[#021316] text-white text-center select-none font-sans overflow-hidden border-t border-teal-900/30">
      {/* Subtle ambient light */}
      <div className="absolute inset-0 pointer-events-none -z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-teal-500/[0.08] rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 md:px-12 max-w-4xl relative z-10 space-y-6">
        {/* Small label */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950/70 border border-teal-400/30 text-teal-300 text-xs font-mono font-bold uppercase tracking-widest backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
          <span>{data.eyebrow || "NEXT STEPS"}</span>
        </div>

        {/* Strong solution-specific headline */}
        <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight max-w-3xl mx-auto">
          <span>{data.title} </span>
          {data.highlightTitle && (
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-teal-400 to-cyan-300">
              {data.highlightTitle}
            </span>
          )}
        </h2>

        {/* Short supporting sentence */}
        <p className="text-sm sm:text-base text-slate-300/90 leading-relaxed max-w-xl mx-auto">
          {data.description}
        </p>

        {/* Primary & Secondary Dual CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <button
            onClick={scrollToInquiry}
            className="w-full sm:w-auto px-7 py-3.5 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl font-bold shadow-[0_4px_20px_rgba(20,184,166,0.35)] hover:shadow-[0_4px_24px_rgba(20,184,166,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-sm flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>{data.primaryCtaText || "Request a Demo"}</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
          <button
            onClick={scrollToExpert}
            className="w-full sm:w-auto px-7 py-3.5 bg-slate-900/80 hover:bg-slate-800 text-white border border-teal-400/30 hover:border-teal-400/60 rounded-xl font-bold hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-sm flex items-center justify-center shadow-xs backdrop-blur-md cursor-pointer"
          >
            <span>{data.secondaryCtaText || "Talk to an Expert"}</span>
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-3 text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
            <span>No Commitment</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>Secure &amp; Confidential</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionFinalCTA;
