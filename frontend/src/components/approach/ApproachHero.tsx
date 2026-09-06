import React from "react";
import { ArrowRight, Leaf } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import defaultApproachHeroBg from "@/assets/approach/approach-hero-background.png";

interface ApproachHeroProps {
  data?: any;
}

export const ApproachHero: React.FC<ApproachHeroProps> = ({ data }) => {
  useScrollReveal([]);

  const scrollToSection = (id: string) => {
    const cleanId = id.replace(/^#/, "");
    const el = document.getElementById(cleanId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const bgImage = data?.image || defaultApproachHeroBg;
  const eyebrow = data?.eyebrow || "OUR APPROACH";
  const title = data?.title || "A Smarter Way to Manage Water";
  const highlightedText = data?.highlightedText || "Visibility. Intelligence. Accountability.";
  const description =
    data?.description ||
    "Veenero's approach unifies IoT telemetry, advanced data pipelines, and field expertise to turn water blindspots into real-time visibility, operational excellence, and verified outcomes.";
  const primaryCtaText = data?.primaryCtaText || "Explore Our Approach";
  const primaryCtaLink = data?.primaryCtaLink || "#approach-philosophy";
  const secondaryCtaText = data?.secondaryCtaText || "Explore Solutions";
  const secondaryCtaLink = data?.secondaryCtaLink || "/solutions";

  return (
    <section
      id="approach-hero"
      className="relative w-full overflow-hidden select-none bg-[#daf0f5] dark:bg-slate-950 min-h-[420px] lg:h-[52vh] lg:min-h-[460px] lg:max-h-[540px] flex items-center pt-20 pb-8 sm:pt-22 sm:pb-10 lg:pt-24 lg:pb-10 border-b border-teal-200/50 dark:border-teal-900/30"
    >
      {/* Full-width Cinematic Background Image & Cool Blue/Aqua Water Atmosphere */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src={bgImage}
          alt="Veenero water intelligence approach — watershed and smart telemetry network"
          className="w-full h-full object-cover object-[center_35%] select-none pointer-events-none"
          loading="eager"
        />

        {/* Soft, clean white-to-transparent left gradient matching Solutions/About heroes */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/92 via-white/72 via-42% to-transparent dark:from-[#021316]/95 dark:via-[#021316]/82 dark:via-48% dark:to-transparent pointer-events-none" />
        
        {/* Subtle atmospheric depth to preserve soft water vibrancy */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-white/20 dark:from-transparent dark:to-black/30 pointer-events-none" />
      </div>

      {/* Floating Water Light Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-1">
        <div className="absolute top-1/4 left-1/3 w-3 h-3 rounded-full bg-teal-400/20 blur-xs animate-pulse" />
        <div className="absolute top-1/2 left-1/4 w-2 h-2 rounded-full bg-cyan-300/30 blur-xs animate-ping" style={{ animationDuration: "3s" }} />
        <div className="absolute top-1/3 right-1/3 w-4 h-4 rounded-full bg-teal-300/15 blur-sm" />
      </div>

      {/* Hero Content Container */}
      <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10 font-sans">
        <div className="max-w-xl lg:max-w-2xl text-left">
          
          {/* Eyebrow Capsule with Leaf Icon matching Solutions & About Hero */}
          {eyebrow && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-600/10 dark:bg-teal-400/10 border border-teal-600/20 dark:border-teal-400/20 backdrop-blur-xs mb-3 reveal-on-scroll">
              <Leaf className="w-3 h-3 text-teal-700 dark:text-teal-300" />
              <span className="text-teal-800 dark:text-teal-300 font-bold uppercase tracking-widest text-[10px] sm:text-[11px] font-mono">
                {eyebrow}
              </span>
            </div>
          )}

          {/* H1 Headline — Clean, balanced line-height, Playfair Display */}
          <h1 className="font-display text-2xl sm:text-3xl lg:text-[2.65rem] font-bold text-slate-950 dark:text-white leading-[1.18] mb-3 tracking-tight reveal-on-scroll reveal-delay-100">
            <span className="block">{title}</span>
            <span className="text-[#136873] dark:text-teal-400 font-bold block mt-1">
              {highlightedText}
            </span>
          </h1>

          {/* Supporting Description */}
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200/90 leading-relaxed max-w-xl mb-5 font-sans reveal-on-scroll reveal-delay-200">
            {description}
          </p>

          {/* Action CTAs — Rounded Pill Buttons matching Solutions & About Hero */}
          <div className="flex flex-wrap items-center gap-3 reveal-on-scroll reveal-delay-300">
            <button
              onClick={() => scrollToSection(primaryCtaLink)}
              className="px-6 py-2.5 sm:py-3 rounded-full bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 group cursor-pointer"
            >
              <span>{primaryCtaText}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <Link
              to={secondaryCtaLink}
              className="px-6 py-2.5 sm:py-3 rounded-full border border-slate-700/80 dark:border-slate-300/70 hover:border-slate-950 dark:hover:border-white text-slate-800 dark:text-white bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 font-semibold text-xs sm:text-sm transition-all duration-200 cursor-pointer"
            >
              {secondaryCtaText}
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ApproachHero;
