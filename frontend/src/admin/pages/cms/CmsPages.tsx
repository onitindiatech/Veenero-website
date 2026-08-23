import React, { useState, useMemo, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Types
import { CmsPage, CmsPageFormValues, PageStatus } from '../../types/cms.types';

// API Service
import { cmsPagesService } from '../../services/cmsPages.service';

// Reusable CMS Components
import { PageStatusBadge } from '../../components/cms/PageStatusBadge';
import { SeoStatusBadge } from '../../components/cms/SeoStatusBadge';
import { PageActionsMenu } from '../../components/cms/PageActionsMenu';
import { DeleteConfirmModal } from '../../components/cms/DeleteConfirmModal';
import { PageEditorDrawer } from '../../components/cms/PageEditorDrawer';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatDate = (iso: string): string => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatRelative = (iso: string): string => {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);

  if (mins < 2) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days}d ago`;
  return formatDate(iso);
};

// ─── Filter Tabs ──────────────────────────────────────────────────────────────

type StatusFilter = 'all' | PageStatus;

const FILTER_TABS: { label: string; value: StatusFilter }[] = [
  { label: 'All Pages', value: 'all' },
  { label: 'Published', value: 'published' },
  { label: 'Draft', value: 'draft' },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export const CmsPages: React.FC = () => {
  // ── State ──
  const [pages, setPages] = useState<CmsPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  // Drawer (add / edit)
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<CmsPage | null>(null);

  // Delete modal
  const [deletingPage, setDeletingPage] = useState<CmsPage | null>(null);

  // ── Derived Stats ──
  const totalPages = pages.length;
  const publishedCount = pages.filter((p) => p.status === 'published').length;
  const draftCount = pages.filter((p) => p.status === 'draft').length;
  const seoIssueCount = pages.filter((p) => p.seoStatus !== 'good').length;

  // ── Fetch Pages from API ──
  const loadPages = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cmsPagesService.fetchPages(searchQuery, statusFilter);
      setPages(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load pages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      loadPages();
    }, 200); // Debounce input updates
    return () => clearTimeout(handler);
  }, [searchQuery, statusFilter]);

  // ── Filtered & Searched Data ──
  const filteredPages = useMemo(() => {
    let result = pages;

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((p) => p.status === statusFilter);
    }

    // Search filter (name, slug, updatedBy)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q) ||
          p.updatedBy.toLowerCase().includes(q)
      );
    }

    return result;
  }, [pages, statusFilter, searchQuery]);

  // ── Action Handlers ──

  const handleOpenAdd = () => {
    setEditingPage(null);
    setDrawerOpen(true);
  };

  const handleOpenEdit = (page: CmsPage) => {
    setEditingPage(page);
    setDrawerOpen(true);
  };

  const handleDrawerSave = async (values: CmsPageFormValues, pageId?: string) => {
    try {
      if (pageId) {
        // Edit existing
        await cmsPagesService.updatePage(pageId, values);
        toast.success('Page Updated', {
          description: `"${values.name}" has been saved successfully.`,
        });
      } else {
        // Add new page
        await cmsPagesService.createPage(values);
        toast.success('Page Created', {
          description: `"${values.name}" has been added to the CMS.`,
        });
      }
      setDrawerOpen(false);
      setEditingPage(null);
      loadPages();
    } catch (err: any) {
      toast.error('Save Failed', {
        description: err.message || 'Could not save the page.',
      });
    }
  };

  const handleDuplicate = async (page: CmsPage) => {
    try {
      const dup = await cmsPagesService.duplicatePage(page);
      toast.success('Page Duplicated', {
        description: `"${dup.name}" has been created as a draft.`,
      });
      loadPages();
    } catch (err: any) {
      toast.error('Duplicate Failed', {
        description: err.message || 'Could not duplicate page.',
      });
    }
  };

  const handlePreview = (page: CmsPage) => {
    toast.info('Preview Mode', {
      description: `Opening preview for "${page.name}" (${page.slug}).`,
    });
  };

  const handleToggleStatus = async (page: CmsPage) => {
    const nextPublish = page.status !== 'published';
    try {
      await cmsPagesService.publishPage(page.id, nextPublish);
      toast.success(nextPublish ? 'Page Published' : 'Page Unpublished', {
        description: `"${page.name}" is now ${nextPublish ? 'published' : 'draft'}.`,
      });
      loadPages();
    } catch (err: any) {
      toast.error('Status Toggle Failed', {
        description: err.message || 'Could not update page status.',
      });
    }
  };

  const handleDeleteRequest = (page: CmsPage) => {
    setDeletingPage(page);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingPage) return;
    try {
      await cmsPagesService.deletePage(deletingPage.id);
      toast.success('Page Deleted', {
        description: `"${deletingPage.name}" has been permanently removed.`,
      });
      setDeletingPage(null);
      loadPages();
    } catch (err: any) {
      toast.error('Delete Failed', {
        description: err.message || 'Could not delete page.',
      });
    }
  };

  // ── Render ──
  return (
    <div className="flex flex-col flex-1 p-6 md:p-8 animate-fade-in min-h-0">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-sans mb-2">
            <span>Admin</span>
            <Icons.ChevronRight className="h-3 w-3" />
            <span>Content Management</span>
            <Icons.ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-bold">Pages</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground font-sans tracking-tight">
            Pages
          </h1>
          <p className="text-sm text-muted-foreground mt-1 font-sans">
            Manage the public website pages, content, and SEO settings.
          </p>
        </div>

        <button
          type="button"
          id="cms-add-new-page-btn"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold rounded-xl shadow-sm transition-all duration-200 font-sans shrink-0"
        >
          <Icons.Plus className="h-4 w-4" />
          Add New Page
        </button>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: 'Total Pages',
            value: totalPages,
            icon: 'FileText',
            color: 'text-sky-600 bg-sky-50 dark:bg-sky-950/30 dark:text-sky-400',
          },
          {
            label: 'Published',
            value: publishedCount,
            icon: 'Globe',
            color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400',
          },
          {
            label: 'Draft',
            value: draftCount,
            icon: 'FileEdit',
            color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400',
          },
          {
            label: 'SEO Issues',
            value: seoIssueCount,
            icon: 'AlertTriangle',
            color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/30 dark:text-rose-400',
          },
        ].map((stat) => {
          const Icon = (Icons as any)[stat.icon];
          return (
            <div
              key={stat.label}
              className="bg-card/60 backdrop-blur-md border border-border/40 rounded-2xl p-4 flex items-center gap-3 shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className={cn('p-2.5 rounded-xl shrink-0', stat.color)}>
                {Icon && <Icon className="h-4.5 w-4.5" />}
              </div>
              <div>
                <p className="text-xl font-bold text-foreground font-sans leading-none">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground font-sans mt-1">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Table Card ── */}
      <div className="bg-card/60 backdrop-blur-md border border-border/40 rounded-2xl shadow-soft flex flex-col flex-1 min-h-0 overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 border-b border-border/30">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
            <input
              id="cms-pages-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pages..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-muted/40 border border-border/50 rounded-xl focus:outline-none focus:border-teal-500/60 focus:ring-1 focus:ring-teal-500/20 font-sans text-foreground placeholder:text-muted-foreground/50 transition-all duration-200"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground"
              >
                <Icons.X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center bg-muted/40 rounded-xl p-1 gap-1 shrink-0">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.value}
                type="button"
                id={`cms-filter-${tab.value}`}
                onClick={() => setStatusFilter(tab.value)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-bold font-sans transition-all duration-200',
                  statusFilter === tab.value
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {tab.label}
                <span
                  className={cn(
                    'ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold',
                    statusFilter === tab.value
                      ? 'bg-teal-600 text-white'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {tab.value === 'all'
                    ? pages.length
                    : tab.value === 'published'
                    ? publishedCount
                    : draftCount}
                </span>
              </button>
            ))}
          </div>

          {/* Result count */}
          {(searchQuery || statusFilter !== 'all') && (
            <p className="text-xs text-muted-foreground font-sans shrink-0">
              {filteredPages.length} result{filteredPages.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full">
            <thead className="bg-muted/30 border-b border-border/30">
              <tr>
                {[
                  { label: 'Page', className: 'min-w-[200px]' },
                  { label: 'Status', className: 'w-[120px]' },
                  { label: 'SEO', className: 'w-[130px]' },
                  { label: 'Sections', className: 'w-[90px] hidden md:table-cell' },
                  { label: 'Last Updated', className: 'w-[160px] hidden lg:table-cell' },
                  { label: 'Updated By', className: 'w-[140px] hidden xl:table-cell' },
                  { label: '', className: 'w-[60px]' },
                ].map((col) => (
                  <th
                    key={col.label}
                    className={cn(
                      'h-10 px-4 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-wider font-sans',
                      col.className
                    )}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Icons.Loader2 className="h-8 w-8 text-teal-600 animate-spin" />
                      <p className="text-sm font-semibold text-muted-foreground font-sans animate-pulse">
                        Loading CMS pages...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Icons.AlertOctagon className="h-8 w-8 text-rose-500" />
                      <p className="text-sm font-semibold text-rose-500 font-sans">
                        {error}
                      </p>
                      <button
                        type="button"
                        onClick={loadPages}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-lg hover:bg-rose-100 transition-all font-sans"
                      >
                        <Icons.RefreshCw className="h-3 w-3" />
                        Try again
                      </button>
                    </div>
                  </td>
                </tr>
              ) : filteredPages.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 rounded-full bg-muted/40 text-muted-foreground/40">
                        <Icons.FileSearch className="h-8 w-8" />
                      </div>
                      <p className="text-sm font-semibold text-muted-foreground font-sans">
                        {searchQuery ? `No pages match "${searchQuery}"` : 'No pages found'}
                      </p>
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery('')}
                          className="text-xs font-bold text-teal-600 hover:text-teal-700 font-sans"
                        >
                          Clear search
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPages.map((page, idx) => (
                  <tr
                    key={page.id}
                    className={cn(
                      'border-b border-border/20 last:border-0 hover:bg-muted/15 transition-colors duration-150 group',
                      idx % 2 === 0 ? 'bg-transparent' : 'bg-muted/5'
                    )}
                  >
                    {/* Page Name + Slug */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        {/* Page icon */}
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-teal-500/20 to-cyan-500/10 border border-teal-500/20 flex items-center justify-center shrink-0">
                          <Icons.FileText className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-foreground font-sans truncate">
                              {page.name}
                            </span>
                            {page.isCoreSystemPage && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold font-sans bg-sky-50 text-sky-600 dark:bg-sky-950/30 dark:text-sky-400 shrink-0">
                                <Icons.Lock className="h-2.5 w-2.5" />
                                CORE
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] font-mono text-muted-foreground mt-0.5 truncate">
                            {page.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <PageStatusBadge status={page.status} />
                    </td>

                    {/* SEO */}
                    <td className="px-4 py-3.5">
                      <SeoStatusBadge status={page.seoStatus} />
                    </td>

                    {/* Sections Count */}
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground font-sans">
                        <Icons.Layers className="h-3.5 w-3.5" />
                        {page.sections.length}
                        <span className="text-[10px]">
                          ({page.sections.filter((s) => s.visible).length} visible)
                        </span>
                      </div>
                    </td>

                    {/* Last Updated */}
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <div>
                        <p className="text-xs font-semibold text-foreground font-sans">
                          {formatDate(page.lastUpdated)}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-sans mt-0.5">
                          {formatRelative(page.lastUpdated)}
                        </p>
                      </div>
                    </td>

                    {/* Updated By */}
                    <td className="px-4 py-3.5 hidden xl:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-teal-600 to-cyan-600 text-white flex items-center justify-center text-[9px] font-bold shrink-0">
                          {page.updatedBy
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()
                            .slice(0, 2)}
                        </div>
                        <span className="text-xs font-medium text-muted-foreground font-sans truncate">
                          {page.updatedBy}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5">
                      <div className="flex justify-end">
                        <PageActionsMenu
                          page={page}
                          onEdit={handleOpenEdit}
                          onDuplicate={handleDuplicate}
                          onPreview={handlePreview}
                          onToggleStatus={handleToggleStatus}
                          onDelete={handleDeleteRequest}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        {filteredPages.length > 0 && (
          <div className="px-5 py-3 border-t border-border/30 flex items-center justify-between">
            <p className="text-xs text-muted-foreground font-sans">
              Showing{' '}
              <span className="font-bold text-foreground">{filteredPages.length}</span>{' '}
              of <span className="font-bold text-foreground">{totalPages}</span> pages
            </p>
            <div className="flex items-center gap-1.5 text-xs font-sans text-muted-foreground">
              <Icons.Info className="h-3 w-3" />
              <span>Last sync: just now</span>
            </div>
          </div>
        )}
      </div>

      {/* ── Editor Drawer ── */}
      <PageEditorDrawer
        page={editingPage}
        isOpen={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setEditingPage(null);
        }}
        onSave={handleDrawerSave}
      />

      {/* ── Delete Confirm Modal ── */}
      <DeleteConfirmModal
        page={deletingPage}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingPage(null)}
      />
    </div>
  );
};

export default CmsPages;
