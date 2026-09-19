import React, { useState, useEffect } from 'react';
import {
  Save,
  Eye,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  XCircle,
  ExternalLink,
  Image as ImageIcon,
  Layers,
  Sparkles,
  HelpCircle,
  Globe,
  Radio,
  ShieldCheck,
  TrendingUp,
  Droplets,
  Edit2,
  Copy,
  Check,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  SolutionsPageSettings,
  AdminSolutionCategory,
  AdminSolutionItem,
  AdminSolutionDetail,
  getAdminSolutionsSettings,
  updateAdminSolutionsSection,
  getAdminSolutionDetails,
  duplicateSolutionDetail,
  softDeleteSolutionDetail,
  updateSolutionStatus,
} from '../../services/solutions.service';
import { MediaPickerModal } from '../../components/cms/MediaPickerModal';
import { MediaAsset } from '../../services/media.service';
import { SolutionDetailEditor } from '../../components/cms/SolutionDetailEditor';

// ─── Toast Component ──────────────────────────────────────────────────────────
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
    className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-xs font-medium border transition-all animate-in fade-in slide-in-from-bottom-2 ${
      type === 'success'
        ? 'bg-emerald-950/90 text-emerald-200 border-emerald-700/50 shadow-emerald-950/30'
        : 'bg-red-950/90 text-red-200 border-red-700/50 shadow-red-950/30'
    }`}
  >
    {type === 'success' ? (
      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
    ) : (
      <XCircle className="w-4 h-4 text-red-400 shrink-0" />
    )}
    <span>{message}</span>
    <button
      onClick={onClose}
      className="ml-2 text-muted-foreground hover:text-foreground transition-colors"
    >
      ×
    </button>
  </div>
);

export const SolutionsCms: React.FC = () => {
  const [settings, setSettings] = useState<SolutionsPageSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Main Dashboard Tab: 'landing' | 'details'
  const [mainTab, setMainTab] = useState<'landing' | 'details'>('landing');

  // Solution Detail Pages CMS State
  const [detailPages, setDetailPages] = useState<AdminSolutionDetail[]>([]);
  const [activeDetailSolution, setActiveDetailSolution] = useState<AdminSolutionDetail | null>(null);
  const [isDetailEditorOpen, setIsDetailEditorOpen] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [detailSearch, setDetailSearch] = useState('');
  const [detailCategoryFilter, setDetailCategoryFilter] = useState('all');

  // Landing Page Sub-sections
  const [activeSection, setActiveSection] = useState<string>('hero');

  // Media Picker State
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<{
    section: string;
    field: string;
    index?: number;
    subfield?: string;
    type?: 'image' | 'video' | 'all';
    callback?: (url: string, publicId?: string) => void;
  } | null>(null);

  // Delete Confirmation Modal
  const [deleteConfirm, setDeleteConfirm] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await getAdminSolutionsSettings();
      setSettings(data);
      await loadDetailPages();
    } catch (err: any) {
      showToast(err.message || 'Failed to load Solutions settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadDetailPages = async () => {
    try {
      setLoadingDetails(true);
      const res: any = await getAdminSolutionDetails();
      const list = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
      setDetailPages(list);
    } catch (err: any) {
      console.error('Failed to load solution detail pages:', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const openMediaPicker = (
    section: string,
    field: string,
    index?: number,
    subfield?: string,
    type: 'image' | 'video' | 'all' = 'image',
    callback?: (url: string, publicId?: string) => void
  ) => {
    setPickerTarget({ section, field, index, subfield, type, callback });
    setPickerOpen(true);
  };

  const handleMediaSelected = (asset: MediaAsset) => {
    if (!pickerTarget) return;

    if (pickerTarget.callback) {
      pickerTarget.callback(asset.secureUrl, asset.publicId);
      setPickerOpen(false);
      return;
    }

    const { section, field, index, subfield } = pickerTarget;
    if (!settings) return;

    const updated = { ...settings };
    const sec = (updated as any)[section];

    if (index !== undefined && Array.isArray(sec)) {
      if (subfield) {
        sec[index][subfield] = asset.secureUrl;
        sec[index].mediaPublicId = asset.publicId;
      } else {
        sec[index][field] = asset.secureUrl;
        sec[index].mediaPublicId = asset.publicId;
      }
    } else if (index !== undefined && Array.isArray(sec[field])) {
      if (subfield) {
        sec[field][index][subfield] = asset.secureUrl;
      } else {
        sec[field][index] = asset.secureUrl;
      }
    } else if (subfield && sec[field]) {
      sec[field][subfield] = asset.secureUrl;
      if (sec[field].mediaPublicId !== undefined) {
        sec[field].mediaPublicId = asset.publicId;
      }
    } else if (sec) {
      sec[field] = asset.secureUrl;
      if (sec.mediaPublicId !== undefined) {
        sec.mediaPublicId = asset.publicId;
      }
    }

    setSettings(updated);
    setPickerOpen(false);
    showToast(`Media selected: ${asset.title || 'Asset assigned'}`);
  };

  const handleSaveSection = async (sectionName: string) => {
    if (!settings) return;
    try {
      setSaving(true);
      const sectionData = (settings as any)[sectionName];
      await updateAdminSolutionsSection(sectionName, sectionData);
      showToast(`Section '${sectionName}' saved successfully!`);
    } catch (err: any) {
      showToast(err.message || `Failed to save ${sectionName}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  const updateSectionState = (section: string, field: string, value: any) => {
    if (!settings) return;
    setSettings((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [section]: {
          ...(prev as any)[section],
          [field]: value,
        },
      };
    });
  };

  // ── Solution Detail Handlers ──
  const handleOpenDetailEditor = (detail: AdminSolutionDetail | null) => {
    setActiveDetailSolution(detail);
    setIsDetailEditorOpen(true);
  };

  const handleDuplicateDetail = async (id: string, title: string) => {
    try {
      setLoadingDetails(true);
      const dup = await duplicateSolutionDetail(id);
      setDetailPages((prev) => [dup, ...prev]);
      showToast(`Duplicated '${title}' as draft.`);
    } catch (err: any) {
      showToast(err.message || 'Failed to duplicate solution detail', 'error');
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleToggleDetailStatus = async (id: string, currentStatus: string) => {
    try {
      const nextStatus = currentStatus === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
      const updated = await updateSolutionStatus(id, nextStatus as any);
      setDetailPages((prev) => prev.map((p) => ((p._id || p.id) === id ? updated : p)));
      showToast(`Status changed to ${nextStatus}.`);
    } catch (err: any) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  const handleDeleteDetail = (id: string, title: string) => {
    setDeleteConfirm({
      title: 'Delete Solution Detail Page?',
      message: `Are you sure you want to move '${title}' to the recycle bin? It can be restored later or permanently deleted.`,
      onConfirm: async () => {
        try {
          await softDeleteSolutionDetail(id);
          setDetailPages((prev) => prev.filter((p) => (p._id || p.id) !== id));
          showToast(`Solution '${title}' moved to recycle bin.`);
        } catch (err: any) {
          showToast(err.message || 'Failed to delete solution detail', 'error');
        }
      },
    });
  };

  // Resolve linked public solution card and category identity dynamically
  const resolveSolutionIdentity = (p: AdminSolutionDetail) => {
    // 1. Match from settings.solutions by slug, id, or title
    const linkedCard = settings?.solutions?.find((s) => {
      if (s.slug && p.slug && s.slug.toLowerCase() === p.slug.toLowerCase()) return true;
      if (s.id && p.slug && (s.id.toLowerCase() === p.slug.toLowerCase() || s.id.toLowerCase() === `sol-${p.slug.toLowerCase()}`)) return true;
      if (s.title && p.title && s.title.toLowerCase() === p.title.toLowerCase()) return true;
      return false;
    });

    // 2. Match from settings.categories by key, slug, or displayLabel
    const linkedCategory = settings?.categories?.find((c) => {
      if (linkedCard?.categoryKey && c.key.toLowerCase() === linkedCard.categoryKey.toLowerCase()) return true;
      if (p.categoryKey && c.key.toLowerCase() === p.categoryKey.toLowerCase()) return true;
      if ((p as any).category && (c.key.toLowerCase() === (p as any).category.toLowerCase() || c.displayLabel.toLowerCase() === (p as any).category.toLowerCase())) return true;
      if (c.slug && p.slug && c.slug.toLowerCase() === p.slug.toLowerCase()) return true;
      return false;
    });

    // 3. Authoritative Public Solution Name (from SolutionDetail's shortTitle, or linked category/card, or title)
    const publicSolutionName =
      p.shortTitle ||
      linkedCategory?.displayLabel ||
      linkedCard?.title ||
      p.title;

    // 4. Detail Page Content Title
    const detailPageTitle =
      (p.tagline?.line1
        ? [p.tagline.line1, p.tagline.line2, p.tagline.line3].filter(Boolean).join(' ')
        : null) ||
      p.title;

    // 5. Category Name (prefer explicit categoryKey on SolutionDetail)
    const categoryLabel =
      p.categoryKey ||
      linkedCategory?.displayLabel ||
      linkedCard?.pillar ||
      linkedCard?.categoryKey ||
      (p as any).category ||
      'General';

    // 6. Thumbnail Image
    const thumbnail = p.heroImage || linkedCard?.image || linkedCategory?.image;

    return {
      linkedCard,
      linkedCategory,
      publicSolutionName,
      detailPageTitle,
      categoryLabel,
      thumbnail,
    };
  };

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
          <p className="text-xs text-muted-foreground font-medium">Loading Solutions CMS...</p>
        </div>
      </div>
    );
  }

  const inputCls =
    'w-full px-3 py-2 text-xs rounded-xl border border-border/80 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition-colors shadow-2xs';
  const textareaCls =
    'w-full px-3 py-2 text-xs rounded-xl border border-border/80 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition-colors resize-y shadow-2xs leading-relaxed';
  const labelCls = 'text-[11px] font-bold text-foreground block mb-1.5 font-sans tracking-wide';

  const landingSections = [
    { id: 'hero', label: '01. Hero Section', icon: Radio },
    { id: 'intro', label: '02. Ecosystem Intro', icon: Eye },
    { id: 'gridHeader', label: '03. Categories Header & Callout', icon: Layers },
    { id: 'featuredSolution', label: '04. Featured Solution', icon: Sparkles },
    { id: 'cta', label: '05. Closing Call to Action', icon: TrendingUp },
    { id: 'seo', label: '06. SEO Metadata', icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-background/50 select-none pb-16 font-sans">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-card rounded-2xl border border-border p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-500">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">{deleteConfirm.title}</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{deleteConfirm.message}</p>
            <div className="flex justify-end gap-2 pt-2">
              <Button size="sm" variant="outline" onClick={() => setDeleteConfirm(null)} className="text-xs">
                Cancel
              </Button>
              <Button
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white text-xs"
                onClick={() => {
                  deleteConfirm.onConfirm();
                  setDeleteConfirm(null);
                }}
              >
                Confirm Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={handleMediaSelected}
        resourceType={pickerTarget?.type || 'all'}
        initialFolder="solutions"
      />

      {/* Header Bar */}
      <div className="px-6 py-6 pb-4 border-b border-border/40 bg-card/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-[10px] font-bold border border-teal-500/20">
                CMS MODULE
              </span>
              <span className="text-xs text-muted-foreground">• Live MongoDB Integration</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Solutions Landing Page CMS</h1>
            <p className="text-xs text-muted-foreground mt-1 max-w-2xl">
              Control the entire public Solutions Landing Page (/solutions), categories, repeatable solution cards, and Cloudinary media assets.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/solutions"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-teal-700 dark:text-teal-400 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/25 rounded-xl transition-colors"
            >
              <span>View Solutions Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {mainTab === 'landing' && (
              <Button
                size="sm"
                disabled={saving}
                onClick={() => handleSaveSection(activeSection)}
                className="bg-teal-700 hover:bg-teal-800 text-white text-xs px-5 shadow-xs font-semibold flex items-center gap-2"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? 'Saving...' : 'Save Current Section'}</span>
              </Button>
            )}
          </div>
        </div>

        {/* 2 Main Management Tabs */}
        <div className="flex items-center gap-2 mt-6 border-b border-border/60 pb-px">
          <button
            onClick={() => setMainTab('landing')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              mainTab === 'landing'
                ? 'border-teal-500 text-teal-700 dark:text-teal-400 bg-teal-500/5'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>01. Landing Page Content</span>
          </button>

          <button
            onClick={() => setMainTab('details')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              mainTab === 'details'
                ? 'border-teal-500 text-teal-700 dark:text-teal-400 bg-teal-500/5'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>02. Solution Detail Pages ({detailPages.length})</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 pt-6">

        {/* ═════════════════════════════════════════════════════════════════════ */}
        {/* TAB 1: LANDING PAGE CONTENT                                         */}
        {/* ═════════════════════════════════════════════════════════════════════ */}
        {mainTab === 'landing' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Sub-nav */}
            <div className="lg:col-span-3 space-y-1.5 bg-card/60 p-3 rounded-2xl border border-border/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-3 py-1 block">
                Landing Page Sections
              </span>
              {landingSections.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveSection(id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
                    activeSection === id
                      ? 'bg-teal-700 text-white shadow-xs font-bold'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{label}</span>
                </button>
              ))}
            </div>

            {/* Right Editor Pane */}
            <div className="lg:col-span-9 bg-card rounded-2xl border border-border/80 p-6 shadow-xs">

              {/* 01. HERO SECTION */}
              {activeSection === 'hero' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <div>
                      <h2 className="text-sm font-bold text-foreground">01. Solutions Hero Section</h2>
                      <p className="text-[11px] text-muted-foreground">Top compact hero with telemetry status badges and widgets</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Eyebrow</label>
                      <input
                        type="text"
                        value={settings.hero.eyebrow}
                        onChange={(e) => updateSectionState('hero', 'eyebrow', e.target.value)}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Title Main (Line 1)</label>
                      <input
                        type="text"
                        value={settings.hero.title}
                        onChange={(e) => updateSectionState('hero', 'title', e.target.value)}
                        className={inputCls}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Highlighted Text (Teal Accent Line 2)</label>
                    <input
                      type="text"
                      value={settings.hero.highlightedText}
                      onChange={(e) => updateSectionState('hero', 'highlightedText', e.target.value)}
                      className={inputCls}
                    />
                  </div>


                  {/* Hero Media Asset */}
                  <div className="pt-4 border-t border-border/60">
                    <label className={labelCls}>Hero Background Photographic Visual (Cloudinary Media)</label>
                    <div className="mt-2 p-4 rounded-xl border border-border/80 bg-muted/20 flex flex-col sm:flex-row items-center gap-4">
                      <div className="w-full sm:w-48 aspect-video rounded-lg bg-slate-950 overflow-hidden shrink-0 border border-border flex items-center justify-center">
                        {settings.hero.image ? (
                          <img src={settings.hero.image} alt="Hero Visual" className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-8 h-8 text-muted-foreground opacity-40" />
                        )}
                      </div>
                      <div className="flex-1 space-y-2 w-full">
                        <p className="text-xs font-semibold text-foreground truncate">
                          {settings.hero.image || 'Using default photographic infrastructure image'}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          Slot: <strong>SOLUTIONS → HERO → Hero Visual</strong>
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1">
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => openMediaPicker('hero', 'image', undefined, undefined, 'image')}
                            className="bg-teal-700 hover:bg-teal-800 text-white text-xs px-3 shadow-xs"
                          >
                            <ImageIcon className="w-3.5 h-3.5 mr-1.5" />
                            Select from Media Library
                          </Button>
                          {settings.hero.image && (
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => updateSectionState('hero', 'image', '')}
                              className="text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                            >
                              Reset Image
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>



                  {/* Hero Floating Status Widgets */}
                  <div className="pt-4 border-t border-border/60 space-y-3">
                    <h3 className="text-xs font-bold text-foreground">Right Floating Telemetry Widgets (3 Cards)</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Flow Rate */}
                      <div className="p-3.5 rounded-xl border border-border/70 bg-muted/20 space-y-2">
                        <span className="text-[10px] font-mono font-bold text-teal-600 dark:text-teal-400">Card 1: Flow Rate</span>
                        <div>
                          <label className="text-[10px] font-bold text-muted-foreground block mb-1">Title</label>
                          <input
                            type="text"
                            value={settings.hero.statsWidgets?.flowRate?.title || 'Live Flow Rate'}
                            onChange={(e) => {
                              const sw = settings.hero.statsWidgets || ({} as any);
                              updateSectionState('hero', 'statsWidgets', {
                                ...sw,
                                flowRate: { ...sw.flowRate, title: e.target.value },
                              });
                            }}
                            className={inputCls}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-bold text-muted-foreground block mb-1">Value</label>
                            <input
                              type="text"
                              value={settings.hero.statsWidgets?.flowRate?.value || '1,245'}
                              onChange={(e) => {
                                const sw = settings.hero.statsWidgets || ({} as any);
                                updateSectionState('hero', 'statsWidgets', {
                                  ...sw,
                                  flowRate: { ...sw.flowRate, value: e.target.value },
                                });
                              }}
                              className={inputCls}
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-muted-foreground block mb-1">Unit</label>
                            <input
                              type="text"
                              value={settings.hero.statsWidgets?.flowRate?.unit || 'm³/hr'}
                              onChange={(e) => {
                                const sw = settings.hero.statsWidgets || ({} as any);
                                updateSectionState('hero', 'statsWidgets', {
                                  ...sw,
                                  flowRate: { ...sw.flowRate, unit: e.target.value },
                                });
                              }}
                              className={inputCls}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Health */}
                      <div className="p-3.5 rounded-xl border border-border/70 bg-muted/20 space-y-2">
                        <span className="text-[10px] font-mono font-bold text-teal-600 dark:text-teal-400">Card 2: Health</span>
                        <div>
                          <label className="text-[10px] font-bold text-muted-foreground block mb-1">Title</label>
                          <input
                            type="text"
                            value={settings.hero.statsWidgets?.systemHealth?.title || 'System Health'}
                            onChange={(e) => {
                              const sw = settings.hero.statsWidgets || ({} as any);
                              updateSectionState('hero', 'statsWidgets', {
                                ...sw,
                                systemHealth: { ...sw.systemHealth, title: e.target.value },
                              });
                            }}
                            className={inputCls}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-bold text-muted-foreground block mb-1">Value</label>
                            <input
                              type="text"
                              value={settings.hero.statsWidgets?.systemHealth?.value || '98%'}
                              onChange={(e) => {
                                const sw = settings.hero.statsWidgets || ({} as any);
                                updateSectionState('hero', 'statsWidgets', {
                                  ...sw,
                                  systemHealth: { ...sw.systemHealth, value: e.target.value },
                                });
                              }}
                              className={inputCls}
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-muted-foreground block mb-1">Status</label>
                            <input
                              type="text"
                              value={settings.hero.statsWidgets?.systemHealth?.status || 'Healthy'}
                              onChange={(e) => {
                                const sw = settings.hero.statsWidgets || ({} as any);
                                updateSectionState('hero', 'statsWidgets', {
                                  ...sw,
                                  systemHealth: { ...sw.systemHealth, status: e.target.value },
                                });
                              }}
                              className={inputCls}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Active Alerts */}
                      <div className="p-3.5 rounded-xl border border-border/70 bg-muted/20 space-y-2">
                        <span className="text-[10px] font-mono font-bold text-teal-600 dark:text-teal-400">Card 3: Alerts</span>
                        <div>
                          <label className="text-[10px] font-bold text-muted-foreground block mb-1">Title</label>
                          <input
                            type="text"
                            value={settings.hero.statsWidgets?.activeAlerts?.title || 'Active Alerts'}
                            onChange={(e) => {
                              const sw = settings.hero.statsWidgets || ({} as any);
                              updateSectionState('hero', 'statsWidgets', {
                                ...sw,
                                activeAlerts: { ...sw.activeAlerts, title: e.target.value },
                              });
                            }}
                            className={inputCls}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-bold text-muted-foreground block mb-1">Count</label>
                            <input
                              type="text"
                              value={settings.hero.statsWidgets?.activeAlerts?.count || '3'}
                              onChange={(e) => {
                                const sw = settings.hero.statsWidgets || ({} as any);
                                updateSectionState('hero', 'statsWidgets', {
                                  ...sw,
                                  activeAlerts: { ...sw.activeAlerts, count: e.target.value },
                                });
                              }}
                              className={inputCls}
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-muted-foreground block mb-1">Link CTA Text</label>
                            <input
                              type="text"
                              value={settings.hero.statsWidgets?.activeAlerts?.ctaText || 'View All Alerts'}
                              onChange={(e) => {
                                const sw = settings.hero.statsWidgets || ({} as any);
                                updateSectionState('hero', 'statsWidgets', {
                                  ...sw,
                                  activeAlerts: { ...sw.activeAlerts, ctaText: e.target.value },
                                });
                              }}
                              className={inputCls}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 02. ECOSYSTEM INTRO */}
              {activeSection === 'intro' && (
                <div className="space-y-5">
                  <div className="border-b border-border/60 pb-3">
                    <h2 className="text-sm font-bold text-foreground">02. Solutions Ecosystem Intro</h2>
                    <p className="text-[11px] text-muted-foreground">Light aqua section with isometric illustration and 4 capability badges</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Eyebrow</label>
                      <input
                        type="text"
                        value={settings.intro.eyebrow}
                        onChange={(e) => updateSectionState('intro', 'eyebrow', e.target.value)}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Title Main</label>
                      <input
                        type="text"
                        value={settings.intro.title}
                        onChange={(e) => updateSectionState('intro', 'title', e.target.value)}
                        className={inputCls}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Highlighted Text (Teal Emphasis)</label>
                    <input
                      type="text"
                      value={settings.intro.highlightedText}
                      onChange={(e) => updateSectionState('intro', 'highlightedText', e.target.value)}
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Paragraph 1</label>
                    <textarea
                      rows={2}
                      value={settings.intro.paragraphs[0] || ''}
                      onChange={(e) => {
                        const pars = [...settings.intro.paragraphs];
                        pars[0] = e.target.value;
                        updateSectionState('intro', 'paragraphs', pars);
                      }}
                      className={textareaCls}
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Paragraph 2</label>
                    <textarea
                      rows={2}
                      value={settings.intro.paragraphs[1] || ''}
                      onChange={(e) => {
                        const pars = [...settings.intro.paragraphs];
                        pars[1] = e.target.value;
                        updateSectionState('intro', 'paragraphs', pars);
                      }}
                      className={textareaCls}
                    />
                  </div>

                  {/* Intro Media */}
                  <div className="pt-4 border-t border-border/60">
                    <label className={labelCls}>Ecosystem Isometric Visual (Cloudinary Media)</label>
                    <div className="mt-2 p-4 rounded-xl border border-border/80 bg-muted/20 flex flex-col sm:flex-row items-center gap-4">
                      <div className="w-full sm:w-48 aspect-video rounded-lg bg-slate-950 overflow-hidden shrink-0 border border-border flex items-center justify-center">
                        {settings.intro.image ? (
                          <img src={settings.intro.image} alt="Intro Visual" className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-8 h-8 text-muted-foreground opacity-40" />
                        )}
                      </div>
                      <div className="flex-1 space-y-2 w-full">
                        <p className="text-xs font-semibold text-foreground truncate">
                          {settings.intro.image || 'Using default ecosystem sensor illustration'}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          Slot: <strong>SOLUTIONS → INTRO → Ecosystem Illustration</strong>
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1">
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => openMediaPicker('intro', 'image', undefined, undefined, 'image')}
                            className="bg-teal-700 hover:bg-teal-800 text-white text-xs px-3 shadow-xs"
                          >
                            <ImageIcon className="w-3.5 h-3.5 mr-1.5" />
                            Select from Media Library
                          </Button>
                          {settings.intro.image && (
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => updateSectionState('intro', 'image', '')}
                              className="text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                            >
                              Reset Image
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 4 Capability Badges */}
                  <div className="pt-4 border-t border-border/60 space-y-3">
                    <h3 className="text-xs font-bold text-foreground">4 Capability Badges in Bottom Row</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(settings.intro.badges || []).map((b, i) => (
                        <div key={i} className="p-3 rounded-xl border border-border/70 bg-muted/20">
                          <label className="text-[10px] font-bold text-muted-foreground block mb-1">
                            Badge {i + 1} Label
                          </label>
                          <input
                            type="text"
                            value={b.label}
                            onChange={(e) => {
                              const bds = [...(settings.intro.badges || [])];
                              bds[i] = { ...bds[i], label: e.target.value };
                              updateSectionState('intro', 'badges', bds);
                            }}
                            className={inputCls}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 03. GRID HEADER & ANALYTICS CALLOUT */}
              {activeSection === 'gridHeader' && (
                <div className="space-y-5">
                  <div className="border-b border-border/60 pb-3">
                    <h2 className="text-sm font-bold text-foreground">03. Category Grid Header & Analytics Callout Card</h2>
                    <p className="text-[11px] text-muted-foreground">Header copy for the solutions grid and the full-width Analytics Platform card</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Eyebrow</label>
                      <input
                        type="text"
                        value={settings.gridHeader.eyebrow}
                        onChange={(e) => updateSectionState('gridHeader', 'eyebrow', e.target.value)}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Section Title</label>
                      <input
                        type="text"
                        value={settings.gridHeader.title}
                        onChange={(e) => updateSectionState('gridHeader', 'title', e.target.value)}
                        className={inputCls}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Section Description</label>
                    <textarea
                      rows={2}
                      value={settings.gridHeader.description}
                      onChange={(e) => updateSectionState('gridHeader', 'description', e.target.value)}
                      className={textareaCls}
                    />
                  </div>

                  {/* Callout Card */}
                  <div className="pt-4 border-t border-border/60 space-y-4">
                    <h3 className="text-xs font-bold text-foreground">Analytics & Insights Callout Card (Bottom of Grid)</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>Card Title</label>
                        <input
                          type="text"
                          value={settings.gridHeader.calloutCard?.title || 'Analytics & Insights Platform'}
                          onChange={(e) => {
                            const cc = settings.gridHeader.calloutCard || ({} as any);
                            updateSectionState('gridHeader', 'calloutCard', { ...cc, title: e.target.value });
                          }}
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Card Subtitle / Module Count Label</label>
                        <input
                          type="text"
                          value={settings.gridHeader.calloutCard?.subtitle || 'Enterprise Digital Backbone'}
                          onChange={(e) => {
                            const cc = settings.gridHeader.calloutCard || ({} as any);
                            updateSectionState('gridHeader', 'calloutCard', { ...cc, subtitle: e.target.value });
                          }}
                          className={inputCls}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={labelCls}>Card Description</label>
                      <textarea
                        rows={2}
                        value={settings.gridHeader.calloutCard?.description || ''}
                        onChange={(e) => {
                          const cc = settings.gridHeader.calloutCard || ({} as any);
                          updateSectionState('gridHeader', 'calloutCard', { ...cc, description: e.target.value });
                        }}
                        className={textareaCls}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>CTA Link Text</label>
                        <input
                          type="text"
                          value={settings.gridHeader.calloutCard?.ctaText || 'Explore Platform Capabilities'}
                          onChange={(e) => {
                            const cc = settings.gridHeader.calloutCard || ({} as any);
                            updateSectionState('gridHeader', 'calloutCard', { ...cc, ctaText: e.target.value });
                          }}
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>CTA Link Route</label>
                        <input
                          type="text"
                          value={settings.gridHeader.calloutCard?.ctaLink || '/solutions/analytics-insights'}
                          onChange={(e) => {
                            const cc = settings.gridHeader.calloutCard || ({} as any);
                            updateSectionState('gridHeader', 'calloutCard', { ...cc, ctaLink: e.target.value });
                          }}
                          className={inputCls}
                        />
                      </div>
                    </div>

                    {/* Callout Image */}
                    <div>
                      <label className={labelCls}>Callout Image (Cloudinary Media)</label>
                      <div className="mt-2 p-4 rounded-xl border border-border/80 bg-muted/20 flex flex-col sm:flex-row items-center gap-4">
                        <div className="w-full sm:w-48 aspect-video rounded-lg bg-slate-950 overflow-hidden shrink-0 border border-border flex items-center justify-center">
                          {settings.gridHeader.calloutCard?.image ? (
                            <img
                              src={settings.gridHeader.calloutCard.image}
                              alt="Callout"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="w-8 h-8 text-muted-foreground opacity-40" />
                          )}
                        </div>
                        <div className="flex-1 space-y-2 w-full">
                          <p className="text-xs font-semibold text-foreground truncate">
                            {settings.gridHeader.calloutCard?.image || 'Default analytics dashboard image'}
                          </p>
                          <Button
                            type="button"
                            size="sm"
                            onClick={() =>
                              openMediaPicker('gridHeader', 'calloutCard', undefined, 'image', 'image', (url, pubId) => {
                                const cc = settings.gridHeader.calloutCard || ({} as any);
                                updateSectionState('gridHeader', 'calloutCard', {
                                  ...cc,
                                  image: url,
                                  mediaPublicId: pubId,
                                });
                              })
                            }
                            className="bg-teal-700 hover:bg-teal-800 text-white text-xs px-3 shadow-xs"
                          >
                            <ImageIcon className="w-3.5 h-3.5 mr-1.5" />
                            Select from Media Library
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 04. FEATURED SOLUTION */}
              {activeSection === 'featuredSolution' && (
                <div className="space-y-5">
                  <div className="border-b border-border/60 pb-3">
                    <h2 className="text-sm font-bold text-foreground">04. Featured Solution Section</h2>
                    <p className="text-[11px] text-muted-foreground">50/50 showcase section highlighting the flagship platform</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Eyebrow</label>
                      <input
                        type="text"
                        value={settings.featuredSolution.eyebrow}
                        onChange={(e) => updateSectionState('featuredSolution', 'eyebrow', e.target.value)}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Category Subtitle</label>
                      <input
                        type="text"
                        value={settings.featuredSolution.subtitle}
                        onChange={(e) => updateSectionState('featuredSolution', 'subtitle', e.target.value)}
                        className={inputCls}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Title Part 1</label>
                      <input
                        type="text"
                        value={settings.featuredSolution.title}
                        onChange={(e) => updateSectionState('featuredSolution', 'title', e.target.value)}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Title Highlight (Teal)</label>
                      <input
                        type="text"
                        value={settings.featuredSolution.highlightedText}
                        onChange={(e) => updateSectionState('featuredSolution', 'highlightedText', e.target.value)}
                        className={inputCls}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Description</label>
                    <textarea
                      rows={3}
                      value={settings.featuredSolution.description}
                      onChange={(e) => updateSectionState('featuredSolution', 'description', e.target.value)}
                      className={textareaCls}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>CTA Label</label>
                      <input
                        type="text"
                        value={settings.featuredSolution.ctaText}
                        onChange={(e) => updateSectionState('featuredSolution', 'ctaText', e.target.value)}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>CTA Link</label>
                      <input
                        type="text"
                        value={settings.featuredSolution.ctaLink}
                        onChange={(e) => updateSectionState('featuredSolution', 'ctaLink', e.target.value)}
                        className={inputCls}
                      />
                    </div>
                  </div>

                  {/* Featured Media */}
                  <div className="pt-4 border-t border-border/60">
                    <label className={labelCls}>Featured Showcase Image (Cloudinary Media)</label>
                    <div className="mt-2 p-4 rounded-xl border border-border/80 bg-muted/20 flex flex-col sm:flex-row items-center gap-4">
                      <div className="w-full sm:w-48 aspect-video rounded-lg bg-slate-950 overflow-hidden shrink-0 border border-border flex items-center justify-center">
                        {settings.featuredSolution.image ? (
                          <img
                            src={settings.featuredSolution.image}
                            alt="Featured Solution"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="w-8 h-8 text-muted-foreground opacity-40" />
                        )}
                      </div>
                      <div className="flex-1 space-y-2 w-full">
                        <p className="text-xs font-semibold text-foreground truncate">
                          {settings.featuredSolution.image || 'Default monitoring station image'}
                        </p>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => openMediaPicker('featuredSolution', 'image', undefined, undefined, 'image')}
                          className="bg-teal-700 hover:bg-teal-800 text-white text-xs px-3 shadow-xs"
                        >
                          <ImageIcon className="w-3.5 h-3.5 mr-1.5" />
                          Select from Media Library
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* 4 Capabilities Badges */}
                  <div className="pt-4 border-t border-border/60 space-y-3">
                    <h3 className="text-xs font-bold text-foreground">4 Feature Highlight Badges (2x2 Grid)</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(settings.featuredSolution.capabilities || []).map((c, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl border border-border/70 bg-muted/20 space-y-2">
                          <div>
                            <label className="text-[10px] font-bold text-muted-foreground block mb-1">Badge Title</label>
                            <input
                              type="text"
                              value={c.title}
                              onChange={(e) => {
                                const caps = [...(settings.featuredSolution.capabilities || [])];
                                caps[idx] = { ...caps[idx], title: e.target.value };
                                updateSectionState('featuredSolution', 'capabilities', caps);
                              }}
                              className={inputCls}
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-muted-foreground block mb-1">Description</label>
                            <input
                              type="text"
                              value={c.desc}
                              onChange={(e) => {
                                const caps = [...(settings.featuredSolution.capabilities || [])];
                                caps[idx] = { ...caps[idx], desc: e.target.value };
                                updateSectionState('featuredSolution', 'capabilities', caps);
                              }}
                              className={inputCls}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 05. CLOSING CTA */}
              {activeSection === 'cta' && (
                <div className="space-y-5">
                  <div className="border-b border-border/60 pb-3">
                    <h2 className="text-sm font-bold text-foreground">05. Closing Call to Action</h2>
                    <p className="text-[11px] text-muted-foreground">Dark aquatic call-to-action banner at the bottom of the page</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Eyebrow</label>
                      <input
                        type="text"
                        value={settings.cta.eyebrow}
                        onChange={(e) => updateSectionState('cta', 'eyebrow', e.target.value)}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Title Main</label>
                      <input
                        type="text"
                        value={settings.cta.title}
                        onChange={(e) => updateSectionState('cta', 'title', e.target.value)}
                        className={inputCls}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Highlighted Text (Teal Emphasis)</label>
                    <input
                      type="text"
                      value={settings.cta.highlightedText}
                      onChange={(e) => updateSectionState('cta', 'highlightedText', e.target.value)}
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Description</label>
                    <textarea
                      rows={3}
                      value={settings.cta.description}
                      onChange={(e) => updateSectionState('cta', 'description', e.target.value)}
                      className={textareaCls}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Primary Button Text</label>
                      <input
                        type="text"
                        value={settings.cta.primaryButtonText}
                        onChange={(e) => updateSectionState('cta', 'primaryButtonText', e.target.value)}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Primary Button Link</label>
                      <input
                        type="text"
                        value={settings.cta.primaryButtonLink}
                        onChange={(e) => updateSectionState('cta', 'primaryButtonLink', e.target.value)}
                        className={inputCls}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Secondary Button Text</label>
                      <input
                        type="text"
                        value={settings.cta.secondaryButtonText}
                        onChange={(e) => updateSectionState('cta', 'secondaryButtonText', e.target.value)}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Secondary Button Link</label>
                      <input
                        type="text"
                        value={settings.cta.secondaryButtonLink}
                        onChange={(e) => updateSectionState('cta', 'secondaryButtonLink', e.target.value)}
                        className={inputCls}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 06. SEO METADATA */}
              {activeSection === 'seo' && (
                <div className="space-y-5">
                  <div className="border-b border-border/60 pb-3">
                    <h2 className="text-sm font-bold text-foreground">06. SEO & Search Engine Metadata</h2>
                    <p className="text-[11px] text-muted-foreground">Title and meta description displayed on search results</p>
                  </div>

                  <div>
                    <label className={labelCls}>Meta Title</label>
                    <input
                      type="text"
                      value={settings.seo.metaTitle}
                      onChange={(e) => updateSectionState('seo', 'metaTitle', e.target.value)}
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Meta Description</label>
                    <textarea
                      rows={3}
                      value={settings.seo.metaDescription}
                      onChange={(e) => updateSectionState('seo', 'metaDescription', e.target.value)}
                      className={textareaCls}
                    />
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════════ */}
        {/* TAB 2: SOLUTION DETAIL PAGES CMS (12-TAB CRUD)                      */}
        {/* ═════════════════════════════════════════════════════════════════════ */}
        {mainTab === 'details' && (
          <div className="space-y-6">
            {/* Header & Control Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card p-5 rounded-2xl border border-border/80">
              <div>
                <h2 className="text-base font-bold text-foreground">Complete Solution Detail Pages CMS</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Manage all 12 sections of public Solution Detail Pages (/solutions/:slug) — Hero, Content, Benefits, Features, Process, Tech & Metrics, FAQs, Industries, and SEO.
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button
                  size="sm"
                  onClick={() => handleOpenDetailEditor(null)}
                  className="bg-teal-700 hover:bg-teal-800 text-white text-xs px-4 shadow-xs font-semibold flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Solution Page</span>
                </Button>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-muted/20 p-3 rounded-xl border border-border/60">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search solutions by title or slug..."
                  value={detailSearch}
                  onChange={(e) => setDetailSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-border/70 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-muted-foreground font-semibold">Category:</span>
                <select
                  value={detailCategoryFilter}
                  onChange={(e) => setDetailCategoryFilter(e.target.value)}
                  className="text-xs px-2.5 py-1.5 rounded-lg border border-border/70 bg-background text-foreground focus:outline-none"
                >
                  <option value="all">All Categories ({detailPages.length})</option>
                  {settings.categories.map((c) => (
                    <option key={c.key} value={c.displayLabel}>
                      {c.displayLabel}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Grid of Solution Detail Pages */}
            {loadingDetails ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-8 h-8 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
              </div>
            ) : detailPages.length === 0 ? (
              <div className="text-center py-16 bg-card rounded-2xl border border-dashed border-border p-8 space-y-3">
                <Sparkles className="w-10 h-10 text-muted-foreground mx-auto opacity-40" />
                <h3 className="text-sm font-bold text-foreground">No Solution Detail Pages Found</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Click "Create New Solution Page" to configure a full CMS solution detail page with all 12 dynamic sections.
                </p>
                <Button
                  size="sm"
                  onClick={() => handleOpenDetailEditor(null)}
                  className="bg-teal-700 hover:bg-teal-800 text-white text-xs mt-2"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> Create Solution Page
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {detailPages
                  .filter((p) => {
                    const identity = resolveSolutionIdentity(p);
                    const q = detailSearch.toLowerCase().trim();
                    const matchesSearch =
                      !q ||
                      p.title?.toLowerCase().includes(q) ||
                      p.slug?.toLowerCase().includes(q) ||
                      identity.publicSolutionName.toLowerCase().includes(q) ||
                      identity.detailPageTitle.toLowerCase().includes(q) ||
                      identity.categoryLabel.toLowerCase().includes(q);
                    const matchesCat =
                      detailCategoryFilter === 'all' ||
                      identity.categoryLabel.toLowerCase().includes(detailCategoryFilter.toLowerCase()) ||
                      (p as any).category?.toLowerCase() === detailCategoryFilter.toLowerCase() ||
                      p.categoryKey?.toLowerCase() === detailCategoryFilter.toLowerCase();
                    return matchesSearch && matchesCat;
                  })
                  .map((p, idx) => {
                    const id = (p._id || p.id) as string;
                    const identity = resolveSolutionIdentity(p);
                    return (
                      <div
                        key={id || idx}
                        className="bg-card rounded-2xl border border-border/80 hover:border-teal-500/50 transition-all p-5 flex flex-col justify-between space-y-4 shadow-xs group"
                      >
                        <div className="space-y-3.5">
                          {/* Top Row: Category Pill & Status Badge */}
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className="text-[10px] font-mono font-bold text-teal-700 dark:text-teal-300 uppercase tracking-wider bg-teal-500/10 px-2.5 py-0.5 rounded-md border border-teal-500/20 truncate max-w-[200px]"
                              title={identity.categoryLabel}
                            >
                              {identity.categoryLabel}
                            </span>

                            <button
                              type="button"
                              onClick={() => handleToggleDetailStatus(id, p.status || 'DRAFT')}
                              className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase border cursor-pointer transition-colors shrink-0 ${
                                p.status === 'PUBLISHED'
                                  ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/25 hover:bg-emerald-500/20'
                                  : 'bg-amber-500/10 text-amber-600 border-amber-500/25 hover:bg-amber-500/20'
                              }`}
                              title="Click to toggle status"
                            >
                              {p.status || 'DRAFT'}
                            </button>
                          </div>

                          {/* Optional Thumbnail Image */}
                          {identity.thumbnail && (
                            <div className="relative aspect-[16/8] w-full rounded-xl overflow-hidden bg-slate-900 border border-border/50">
                              <img
                                src={identity.thumbnail}
                                alt={identity.publicSolutionName}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
                              <span className="absolute bottom-2 left-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-mono text-teal-300 font-semibold border border-white/10">
                                /solutions/{p.slug}
                              </span>
                            </div>
                          )}

                          {/* 1. PUBLIC SOLUTION NAME */}
                          <div>
                            <span className="text-[9px] font-extrabold text-teal-600 dark:text-teal-400 uppercase tracking-widest block mb-1 font-mono">
                              PUBLIC SOLUTION
                            </span>
                            <h3 className="text-base font-bold text-foreground group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors leading-tight">
                              {identity.publicSolutionName}
                            </h3>
                          </div>

                          {/* 2. DETAIL PAGE TITLE */}
                          <div className="bg-muted/30 rounded-xl p-2.5 border border-border/40">
                            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block mb-0.5 font-mono">
                              DETAIL PAGE TITLE
                            </span>
                            <p className="text-xs font-semibold text-foreground/90 leading-snug">
                              "{identity.detailPageTitle}"
                            </p>
                          </div>

                          {/* 3. PUBLIC URL & CATEGORY META ROW */}
                          <div className="grid grid-cols-2 gap-2 text-xs pt-0.5">
                            <div>
                              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block font-mono">
                                PUBLIC URL
                              </span>
                              <div className="flex items-center gap-1 mt-0.5">
                                <span className="font-mono text-[11px] text-teal-600 dark:text-teal-400 truncate">
                                  /solutions/{p.slug}
                                </span>
                                <a
                                  href={`/solutions/${p.slug}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-muted-foreground hover:text-teal-500 transition-colors shrink-0"
                                  title="Open Live Page"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            </div>
                            <div>
                              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block font-mono">
                                CATEGORY
                              </span>
                              <span className="text-[11px] font-medium text-foreground truncate block mt-0.5">
                                {identity.categoryLabel}
                              </span>
                            </div>
                          </div>

                          {/* Section Counts Summary Badges */}
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            <span className="text-[10px] bg-muted/40 text-muted-foreground px-2 py-0.5 rounded border border-border/50">
                              {p.benefits?.metrics?.length || 0} Benefits
                            </span>
                            <span className="text-[10px] bg-muted/40 text-muted-foreground px-2 py-0.5 rounded border border-border/50">
                              {p.features?.items?.length || 0} Features
                            </span>
                            <span className="text-[10px] bg-muted/40 text-muted-foreground px-2 py-0.5 rounded border border-border/50">
                              {p.howItWorks?.steps?.length || 0} Steps
                            </span>
                            <span className="text-[10px] bg-muted/40 text-muted-foreground px-2 py-0.5 rounded border border-border/50">
                              {p.faqs?.length || 0} FAQs
                            </span>
                          </div>
                        </div>

                        {/* Card Actions Footer */}
                        <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-2 flex-wrap">
                          <span className="text-[10px] text-muted-foreground font-mono">
                            Order: {p.displayOrder ?? idx + 1}
                          </span>

                          <div className="flex items-center gap-1.5">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenDetailEditor(p)}
                              className="h-8 px-3 text-xs bg-teal-500/10 hover:bg-teal-500/20 text-teal-700 dark:text-teal-300 border-teal-500/30 font-semibold"
                            >
                              <Edit2 className="w-3.5 h-3.5 mr-1.5" />
                              Edit Full CMS
                            </Button>

                            <a
                              href={`/solutions/${p.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="h-8 px-2.5 text-xs inline-flex items-center gap-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted border border-border/40 transition-colors"
                              title="View Live Public Page"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span className="hidden xl:inline">Live</span>
                            </a>

                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDuplicateDetail(id, identity.publicSolutionName)}
                              className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted"
                              title="Duplicate as Draft"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </Button>

                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteDetail(id, identity.publicSolutionName)}
                              className="h-8 px-2 text-xs text-red-600 hover:bg-red-500/10"
                              title="Delete Solution"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}

      </div>

      {/* 12-Tab Solution Detail CMS Editor Modal */}
      <SolutionDetailEditor
        isOpen={isDetailEditorOpen}
        solution={activeDetailSolution}
        onClose={() => setIsDetailEditorOpen(false)}
        onSaveSuccess={(updated) => {
          setDetailPages((prev) => {
            const id = updated._id || updated.id;
            const exists = prev.some((p) => (p._id || p.id) === id);
            if (exists) {
              return prev.map((p) => ((p._id || p.id) === id ? updated : p));
            }
            return [updated, ...prev];
          });
          setIsDetailEditorOpen(false);
          showToast(`'${updated.title}' saved successfully!`);
        }}
        categoriesList={settings?.categories?.map((c) => ({ key: c.key, displayLabel: c.displayLabel })) || []}
        publicCardsList={settings?.solutions || []}
        publicSolutionName={
          activeDetailSolution ? resolveSolutionIdentity(activeDetailSolution).publicSolutionName : undefined
        }
      />
    </div>
  );
};

export default SolutionsCms;
