import { useState, useEffect } from "react";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImageFallback from "@/assets/hero-water.jpg";
import { waterRipple } from "@/assets/animations";
import { heroContent } from "@/content/home/hero";
import { getPublicHome, HomeHero } from "@/services/home.service";
import { mergeHomeSection } from "@/utils/mergeHomeSection";
import WaterCursorEffect from "@/components/effects/WaterCursorEffect";
import WaterScrollEffect from "@/components/effects/WaterScrollEffect";

export const Hero = () => {
  const [hero, setHero] = useState<HomeHero>(heroContent);

  useEffect(() => {
    let cancelled = false;
    getPublicHome()
      .then((data) => {
        if (!cancelled && data?.hero) {
          setHero(mergeHomeSection(heroContent, data.hero));
        }
      })
      .catch(() => {
        // silently fall back — heroContent is already in state
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Resolve the background image: prefer the CMS URL, fall back to the bundled asset
  const bgSrc = hero.image && hero.image.trim() !== "" ? hero.image : heroImageFallback;

  if (!hero.visible) return null;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden font-sans select-none">
      {/* Background Image with Crisp Water Depth */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgSrc}
          alt={hero.imageAlt || "India's Water Intelligence Platform"}
          className="w-full h-full object-cover transition-transform ease-out duration-[10000ms] hover:scale-105"
        />
        {/* Deep Ocean Teal Atmosphere Overlays matching reference image */}
        <div className="absolute inset-0 bg-[#0c4c56]/65 mix-blend-multiply pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#063038]/50 via-transparent to-[#063038]/60 pointer-events-none" />
      </div>

      {/* Water cursor ripple effect */}
      <WaterCursorEffect />

      {/* Main Content */}
      <div className="container mx-auto px-6 relative z-10 text-center py-20 sm:py-24">
        <WaterScrollEffect>
          <div className="max-w-5xl mx-auto flex flex-col items-center">
            {/* Eyebrow: Clean uppercase tracking text */}
            {hero.eyebrow && (
              <p className="text-white/90 font-medium tracking-[0.18em] uppercase text-xs sm:text-sm mb-4 sm:mb-6 opacity-0 animate-fade-up">
                {hero.eyebrow}
              </p>
            )}

            {/* Editorial H1 Heading: Playfair Display Serif */}
            <h1 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-[4.2rem] font-extrabold text-white leading-[1.15] mb-6 sm:mb-8 opacity-0 animate-fade-up animation-delay-200 tracking-tight max-w-5xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]">
              {hero.title.includes("\n") ? (
                hero.title.split("\n").map((line, idx) => (
                  <span
                    key={idx}
                    className={`block ${idx > 0 ? "text-[#b8eded] font-black drop-shadow-[0_2px_8px_rgba(4,47,46,0.6)]" : "text-white font-extrabold"}`}
                  >
                    {line}
                  </span>
                ))
              ) : hero.title.toLowerCase().trim() === "india's water intelligence platform" ? (
                <>
                  <span className="block sm:whitespace-nowrap text-white font-extrabold">India's Water Intelligence</span>
                  <span className="block text-[#b8eded] font-black drop-shadow-[0_2px_8px_rgba(4,47,46,0.6)]">Platform</span>
                </>
              ) : (
                (() => {
                  const words = hero.title.trim().split(" ");
                  if (words.length > 1) {
                    const last = words.pop();
                    return (
                      <>
                        <span className="text-white font-extrabold">{words.join(" ")} </span>
                        <span className="text-[#b8eded] font-black drop-shadow-[0_2px_8px_rgba(4,47,46,0.6)]">{last}</span>
                      </>
                    );
                  }
                  return <span className="text-white font-extrabold">{hero.title}</span>;
                })()
              )}
            </h1>

            {/* Subtitle / Description */}
            <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8 sm:mb-10 font-normal leading-relaxed opacity-0 animate-fade-up animation-delay-400">
              {hero.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-up animation-delay-600">
              <Button
                variant="default"
                size="xl"
                className="w-full sm:w-auto bg-white text-teal-950 hover:bg-white/95 hover:-translate-y-0.5 transition-all duration-200 font-semibold text-sm sm:text-base px-7 py-3.5 rounded-lg shadow-sm group flex items-center justify-center gap-2 border border-white"
                asChild
              >
                <a href={hero.primaryCtaLink || "/#solutions"}>
                  <span>{hero.primaryCtaText || "Explore the Platform"}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
              <Button
                variant="outline"
                size="xl"
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 border border-white/80 text-white hover:-translate-y-0.5 transition-all duration-200 font-semibold text-sm sm:text-base px-6 py-3.5 rounded-lg backdrop-blur-xs group flex items-center justify-center gap-2.5"
                asChild
              >
                <a href={hero.secondaryCtaLink || "/approach"}>
                  <Play className="h-4 w-4 fill-none stroke-current stroke-[2]" />
                  <span>{hero.secondaryCtaText || "Watch How Water Visibility Works"}</span>
                </a>
              </Button>
            </div>

            {/* Bottom Tagline */}
            {hero.bottomText && (
              <p className="mt-8 sm:mt-10 text-xs sm:text-sm text-white/80 tracking-[0.2em] uppercase font-medium opacity-0 animate-fade-up animation-delay-700">
                {hero.bottomText}
              </p>
            )}

            {/* Mouse Scroll Indicator */}
            <div className="mt-7 sm:mt-9 flex justify-center opacity-0 animate-fade-in animation-delay-800 pointer-events-none">
              <div className="w-[20px] h-[32px] border-[1.5px] border-white/60 rounded-full flex justify-center pt-1.5 backdrop-blur-[1px]">
                <div className="w-[2px] h-[5px] bg-white/80 rounded-full animate-bounce" />
              </div>
            </div>
          </div>
        </WaterScrollEffect>
      </div>
    </section>
  );
};

export default Hero;
