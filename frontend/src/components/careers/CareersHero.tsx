import React from "react";
import defaultHeroImage from "@/assets/hero-water.jpg";
import { CareerHeroData } from "./types";

interface CareersHeroProps {
  data?: Partial<CareerHeroData>;
}

export const CareersHero: React.FC<CareersHeroProps> = ({ data }) => {
  const heroData: CareerHeroData = {
    eyebrow: data?.eyebrow ?? "CAREERS AT VEENERO",
    title: data?.title ?? "Build the Future of Water With Us",
    description:
      data?.description ??
      "We are building India's water intelligence platform. Join our mission to make every litre visible.",
    backgroundImage: data?.backgroundImage || defaultHeroImage,
    primaryCtaText: data?.primaryCtaText ?? "Explore Open Positions",
    secondaryCtaText: data?.secondaryCtaText ?? "Life at Veenero",
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-[50vh] md:h-[60vh] flex items-center bg-background border-b border-border/10 overflow-hidden select-none">
      
      {/* RIGHT SIDE / BACKGROUND Image with Gradient Overlay Fades */}
      <div className="absolute right-0 top-0 bottom-0 w-full md:w-[60%] lg:w-[55%] z-0 select-none">
        <img
          src={heroData.backgroundImage}
          alt="Abstract water waves representing water management"
          className="w-full h-full object-cover transition-transform ease-out hover:scale-105"
          style={{ transitionDuration: "10s" }}
        />
        {/* Horizontal Gradient fade for Desktop (Solid white/light background to Transparent water image) */}
        <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-background via-background/70 to-transparent hidden md:block" />
        
        {/* Vertical Gradient fade for Mobile (Solid background bottom up to image) */}
        <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-background via-background/60 to-transparent md:hidden" />
      </div>

      {/* LEFT SIDE CONTENT - Spacing matches the reference image */}
      <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10 py-12 md:py-16">
        <div className="max-w-2xl text-left font-sans animate-fade-up">

          {/* Eyebrow */}
          {heroData.eyebrow && (
            <p className="text-teal-600 dark:text-teal-400 font-bold uppercase tracking-widest text-[10px] md:text-xs mb-3">
              {heroData.eyebrow}
            </p>
          )}

          {/* Editorial H1 Heading (Playfair Display) */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-[3.25rem] lg:text-[4rem] font-bold text-foreground leading-[1.1] mb-5 tracking-tight">
            Build the Future <br className="hidden md:inline" />
            of Water With Us
          </h1>

          {/* Supporting Description */}
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-lg mb-8">
            We are building India's water intelligence platform.<br className="hidden sm:inline" />
            Join our mission to make every litre visible.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button
              onClick={() => scrollToSection("open-positions")}
              className="w-full sm:w-auto px-6 py-3.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold shadow-soft hover:-translate-y-0.5 transition-all duration-200 text-sm flex items-center justify-center gap-2"
            >
              {heroData.primaryCtaText}
              <span className="text-base leading-none">→</span>
            </button>
            <button
              onClick={() => scrollToSection("life-at-veenero")}
              className="w-full sm:w-auto px-6 py-3.5 bg-card hover:bg-muted text-foreground border border-border/80 rounded-xl font-bold hover:-translate-y-0.5 transition-all duration-200 text-sm flex items-center justify-center shadow-soft"
            >
              {heroData.secondaryCtaText}
            </button>
          </div>
        </div>
      </div>

    </section>
  );
};

export default CareersHero;
