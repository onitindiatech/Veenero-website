import React, { useState, useEffect, useMemo } from 'react';
import {
  Save,
  Eye,
  ExternalLink,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Sparkles,
  Layers,
  Radio,
  Workflow,
  Cpu,
  HelpCircle,
  Building2,
  Settings,
  Globe,
  Sliders,
  FileText,
  Activity,
  ShieldCheck,
  Check,
  RotateCcw,
  Copy,
  ChevronRight,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MediaPickerModal } from './MediaPickerModal';
import { MediaAsset } from '../../services/media.service';
import {
  AdminSolutionDetail,
  updateSolutionDetail,
  createSolutionDetail,
} from '../../services/solutions.service';

interface SolutionDetailEditorProps {
  solution: AdminSolutionDetail | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess: (updated: AdminSolutionDetail) => void;
  categoriesList?: Array<{ key: string; displayLabel: string }>;
  publicSolutionName?: string;
  publicCardsList?: Array<any>;
}

type TabType =
  | 'GENERAL'
  | 'HERO'
  | 'CONTENT'
  | 'MEDIA'
  | 'BENEFITS'
  | 'FEATURES'
  | 'PROCESS'
  | 'TECH & METRICS'
  | 'FAQS'
  | 'INDUSTRIES'
  | 'SECTIONS'
  | 'SEO';

export const SolutionDetailEditor: React.FC<SolutionDetailEditorProps> = ({
  solution,
  isOpen,
  onClose,
  onSaveSuccess,
  categoriesList = [],
  publicSolutionName,
  publicCardsList = [],
}) => {
  const isEditing = Boolean(solution?._id || solution?.id);

  // Form state holding the entire solution detail document
  const [formData, setFormData] = useState<Partial<AdminSolutionDetail>>({});
  const [activeTab, setActiveTab] = useState<TabType>('GENERAL');
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  // Dynamic identity resolution for the modal header
  const resolvedPublicName = useMemo(() => {
    if (publicSolutionName) return publicSolutionName;
    const catMatch = categoriesList.find(
      (c) =>
        c.key.toLowerCase() === formData.categoryKey?.toLowerCase() ||
        c.key.toLowerCase() === (formData as any).category?.toLowerCase() ||
        c.displayLabel.toLowerCase() === formData.categoryKey?.toLowerCase()
    );
    if (catMatch?.displayLabel) return catMatch.displayLabel;
    const cardMatch = publicCardsList?.find(
      (s) =>
        (s.slug && formData.slug && s.slug.toLowerCase() === formData.slug.toLowerCase()) ||
        (s.title && formData.title && s.title.toLowerCase() === formData.title.toLowerCase())
    );
    if (cardMatch?.title) return cardMatch.title;
    return formData.title || 'Untitled';
  }, [publicSolutionName, categoriesList, publicCardsList, formData.categoryKey, (formData as any).category, formData.slug, formData.title]);

  const detailPageContentTitle = useMemo(() => {
    if (formData.tagline?.line1) {
      return [formData.tagline.line1, formData.tagline.line2, formData.tagline.line3]
        .filter(Boolean)
        .join(' ');
    }
    return formData.title || '';
  }, [formData.tagline, formData.title]);

  // Media Picker state
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerCallback, setPickerCallback] = useState<((url: string, publicId?: string) => void) | null>(null);
  const [pickerTitle, setPickerTitle] = useState('Select Image from Library');

  // Load / initialize form data
  useEffect(() => {
    if (solution) {
      // Clone deeply to allow independent editing
      setFormData(JSON.parse(JSON.stringify(solution)));
      setIsDirty(false);
    } else {
      // Default empty solution detail template — uses correct AdminSolutionDetail field names
      setFormData({
        title: '',
        shortTitle: '',
        shortDescription: '',
        icon: 'Radio',
        slug: '',
        badge: 'SOLUTION OVERVIEW',
        categoryKey: categoriesList[0]?.key || 'water-visibility',
        sortOrder: 1,
        status: 'DRAFT',
        isFeatured: false,
        tagline: { line1: '', line2: '', line3: '' },
        heroDescription: '',
        heroPills: ['Real-time Data', 'Always-On Monitoring', 'Unified Platform'],
        heroImage: '',
        heroImageAlt: '',
        contactEmail: 'solutions@veenerosolutions.com',
        primaryCtaText: 'Request a Demo',
        primaryCtaLink: '#inquiry-section',
        secondaryCtaText: 'Talk to an Expert',
        secondaryCtaLink: '#inquiry-section',
        heroHighlights: [],
        heroMetrics: [],
        problemSection: {
          eyebrow: 'THE PROBLEM WE SOLVE',
          title: 'The Silent Cost of',
          highlightTitle: 'Unmonitored Water Infrastructure',
          description: '',
          impactSummary: '',
          items: [],
        },
        overview: {
          eyebrow: 'OVERVIEW',
          title: '',
          highlightTitle: '',
          description: '',
          blocks: [],
          dualEngine: {
            hardware: { tag: 'FIELD HARDWARE', title: '', description: '', features: [] },
            software: { tag: 'CLOUD & EDGE PLATFORM', title: '', description: '', features: [] },
          },
        },
        howItWorks: {
          eyebrow: 'HOW IT WORKS',
          title: 'Simple. Connected. Intelligent.',
          description: '',
          steps: [],
        },
        analyticsVisual: {
          eyebrow: 'REAL-TIME TELEMETRY STREAM',
          title: 'Live Water Telemetry Dashboard',
          description: '',
          stats: [],
        },
        inquiryForm: {
          eyebrow: 'DIRECT INQUIRY',
          title: "Have Questions? Let's Talk.",
          description: '',
          responseTime: 'Direct callback from a senior water systems specialist within 24 hours.',
          confidentiality: 'Full NDA protection for your infrastructure layouts and volumetric data.',
          pocText: 'Live pilot telemetry setups available for industrial and utility networks.',
        },
        finalCta: {
          eyebrow: 'NEXT STEPS',
          title: 'Ready to Transform Your Water Operations?',
          highlightTitle: 'Schedule a Live System Demo.',
          description: 'Contact our water engineers for an on-site feasibility evaluation.',
          primaryCtaText: 'Request a Demo',
          primaryCtaLink: '#inquiry-section',
          secondaryCtaText: 'Talk to an Expert',
          secondaryCtaLink: '#inquiry-section',
          contactEmail: 'solutions@veenerosolutions.com',
        },
        seo: {
          metaTitle: '',
          metaDescription: '',
          metaKeywords: '',
          ogTitle: '',
          ogDescription: '',
          ogImage: '',
          canonicalUrl: '',
        },
      });
      setIsDirty(false);
    }
  }, [solution, isOpen]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Helper to open media picker with a target setter callback
  const handleOpenMediaPicker = (title: string, onSelectUrl: (url: string, publicId?: string) => void) => {
    setPickerTitle(title);
    setPickerCallback(() => onSelectUrl);
    setPickerOpen(true);
  };

  // Generic updater for nested path
  const updateField = (path: string, value: any) => {
    setIsDirty(true);
    setFormData((prev) => {
      const copy = JSON.parse(JSON.stringify(prev || {}));
      const keys = path.split('.');
      let current = copy;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return copy;
    });
  };

  // Save handler
  const handleSave = async () => {
    if (!formData.title?.trim()) {
      showToast('Solution Title is required.', 'error');
      setActiveTab('GENERAL');
      return;
    }
    if (!formData.slug?.trim()) {
      showToast('URL Route Slug is required.', 'error');
      setActiveTab('GENERAL');
      return;
    }

    try {
      setSaving(true);
      let result: AdminSolutionDetail;
      if (isEditing && (formData._id || formData.id)) {
        const id = (formData._id || formData.id) as string;
        result = await updateSolutionDetail(id, formData);
        showToast('Solution Detail updated successfully!');
      } else {
        result = await createSolutionDetail(formData);
        showToast('Solution Detail created successfully!');
      }
      setIsDirty(false);
      onSaveSuccess(result);
    } catch (err: any) {
      showToast(err.message || 'Failed to save Solution Detail.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  // Modern input classes matching Veenero Admin style
  const inputCls =
    'w-full px-3 py-2 text-xs rounded-xl border border-border/80 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition-colors shadow-2xs';
  const textareaCls =
    'w-full px-3 py-2 text-xs rounded-xl border border-border/80 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition-colors resize-y shadow-2xs leading-relaxed';
  const labelCls = 'text-[11px] font-bold text-foreground block mb-1 font-sans tracking-wide';
  const helperCls = 'text-[10px] text-muted-foreground mt-1 flex items-center gap-1';
  const sectionCardCls = 'bg-card/70 border border-border/80 rounded-2xl p-5 space-y-4 shadow-xs';

  const tabs: { id: TabType; label: string; icon: React.ElementType; count?: number }[] = [
    { id: 'GENERAL', label: 'General', icon: Settings },
    { id: 'HERO', label: 'Hero', icon: Radio, count: formData.heroMetrics?.length },
    { id: 'CONTENT', label: 'Content', icon: FileText, count: formData.overview?.blocks?.length },
    { id: 'MEDIA', label: 'Media', icon: ImageIcon },
    { id: 'BENEFITS', label: 'Benefits', icon: Activity, count: formData.benefits?.metrics?.length },
    { id: 'FEATURES', label: 'Features', icon: Sparkles, count: formData.features?.items?.length },
    { id: 'PROCESS', label: 'Process', icon: Workflow, count: formData.howItWorks?.steps?.length },
    { id: 'TECH & METRICS', label: 'Tech & Metrics', icon: Cpu, count: formData.techSection?.diagramSteps?.length },
    { id: 'FAQS', label: 'FAQs', icon: HelpCircle, count: formData.faqs?.length },
    { id: 'INDUSTRIES', label: 'Industries', icon: Building2, count: formData.industries?.length || formData.useCases?.items?.length },
    { id: 'SECTIONS', label: 'Sections', icon: Layers },
    { id: 'SEO', label: 'SEO', icon: Globe },
  ];

  return (
    <div
      className="fixed top-16 bottom-0 right-0 left-0 md:left-[var(--admin-sidebar-width,260px)] z-40 flex items-center justify-center p-3 sm:p-4 md:p-5 lg:p-6 bg-black/60 backdrop-blur-xs overflow-hidden font-sans transition-all duration-300"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          if (isDirty && !window.confirm('You have unsaved changes. Are you sure you want to close?')) {
            return;
          }
          onClose();
        }
      }}
    >
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border backdrop-blur-md text-xs font-semibold transition-all ${
            toast.type === 'success'
              ? 'bg-emerald-950/95 text-emerald-100 border-emerald-500/40'
              : 'bg-red-950/95 text-red-100 border-red-500/40'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <XCircle className="w-4 h-4 text-red-400 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(asset: MediaAsset) => {
          if (pickerCallback) {
            pickerCallback(asset.secureUrl, asset.publicId);
          }
          setPickerOpen(false);
        }}
        title={pickerTitle}
        initialFolder="solutions"
      />

      {/* Main Modal Container */}
      <div className="bg-card border border-border/80 rounded-2xl w-full max-w-5xl xl:max-w-6xl 2xl:max-w-7xl h-full max-h-[calc(100vh-5.5rem)] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* ── Top Header ──────────────────────────────────────────────────────── */}
        <div className="px-6 py-4 border-b border-border/70 flex items-center justify-between bg-muted/20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/25 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold text-foreground tracking-tight">
                  {isEditing ? `Edit Solution Detail — ${resolvedPublicName}` : 'Create New Solution Detail'}
                </h2>
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase border ${
                    formData.status === 'PUBLISHED'
                      ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                      : formData.status === 'ARCHIVED'
                      ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                      : 'bg-slate-500/10 text-slate-500 border-slate-500/20'
                  }`}
                >
                  {formData.status || 'DRAFT'}
                </span>
                {isDirty && (
                  <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-amber-500/15 text-amber-500 border border-amber-500/30 animate-pulse">
                    Unsaved Changes
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
                <span>
                  Public URL: <span className="font-mono text-teal-600 dark:text-teal-400 font-medium">/solutions/{formData.slug || 'slug'}</span>
                </span>
                {detailPageContentTitle && (
                  <>
                    <span className="opacity-40">•</span>
                    <span className="truncate max-w-sm lg:max-w-md">
                      Detail Page Title: <span className="text-foreground font-medium italic">"{detailPageContentTitle}"</span>
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {formData.slug && (
              <a
                href={`/solutions/${formData.slug}`}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-700 dark:text-teal-400 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/25 rounded-xl transition-colors"
                title="Open public page in new tab"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Live Page</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            )}

            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                if (isDirty && !window.confirm('You have unsaved changes. Are you sure you want to close?')) {
                  return;
                }
                onClose();
              }}
              className="text-xs rounded-xl"
            >
              Cancel
            </Button>

            <Button
              size="sm"
              disabled={saving}
              onClick={handleSave}
              className="bg-teal-700 hover:bg-teal-800 text-white text-xs px-4 rounded-xl shadow-xs font-semibold flex items-center gap-2"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </Button>

            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                if (isDirty && !window.confirm('You have unsaved changes. Are you sure you want to close?')) {
                  return;
                }
                onClose();
              }}
              className="h-8 w-8 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 shrink-0 ml-1"
              title="Close Editor"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* ── Tabs Bar (12 tabs) ─────────────────────────────── */}
        <div className="px-4 sm:px-6 border-b border-border/60 bg-muted/10 overflow-x-auto scrollbar-thin scrollbar-thumb-border/60 shrink-0">
          <div className="flex items-center gap-1 min-w-max py-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-xs font-bold'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {typeof tab.count === 'number' && tab.count > 0 && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Scrollable Tab Content Body ────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* TAB 1: GENERAL                                                      */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'GENERAL' && (
            <div className="max-w-4xl space-y-6">
              {/* Section A: Public Listing Data (Displayed on /solutions landing page) */}
              <div className={sectionCardCls}>
                <div className="border-b border-border/60 pb-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider block">
                      Public Listing Data
                    </span>
                    <h3 className="text-sm font-bold text-foreground">
                      Public /solutions Card & Directory Appearance
                    </h3>
                  </div>
                  <span className="text-[10px] text-muted-foreground bg-muted/40 px-2 py-0.5 rounded border border-border/50">
                    Source: Public Overview
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>
                      Public Solution Name (Listing Card Title) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={inputCls}
                      value={formData.shortTitle || ''}
                      onChange={(e) => updateField('shortTitle', e.target.value)}
                      placeholder="e.g. Aqua Saver (Core Solution)"
                    />
                    <p className={helperCls}>Primary name displayed on the public /solutions overview cards and category filters.</p>
                  </div>

                  <div>
                    <label className={labelCls}>Category</label>
                    <div className="space-y-1.5">
                      <select
                        className={inputCls}
                        value={
                          categoriesList.some(
                            (c) => c.displayLabel === formData.categoryKey || c.key === formData.categoryKey
                          )
                            ? formData.categoryKey
                            : formData.categoryKey
                            ? '__custom__'
                            : ''
                        }
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === '__custom__') {
                            setIsCustomCategory(true);
                          } else {
                            setIsCustomCategory(false);
                            updateField('categoryKey', val);
                            updateField('category', val);
                          }
                        }}
                      >
                        <option value="">Select Category</option>
                        {categoriesList.map((c) => (
                          <option key={c.key} value={c.displayLabel}>
                            {c.displayLabel}
                          </option>
                        ))}
                        <option value="__custom__">+ Add Custom Category...</option>
                      </select>

                      {isCustomCategory && (
                        <div className="flex items-center gap-2 pt-1 animate-in fade-in duration-150">
                          <input
                            type="text"
                            className={inputCls}
                            placeholder="Enter new category name..."
                            value={formData.categoryKey || ''}
                            onChange={(e) => {
                              updateField('categoryKey', e.target.value);
                              updateField('category', e.target.value);
                            }}
                            autoFocus
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => setIsCustomCategory(false)}
                            className="text-xs shrink-0"
                          >
                            Done
                          </Button>
                        </div>
                      )}
                    </div>
                    <p className={helperCls}>Assigns solution to its thematic pillar on the public page.</p>
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Listing Short Description</label>
                  <textarea
                    rows={2}
                    className={textareaCls}
                    value={formData.shortDescription || ''}
                    onChange={(e) => updateField('shortDescription', e.target.value)}
                    placeholder="Brief 1-2 sentence description shown on the public /solutions card..."
                  />
                  <p className={helperCls}>Appears on the public /solutions overview card and search results.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className={labelCls}>Display Order</label>
                    <input
                      type="number"
                      className={inputCls}
                      value={formData.sortOrder ?? formData.displayOrder ?? 1}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        updateField('sortOrder', val);
                        updateField('displayOrder', val);
                      }}
                    />
                    <p className={helperCls}>Numerical position on the public /solutions grid (1, 2, 3...).</p>
                  </div>

                  <div>
                    <label className={labelCls}>Listing Icon Key (Lucide)</label>
                    <input
                      type="text"
                      className={inputCls}
                      value={formData.icon || 'Cpu'}
                      onChange={(e) => updateField('icon', e.target.value)}
                      placeholder="e.g. Cpu, Droplets, Radio, ShieldCheck"
                    />
                    <p className={helperCls}>Icon rendered in the circular badge on the card.</p>
                  </div>
                </div>
              </div>

              {/* Section B: Detail Page Data (Dedicated /solutions/:slug page) */}
              <div className={sectionCardCls}>
                <div className="border-b border-border/60 pb-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider block">
                      Detail Page Data
                    </span>
                    <h3 className="text-sm font-bold text-foreground">
                      Dedicated /solutions/:slug Page Identity
                    </h3>
                  </div>
                  <span className="text-[10px] text-muted-foreground bg-muted/40 px-2 py-0.5 rounded border border-border/50">
                    Source: Public Detail Page
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>
                      Detail Page Headline (Primary H1) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={inputCls}
                      value={formData.title || ''}
                      onChange={(e) => updateField('title', e.target.value)}
                      placeholder="e.g. Engineered Precision. Zero Leak Waste."
                    />
                    <p className={helperCls}>Main H1 headline rendered at the top of the detail page.</p>
                  </div>

                  <div>
                    <label className={labelCls}>
                      URL Route Slug <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center">
                      <span className="px-3 py-2 text-xs bg-muted/60 border border-r-0 border-border/80 rounded-l-xl text-muted-foreground font-mono">
                        /solutions/
                      </span>
                      <input
                        type="text"
                        className={`${inputCls} rounded-l-none font-mono text-xs`}
                        value={formData.slug || ''}
                        onChange={(e) =>
                          updateField(
                            'slug',
                            e.target.value
                              .toLowerCase()
                              .trim()
                              .replace(/[^a-z0-9-]/g, '-')
                          )
                        }
                        placeholder="aqua-saver"
                      />
                    </div>
                    <p className={helperCls}>Public URL route address. Lowercase with hyphens only.</p>
                  </div>

                  <div>
                    <label className={labelCls}>Hero Eyebrow / Badge Label</label>
                    <input
                      type="text"
                      className={inputCls}
                      value={formData.badge || ''}
                      onChange={(e) => updateField('badge', e.target.value)}
                      placeholder="e.g. CORE CONSERVATION SOLUTION"
                    />
                    <p className={helperCls}>Eyebrow pill displayed above the detail hero title.</p>
                  </div>

                  <div>
                    <label className={labelCls}>Publish Status</label>
                    <select
                      className={inputCls}
                      value={formData.status || 'DRAFT'}
                      onChange={(e) => updateField('status', e.target.value)}
                    >
                      <option value="PUBLISHED">Published (Live to Public)</option>
                      <option value="DRAFT">Draft (Admin Only)</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                    <p className={helperCls}>Controls live visibility on the website.</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/40">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(formData.isFeatured)}
                      onChange={(e) => updateField('isFeatured', e.target.checked)}
                      className="rounded border-border text-teal-600 focus:ring-teal-500 w-4 h-4"
                    />
                    <span className="text-xs font-semibold text-foreground">
                      Mark as Featured Solution on Website
                    </span>
                  </label>
                  <p className="text-[10px] text-muted-foreground ml-6">
                    Featured solutions receive prominent placement in directory highlights.
                  </p>
                </div>
              </div>

              <div className={sectionCardCls}>
                <div className="border-b border-border/60 pb-3">
                  <h3 className="text-sm font-bold text-foreground">Short Descriptions & Summaries</h3>
                  <p className="text-[11px] text-muted-foreground">
                    Brief synopsis used in cards, directory grids, and social embeds.
                  </p>
                </div>

                <div>
                  <label className={labelCls}>Short Description (Directory Card)</label>
                  <textarea
                    rows={2}
                    className={textareaCls}
                    value={formData.shortDescription || ''}
                    onChange={(e) => updateField('shortDescription', e.target.value)}
                    placeholder="Concise 1-2 sentence description shown in solution grids..."
                  />
                  <p className={helperCls}>Appears on /solutions directory cards.</p>
                </div>

                <div>
                  <label className={labelCls}>Executive Intro / Summary</label>
                  <textarea
                    rows={3}
                    className={textareaCls}
                    value={formData.introSummary || ''}
                    onChange={(e) => updateField('introSummary', e.target.value)}
                    placeholder="Comprehensive executive summary introducing the engineering value..."
                  />
                  <p className={helperCls}>Fallback narrative for the introductory section.</p>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* TAB 2: HERO                                                         */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'HERO' && (
            <div className="max-w-4xl space-y-6">
              <div className={sectionCardCls}>
                <div className="border-b border-border/60 pb-3">
                  <h3 className="text-sm font-bold text-foreground">Public Hero Headlines & Narrative</h3>
                  <p className="text-[11px] text-muted-foreground">
                    Controls the very top section of the public page, including headline hierarchy and CTAs.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Hero Eyebrow / Label</label>
                    <input
                      type="text"
                      className={inputCls}
                      value={formData.badge || ''}
                      onChange={(e) => updateField('badge', e.target.value)}
                      placeholder="e.g. WATER VISIBILITY"
                    />
                    <p className={helperCls}>Top uppercase teal text with accent line.</p>
                  </div>

                  <div>
                    <label className={labelCls}>Contact Email (Hero Section)</label>
                    <input
                      type="text"
                      className={inputCls}
                      value={formData.contactEmail || 'solutions@veenerosolutions.com'}
                      onChange={(e) => updateField('contactEmail', e.target.value)}
                      placeholder="e.g. solutions@veenerosolutions.com"
                    />
                    <p className={helperCls}>Email shown in the hero below CTAs.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={labelCls}>Headline Line 1 (White)</label>
                    <input
                      type="text"
                      className={inputCls}
                      value={formData.tagline?.line1 || ''}
                      onChange={(e) => updateField('tagline.line1', e.target.value)}
                      placeholder="e.g. Real-time Visibility."
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Headline Line 2 (Teal Highlight)</label>
                    <input
                      type="text"
                      className={inputCls}
                      value={formData.tagline?.line2 || ''}
                      onChange={(e) => updateField('tagline.line2', e.target.value)}
                      placeholder="e.g. Complete Clarity."
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Headline Line 3 (Optional)</label>
                    <input
                      type="text"
                      className={inputCls}
                      value={formData.tagline?.line3 || ''}
                      onChange={(e) => updateField('tagline.line3', e.target.value)}
                      placeholder="e.g. Every Drop."
                    />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Hero Detailed Description</label>
                  <textarea
                    rows={3}
                    className={textareaCls}
                    value={formData.heroDescription || ''}
                    onChange={(e) => updateField('heroDescription', e.target.value)}
                    placeholder="Comprehensive explanation of what this solution achieves..."
                  />
                  <p className={helperCls}>Appears directly beneath the large headline.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-border/40">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-foreground block">Primary Action Button</span>
                    <input
                      type="text"
                      className={inputCls}
                      value={formData.primaryCtaText || 'Request a Demo'}
                      onChange={(e) => updateField('primaryCtaText', e.target.value)}
                      placeholder="Button Text (e.g. Request a Demo)"
                    />
                    <input
                      type="text"
                      className={inputCls}
                      value={formData.primaryCtaLink || '#inquiry-section'}
                      onChange={(e) => updateField('primaryCtaLink', e.target.value)}
                      placeholder="Button Link URL (e.g. #inquiry-section)"
                    />
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-bold text-foreground block">Secondary Action Button</span>
                    <input
                      type="text"
                      className={inputCls}
                      value={formData.secondaryCtaText || 'Talk to an Expert'}
                      onChange={(e) => updateField('secondaryCtaText', e.target.value)}
                      placeholder="Button Text (e.g. Talk to an Expert)"
                    />
                    <input
                      type="text"
                      className={inputCls}
                      value={formData.secondaryCtaLink || '#inquiry-section'}
                      onChange={(e) => updateField('secondaryCtaLink', e.target.value)}
                      placeholder="Button Link URL (e.g. #inquiry-section)"
                    />
                  </div>
                </div>

                {/* Hero Feature Pills */}
                <div className="pt-2 border-t border-border/40">
                  <label className={labelCls}>Feature Tags / Pills (Comma Separated)</label>
                  <input
                    type="text"
                    className={inputCls}
                    value={(formData.heroPills || []).join(', ')}
                    onChange={(e) => {
                      const pills = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                      updateField('heroPills', pills);
                    }}
                    placeholder="Real-time Data, Always-On Monitoring, Unified Platform"
                  />
                  <p className={helperCls}>Small badges rendered below the CTAs or alongside metrics.</p>
                </div>
              </div>

              {/* Repeatable Hero Metrics / Telemetry Cards */}
              <div className={sectionCardCls}>
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Live Telemetry Metrics (Hero Grid)</h3>
                    <p className="text-[11px] text-muted-foreground">
                      Real-time interactive cards rendered on the right side of the hero section.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs flex items-center gap-1.5"
                    onClick={() => {
                      const current = formData.heroMetrics || [];
                      const newItem = {
                        title: 'Live Flow Rate',
                        value: '1,245',
                        rawValue: 1245,
                        suffix: ' m³/hr',
                        subtext: 'vs yesterday',
                        change: '+10.5%',
                        isPositive: true,
                        type: 'counter',
                      };
                      const updated = [...current, newItem];
                      updateField('heroMetrics', updated);
                    }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Metric Card</span>
                  </Button>
                </div>

                {(!formData.heroMetrics || formData.heroMetrics.length === 0) ? (
                  <div className="text-center py-6 text-xs text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border">
                    No hero telemetry metrics configured yet. Click "Add Metric Card" above to add one.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {(formData.heroMetrics || []).map((m: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-background/80 border border-border/70 flex flex-col md:flex-row items-start md:items-center justify-between gap-3"
                      >
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5 flex-1 w-full">
                          <div>
                            <span className="text-[10px] text-muted-foreground font-semibold block">Title</span>
                            <input
                              type="text"
                              className={inputCls}
                              value={m.title || ''}
                              onChange={(e) => {
                                const list = [...(formData.heroMetrics || [])];
                                list[idx] = { ...list[idx], title: e.target.value };
                                updateField('heroMetrics', list);
                              }}
                              placeholder="e.g. Live Flow Rate"
                            />
                          </div>

                          <div>
                            <span className="text-[10px] text-muted-foreground font-semibold block">Display Value</span>
                            <input
                              type="text"
                              className={inputCls}
                              value={m.value || ''}
                              onChange={(e) => {
                                const list = [...(formData.heroMetrics || [])];
                                list[idx] = { ...list[idx], value: e.target.value };
                                updateField('heroMetrics', list);
                              }}
                              placeholder="1,245"
                            />
                          </div>

                          <div>
                            <span className="text-[10px] text-muted-foreground font-semibold block">Suffix</span>
                            <input
                              type="text"
                              className={inputCls}
                              value={m.suffix || ''}
                              onChange={(e) => {
                                const list = [...(formData.heroMetrics || [])];
                                list[idx] = { ...list[idx], suffix: e.target.value };
                                updateField('heroMetrics', list);
                              }}
                              placeholder="m³/hr"
                            />
                          </div>

                          <div>
                            <span className="text-[10px] text-muted-foreground font-semibold block">Delta / Trend</span>
                            <input
                              type="text"
                              className={inputCls}
                              value={m.change || ''}
                              onChange={(e) => {
                                const list = [...(formData.heroMetrics || [])];
                                list[idx] = { ...list[idx], change: e.target.value };
                                updateField('heroMetrics', list);
                              }}
                              placeholder="+10.5%"
                            />
                          </div>

                          <div>
                            <span className="text-[10px] text-muted-foreground font-semibold block">Type</span>
                            <select
                              className={inputCls}
                              value={m.type || 'counter'}
                              onChange={(e) => {
                                const list = [...(formData.heroMetrics || [])];
                                list[idx] = { ...list[idx], type: e.target.value };
                                updateField('heroMetrics', list);
                              }}
                            >
                              <option value="counter">Counter</option>
                              <option value="sparkline">Sparkline</option>
                              <option value="gauge">Gauge</option>
                              <option value="status">Status</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0 pt-2 md:pt-0">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => {
                              const list = [...(formData.heroMetrics || [])];
                              const temp = list[idx];
                              list[idx] = list[idx - 1];
                              list[idx - 1] = temp;
                              updateField('heroMetrics', list);
                            }}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 cursor-pointer"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === (formData.heroMetrics || []).length - 1}
                            onClick={() => {
                              const list = [...(formData.heroMetrics || [])];
                              const temp = list[idx];
                              list[idx] = list[idx + 1];
                              list[idx + 1] = temp;
                              updateField('heroMetrics', list);
                            }}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 cursor-pointer"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const list = [...(formData.heroMetrics || [])];
                              list.splice(idx, 1);
                              updateField('heroMetrics', list);
                            }}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 cursor-pointer"
                            title="Delete Metric"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* TAB 3: CONTENT (PROBLEM SECTION & OVERVIEW ARCHITECTURE)             */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'CONTENT' && (
            <div className="max-w-4xl space-y-6">
              {/* ── 1. THE PROBLEM WE SOLVE SECTION ─────────────────────────── */}
              <div className={sectionCardCls}>
                <div className="border-b border-border/60 pb-3">
                  <h3 className="text-sm font-bold text-foreground">Section 1: The Problem We Solve</h3>
                  <p className="text-[11px] text-muted-foreground">
                    Infrastructure failure modes and vulnerabilities rendered immediately beneath the hero banner.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={labelCls}>Section Eyebrow</label>
                    <input
                      type="text"
                      className={inputCls}
                      value={formData.problemSection?.eyebrow || 'THE PROBLEM WE SOLVE'}
                      onChange={(e) => updateField('problemSection.eyebrow', e.target.value)}
                      placeholder="THE PROBLEM WE SOLVE"
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Primary Title</label>
                    <input
                      type="text"
                      className={inputCls}
                      value={formData.problemSection?.title || 'The Silent Cost of'}
                      onChange={(e) => updateField('problemSection.title', e.target.value)}
                      placeholder="The Silent Cost of"
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Highlight Title (Teal)</label>
                    <input
                      type="text"
                      className={inputCls}
                      value={formData.problemSection?.highlightTitle || ''}
                      onChange={(e) => updateField('problemSection.highlightTitle', e.target.value)}
                      placeholder="Unmonitored Water Infrastructure"
                    />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Section Narrative Description</label>
                  <textarea
                    rows={3}
                    className={textareaCls}
                    value={formData.problemSection?.description || ''}
                    onChange={(e) => updateField('problemSection.description', e.target.value)}
                    placeholder="Across residential societies, commercial facilities, and municipal networks, traditional water systems operate entirely unmonitored..."
                  />
                </div>

                <div>
                  <label className={labelCls}>Impact Summary Callout (Teal Badge Callout)</label>
                  <input
                    type="text"
                    className={inputCls}
                    value={formData.problemSection?.impactSummary || ''}
                    onChange={(e) => updateField('problemSection.impactSummary', e.target.value)}
                    placeholder="Over 40% of pumped municipal and groundwater is lost to preventable distribution leaks..."
                  />
                  <p className={helperCls}>Renders as a prominent summary callout below the problem cards.</p>
                </div>

                {/* Problem Cards List */}
                <div className="pt-3 border-t border-border/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-foreground">
                        Infrastructure Vulnerability Cards ({formData.problemSection?.items?.length || 0})
                      </h4>
                      <p className="text-[10px] text-muted-foreground">
                        Concrete failure modes rendered with severity tags, calculated losses, and impact metrics.
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs flex items-center gap-1.5"
                      onClick={() => {
                        const current = formData.problemSection?.items || [];
                        const newItem = {
                          icon: 'AlertTriangle',
                          title: 'Unattended Tank Overflows',
                          description: 'Pumps running past capacity dump tens of thousands of litres daily.',
                          severity: 'Critical Waste',
                          impact: '20,000–50,000L lost weekly per building',
                          order: current.length + 1,
                          isActive: true,
                        };
                        updateField('problemSection.items', [...current, newItem]);
                      }}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Problem Card</span>
                    </Button>
                  </div>

                  {(!formData.problemSection?.items || formData.problemSection.items.length === 0) ? (
                    <div className="text-center py-5 text-xs text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border">
                      No problem cards defined. Click "Add Problem Card" to add failure modes.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {formData.problemSection.items.map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-background/80 border border-border/70 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-teal-600 dark:text-teal-400">
                              Problem #{idx + 1}: {item.title || 'Untitled'}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const list = [...formData.problemSection!.items!];
                                list.splice(idx, 1);
                                updateField('problemSection.items', list);
                              }}
                              className="p-1 rounded-md text-red-500 hover:bg-red-500/10 cursor-pointer"
                              title="Delete Problem Card"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                            <div>
                              <span className="text-[10px] text-muted-foreground font-semibold block">Card Title</span>
                              <input
                                type="text"
                                className={inputCls}
                                value={item.title || ''}
                                onChange={(e) => {
                                  const list = [...formData.problemSection!.items!];
                                  list[idx] = { ...list[idx], title: e.target.value };
                                  updateField('problemSection.items', list);
                                }}
                                placeholder="e.g. Unattended Overhead Tank Overflows"
                              />
                            </div>

                            <div>
                              <span className="text-[10px] text-muted-foreground font-semibold block">Severity Tag</span>
                              <input
                                type="text"
                                className={inputCls}
                                value={item.severity || ''}
                                onChange={(e) => {
                                  const list = [...formData.problemSection!.items!];
                                  list[idx] = { ...list[idx], severity: e.target.value };
                                  updateField('problemSection.items', list);
                                }}
                                placeholder="e.g. Critical Waste / Structural Threat"
                              />
                            </div>

                            <div>
                              <span className="text-[10px] text-muted-foreground font-semibold block">Impact Metric / Stat</span>
                              <input
                                type="text"
                                className={inputCls}
                                value={item.impact || ''}
                                onChange={(e) => {
                                  const list = [...formData.problemSection!.items!];
                                  list[idx] = { ...list[idx], impact: e.target.value };
                                  updateField('problemSection.items', list);
                                }}
                                placeholder="e.g. 20,000–50,000L lost weekly per building"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5">
                            <div className="md:col-span-3">
                              <span className="text-[10px] text-muted-foreground font-semibold block">Description</span>
                              <input
                                type="text"
                                className={inputCls}
                                value={item.description || ''}
                                onChange={(e) => {
                                  const list = [...formData.problemSection!.items!];
                                  list[idx] = { ...list[idx], description: e.target.value };
                                  updateField('problemSection.items', list);
                                }}
                                placeholder="Detailed operational explanation..."
                              />
                            </div>

                            <div>
                              <span className="text-[10px] text-muted-foreground font-semibold block">Icon Key</span>
                              <input
                                type="text"
                                className={inputCls}
                                value={item.icon || 'AlertTriangle'}
                                onChange={(e) => {
                                  const list = [...formData.problemSection!.items!];
                                  list[idx] = { ...list[idx], icon: e.target.value };
                                  updateField('problemSection.items', list);
                                }}
                                placeholder="AlertTriangle, Droplets, Layers, Clock"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* ── 2. SOLUTION OVERVIEW HEADER ─────────────────────────────── */}
              <div className={sectionCardCls}>
                <div className="border-b border-border/60 pb-3">
                  <h3 className="text-sm font-bold text-foreground">Section 2: Solution Overview & Architecture</h3>
                  <p className="text-[11px] text-muted-foreground">
                    The core narrative and dual-engine architecture configuration.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Section Eyebrow</label>
                    <input
                      type="text"
                      className={inputCls}
                      value={formData.overview?.eyebrow || 'DUAL-ENGINE ARCHITECTURE'}
                      onChange={(e) => updateField('overview.eyebrow', e.target.value)}
                      placeholder="DUAL-ENGINE ARCHITECTURE"
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Highlight Heading Part (Teal)</label>
                    <input
                      type="text"
                      className={inputCls}
                      value={formData.overview?.highlightTitle || ''}
                      onChange={(e) => updateField('overview.highlightTitle', e.target.value)}
                      placeholder="e.g. Intelligent Water Rules."
                    />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Main Heading</label>
                  <input
                    type="text"
                    className={inputCls}
                    value={formData.overview?.title || ''}
                    onChange={(e) => updateField('overview.title', e.target.value)}
                    placeholder="e.g. Practical Hardware Devices."
                  />
                  <p className={helperCls}>Large bold heading introducing the section narrative.</p>
                </div>

                <div>
                  <label className={labelCls}>Overview Narrative Paragraph</label>
                  <textarea
                    rows={4}
                    className={textareaCls}
                    value={formData.overview?.description || ''}
                    onChange={(e) => updateField('overview.description', e.target.value)}
                    placeholder="Comprehensive explanation of how this solution operates in the field..."
                  />
                  <p className={helperCls}>Renders as the central body paragraph on the public website.</p>
                </div>
              </div>

              {/* ── 3. DUAL-ENGINE ARCHITECTURE (HARDWARE VS SOFTWARE) ───────── */}
              <div className={sectionCardCls}>
                <div className="border-b border-border/60 pb-3">
                  <h3 className="text-sm font-bold text-foreground">Dual-Engine System: Hardware vs Software Cards</h3>
                  <p className="text-[11px] text-muted-foreground">
                    Physical device specs (Card 1) paired with cloud intelligence software capabilities (Card 2).
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Card 1: Physical Hardware Device */}
                  <div className="p-4 rounded-xl bg-background/80 border border-teal-500/30 space-y-3">
                    <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                      <span className="w-2 h-2 rounded-full bg-teal-500" />
                      <h4 className="text-xs font-bold text-foreground">Engine 1: Physical Hardware Device</h4>
                    </div>

                    <div>
                      <label className={labelCls}>Badge Tag</label>
                      <input
                        type="text"
                        className={inputCls}
                        value={formData.overview?.dualEngine?.hardware?.tag || 'FIELD HARDWARE'}
                        onChange={(e) => updateField('overview.dualEngine.hardware.tag', e.target.value)}
                        placeholder="FIELD HARDWARE"
                      />
                    </div>

                    <div>
                      <label className={labelCls}>Hardware Title</label>
                      <input
                        type="text"
                        className={inputCls}
                        value={formData.overview?.dualEngine?.hardware?.title || ''}
                        onChange={(e) => updateField('overview.dualEngine.hardware.title', e.target.value)}
                        placeholder="Aqua Saver 3D-Module & Actuator"
                      />
                    </div>

                    <div>
                      <label className={labelCls}>Description</label>
                      <textarea
                        rows={3}
                        className={textareaCls}
                        value={formData.overview?.dualEngine?.hardware?.description || ''}
                        onChange={(e) => updateField('overview.dualEngine.hardware.description', e.target.value)}
                        placeholder="Ruggedized, IP68 waterproof physical device engineered for Indian water conditions..."
                      />
                    </div>

                    <div>
                      <label className={labelCls}>Hardware Key Features (One per line)</label>
                      <textarea
                        rows={4}
                        className={textareaCls}
                        value={(formData.overview?.dualEngine?.hardware?.features || []).join('\n')}
                        onChange={(e) => {
                          const lines = e.target.value.split('\n').filter((l) => l.trim().length > 0);
                          updateField('overview.dualEngine.hardware.features', lines);
                        }}
                        placeholder="Non-invasive clamp-on ultrasonic chambers&#10;Automated motorized valve controller&#10;Continuous vibration acoustic array&#10;Internal 5-year battery backup"
                      />
                      <p className={helperCls}>Each line appears as a bullet point with a green checkmark.</p>
                    </div>
                  </div>

                  {/* Card 2: Cloud Software Platform */}
                  <div className="p-4 rounded-xl bg-background/80 border border-teal-500/30 space-y-3">
                    <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                      <span className="w-2 h-2 rounded-full bg-cyan-500" />
                      <h4 className="text-xs font-bold text-foreground">Engine 2: Cloud & Edge Platform</h4>
                    </div>

                    <div>
                      <label className={labelCls}>Badge Tag</label>
                      <input
                        type="text"
                        className={inputCls}
                        value={formData.overview?.dualEngine?.software?.tag || 'CLOUD & EDGE PLATFORM'}
                        onChange={(e) => updateField('overview.dualEngine.software.tag', e.target.value)}
                        placeholder="CLOUD & EDGE PLATFORM"
                      />
                    </div>

                    <div>
                      <label className={labelCls}>Platform Title</label>
                      <input
                        type="text"
                        className={inputCls}
                        value={formData.overview?.dualEngine?.software?.title || ''}
                        onChange={(e) => updateField('overview.dualEngine.software.title', e.target.value)}
                        placeholder="Veenero Water Management Software"
                      />
                    </div>

                    <div>
                      <label className={labelCls}>Description</label>
                      <textarea
                        rows={3}
                        className={textareaCls}
                        value={formData.overview?.dualEngine?.software?.description || ''}
                        onChange={(e) => updateField('overview.dualEngine.software.description', e.target.value)}
                        placeholder="Central intelligence platform ingesting millisecond telemetry..."
                      />
                    </div>

                    <div>
                      <label className={labelCls}>Software Key Capabilities (One per line)</label>
                      <textarea
                        rows={4}
                        className={textareaCls}
                        value={(formData.overview?.dualEngine?.software?.features || []).join('\n')}
                        onChange={(e) => {
                          const lines = e.target.value.split('\n').filter((l) => l.trim().length > 0);
                          updateField('overview.dualEngine.software.features', lines);
                        }}
                        placeholder="Sub-second hydraulic anomaly detection&#10;Automated time-of-day pumping rules&#10;Zone-wise consumption budgeting&#10;Audit-ready ESG water balance reports"
                      />
                      <p className={helperCls}>Each line appears as a bullet point with a green checkmark.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── 4. REPEATABLE OVERVIEW CONTENT BLOCKS ───────────────────── */}
              <div className={sectionCardCls}>
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Key Highlight Blocks / Bullets</h3>
                    <p className="text-[11px] text-muted-foreground">
                      Inline bullet points and summary cards rendered beneath the overview narrative.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs flex items-center gap-1.5"
                    onClick={() => {
                      const current = formData.overview?.blocks || [];
                      const newItem = {
                        title: '24/7 Automated Monitoring',
                        description: 'Continuous sampling with instant edge alerts.',
                        icon: 'ShieldCheck',
                      };
                      updateField('overview.blocks', [...current, newItem]);
                    }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Block</span>
                  </Button>
                </div>

                {(!formData.overview?.blocks || formData.overview.blocks.length === 0) ? (
                  <div className="text-center py-6 text-xs text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border">
                    No overview blocks configured yet. Click "Add Block" above to add key bullet points.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {formData.overview.blocks.map((block: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-background/80 border border-border/70 flex flex-col md:flex-row items-start md:items-center justify-between gap-3"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 flex-1 w-full">
                          <div>
                            <span className="text-[10px] text-muted-foreground font-semibold block">Title</span>
                            <input
                              type="text"
                              className={inputCls}
                              value={block.title || ''}
                              onChange={(e) => {
                                const list = [...formData.overview!.blocks!];
                                list[idx] = { ...list[idx], title: e.target.value };
                                updateField('overview.blocks', list);
                              }}
                              placeholder="e.g. Continuous Real-time Ingestion"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <span className="text-[10px] text-muted-foreground font-semibold block">Description</span>
                            <input
                              type="text"
                              className={inputCls}
                              value={block.description || ''}
                              onChange={(e) => {
                                const list = [...formData.overview!.blocks!];
                                list[idx] = { ...list[idx], description: e.target.value };
                                updateField('overview.blocks', list);
                              }}
                              placeholder="Brief summary statement..."
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0 pt-2 md:pt-0">
                          <button
                            type="button"
                            onClick={() => {
                              const list = [...formData.overview!.blocks!];
                              list.splice(idx, 1);
                              updateField('overview.blocks', list);
                            }}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 cursor-pointer"
                            title="Delete Block"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* TAB 4: MEDIA                                                        */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'MEDIA' && (
            <div className="max-w-4xl space-y-6">
              <div className={sectionCardCls}>
                <div className="border-b border-border/60 pb-3">
                  <h3 className="text-sm font-bold text-foreground">Cloudinary Media Assets</h3>
                  <p className="text-[11px] text-muted-foreground">
                    Connect images, schematics, and social preview assets using the Veenero Media Library.
                  </p>
                </div>

                {/* Hero Main Image */}
                <div className="p-4 rounded-xl bg-background/80 border border-border/70 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1 max-w-lg">
                    <span className="text-xs font-bold text-foreground block">Hero Featured Visual</span>
                    <p className="text-[11px] text-muted-foreground">
                      The primary technical image rendered inside the concentric rings of the hero section.
                    </p>
                    <input
                      type="text"
                      className={inputCls}
                      value={formData.heroImage || ''}
                      onChange={(e) => updateField('heroImage', e.target.value)}
                      placeholder="https://res.cloudinary.com/... or /src/assets/..."
                    />
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {formData.heroImage && (
                      <img
                        src={formData.heroImage}
                        alt="Hero preview"
                        className="w-20 h-14 object-cover rounded-lg border border-border"
                      />
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs flex items-center gap-1.5"
                      onClick={() =>
                        handleOpenMediaPicker('Select Hero Visual', (url, publicId) => {
                          updateField('heroImage', url);
                          if (publicId) updateField('heroMediaPublicId', publicId);
                        })
                      }
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Pick Media</span>
                    </Button>
                  </div>
                </div>

                {/* Hero Image Alt Text */}
                <div className="p-4 rounded-xl bg-background/80 border border-border/70">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-foreground block">Hero Image Alt Text</span>
                    <input
                      type="text"
                      className={inputCls}
                      value={formData.heroImageAlt || ''}
                      onChange={(e) => updateField('heroImageAlt', e.target.value)}
                      placeholder="e.g. Aqua Saver Water Conservative Device"
                    />
                    <p className="text-[11px] text-muted-foreground">Used for accessibility and SEO.</p>
                  </div>
                </div>

                {/* Social Share OG Image */}
                <div className="p-4 rounded-xl bg-background/80 border border-border/70 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1 max-w-lg">
                    <span className="text-xs font-bold text-foreground block">OpenGraph / Social Share Media</span>
                    <p className="text-[11px] text-muted-foreground">
                      Rendered when sharing the link on LinkedIn, Twitter, and WhatsApp (1200x630px recommended).
                    </p>
                    <input
                      type="text"
                      className={inputCls}
                      value={formData.seo?.ogImage || ''}
                      onChange={(e) => updateField('seo.ogImage', e.target.value)}
                      placeholder="https://res.cloudinary.com/..."
                    />
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {formData.seo?.ogImage && (
                      <img
                        src={formData.seo.ogImage}
                        alt="OG preview"
                        className="w-20 h-14 object-cover rounded-lg border border-border"
                      />
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs flex items-center gap-1.5"
                      onClick={() =>
                        handleOpenMediaPicker('Select Social OG Image', (url, publicId) => {
                          updateField('seo.ogImage', url);
                          if (publicId) updateField('seo.ogImagePublicId', publicId);
                        })
                      }
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Pick Media</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* TAB 5: BENEFITS                                                     */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'BENEFITS' && (
            <div className="max-w-4xl space-y-6">
              <div className={sectionCardCls}>
                <div className="border-b border-border/60 pb-3">
                  <h3 className="text-sm font-bold text-foreground">Benefits Section Header</h3>
                  <p className="text-[11px] text-muted-foreground">
                    Header text introducing the quantifiable impact and ROI metrics.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Section Eyebrow</label>
                    <input
                      type="text"
                      className={inputCls}
                      value={formData.benefits?.eyebrow || 'QUANTIFIABLE VALUE'}
                      onChange={(e) => updateField('benefits.eyebrow', e.target.value)}
                      placeholder="QUANTIFIABLE VALUE"
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Section Title</label>
                    <input
                      type="text"
                      className={inputCls}
                      value={formData.benefits?.title || 'Impact Across Infrastructure'}
                      onChange={(e) => updateField('benefits.title', e.target.value)}
                      placeholder="Impact Across Infrastructure"
                    />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Section Description</label>
                  <textarea
                    rows={2}
                    className={textareaCls}
                    value={formData.benefits?.description || ''}
                    onChange={(e) => updateField('benefits.description', e.target.value)}
                    placeholder="Measure exact ROI, water savings, and energy reductions..."
                  />
                </div>
              </div>

              {/* Repeatable Benefits Metrics CRUD */}
              <div className={sectionCardCls}>
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      Benefit Metrics List ({formData.benefits?.metrics?.length || 0})
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                      Counter cards with animated numbers, ranges, and quantifiable savings.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs flex items-center gap-1.5"
                    onClick={() => {
                      const current = formData.benefits?.metrics || [];
                      const newItem = {
                        target: 40,
                        suffix: '%',
                        prefix: '',
                        displayRange: '30-45%',
                        label: 'Water Loss Reduction',
                        description: 'Rapid mitigation of undetected distribution leakages.',
                        order: current.length + 1,
                        isActive: true,
                      };
                      updateField('benefits.metrics', [...current, newItem]);
                    }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Benefit Metric</span>
                  </Button>
                </div>

                {(!formData.benefits?.metrics || formData.benefits.metrics.length === 0) ? (
                  <div className="text-center py-6 text-xs text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border">
                    No benefit metrics added yet. Click "Add Benefit Metric" above.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {formData.benefits.metrics.map((m: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-background/80 border border-border/70 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-teal-600 dark:text-teal-400">
                            Metric #{idx + 1}: {m.label || 'Untitled'}
                          </span>
                          <div className="flex items-center gap-2">
                            <label className="flex items-center gap-1 text-[11px] font-semibold cursor-pointer">
                              <input
                                type="checkbox"
                                checked={m.isActive !== false}
                                onChange={(e) => {
                                  const list = [...formData.benefits!.metrics!];
                                  list[idx] = { ...list[idx], isActive: e.target.checked };
                                  updateField('benefits.metrics', list);
                                }}
                                className="rounded text-teal-600 w-3.5 h-3.5"
                              />
                              <span>Active</span>
                            </label>

                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => {
                                const list = [...formData.benefits!.metrics!];
                                const temp = list[idx];
                                list[idx] = list[idx - 1];
                                list[idx - 1] = temp;
                                updateField('benefits.metrics', list);
                              }}
                              className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === formData.benefits!.metrics!.length - 1}
                              onClick={() => {
                                const list = [...formData.benefits!.metrics!];
                                const temp = list[idx];
                                list[idx] = list[idx + 1];
                                list[idx + 1] = temp;
                                updateField('benefits.metrics', list);
                              }}
                              className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const list = [...formData.benefits!.metrics!];
                                list.splice(idx, 1);
                                updateField('benefits.metrics', list);
                              }}
                              className="p-1 rounded hover:bg-red-500/10 text-red-500 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                          <div>
                            <span className="text-[10px] text-muted-foreground font-semibold block">Target Value</span>
                            <input
                              type="number"
                              className={inputCls}
                              value={m.target ?? 40}
                              onChange={(e) => {
                                const list = [...formData.benefits!.metrics!];
                                list[idx] = { ...list[idx], target: parseFloat(e.target.value) || 0 };
                                updateField('benefits.metrics', list);
                              }}
                            />
                          </div>

                          <div>
                            <span className="text-[10px] text-muted-foreground font-semibold block">Suffix (e.g. %)</span>
                            <input
                              type="text"
                              className={inputCls}
                              value={m.suffix || ''}
                              onChange={(e) => {
                                const list = [...formData.benefits!.metrics!];
                                list[idx] = { ...list[idx], suffix: e.target.value };
                                updateField('benefits.metrics', list);
                              }}
                              placeholder="%"
                            />
                          </div>

                          <div>
                            <span className="text-[10px] text-muted-foreground font-semibold block">Display Range</span>
                            <input
                              type="text"
                              className={inputCls}
                              value={m.displayRange || ''}
                              onChange={(e) => {
                                const list = [...formData.benefits!.metrics!];
                                list[idx] = { ...list[idx], displayRange: e.target.value };
                                updateField('benefits.metrics', list);
                              }}
                              placeholder="30-45%"
                            />
                          </div>

                          <div>
                            <span className="text-[10px] text-muted-foreground font-semibold block">Label</span>
                            <input
                              type="text"
                              className={inputCls}
                              value={m.label || ''}
                              onChange={(e) => {
                                const list = [...formData.benefits!.metrics!];
                                list[idx] = { ...list[idx], label: e.target.value };
                                updateField('benefits.metrics', list);
                              }}
                              placeholder="Water Loss Reduction"
                            />
                          </div>
                        </div>

                        <div>
                          <span className="text-[10px] text-muted-foreground font-semibold block">Description</span>
                          <input
                            type="text"
                            className={inputCls}
                            value={m.description || ''}
                            onChange={(e) => {
                              const list = [...formData.benefits!.metrics!];
                              list[idx] = { ...list[idx], description: e.target.value };
                              updateField('benefits.metrics', list);
                            }}
                            placeholder="Detailed explanation of measurable benefit..."
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* TAB 6: FEATURES                                                     */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'FEATURES' && (
            <div className="max-w-4xl space-y-6">
              <div className={sectionCardCls}>
                <div className="border-b border-border/60 pb-3">
                  <h3 className="text-sm font-bold text-foreground">Features Section Header</h3>
                  <p className="text-[11px] text-muted-foreground">
                    Section headings introducing granular system capabilities.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Section Eyebrow</label>
                    <input
                      type="text"
                      className={inputCls}
                      value={formData.features?.eyebrow || 'COMPREHENSIVE CAPABILITIES'}
                      onChange={(e) => updateField('features.eyebrow', e.target.value)}
                      placeholder="COMPREHENSIVE CAPABILITIES"
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Section Title</label>
                    <input
                      type="text"
                      className={inputCls}
                      value={formData.features?.title || 'Key System Features'}
                      onChange={(e) => updateField('features.title', e.target.value)}
                      placeholder="Key System Features"
                    />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Section Description</label>
                  <textarea
                    rows={2}
                    className={textareaCls}
                    value={formData.features?.description || ''}
                    onChange={(e) => updateField('features.description', e.target.value)}
                    placeholder="Everything your engineering team needs..."
                  />
                </div>
              </div>

              {/* Repeatable Features Items CRUD */}
              <div className={sectionCardCls}>
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      Features List ({formData.features?.items?.length || 0})
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                      Granular capability cards with tags and icons.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs flex items-center gap-1.5"
                    onClick={() => {
                      const current = formData.features?.items || [];
                      const newItem = {
                        title: 'Telemetry Analytics',
                        description: 'Real-time telemetry stream processing.',
                        icon: 'Activity',
                        tag: 'Core Engine',
                        order: current.length + 1,
                        isActive: true,
                      };
                      updateField('features.items', [...current, newItem]);
                    }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Feature</span>
                  </Button>
                </div>

                {(!formData.features?.items || formData.features.items.length === 0) ? (
                  <div className="text-center py-6 text-xs text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border">
                    No features configured yet. Click "Add Feature" above.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {formData.features.items.map((f: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-background/80 border border-border/70 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-foreground">
                            Feature #{idx + 1}: {f.title || 'Untitled'}
                          </span>
                          <div className="flex items-center gap-2">
                            <label className="flex items-center gap-1 text-[11px] font-semibold cursor-pointer">
                              <input
                                type="checkbox"
                                checked={f.isActive !== false}
                                onChange={(e) => {
                                  const list = [...formData.features!.items!];
                                  list[idx] = { ...list[idx], isActive: e.target.checked };
                                  updateField('features.items', list);
                                }}
                                className="rounded text-teal-600 w-3.5 h-3.5"
                              />
                              <span>Active</span>
                            </label>

                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => {
                                const list = [...formData.features!.items!];
                                const temp = list[idx];
                                list[idx] = list[idx - 1];
                                list[idx - 1] = temp;
                                updateField('features.items', list);
                              }}
                              className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === formData.features!.items!.length - 1}
                              onClick={() => {
                                const list = [...formData.features!.items!];
                                const temp = list[idx];
                                list[idx] = list[idx + 1];
                                list[idx + 1] = temp;
                                updateField('features.items', list);
                              }}
                              className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const list = [...formData.features!.items!];
                                list.splice(idx, 1);
                                updateField('features.items', list);
                              }}
                              className="p-1 rounded hover:bg-red-500/10 text-red-500 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                          <div>
                            <span className="text-[10px] text-muted-foreground font-semibold block">Title</span>
                            <input
                              type="text"
                              className={inputCls}
                              value={f.title || ''}
                              onChange={(e) => {
                                const list = [...formData.features!.items!];
                                list[idx] = { ...list[idx], title: e.target.value };
                                updateField('features.items', list);
                              }}
                              placeholder="e.g. Telemetry Analytics"
                            />
                          </div>

                          <div>
                            <span className="text-[10px] text-muted-foreground font-semibold block">Tag / Badge</span>
                            <input
                              type="text"
                              className={inputCls}
                              value={f.tag || ''}
                              onChange={(e) => {
                                const list = [...formData.features!.items!];
                                list[idx] = { ...list[idx], tag: e.target.value };
                                updateField('features.items', list);
                              }}
                              placeholder="e.g. Core Engine"
                            />
                          </div>

                          <div>
                            <span className="text-[10px] text-muted-foreground font-semibold block">Icon Key</span>
                            <input
                              type="text"
                              className={inputCls}
                              value={f.icon || 'Activity'}
                              onChange={(e) => {
                                const list = [...formData.features!.items!];
                                list[idx] = { ...list[idx], icon: e.target.value };
                                updateField('features.items', list);
                              }}
                              placeholder="Activity, Shield, Gauge"
                            />
                          </div>
                        </div>

                        <div>
                          <span className="text-[10px] text-muted-foreground font-semibold block">Description</span>
                          <textarea
                            rows={2}
                            className={textareaCls}
                            value={f.description || ''}
                            onChange={(e) => {
                              const list = [...formData.features!.items!];
                              list[idx] = { ...list[idx], description: e.target.value };
                              updateField('features.items', list);
                            }}
                            placeholder="Explanation of this capability..."
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* TAB 7: PROCESS (HOW IT WORKS)                                       */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'PROCESS' && (
            <div className="max-w-4xl space-y-6">
              <div className={sectionCardCls}>
                <div className="border-b border-border/60 pb-3">
                  <h3 className="text-sm font-bold text-foreground">Process Section Header</h3>
                  <p className="text-[11px] text-muted-foreground">
                    The structured sequential deployment process / workflow.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Section Eyebrow</label>
                    <input
                      type="text"
                      className={inputCls}
                      value={formData.howItWorks?.eyebrow || 'WORKFLOW & PROCESS'}
                      onChange={(e) => updateField('howItWorks.eyebrow', e.target.value)}
                      placeholder="WORKFLOW & PROCESS"
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Section Title</label>
                    <input
                      type="text"
                      className={inputCls}
                      value={formData.howItWorks?.title || 'How The System Deploys & Operates'}
                      onChange={(e) => updateField('howItWorks.title', e.target.value)}
                      placeholder="How The System Deploys & Operates"
                    />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Section Description</label>
                  <textarea
                    rows={2}
                    className={textareaCls}
                    value={formData.howItWorks?.description || ''}
                    onChange={(e) => updateField('howItWorks.description', e.target.value)}
                    placeholder="Clear breakdown of sequential deployment stages..."
                  />
                </div>
              </div>

              {/* Repeatable Process Steps CRUD */}
              <div className={sectionCardCls}>
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      Sequential Steps ({formData.howItWorks?.steps?.length || 0})
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                      Numbered sequential steps (01, 02, 03...) rendered with icons and badges.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs flex items-center gap-1.5"
                    onClick={() => {
                      const current = formData.howItWorks?.steps || [];
                      const stepNum = String(current.length + 1).padStart(2, '0');
                      const newItem = {
                        step: stepNum,
                        title: 'Field Sensor Installation',
                        subtitle: 'Phase 1: Hardware Setup',
                        description: 'Non-invasive acoustic clamp installation.',
                        icon: 'Radio',
                        order: current.length + 1,
                        isActive: true,
                      };
                      updateField('howItWorks.steps', [...current, newItem]);
                    }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Step</span>
                  </Button>
                </div>

                {(!formData.howItWorks?.steps || formData.howItWorks.steps.length === 0) ? (
                  <div className="text-center py-6 text-xs text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border">
                    No process steps added yet. Click "Add Step" above.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {formData.howItWorks.steps.map((s: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-background/80 border border-border/70 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-teal-600 dark:text-teal-400">
                            Step {s.step || idx + 1}: {s.title || 'Untitled'}
                          </span>
                          <div className="flex items-center gap-2">
                            <label className="flex items-center gap-1 text-[11px] font-semibold cursor-pointer">
                              <input
                                type="checkbox"
                                checked={s.isActive !== false}
                                onChange={(e) => {
                                  const list = [...formData.howItWorks!.steps!];
                                  list[idx] = { ...list[idx], isActive: e.target.checked };
                                  updateField('howItWorks.steps', list);
                                }}
                                className="rounded text-teal-600 w-3.5 h-3.5"
                              />
                              <span>Active</span>
                            </label>

                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => {
                                const list = [...formData.howItWorks!.steps!];
                                const temp = list[idx];
                                list[idx] = list[idx - 1];
                                list[idx - 1] = temp;
                                updateField('howItWorks.steps', list);
                              }}
                              className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === formData.howItWorks!.steps!.length - 1}
                              onClick={() => {
                                const list = [...formData.howItWorks!.steps!];
                                const temp = list[idx];
                                list[idx] = list[idx + 1];
                                list[idx + 1] = temp;
                                updateField('howItWorks.steps', list);
                              }}
                              className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const list = [...formData.howItWorks!.steps!];
                                list.splice(idx, 1);
                                updateField('howItWorks.steps', list);
                              }}
                              className="p-1 rounded hover:bg-red-500/10 text-red-500 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5">
                          <div>
                            <span className="text-[10px] text-muted-foreground font-semibold block">Step Identifier</span>
                            <input
                              type="text"
                              className={inputCls}
                              value={s.step || ''}
                              onChange={(e) => {
                                const list = [...formData.howItWorks!.steps!];
                                list[idx] = { ...list[idx], step: e.target.value };
                                updateField('howItWorks.steps', list);
                              }}
                              placeholder="01"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <span className="text-[10px] text-muted-foreground font-semibold block">Title</span>
                            <input
                              type="text"
                              className={inputCls}
                              value={s.title || ''}
                              onChange={(e) => {
                                const list = [...formData.howItWorks!.steps!];
                                list[idx] = { ...list[idx], title: e.target.value };
                                updateField('howItWorks.steps', list);
                              }}
                              placeholder="e.g. Field Sensor Installation"
                            />
                          </div>

                          <div>
                            <span className="text-[10px] text-muted-foreground font-semibold block">Icon Key</span>
                            <input
                              type="text"
                              className={inputCls}
                              value={s.icon || 'Radio'}
                              onChange={(e) => {
                                const list = [...formData.howItWorks!.steps!];
                                list[idx] = { ...list[idx], icon: e.target.value };
                                updateField('howItWorks.steps', list);
                              }}
                              placeholder="Radio, Wifi, Cpu"
                            />
                          </div>
                        </div>

                        <div>
                          <span className="text-[10px] text-muted-foreground font-semibold block">Description</span>
                          <textarea
                            rows={2}
                            className={textareaCls}
                            value={s.description || ''}
                            onChange={(e) => {
                              const list = [...formData.howItWorks!.steps!];
                              list[idx] = { ...list[idx], description: e.target.value };
                              updateField('howItWorks.steps', list);
                            }}
                            placeholder="Detailed technical workflow explanation..."
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* TAB 8: TECH & METRICS                                               */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'TECH & METRICS' && (
            <div className="max-w-4xl space-y-6">
              <div className={sectionCardCls}>
                <div className="border-b border-border/60 pb-3">
                  <h3 className="text-sm font-bold text-foreground">Technical Architecture Header</h3>
                  <p className="text-[11px] text-muted-foreground">
                    Hardware specifications, edge-to-cloud pipelines, and cryptographic trust indicators.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Section Eyebrow</label>
                    <input
                      type="text"
                      className={inputCls}
                      value={formData.techSection?.eyebrow || 'TECHNICAL ARCHITECTURE'}
                      onChange={(e) => updateField('techSection.eyebrow', e.target.value)}
                      placeholder="TECHNICAL ARCHITECTURE"
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Section Title</label>
                    <input
                      type="text"
                      className={inputCls}
                      value={formData.techSection?.title || 'Edge-to-Cloud Pipeline'}
                      onChange={(e) => updateField('techSection.title', e.target.value)}
                      placeholder="Edge-to-Cloud Pipeline"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Subtitle / Security Statement</label>
                    <input
                      type="text"
                      className={inputCls}
                      value={formData.techSection?.subtitle || ''}
                      onChange={(e) => updateField('techSection.subtitle', e.target.value)}
                      placeholder="Enterprise Security & Resilience"
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Technical Description</label>
                    <input
                      type="text"
                      className={inputCls}
                      value={formData.techSection?.description || ''}
                      onChange={(e) => updateField('techSection.description', e.target.value)}
                      placeholder="Encrypted telemetry ingestion pipeline..."
                    />
                  </div>
                </div>
              </div>

              {/* Repeatable Diagram Steps */}
              <div className={sectionCardCls}>
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      Pipeline Architecture Stages ({formData.techSection?.diagramSteps?.length || 0})
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                      Architectural layers (e.g. Edge Hardware, LoRaWAN Gateway, Cloud Ingestion, Neural Analytics).
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs flex items-center gap-1.5"
                    onClick={() => {
                      const current = formData.techSection?.diagramSteps || [];
                      const newItem = {
                        label: 'Edge IoT Hardware',
                        desc: 'Acoustic & pressure transceivers sampling at 100Hz.',
                        icon: 'Radio',
                      };
                      updateField('techSection.diagramSteps', [...current, newItem]);
                    }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Architecture Stage</span>
                  </Button>
                </div>

                {(!formData.techSection?.diagramSteps || formData.techSection.diagramSteps.length === 0) ? (
                  <div className="text-center py-6 text-xs text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border">
                    No architecture stages added yet. Click "Add Architecture Stage" above.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {formData.techSection.diagramSteps.map((step: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-background/80 border border-border/70 flex flex-col md:flex-row items-start md:items-center justify-between gap-3"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 flex-1 w-full">
                          <div>
                            <span className="text-[10px] text-muted-foreground font-semibold block">Layer Label</span>
                            <input
                              type="text"
                              className={inputCls}
                              value={step.label || ''}
                              onChange={(e) => {
                                const list = [...formData.techSection!.diagramSteps!];
                                list[idx] = { ...list[idx], label: e.target.value };
                                updateField('techSection.diagramSteps', list);
                              }}
                              placeholder="e.g. Edge IoT Hardware"
                            />
                          </div>

                          <div>
                            <span className="text-[10px] text-muted-foreground font-semibold block">Icon Key</span>
                            <input
                              type="text"
                              className={inputCls}
                              value={step.icon || 'Radio'}
                              onChange={(e) => {
                                const list = [...formData.techSection!.diagramSteps!];
                                list[idx] = { ...list[idx], icon: e.target.value };
                                updateField('techSection.diagramSteps', list);
                              }}
                              placeholder="Radio, Cpu, Layers, Sparkles"
                            />
                          </div>

                          <div>
                            <span className="text-[10px] text-muted-foreground font-semibold block">Description</span>
                            <input
                              type="text"
                              className={inputCls}
                              value={step.desc || ''}
                              onChange={(e) => {
                                const list = [...formData.techSection!.diagramSteps!];
                                list[idx] = { ...list[idx], desc: e.target.value };
                                updateField('techSection.diagramSteps', list);
                              }}
                              placeholder="Specification or function..."
                            />
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const list = [...formData.techSection!.diagramSteps!];
                            list.splice(idx, 1);
                            updateField('techSection.diagramSteps', list);
                          }}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 cursor-pointer shrink-0"
                          title="Delete Stage"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Live Telemetry & Analytics Visual Section */}
              <div className={sectionCardCls}>
                <div className="border-b border-border/60 pb-3">
                  <h3 className="text-sm font-bold text-foreground">Live Telemetry & Command Stream Visual</h3>
                  <p className="text-[11px] text-muted-foreground">
                    Real-time digital twin and telemetry counters rendered on dark high-contrast dashboard card.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Section Eyebrow</label>
                    <input
                      type="text"
                      className={inputCls}
                      value={formData.analyticsVisual?.eyebrow || 'LIVE TELEMETRY STREAM'}
                      onChange={(e) => updateField('analyticsVisual.eyebrow', e.target.value)}
                      placeholder="LIVE TELEMETRY STREAM"
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Section Title</label>
                    <input
                      type="text"
                      className={inputCls}
                      value={formData.analyticsVisual?.title || ''}
                      onChange={(e) => updateField('analyticsVisual.title', e.target.value)}
                      placeholder="Aqua Saver Field Telemetry Command Stream"
                    />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Section Description</label>
                  <textarea
                    rows={2}
                    className={textareaCls}
                    value={formData.analyticsVisual?.description || ''}
                    onChange={(e) => updateField('analyticsVisual.description', e.target.value)}
                    placeholder="Simulated real-time monitoring of connected Aqua Saver modules across distribution zones..."
                  />
                </div>

                {/* Repeatable Stats Grid */}
                <div className="pt-2 border-t border-border/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-foreground">
                        Telemetry Counters & KPI Widgets ({formData.analyticsVisual?.stats?.length || 0})
                      </h4>
                      <p className="text-[10px] text-muted-foreground">
                        Live digit counters rendered across the top banner of the telemetry terminal.
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs flex items-center gap-1.5"
                      onClick={() => {
                        const current = formData.analyticsVisual?.stats || [];
                        const newItem = {
                          label: 'Active Lines',
                          value: '1,000+',
                          numericValue: 1000,
                          suffix: '',
                          change: 'All Units Healthy',
                          order: current.length + 1,
                          isActive: true,
                        };
                        updateField('analyticsVisual.stats', [...current, newItem]);
                      }}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Telemetry Stat</span>
                    </Button>
                  </div>

                  {(!formData.analyticsVisual?.stats || formData.analyticsVisual.stats.length === 0) ? (
                    <div className="text-center py-5 text-xs text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border">
                      No telemetry stats added yet. Click "Add Telemetry Stat" above.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {formData.analyticsVisual.stats.map((stat: any, idx: number) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-background/80 border border-border/70 flex flex-col md:flex-row items-start md:items-center justify-between gap-3"
                        >
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 flex-1 w-full">
                            <div>
                              <span className="text-[10px] text-muted-foreground font-semibold block">Label</span>
                              <input
                                type="text"
                                className={inputCls}
                                value={stat.label || ''}
                                onChange={(e) => {
                                  const list = [...formData.analyticsVisual!.stats!];
                                  list[idx] = { ...list[idx], label: e.target.value };
                                  updateField('analyticsVisual.stats', list);
                                }}
                                placeholder="Active Lines"
                              />
                            </div>

                            <div>
                              <span className="text-[10px] text-muted-foreground font-semibold block">Display Value</span>
                              <input
                                type="text"
                                className={inputCls}
                                value={stat.value || ''}
                                onChange={(e) => {
                                  const list = [...formData.analyticsVisual!.stats!];
                                  list[idx] = { ...list[idx], value: e.target.value };
                                  updateField('analyticsVisual.stats', list);
                                }}
                                placeholder="1,420+"
                              />
                            </div>

                            <div>
                              <span className="text-[10px] text-muted-foreground font-semibold block">Numeric Target</span>
                              <input
                                type="number"
                                step="any"
                                className={inputCls}
                                value={stat.numericValue ?? 0}
                                onChange={(e) => {
                                  const list = [...formData.analyticsVisual!.stats!];
                                  list[idx] = { ...list[idx], numericValue: parseFloat(e.target.value) || 0 };
                                  updateField('analyticsVisual.stats', list);
                                }}
                                placeholder="1420"
                              />
                            </div>

                            <div>
                              <span className="text-[10px] text-muted-foreground font-semibold block">Suffix</span>
                              <input
                                type="text"
                                className={inputCls}
                                value={stat.suffix || ''}
                                onChange={(e) => {
                                  const list = [...formData.analyticsVisual!.stats!];
                                  list[idx] = { ...list[idx], suffix: e.target.value };
                                  updateField('analyticsVisual.stats', list);
                                }}
                                placeholder="M Litres / % / s"
                              />
                            </div>

                            <div>
                              <span className="text-[10px] text-muted-foreground font-semibold block">Status / Change</span>
                              <input
                                type="text"
                                className={inputCls}
                                value={stat.change || ''}
                                onChange={(e) => {
                                  const list = [...formData.analyticsVisual!.stats!];
                                  list[idx] = { ...list[idx], change: e.target.value };
                                  updateField('analyticsVisual.stats', list);
                                }}
                                placeholder="+12.4% vs Baseline"
                              />
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              const list = [...formData.analyticsVisual!.stats!];
                              list.splice(idx, 1);
                              updateField('analyticsVisual.stats', list);
                            }}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 cursor-pointer shrink-0"
                            title="Delete Stat"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* TAB 9: FAQS                                                         */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'FAQS' && (
            <div className="max-w-4xl space-y-6">
              <div className={sectionCardCls}>
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      Solution FAQs ({formData.faqs?.length || 0})
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                      Specific frequently asked technical questions displayed in collapsible accordions.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs flex items-center gap-1.5"
                    onClick={() => {
                      const current = formData.faqs || [];
                      const newItem = {
                        question: 'How quickly can the system be deployed across existing pipes?',
                        answer: 'Standard non-invasive installations take under 48 hours without disrupting municipal operations.',
                        order: current.length + 1,
                        isActive: true,
                      };
                      updateField('faqs', [...current, newItem]);
                    }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add FAQ</span>
                  </Button>
                </div>

                {(!formData.faqs || formData.faqs.length === 0) ? (
                  <div className="text-center py-6 text-xs text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border">
                    No solution-specific FAQs added yet. Click "Add FAQ" above.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {formData.faqs.map((faq: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-background/80 border border-border/70 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-foreground">
                            FAQ #{idx + 1}
                          </span>
                          <div className="flex items-center gap-2">
                            <label className="flex items-center gap-1 text-[11px] font-semibold cursor-pointer">
                              <input
                                type="checkbox"
                                checked={faq.isActive !== false}
                                onChange={(e) => {
                                  const list = [...formData.faqs!];
                                  list[idx] = { ...list[idx], isActive: e.target.checked };
                                  updateField('faqs', list);
                                }}
                                className="rounded text-teal-600 w-3.5 h-3.5"
                              />
                              <span>Active</span>
                            </label>

                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => {
                                const list = [...formData.faqs!];
                                const temp = list[idx];
                                list[idx] = list[idx - 1];
                                list[idx - 1] = temp;
                                updateField('faqs', list);
                              }}
                              className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === formData.faqs!.length - 1}
                              onClick={() => {
                                const list = [...formData.faqs!];
                                const temp = list[idx];
                                list[idx] = list[idx + 1];
                                list[idx + 1] = temp;
                                updateField('faqs', list);
                              }}
                              className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const list = [...formData.faqs!];
                                list.splice(idx, 1);
                                updateField('faqs', list);
                              }}
                              className="p-1 rounded hover:bg-red-500/10 text-red-500 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <span className="text-[10px] text-muted-foreground font-semibold block">Question</span>
                          <input
                            type="text"
                            className={inputCls}
                            value={faq.question || ''}
                            onChange={(e) => {
                              const list = [...formData.faqs!];
                              list[idx] = { ...list[idx], question: e.target.value };
                              updateField('faqs', list);
                            }}
                            placeholder="e.g. How does the sensor calibrate?"
                          />
                        </div>

                        <div>
                          <span className="text-[10px] text-muted-foreground font-semibold block">Answer</span>
                          <textarea
                            rows={3}
                            className={textareaCls}
                            value={faq.answer || ''}
                            onChange={(e) => {
                              const list = [...formData.faqs!];
                              list[idx] = { ...list[idx], answer: e.target.value };
                              updateField('faqs', list);
                            }}
                            placeholder="Detailed, informative answer..."
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* TAB 10: INDUSTRIES & USE CASES                                      */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'INDUSTRIES' && (
            <div className="max-w-4xl space-y-6">
              <div className={sectionCardCls}>
                <div className="border-b border-border/60 pb-3">
                  <h3 className="text-sm font-bold text-foreground">Use Cases / Deployment Scenarios Header</h3>
                  <p className="text-[11px] text-muted-foreground">
                    Section 4 on the public page displaying real-world industrial and commercial deployment environments.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Section Eyebrow</label>
                    <input
                      type="text"
                      className={inputCls}
                      value={formData.useCases?.eyebrow || 'DEPLOYMENT SCENARIOS'}
                      onChange={(e) => updateField('useCases.eyebrow', e.target.value)}
                      placeholder="DEPLOYMENT SCENARIOS"
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Section Title</label>
                    <input
                      type="text"
                      className={inputCls}
                      value={formData.useCases?.title || 'Engineered for Diverse Environments'}
                      onChange={(e) => updateField('useCases.title', e.target.value)}
                      placeholder="Engineered for Diverse Environments"
                    />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Section Description</label>
                  <textarea
                    rows={2}
                    className={textareaCls}
                    value={formData.useCases?.description || ''}
                    onChange={(e) => updateField('useCases.description', e.target.value)}
                    placeholder="Proven performance across municipal, industrial, commercial, and utility sectors..."
                  />
                </div>
              </div>

              {/* Repeatable Use Cases Cards */}
              <div className={sectionCardCls}>
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      Use Cases / Industrial Scenarios ({formData.useCases?.items?.length || 0})
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                      Visual cards displaying sector photos, descriptions, and metrics.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs flex items-center gap-1.5"
                    onClick={() => {
                      const current = formData.useCases?.items || [];
                      const newItem = {
                        title: 'Municipal Water Distribution',
                        description: 'Continuous urban pipeline monitoring and pressure stabilization.',
                        stats: '99.9% telemetry uptime',
                        icon: 'Building',
                        image: '/src/assets/about/about-field-verification.webp',
                      };
                      updateField('useCases.items', [...current, newItem]);
                    }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Deployment Scenario</span>
                  </Button>
                </div>

                {(!formData.useCases?.items || formData.useCases.items.length === 0) ? (
                  <div className="text-center py-6 text-xs text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border">
                    No use case scenarios added yet. Click "Add Deployment Scenario" above.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {formData.useCases.items.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-background/80 border border-border/70 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-teal-600 dark:text-teal-400">
                            Scenario #{idx + 1}: {item.title || 'Untitled'}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => {
                                const list = [...formData.useCases!.items!];
                                const temp = list[idx];
                                list[idx] = list[idx - 1];
                                list[idx - 1] = temp;
                                updateField('useCases.items', list);
                              }}
                              className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === formData.useCases!.items!.length - 1}
                              onClick={() => {
                                const list = [...formData.useCases!.items!];
                                const temp = list[idx];
                                list[idx] = list[idx + 1];
                                list[idx + 1] = temp;
                                updateField('useCases.items', list);
                              }}
                              className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const list = [...formData.useCases!.items!];
                                list.splice(idx, 1);
                                updateField('useCases.items', list);
                              }}
                              className="p-1 rounded hover:bg-red-500/10 text-red-500 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                          <div>
                            <span className="text-[10px] text-muted-foreground font-semibold block">Industry / Sector Name</span>
                            <input
                              type="text"
                              className={inputCls}
                              value={item.title || ''}
                              onChange={(e) => {
                                const list = [...formData.useCases!.items!];
                                list[idx] = { ...list[idx], title: e.target.value };
                                updateField('useCases.items', list);
                              }}
                              placeholder="e.g. Municipal Water Distribution"
                            />
                          </div>

                          <div>
                            <span className="text-[10px] text-muted-foreground font-semibold block">Highlight Stat Callout</span>
                            <input
                              type="text"
                              className={inputCls}
                              value={item.stats || ''}
                              onChange={(e) => {
                                const list = [...formData.useCases!.items!];
                                list[idx] = { ...list[idx], stats: e.target.value };
                                updateField('useCases.items', list);
                              }}
                              placeholder="e.g. 99.9% uptime"
                            />
                          </div>

                          <div>
                            <span className="text-[10px] text-muted-foreground font-semibold block">Icon Key</span>
                            <input
                              type="text"
                              className={inputCls}
                              value={item.icon || 'Building'}
                              onChange={(e) => {
                                const list = [...formData.useCases!.items!];
                                list[idx] = { ...list[idx], icon: e.target.value };
                                updateField('useCases.items', list);
                              }}
                              placeholder="Building, Radio, Droplets"
                            />
                          </div>
                        </div>

                        <div>
                          <span className="text-[10px] text-muted-foreground font-semibold block">Description</span>
                          <textarea
                            rows={2}
                            className={textareaCls}
                            value={item.description || ''}
                            onChange={(e) => {
                              const list = [...formData.useCases!.items!];
                              list[idx] = { ...list[idx], description: e.target.value };
                              updateField('useCases.items', list);
                            }}
                            placeholder="Detailed operational scenario..."
                          />
                        </div>

                        {/* Image picker for use case card */}
                        <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/20 border border-border/50">
                          <div className="flex items-center gap-3">
                            {item.image && (
                              <img
                                src={item.image}
                                alt="Scenario"
                                className="w-12 h-9 object-cover rounded border border-border"
                              />
                            )}
                            <span className="text-[11px] text-muted-foreground font-mono truncate max-w-sm">
                              {item.image || 'No image selected'}
                            </span>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs flex items-center gap-1"
                            onClick={() =>
                              handleOpenMediaPicker('Select Scenario Photo', (url, publicId) => {
                                const list = [...formData.useCases!.items!];
                                list[idx] = { ...list[idx], image: url, mediaPublicId: publicId };
                                updateField('useCases.items', list);
                              })
                            }
                          >
                            <ImageIcon className="w-3 h-3" />
                            <span>Select Photo</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* TAB 11: SECTIONS / ADDITIONAL CONTENT                               */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'SECTIONS' && (
            <div className="max-w-4xl space-y-6">
              {/* Key Capabilities Section */}
              <div className={sectionCardCls}>
                <div className="border-b border-border/60 pb-3">
                  <h3 className="text-sm font-bold text-foreground">Section 3: Key Capabilities Grid</h3>
                  <p className="text-[11px] text-muted-foreground">
                    The 4 clean, premium capability cards rendered above the use cases section.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Section Eyebrow</label>
                    <input
                      type="text"
                      className={inputCls}
                      value={formData.capabilities?.eyebrow || 'CORE CAPABILITIES'}
                      onChange={(e) => updateField('capabilities.eyebrow', e.target.value)}
                      placeholder="CORE CAPABILITIES"
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Section Title</label>
                    <input
                      type="text"
                      className={inputCls}
                      value={formData.capabilities?.title || 'Advanced System Architecture'}
                      onChange={(e) => updateField('capabilities.title', e.target.value)}
                      placeholder="Advanced System Architecture"
                    />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Section Description</label>
                  <textarea
                    rows={2}
                    className={textareaCls}
                    value={formData.capabilities?.description || ''}
                    onChange={(e) => updateField('capabilities.description', e.target.value)}
                    placeholder="High-precision hardware and intelligent edge computing..."
                  />
                </div>

                {/* Repeatable Capabilities Items */}
                <div className="pt-2 border-t border-border/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">
                      Capability Cards ({formData.capabilities?.items?.length || 0})
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs flex items-center gap-1.5"
                      onClick={() => {
                        const current = formData.capabilities?.items || [];
                        const newItem = {
                          title: 'Non-Invasive Deployment',
                          description: 'Zero pipe cut or shutdown required for installation.',
                          icon: 'Radio',
                        };
                        updateField('capabilities.items', [...current, newItem]);
                      }}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Capability Card</span>
                    </Button>
                  </div>

                  {formData.capabilities?.items?.map((cap: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-background/80 border border-border/70 flex flex-col md:flex-row items-start md:items-center justify-between gap-3"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 flex-1 w-full">
                        <div>
                          <span className="text-[10px] text-muted-foreground font-semibold block">Title</span>
                          <input
                            type="text"
                            className={inputCls}
                            value={cap.title || ''}
                            onChange={(e) => {
                              const list = [...formData.capabilities!.items!];
                              list[idx] = { ...list[idx], title: e.target.value };
                              updateField('capabilities.items', list);
                            }}
                            placeholder="Title"
                          />
                        </div>

                        <div>
                          <span className="text-[10px] text-muted-foreground font-semibold block">Icon Key</span>
                          <input
                            type="text"
                            className={inputCls}
                            value={cap.icon || 'Radio'}
                            onChange={(e) => {
                              const list = [...formData.capabilities!.items!];
                              list[idx] = { ...list[idx], icon: e.target.value };
                              updateField('capabilities.items', list);
                            }}
                            placeholder="Radio, Sparkles, MapPin"
                          />
                        </div>

                        <div>
                          <span className="text-[10px] text-muted-foreground font-semibold block">Description</span>
                          <input
                            type="text"
                            className={inputCls}
                            value={cap.description || ''}
                            onChange={(e) => {
                              const list = [...formData.capabilities!.items!];
                              list[idx] = { ...list[idx], description: e.target.value };
                              updateField('capabilities.items', list);
                            }}
                            placeholder="Description"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const list = [...formData.capabilities!.items!];
                          list.splice(idx, 1);
                          updateField('capabilities.items', list);
                        }}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Inquiry Form Section */}
              <div className={sectionCardCls}>
                <div className="border-b border-border/60 pb-3">
                  <h3 className="text-sm font-bold text-foreground">Section 5: Request Demo / Inquiry Form</h3>
                  <p className="text-[11px] text-muted-foreground">
                    Conversion form content, value propositions, and lead handling guarantees.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Form Eyebrow / Badge Label</label>
                    <input
                      type="text"
                      className={inputCls}
                      value={formData.inquiryForm?.eyebrow || formData.inquiryForm?.badge || 'DIRECT INQUIRY'}
                      onChange={(e) => {
                        updateField('inquiryForm.eyebrow', e.target.value);
                        updateField('inquiryForm.badge', e.target.value);
                      }}
                      placeholder="DIRECT INQUIRY"
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Form Heading</label>
                    <input
                      type="text"
                      className={inputCls}
                      value={formData.inquiryForm?.title || "Have Questions? Let's Talk."}
                      onChange={(e) => updateField('inquiryForm.title', e.target.value)}
                      placeholder="Have Questions? Let's Talk."
                    />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Form Subtitle / Narrative Description</label>
                  <textarea
                    rows={2}
                    className={textareaCls}
                    value={formData.inquiryForm?.description || formData.inquiryForm?.subtitle || ''}
                    onChange={(e) => {
                      updateField('inquiryForm.description', e.target.value);
                      updateField('inquiryForm.subtitle', e.target.value);
                    }}
                    placeholder="Contact our engineering team to discuss operational requirements..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-border/40">
                  <div>
                    <label className={labelCls}>1. Response Time Guarantee</label>
                    <input
                      type="text"
                      className={inputCls}
                      value={formData.inquiryForm?.responseTime || ''}
                      onChange={(e) => updateField('inquiryForm.responseTime', e.target.value)}
                      placeholder="Direct callback from a specialist within 24 hours."
                    />
                  </div>

                  <div>
                    <label className={labelCls}>2. Enterprise Confidentiality</label>
                    <input
                      type="text"
                      className={inputCls}
                      value={formData.inquiryForm?.confidentiality || ''}
                      onChange={(e) => updateField('inquiryForm.confidentiality', e.target.value)}
                      placeholder="Full NDA protection for your infrastructure data."
                    />
                  </div>

                  <div>
                    <label className={labelCls}>3. Custom Proof-of-Concept</label>
                    <input
                      type="text"
                      className={inputCls}
                      value={formData.inquiryForm?.pocText || ''}
                      onChange={(e) => updateField('inquiryForm.pocText', e.target.value)}
                      placeholder="Live pilot telemetry setups available."
                    />
                  </div>
                </div>
              </div>

              {/* Final Closing CTA Section */}
              <div className={sectionCardCls}>
                <div className="border-b border-border/60 pb-3">
                  <h3 className="text-sm font-bold text-foreground">Section 6: Final Closing Call-to-Action</h3>
                  <p className="text-[11px] text-muted-foreground">
                    Closing high-conversion action banner with trust indicators.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={labelCls}>CTA Eyebrow</label>
                    <input
                      type="text"
                      className={inputCls}
                      value={formData.finalCta?.eyebrow || 'NEXT STEPS'}
                      onChange={(e) => updateField('finalCta.eyebrow', e.target.value)}
                      placeholder="NEXT STEPS"
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Main Title</label>
                    <input
                      type="text"
                      className={inputCls}
                      value={formData.finalCta?.title || ''}
                      onChange={(e) => updateField('finalCta.title', e.target.value)}
                      placeholder="Ready to Transform Your Water Operations?"
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Highlight Title (Teal)</label>
                    <input
                      type="text"
                      className={inputCls}
                      value={formData.finalCta?.highlightTitle || ''}
                      onChange={(e) => updateField('finalCta.highlightTitle', e.target.value)}
                      placeholder="Schedule a Live System Demo."
                    />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Description</label>
                  <textarea
                    rows={2}
                    className={textareaCls}
                    value={formData.finalCta?.description || ''}
                    onChange={(e) => updateField('finalCta.description', e.target.value)}
                    placeholder="Contact our water engineers for an on-site feasibility evaluation..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-border/40">
                  <div>
                    <label className={labelCls}>Primary CTA Button Text</label>
                    <input
                      type="text"
                      className={inputCls}
                      value={formData.finalCta?.primaryCtaText || 'Request a Demo'}
                      onChange={(e) => updateField('finalCta.primaryCtaText', e.target.value)}
                      placeholder="Request a Demo"
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Secondary CTA Button Text</label>
                    <input
                      type="text"
                      className={inputCls}
                      value={formData.finalCta?.secondaryCtaText || 'Talk to an Expert'}
                      onChange={(e) => updateField('finalCta.secondaryCtaText', e.target.value)}
                      placeholder="Talk to an Expert"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-border/40">
                  <label className={labelCls}>Trust Indicators / Badges (Comma Separated)</label>
                  <input
                    type="text"
                    className={inputCls}
                    value={(formData.finalCta?.trustBadges || []).join(', ')}
                    onChange={(e) => {
                      const badges = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                      updateField('finalCta.trustBadges', badges);
                    }}
                    placeholder="ISO 27001 Certified, Zero Downtime Architecture, Rapid Field Deployment"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* TAB 12: SEO                                                         */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'SEO' && (
            <div className="max-w-4xl space-y-6">
              <div className={sectionCardCls}>
                <div className="border-b border-border/60 pb-3">
                  <h3 className="text-sm font-bold text-foreground">Search Engine Optimization (SEO)</h3>
                  <p className="text-[11px] text-muted-foreground">
                    Fine-tune search engine visibility, meta tags, and open graph sharing cards.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className={labelCls}>Meta Title</label>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {(formData.seo?.metaTitle || '').length} / 60 characters
                    </span>
                  </div>
                  <input
                    type="text"
                    className={inputCls}
                    value={formData.seo?.metaTitle || ''}
                    onChange={(e) => updateField('seo.metaTitle', e.target.value)}
                    placeholder="e.g. Water Visibility Solutions | Veenero Sustainable Solutions"
                  />
                  <p className={helperCls}>Recommended: 50-60 characters for optimal Google search rendering.</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className={labelCls}>Meta Description</label>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {(formData.seo?.metaDescription || '').length} / 160 characters
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    className={textareaCls}
                    value={formData.seo?.metaDescription || ''}
                    onChange={(e) => updateField('seo.metaDescription', e.target.value)}
                    placeholder="Detailed meta summary explaining the solution for search engines..."
                  />
                  <p className={helperCls}>Recommended: 120-160 characters.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-border/40">
                  <div>
                    <label className={labelCls}>OpenGraph (OG) Title</label>
                    <input
                      type="text"
                      className={inputCls}
                      value={formData.seo?.ogTitle || ''}
                      onChange={(e) => updateField('seo.ogTitle', e.target.value)}
                      placeholder="Social card title (defaults to Meta Title)"
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Canonical URL</label>
                    <input
                      type="text"
                      className={inputCls}
                      value={formData.seo?.canonicalUrl || ''}
                      onChange={(e) => updateField('seo.canonicalUrl', e.target.value)}
                      placeholder="https://veenero.com/solutions/water-visibility"
                    />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>OpenGraph (OG) Description</label>
                  <textarea
                    rows={2}
                    className={textareaCls}
                    value={formData.seo?.ogDescription || ''}
                    onChange={(e) => updateField('seo.ogDescription', e.target.value)}
                    placeholder="Social card description when shared on LinkedIn, WhatsApp..."
                  />
                </div>

                <div>
                  <label className={labelCls}>SEO Keywords (Comma Separated)</label>
                  <input
                    type="text"
                    className={inputCls}
                    value={(formData.seo?.keywords || []).join(', ')}
                    onChange={(e) => {
                      const kw = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                      updateField('seo.keywords', kw);
                    }}
                    placeholder="water monitoring, iot flow meters, industrial water management"
                  />
                </div>

                <div className="pt-2 border-t border-border/40">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(formData.seo?.noIndex)}
                      onChange={(e) => updateField('seo.noIndex', e.target.checked)}
                      className="rounded border-border text-teal-600 focus:ring-teal-500 w-4 h-4"
                    />
                    <span className="text-xs font-semibold text-foreground">
                      Discourage Search Engines from Indexing (noindex, nofollow)
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* ── Footer Bar ──────────────────────────────────────────────────────── */}
        <div className="px-6 py-3.5 border-t border-border/70 flex items-center justify-between bg-muted/20 shrink-0">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {isDirty ? (
              <span className="flex items-center gap-1.5 text-amber-500 font-semibold">
                <AlertTriangle className="w-4 h-4" />
                <span>You have unsaved changes</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle className="w-4 h-4" />
                <span>All changes saved to database</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                if (isDirty && !window.confirm('You have unsaved changes. Are you sure you want to close?')) {
                  return;
                }
                onClose();
              }}
              className="text-xs rounded-xl"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={saving}
              onClick={handleSave}
              className="bg-teal-700 hover:bg-teal-800 text-white text-xs px-5 rounded-xl font-semibold flex items-center gap-2 shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolutionDetailEditor;
