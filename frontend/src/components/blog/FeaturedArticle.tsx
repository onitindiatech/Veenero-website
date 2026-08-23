import React from 'react';
import { ChevronRight, Calendar, Clock } from 'lucide-react';
import { Article } from './types';
import heroWater from '@/assets/hero-water.jpg';

interface FeaturedArticleProps {
  article: Article;
  settings?: { eyebrow?: string; title?: string; description?: string } | null;
  onViewDetails: (slug: string) => void;
}

const FALLBACK_IMG = heroWater;

export const FeaturedArticle: React.FC<FeaturedArticleProps> = ({ article, settings, onViewDetails }) => {
  // Support both legacy `image` field and new `featuredImage` field
  const imgSrc = article.featuredImage || article.image || '';
  const imgAlt = article.featuredImageAlt || article.title;

  // Date display
  const dateDisplay = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : article.date || '';

  return (
    <section className="py-6 md:py-10 bg-transparent select-none">
      <div className="container mx-auto px-6 md:px-12 max-w-7xl space-y-5">

        {/* Section eyebrow */}
        <div className="flex items-center gap-3">
          <div className="h-px w-8 bg-teal-600" />
          <span className="text-teal-600 dark:text-teal-400 font-bold uppercase tracking-widest text-[10px] md:text-xs">
            {settings?.eyebrow || 'COVER STORY'}
          </span>
        </div>

        {/* Featured card */}
        <div
          onClick={() => onViewDetails(article.slug)}
          className="group bg-card hover:bg-card/95 rounded-3xl border border-border/40 hover:border-teal-600/30 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer grid grid-cols-1 lg:grid-cols-12 gap-0 font-sans"
        >

          {/* LEFT: Large featured article image */}
          <div className="lg:col-span-7 h-64 sm:h-80 lg:h-[420px] overflow-hidden relative">
            <img
              src={imgSrc || FALLBACK_IMG}
              alt={imgAlt}
              className="w-full h-full object-cover transition-transform ease-out group-hover:scale-105"
              style={{ transitionDuration: '6000ms' }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG;
              }}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />

            {/* Featured badge on image */}
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1.5 bg-teal-600/90 backdrop-blur-sm text-white text-[10px] font-extrabold uppercase tracking-wider rounded-xl shadow">
                Featured
              </span>
            </div>
          </div>

          {/* RIGHT: Featured details panel */}
          <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between items-stretch">

            <div className="space-y-5">

              {/* Category Badge */}
              <span className="inline-block px-3 py-1 bg-teal-50 dark:bg-teal-950/20 text-teal-700 dark:text-teal-400 border border-teal-600/10 rounded-xl text-[10px] font-extrabold uppercase tracking-wider">
                {article.category}
              </span>

              {/* Title (H2) */}
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors leading-tight">
                {article.title}
              </h2>

              {/* Short Description */}
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {article.excerpt}
              </p>

            </div>

            {/* Footer row: Meta info + Read button */}
            <div className="flex items-center justify-between border-t border-border/20 pt-6 mt-6">

              {/* Metadata */}
              <div className="flex flex-col gap-1 text-[11px] font-semibold text-muted-foreground/80">
                {dateDisplay && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3 w-3" />
                    <span>{dateDisplay}</span>
                  </div>
                )}
                {article.readingTime && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3" />
                    <span>{article.readingTime}</span>
                  </div>
                )}
              </div>

              {/* Action Trigger */}
              <div className="flex items-center gap-2">
                <span className="text-teal-700 dark:text-teal-400 text-xs font-bold inline-flex items-center gap-1 group-hover:underline">
                  Read Article
                  <span className="transition-transform group-hover:translate-x-0.5 duration-200">→</span>
                </span>
                <div className="h-8 w-8 rounded-full bg-muted/60 group-hover:bg-teal-50 dark:group-hover:bg-teal-950/30 flex items-center justify-center text-muted-foreground group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-all duration-200">
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default FeaturedArticle;
