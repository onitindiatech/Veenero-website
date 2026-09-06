import React, { useMemo, useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User, ChevronRight, AlertCircle } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BlogCard } from '@/components/blog/BlogCard';
import { Article } from '@/components/blog/types';
import * as BlogService from '@/services/blog.service';

// Skeleton loader
const ArticleSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="h-4 w-24 bg-muted/40 rounded-full" />
    <div className="h-12 bg-muted/40 rounded-xl" />
    <div className="h-4 w-1/2 bg-muted/30 rounded-full" />
    <div className="h-72 bg-muted/40 rounded-3xl" />
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className={`h-3 bg-muted/30 rounded-full ${i % 3 === 2 ? 'w-2/3' : 'w-full'}`} />
      ))}
    </div>
  </div>
);

// Markdown / rich text content block parser
const parseContent = (contentString: string) => {
  const blocks = contentString.trim().split(/\n\n+/);
  return blocks.map((block, idx) => {
    const trimmed = block.trim();

    if (trimmed.startsWith('## ')) {
      return (
        <h2 key={idx} className="font-display text-2xl sm:text-3xl font-bold text-foreground mt-10 mb-4 tracking-tight leading-tight">
          {trimmed.replace('## ', '')}
        </h2>
      );
    }

    if (trimmed.startsWith('### ')) {
      return (
        <h3 key={idx} className="font-display text-xl font-bold text-foreground mt-8 mb-3 tracking-tight leading-tight">
          {trimmed.replace('### ', '')}
        </h3>
      );
    }

    if (trimmed.startsWith('- ')) {
      const items = trimmed.split('\n').map((line) => line.replace(/^- /, '').trim());
      return (
        <ul key={idx} className="list-none space-y-3 my-6">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
              <span className="w-2 h-2 bg-teal-600 dark:text-teal-400 rounded-full mt-2 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    }

    if (/^\d+\.\s/.test(trimmed)) {
      const items = trimmed.split('\n').map((line) => line.replace(/^\d+\.\s/, '').trim());
      return (
        <ol key={idx} className="list-none space-y-3 my-6">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
              <span className="font-bold text-teal-700 dark:text-teal-400 shrink-0 mt-0.5 w-6">{i + 1}.</span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      );
    }

    return (
      <p key={idx} className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-line mb-6">
        {trimmed}
      </p>
    );
  });
};

export const BlogDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    const fetchArticle = async () => {
      setLoading(true);
      setError(null);
      try {
        const { post, related: relatedPosts } = await BlogService.getPublicPostBySlug(slug);
        setArticle(post);
        setRelated(relatedPosts);
      } catch (err) {
        setError('Article not found or unavailable.');
        console.error('[BlogDetails] Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  // SEO
  useEffect(() => {
    if (article) {
      document.title = article.seo?.metaTitle || `${article.title} | Veenero Insights`;
    }
  }, [article]);

  const dateDisplay = useMemo(() => {
    if (!article) return '';
    return article.publishedAt
      ? new Date(article.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
      : article.date || '';
  }, [article]);

  const imgSrc = article?.featuredImage || article?.image || '';
  const imgAlt = article?.featuredImageAlt || article?.title || 'Article image';

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans relative overflow-hidden">

      {/* Floating accents */}
      <div className="absolute top-[20%] left-[3%] w-7 h-7 rounded-full bg-teal-500/10 border border-teal-600/20 blur-[0.5px] pointer-events-none" />
      <div className="absolute bottom-[30%] right-[4%] w-9 h-9 rounded-full bg-cyan-500/10 border border-cyan-600/20 blur-[1px] pointer-events-none" />

      <Navbar />

      <main className="flex-1 bg-[#FCFDFD] dark:bg-background pt-28 pb-20 relative z-10">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl space-y-8">

          {/* Back link */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold text-teal-700 dark:text-teal-400 hover:text-teal-800 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Insights
          </Link>

          {/* Loading state */}
          {loading && <ArticleSkeleton />}

          {/* Error state */}
          {!loading && error && (
            <div className="py-16 text-center space-y-4">
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 flex items-center gap-4 max-w-md mx-auto">
                <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
              </div>
              <Link to="/blog" className="inline-block px-5 py-2.5 bg-teal-700 text-white text-xs font-bold rounded-xl">
                Browse All Insights
              </Link>
            </div>
          )}

          {/* Article Content */}
          {!loading && !error && article && (
            <>
              {/* Header block */}
              <div className="space-y-6">
                <span className="inline-block px-3 py-1 bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-600/20 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
                  {article.category}
                </span>

                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground leading-[1.15] tracking-tight">
                  {article.title}
                </h1>

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-6 text-xs font-semibold text-muted-foreground border-y border-border/30 py-4">
                  {article.author && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                      <span>{article.author}</span>
                    </div>
                  )}
                  {dateDisplay && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                      <span>{dateDisplay}</span>
                    </div>
                  )}
                  {article.readingTime && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                      <span>{article.readingTime}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Featured Hero Image */}
              {imgSrc && (
                <div className="w-full h-64 sm:h-[420px] rounded-3xl overflow-hidden shadow-sm relative bg-slate-950">
                  <img
                    src={imgSrc}
                    alt={imgAlt}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).parentElement!.style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Article Body Container */}
              <article className="bg-card p-8 sm:p-12 border border-border/40 rounded-3xl shadow-sm space-y-2 text-foreground font-sans leading-relaxed">
                {parseContent(article.content)}
              </article>

              {/* Related Insights Grid */}
              {related.length > 0 && (
                <div className="pt-16 border-t border-border/30 space-y-8 select-none">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-teal-600 dark:text-teal-400 font-bold uppercase tracking-widest text-[10px] md:text-xs block mb-1">
                        MORE FROM VEENERO
                      </span>
                      <h3 className="font-display text-2xl font-bold text-foreground">
                        Related Insights
                      </h3>
                    </div>
                    <Link
                      to="/blog"
                      className="text-teal-700 dark:text-teal-300 text-xs font-bold flex items-center gap-1 hover:underline"
                    >
                      All Articles
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {related.map((ra) => (
                      <BlogCard
                        key={ra._id || ra.id || ra.slug}
                        article={ra}
                        onViewDetails={(s) => navigate(`/blog/${s}`)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogDetailsPage;
