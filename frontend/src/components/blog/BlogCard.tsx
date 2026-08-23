import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Article } from './types';
import heroWater from '@/assets/hero-water.jpg';

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
      className="group bg-card hover:bg-card/95 p-5 rounded-2xl border border-border/40 hover:border-teal-600/30 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between h-full font-sans cursor-pointer overflow-hidden"
    >
      <div className="space-y-4">

        {/* Aspect Ratio image block */}
        <div className="h-44 sm:h-48 rounded-xl overflow-hidden relative bg-muted/30">
          <img
            src={imgSrc || FALLBACK_IMG}
            alt={imgAlt}
            className="w-full h-full object-cover transition-transform ease-out group-hover:scale-105"
            style={{ transitionDuration: '6000ms' }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG;
            }}
          />
        </div>

        {/* Category Badge */}
        <span className="inline-block px-2.5 py-0.5 bg-teal-50 dark:bg-teal-950/20 text-teal-700 dark:text-teal-400 border border-teal-600/10 rounded-full text-[9px] font-bold uppercase tracking-wider">
          {article.category}
        </span>

        {/* Title (H3) */}
        <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors leading-snug">
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
          {article.excerpt}
        </p>

      </div>

      {/* Card Footer */}
      <div className="flex items-center justify-between pt-5 mt-5 border-t border-border/20">

        {/* Date and Reading Time */}
        <div className="text-[10px] font-semibold text-muted-foreground/80 flex items-center gap-2">
          {dateDisplay && <span>{dateDisplay}</span>}
          {dateDisplay && article.readingTime && <span className="w-0.5 h-0.5 bg-muted-foreground/30 rounded-full" />}
          {article.readingTime && <span>{article.readingTime}</span>}
        </div>

        {/* Link arrow */}
        <div className="flex items-center gap-1">
          <span className="text-teal-700 dark:text-teal-400 text-[11px] font-bold group-hover:underline">
            Read Article
          </span>
          <div className="h-7 w-7 rounded-full bg-muted/60 group-hover:bg-teal-50 dark:group-hover:bg-teal-950/30 flex items-center justify-center text-muted-foreground group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-all duration-200">
            <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

      </div>

    </div>
  );
};

export default BlogCard;
