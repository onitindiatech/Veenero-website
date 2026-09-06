import React, { useState, useEffect } from 'react';
import {
  Save,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  XCircle,
  Globe,
  ExternalLink,
  Image as ImageIcon,
  Film,
  RotateCcw,
  Sparkles,
  Info,
  Layers,
  BookOpen,
  Target,
  ShieldCheck,
  Zap,
  Users2,
  MessageSquare,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AboutPageSettings,
  getAdminAboutSettings,
  updateAdminAboutSection,
} from '../../services/about.service';
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

// ─── Constants for Styles ──────────────────────────────────────────────────────
const labelCls = 'block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5';
const inputCls =
  'w-full px-3.5 py-2.5 text-xs bg-background border border-border/70 rounded-xl focus:outline-none focus:border-teal-500 font-medium text-foreground transition-all duration-200';
const textareaCls =
  'w-full px-3.5 py-2.5 text-xs bg-background border border-border/70 rounded-xl focus:outline-none focus:border-teal-500 font-medium text-foreground transition-all duration-200 resize-y';

// ─── Sections Configuration ───────────────────────────────────────────────────
const SECTIONS = [
  { id: 'hero', label: '01 — Hero Section', desc: 'Main cover heading, description & media', icon: Sparkles },
  { id: 'ourStory', label: '02 — Our Story & Origin', desc: 'Narrative origin copy & video asset', icon: BookOpen },
  { id: 'impactStats', label: '03 — Impact Statistics', desc: 'Key telemetry & nationwide numbers', icon: Zap },
  { id: 'purposeDirection', label: '04 — Purpose & Direction', desc: 'Our Vision and Our Mission cards', icon: Target },
  { id: 'pillars', label: '05 — The Pillars of Veenero', desc: '5 Core values & photographic media', icon: Layers },
  { id: 'whyChoose', label: '06 — Why Choose Veenero', desc: 'Platform differentiators & infrastructure', icon: ShieldCheck },
  { id: 'leadership', label: '07 — Our Team', desc: 'Founding, engineering & AI role cards', icon: Users2 },
  { id: 'cta', label: '08 — Final Call to Action', desc: 'Bottom banner heading & link', icon: MessageSquare },
  { id: 'seo', label: '09 — SEO Metadata', desc: 'Meta title & description for search', icon: Globe },
];

export const AboutCms: React.FC = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [settings, setSettings] = useState<AboutPageSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Media Picker state
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<{
    sectionKey: string;
    field: string;
    subIndex?: number;
    subArrayField?: string;
    type?: 'image' | 'video' | 'all';
  } | null>(null);

  // Delete modal state
  const [deleteConfirm, setDeleteConfirm] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const data = await getAdminAboutSettings();
      setSettings(data);
      setIsDirty(false);
    } catch (err) {
      showToast((err as Error).message || 'Failed to load About settings.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSection = async (sectionKey: string) => {
    if (!settings) return;
    setSaving(true);
    try {
      const sectionData = (settings as any)[sectionKey];
      const updatedSection = await updateAdminAboutSection(sectionKey, sectionData);
      setSettings((prev) => (prev ? { ...prev, [sectionKey]: updatedSection } : prev));
      showToast(`${SECTIONS.find((s) => s.id === sectionKey)?.label || sectionKey} saved successfully.`);
      setIsDirty(false);
    } catch (err) {
      showToast((err as Error).message || 'Failed to save section.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const updateSectionState = (sectionKey: string, field: string, value: any) => {
    if (!settings) return;
    setSettings({
      ...settings,
      [sectionKey]: {
        ...(settings as any)[sectionKey],
        [field]: value,
      },
    });
    setIsDirty(true);
  };

  const toggleSectionVisibility = (sectionKey: string) => {
    if (!settings) return;
    const current = (settings as any)[sectionKey]?.visible !== false;
    updateSectionState(sectionKey, 'visible', !current);
  };

  const openMediaPicker = (
    sectionKey: string,
    field: string,
    subIndex?: number,
    subArrayField?: string,
    type: 'image' | 'video' | 'all' = 'image'
  ) => {
    setPickerTarget({ sectionKey, field, subIndex, subArrayField, type });
    setPickerOpen(true);
  };

  const handleMediaSelected = (asset: MediaAsset) => {
    if (!pickerTarget || !settings) return;
    const { sectionKey, field, subIndex, subArrayField } = pickerTarget;

    if (subIndex !== undefined && subArrayField) {
      // Repeatable item media update
      const list = [...((settings as any)[sectionKey][subArrayField] || [])];
      if (list[subIndex]) {
        list[subIndex] = {
          ...list[subIndex],
          [field]: asset.secureUrl,
          mediaPublicId: asset.publicId,
        };
        updateSectionState(sectionKey, subArrayField, list);
      }
    } else {
      // Fixed section media update
      setSettings({
        ...settings,
        [sectionKey]: {
          ...(settings as any)[sectionKey],
          [field]: asset.secureUrl,
          mediaPublicId: asset.publicId,
        },
      });
      setIsDirty(true);
    }
  };

  if (loading) {
    return (
      <div className="p-6 md:p-8 space-y-6 animate-pulse font-sans">
        <div className="h-10 w-72 bg-muted/40 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1 h-96 bg-muted/30 rounded-2xl" />
          <div className="md:col-span-3 h-[500px] bg-muted/20 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="p-12 text-center font-sans">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 mx-auto flex items-center justify-center mb-4">
          <Info className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Could not load About Page settings.</h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
          Please check your MongoDB connection and verify database seeding.
        </p>
        <Button onClick={fetchSettings} className="mt-5 bg-teal-700 hover:bg-teal-800 text-white text-xs">
          Retry Loading
        </Button>
      </div>
    );
  }

  const currentSectionMeta = SECTIONS.find((s) => s.id === activeSection);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-background/50 font-sans pb-16">
      {/* Toast Alert */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-card max-w-md w-full p-6 rounded-2xl border border-border shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
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
                Delete Item
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
        initialFolder="about"
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
            <h1 className="text-2xl font-bold text-foreground tracking-tight">About Page CMS</h1>
            <p className="text-xs text-muted-foreground mt-1 max-w-2xl">
              Manage all editorial content, vision statements, pillars, and media displayed on the public /about page.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/about"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-teal-700 dark:text-teal-400 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/25 rounded-xl transition-colors"
            >
              <span>View About Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <Button
              size="sm"
              disabled={saving}
              onClick={() => handleSaveSection(activeSection)}
              className="bg-teal-700 hover:bg-teal-800 text-white text-xs px-5 shadow-xs font-semibold flex items-center gap-2"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Save Current Section'}</span>
            </Button>
          </div>
        </div>

        {/* Informational Banner */}
        <div className="mt-4 p-3 rounded-xl bg-teal-500/5 border border-teal-500/15 flex items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
            <span>
              <strong>Note:</strong> Changes saved here are reflected directly on the public <code className="px-1.5 py-0.5 bg-background rounded text-teal-700 dark:text-teal-300 font-mono">/about</code> page via the API.
            </span>
          </div>
          {isDirty && (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              Unsaved changes in section
            </span>
          )}
        </div>
      </div>

      {/* Main CMS Layout Grid */}
      <div className="px-6 py-6 max-w-7xl w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Section Navigation Sidebar */}
          <div className="lg:col-span-4 space-y-2">
            <div className="bg-card rounded-2xl border border-border p-3 shadow-xs space-y-1">
              <div className="px-3 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Page Sections
              </div>

              {SECTIONS.map((sec) => {
                const Icon = sec.icon;
                const isActive = activeSection === sec.id;
                const isSectionVisible = (settings as any)[sec.id]?.visible !== false;

                return (
                  <button
                    key={sec.id}
                    onClick={() => {
                      setActiveSection(sec.id);
                    }}
                    className={`w-full text-left p-3 rounded-xl transition-all duration-200 flex items-center justify-between group ${
                      isActive
                        ? 'bg-teal-500/10 border border-teal-500/30 text-teal-900 dark:text-teal-200 shadow-2xs font-bold'
                        : 'hover:bg-muted/60 text-muted-foreground hover:text-foreground font-medium border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isActive
                            ? 'bg-teal-700 text-white'
                            : 'bg-muted text-muted-foreground group-hover:text-foreground'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <p className="text-xs truncate">{sec.label}</p>
                        <p className="text-[10px] text-muted-foreground truncate opacity-80">{sec.desc}</p>
                      </div>
                    </div>

                    {sec.id !== 'seo' && (
                      <span
                        title={isSectionVisible ? 'Section is visible on /about' : 'Section is hidden on /about'}
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-md shrink-0 ml-2 ${
                          isSectionVisible
                            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                            : 'bg-gray-500/10 text-gray-500'
                        }`}
                      >
                        {isSectionVisible ? 'Visible' : 'Hidden'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Section Editor Pane */}
          <div className="lg:col-span-8 bg-card rounded-2xl border border-border shadow-xs overflow-hidden">
            
            {/* Section Editor Top Header */}
            <div className="px-6 py-5 border-b border-border bg-muted/10 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                  <span>{currentSectionMeta?.label}</span>
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">{currentSectionMeta?.desc}</p>
              </div>

              <div className="flex items-center gap-3">
                {activeSection !== 'seo' && (
                  <button
                    type="button"
                    onClick={() => toggleSectionVisibility(activeSection)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                      (settings as any)[activeSection]?.visible !== false
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20'
                        : 'bg-muted text-muted-foreground border-border'
                    }`}
                  >
                    {(settings as any)[activeSection]?.visible !== false ? (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Section Enabled</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Section Disabled</span>
                      </>
                    )}
                  </button>
                )}

                <Button
                  size="sm"
                  disabled={saving}
                  onClick={() => handleSaveSection(activeSection)}
                  className="bg-teal-700 hover:bg-teal-800 text-white text-xs px-4 shadow-xs font-semibold flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </Button>
              </div>
            </div>

            {/* Section Content Form */}
            <div className="p-6 space-y-6">

              {/* ───────────────────────────────────────────────────────────── */}
              {/* 01. HERO SECTION */}
              {/* ───────────────────────────────────────────────────────────── */}
              {activeSection === 'hero' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Eyebrow Badge</label>
                      <input
                        type="text"
                        value={settings.hero.eyebrow}
                        onChange={(e) => updateSectionState('hero', 'eyebrow', e.target.value)}
                        className={inputCls}
                        placeholder="e.g. ABOUT VEENERO"
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Main Title (First Line)</label>
                      <input
                        type="text"
                        value={settings.hero.title}
                        onChange={(e) => updateSectionState('hero', 'title', e.target.value)}
                        className={inputCls}
                        placeholder="e.g. Building India's"
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Highlighted Heading Text (Teal Emphasis)</label>
                    <input
                      type="text"
                      value={settings.hero.highlightedText}
                      onChange={(e) => updateSectionState('hero', 'highlightedText', e.target.value)}
                      className={inputCls}
                      placeholder="e.g. Water Intelligence"
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Hero Description</label>
                    <textarea
                      rows={3}
                      value={settings.hero.description}
                      onChange={(e) => updateSectionState('hero', 'description', e.target.value)}
                      className={textareaCls}
                      placeholder="Enter description..."
                    />
                  </div>


                  {/* Hero Media Asset */}
                  <div className="pt-4 border-t border-border/60">
                    <label className={labelCls}>Hero Photographic Visual (Cloudinary Media)</label>
                    <div className="mt-2 p-4 rounded-xl border border-border/80 bg-muted/20 flex flex-col sm:flex-row items-center gap-4">
                      <div className="w-full sm:w-48 aspect-video rounded-lg bg-slate-950 overflow-hidden shrink-0 border border-border flex items-center justify-center">
                        {settings.hero.image ? (
                          <img
                            src={settings.hero.image}
                            alt="Hero Visual"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="w-8 h-8 text-muted-foreground opacity-40" />
                        )}
                      </div>
                      <div className="flex-1 space-y-2 w-full">
                        <p className="text-xs font-semibold text-foreground truncate">
                          {settings.hero.image ? settings.hero.image : 'No media asset assigned'}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          Slot: <strong>ABOUT → HERO → Hero Visual</strong>
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



                  {/* Hero Right Floating Status Cards */}
                  <div className="pt-4 border-t border-border/60 space-y-4">
                    <div>
                      <h3 className="text-xs font-bold text-foreground">Right Floating Telemetry Widgets (3 Cards)</h3>
                      <p className="text-[11px] text-muted-foreground">Displayed on the right column of the desktop hero</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Card 1: Flow Rate */}
                      <div className="p-3.5 rounded-xl border border-border/70 bg-muted/20 space-y-2">
                        <span className="text-[10px] font-mono font-bold text-teal-600 dark:text-teal-400">Card 1: Flow Rate</span>
                        <div>
                          <label className="text-[10px] font-bold text-muted-foreground block mb-1">Title</label>
                          <input
                            type="text"
                            value={settings.hero.statsWidgets?.flowRate?.title ?? 'Live Flow Rate'}
                            onChange={(e) => {
                              const widgets = settings.hero.statsWidgets || {
                                flowRate: { title: 'Live Flow Rate', value: '1,245', unit: 'm³/hr', trend: '↑ 12.5% vs yesterday' },
                                systemHealth: { title: 'System Health', value: '98%', status: 'Healthy' },
                                activeAlerts: { title: 'Active Alerts', count: '3', ctaText: 'View All Alerts', ctaLink: '#who-we-are' },
                              };
                              updateSectionState('hero', 'statsWidgets', {
                                ...widgets,
                                flowRate: { ...widgets.flowRate, title: e.target.value },
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
                              value={settings.hero.statsWidgets?.flowRate?.value ?? '1,245'}
                              onChange={(e) => {
                                const widgets = settings.hero.statsWidgets || {
                                  flowRate: { title: 'Live Flow Rate', value: '1,245', unit: 'm³/hr', trend: '↑ 12.5% vs yesterday' },
                                  systemHealth: { title: 'System Health', value: '98%', status: 'Healthy' },
                                  activeAlerts: { title: 'Active Alerts', count: '3', ctaText: 'View All Alerts', ctaLink: '#who-we-are' },
                                };
                                updateSectionState('hero', 'statsWidgets', {
                                  ...widgets,
                                  flowRate: { ...widgets.flowRate, value: e.target.value },
                                });
                              }}
                              className={inputCls}
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-muted-foreground block mb-1">Unit</label>
                            <input
                              type="text"
                              value={settings.hero.statsWidgets?.flowRate?.unit ?? 'm³/hr'}
                              onChange={(e) => {
                                const widgets = settings.hero.statsWidgets || {
                                  flowRate: { title: 'Live Flow Rate', value: '1,245', unit: 'm³/hr', trend: '↑ 12.5% vs yesterday' },
                                  systemHealth: { title: 'System Health', value: '98%', status: 'Healthy' },
                                  activeAlerts: { title: 'Active Alerts', count: '3', ctaText: 'View All Alerts', ctaLink: '#who-we-are' },
                                };
                                updateSectionState('hero', 'statsWidgets', {
                                  ...widgets,
                                  flowRate: { ...widgets.flowRate, unit: e.target.value },
                                });
                              }}
                              className={inputCls}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-muted-foreground block mb-1">Trend Text</label>
                          <input
                            type="text"
                            value={settings.hero.statsWidgets?.flowRate?.trend ?? '↑ 12.5% vs yesterday'}
                            onChange={(e) => {
                              const widgets = settings.hero.statsWidgets || {
                                flowRate: { title: 'Live Flow Rate', value: '1,245', unit: 'm³/hr', trend: '↑ 12.5% vs yesterday' },
                                systemHealth: { title: 'System Health', value: '98%', status: 'Healthy' },
                                activeAlerts: { title: 'Active Alerts', count: '3', ctaText: 'View All Alerts', ctaLink: '#who-we-are' },
                              };
                              updateSectionState('hero', 'statsWidgets', {
                                ...widgets,
                                flowRate: { ...widgets.flowRate, trend: e.target.value },
                              });
                            }}
                            className={inputCls}
                          />
                        </div>
                      </div>

                      {/* Card 2: System Health */}
                      <div className="p-3.5 rounded-xl border border-border/70 bg-muted/20 space-y-2">
                        <span className="text-[10px] font-mono font-bold text-teal-600 dark:text-teal-400">Card 2: Health</span>
                        <div>
                          <label className="text-[10px] font-bold text-muted-foreground block mb-1">Title</label>
                          <input
                            type="text"
                            value={settings.hero.statsWidgets?.systemHealth?.title ?? 'System Health'}
                            onChange={(e) => {
                              const widgets = settings.hero.statsWidgets || {
                                flowRate: { title: 'Live Flow Rate', value: '1,245', unit: 'm³/hr', trend: '↑ 12.5% vs yesterday' },
                                systemHealth: { title: 'System Health', value: '98%', status: 'Healthy' },
                                activeAlerts: { title: 'Active Alerts', count: '3', ctaText: 'View All Alerts', ctaLink: '#who-we-are' },
                              };
                              updateSectionState('hero', 'statsWidgets', {
                                ...widgets,
                                systemHealth: { ...widgets.systemHealth, title: e.target.value },
                              });
                            }}
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-muted-foreground block mb-1">Value</label>
                          <input
                            type="text"
                            value={settings.hero.statsWidgets?.systemHealth?.value ?? '98%'}
                            onChange={(e) => {
                              const widgets = settings.hero.statsWidgets || {
                                flowRate: { title: 'Live Flow Rate', value: '1,245', unit: 'm³/hr', trend: '↑ 12.5% vs yesterday' },
                                systemHealth: { title: 'System Health', value: '98%', status: 'Healthy' },
                                activeAlerts: { title: 'Active Alerts', count: '3', ctaText: 'View All Alerts', ctaLink: '#who-we-are' },
                              };
                              updateSectionState('hero', 'statsWidgets', {
                                ...widgets,
                                systemHealth: { ...widgets.systemHealth, value: e.target.value },
                              });
                            }}
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-muted-foreground block mb-1">Status Text</label>
                          <input
                            type="text"
                            value={settings.hero.statsWidgets?.systemHealth?.status ?? 'Healthy'}
                            onChange={(e) => {
                              const widgets = settings.hero.statsWidgets || {
                                flowRate: { title: 'Live Flow Rate', value: '1,245', unit: 'm³/hr', trend: '↑ 12.5% vs yesterday' },
                                systemHealth: { title: 'System Health', value: '98%', status: 'Healthy' },
                                activeAlerts: { title: 'Active Alerts', count: '3', ctaText: 'View All Alerts', ctaLink: '#who-we-are' },
                              };
                              updateSectionState('hero', 'statsWidgets', {
                                ...widgets,
                                systemHealth: { ...widgets.systemHealth, status: e.target.value },
                              });
                            }}
                            className={inputCls}
                          />
                        </div>
                      </div>

                      {/* Card 3: Active Alerts */}
                      <div className="p-3.5 rounded-xl border border-border/70 bg-muted/20 space-y-2">
                        <span className="text-[10px] font-mono font-bold text-teal-600 dark:text-teal-400">Card 3: Alerts</span>
                        <div>
                          <label className="text-[10px] font-bold text-muted-foreground block mb-1">Title</label>
                          <input
                            type="text"
                            value={settings.hero.statsWidgets?.activeAlerts?.title ?? 'Active Alerts'}
                            onChange={(e) => {
                              const widgets = settings.hero.statsWidgets || {
                                flowRate: { title: 'Live Flow Rate', value: '1,245', unit: 'm³/hr', trend: '↑ 12.5% vs yesterday' },
                                systemHealth: { title: 'System Health', value: '98%', status: 'Healthy' },
                                activeAlerts: { title: 'Active Alerts', count: '3', ctaText: 'View All Alerts', ctaLink: '#who-we-are' },
                              };
                              updateSectionState('hero', 'statsWidgets', {
                                ...widgets,
                                activeAlerts: { ...widgets.activeAlerts, title: e.target.value },
                              });
                            }}
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-muted-foreground block mb-1">Count</label>
                          <input
                            type="text"
                            value={settings.hero.statsWidgets?.activeAlerts?.count ?? '3'}
                            onChange={(e) => {
                              const widgets = settings.hero.statsWidgets || {
                                flowRate: { title: 'Live Flow Rate', value: '1,245', unit: 'm³/hr', trend: '↑ 12.5% vs yesterday' },
                                systemHealth: { title: 'System Health', value: '98%', status: 'Healthy' },
                                activeAlerts: { title: 'Active Alerts', count: '3', ctaText: 'View All Alerts', ctaLink: '#who-we-are' },
                              };
                              updateSectionState('hero', 'statsWidgets', {
                                ...widgets,
                                activeAlerts: { ...widgets.activeAlerts, count: e.target.value },
                              });
                            }}
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-muted-foreground block mb-1">Link CTA Label</label>
                          <input
                            type="text"
                            value={settings.hero.statsWidgets?.activeAlerts?.ctaText ?? 'View All Alerts'}
                            onChange={(e) => {
                              const widgets = settings.hero.statsWidgets || {
                                flowRate: { title: 'Live Flow Rate', value: '1,245', unit: 'm³/hr', trend: '↑ 12.5% vs yesterday' },
                                systemHealth: { title: 'System Health', value: '98%', status: 'Healthy' },
                                activeAlerts: { title: 'Active Alerts', count: '3', ctaText: 'View All Alerts', ctaLink: '#who-we-are' },
                              };
                              updateSectionState('hero', 'statsWidgets', {
                                ...widgets,
                                activeAlerts: { ...widgets.activeAlerts, ctaText: e.target.value },
                              });
                            }}
                            className={inputCls}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ───────────────────────────────────────────────────────────── */}
              {/* 02. OUR STORY & ORIGIN */}
              {/* ───────────────────────────────────────────────────────────── */}
              {activeSection === 'ourStory' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Eyebrow</label>
                      <input
                        type="text"
                        value={settings.ourStory.eyebrow}
                        onChange={(e) => updateSectionState('ourStory', 'eyebrow', e.target.value)}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Section Title</label>
                      <input
                        type="text"
                        value={settings.ourStory.title}
                        onChange={(e) => updateSectionState('ourStory', 'title', e.target.value)}
                        className={inputCls}
                      />
                    </div>
                  </div>

                  {/* Paragraphs */}
                  <div>
                    <label className={labelCls}>Story Paragraphs</label>
                    <div className="space-y-3">
                      {settings.ourStory.paragraphs.map((p, idx) => (
                        <div key={idx} className="flex gap-2 items-start">
                          <span className="w-6 h-6 rounded-md bg-muted text-muted-foreground text-[10px] font-bold flex items-center justify-center shrink-0 mt-2">
                            {idx + 1}
                          </span>
                          <textarea
                            rows={3}
                            value={p}
                            onChange={(e) => {
                              const updated = [...settings.ourStory.paragraphs];
                              updated[idx] = e.target.value;
                              updateSectionState('ourStory', 'paragraphs', updated);
                            }}
                            className={textareaCls}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = settings.ourStory.paragraphs.filter((_, i) => i !== idx);
                              updateSectionState('ourStory', 'paragraphs', updated);
                            }}
                            className="p-2 text-muted-foreground hover:text-red-500 mt-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          updateSectionState('ourStory', 'paragraphs', [...settings.ourStory.paragraphs, '']);
                        }}
                        className="text-xs"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" /> Add Paragraph
                      </Button>
                    </div>
                  </div>

                  {/* Video Media Asset */}
                  <div className="pt-4 border-t border-border/60">
                    <label className={labelCls}>Story Video Asset (Cloudinary Video)</label>
                    <div className="mt-2 p-4 rounded-xl border border-border/80 bg-muted/20 flex flex-col sm:flex-row items-center gap-4">
                      <div className="w-full sm:w-48 aspect-video rounded-lg bg-slate-950 overflow-hidden shrink-0 border border-border flex items-center justify-center text-white">
                        {settings.ourStory.video ? (
                          <video src={settings.ourStory.video} className="w-full h-full object-cover" muted playsInline />
                        ) : (
                          <Film className="w-8 h-8 opacity-40" />
                        )}
                      </div>
                      <div className="flex-1 space-y-2 w-full">
                        <p className="text-xs font-semibold text-foreground truncate">
                          {settings.ourStory.video ? settings.ourStory.video : 'No video asset assigned'}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          Slot: <strong>ABOUT → OUR STORY → Story Overview Video</strong>
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1">
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => openMediaPicker('ourStory', 'video', undefined, undefined, 'video')}
                            className="bg-teal-700 hover:bg-teal-800 text-white text-xs px-3 shadow-xs"
                          >
                            <Film className="w-3.5 h-3.5 mr-1.5" />
                            Select Video from Library
                          </Button>
                          {settings.ourStory.video && (
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => updateSectionState('ourStory', 'video', '')}
                              className="text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                            >
                              Reset Video
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ───────────────────────────────────────────────────────────── */}
              {/* 03. IMPACT STATS */}
              {/* ───────────────────────────────────────────────────────────── */}
              {activeSection === 'impactStats' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Eyebrow</label>
                      <input
                        type="text"
                        value={settings.impactStats.eyebrow || 'MEASURABLE IMPACT'}
                        onChange={(e) => updateSectionState('impactStats', 'eyebrow', e.target.value)}
                        className={inputCls}
                        placeholder="MEASURABLE IMPACT"
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Section Title</label>
                      <input
                        type="text"
                        value={settings.impactStats.title || 'Impact Backed by Verified Data'}
                        onChange={(e) => updateSectionState('impactStats', 'title', e.target.value)}
                        className={inputCls}
                        placeholder="Impact Backed by Verified Data"
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Section Description</label>
                    <textarea
                      rows={2}
                      value={settings.impactStats.description || 'Real-time telemetry, continuous validation, and tamper-resistant auditing at scale.'}
                      onChange={(e) => updateSectionState('impactStats', 'description', e.target.value)}
                      className={textareaCls}
                      placeholder="Real-time telemetry, continuous validation, and tamper-resistant auditing at scale."
                    />
                  </div>

                  <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-foreground">Repeatable Statistics Cards</h3>
                      <p className="text-[11px] text-muted-foreground">Displayed in the 4-card metric strip below the story</p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        const nextOrder = settings.impactStats.list.length + 1;
                        const newItem = {
                          value: 'New Stat',
                          label: 'Stat Label',
                          sublabel: 'Supporting description text',
                          icon: 'Droplets',
                          order: nextOrder,
                          isActive: true,
                        };
                        updateSectionState('impactStats', 'list', [...settings.impactStats.list, newItem]);
                      }}
                      className="bg-teal-700 hover:bg-teal-800 text-white text-xs px-3 shadow-xs font-semibold"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" /> Add Statistic
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {settings.impactStats.list.map((stat, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-border/80 bg-muted/10 space-y-3">
                        <div className="flex items-center justify-between gap-2 border-b border-border/40 pb-2">
                          <span className="text-xs font-bold text-foreground flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-[10px] flex items-center justify-center font-bold">
                              {idx + 1}
                            </span>
                            {stat.value || 'Untitled Stat'} — {stat.label}
                          </span>

                          <div className="flex items-center gap-1">
                            {/* Move Up */}
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => {
                                const list = [...settings.impactStats.list];
                                const temp = list[idx - 1];
                                list[idx - 1] = list[idx];
                                list[idx] = temp;
                                updateSectionState('impactStats', 'list', list);
                              }}
                              className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                            >
                              <ArrowUp className="w-4 h-4" />
                            </button>
                            {/* Move Down */}
                            <button
                              type="button"
                              disabled={idx === settings.impactStats.list.length - 1}
                              onClick={() => {
                                const list = [...settings.impactStats.list];
                                const temp = list[idx + 1];
                                list[idx + 1] = list[idx];
                                list[idx] = temp;
                                updateSectionState('impactStats', 'list', list);
                              }}
                              className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                            >
                              <ArrowDown className="w-4 h-4" />
                            </button>
                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => {
                                setDeleteConfirm({
                                  title: 'Delete Metric Stat?',
                                  message: `Are you sure you want to remove '${stat.value}'? It will no longer appear on the public About page.`,
                                  onConfirm: () => {
                                    const list = settings.impactStats.list.filter((_, i) => i !== idx);
                                    updateSectionState('impactStats', 'list', list);
                                  },
                                });
                              }}
                              className="p-1 text-red-500 hover:text-red-700 ml-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className={labelCls}>Metric Value</label>
                            <input
                              type="text"
                              value={stat.value}
                              onChange={(e) => {
                                const list = [...settings.impactStats.list];
                                list[idx].value = e.target.value;
                                updateSectionState('impactStats', 'list', list);
                              }}
                              className={inputCls}
                              placeholder="e.g. 10,000+"
                            />
                          </div>
                          <div>
                            <label className={labelCls}>Label</label>
                            <input
                              type="text"
                              value={stat.label}
                              onChange={(e) => {
                                const list = [...settings.impactStats.list];
                                list[idx].label = e.target.value;
                                updateSectionState('impactStats', 'list', list);
                              }}
                              className={inputCls}
                              placeholder="e.g. Sensors Deployed"
                            />
                          </div>
                          <div>
                            <label className={labelCls}>Lucide Icon Name</label>
                            <input
                              type="text"
                              value={stat.icon}
                              onChange={(e) => {
                                const list = [...settings.impactStats.list];
                                list[idx].icon = e.target.value;
                                updateSectionState('impactStats', 'list', list);
                              }}
                              className={inputCls}
                              placeholder="Droplets, Radio, Activity, Building2"
                            />
                          </div>
                        </div>

                        <div>
                          <label className={labelCls}>Sublabel / Supporting Note</label>
                          <input
                            type="text"
                            value={stat.sublabel}
                            onChange={(e) => {
                              const list = [...settings.impactStats.list];
                              list[idx].sublabel = e.target.value;
                              updateSectionState('impactStats', 'list', list);
                            }}
                            className={inputCls}
                            placeholder="e.g. Across municipal & enterprise networks"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ───────────────────────────────────────────────────────────── */}
              {/* 04. PURPOSE & DIRECTION */}
              {/* ───────────────────────────────────────────────────────────── */}
              {activeSection === 'purposeDirection' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Section Eyebrow</label>
                      <input
                        type="text"
                        value={settings.purposeDirection.eyebrow}
                        onChange={(e) => updateSectionState('purposeDirection', 'eyebrow', e.target.value)}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Section Title</label>
                      <input
                        type="text"
                        value={settings.purposeDirection.title}
                        onChange={(e) => updateSectionState('purposeDirection', 'title', e.target.value)}
                        className={inputCls}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Section Subtitle / Description</label>
                    <textarea
                      rows={2}
                      value={settings.purposeDirection.description}
                      onChange={(e) => updateSectionState('purposeDirection', 'description', e.target.value)}
                      className={textareaCls}
                    />
                  </div>

                  {/* Vision Card */}
                  <div className="p-4 rounded-xl border border-teal-500/30 bg-teal-500/5 space-y-3">
                    <div className="flex items-center justify-between border-b border-teal-500/20 pb-2">
                      <span className="text-xs font-bold text-teal-800 dark:text-teal-300 flex items-center gap-2">
                        <Target className="w-4 h-4" /> OUR VISION
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className={labelCls}>Badge Label</label>
                        <input
                          type="text"
                          value={settings.purposeDirection.vision.badge}
                          onChange={(e) => {
                            setSettings({
                              ...settings,
                              purposeDirection: {
                                ...settings.purposeDirection,
                                vision: {
                                  ...settings.purposeDirection.vision,
                                  badge: e.target.value,
                                },
                              },
                            });
                            setIsDirty(true);
                          }}
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Card Title</label>
                        <input
                          type="text"
                          value={settings.purposeDirection.vision.title}
                          onChange={(e) => {
                            setSettings({
                              ...settings,
                              purposeDirection: {
                                ...settings.purposeDirection,
                                vision: {
                                  ...settings.purposeDirection.vision,
                                  title: e.target.value,
                                },
                              },
                            });
                            setIsDirty(true);
                          }}
                          className={inputCls}
                        />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Vision Statement</label>
                      <textarea
                        rows={3}
                        value={settings.purposeDirection.vision.description}
                        onChange={(e) => {
                          setSettings({
                            ...settings,
                            purposeDirection: {
                              ...settings.purposeDirection,
                              vision: {
                                ...settings.purposeDirection.vision,
                                description: e.target.value,
                              },
                            },
                          });
                          setIsDirty(true);
                        }}
                        className={textareaCls}
                      />
                    </div>
                  </div>

                  {/* Mission Card */}
                  <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-500/5 space-y-3">
                    <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
                      <span className="text-xs font-bold text-cyan-800 dark:text-cyan-300 flex items-center gap-2">
                        <Target className="w-4 h-4" /> OUR MISSION
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className={labelCls}>Badge Label</label>
                        <input
                          type="text"
                          value={settings.purposeDirection.mission.badge}
                          onChange={(e) => {
                            setSettings({
                              ...settings,
                              purposeDirection: {
                                ...settings.purposeDirection,
                                mission: {
                                  ...settings.purposeDirection.mission,
                                  badge: e.target.value,
                                },
                              },
                            });
                            setIsDirty(true);
                          }}
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Card Title</label>
                        <input
                          type="text"
                          value={settings.purposeDirection.mission.title}
                          onChange={(e) => {
                            setSettings({
                              ...settings,
                              purposeDirection: {
                                ...settings.purposeDirection,
                                mission: {
                                  ...settings.purposeDirection.mission,
                                  title: e.target.value,
                                },
                              },
                            });
                            setIsDirty(true);
                          }}
                          className={inputCls}
                        />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Mission Statement</label>
                      <textarea
                        rows={3}
                        value={settings.purposeDirection.mission.description}
                        onChange={(e) => {
                          setSettings({
                            ...settings,
                            purposeDirection: {
                              ...settings.purposeDirection,
                              mission: {
                                ...settings.purposeDirection.mission,
                                description: e.target.value,
                              },
                            },
                          });
                          setIsDirty(true);
                        }}
                        className={textareaCls}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ───────────────────────────────────────────────────────────── */}
              {/* 05. THE PILLARS OF VEENERO */}
              {/* ───────────────────────────────────────────────────────────── */}
              {activeSection === 'pillars' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Eyebrow</label>
                      <input
                        type="text"
                        value={settings.pillars.eyebrow}
                        onChange={(e) => updateSectionState('pillars', 'eyebrow', e.target.value)}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Section Title</label>
                      <input
                        type="text"
                        value={settings.pillars.title}
                        onChange={(e) => updateSectionState('pillars', 'title', e.target.value)}
                        className={inputCls}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Section Description</label>
                    <textarea
                      rows={2}
                      value={settings.pillars.description}
                      onChange={(e) => updateSectionState('pillars', 'description', e.target.value)}
                      className={textareaCls}
                    />
                  </div>

                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-xs font-bold text-foreground">Core Pillars</h3>
                        <p className="text-[11px] text-muted-foreground">Each pillar features an editorial photographic image from the Media Library</p>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => {
                          const nextOrder = settings.pillars.list.length + 1;
                          const newPillar = {
                            title: 'New Pillar',
                            description: 'Pillar description',
                            image: '',
                            order: nextOrder,
                            isActive: true,
                          };
                          updateSectionState('pillars', 'list', [...settings.pillars.list, newPillar]);
                        }}
                        className="bg-teal-700 hover:bg-teal-800 text-white text-xs px-3 shadow-xs font-semibold"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" /> Add Pillar
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {settings.pillars.list.map((pillar, idx) => (
                        <div key={idx} className="p-4 rounded-xl border border-border/80 bg-muted/10 space-y-3">
                          <div className="flex items-center justify-between gap-2 border-b border-border/40 pb-2">
                            <span className="text-xs font-bold text-foreground flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded bg-slate-900 text-teal-300 text-[10px] font-bold">
                                0{idx + 1}
                              </span>
                              {pillar.title}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => {
                                  const list = [...settings.pillars.list];
                                  const temp = list[idx - 1];
                                  list[idx - 1] = list[idx];
                                  list[idx] = temp;
                                  updateSectionState('pillars', 'list', list);
                                }}
                                className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                              >
                                <ArrowUp className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === settings.pillars.list.length - 1}
                                onClick={() => {
                                  const list = [...settings.pillars.list];
                                  const temp = list[idx + 1];
                                  list[idx + 1] = list[idx];
                                  list[idx] = temp;
                                  updateSectionState('pillars', 'list', list);
                                }}
                                className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                              >
                                <ArrowDown className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setDeleteConfirm({
                                    title: 'Delete Pillar?',
                                    message: `Are you sure you want to delete '${pillar.title}'?`,
                                    onConfirm: () => {
                                      const list = settings.pillars.list.filter((_, i) => i !== idx);
                                      updateSectionState('pillars', 'list', list);
                                    },
                                  });
                                }}
                                className="p-1 text-red-500 hover:text-red-700 ml-1"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                            {/* Pillar Image Preview & Picker */}
                            <div className="sm:col-span-4 aspect-video rounded-lg bg-slate-950 overflow-hidden border border-border relative flex items-center justify-center">
                              {pillar.image ? (
                                <img src={pillar.image} alt={pillar.title} className="w-full h-full object-cover" />
                              ) : (
                                <ImageIcon className="w-6 h-6 text-muted-foreground opacity-40" />
                              )}
                            </div>

                            <div className="sm:col-span-8 space-y-2">
                              <div>
                                <label className={labelCls}>Pillar Title</label>
                                <input
                                  type="text"
                                  value={pillar.title}
                                  onChange={(e) => {
                                    const list = [...settings.pillars.list];
                                    list[idx].title = e.target.value;
                                    updateSectionState('pillars', 'list', list);
                                  }}
                                  className={inputCls}
                                />
                              </div>
                              <div>
                                <label className={labelCls}>Description</label>
                                <input
                                  type="text"
                                  value={pillar.description}
                                  onChange={(e) => {
                                    const list = [...settings.pillars.list];
                                    list[idx].description = e.target.value;
                                    updateSectionState('pillars', 'list', list);
                                  }}
                                  className={inputCls}
                                />
                              </div>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => openMediaPicker('pillars', 'image', idx, 'list', 'image')}
                                className="text-xs text-teal-700 dark:text-teal-300"
                              >
                                <ImageIcon className="w-3.5 h-3.5 mr-1" />
                                {pillar.image ? 'Change Media' : 'Assign Media'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ───────────────────────────────────────────────────────────── */}
              {/* 06. WHY CHOOSE VEENERO */}
              {/* ───────────────────────────────────────────────────────────── */}
              {activeSection === 'whyChoose' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className={labelCls}>Eyebrow</label>
                      <input
                        type="text"
                        value={settings.whyChoose.eyebrow}
                        onChange={(e) => updateSectionState('whyChoose', 'eyebrow', e.target.value)}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Title Prefix</label>
                      <input
                        type="text"
                        value={settings.whyChoose.title}
                        onChange={(e) => updateSectionState('whyChoose', 'title', e.target.value)}
                        className={inputCls}
                        placeholder="What Sets"
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Highlighted Suffix</label>
                      <input
                        type="text"
                        value={settings.whyChoose.highlightedText}
                        onChange={(e) => updateSectionState('whyChoose', 'highlightedText', e.target.value)}
                        className={inputCls}
                        placeholder="Veenero Apart"
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Section Description</label>
                    <textarea
                      rows={2}
                      value={settings.whyChoose.description}
                      onChange={(e) => updateSectionState('whyChoose', 'description', e.target.value)}
                      className={textareaCls}
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Bottom Trust Text</label>
                    <input
                      type="text"
                      value={settings.whyChoose.bottomTrustText}
                      onChange={(e) => updateSectionState('whyChoose', 'bottomTrustText', e.target.value)}
                      className={inputCls}
                      placeholder="Built for reliability. Designed for scale. Driven by impact."
                    />
                  </div>

                  {/* Feature Cards CRUD */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-xs font-bold text-foreground">Infrastructure Differentiators (4 Cards)</h3>
                        <p className="text-[11px] text-muted-foreground">Photographic card visual, icon & description</p>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => {
                          const nextOrder = settings.whyChoose.list.length + 1;
                          const newItem = {
                            title: 'New Feature',
                            description: 'Feature description',
                            icon: 'Layers',
                            image: '',
                            order: nextOrder,
                            isActive: true,
                          };
                          updateSectionState('whyChoose', 'list', [...settings.whyChoose.list, newItem]);
                        }}
                        className="bg-teal-700 hover:bg-teal-800 text-white text-xs px-3 shadow-xs font-semibold"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" /> Add Feature
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {settings.whyChoose.list.map((item, idx) => (
                        <div key={idx} className="p-4 rounded-xl border border-border/80 bg-muted/10 space-y-3">
                          <div className="flex items-center justify-between gap-2 border-b border-border/40 pb-2">
                            <span className="text-xs font-bold text-foreground">
                              {item.title || 'Untitled Feature'}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => {
                                  const list = [...settings.whyChoose.list];
                                  const temp = list[idx - 1];
                                  list[idx - 1] = list[idx];
                                  list[idx] = temp;
                                  updateSectionState('whyChoose', 'list', list);
                                }}
                                className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                              >
                                <ArrowUp className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === settings.whyChoose.list.length - 1}
                                onClick={() => {
                                  const list = [...settings.whyChoose.list];
                                  const temp = list[idx + 1];
                                  list[idx + 1] = list[idx];
                                  list[idx] = temp;
                                  updateSectionState('whyChoose', 'list', list);
                                }}
                                className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                              >
                                <ArrowDown className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setDeleteConfirm({
                                    title: 'Delete Feature?',
                                    message: `Are you sure you want to delete '${item.title}'?`,
                                    onConfirm: () => {
                                      const list = settings.whyChoose.list.filter((_, i) => i !== idx);
                                      updateSectionState('whyChoose', 'list', list);
                                    },
                                  });
                                }}
                                className="p-1 text-red-500 hover:text-red-700 ml-1"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                            <div className="sm:col-span-4 aspect-video rounded-lg bg-slate-950 overflow-hidden border border-border flex items-center justify-center">
                              {item.image ? (
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                              ) : (
                                <ImageIcon className="w-6 h-6 opacity-40 text-muted-foreground" />
                              )}
                            </div>

                            <div className="sm:col-span-8 space-y-2">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div>
                                  <label className={labelCls}>Title</label>
                                  <input
                                    type="text"
                                    value={item.title}
                                    onChange={(e) => {
                                      const list = [...settings.whyChoose.list];
                                      list[idx].title = e.target.value;
                                      updateSectionState('whyChoose', 'list', list);
                                    }}
                                    className={inputCls}
                                  />
                                </div>
                                <div>
                                  <label className={labelCls}>Icon Name</label>
                                  <input
                                    type="text"
                                    value={item.icon}
                                    onChange={(e) => {
                                      const list = [...settings.whyChoose.list];
                                      list[idx].icon = e.target.value;
                                      updateSectionState('whyChoose', 'list', list);
                                    }}
                                    className={inputCls}
                                    placeholder="Layers, Zap, ShieldCheck, Share2"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className={labelCls}>Description</label>
                                <input
                                  type="text"
                                  value={item.description}
                                  onChange={(e) => {
                                    const list = [...settings.whyChoose.list];
                                    list[idx].description = e.target.value;
                                    updateSectionState('whyChoose', 'list', list);
                                  }}
                                  className={inputCls}
                                />
                              </div>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => openMediaPicker('whyChoose', 'image', idx, 'list', 'image')}
                                className="text-xs text-teal-700 dark:text-teal-300"
                              >
                                <ImageIcon className="w-3.5 h-3.5 mr-1" />
                                {item.image ? 'Change Media' : 'Assign Media'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ───────────────────────────────────────────────────────────── */}
              {/* 07. OUR TEAM */}
              {/* ───────────────────────────────────────────────────────────── */}
              {activeSection === 'leadership' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Eyebrow</label>
                      <input
                        type="text"
                        value={settings.leadership.eyebrow}
                        onChange={(e) => updateSectionState('leadership', 'eyebrow', e.target.value)}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Section Title</label>
                      <input
                        type="text"
                        value={settings.leadership.title}
                        onChange={(e) => updateSectionState('leadership', 'title', e.target.value)}
                        className={inputCls}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Section Description</label>
                    <textarea
                      rows={2}
                      value={settings.leadership.description}
                      onChange={(e) => updateSectionState('leadership', 'description', e.target.value)}
                      className={textareaCls}
                    />
                  </div>

                  {/* Team Members CRUD */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-xs font-bold text-foreground">Team Role Cards</h3>
                        <p className="text-[11px] text-muted-foreground">Founding, Telemetry, and Data Science division cards</p>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => {
                          const nextOrder = settings.leadership.team.length + 1;
                          const newMember = {
                            name: 'Team Division',
                            role: 'Division Role',
                            bio: 'Division focus and bio',
                            icon: 'Users2',
                            image: '',
                            order: nextOrder,
                            isActive: true,
                          };
                          updateSectionState('leadership', 'team', [...settings.leadership.team, newMember]);
                        }}
                        className="bg-teal-700 hover:bg-teal-800 text-white text-xs px-3 shadow-xs font-semibold"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" /> Add Team Card
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {settings.leadership.team.map((member, idx) => (
                        <div key={idx} className="p-4 rounded-xl border border-border/80 bg-muted/10 space-y-3">
                          <div className="flex items-center justify-between gap-2 border-b border-border/40 pb-2">
                            <span className="text-xs font-bold text-foreground">
                              {member.name} — <span className="text-teal-700 dark:text-teal-400 font-semibold">{member.role}</span>
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => {
                                  const list = [...settings.leadership.team];
                                  const temp = list[idx - 1];
                                  list[idx - 1] = list[idx];
                                  list[idx] = temp;
                                  updateSectionState('leadership', 'team', list);
                                }}
                                className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                              >
                                <ArrowUp className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === settings.leadership.team.length - 1}
                                onClick={() => {
                                  const list = [...settings.leadership.team];
                                  const temp = list[idx + 1];
                                  list[idx + 1] = list[idx];
                                  list[idx] = temp;
                                  updateSectionState('leadership', 'team', list);
                                }}
                                className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                              >
                                <ArrowDown className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setDeleteConfirm({
                                    title: 'Delete Team Card?',
                                    message: `Are you sure you want to delete '${member.name}'?`,
                                    onConfirm: () => {
                                      const list = settings.leadership.team.filter((_, i) => i !== idx);
                                      updateSectionState('leadership', 'team', list);
                                    },
                                  });
                                }}
                                className="p-1 text-red-500 hover:text-red-700 ml-1"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                            <div className="sm:col-span-4 aspect-video rounded-lg bg-slate-950 overflow-hidden border border-border flex items-center justify-center">
                              {member.image ? (
                                <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                              ) : (
                                <ImageIcon className="w-6 h-6 opacity-40 text-muted-foreground" />
                              )}
                            </div>

                            <div className="sm:col-span-8 space-y-2">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div>
                                  <label className={labelCls}>Division / Member Name</label>
                                  <input
                                    type="text"
                                    value={member.name}
                                    onChange={(e) => {
                                      const list = [...settings.leadership.team];
                                      list[idx].name = e.target.value;
                                      updateSectionState('leadership', 'team', list);
                                    }}
                                    className={inputCls}
                                  />
                                </div>
                                <div>
                                  <label className={labelCls}>Role / Discipline</label>
                                  <input
                                    type="text"
                                    value={member.role}
                                    onChange={(e) => {
                                      const list = [...settings.leadership.team];
                                      list[idx].role = e.target.value;
                                      updateSectionState('leadership', 'team', list);
                                    }}
                                    className={inputCls}
                                  />
                                </div>
                              </div>
                              <div>
                                <label className={labelCls}>Biography / Focus</label>
                                <textarea
                                  rows={2}
                                  value={member.bio}
                                  onChange={(e) => {
                                    const list = [...settings.leadership.team];
                                    list[idx].bio = e.target.value;
                                    updateSectionState('leadership', 'team', list);
                                  }}
                                  className={textareaCls}
                                />
                              </div>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => openMediaPicker('leadership', 'image', idx, 'team', 'image')}
                                className="text-xs text-teal-700 dark:text-teal-300"
                              >
                                <ImageIcon className="w-3.5 h-3.5 mr-1" />
                                {member.image ? 'Change Media' : 'Assign Media'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ───────────────────────────────────────────────────────────── */}
              {/* 08. FINAL CALL TO ACTION */}
              {/* ───────────────────────────────────────────────────────────── */}
              {activeSection === 'cta' && (
                <div className="space-y-5">
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
                      <label className={labelCls}>Heading</label>
                      <input
                        type="text"
                        value={settings.cta.title}
                        onChange={(e) => updateSectionState('cta', 'title', e.target.value)}
                        className={inputCls}
                      />
                    </div>
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
                      <label className={labelCls}>Button Text</label>
                      <input
                        type="text"
                        value={settings.cta.primaryButtonText}
                        onChange={(e) => updateSectionState('cta', 'primaryButtonText', e.target.value)}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Button Link</label>
                      <input
                        type="text"
                        value={settings.cta.primaryButtonLink}
                        onChange={(e) => updateSectionState('cta', 'primaryButtonLink', e.target.value)}
                        className={inputCls}
                        placeholder="/contact"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ───────────────────────────────────────────────────────────── */}
              {/* 10. SEO METADATA */}
              {/* ───────────────────────────────────────────────────────────── */}
              {activeSection === 'seo' && (
                <div className="space-y-5">
                  <div>
                    <label className={labelCls}>Page Meta Title (Browser & Search Engine Title)</label>
                    <input
                      type="text"
                      value={settings.seo.metaTitle}
                      onChange={(e) => updateSectionState('seo', 'metaTitle', e.target.value)}
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Meta Description (Search Snippet)</label>
                    <textarea
                      rows={4}
                      value={settings.seo.metaDescription}
                      onChange={(e) => updateSectionState('seo', 'metaDescription', e.target.value)}
                      className={textareaCls}
                    />
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Section Footer Save Bar */}
            <div className="px-6 py-4 border-t border-border bg-muted/10 flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                Last updated: <strong>{settings.updatedAt ? new Date(settings.updatedAt).toLocaleDateString() : 'Recently'}</strong> by{' '}
                <strong>{settings.lastUpdatedBy || 'Admin'}</strong>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={fetchSettings}
                  disabled={saving || !isDirty}
                  className="text-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1" />
                  Discard Changes
                </Button>
                <Button
                  size="sm"
                  disabled={saving}
                  onClick={() => handleSaveSection(activeSection)}
                  className="bg-teal-700 hover:bg-teal-800 text-white text-xs px-5 shadow-xs font-semibold"
                >
                  <Save className="w-3.5 h-3.5 mr-1.5" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default AboutCms;
