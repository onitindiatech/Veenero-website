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
  Cpu,
  Layers,
  Sparkles,
  HelpCircle,
  Globe,
  Radio,
  ShieldCheck,
  TrendingUp,
  Droplets,
  Edit2,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  SolutionsPageSettings,
  AdminSolutionCategory,
  AdminSolutionItem,
  getAdminSolutionsSettings,
  updateAdminSolutionsSection,
  createCategory,
  updateCategory,
  deleteCategory,
  createSolutionItem,
  updateSolutionItem,
  deleteSolutionItem,
} from '../../services/solutions.service';
import { MediaPickerModal } from '../../components/cms/MediaPickerModal';
import { MediaAsset } from '../../services/media.service';

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
    className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border backdrop-blur-md text-sm transition-all duration-300 ${
      type === 'success'
        ? 'bg-emerald-950/90 text-emerald-100 border-emerald-500/40'
        : 'bg-red-950/90 text-red-100 border-red-500/40'
    }`}
  >
    {type === 'success' ? (
      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
    ) : (
      <XCircle className="w-4 h-4 text-red-400 shrink-0" />
    )}
    <span className="font-medium">{message}</span>
    <button onClick={onClose} className="ml-2 text-muted-foreground hover:text-foreground">
      &times;
    </button>
  </div>
);

export const SolutionsCms: React.FC = () => {
  const [settings, setSettings] = useState<SolutionsPageSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Main Dashboard Tab: 'landing' | 'categories' | 'solutions'
  const [mainTab, setMainTab] = useState<'landing' | 'categories' | 'solutions'>('landing');

  // Landing Page Sub-sections
  const [activeSection, setActiveSection] = useState<string>('hero');

  // Category CRUD Modal/Drawer State
  const [editingCategory, setEditingCategory] = useState<Partial<AdminSolutionCategory> | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Solution Card CRUD Modal/Drawer State
  const [editingSolution, setEditingSolution] = useState<Partial<AdminSolutionItem> | null>(null);
  const [isSolutionModalOpen, setIsSolutionModalOpen] = useState(false);
  const [solutionCategoryFilter, setSolutionCategoryFilter] = useState<string>('all');

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
    } catch (err: any) {
      showToast(err.message || 'Failed to load Solutions settings', 'error');
    } finally {
      setLoading(false);
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

  // ── Category Handlers ──
  const handleSaveCategory = async () => {
    if (!editingCategory || !editingCategory.displayLabel || !editingCategory.slug) {
      showToast('Category name and slug are required.', 'error');
      return;
    }

    try {
      setSaving(true);
      const catKey = editingCategory.key || editingCategory.displayLabel;
      const catData = {
        ...editingCategory,
        key: catKey,
        pillarKeys: editingCategory.pillarKeys || [catKey],
      };

      if (editingCategory._id || editingCategory.id) {
        const catId = editingCategory._id || editingCategory.id!;
        const updated = await updateCategory(catId, catData);
        setSettings((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            categories: prev.categories.map((c) => (c._id === catId || c.id === catId ? updated : c)),
          };
        });
        showToast('Category updated successfully!');
      } else {
        const created = await createCategory(catData);
        setSettings((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            categories: [...prev.categories, created],
          };
        });
        showToast('Category created successfully!');
      }
      setIsCategoryModalOpen(false);
      setEditingCategory(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to save category', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = (catId: string, label: string) => {
    setDeleteConfirm({
      title: 'Delete Category?',
      message: `Are you sure you want to delete category '${label}'? Any solution cards assigned to it will remain, but the category tab will be removed.`,
      onConfirm: async () => {
        try {
          await deleteCategory(catId);
          setSettings((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              categories: prev.categories.filter((c) => c._id !== catId && c.id !== catId),
            };
          });
          showToast(`Category '${label}' deleted successfully.`);
        } catch (err: any) {
          showToast(err.message || 'Failed to delete category', 'error');
        }
      },
    });
  };

  // ── Solution Items Handlers ──
  const handleSaveSolution = async () => {
    if (!editingSolution || !editingSolution.title || !editingSolution.categoryKey) {
      showToast('Solution title and category are required.', 'error');
      return;
    }

    try {
      setSaving(true);
      const solData = {
        ...editingSolution,
        pillar: editingSolution.pillar || editingSolution.categoryKey,
      };

      if (editingSolution._id || editingSolution.id) {
        const solId = editingSolution._id || editingSolution.id!;
        const updated = await updateSolutionItem(solId, solData);
        setSettings((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            solutions: prev.solutions.map((s) => (s._id === solId || s.id === solId ? updated : s)),
          };
        });
        showToast('Solution card updated successfully!');
      } else {
        const created = await createSolutionItem(solData);
        setSettings((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            solutions: [...prev.solutions, created],
          };
        });
        showToast('Solution card created successfully!');
      }
      setIsSolutionModalOpen(false);
      setEditingSolution(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to save solution card', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSolution = (solId: string, title: string) => {
    setDeleteConfirm({
      title: 'Delete Solution?',
      message: `Are you sure you want to delete '${title}'? It will no longer appear on the public Solutions page.`,
      onConfirm: async () => {
        try {
          await deleteSolutionItem(solId);
          setSettings((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              solutions: prev.solutions.filter((s) => s._id !== solId && s.id !== solId),
            };
          });
          showToast(`Solution '${title}' deleted.`);
        } catch (err: any) {
          showToast(err.message || 'Failed to delete solution', 'error');
        }
      },
    });
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

        {/* 3 Main Management Tabs */}
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
            onClick={() => setMainTab('categories')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              mainTab === 'categories'
                ? 'border-teal-500 text-teal-700 dark:text-teal-400 bg-teal-500/5'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>02. Solution Categories ({settings.categories.length})</span>
          </button>

          <button
            onClick={() => setMainTab('solutions')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              mainTab === 'solutions'
                ? 'border-teal-500 text-teal-700 dark:text-teal-400 bg-teal-500/5'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>03. Solution Cards ({settings.solutions.length})</span>
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

                  <div>
                    <label className={labelCls}>Supporting Description</label>
                    <textarea
                      rows={3}
                      value={settings.hero.description}
                      onChange={(e) => updateSectionState('hero', 'description', e.target.value)}
                      className={textareaCls}
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
        {/* TAB 2: CATEGORIES MANAGEMENT (CRUD)                                  */}
        {/* ═════════════════════════════════════════════════════════════════════ */}
        {mainTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card p-5 rounded-2xl border border-border/80">
              <div>
                <h2 className="text-base font-bold text-foreground">Solution Categories</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Manage the filter tabs and category cards on the public Solutions page. Each category links to its slug route.
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => {
                  setEditingCategory({
                    key: '',
                    displayLabel: '',
                    slug: '',
                    description: '',
                    icon: 'Eye',
                    image: '',
                    order: settings.categories.length + 1,
                    isActive: true,
                  });
                  setIsCategoryModalOpen(true);
                }}
                className="bg-teal-700 hover:bg-teal-800 text-white text-xs px-4 shadow-xs font-semibold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create New Category</span>
              </Button>
            </div>

            {/* Categories List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {settings.categories.map((cat, idx) => (
                <div
                  key={cat._id || cat.id || idx}
                  className="bg-card rounded-2xl border border-border/80 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  {/* Category Thumbnail */}
                  <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden">
                    {cat.image ? (
                      <img src={cat.image} alt={cat.displayLabel} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/50">
                        <ImageIcon className="w-8 h-8 mb-1" />
                        <span className="text-[10px]">Default Photography</span>
                      </div>
                    )}
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-[10px] font-mono font-bold text-teal-300 border border-teal-500/30">
                      Order: {cat.order || idx + 1}
                    </span>
                    <span
                      className={`absolute top-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        cat.isActive !== false ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {cat.isActive !== false ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-4 space-y-2 flex-1">
                    <h3 className="text-sm font-bold text-foreground">{cat.displayLabel}</h3>
                    <p className="text-[11px] text-teal-600 dark:text-teal-400 font-mono">/solutions/{cat.slug}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{cat.description}</p>
                  </div>

                  {/* Actions */}
                  <div className="p-3 bg-muted/20 border-t border-border/40 flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground">Key: {cat.key}</span>
                    <div className="flex items-center gap-1.5">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingCategory(cat);
                          setIsCategoryModalOpen(true);
                        }}
                        className="h-8 px-2.5 text-xs text-teal-700 dark:text-teal-300 hover:bg-teal-500/10"
                      >
                        <Edit2 className="w-3.5 h-3.5 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteCategory(cat._id || cat.id!, cat.displayLabel)}
                        className="h-8 px-2 text-xs text-red-600 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Category Edit/Create Modal */}
            {isCategoryModalOpen && editingCategory && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                <div className="bg-card rounded-2xl border border-border p-6 max-w-lg w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <h3 className="text-base font-bold text-foreground">
                      {editingCategory._id || editingCategory.id ? 'Edit Category' : 'Create New Category'}
                    </h3>
                    <button
                      onClick={() => setIsCategoryModalOpen(false)}
                      className="text-muted-foreground hover:text-foreground text-lg"
                    >
                      &times;
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className={labelCls}>Category Name / Display Label</label>
                      <input
                        type="text"
                        value={editingCategory.displayLabel || ''}
                        onChange={(e) =>
                          setEditingCategory({
                            ...editingCategory,
                            displayLabel: e.target.value,
                            key: editingCategory.key || e.target.value,
                            slug:
                              editingCategory.slug ||
                              e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                          })
                        }
                        className={inputCls}
                        placeholder="e.g. Water Visibility"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelCls}>URL Route Slug</label>
                        <input
                          type="text"
                          value={editingCategory.slug || ''}
                          onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                          className={inputCls}
                          placeholder="e.g. water-visibility"
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Display Order</label>
                        <input
                          type="number"
                          value={editingCategory.order || 1}
                          onChange={(e) => setEditingCategory({ ...editingCategory, order: parseInt(e.target.value) || 1 })}
                          className={inputCls}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={labelCls}>Short Description</label>
                      <textarea
                        rows={2}
                        value={editingCategory.description || ''}
                        onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                        className={textareaCls}
                        placeholder="Describe the focus of this solution category..."
                      />
                    </div>

                    {/* Image Selector */}
                    <div>
                      <label className={labelCls}>Category Image (Cloudinary Media Library)</label>
                      <div className="p-3 rounded-xl border border-border/80 bg-muted/20 flex items-center gap-3">
                        <div className="w-20 aspect-video rounded-lg bg-slate-950 overflow-hidden shrink-0 border border-border flex items-center justify-center">
                          {editingCategory.image ? (
                            <img src={editingCategory.image} alt="Cat" className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-muted-foreground opacity-40" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] text-foreground truncate mb-1">
                            {editingCategory.image || 'Default image'}
                          </p>
                          <Button
                            type="button"
                            size="sm"
                            onClick={() =>
                              openMediaPicker('categoryModal', 'image', undefined, undefined, 'image', (url, pubId) => {
                                setEditingCategory((prev) => (prev ? { ...prev, image: url, mediaPublicId: pubId } : prev));
                              })
                            }
                            className="bg-teal-700 hover:bg-teal-800 text-white text-[11px] px-2.5 h-7"
                          >
                            <ImageIcon className="w-3 h-3 mr-1" /> Pick Media
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="catActive"
                        checked={editingCategory.isActive !== false}
                        onChange={(e) => setEditingCategory({ ...editingCategory, isActive: e.target.checked })}
                        className="rounded border-border text-teal-600 focus:ring-teal-500"
                      />
                      <label htmlFor="catActive" className="text-xs font-semibold text-foreground cursor-pointer">
                        Active on public Solutions landing page
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-border/60">
                    <Button size="sm" variant="outline" onClick={() => setIsCategoryModalOpen(false)} className="text-xs">
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSaveCategory}
                      disabled={saving}
                      className="bg-teal-700 hover:bg-teal-800 text-white text-xs px-4"
                    >
                      {saving ? 'Saving...' : 'Save Category'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════════ */}
        {/* TAB 3: SOLUTIONS / SOLUTION CARDS CRUD                               */}
        {/* ═════════════════════════════════════════════════════════════════════ */}
        {mainTab === 'solutions' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card p-5 rounded-2xl border border-border/80">
              <div>
                <h2 className="text-base font-bold text-foreground">Individual Solution Items</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Manage individual solution products (e.g. Veenero Sense, Intelligence, Insights, Verification).
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <select
                  value={solutionCategoryFilter}
                  onChange={(e) => setSolutionCategoryFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-xl border border-border bg-background text-foreground"
                >
                  <option value="all">All Categories</option>
                  {settings.categories.map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.displayLabel}
                    </option>
                  ))}
                </select>

                <Button
                  size="sm"
                  onClick={() => {
                    setEditingSolution({
                      title: '',
                      tagline: '',
                      description: '',
                      categoryKey: settings.categories[0]?.key || 'Water Visibility',
                      pillar: settings.categories[0]?.key || 'Water Visibility',
                      slug: '',
                      icon: 'Radio',
                      features: ['Real-time continuous flow & pressure capture', 'Multi-asset telemetry aggregation'],
                      metrics: { value: 'Sub-second', label: 'Ingestion Rate' },
                      order: settings.solutions.length + 1,
                      isActive: true,
                    });
                    setIsSolutionModalOpen(true);
                  }}
                  className="bg-teal-700 hover:bg-teal-800 text-white text-xs px-4 shadow-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Solution Card</span>
                </Button>
              </div>
            </div>

            {/* Solutions List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {settings.solutions
                .filter((s) => solutionCategoryFilter === 'all' || s.categoryKey === solutionCategoryFilter || s.pillar === solutionCategoryFilter)
                .map((sol, idx) => (
                  <div
                    key={sol._id || sol.id || idx}
                    className="bg-card rounded-2xl border border-border/80 p-5 space-y-3 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-[10px] font-bold border border-teal-500/20">
                          {sol.categoryKey || sol.pillar}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            sol.isActive !== false
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {sol.isActive !== false ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-foreground">{sol.title}</h3>
                      <p className="text-[11px] font-semibold text-teal-600 dark:text-teal-400">{sol.tagline}</p>
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-3 leading-relaxed">
                        {sol.description}
                      </p>

                      {sol.metrics?.value && (
                        <div className="mt-3 p-2.5 rounded-xl bg-muted/20 border border-border/40 flex items-baseline justify-between">
                          <span className="text-[10px] text-muted-foreground">{sol.metrics.label}</span>
                          <span className="text-xs font-bold text-teal-700 dark:text-teal-300 font-mono">
                            {sol.metrics.value}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground font-mono">Order: {sol.order || idx + 1}</span>
                      <div className="flex items-center gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingSolution(sol);
                            setIsSolutionModalOpen(true);
                          }}
                          className="h-8 px-2.5 text-xs text-teal-700 dark:text-teal-300 hover:bg-teal-500/10"
                        >
                          <Edit2 className="w-3.5 h-3.5 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteSolution(sol._id || sol.id!, sol.title)}
                          className="h-8 px-2 text-xs text-red-600 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Solution Edit/Create Modal */}
            {isSolutionModalOpen && editingSolution && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                <div className="bg-card rounded-2xl border border-border p-6 max-w-xl w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <h3 className="text-base font-bold text-foreground">
                      {editingSolution._id || editingSolution.id ? 'Edit Solution Card' : 'Create Solution Card'}
                    </h3>
                    <button
                      onClick={() => setIsSolutionModalOpen(false)}
                      className="text-muted-foreground hover:text-foreground text-lg"
                    >
                      &times;
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelCls}>Solution Title</label>
                        <input
                          type="text"
                          value={editingSolution.title || ''}
                          onChange={(e) =>
                            setEditingSolution({
                              ...editingSolution,
                              title: e.target.value,
                              slug:
                                editingSolution.slug ||
                                e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                            })
                          }
                          className={inputCls}
                          placeholder="e.g. Veenero Sense"
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Assigned Category</label>
                        <select
                          value={editingSolution.categoryKey || settings.categories[0]?.key}
                          onChange={(e) =>
                            setEditingSolution({
                              ...editingSolution,
                              categoryKey: e.target.value,
                              pillar: e.target.value,
                            })
                          }
                          className={inputCls}
                        >
                          {settings.categories.map((c) => (
                            <option key={c.key} value={c.key}>
                              {c.displayLabel}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelCls}>Tagline / Subtitle</label>
                        <input
                          type="text"
                          value={editingSolution.tagline || ''}
                          onChange={(e) => setEditingSolution({ ...editingSolution, tagline: e.target.value })}
                          className={inputCls}
                          placeholder="e.g. Water Visibility & Telemetry"
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Display Order</label>
                        <input
                          type="number"
                          value={editingSolution.order || 1}
                          onChange={(e) => setEditingSolution({ ...editingSolution, order: parseInt(e.target.value) || 1 })}
                          className={inputCls}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={labelCls}>Description</label>
                      <textarea
                        rows={3}
                        value={editingSolution.description || ''}
                        onChange={(e) => setEditingSolution({ ...editingSolution, description: e.target.value })}
                        className={textareaCls}
                        placeholder="Detailed description of the solution..."
                      />
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-3 p-3 rounded-xl border border-border/70 bg-muted/15">
                      <div>
                        <label className="text-[10px] font-bold text-muted-foreground block mb-1">Metric Value</label>
                        <input
                          type="text"
                          value={editingSolution.metrics?.value || ''}
                          onChange={(e) =>
                            setEditingSolution({
                              ...editingSolution,
                              metrics: {
                                value: e.target.value,
                                label: editingSolution.metrics?.label || '',
                              },
                            })
                          }
                          className={inputCls}
                          placeholder="e.g. Sub-second"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-muted-foreground block mb-1">Metric Label</label>
                        <input
                          type="text"
                          value={editingSolution.metrics?.label || ''}
                          onChange={(e) =>
                            setEditingSolution({
                              ...editingSolution,
                              metrics: {
                                value: editingSolution.metrics?.value || '',
                                label: e.target.value,
                              },
                            })
                          }
                          className={inputCls}
                          placeholder="e.g. Telemetry Ingestion Rate"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="solActive"
                        checked={editingSolution.isActive !== false}
                        onChange={(e) => setEditingSolution({ ...editingSolution, isActive: e.target.checked })}
                        className="rounded border-border text-teal-600 focus:ring-teal-500"
                      />
                      <label htmlFor="solActive" className="text-xs font-semibold text-foreground cursor-pointer">
                        Active on public Solutions landing page
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-border/60">
                    <Button size="sm" variant="outline" onClick={() => setIsSolutionModalOpen(false)} className="text-xs">
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSaveSolution}
                      disabled={saving}
                      className="bg-teal-700 hover:bg-teal-800 text-white text-xs px-4"
                    >
                      {saving ? 'Saving...' : 'Save Solution Card'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default SolutionsCms;
