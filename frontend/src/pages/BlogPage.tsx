import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Compass, AlertCircle, ArrowRight, Droplets, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BlogHero } from '@/components/blog/BlogHero';
import { FeaturedArticle } from '@/components/blog/FeaturedArticle';
import { BlogCard } from '@/components/blog/BlogCard';
import { InsightStats } from '@/components/blog/InsightStats';
import { BlogCTA } from '@/components/blog/BlogCTA';
import { Article, BlogSettings } from '@/components/blog/types';
import * as BlogService from '@/services/blog.service';

// Skeleton Card loader
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

  // Find the featured post
  const featuredArticle = useMemo(() => {
    const featured = posts.filter((p) => p.featured);
    if (featured.length === 0) return posts[0] || null;
    return featured.sort((a, b) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99))[0];
  }, [posts]);

  // Derive categories dynamically from posts
  const categories = useMemo(() => {
    const fromPosts = [...new Set(posts.map((p) => p.category))];
    const merged = ['All'];
    FIXED_CATEGORIES.slice(1).forEach((c) => {
      if (fromPosts.includes(c)) merged.push(c);
    });
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

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = seoTitle;
    }
  }, [seoTitle]);

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans relative overflow-x-hidden">
      {/* Subtle Ambient Water Glows matching Design Language */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none">
        <div className="absolute -top-[15%] -left-[10%] w-[65vw] h-[65vw] max-w-[700px] max-h-[700px] bg-gradient-to-br from-teal-500/[0.04] to-transparent rounded-full blur-3xl" />
        <div className="absolute top-[35%] -right-[15%] w-[55vw] h-[55vw] max-w-[650px] max-h-[650px] bg-gradient-to-bl from-cyan-500/[0.03] via-teal-500/[0.02] to-transparent rounded-full blur-3xl" />
        <div className="absolute top-[68%] -left-[12%] w-[60vw] h-[60vw] max-w-[680px] max-h-[680px] bg-gradient-to-tr from-teal-500/[0.03] to-transparent rounded-full blur-3xl" />
      </div>

      <Navbar />

      <main className="flex-1 bg-transparent relative z-10">

        {/* 1. HERO SECTION — Compact Half-Height Hero */}
        <BlogHero settings={settings} postCount={posts.length || 8} />

        {/* 2. Error state */}
        {error && (
          <div className="container mx-auto px-6 md:px-12 max-w-7xl py-8">
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 flex items-center gap-4">
              <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          </div>
        )}

        {/* 3. FEATURED INSIGHT — Transitions into light-blue #edf6f5 background */}
        {!loading && !error && featuredArticle && !isFilteringActive && (
          <FeaturedArticle
            article={featuredArticle}
            settings={settings?.featuredSection}
            onViewDetails={handleArticleClick}
          />
        )}

        {/* 4. Search and Category Filter Section */}
        <section id="blog-grid" className="py-8 sm:py-10 bg-transparent select-none">
          <div className="container mx-auto px-6 md:px-12 max-w-7xl space-y-6">
            <div className="flex flex-col lg:flex-row gap-5 justify-between items-stretch lg:items-center border-b border-border/25 pb-6">

              {/* Category Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                      selectedCategory === category
                        ? 'bg-teal-700 text-white shadow-soft'
                        : 'bg-card border border-border/60 hover:border-teal-500/40 text-muted-foreground hover:text-foreground hover:bg-muted/40 shadow-2xs'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative w-full lg:max-w-xs">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-600 dark:text-teal-400" />
                <input
                  type="text"
                  placeholder="Search insights & articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-card border border-border/60 hover:border-teal-500/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/40 font-medium shadow-2xs"
                />
              </div>

            </div>
          </div>
        </section>

        {/* 5. Articles Grid */}
        <section className="py-4 pb-16 bg-transparent">
          <div className="container mx-auto px-6 md:px-12 max-w-7xl">

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : posts.length === 0 ? (
              <div className="py-20 text-center space-y-4 bg-card border border-border/40 rounded-3xl max-w-lg mx-auto shadow-xs p-8">
                <Compass className="h-12 w-12 text-teal-600/60 mx-auto" />
                <h3 className="text-lg font-bold text-foreground">Insights & Research Coming Soon</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We are currently preparing authentic research publications, water conservation case studies, and field notes. New articles will be posted here as they are released.
                </p>
              </div>
            ) : isFilteringActive ? (
              filteredArticles.length === 0 ? (
                <div className="py-20 text-center space-y-3 bg-card border border-border/40 rounded-3xl max-w-md mx-auto shadow-xs">
                  <Compass className="h-10 w-10 text-teal-600/60 mx-auto" />
                  <h3 className="text-base font-bold text-foreground">No insights found</h3>
                  <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
                    No articles match your current filters. Try a different category or search term.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredArticles.map((article, idx) => {
                    const staggerDelay = idx % 3 === 0 ? "reveal-delay-100" : idx % 3 === 1 ? "reveal-delay-200" : "reveal-delay-300";
                    return (
                      <div key={article._id || article.id || article.slug} className={`reveal-on-scroll ${staggerDelay} h-full`}>
                        <BlogCard article={article} onViewDetails={handleArticleClick} />
                      </div>
                    );
                  })}
                </div>
              )
            ) : (
              <div className="space-y-12">
                {/* First 3 Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredArticles.slice(0, 3).map((article, idx) => {
                    const staggerDelay = idx === 0 ? "reveal-delay-100" : idx === 1 ? "reveal-delay-200" : "reveal-delay-300";
                    return (
                      <div key={article._id || article.id || article.slug} className={`reveal-on-scroll ${staggerDelay} h-full`}>
                        <BlogCard article={article} onViewDetails={handleArticleClick} />
                      </div>
                    );
                  })}
                </div>

                {/* Editorial Stats Strip — Full-Width Dark Section */}
                {filteredArticles.length > 0 && (
                  <div className="-mx-6 md:-mx-12">
                    <div className="relative bg-[#021318] text-white overflow-hidden select-none">
                      {/* Wave transition */}
                      <div className="relative w-full overflow-hidden leading-none pointer-events-none select-none -mb-1">
                        <svg className="w-full h-12 sm:h-20 text-[#021318]" viewBox="0 0 1440 160" fill="none" preserveAspectRatio="none">
                          <path d="M0,80 C240,160 480,20 720,80 C960,140 1200,40 1440,90 L1440,160 L0,160 Z" fill="#0ea5e9" fillOpacity="0.25" />
                          <path d="M0,50 C320,130 560,0 840,65 C1120,130 1320,30 1440,60 L1440,160 L0,160 Z" fill="#14b8a6" fillOpacity="0.4" />
                          <path d="M0,40 C360,110 680,10 1020,70 C1240,105 1380,45 1440,55 L1440,160 L0,160 Z" fill="currentColor" />
                        </svg>
                      </div>
                      <div className="container mx-auto px-6 md:px-12 max-w-7xl pb-12 sm:pb-16">
                        <InsightStats
                          stats={settings?.insightStats}
                          quote={settings?.editorialQuote}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Remaining Cards */}
                {filteredArticles.length > 3 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredArticles.slice(3).map((article, idx) => {
                      const staggerDelay = idx % 3 === 0 ? "reveal-delay-100" : idx % 3 === 1 ? "reveal-delay-200" : "reveal-delay-300";
                      return (
                        <div key={article._id || article.id || article.slug} className={`reveal-on-scroll ${staggerDelay} h-full`}>
                          <BlogCard article={article} onViewDetails={handleArticleClick} />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

          </div>
        </section>

        {/* 6. Closing Editorial CTA */}
        {!loading && <BlogCTA settings={settings} />}

      </main>

      <Footer />
    </div>
  );
};

export default BlogPage;
