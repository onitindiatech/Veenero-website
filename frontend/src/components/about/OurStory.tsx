import React from "react";
import { AboutContent } from "@/content/about";
import defaultHeroImage from "@/assets/hero-water.jpg";

interface OurStoryProps {
  data: AboutContent["ourStory"];
}

export const OurStory: React.FC<OurStoryProps> = ({ data }) => {
  return (
    <section id="our-story" className="py-12 md:py-16 bg-transparent relative border-b border-border/10">
      {/* Subtle underwater caustic gradient light in background */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="container mx-auto px-6 md:px-12 max-w-7xl space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left: Editorial Narrative */}
          <div className="lg:col-span-7 space-y-6 text-left font-sans animate-fade-up">
            {data.eyebrow && (
              <span className="text-teal-600 dark:text-teal-400 font-bold uppercase tracking-widest text-[10px] md:text-xs block">
                {data.eyebrow}
              </span>
            )}
            
            <h2 className="font-display text-3xl md:text-[2.5rem] font-bold text-foreground leading-tight">
              {data.title}
            </h2>

            <div className="space-y-4 text-sm md:text-base text-muted-foreground leading-relaxed">
              {data.paragraphs.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {/* Water Intelligence Pillars Badge Strip */}
            <div className="pt-2 flex flex-wrap gap-2.5">
              {["Water Visibility", "Water Accountability", "Water Verification"].map((pillar, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 text-xs font-semibold border border-teal-600/20"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                  {pillar}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Immersive Visual with Overlay Fade */}
          <div className="lg:col-span-5 relative group">
            <div className="relative rounded-2xl overflow-hidden border border-border/40 shadow-soft bg-card">
              <div className="absolute inset-0 bg-gradient-to-t from-teal-950/40 via-transparent to-transparent z-10 pointer-events-none" />
              <img
                src={data.image && data.image.trim() !== "" ? data.image : defaultHeroImage}
                alt="Veenero Water Intelligence Infrastructure"
                className="w-full h-72 sm:h-80 md:h-96 object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute bottom-4 left-4 right-4 z-20 p-3 rounded-xl bg-background/90 backdrop-blur-md border border-border/50 shadow-sm">
                <p className="text-xs font-bold text-foreground">Digital Infrastructure Layer</p>
                <p className="text-[11px] text-muted-foreground">Unifying edge telemetry & AI analytics</p>
              </div>
            </div>
          </div>

        </div>

        {/* Highlight Stats Row */}
        {data.stats && data.stats.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-border/20">
            {data.stats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-card p-5 rounded-xl border border-border/40 shadow-sm hover:border-teal-600/30 transition-all duration-200 text-left"
              >
                <p className="font-display text-2xl md:text-3xl font-bold text-teal-700 dark:text-teal-400 mb-1">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default OurStory;
