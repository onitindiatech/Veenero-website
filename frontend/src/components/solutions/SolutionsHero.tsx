import React, { useState, useEffect } from "react";
import { ArrowRight, Leaf } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import defaultHeroBackground from "@/assets/solutions/solutions-hero-background.png";

interface SolutionsHeroProps {
  data?: any;
}

export const SolutionsHero: React.FC<SolutionsHeroProps> = ({ data }) => {
  useScrollReveal([]);
  const [offsetY, setOffsetY] = useState(0);

  // Subtle parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      setOffsetY(window.scrollY * 0.15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const cleanId = id.replace(/^#/, "");
    const el = document.getElementById(cleanId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const heroBg =
    data?.image && (data.image.startsWith("http://") || data.image.startsWith("https://"))
      ? data.image
      : defaultHeroBackground;
  const eyebrow = data?.eyebrow || "SUSTAINABLE SOLUTIONS";
  const titlePart1 = data?.title || "Intelligent Water Infrastructure";
  const titlePart2 = data?.highlightedText || "Built for a Better Tomorrow.";
  const description =
    data?.description ||
    "Modular solutions to solve real-world water challenges with data, intelligence, and lasting impact.";

  return (
    <section className="relative w-full overflow-hidden select-none bg-[#daf0f5] dark:bg-slate-950 min-h-[420px] lg:h-[52vh] lg:min-h-[460px] lg:max-h-[540px] flex items-center pt-20 pb-8 sm:pt-22 sm:pb-10 lg:pt-24 lg:pb-10 border-b border-teal-200/50 dark:border-teal-900/30">
      {/* Background Hero Image Composition — Full width seamless water environment with uncropped droplet */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src={heroBg}
          alt={data?.imageAlt || "Veenero Sustainable Water Infrastructure Solutions"}
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

      {/* Subtle Floating Water Light Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-1">
        <div className="absolute top-1/4 left-1/3 w-3 h-3 rounded-full bg-teal-400/20 blur-xs animate-pulse" />
        <div className="absolute top-1/2 left-1/4 w-2 h-2 rounded-full bg-cyan-300/30 blur-xs animate-ping" style={{ animationDuration: "3s" }} />
        <div className="absolute top-1/3 right-1/3 w-4 h-4 rounded-full bg-teal-300/15 blur-sm" />
      </div>

      {/* Floating Right Accents matching design mockup */}
      <div className="hidden lg:block absolute top-20 right-10 sm:right-16 text-right pointer-events-none select-none z-10">
        <div className="text-[10px] tracking-[0.25em] font-bold text-slate-700 dark:text-slate-200 uppercase leading-[1.4] opacity-85">
          <span>SOLVING</span>
          <br />
          <span>TODAY</span>
          <br />
          <span>FOR A</span>
          <br />
          <span>BRIGHTER</span>
          <br />
          <span>TOMORROW</span>
        </div>
      </div>

      <div className="hidden lg:block absolute bottom-8 right-10 sm:right-16 pointer-events-none select-none z-10">
        <div className="px-5 py-2.5 rounded-2xl bg-white/45 dark:bg-slate-900/50 backdrop-blur-md border border-white/60 dark:border-white/15 shadow-sm">
          <span className="text-xs font-bold tracking-wider text-slate-900 dark:text-white block uppercase leading-snug">
            CLEANER
            <br />
            WATER
            <br />
            HEALTHIER
            <br />
            TOMORROWS
          </span>
        </div>
      </div>

      {/* Content Container */}
      <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10 font-sans">
        <div className="max-w-xl lg:max-w-2xl text-left">

          {/* Eyebrow Capsule with Leaf Icon matching mockup */}
          <div className="reveal-on-scroll inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-600/10 dark:bg-teal-400/10 border border-teal-600/20 dark:border-teal-400/20 backdrop-blur-xs mb-3">
            <Leaf className="w-3 h-3 text-teal-700 dark:text-teal-300" />
            <span className="text-teal-800 dark:text-teal-300 font-bold uppercase tracking-widest text-[10px] sm:text-[11px] font-mono">
              {eyebrow}
            </span>
          </div>

          {/* H1 Headline — Balanced line height preventing any letter collisions */}
          <h1 className="reveal-on-scroll reveal-delay-100 font-display text-2xl sm:text-3xl lg:text-[2.65rem] font-bold leading-[1.18] tracking-tight mb-3">
            <span className="text-slate-950 dark:text-white block">
              {titlePart1}
            </span>
            <span className="text-[#136873] dark:text-teal-400 block font-bold mt-1">
              {titlePart2}
            </span>
          </h1>

          {/* Supporting Description */}
          <p className="reveal-on-scroll reveal-delay-200 text-xs sm:text-sm text-slate-700 dark:text-slate-200/90 leading-relaxed max-w-xl mb-5 font-sans">
            {description}
          </p>

          {/* Action CTAs */}
          <div className="reveal-on-scroll reveal-delay-300 flex flex-wrap items-center gap-3">
            <button
              onClick={() => scrollToSection("solutions-categories")}
              className="px-6 py-2.5 sm:py-3 rounded-full bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 group cursor-pointer"
            >
              <span>Explore Solutions</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <Link
              to="/contact"
              className="px-6 py-2.5 sm:py-3 rounded-full border border-slate-700/80 dark:border-slate-300/70 hover:border-slate-950 dark:hover:border-white text-slate-800 dark:text-white bg-white/40 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 font-semibold text-xs sm:text-sm transition-all duration-200"
            >
              Talk to an Expert
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};

export default SolutionsHero;
