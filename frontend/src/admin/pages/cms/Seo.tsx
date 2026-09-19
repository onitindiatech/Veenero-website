import React, { useState, useEffect } from 'react';
import {
  Globe,
  Save,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  SeoPageItem,
  getAllPagesSeo,
  updatePageSeo,
} from '@/services/seo.service';

const Toast = ({
  message,
  type,
  onClose,
}: {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}) => (
  <div
    className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border text-sm font-semibold max-w-sm animate-in slide-in-from-bottom-5 ${
      type === 'success'
        ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-300'
        : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-300'
    }`}
  >
    {type === 'success' ? (
      <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
    ) : (
      <XCircle className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
    )}
    <span className="flex-1">{message}</span>
    <button onClick={onClose} className="hover:opacity-70 text-xs font-bold px-1">
      ✕
    </button>
  </div>
);

const labelCls = 'block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5';
const inputCls =
  'w-full px-3.5 py-2.5 text-xs bg-background border border-border/70 rounded-xl focus:outline-none focus:border-teal-500 font-medium text-foreground transition-all duration-200';
const textareaCls =
  'w-full px-3.5 py-2.5 text-xs bg-background border border-border/70 rounded-xl focus:outline-none focus:border-teal-500 font-medium text-foreground transition-all duration-200 resize-y';

export const SeoCms: React.FC = () => {
  const [pages, setPages] = useState<SeoPageItem[]>([]);
  const [selectedKey, setSelectedKey] = useState<string>('home');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadSeoData = async () => {
    try {
      setLoading(true);
      const data = await getAllPagesSeo();
      setPages(data);
      if (data.length > 0 && !selectedKey) {
        setSelectedKey(data[0].pageKey);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to load SEO catalog', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSeoData();
  }, []);

  const activePage = pages.find((p) => p.pageKey === selectedKey) || pages[0];

  const handleUpdateActive = (patch: Partial<SeoPageItem>) => {
    if (!activePage) return;
    setPages((prev) =>
      prev.map((p) => (p.pageKey === activePage.pageKey ? { ...p, ...patch } : p))
    );
  };

  const handleSaveActive = async () => {
    if (!activePage) return;
    try {
      setSaving(true);
      await updatePageSeo(activePage.pageKey, activePage);
      showToast(`SEO settings for "${activePage.pageName}" updated!`);
    } catch (err: any) {
      showToast(err.message || 'Failed to save SEO', 'error');
    } finally {
      setSaving(false);
    }
  };

  const filteredPages = pages.filter(
    (p) =>
      p.pageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.route.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
          <p className="text-xs font-medium text-muted-foreground">Analyzing site SEO catalog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto font-sans space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-700 dark:text-teal-300 text-xs font-mono font-bold mb-2">
            <Globe className="w-3.5 h-3.5" />
            <span>METADATA &amp; SEARCH ENGINE OPTIMIZATION</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">SEO &amp; Social Meta Tags</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Centrally audit and configure title tags, meta descriptions, open graph social previews, and index status across all pages.
          </p>
        </div>

        <Button
          type="button"
          onClick={handleSaveActive}
          disabled={saving || !activePage}
          className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs h-9 px-4"
        >
          <Save className="w-4 h-4 mr-1.5" />
          {saving ? 'Saving...' : `Save "${activePage?.pageName || 'Page'}" SEO`}
        </Button>
      </div>

      {/* Two-Column Editor Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Page Navigator */}
        <div className="lg:col-span-4 space-y-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search pages or routes..."
              className={`${inputCls} pl-8.5`}
            />
          </div>

          <div className="bg-card rounded-2xl border border-border/70 divide-y divide-border/40 overflow-hidden max-h-[640px] overflow-y-auto">
            {filteredPages.map((p) => {
              const isSelected = p.pageKey === activePage?.pageKey;
              return (
                <button
                  key={p.pageKey}
                  type="button"
                  onClick={() => setSelectedKey(p.pageKey)}
                  className={`w-full text-left p-3.5 transition-colors flex items-start justify-between gap-2 ${
                    isSelected
                      ? 'bg-teal-500/10 text-teal-900 dark:text-teal-200 border-l-4 border-l-teal-600'
                      : 'hover:bg-muted/40 text-foreground'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold truncate">{p.pageName}</p>
                    <p className="text-[11px] font-mono text-muted-foreground truncate">{p.route}</p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      p.status === 'OPTIMIZED'
                        ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                    }`}
                  >
                    {p.status === 'OPTIMIZED' ? 'OPTIMIZED' : 'NEEDS WORK'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Active Page SEO Settings Form */}
        <div className="lg:col-span-8 space-y-6">
          {activePage ? (
            <>
              {/* Google Search Engine Preview Card */}
              <div className="p-5 rounded-2xl border border-border/70 bg-card shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
                  <span className="flex items-center gap-1.5 font-mono">
                    <Globe className="w-3.5 h-3.5 text-teal-600" /> SERP Live Preview
                  </span>
                  <a
                    href={activePage.route}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-teal-600 hover:underline"
                  >
                    Visit Page <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="p-4 rounded-xl border border-border/60 bg-muted/20 font-sans space-y-1">
                  <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <span>https://veenero.com{activePage.route}</span>
                  </div>
                  <h3 className="text-base font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer line-clamp-1">
                    {activePage.metaTitle || 'Page Title Not Set'}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {activePage.metaDescription ||
                      'No meta description provided yet. Search engines will generate a fallback snippet.'}
                  </p>
                </div>
              </div>

              {/* Form Controls */}
              <div className="p-6 rounded-2xl border border-border/70 bg-card shadow-xs space-y-5">
                {/* Meta Title */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className={labelCls}>Meta Title</label>
                    <span
                      className={`text-[11px] font-mono font-bold ${
                        (activePage.metaTitle || '').length > 60
                          ? 'text-amber-500'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {(activePage.metaTitle || '').length}/60 chars (Recommended: 50-60)
                    </span>
                  </div>
                  <input
                    type="text"
                    value={activePage.metaTitle || ''}
                    onChange={(e) => handleUpdateActive({ metaTitle: e.target.value })}
                    placeholder="e.g. Smart Water Metering & Telemetry | Veenero"
                    className={inputCls}
                  />
                </div>

                {/* Meta Description */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className={labelCls}>Meta Description</label>
                    <span
                      className={`text-[11px] font-mono font-bold ${
                        (activePage.metaDescription || '').length > 160
                          ? 'text-amber-500'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {(activePage.metaDescription || '').length}/160 chars (Recommended: 120-160)
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={activePage.metaDescription || ''}
                    onChange={(e) => handleUpdateActive({ metaDescription: e.target.value })}
                    placeholder="Enter a compelling snippet describing the page..."
                    className={textareaCls}
                  />
                </div>

                {/* OpenGraph Title & Image */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border/50">
                  <div>
                    <label className={labelCls}>OG Social Title</label>
                    <input
                      type="text"
                      value={activePage.ogTitle || ''}
                      onChange={(e) => handleUpdateActive({ ogTitle: e.target.value })}
                      placeholder="Title for LinkedIn, Twitter, Slack cards"
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className={labelCls}>OG Social Image URL</label>
                    <input
                      type="text"
                      value={activePage.ogImage || ''}
                      onChange={(e) => handleUpdateActive({ ogImage: e.target.value })}
                      placeholder="https://res.cloudinary.com/..."
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* Canonical URL & Indexing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border/50">
                  <div>
                    <label className={labelCls}>Canonical URL (Optional)</label>
                    <input
                      type="text"
                      value={activePage.canonicalUrl || ''}
                      onChange={(e) => handleUpdateActive({ canonicalUrl: e.target.value })}
                      placeholder={`https://veenero.com${activePage.route}`}
                      className={inputCls}
                    />
                  </div>

                  <div className="flex flex-col justify-end">
                    <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer pb-2">
                      <input
                        type="checkbox"
                        checked={Boolean(activePage.noIndex)}
                        onChange={(e) => handleUpdateActive({ noIndex: e.target.checked })}
                        className="rounded border-border text-teal-600 focus:ring-teal-500"
                      />
                      <span>Prevent search indexing (noindex, nofollow)</span>
                    </label>
                    <p className="text-[11px] text-muted-foreground">
                      Enable only for staging or internal unlisted landing pages.
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-muted-foreground text-xs">
              Select a page from the list to view and configure its SEO settings.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeoCms;
