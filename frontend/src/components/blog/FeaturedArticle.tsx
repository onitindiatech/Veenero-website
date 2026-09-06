import React from 'react';
import { ArrowRight, Calendar, Clock, User, Sparkles } from 'lucide-react';
import { Article } from './types';
import heroWater from '@/assets/about/about-journey-water-infrastructure.webp';

interface FeaturedArticleProps {
  article: Article;
  settings?: { eyebrow?: string; title?: string; description?: string } | null;
  onViewDetails: (slug: string) => void;
}

const FALLBACK_IMG = heroWater;

export const FeaturedArticle: React.FC<FeaturedArticleProps> = ({ article, settings, onViewDetails }) => {
  const imgSrc = article.featuredImage || article.image || '';
  const imgAlt = article.featuredImageAlt || article.title;

  const dateDisplay = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : article.date || '';

  return (
    <section
      id="featured-story"
      className="relative z-20 select-none pt-8 pb-10 sm:pt-10 sm:pb-12 lg:pt-11 lg:pb-14 bg-[#edf6f5] dark:bg-[#031d22] border-b border-[#dce9e6] dark:border-teal-900/30"
    >
      <div className="container mx-auto px-6 md:px-12 max-w-7xl space-y-6">

        {/* Section Header */}
        <div className="text-left font-sans max-w-3xl">
          <div>
            <span className="text-teal-700 dark:text-teal-400 font-bold uppercase tracking-widest text-xs font-mono block mb-1.5">
              {settings?.eyebrow || 'FEATURED PUBLICATION'}
            </span>
            <div className="w-10 h-0.5 bg-teal-600 rounded-full mb-3" />
          </div>

          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white leading-tight tracking-tight">
            {settings?.title || 'Key Insights in Water Intelligence'}
          </h2>
        </div>

        {/* Featured Card Container */}
        <div
          onClick={() => onViewDetails(article.slug)}
          className="group bg-card hover:bg-card/95 rounded-3xl border border-border/60 hover:border-teal-500/50 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer grid grid-cols-1 lg:grid-cols-12 gap-0 font-sans relative text-left"
        >

          {/* LEFT: Large featured image */}
          <div className="lg:col-span-7 h-64 sm:h-80 lg:h-[400px] overflow-hidden relative bg-slate-950">
            <img
              src={imgSrc || FALLBACK_IMG}
              alt={imgAlt}
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG;
              }}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

            {/* Featured Badge */}
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-950/80 backdrop-blur-md text-teal-300 border border-teal-500/40 text-[10px] font-bold uppercase tracking-wider rounded-xl shadow-md font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Featured Insight
              </span>
            </div>
          </div>

          {/* RIGHT: Featured Details Panel */}
          <div className="lg:col-span-5 p-7 sm:p-9 flex flex-col justify-between items-stretch">

            <div className="space-y-3.5">
              {/* Category Badge */}
              <div>
                <span className="inline-block px-3 py-1 bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-600/20 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono">
                  {article.category}
                </span>
              </div>

              {/* Title (H2 in Playfair Display) */}
              <h2 className="font-display text-xl sm:text-2xl lg:text-[1.75rem] font-bold text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors leading-snug">
                {article.title}
              </h2>

              {/* Excerpt */}
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                {article.excerpt}
              </p>
            </div>

            {/* Footer Row: Metadata + Read button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-border/30 pt-5 mt-5">
              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 font-mono">
                {article.author && (
                  <div className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                    <span>{article.author}</span>
                  </div>
                )}
                {dateDisplay && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                    <span>{dateDisplay}</span>
                  </div>
                )}
                {article.readingTime && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                    <span>{article.readingTime}</span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="flex items-center gap-2 text-teal-700 dark:text-teal-300 text-xs font-bold shrink-0">
                <span>Read Insight</span>
                <div className="w-6 h-6 rounded-full bg-teal-500/15 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="h-3.5 w-3.5" />
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
