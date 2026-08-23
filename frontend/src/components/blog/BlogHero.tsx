import React from 'react';
import { BlogSettings } from './types';
import heroWater from '@/assets/hero-water.jpg';

interface BlogHeroProps {
  settings?: BlogSettings | null;
}

// Fallback content when settings haven't loaded yet
const DEFAULT = {
  eyebrow: 'VEENERO INSIGHTS',
  title: 'Water Intelligence & Innovation',
  description:
    'Insights, research and perspectives on smart water management, sustainability and real-time telemetry.',
  image: '',
  imageAlt: 'Water intelligence editorial',
};

const FALLBACK_IMG = heroWater;

export const BlogHero: React.FC<BlogHeroProps> = ({ settings }) => {
  const hero = settings?.hero ?? DEFAULT;

  return (
    <section className="relative w-full bg-[#F7FAFA] dark:bg-[#0a1a1a] overflow-hidden select-none">
      
      {/* Soft teal gradient mesh */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-72 h-72 bg-cyan-400/8 rounded-full blur-2xl pointer-events-none" />

      {/* Floating droplet accents */}
      <div className="absolute top-8 left-[12%] w-3 h-3 rounded-full border border-teal-400/30 bg-teal-400/10 animate-float pointer-events-none" />
      <div className="absolute bottom-10 left-[35%] w-2 h-2 rounded-full border border-cyan-400/40 bg-cyan-400/15 animate-float animation-delay-600 pointer-events-none" />
      <div className="absolute top-16 right-[20%] w-4 h-4 rounded-full border border-teal-500/20 bg-teal-500/8 animate-float animation-delay-300 pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 max-w-7xl py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Left — Text */}
          <div className="space-y-6 order-2 lg:order-1">
            {/* Eyebrow */}
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-teal-600" />
              <span className="text-teal-600 dark:text-teal-400 font-bold uppercase tracking-widest text-[10px] md:text-xs">
                {hero.eyebrow}
              </span>
            </div>

            {/* H1 */}
            <h1 className="font-display text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-foreground leading-[1.1] tracking-tight">
              {hero.title.split('&').map((part, i, arr) =>
                i < arr.length - 1 ? (
                  <React.Fragment key={i}>
                    {part}
                    <span className="text-teal-600">&</span>
                  </React.Fragment>
                ) : (
                  <React.Fragment key={i}>{part}</React.Fragment>
                )
              )}
            </h1>

            {/* Description */}
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-lg">
              {hero.description}
            </p>

            {/* Subtle tag chips */}
            <div className="flex flex-wrap gap-2 pt-2">
              {['Water Intelligence', 'Sustainability', 'Technology', 'Research'].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-teal-50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-400 border border-teal-200/60 dark:border-teal-800/40 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right — Editorial Image */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] lg:aspect-[16/11] shadow-2xl">
              <img
                src={hero.image || FALLBACK_IMG}
                alt={hero.imageAlt}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG;
                }}
              />
              {/* Teal overlay at bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-teal-900/30 via-transparent to-transparent" />

              {/* Floating badge */}
              <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-background/90 backdrop-blur-sm rounded-2xl px-4 py-2.5 shadow-lg border border-white/30">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
                  <span className="text-[11px] font-bold text-foreground">Live Insights</span>
                </div>
              </div>
            </div>

            {/* Decorative offset ring */}
            <div className="absolute -bottom-4 -right-4 w-32 h-32 border-2 border-teal-200/40 dark:border-teal-800/40 rounded-3xl pointer-events-none" />
          </div>

        </div>
      </div>
    </section>
  );
};
