import { useState, useEffect } from "react";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImageFallback from "@/assets/hero-water.jpg";
import { heroContent } from "@/content/home/hero";
import { getPublicHome, HomeHero } from "@/services/home.service";
import { mergeHomeSection } from "@/utils/mergeHomeSection";

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

  // Build the title: keep the original two-part gradient animation style
  // The CMS stores the full title; we split on the last word for the gradient span
  const titleWords = hero.title.trim().split(" ");
  const titleLastWord = titleWords.pop() ?? "";
  const titleRest = titleWords.join(" ");

  if (!hero.visible) return null;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden font-sans select-none">
      {/* Background Image with Layered Water Depth & Gradient */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgSrc}
          alt={hero.imageAlt}
          className="w-full h-full object-cover transition-transform ease-out duration-[10000ms] hover:scale-105"
        />
        {/* Layered Gradient Overlays for High Legibility & Deep Ocean Atmosphere */}
        <div className="absolute inset-0 bg-gradient-hero opacity-80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-teal-950/50 via-transparent to-black/30 pointer-events-none" />
      </div>

      {/* Floating Water Droplet Accents Matching Careers, About & Solutions Benchmark */}
      <div className="absolute top-[22%] left-[4%] w-6 h-6 rounded-full bg-teal-300/15 border border-teal-200/30 blur-[0.5px] pointer-events-none animate-float z-10" />
      <div className="absolute top-[48%] right-[5%] w-8 h-8 rounded-full bg-cyan-300/15 border border-cyan-200/30 blur-[1px] pointer-events-none animate-float animation-delay-400 z-10" />
      <div className="absolute top-[72%] left-[6%] w-5 h-5 rounded-full bg-teal-200/20 border border-teal-100/40 blur-[0.5px] pointer-events-none animate-float animation-delay-200 z-10" />

      {/* Ambient Caustic Light & Wave Elements */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-foreground/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-aqua/15 rounded-full blur-3xl animate-float animation-delay-400" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary-foreground/5 rounded-full blur-3xl animate-wave" />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 relative z-10 text-center py-20">
        <div className="max-w-4xl mx-auto">
          {/* Eyebrow with Pulsing Live Indicator */}
          {hero.eyebrow && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6 opacity-0 animate-fade-up">
              <span className="w-2 h-2 rounded-full bg-aqua animate-ping inline-block" />
              <p className="text-primary-foreground/90 font-bold tracking-widest uppercase text-xs">
                {hero.eyebrow}
              </p>
            </div>
          )}

          {/* Editorial H1 Heading */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-[1.1] mb-8 opacity-0 animate-fade-up animation-delay-200 tracking-tight">
            {titleRest}{" "}
            <span className="block sm:inline mt-2 sm:mt-0 bg-clip-text text-transparent bg-gradient-to-r from-white via-aqua to-teal-200 animate-gradient">
              {titleLastWord}
            </span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto mb-10 leading-relaxed opacity-0 animate-fade-up animation-delay-400 font-sans">
            {hero.description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-up animation-delay-600">
            <Button
              variant="hero"
              size="xl"
              className="w-full sm:w-auto shadow-glow hover:shadow-soft hover:-translate-y-0.5 transition-all duration-200 font-bold group"
              asChild
            >
              <a href={hero.primaryCtaLink || "/#solutions"}>
                {hero.primaryCtaText || "Explore the Platform"}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
            <Button
              variant="heroOutline"
              size="xl"
              className="w-full sm:w-auto hover:bg-white/15 hover:-translate-y-0.5 transition-all duration-200 font-bold group"
              asChild
            >
              <a href={hero.secondaryCtaLink || "/approach"}>
                <Play className="h-5 w-5 text-aqua fill-aqua/30" />
                {hero.secondaryCtaText || "Watch How Water Visibility Works"}
              </a>
            </Button>
          </div>

          {/* Bottom Tagline */}
          {hero.bottomText && (
            <p className="mt-8 text-xs sm:text-sm md:text-base text-primary-foreground/80 tracking-widest uppercase font-semibold opacity-0 animate-fade-up animation-delay-700">
              {hero.bottomText}
            </p>
          )}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in animation-delay-800 pointer-events-none">
        <div className="w-6 h-10 border-2 border-primary-foreground/40 rounded-full flex justify-center backdrop-blur-sm bg-black/10">
          <div className="w-1.5 h-3 bg-aqua rounded-full mt-2 animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
