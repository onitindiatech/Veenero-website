import React from "react";
import { ArrowRight, Leaf } from "lucide-react";
import { PublicAboutHero } from "@/services/about.service";
import aboutHeroBackground from "@/assets/about/about-hero-background.png";

interface AboutHeroProps {
  data?: PublicAboutHero;
  /** Resolved from the Media Library — used when data.image is absent */
  mediaUrl?: string;
  /** Alt text from the Media Library record */
  mediaAlt?: string;
}

export const AboutHero: React.FC<AboutHeroProps> = ({ data, mediaUrl, mediaAlt }) => {
  if (data?.visible === false) return null;

  const scrollToSection = (id: string) => {
    const cleanId = id.startsWith("#") ? id.slice(1) : id;
    const el = document.getElementById(cleanId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const eyebrow = data?.eyebrow ?? "ABOUT VEENERO — WATER";
  const title = data?.title ?? "Building India's";
  const highlightedText = data?.highlightedText ?? "Water Intelligence Network";
  const description =
    data?.description ||
    "We are the digital infrastructure layer for water management—creating Water Visibility, Water Accountability, and Water Verification through real-time telemetry and advanced analytics.";
  const primaryCtaText = data?.primaryCtaText || "Our Story";
  const primaryCtaLink = data?.primaryCtaLink || "#who-we-are";
  const secondaryCtaText = data?.secondaryCtaText || "Core Values";
  const secondaryCtaLink = data?.secondaryCtaLink || "#core-values";

  // Hero image resolution (canonical source of truth from Media Library / Cloudinary, defaulting to about-hero-background.png)
  const isLegacyIllustrated =
    (mediaUrl && (
      mediaUrl.includes("ssgtf8psg6zbqvxobmml") ||
      mediaUrl.includes("o0dchhap1wfjjdtptdcq")
    )) || (
      data?.image && (
        data.image.includes("ssgtf8psg6zbqvxobmml") ||
        data.image.includes("o0dchhap1wfjjdtptdcq")
      )
    );

  const heroImage =
    mediaUrl && !isLegacyIllustrated
      ? mediaUrl
      : data?.image && !isLegacyIllustrated
      ? data.image
      : aboutHeroBackground;

  const heroAlt =
    data?.imageAlt ||
    mediaAlt ||
    "Veenero Water Intelligence Infrastructure — real-world treatment facility and telemetry network";

  // Dynamic CMS Headline Renderer: Respects admin-entered title and highlightedText
  const renderHeadline = () => {
    if (highlightedText) {
      return (
        <>
          <span className="block">{title}</span>
          <span className="text-[#136873] dark:text-teal-400 font-bold block mt-1">
            {highlightedText}
          </span>
        </>
      );
    }

    return <span className="block">{title}</span>;
  };

  return (
    <section className="relative w-full overflow-hidden select-none bg-[#daf0f5] dark:bg-slate-950 min-h-[420px] lg:h-[52vh] lg:min-h-[460px] lg:max-h-[540px] flex items-center pt-20 pb-8 sm:pt-22 sm:pb-10 lg:pt-24 lg:pb-10 border-b border-teal-200/50 dark:border-teal-900/30">
      {/* Full-width Background Image & Cool Blue/Aqua Water Atmosphere */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src={heroImage}
          alt={heroAlt}
          className="w-full h-full object-cover object-[right_center] select-none pointer-events-none"
          loading="eager"
        />

        {/* Cool Water-Blue / Aqua Atmospheric Tonal Wash (eliminates chalky white, adds vibrant water depth) */}
        <div className="absolute inset-0 bg-gradient-to-tr from-teal-600/16 via-cyan-500/12 to-sky-500/18 mix-blend-multiply pointer-events-none" />

        {/* Subtle Ambient Water Tone Overlay */}
        <div className="absolute inset-0 bg-[#cceef5]/25 pointer-events-none" />

        {/* Left-Side High-Readability Ice-Blue Gradient (replaces washed-out white with cool aquatic blue for strong text contrast) */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#ccedf3]/94 via-[#d8f2f6]/80 via-48% to-transparent dark:from-[#021316]/95 dark:via-[#021316]/82 dark:via-48% dark:to-transparent pointer-events-none" />
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
          
          {/* Leaf Pill Eyebrow matching Solutions Hero */}
          {eyebrow && (
            <div className="reveal-on-scroll inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-600/10 dark:bg-teal-400/10 border border-teal-600/20 dark:border-teal-400/20 backdrop-blur-xs mb-3">
              <Leaf className="w-3 h-3 text-teal-700 dark:text-teal-300" />
              <span className="text-teal-800 dark:text-teal-300 font-bold uppercase tracking-widest text-[10px] sm:text-[11px] font-mono">
                {eyebrow}
              </span>
            </div>
          )}

          {/* H1 Headline — Clean, balanced line-height, Playfair Display */}
          <h1 className="reveal-on-scroll reveal-delay-100 font-display text-2xl sm:text-3xl lg:text-[2.65rem] font-bold text-slate-950 dark:text-white leading-[1.18] mb-3 tracking-tight">
            {renderHeadline()}
          </h1>

          {/* Supporting Description */}
          <p className="reveal-on-scroll reveal-delay-200 text-xs sm:text-sm text-slate-700 dark:text-slate-200/90 leading-relaxed max-w-xl mb-5 font-sans">
            {description}
          </p>

          {/* Action CTAs — Rounded Pill Buttons matching Solutions Hero */}
          <div className="reveal-on-scroll reveal-delay-300 flex flex-wrap items-center gap-3">
            <button
              onClick={() => scrollToSection(primaryCtaLink)}
              className="px-6 py-2.5 sm:py-3 rounded-full bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 group cursor-pointer"
            >
              <span>{primaryCtaText}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => scrollToSection(secondaryCtaLink)}
              className="px-6 py-2.5 sm:py-3 rounded-full border border-slate-700/80 dark:border-slate-300/70 hover:border-slate-950 dark:hover:border-white text-slate-800 dark:text-white bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 font-semibold text-xs sm:text-sm transition-all duration-200 cursor-pointer"
            >
              {secondaryCtaText}
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutHero;
