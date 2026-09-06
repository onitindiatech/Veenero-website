import React from 'react';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { Article } from './types';
import heroWater from '@/assets/about/about-journey-water-infrastructure.webp';

interface BlogCardProps {
  article: Article;
  onViewDetails: (slug: string) => void;
}

const FALLBACK_IMG = heroWater;

export const BlogCard: React.FC<BlogCardProps> = ({ article, onViewDetails }) => {
  const imgSrc = article.featuredImage || article.image || '';
  const imgAlt = article.featuredImageAlt || article.title;

  const dateDisplay = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : article.date || '';

  return (
    <div
      onClick={() => onViewDetails(article.slug)}
      className="group bg-card p-6 sm:p-7 rounded-2xl border border-border/60 hover:border-teal-500/50 shadow-xs hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full font-sans cursor-pointer overflow-hidden relative text-left"
    >
      {/* Top Gradient Accent Line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

      <div className="space-y-3.5">
        {/* Aspect Ratio Image Container */}
        <div className="h-44 sm:h-48 rounded-xl overflow-hidden relative bg-slate-950">
          <img
            src={imgSrc || FALLBACK_IMG}
            alt={imgAlt}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Category Badge */}
        <div>
          <span className="inline-block px-2.5 py-0.5 bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-600/20 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono">
            {article.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors leading-snug line-clamp-2">
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
          {article.excerpt}
        </p>
      </div>

      {/* Card Footer */}
      <div className="flex items-center justify-between pt-4 mt-5 border-t border-border/30">
        {/* Date and Reading Time */}
        <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-2 font-mono">
          {dateDisplay && <span>{dateDisplay}</span>}
          {dateDisplay && article.readingTime && <span className="w-1 h-1 bg-teal-500 rounded-full" />}
          {article.readingTime && <span>{article.readingTime}</span>}
        </div>

        {/* Action Link */}
        <div className="flex items-center gap-1 text-teal-700 dark:text-teal-300 text-xs font-bold transition-colors">
          <span>Read</span>
          <ArrowRight className="h-3.5 w-3.5 arrow-shift group-hover:translate-x-1 transition-transform duration-200" />
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
