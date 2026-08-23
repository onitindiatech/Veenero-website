import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';
import { CmsPage, CmsPageFormValues, PageStatus } from '../../types/cms.types';

interface PageEditorDrawerProps {
  /** null = Add New Page, CmsPage = Edit existing */
  page: CmsPage | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: CmsPageFormValues, pageId?: string) => void;
}

const DEFAULT_FORM: CmsPageFormValues = {
  name: '',
  slug: '',
  status: 'draft',
  featuredImage: '',
  seoMetaTitle: '',
  seoMetaDescription: '',
};

// Derive a slug from page name
const slugify = (name: string) =>
  `/${name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')}`;

export const PageEditorDrawer: React.FC<PageEditorDrawerProps> = ({
  page,
  isOpen,
  onClose,
  onSave,
}) => {
  const [form, setForm] = useState<CmsPageFormValues>(DEFAULT_FORM);
  const [slugManual, setSlugManual] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof CmsPageFormValues, string>>>({});

  const isEditing = page !== null;

  // Sync form when opening
  useEffect(() => {
    if (isOpen) {
      if (page) {
        setForm({
          name: page.name,
          slug: page.slug,
          status: page.status,
          featuredImage: page.featuredImage ?? '',
          seoMetaTitle: page.seoMetaTitle,
          seoMetaDescription: page.seoMetaDescription,
        });
        setSlugManual(true); // Don't auto-override slug when editing
      } else {
        setForm(DEFAULT_FORM);
        setSlugManual(false);
      }
      setErrors({});
    }
  }, [isOpen, page]);

  // Escape key closes
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const handleNameChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      name: value,
      slug: slugManual ? prev.slug : slugify(value),
      seoMetaTitle: prev.seoMetaTitle || value,
    }));
  };

  const handleSlugChange = (value: string) => {
    setSlugManual(true);
    setForm((prev) => ({ ...prev, slug: value }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CmsPageFormValues, string>> = {};
    if (!form.name.trim()) newErrors.name = 'Page name is required.';
    if (!form.slug.trim()) newErrors.slug = 'Slug is required.';
    if (!form.seoMetaTitle.trim()) newErrors.seoMetaTitle = 'SEO meta title is required.';
    const descLen = form.seoMetaDescription.trim().length;
    if (descLen > 0 && descLen < 50)
      newErrors.seoMetaDescription = 'Meta description should be at least 50 characters.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(form, page?.id);
  };

  const seoTitleLen = form.seoMetaTitle.length;
  const seoDescLen = form.seoMetaDescription.length;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/40 backdrop-blur-sm z-[80] transition-opacity duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <aside
        className={cn(
          'fixed top-0 right-0 h-full w-full max-w-xl bg-card border-l border-border/50 shadow-2xl z-[90] flex flex-col transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        role="dialog"
        aria-modal="true"
        aria-label={isEditing ? `Edit page: ${page?.name}` : 'Add new page'}
      >
        {/* Drawer Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-border/40 bg-card/80 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/30 text-teal-600 dark:text-teal-400">
              {isEditing ? (
                <Icons.Pencil className="h-4 w-4" />
              ) : (
                <Icons.FilePlus className="h-4 w-4" />
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-foreground font-sans">
                {isEditing ? 'Edit Page' : 'Add New Page'}
              </p>
              {isEditing && (
                <p className="text-[11px] text-muted-foreground font-mono">{page?.slug}</p>
              )}
            </div>
          </div>
          <button
            type="button"
            id="drawer-close-btn"
            onClick={onClose}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors duration-150"
            aria-label="Close drawer"
          >
            <Icons.X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Drawer Form Body */}
        <form
          id="page-editor-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-6 py-6 space-y-6 no-scrollbar"
        >
          {/* ── Page Identity ── */}
          <section>
            <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-4 font-sans">
              Page Identity
            </h3>
            <div className="space-y-4">
              {/* Page Name */}
              <div>
                <label
                  htmlFor="field-name"
                  className="block text-xs font-semibold text-foreground mb-1.5 font-sans"
                >
                  Page Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="field-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. About Us"
                  className={cn(
                    'w-full px-3.5 py-2.5 rounded-xl bg-muted/40 border text-sm font-sans text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/60 transition-all duration-200',
                    errors.name ? 'border-rose-400' : 'border-border/50'
                  )}
                />
                {errors.name && (
                  <p className="text-xs text-rose-500 mt-1 font-sans">{errors.name}</p>
                )}
              </div>

              {/* Slug */}
              <div>
                <label
                  htmlFor="field-slug"
                  className="block text-xs font-semibold text-foreground mb-1.5 font-sans"
                >
                  URL Slug <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-mono select-none">
                    veenero.com
                  </span>
                  <input
                    id="field-slug"
                    type="text"
                    value={form.slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    className={cn(
                      'w-full pl-24 pr-3.5 py-2.5 rounded-xl bg-muted/40 border text-sm font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/60 transition-all duration-200',
                      errors.slug ? 'border-rose-400' : 'border-border/50'
                    )}
                  />
                </div>
                {errors.slug && (
                  <p className="text-xs text-rose-500 mt-1 font-sans">{errors.slug}</p>
                )}
              </div>

              {/* Status */}
              <div>
                <label
                  htmlFor="field-status"
                  className="block text-xs font-semibold text-foreground mb-1.5 font-sans"
                >
                  Status
                </label>
                <div className="flex items-center gap-3">
                  {(['published', 'draft'] as PageStatus[]).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, status: s }))}
                      className={cn(
                        'flex-1 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wide font-sans transition-all duration-200',
                        form.status === s
                          ? s === 'published'
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                            : 'bg-amber-500 text-white border-amber-500 shadow-sm'
                          : 'bg-transparent text-muted-foreground border-border/50 hover:bg-muted/40'
                      )}
                    >
                      {s === 'published' ? '● Published' : '○ Draft'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── Featured Image ── */}
          <section>
            <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-4 font-sans">
              Featured Image
            </h3>
            <div className="border-2 border-dashed border-border/40 rounded-xl p-5 text-center bg-muted/20 hover:border-teal-500/50 transition-colors duration-200 cursor-pointer">
              <Icons.ImagePlus className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-xs font-semibold text-muted-foreground font-sans">
                Click to upload or drag & drop
              </p>
              <p className="text-[10px] text-muted-foreground/50 mt-1 font-sans">
                PNG, JPG, WebP up to 4MB
              </p>
              {form.featuredImage && (
                <p className="text-[11px] text-teal-600 mt-2 font-mono truncate">
                  {form.featuredImage}
                </p>
              )}
            </div>
          </section>

          {/* ── SEO Settings ── */}
          <section>
            <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-4 font-sans flex items-center gap-2">
              <Icons.Search className="h-3.5 w-3.5" />
              SEO Settings
            </h3>
            <div className="space-y-4">
              {/* Meta Title */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="field-seo-title"
                    className="text-xs font-semibold text-foreground font-sans"
                  >
                    Meta Title <span className="text-rose-500">*</span>
                  </label>
                  <span
                    className={cn(
                      'text-[10px] font-mono',
                      seoTitleLen > 60
                        ? 'text-rose-500'
                        : seoTitleLen > 50
                        ? 'text-amber-500'
                        : 'text-muted-foreground'
                    )}
                  >
                    {seoTitleLen}/60
                  </span>
                </div>
                <input
                  id="field-seo-title"
                  type="text"
                  value={form.seoMetaTitle}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, seoMetaTitle: e.target.value }))
                  }
                  placeholder="e.g. About Veenero | Smart Water Management"
                  maxLength={70}
                  className={cn(
                    'w-full px-3.5 py-2.5 rounded-xl bg-muted/40 border text-sm font-sans text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/60 transition-all duration-200',
                    errors.seoMetaTitle ? 'border-rose-400' : 'border-border/50'
                  )}
                />
                {errors.seoMetaTitle && (
                  <p className="text-xs text-rose-500 mt-1 font-sans">{errors.seoMetaTitle}</p>
                )}
              </div>

              {/* Meta Description */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="field-seo-desc"
                    className="text-xs font-semibold text-foreground font-sans"
                  >
                    Meta Description
                  </label>
                  <span
                    className={cn(
                      'text-[10px] font-mono',
                      seoDescLen > 160
                        ? 'text-rose-500'
                        : seoDescLen > 140
                        ? 'text-amber-500'
                        : 'text-muted-foreground'
                    )}
                  >
                    {seoDescLen}/160
                  </span>
                </div>
                <textarea
                  id="field-seo-desc"
                  value={form.seoMetaDescription}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, seoMetaDescription: e.target.value }))
                  }
                  placeholder="A compelling description that appears in search engine results..."
                  maxLength={200}
                  rows={3}
                  className={cn(
                    'w-full px-3.5 py-2.5 rounded-xl bg-muted/40 border text-sm font-sans text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/60 transition-all duration-200 resize-none',
                    errors.seoMetaDescription ? 'border-rose-400' : 'border-border/50'
                  )}
                />
                {errors.seoMetaDescription && (
                  <p className="text-xs text-rose-500 mt-1 font-sans">
                    {errors.seoMetaDescription}
                  </p>
                )}
              </div>

              {/* SEO Preview */}
              {(form.seoMetaTitle || form.seoMetaDescription) && (
                <div className="border border-border/30 rounded-xl p-4 bg-muted/10">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 font-sans">
                    Search Preview
                  </p>
                  <p className="text-xs text-sky-600 dark:text-sky-400 font-sans truncate mb-0.5">
                    veenero.com{form.slug}
                  </p>
                  <p className="text-sm font-semibold text-blue-700 dark:text-blue-400 font-sans truncate">
                    {form.seoMetaTitle || 'Page Title'}
                  </p>
                  <p className="text-xs text-muted-foreground font-sans line-clamp-2 mt-0.5 leading-relaxed">
                    {form.seoMetaDescription || 'Meta description will appear here...'}
                  </p>
                </div>
              )}
            </div>
          </section>
        </form>

        {/* Drawer Footer */}
        <div className="px-6 py-4 border-t border-border/40 bg-card/80 backdrop-blur-sm shrink-0 flex items-center gap-3">
          <button
            type="button"
            id="drawer-cancel-btn"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl border border-border/50 bg-transparent text-sm font-semibold text-foreground hover:bg-muted/40 transition-colors duration-200 font-sans"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="page-editor-form"
            id="drawer-save-btn"
            className="flex-1 py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold transition-colors duration-200 font-sans flex items-center justify-center gap-2 shadow-sm"
          >
            <Icons.Save className="h-3.5 w-3.5" />
            {isEditing ? 'Save Changes' : 'Create Page'}
          </button>
        </div>
      </aside>
    </>
  );
};

export default PageEditorDrawer;
