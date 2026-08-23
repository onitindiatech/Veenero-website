import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Compass, AlertCircle } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BlogHero } from '@/components/blog/BlogHero';
import { FeaturedArticle } from '@/components/blog/FeaturedArticle';
import { BlogCard } from '@/components/blog/BlogCard';
import { InsightStats } from '@/components/blog/InsightStats';
import { Article, BlogSettings } from '@/components/blog/types';
import * as BlogService from '@/services/blog.service';

// ─── Skeleton Card ─────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-card rounded-2xl border border-border/40 p-5 space-y-4 animate-pulse">
    <div className="h-44 bg-muted/40 rounded-xl" />
    <div className="h-3 w-20 bg-muted/40 rounded-full" />
    <div className="h-5 bg-muted/40 rounded-lg" />
    <div className="h-3 bg-muted/30 rounded-lg" />
    <div className="h-3 w-3/4 bg-muted/30 rounded-lg" />
  </div>
);

const FIXED_CATEGORIES = [
  'All',
  'Water Intelligence',
  'Technology',
  'Sustainability',
  'Water Verification',
  'Industry',
];

export const BlogPage: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Article[]>([]);
  const [settings, setSettings] = useState<BlogSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [fetchedPosts, fetchedSettings] = await Promise.all([
          BlogService.getPublicPosts(),
          BlogService.getPublicSettings(),
        ]);
        setPosts(fetchedPosts);
        setSettings(fetchedSettings);
      } catch (err) {
        setError('Failed to load blog content. Please try again later.');
        console.error('[Blog] Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Find the featured post (highest sortOrder among featured)
  const featuredArticle = useMemo(() => {
    const featured = posts.filter((p) => p.featured);
    if (featured.length === 0) return posts[0] || null;
    return featured.sort((a, b) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99))[0];
  }, [posts]);

  // Derive categories dynamically from posts
  const categories = useMemo(() => {
    const fromPosts = [...new Set(posts.map((p) => p.category))];
    // Merge with the fixed list, preserving order
    const merged = ['All'];
    FIXED_CATEGORIES.slice(1).forEach((c) => {
      if (fromPosts.includes(c)) merged.push(c);
    });
    // Add any categories not in fixed list
    fromPosts.forEach((c) => {
      if (!merged.includes(c)) merged.push(c);
    });
    return merged;
  }, [posts]);

  // Filter non-featured articles
  const filteredArticles = useMemo(() => {
    const featId = featuredArticle?._id || featuredArticle?.id;
    const featSlug = featuredArticle?.slug;

    let list = featuredArticle
      ? posts.filter((p) => {
          const id = p._id || p.id;
          if (featId && id) return String(id) !== String(featId);
          return p.slug !== featSlug;
        })
      : posts;

    if (selectedCategory !== 'All') {
      list = list.filter((a) => a.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q)
      );
    }

    return list;
  }, [posts, featuredArticle, selectedCategory, searchQuery]);

  const isFilteringActive = selectedCategory !== 'All' || searchQuery.trim() !== '';

  const handleArticleClick = (slug: string) => {
    navigate(`/blog/${slug}`);
  };

  // SEO
  const seoTitle = settings?.seo?.metaTitle || 'Water Intelligence Insights & Articles | Veenero';
  const seoDesc = settings?.seo?.metaDescription || 'Read the latest insights on water management, sustainability, and smart infrastructure from Veenero.';

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans relative overflow-hidden">
      {/* Update page title */}
      {typeof document !== 'undefined' && (document.title = seoTitle)}

      {/* Floating background droplet decor */}
      <div className="absolute top-[20%] left-[2%] w-6 h-6 rounded-full bg-teal-500/10 border border-teal-600/20 blur-[0.5px] pointer-events-none animate-float z-0" />
      <div className="absolute top-[60%] right-[3%] w-7 h-7 rounded-full bg-cyan-500/10 border border-cyan-600/20 blur-[1px] pointer-events-none animate-float z-0" />

      <Navbar />

      <main className="flex-1 bg-[#FCFDFD] dark:bg-background pt-24 pb-20 relative z-10">

        {/* 1. Blog Hero — always visible, uses settings */}
        <BlogHero settings={settings} />

        {/* 2. Error state */}
        {error && (
          <div className="container mx-auto px-6 md:px-12 max-w-7xl py-12">
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 flex items-center gap-4">
              <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          </div>
        )}

        {/* 3. Featured Article */}
        {!loading && !error && featuredArticle && !isFilteringActive && (
          <FeaturedArticle
            article={featuredArticle}
            settings={settings?.featuredSection}
            onViewDetails={handleArticleClick}
          />
        )}

        {/* 4. Search and Category Filter */}
        <section className="py-8 bg-transparent">
          <div className="container mx-auto px-6 md:px-12 max-w-7xl space-y-6">
            <div className="flex flex-col lg:flex-row gap-6 justify-between items-stretch lg:items-center border-b border-border/20 pb-6">

              {/* Category Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedCategory === category
                        ? 'bg-teal-700 text-white shadow-sm'
                        : 'bg-card border border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted/40'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative w-full lg:max-w-xs">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search insights..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-card border border-border/80 rounded-xl focus:outline-none focus:border-teal-500/60 font-semibold"
                />
              </div>

            </div>
          </div>
        </section>

        {/* 5. Articles Grid */}
        <section className="py-4 bg-transparent">
          <div className="container mx-auto px-6 md:px-12 max-w-7xl">

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : isFilteringActive ? (
              filteredArticles.length === 0 ? (
                <div className="py-20 text-center space-y-3 bg-card border border-border/40 rounded-3xl max-w-md mx-auto">
                  <Compass className="h-10 w-10 text-muted-foreground/60 mx-auto" />
                  <h3 className="text-base font-bold text-foreground">No insights found</h3>
                  <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
                    No articles match your current filters. Try a different category or search term.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredArticles.map((article) => (
                    <BlogCard key={article._id || article.id || article.slug} article={article} onViewDetails={handleArticleClick} />
                  ))}
                </div>
              )
            ) : (
              <div className="space-y-12">
                {/* First 3 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredArticles.slice(0, 3).map((article) => (
                    <BlogCard key={article._id || article.id || article.slug} article={article} onViewDetails={handleArticleClick} />
                  ))}
                </div>

                {/* Stats Strip */}
                {filteredArticles.length > 0 && (
                  <div className="-mx-6 md:-mx-12 lg:mx-0">
                    <InsightStats
                      stats={settings?.insightStats}
                      quote={settings?.editorialQuote}
                    />
                  </div>
                )}

                {/* Remaining */}
                {filteredArticles.length > 3 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredArticles.slice(3).map((article) => (
                      <BlogCard key={article._id || article.id || article.slug} article={article} onViewDetails={handleArticleClick} />
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </section>

        {/* 6. CTA Section */}
        {!loading && (
          <section className="py-12 bg-transparent select-none">
            <div className="container mx-auto px-6 md:px-12 max-w-7xl">
              <div className="bg-[#E6F3F3] dark:bg-teal-950/20 border border-teal-600/10 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-1.5 text-center md:text-left">
                  {settings?.cta?.eyebrow && (
                    <span className="text-teal-600 dark:text-teal-400 font-bold uppercase tracking-widest text-[10px] block">
                      {settings.cta.eyebrow}
                    </span>
                  )}
                  <h2 className="text-xl font-bold text-foreground">
                    {settings?.cta?.title || 'Have an idea worth sharing?'}
                  </h2>
                  <p className="text-xs text-muted-foreground max-w-sm">
                    {settings?.cta?.description || 'We are always looking for perspectives on sustainability, measurement, and water infrastructure.'}
                  </p>
                </div>
                <div className="shrink-0 w-full md:w-auto">
                  <a
                    href={settings?.cta?.buttonLink || '/#contact'}
                    className="w-full md:w-auto px-6 py-3.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold shadow-sm flex items-center justify-center gap-2 text-xs transition-all"
                  >
                    {settings?.cta?.buttonText || 'Explore Veenero'}
                    <span className="text-sm leading-none">→</span>
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

      </main>

      <Footer />
    </div>
  );
};

export default BlogPage;
