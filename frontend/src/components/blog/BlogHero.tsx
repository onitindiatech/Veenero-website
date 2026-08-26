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
    <section className="relative min-h-[50vh] md:min-h-[60vh] flex items-center bg-background border-b border-border/10 overflow-hidden select-none">
      {/* RIGHT SIDE / BACKGROUND Image with Gradient Overlay Fades */}
      <div className="absolute right-0 top-0 bottom-0 w-full md:w-[60%] lg:w-[55%] z-0 select-none">
        <img
          src={FALLBACK_IMG}
          alt={hero.imageAlt}
          className="w-full h-full object-cover transition-transform ease-out hover:scale-105"
          style={{ transitionDuration: "10s" }}
        />
        {/* Water caustic light overlay */}
        <div className="absolute inset-0 bg-teal-950/20 mix-blend-color-burn pointer-events-none" />
        
        <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-background via-background/70 to-transparent hidden md:block" />
        <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-background via-background/60 to-transparent md:hidden" />
      </div>

      {/* LEFT SIDE CONTENT - Spacing matches the reference image */}
      <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10 py-12 md:py-16">
        <div className="max-w-2xl text-left font-sans animate-fade-up">

          {/* Eyebrow */}
          {hero.eyebrow && (
            <p className="text-teal-600 dark:text-teal-400 font-bold uppercase tracking-widest text-[10px] md:text-xs mb-3">
              {hero.eyebrow}
            </p>
          )}

          {/* Editorial H1 Heading (Playfair Display) */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-[3.25rem] lg:text-[4rem] font-bold text-foreground leading-[1.1] mb-5 tracking-tight">
            {hero.title}
          </h1>

          {/* Supporting Description */}
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-lg mb-8">
            {hero.description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button
              onClick={() => {
                const el = document.getElementById('blog-grid');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-6 py-3.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold shadow-soft hover:-translate-y-0.5 transition-all duration-200 text-sm flex items-center justify-center gap-2"
            >
              Explore Insights
              <span className="text-base leading-none">→</span>
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('newsletter');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-6 py-3.5 bg-card hover:bg-muted text-foreground border border-border/80 rounded-xl font-bold hover:-translate-y-0.5 transition-all duration-200 text-sm flex items-center justify-center shadow-soft"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
