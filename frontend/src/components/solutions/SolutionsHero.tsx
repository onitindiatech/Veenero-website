import React from "react";
import defaultHeroImage from "@/assets/hero-water.jpg";
import { SolutionsContent } from "@/content/solutions";

interface SolutionsHeroProps {
  data: SolutionsContent["hero"];
}

export const SolutionsHero: React.FC<SolutionsHeroProps> = ({ data }) => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-[50vh] md:h-[60vh] flex items-center bg-background border-b border-border/10 overflow-hidden select-none">
      {/* RIGHT SIDE / BACKGROUND Image with Gradient Overlay Fades & Subtle Data-Stream Glow */}
      <div className="absolute right-0 top-0 bottom-0 w-full md:w-[60%] lg:w-[55%] z-0 select-none">
        <img
          src={defaultHeroImage}
          alt="Water infrastructure intelligence platform"
          className="w-full h-full object-cover transition-transform ease-out hover:scale-105"
          style={{ transitionDuration: "10s" }}
        />
        
        {/* Subtle Water Caustic / Data-stream overlay mesh */}
        <div className="absolute inset-0 bg-teal-950/20 mix-blend-color-burn pointer-events-none" />

        {/* Horizontal Gradient fade for Desktop */}
        <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-background via-background/70 to-transparent hidden md:block" />
        
        {/* Vertical Gradient fade for Mobile */}
        <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-background via-background/60 to-transparent md:hidden" />
      </div>

      {/* LEFT SIDE CONTENT - Matching Careers and About Hero Spacing & Typography */}
      <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10 py-12 md:py-16">
        <div className="max-w-2xl text-left font-sans animate-fade-up">
          {/* Eyebrow */}
          {data.eyebrow && (
            <p className="text-teal-600 dark:text-teal-400 font-bold uppercase tracking-widest text-[10px] md:text-xs mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping inline-block" />
              {data.eyebrow}
            </p>
          )}

          {/* Editorial H1 Heading (Playfair Display) */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-[3.25rem] lg:text-[4rem] font-bold text-foreground leading-[1.1] mb-5 tracking-tight">
            Intelligent Water <br className="hidden md:inline" />
            Infrastructure
          </h1>

          {/* Supporting Description */}
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-lg mb-8">
            {data.description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button
              onClick={() => scrollToSection("solutions-grid")}
              className="w-full sm:w-auto px-6 py-3.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold shadow-soft hover:-translate-y-0.5 transition-all duration-200 text-sm flex items-center justify-center gap-2"
            >
              {data.primaryCtaText || "Explore Solutions"}
              <span className="text-base leading-none">→</span>
            </button>
            <button
              onClick={() => scrollToSection("platform-architecture")}
              className="w-full sm:w-auto px-6 py-3.5 bg-card hover:bg-muted text-foreground border border-border/80 rounded-xl font-bold hover:-translate-y-0.5 transition-all duration-200 text-sm flex items-center justify-center shadow-soft"
            >
              {data.secondaryCtaText || "Platform Architecture"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionsHero;
