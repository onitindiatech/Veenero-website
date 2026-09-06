import React, { useState, useEffect } from 'react';
import {
  Save,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Globe,
  Film,
  Sparkles,
  Layers,
  Zap,
  Activity,
  MessageSquare,
  Image as ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  ImpactPageSettings,
  getAdminImpactSettings,
  updateAdminImpactSection,
  updateAdminImpactSettings,
} from '@/services/impact.service';
import { MediaPickerModal } from '../../components/cms/MediaPickerModal';
import { MediaAsset } from '../../services/media.service';

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

const SECTIONS = [
  { id: 'hero', label: '01 — Hero Section', desc: 'Main cover title, description & CTA', icon: Sparkles },
  { id: 'outcomes', label: '02 — Impact Metrics', desc: '4 Core quantified performance statistics', icon: Zap },
  { id: 'storyline', label: '03 — Impact Journey', desc: 'Process steps from blindspots to audit-ready', icon: Activity },
  { id: 'ecosystem', label: '04 — Cross-Sector Deployments', desc: 'Industry deployment domain cards & quote', icon: Layers },
  { id: 'sustainability', label: '05 — Sustainability & Video', desc: 'Long-term resilience pillars & background video', icon: Film },
  { id: 'cta', label: '06 — Final Call to Action', desc: 'Bottom banner heading & inquiry buttons', icon: MessageSquare },
  { id: 'seo', label: '07 — SEO Metadata', desc: 'Search engine title & meta description', icon: Globe },
];

export const ImpactCms: React.FC = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [settings, setSettings] = useState<ImpactPageSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Media Picker state
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<{
    sectionKey: string;
    field: string;
    subIndex?: number;
    resourceType?: 'image' | 'video' | 'all';
  } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await getAdminImpactSettings();
      setSettings(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to load Impact page settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSaveSection = async (sectionKey: string) => {
    if (!settings) return;
    setSaving(true);
    try {
      const sectionData = (settings as any)[sectionKey];
      await updateAdminImpactSection(sectionKey, sectionData);
      showToast(`${SECTIONS.find((s) => s.id === sectionKey)?.label || sectionKey} saved successfully.`);
    } catch (err: any) {
      showToast(err.message || 'Failed to save section.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAll = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const updated = await updateAdminImpactSettings(settings);
      setSettings(updated);
      showToast('All Impact page settings saved to database successfully!');
    } catch (err: any) {
      showToast(err.message || 'Failed to save settings.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const openPicker = (
    sectionKey: string,
    field: string,
    subIndex?: number,
    resourceType: 'image' | 'video' | 'all' = 'image'
  ) => {
    setPickerTarget({ sectionKey, field, subIndex, resourceType });
    setPickerOpen(true);
  };

  const handleMediaSelect = (asset: MediaAsset) => {
    if (!pickerTarget || !settings) return;
    const { sectionKey, field, subIndex } = pickerTarget;

    const next = JSON.parse(JSON.stringify(settings));
    if (subIndex !== undefined) {
      next[sectionKey][field][subIndex].image = asset.secureUrl;
    } else {
      next[sectionKey][field] = asset.secureUrl;
      if (asset.publicId) {
        next[sectionKey][`${field}PublicId`] = asset.publicId;
      }
    }
    setSettings(next);
    setPickerOpen(false);
    showToast(`Asset selected: ${asset.displayName || asset.originalFilename}`);
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
          <p className="text-xs font-medium text-muted-foreground">Loading Impact CMS configurations...</p>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="p-8 text-center text-rose-500">
        <p>Failed to load configurations. Please check backend connection.</p>
        <Button onClick={loadSettings} className="mt-4" variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-700 dark:text-teal-300 text-xs font-mono font-bold mb-2">
            <Zap className="w-3.5 h-3.5" />
            <span>IMPACT PAGE CMS</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Impact Page Content</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage verifiable telemetry stats, real-world cross-sector deployments, and sustainability media.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleSaveAll}
            disabled={saving}
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs"
          >
            <Save className="w-4 h-4 mr-1.5" />
            {saving ? 'Saving All...' : 'Save All Settings'}
          </Button>
          <a
            href="/impact"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 rounded-xl border border-border/80 text-xs font-semibold hover:bg-muted/50 transition-colors inline-flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            Live Preview
          </a>
        </div>
      </div>

      {/* Grid Layout: Left Section List + Right Form Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-4 space-y-2 bg-card/60 p-3 rounded-2xl border border-border/60 shadow-xs">
          <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-muted-foreground px-3 block mb-1">
            Sections ({SECTIONS.length})
          </span>
          {SECTIONS.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`w-full text-left p-3 rounded-xl transition-all duration-150 flex items-start gap-3 cursor-pointer ${
                  isActive
                    ? 'bg-teal-500/15 border border-teal-500/30 text-teal-900 dark:text-teal-200 shadow-2xs'
                    : 'hover:bg-muted/60 text-muted-foreground hover:text-foreground border border-transparent'
                }`}
              >
                <div
                  className={`p-2 rounded-lg shrink-0 ${
                    isActive ? 'bg-teal-600 text-white' : 'bg-muted/80 text-muted-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-bold truncate text-foreground">{sec.label}</div>
                  <div className="text-[11px] text-muted-foreground truncate">{sec.desc}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Section Editor Panel */}
        <div className="lg:col-span-8 bg-card rounded-2xl border border-border/70 p-6 shadow-xs space-y-6">
          {/* Section Header */}
          <div className="flex items-center justify-between pb-4 border-b border-border/60">
            <div>
              <h2 className="text-base font-bold text-foreground">
                {SECTIONS.find((s) => s.id === activeSection)?.label}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {SECTIONS.find((s) => s.id === activeSection)?.desc}
              </p>
            </div>
            <Button
              onClick={() => handleSaveSection(activeSection)}
              disabled={saving}
              size="sm"
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl"
            >
              <Save className="w-3.5 h-3.5 mr-1" />
              {saving ? 'Saving...' : 'Save Section'}
            </Button>
          </div>

          {/* 1. HERO SECTION */}
          {activeSection === 'hero' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/60">
                <span className="text-xs font-bold">Section Visibility</span>
                <button
                  type="button"
                  onClick={() =>
                    setSettings({
                      ...settings,
                      hero: { ...settings.hero, visible: !settings.hero.visible },
                    })
                  }
                  className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
                    settings.hero.visible
                      ? 'bg-teal-50 border-teal-200 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300'
                      : 'bg-muted border-border text-muted-foreground'
                  }`}
                >
                  {settings.hero.visible ? 'Visible' : 'Hidden'}
                </button>
              </div>

              <div>
                <label className={labelCls}>Eyebrow Badge</label>
                <input
                  type="text"
                  value={settings.hero.eyebrow}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      hero: { ...settings.hero, eyebrow: e.target.value },
                    })
                  }
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Main Heading (H1)</label>
                <input
                  type="text"
                  value={settings.hero.title}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      hero: { ...settings.hero, title: e.target.value },
                    })
                  }
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Hero Description</label>
                <textarea
                  rows={3}
                  value={settings.hero.description}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      hero: { ...settings.hero, description: e.target.value },
                    })
                  }
                  className={textareaCls}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Primary CTA Text</label>
                  <input
                    type="text"
                    value={settings.hero.primaryCtaText}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        hero: { ...settings.hero, primaryCtaText: e.target.value },
                      })
                    }
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Secondary CTA Text</label>
                  <input
                    type="text"
                    value={settings.hero.secondaryCtaText}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        hero: { ...settings.hero, secondaryCtaText: e.target.value },
                      })
                    }
                    className={inputCls}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2. OUTCOMES / METRICS */}
          {activeSection === 'outcomes' && (
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Section Eyebrow</label>
                <input
                  type="text"
                  value={settings.outcomes.eyebrow}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      outcomes: { ...settings.outcomes, eyebrow: e.target.value },
                    })
                  }
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Section Title</label>
                <input
                  type="text"
                  value={settings.outcomes.title}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      outcomes: { ...settings.outcomes, title: e.target.value },
                    })
                  }
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Section Description</label>
                <textarea
                  rows={2}
                  value={settings.outcomes.description}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      outcomes: { ...settings.outcomes, description: e.target.value },
                    })
                  }
                  className={textareaCls}
                />
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className={labelCls}>Metrics Cards ({settings.outcomes.pillars.length})</label>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const next = [...settings.outcomes.pillars];
                      next.push({
                        value: '99.8%',
                        label: 'New Metric',
                        description: 'Description of metric impact.',
                        icon: 'Activity',
                        tag: 'Verified',
                      });
                      setSettings({
                        ...settings,
                        outcomes: { ...settings.outcomes, pillars: next },
                      });
                    }}
                    className="text-xs h-7 rounded-lg"
                  >
                    <Plus className="w-3 h-3 mr-1" /> Add Card
                  </Button>
                </div>

                {settings.outcomes.pillars.map((pillar, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-border/60 bg-muted/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-teal-600">Metric #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const next = settings.outcomes.pillars.filter((_, i) => i !== idx);
                          setSettings({
                            ...settings,
                            outcomes: { ...settings.outcomes, pillars: next },
                          });
                        }}
                        className="text-rose-500 hover:text-rose-600 text-xs font-bold"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelCls}>Stat Value (e.g. 100%, 30-40%)</label>
                        <input
                          type="text"
                          value={pillar.value}
                          onChange={(e) => {
                            const next = [...settings.outcomes.pillars];
                            next[idx].value = e.target.value;
                            setSettings({
                              ...settings,
                              outcomes: { ...settings.outcomes, pillars: next },
                            });
                          }}
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Metric Label</label>
                        <input
                          type="text"
                          value={pillar.label}
                          onChange={(e) => {
                            const next = [...settings.outcomes.pillars];
                            next[idx].label = e.target.value;
                            setSettings({
                              ...settings,
                              outcomes: { ...settings.outcomes, pillars: next },
                            });
                          }}
                          className={inputCls}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={labelCls}>Description</label>
                      <textarea
                        rows={2}
                        value={pillar.description}
                        onChange={(e) => {
                          const next = [...settings.outcomes.pillars];
                          next[idx].description = e.target.value;
                          setSettings({
                            ...settings,
                            outcomes: { ...settings.outcomes, pillars: next },
                          });
                        }}
                        className={textareaCls}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. ECOSYSTEM / DEPLOYMENTS */}
          {activeSection === 'ecosystem' && (
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Eyebrow</label>
                <input
                  type="text"
                  value={settings.ecosystem.eyebrow}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      ecosystem: { ...settings.ecosystem, eyebrow: e.target.value },
                    })
                  }
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Heading</label>
                <input
                  type="text"
                  value={settings.ecosystem.title}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      ecosystem: { ...settings.ecosystem, title: e.target.value },
                    })
                  }
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Quote Text</label>
                <textarea
                  rows={2}
                  value={settings.ecosystem.quote.text}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      ecosystem: {
                        ...settings.ecosystem,
                        quote: { ...settings.ecosystem.quote, text: e.target.value },
                      },
                    })
                  }
                  className={textareaCls}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Quote Author</label>
                  <input
                    type="text"
                    value={settings.ecosystem.quote.author}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        ecosystem: {
                          ...settings.ecosystem,
                          quote: { ...settings.ecosystem.quote, author: e.target.value },
                        },
                      })
                    }
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Quote Organization</label>
                  <input
                    type="text"
                    value={settings.ecosystem.quote.organization}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        ecosystem: {
                          ...settings.ecosystem,
                          quote: { ...settings.ecosystem.quote, organization: e.target.value },
                        },
                      })
                    }
                    className={inputCls}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 4. SUSTAINABILITY & VIDEO */}
          {activeSection === 'sustainability' && (
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Section Title</label>
                <input
                  type="text"
                  value={settings.sustainability.title}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      sustainability: { ...settings.sustainability, title: e.target.value },
                    })
                  }
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Description</label>
                <textarea
                  rows={3}
                  value={settings.sustainability.description}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      sustainability: { ...settings.sustainability, description: e.target.value },
                    })
                  }
                  className={textareaCls}
                />
              </div>

              <div>
                <label className={labelCls}>Video URL (Cloudinary video asset or URL)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={settings.sustainability.videoUrl || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        sustainability: { ...settings.sustainability, videoUrl: e.target.value },
                      })
                    }
                    placeholder="https://res.cloudinary.com/.../video.mp4"
                    className={inputCls}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => openPicker('sustainability', 'videoUrl', undefined, 'video')}
                    className="shrink-0 text-xs font-bold rounded-xl"
                  >
                    <Film className="w-3.5 h-3.5 mr-1" /> Pick Video
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* 5. CTA SECTION */}
          {activeSection === 'cta' && (
            <div className="space-y-4">
              <div>
                <label className={labelCls}>CTA Title</label>
                <input
                  type="text"
                  value={settings.cta.title}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      cta: { ...settings.cta, title: e.target.value },
                    })
                  }
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>CTA Description</label>
                <textarea
                  rows={2}
                  value={settings.cta.description}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      cta: { ...settings.cta, description: e.target.value },
                    })
                  }
                  className={textareaCls}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Primary Button Text</label>
                  <input
                    type="text"
                    value={settings.cta.primaryButtonText}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        cta: { ...settings.cta, primaryButtonText: e.target.value },
                      })
                    }
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Primary Button Link</label>
                  <input
                    type="text"
                    value={settings.cta.primaryButtonLink}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        cta: { ...settings.cta, primaryButtonLink: e.target.value },
                      })
                    }
                    className={inputCls}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 6. SEO METADATA */}
          {activeSection === 'seo' && (
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Meta Title (Browser Tab)</label>
                <input
                  type="text"
                  value={settings.seo.metaTitle}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      seo: { ...settings.seo, metaTitle: e.target.value },
                    })
                  }
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Meta Description (Search Engines)</label>
                <textarea
                  rows={3}
                  value={settings.seo.metaDescription}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      seo: { ...settings.seo, metaDescription: e.target.value },
                    })
                  }
                  className={textareaCls}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Media Picker Modal */}
      {pickerOpen && (
        <MediaPickerModal
          isOpen={pickerOpen}
          onClose={() => setPickerOpen(false)}
          onSelect={handleMediaSelect}
          resourceType={pickerTarget?.resourceType || 'all'}
          initialFolder="impact"
          title={`Select ${pickerTarget?.resourceType === 'video' ? 'Video' : 'Image'} for Impact`}
        />
      )}
    </div>
  );
};

export default ImpactCms;
