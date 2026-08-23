import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus, Settings, Trash2, Eye, Edit2, Copy, Star, StarOff,
  CheckCircle, Archive, XCircle, RotateCcw, AlertTriangle, Search,
  Filter, ChevronDown, ChevronUp, FileText, RefreshCw, ExternalLink,
} from 'lucide-react';
import { Article, BlogStats, BlogPostFormData } from '@/components/blog/types';
import * as BlogService from '@/services/blog.service';

// ─── Types ────────────────────────────────────────────────────────────────────
type ViewMode = 'list' | 'recycle-bin';
type SortDir = 'asc' | 'desc';

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }: { status?: string }) => {
  const map: Record<string, string> = {
    PUBLISHED: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800',
    DRAFT: 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/20 dark:text-yellow-400 dark:border-yellow-800',
    ARCHIVED: 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800/30 dark:text-gray-400 dark:border-gray-700',
  };
  const label: Record<string, string> = { PUBLISHED: 'Published', DRAFT: 'Draft', ARCHIVED: 'Archived' };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${map[status || 'DRAFT'] || map.DRAFT}`}>
      {label[status || 'DRAFT'] || status}
    </span>
  );
};

// ─── Toast ────────────────────────────────────────────────────────────────────
const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => (
  <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border text-sm font-semibold max-w-xs animate-slide-up ${
    type === 'success'
      ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-300'
      : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-300'
  }`}>
    {type === 'success' ? <CheckCircle className="h-4 w-4 shrink-0" /> : <XCircle className="h-4 w-4 shrink-0" />}
    <span className="flex-1">{message}</span>
    <button onClick={onClose} className="text-muted-foreground hover:text-foreground">✕</button>
  </div>
);

// ─── Confirm Modal ─────────────────────────────────────────────────────────────
const ConfirmModal = ({
  title, message, confirmLabel = 'Confirm', danger = false,
  onConfirm, onCancel,
}: {
  title: string; message: string; confirmLabel?: string; danger?: boolean;
  onConfirm: () => void; onCancel: () => void;
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
    <div className="bg-card border border-border/60 rounded-2xl shadow-2xl p-6 max-w-sm w-full space-y-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className={`h-5 w-5 mt-0.5 shrink-0 ${danger ? 'text-red-500' : 'text-yellow-500'}`} />
        <div className="space-y-1">
          <h3 className="font-bold text-foreground text-sm">{title}</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">{message}</p>
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        <button onClick={onCancel} className="px-4 py-2 text-xs font-bold text-muted-foreground border border-border/60 rounded-xl hover:bg-muted/40 transition-colors">
          Cancel
        </button>
        <button onClick={onConfirm} className={`px-4 py-2 text-xs font-bold text-white rounded-xl transition-colors ${danger ? 'bg-red-600 hover:bg-red-700' : 'bg-teal-700 hover:bg-teal-800'}`}>
          {confirmLabel}
        </button>
      </div>
    </div>
  </div>
);

// ─── Post Drawer ───────────────────────────────────────────────────────────────
const PostDrawer = ({
  post, onClose, onSave,
}: {
  post: Article | null;
  onClose: () => void;
  onSave: (data: Partial<BlogPostFormData>) => Promise<void>;
}) => {
  const isEdit = !!post?._id;

  const [form, setForm] = useState<BlogPostFormData>({
    title: post?.title || '',
    slug: post?.slug || '',
    category: post?.category || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    featuredImage: post?.featuredImage || '',
    featuredImageAlt: post?.featuredImageAlt || '',
    author: post?.author || '',
    readingTime: post?.readingTime || '',
    status: (post?.status as BlogPostFormData['status']) || 'DRAFT',
    featured: post?.featured || false,
    sortOrder: post?.sortOrder || 0,
    seo: {
      metaTitle: post?.seo?.metaTitle || '',
      metaDescription: post?.seo?.metaDescription || '',
      ogImage: post?.seo?.ogImage || '',
      noIndex: post?.seo?.noIndex || false,
    },
  });
  const [saving, setSaving] = useState(false);
  const [seoExpanded, setSeoExpanded] = useState(false);

  // Auto-generate slug from title (only when creating new post)
  useEffect(() => {
    if (!isEdit && form.title) {
      setForm((f) => ({
        ...f,
        slug: form.title
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-'),
      }));
    }
  }, [form.title, isEdit]);

  const set = (field: keyof BlogPostFormData, value: unknown) =>
    setForm((f) => ({ ...f, [field]: value }));

  const setSeo = (field: string, value: unknown) =>
    setForm((f) => ({ ...f, seo: { ...f.seo, [field]: value } }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  };

  const inputCls = 'w-full px-3 py-2.5 text-xs bg-background border border-border/60 rounded-xl focus:outline-none focus:border-teal-500/60 font-medium text-foreground';
  const labelCls = 'block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5';

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border-l border-border/40 w-full max-w-2xl h-full overflow-y-auto shadow-2xl flex flex-col">

        {/* Drawer Header */}
        <div className="sticky top-0 bg-card border-b border-border/40 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="font-bold text-foreground text-base">{isEdit ? 'Edit Post' : 'New Blog Post'}</h2>
            <p className="text-[11px] text-muted-foreground mt-0.5">{isEdit ? `Editing: ${post?.title}` : 'Create a new article'}</p>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-xl bg-muted/40 hover:bg-muted/70 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors text-sm font-bold">
            ✕
          </button>
        </div>

        {/* Drawer Form */}
        <form onSubmit={handleSubmit} className="flex-1 p-6 space-y-5">

          {/* Title */}
          <div>
            <label className={labelCls}>Title *</label>
            <input required value={form.title} onChange={(e) => set('title', e.target.value)} className={inputCls} placeholder="Enter article title..." maxLength={200} />
            <p className="text-[10px] text-muted-foreground mt-1 text-right">{form.title.length}/200</p>
          </div>

          {/* Slug */}
          <div>
            <label className={labelCls}>URL Slug</label>
            <input value={form.slug} onChange={(e) => set('slug', e.target.value)} className={inputCls} placeholder="auto-generated-from-title" />
          </div>

          {/* Category + Author row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Category *</label>
              <input required value={form.category} onChange={(e) => set('category', e.target.value)} className={inputCls} placeholder="e.g. Technology" />
            </div>
            <div>
              <label className={labelCls}>Author *</label>
              <input required value={form.author} onChange={(e) => set('author', e.target.value)} className={inputCls} placeholder="Author name" />
            </div>
          </div>

          {/* Status + Reading Time + Sort Order */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Status</label>
              <select value={form.status} onChange={(e) => set('status', e.target.value)} className={inputCls}>
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Reading Time</label>
              <input value={form.readingTime} onChange={(e) => set('readingTime', e.target.value)} className={inputCls} placeholder="e.g. 5 min read" />
            </div>
            <div>
              <label className={labelCls}>Sort Order</label>
              <input type="number" value={form.sortOrder} onChange={(e) => set('sortOrder', parseInt(e.target.value) || 0)} className={inputCls} />
            </div>
          </div>

          {/* Featured Toggle */}
          <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-xl border border-border/40">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => set('featured', e.target.checked)}
                className="h-4 w-4 accent-teal-600 rounded"
              />
              <span className="text-xs font-bold text-foreground">Mark as Featured</span>
            </label>
            <span className="text-[10px] text-muted-foreground">Featured posts appear as the cover story on the blog landing page.</span>
          </div>

          {/* Excerpt */}
          <div>
            <label className={labelCls}>Excerpt *</label>
            <textarea
              required
              value={form.excerpt}
              onChange={(e) => set('excerpt', e.target.value)}
              className={`${inputCls} resize-none`}
              rows={2}
              maxLength={400}
              placeholder="Short summary displayed in blog cards..."
            />
            <p className="text-[10px] text-muted-foreground mt-1 text-right">{form.excerpt.length}/400</p>
          </div>

          {/* Featured Image */}
          <div>
            <label className={labelCls}>Featured Image URL</label>
            <input value={form.featuredImage} onChange={(e) => set('featuredImage', e.target.value)} className={inputCls} placeholder="https://..." />
            {form.featuredImage && (
              <div className="mt-2 h-32 rounded-xl overflow-hidden border border-border/40">
                <img src={form.featuredImage} alt="preview" className="w-full h-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
              </div>
            )}
          </div>

          {/* Image Alt */}
          <div>
            <label className={labelCls}>Image Alt Text</label>
            <input value={form.featuredImageAlt} onChange={(e) => set('featuredImageAlt', e.target.value)} className={inputCls} placeholder="Describe the image for accessibility..." />
          </div>

          {/* Content Editor */}
          <div>
            <label className={labelCls}>Content *</label>
            <p className="text-[10px] text-muted-foreground mb-2">Supports Markdown: ## H2, ### H3, - bullet, 1. numbered, paragraphs.</p>
            <textarea
              required
              value={form.content}
              onChange={(e) => set('content', e.target.value)}
              className={`${inputCls} resize-y font-mono`}
              rows={14}
              placeholder="Write your article content here..."
            />
            <p className="text-[10px] text-muted-foreground mt-1 text-right">{form.content.length} characters</p>
          </div>

          {/* SEO Section (collapsible) */}
          <div className="border border-border/40 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setSeoExpanded(!seoExpanded)}
              className="w-full flex items-center justify-between px-4 py-3 bg-muted/20 hover:bg-muted/40 transition-colors"
            >
              <span className="text-xs font-bold text-foreground">SEO Settings</span>
              {seoExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
            </button>
            {seoExpanded && (
              <div className="p-4 space-y-4">
                <div>
                  <label className={labelCls}>Meta Title</label>
                  <input value={form.seo.metaTitle} onChange={(e) => setSeo('metaTitle', e.target.value)} className={inputCls} placeholder="SEO title (50-60 chars recommended)" maxLength={80} />
                  <p className="text-[10px] text-muted-foreground mt-1 text-right">{form.seo.metaTitle.length}/80</p>
                </div>
                <div>
                  <label className={labelCls}>Meta Description</label>
                  <textarea value={form.seo.metaDescription} onChange={(e) => setSeo('metaDescription', e.target.value)} className={`${inputCls} resize-none`} rows={2} placeholder="SEO description (150-160 chars recommended)" maxLength={200} />
                  <p className="text-[10px] text-muted-foreground mt-1 text-right">{form.seo.metaDescription.length}/200</p>
                </div>
                <div>
                  <label className={labelCls}>OG Image URL</label>
                  <input value={form.seo.ogImage} onChange={(e) => setSeo('ogImage', e.target.value)} className={inputCls} placeholder="https://..." />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.seo.noIndex} onChange={(e) => setSeo('noIndex', e.target.checked)} className="h-4 w-4 accent-teal-600 rounded" />
                  <span className="text-xs text-foreground">No Index (exclude from search engines)</span>
                </label>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2 sticky bottom-0 bg-card pb-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 text-xs font-bold border border-border/60 text-muted-foreground rounded-xl hover:bg-muted/40 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white rounded-xl shadow-sm transition-colors disabled:opacity-60">
              {saving ? 'Saving...' : isEdit ? 'Update Post' : 'Create Post'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
const Blog: React.FC = () => {
  const [posts, setPosts] = useState<Article[]>([]);
  const [stats, setStats] = useState<BlogStats>({ total: 0, published: 0, drafts: 0, archived: 0, featured: 0 });
  const [recycleBin, setRecycleBin] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortField, setSortField] = useState<'updatedAt' | 'title' | 'publishedAt'>('updatedAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [drawerPost, setDrawerPost] = useState<Article | null | undefined>(undefined); // undefined = closed, null = new
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [confirm, setConfirm] = useState<{ title: string; message: string; danger?: boolean; action: () => void } | null>(null);

  // ─── Toast helper ────────────────────────────────────────────────────────────
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // ─── Fetch posts ─────────────────────────────────────────────────────────────
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const { posts: p, stats: s } = await BlogService.getAdminPosts();
      setPosts(p);
      setStats(s);
    } catch {
      showToast('Failed to load blog posts.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRecycleBin = useCallback(async () => {
    try {
      const data = await BlogService.getRecycleBin();
      setRecycleBin(data);
    } catch {
      showToast('Failed to load recycle bin.', 'error');
    }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  // ─── Filtered + sorted posts ──────────────────────────────────────────────────
  const filteredPosts = useMemo(() => {
    let list = [...posts];
    if (statusFilter !== 'ALL') list = list.filter((p) => p.status === statusFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.author.toLowerCase().includes(q));
    }
    list.sort((a, b) => {
      const aVal = a[sortField as keyof Article] as string || '';
      const bVal = b[sortField as keyof Article] as string || '';
      return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
    return list;
  }, [posts, statusFilter, searchQuery, sortField, sortDir]);

  // ─── Save handler ─────────────────────────────────────────────────────────────
  const handleSave = async (data: Partial<BlogPostFormData>) => {
    try {
      if (drawerPost?._id) {
        await BlogService.updatePost(drawerPost._id, data);
        showToast('Post updated successfully.');
      } else {
        await BlogService.createPost(data);
        showToast('Post created successfully.');
      }
      setDrawerPost(undefined);
      fetchPosts();
    } catch (err) {
      showToast((err as Error).message || 'Failed to save post.', 'error');
      throw err;
    }
  };

  // ─── Action handlers ─────────────────────────────────────────────────────────
  const handleStatusChange = async (post: Article, status: string) => {
    try {
      await BlogService.updatePostStatus(post._id!, status);
      showToast(`Post ${status === 'PUBLISHED' ? 'published' : status === 'DRAFT' ? 'unpublished' : 'archived'}.`);
      fetchPosts();
    } catch {
      showToast('Failed to update status.', 'error');
    }
  };

  const handleToggleFeatured = async (post: Article) => {
    try {
      await BlogService.toggleFeatured(post._id!, !post.featured);
      showToast(post.featured ? 'Removed from featured.' : 'Marked as featured.');
      fetchPosts();
    } catch {
      showToast('Failed to update featured status.', 'error');
    }
  };

  const handleDuplicate = async (post: Article) => {
    try {
      await BlogService.duplicatePost(post._id!);
      showToast('Post duplicated as Draft.');
      fetchPosts();
    } catch {
      showToast('Failed to duplicate post.', 'error');
    }
  };

  const handleSoftDelete = (post: Article) => {
    setConfirm({
      title: 'Move to Recycle Bin',
      message: `"${post.title}" will be moved to the Recycle Bin and will disappear from the public blog.`,
      action: async () => {
        setConfirm(null);
        try {
          await BlogService.softDeletePost(post._id!);
          showToast('Post moved to Recycle Bin.');
          fetchPosts();
        } catch {
          showToast('Failed to delete post.', 'error');
        }
      },
    });
  };

  const handleRestore = async (post: Article) => {
    try {
      await BlogService.restorePost(post._id!);
      showToast('Post restored successfully.');
      fetchRecycleBin();
      fetchPosts();
    } catch {
      showToast('Failed to restore post.', 'error');
    }
  };

  const handlePermanentDelete = (post: Article) => {
    setConfirm({
      title: 'Permanently Delete',
      message: `"${post.title}" will be permanently deleted from MongoDB. This action cannot be undone.`,
      danger: true,
      action: async () => {
        setConfirm(null);
        try {
          await BlogService.permanentlyDeletePost(post._id!);
          showToast('Post permanently deleted.');
          fetchRecycleBin();
        } catch (err) {
          showToast((err as Error).message || 'Failed to delete permanently.', 'error');
        }
      },
    });
  };

  // ─── Render helpers ────────────────────────────────────────────────────────────
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const statCards = [
    { label: 'Total Posts', value: stats.total, color: 'text-foreground' },
    { label: 'Published', value: stats.published, color: 'text-emerald-600' },
    { label: 'Drafts', value: stats.drafts, color: 'text-yellow-600' },
    { label: 'Archived', value: stats.archived, color: 'text-gray-500' },
    { label: 'Featured', value: stats.featured, color: 'text-teal-600' },
  ];

  return (
    <div className="p-6 space-y-6 font-sans">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Blog & Insights</h1>
          <p className="text-xs text-muted-foreground mt-1">Manage editorial content, featured stories and blog page settings.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            to="/admin/blog/settings"
            className="px-3 py-2 text-xs font-bold border border-border/60 text-muted-foreground rounded-xl hover:bg-muted/40 flex items-center gap-1.5 transition-colors"
          >
            <Settings className="h-3.5 w-3.5" />
            Blog Settings
          </Link>
          <button
            onClick={() => { setViewMode(viewMode === 'list' ? 'recycle-bin' : 'list'); if (viewMode === 'list') fetchRecycleBin(); }}
            className="px-3 py-2 text-xs font-bold border border-border/60 text-muted-foreground rounded-xl hover:bg-muted/40 flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            {viewMode === 'list' ? 'Recycle Bin' : 'Back to List'}
          </button>
          <button
            onClick={() => setDrawerPost(null)}
            className="px-4 py-2 text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            New Blog Post
          </button>
        </div>
      </div>

      {/* ── Stats Cards ─────────────────────────────────────────────────────── */}
      {viewMode === 'list' && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {statCards.map(({ label, value, color }) => (
            <div key={label} className="bg-card border border-border/40 rounded-2xl p-4 text-center">
              <div className={`text-2xl font-extrabold ${color}`}>{loading ? '—' : value}</div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1">{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── Filters Row (list view only) ─────────────────────────────────── */}
      {viewMode === 'list' && (
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-card border border-border/60 rounded-xl focus:outline-none focus:border-teal-500/60 font-medium"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            {['ALL', 'PUBLISHED', 'DRAFT', 'ARCHIVED'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 text-[11px] font-bold rounded-xl transition-colors ${statusFilter === s ? 'bg-teal-700 text-white' : 'bg-card border border-border/60 text-muted-foreground hover:bg-muted/40'}`}
              >
                {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
              </button>
            ))}
            <button onClick={fetchPosts} className="p-2 border border-border/60 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors">
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ── Posts Table ────────────────────────────────────────────────────── */}
      {viewMode === 'list' && (
        <div className="bg-card border border-border/40 rounded-2xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-12 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin" />
              Loading posts...
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <FileText className="h-8 w-8 text-muted-foreground/50 mx-auto" />
              <p className="text-sm font-bold text-foreground">No posts found</p>
              <p className="text-xs text-muted-foreground">Try adjusting your filters or create a new post.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-border/40 bg-muted/20">
                    <th className="text-left px-4 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider w-16">Thumb</th>
                    <th
                      className="text-left px-4 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground"
                      onClick={() => { setSortField('title'); setSortDir(sortDir === 'asc' ? 'desc' : 'asc'); }}
                    >
                      Title {sortField === 'title' && (sortDir === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="text-left px-4 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Category</th>
                    <th className="text-left px-4 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="text-left px-4 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Featured</th>
                    <th className="text-left px-4 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Author</th>
                    <th
                      className="text-left px-4 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground"
                      onClick={() => { setSortField('publishedAt'); setSortDir(sortDir === 'asc' ? 'desc' : 'asc'); }}
                    >
                      Published {sortField === 'publishedAt' && (sortDir === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="text-right px-4 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.map((post) => (
                    <tr key={post._id} className="border-b border-border/20 hover:bg-muted/10 transition-colors">
                      <td className="px-4 py-3">
                        <div className="w-12 h-9 rounded-lg overflow-hidden bg-muted/30">
                          {(post.featuredImage || post.image) && (
                            <img src={post.featuredImage || post.image} alt="" className="w-full h-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 max-w-[240px]">
                        <p className="text-xs font-bold text-foreground truncate">{post.title}</p>
                        <p className="text-[10px] text-muted-foreground truncate">/blog/{post.slug}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-muted-foreground">{post.category}</span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={post.status} />
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleToggleFeatured(post)} title={post.featured ? 'Unfeature' : 'Feature'}>
                          {post.featured
                            ? <Star className="h-4 w-4 text-yellow-500 fill-yellow-400" />
                            : <StarOff className="h-4 w-4 text-muted-foreground/50 hover:text-yellow-400 transition-colors" />}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-muted-foreground">{post.author}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-muted-foreground">{formatDate(post.publishedAt)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 justify-end">
                          <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" title="Preview" className="p-1.5 rounded-lg hover:bg-muted/40 text-muted-foreground hover:text-foreground transition-colors">
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                          <button onClick={() => setDrawerPost(post)} title="Edit" className="p-1.5 rounded-lg hover:bg-muted/40 text-muted-foreground hover:text-foreground transition-colors">
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => handleDuplicate(post)} title="Duplicate" className="p-1.5 rounded-lg hover:bg-muted/40 text-muted-foreground hover:text-foreground transition-colors">
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                          {post.status !== 'PUBLISHED' ? (
                            <button onClick={() => handleStatusChange(post, 'PUBLISHED')} title="Publish" className="p-1.5 rounded-lg hover:bg-muted/40 text-muted-foreground hover:text-emerald-600 transition-colors">
                              <CheckCircle className="h-3.5 w-3.5" />
                            </button>
                          ) : (
                            <button onClick={() => handleStatusChange(post, 'DRAFT')} title="Unpublish" className="p-1.5 rounded-lg hover:bg-muted/40 text-muted-foreground hover:text-yellow-600 transition-colors">
                              <XCircle className="h-3.5 w-3.5" />
                            </button>
                          )}
                          {post.status !== 'ARCHIVED' && (
                            <button onClick={() => handleStatusChange(post, 'ARCHIVED')} title="Archive" className="p-1.5 rounded-lg hover:bg-muted/40 text-muted-foreground hover:text-gray-600 transition-colors">
                              <Archive className="h-3.5 w-3.5" />
                            </button>
                          )}
                          <button onClick={() => handleSoftDelete(post)} title="Move to Recycle Bin" className="p-1.5 rounded-lg hover:bg-muted/40 text-muted-foreground hover:text-red-500 transition-colors">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── Recycle Bin ────────────────────────────────────────────────────── */}
      {viewMode === 'recycle-bin' && (
        <div className="bg-card border border-border/40 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-border/40 bg-red-50/40 dark:bg-red-950/10 flex items-center gap-2">
            <Trash2 className="h-4 w-4 text-red-500" />
            <h2 className="font-bold text-sm text-foreground">Recycle Bin</h2>
            <span className="text-xs text-muted-foreground">— Posts here do not appear on the public blog.</span>
          </div>
          {recycleBin.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-sm text-muted-foreground">The Recycle Bin is empty.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-border/40 bg-muted/20">
                    <th className="text-left px-4 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Title</th>
                    <th className="text-left px-4 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Category</th>
                    <th className="text-left px-4 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Deleted</th>
                    <th className="text-right px-4 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recycleBin.map((post) => (
                    <tr key={post._id} className="border-b border-border/20 hover:bg-muted/10 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-xs font-bold text-foreground">{post.title}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-muted-foreground">{post.category}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-muted-foreground">{formatDate(post.deletedAt as unknown as string)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 justify-end">
                          <button onClick={() => handleRestore(post)} className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold border border-teal-600/30 text-teal-700 dark:text-teal-400 rounded-xl hover:bg-teal-50 dark:hover:bg-teal-950/30 transition-colors">
                            <RotateCcw className="h-3 w-3" />
                            Restore
                          </button>
                          <button onClick={() => handlePermanentDelete(post)} className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                            <Trash2 className="h-3 w-3" />
                            Delete Forever
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── Drawer ─────────────────────────────────────────────────────────── */}
      {drawerPost !== undefined && (
        <PostDrawer
          post={drawerPost}
          onClose={() => setDrawerPost(undefined)}
          onSave={handleSave}
        />
      )}

      {/* ── Confirm Modal ───────────────────────────────────────────────────── */}
      {confirm && (
        <ConfirmModal
          title={confirm.title}
          message={confirm.message}
          danger={confirm.danger}
          confirmLabel={confirm.danger ? 'Delete Forever' : 'Confirm'}
          onConfirm={confirm.action}
          onCancel={() => setConfirm(null)}
        />
      )}

      {/* ── Toast ───────────────────────────────────────────────────────────── */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

    </div>
  );
};

export default Blog;
