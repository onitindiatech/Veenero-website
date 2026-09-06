import React, { useEffect, useState } from 'react';
import {
  Compass,
  Save,
  RefreshCw,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  Eye,
  Layers,
  Cpu,
  Activity,
  TrendingUp,
  Users,
  Search,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import {
  getAdminApproachSettings,
  updateAdminApproachSettings,
  updateApproachSection,
  ApproachPageSettings,
} from '../../services/approach.service';
import MediaPickerModal from '../../components/cms/MediaPickerModal';

type SectionKey =
  | 'hero'
  | 'philosophy'
  | 'framework'
  | 'technology'
  | 'execution'
  | 'impact'
  | 'governance'
  | 'cta'
  | 'seo';

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error';
}

export const ApproachCms: React.FC = () => {
  const [settings, setSettings] = useState<ApproachPageSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [savingAll, setSavingAll] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionKey>('hero');
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });

  // Media Picker state
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaTargetField, setMediaTargetField] = useState<string | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await getAdminApproachSettings();
      setSettings(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to load Approach page settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSaveSection = async (sectionKey: SectionKey) => {
    if (!settings) return;
    try {
      setSavingSection(sectionKey);
      await updateApproachSection(sectionKey, settings[sectionKey]);
      showToast(`Section '${sectionKey}' saved successfully!`, 'success');
    } catch (err: any) {
      showToast(err.message || `Failed to save section '${sectionKey}'`, 'error');
    } finally {
      setSavingSection(null);
    }
  };

  const handleSaveAll = async () => {
    if (!settings) return;
    try {
      setSavingAll(true);
      const updated = await updateAdminApproachSettings(settings);
      setSettings(updated);
      showToast('All Approach page settings saved successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to save Approach page settings', 'error');
    } finally {
      setSavingAll(false);
    }
  };

  const openMediaPicker = (fieldPath: string) => {
    setMediaTargetField(fieldPath);
    setMediaPickerOpen(true);
  };

  const handleMediaSelect = (media: any) => {
    if (!mediaTargetField || !settings) return;
    const url = media.secureUrl || media.url || '';
    const publicId = media.publicId || '';

    setSettings((prev) => {
      if (!prev) return prev;
      const next = JSON.parse(JSON.stringify(prev));

      // Path format e.g. "hero.image", "execution.stages.0.image", etc.
      const parts = mediaTargetField.split('.');
      let curr = next;
      for (let i = 0; i < parts.length - 1; i++) {
        curr = curr[parts[i]];
      }
      curr[parts[parts.length - 1]] = url;

      // If there's a corresponding mediaPublicId field
      if (parts[parts.length - 1] === 'image' && 'mediaPublicId' in curr) {
        curr.mediaPublicId = publicId;
      }

      return next;
    });

    setMediaPickerOpen(false);
    setMediaTargetField(null);
    showToast('Media selected from library', 'success');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-teal-600 animate-spin" />
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400 font-sans">
            Loading Approach Page CMS...
          </span>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="p-8 text-center font-sans">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
          Failed to load Approach settings
        </h3>
        <button
          onClick={loadSettings}
          className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-semibold hover:bg-teal-500 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const sectionsList: { key: SectionKey; label: string; icon: any; desc: string }[] = [
    { key: 'hero', label: '01. Hero Section', icon: Compass, desc: 'Eyebrow, title, description, CTAs, background image & widgets' },
    { key: 'philosophy', label: '02. Our Philosophy', icon: Layers, desc: 'Visibility, intelligence, accountability, narrative & ecosystem visual' },
    { key: 'framework', label: '03. 5-Pillar Framework', icon: Activity, desc: 'Sense, Connect, Understand, Act, Verify process stages' },
    { key: 'technology', label: '04. Technology', icon: Cpu, desc: 'IoT, Cloud, AI & Open integrations with telemetry dashboard' },
    { key: 'execution', label: '05. Real-World Execution', icon: Search, desc: '4 execution stages: Understand, Design, Deploy, Monitor' },
    { key: 'impact', label: '06. Measurable Outcomes', icon: TrendingUp, desc: 'Key outcome metrics (NRW reduction, cost savings, reliability)' },
    { key: 'governance', label: '07. Governance & Trust', icon: ShieldCheck, desc: 'Enterprise data security, compliance standards, cards & media' },
    { key: 'cta', label: '08. Call to Action', icon: ExternalLink, desc: 'Ready to Transform water future banner & buttons' },
    { key: 'seo', label: '09. SEO & Metadata', icon: Eye, desc: 'Page title and meta description tags' },
  ];

  return (
    <div className="space-y-6 font-sans select-none pb-16">
      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl border text-sm font-semibold transition-all duration-300 ${
            toast.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200 backdrop-blur-md'
              : 'bg-rose-950/90 border-rose-500/40 text-rose-200 backdrop-blur-md'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 text-xs font-bold font-mono uppercase tracking-wider mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Approach Page CMS</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-display">
            Our Approach Page Editor
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Edit and customize all content, framework pillars, telemetry, execution stages, impact metrics, and Cloudinary media for the public Our Approach page.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/approach"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Live Page</span>
          </a>
          <button
            onClick={handleSaveAll}
            disabled={savingAll}
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold shadow-soft hover:shadow-glow transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {savingAll ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{savingAll ? 'Saving All...' : 'Save All Changes'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Nav + Right Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-4 bg-card border border-border rounded-2xl p-3 shadow-xs space-y-1">
          <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
            Page Sections
          </div>
          {sectionsList.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.key;
            return (
              <button
                key={sec.key}
                onClick={() => setActiveSection(sec.key)}
                className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 cursor-pointer ${
                  isActive
                    ? 'bg-teal-50 dark:bg-teal-950/50 border border-teal-500/30 text-teal-900 dark:text-teal-200 shadow-xs'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-900/50 text-slate-600 dark:text-slate-300 border border-transparent'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    isActive
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold leading-tight">{sec.label}</div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                    {sec.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Form Panel */}
        <div className="lg:col-span-8 bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          {/* Section Heading & Save Button */}
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                {sectionsList.find((s) => s.key === activeSection)?.label}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {sectionsList.find((s) => s.key === activeSection)?.desc}
              </p>
            </div>
            <button
              onClick={() => handleSaveSection(activeSection)}
              disabled={savingSection === activeSection}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold shadow-soft hover:shadow-glow transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {savingSection === activeSection ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>{savingSection === activeSection ? 'Saving...' : 'Save Section'}</span>
            </button>
          </div>

          {/* 1. HERO SECTION */}
          {activeSection === 'hero' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Eyebrow / Small Tag
                  </label>
                  <input
                    type="text"
                    value={settings.hero.eyebrow}
                    onChange={(e) =>
                      setSettings({ ...settings, hero: { ...settings.hero, eyebrow: e.target.value } })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-xs font-medium text-slate-900 dark:text-white focus:outline-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    H1 Headline Main Line
                  </label>
                  <input
                    type="text"
                    value={settings.hero.title}
                    onChange={(e) =>
                      setSettings({ ...settings, hero: { ...settings.hero, title: e.target.value } })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-xs font-medium text-slate-900 dark:text-white focus:outline-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  H1 Accent / Highlighted Text (Teal)
                </label>
                <input
                  type="text"
                  value={settings.hero.highlightedText}
                  onChange={(e) =>
                    setSettings({ ...settings, hero: { ...settings.hero, highlightedText: e.target.value } })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-xs font-medium text-slate-900 dark:text-white focus:outline-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Hero Description
                </label>
                <textarea
                  rows={3}
                  value={settings.hero.description}
                  onChange={(e) =>
                    setSettings({ ...settings, hero: { ...settings.hero, description: e.target.value } })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-xs font-medium text-slate-900 dark:text-white focus:outline-teal-500"
                />
              </div>

              {/* Background Image with Media Library picker */}
              <div className="pt-2 border-t border-border">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Hero Background Infrastructure Image
                </label>
                <div className="flex items-center gap-4">
                  {settings.hero.image ? (
                    <div className="w-24 h-16 rounded-lg overflow-hidden border border-border bg-slate-100 shrink-0">
                      <img src={settings.hero.image} alt="Hero background" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-24 h-16 rounded-lg border border-dashed border-border flex items-center justify-center text-slate-400 shrink-0">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}
                  <div className="flex-1 space-y-1">
                    <input
                      type="text"
                      placeholder="Image URL or choose from Media Library"
                      value={settings.hero.image}
                      onChange={(e) =>
                        setSettings({ ...settings, hero: { ...settings.hero, image: e.target.value } })
                      }
                      className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-xs font-mono text-slate-700 dark:text-slate-300"
                    />
                    <button
                      type="button"
                      onClick={() => openMediaPicker('hero.image')}
                      className="px-3 py-1.5 bg-teal-50 dark:bg-teal-950/60 border border-teal-500/30 text-teal-700 dark:text-teal-300 rounded-lg text-xs font-bold hover:bg-teal-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Choose from Media Library</span>
                    </button>
                  </div>
                </div>
              </div>


            </div>
          )}

          {/* 2. PHILOSOPHY SECTION */}
          {activeSection === 'philosophy' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Section Eyebrow
                  </label>
                  <input
                    type="text"
                    value={settings.philosophy.eyebrow}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        philosophy: { ...settings.philosophy, eyebrow: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    H2 Heading Main
                  </label>
                  <input
                    type="text"
                    value={settings.philosophy.title}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        philosophy: { ...settings.philosophy, title: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  H2 Accent Text (Teal)
                </label>
                <input
                  type="text"
                  value={settings.philosophy.highlightedText}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      philosophy: { ...settings.philosophy, highlightedText: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-xs font-medium text-slate-900 dark:text-white"
                />
              </div>

              {/* Supporting Paragraphs */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Supporting Paragraphs (3)
                </label>
                {settings.philosophy.paragraphs.map((p, i) => (
                  <textarea
                    key={i}
                    rows={2}
                    value={p}
                    onChange={(e) => {
                      const nextP = [...settings.philosophy.paragraphs];
                      nextP[i] = e.target.value;
                      setSettings({
                        ...settings,
                        philosophy: { ...settings.philosophy, paragraphs: nextP },
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-xs font-medium text-slate-900 dark:text-white mb-2"
                  />
                ))}
              </div>

              {/* Ecosystem Image */}
              <div className="pt-2 border-t border-border">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Ecosystem Illustration Image
                </label>
                <div className="flex items-center gap-4">
                  {settings.philosophy.image ? (
                    <div className="w-24 h-16 rounded-lg overflow-hidden border border-border bg-slate-100 shrink-0">
                      <img src={settings.philosophy.image} alt="Philosophy" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-24 h-16 rounded-lg border border-dashed border-border flex items-center justify-center text-slate-400 shrink-0">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}
                  <div className="flex-1 space-y-1">
                    <input
                      type="text"
                      placeholder="Image URL"
                      value={settings.philosophy.image}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          philosophy: { ...settings.philosophy, image: e.target.value },
                        })
                      }
                      className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-xs font-mono text-slate-700 dark:text-slate-300"
                    />
                    <button
                      type="button"
                      onClick={() => openMediaPicker('philosophy.image')}
                      className="px-3 py-1.5 bg-teal-50 dark:bg-teal-950/60 border border-teal-500/30 text-teal-700 dark:text-teal-300 rounded-lg text-xs font-bold hover:bg-teal-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Choose from Media Library</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. 5-PILLAR FRAMEWORK */}
          {activeSection === 'framework' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Eyebrow
                  </label>
                  <input
                    type="text"
                    value={settings.framework.eyebrow}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        framework: { ...settings.framework, eyebrow: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Title Main
                  </label>
                  <input
                    type="text"
                    value={settings.framework.title}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        framework: { ...settings.framework, title: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Highlighted Text (Teal)
                </label>
                <input
                  type="text"
                  value={settings.framework.highlightedText}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      framework: { ...settings.framework, highlightedText: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Section Description
                </label>
                <textarea
                  rows={2}
                  value={settings.framework.description}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      framework: { ...settings.framework, description: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-xs"
                />
              </div>

              {/* 5 Pillars */}
              <div className="pt-2 border-t border-border space-y-3">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  5 Process Pillars (Sense, Connect, Understand, Act, Verify)
                </label>
                {settings.framework.pillars.map((pillar, i) => (
                  <div key={i} className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-border flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-1">
                      {pillar.number}
                    </div>
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Pillar Title (e.g. Sense)"
                        value={pillar.title}
                        onChange={(e) => {
                          const nextPillars = [...settings.framework.pillars];
                          nextPillars[i].title = e.target.value;
                          setSettings({
                            ...settings,
                            framework: { ...settings.framework, pillars: nextPillars },
                          });
                        }}
                        className="px-2.5 py-1.5 bg-white dark:bg-slate-950 border border-border rounded-md text-xs font-bold"
                      />
                      <input
                        type="text"
                        placeholder="Icon Name (Radio, Wifi, Cloud, Users, ShieldCheck)"
                        value={pillar.icon}
                        onChange={(e) => {
                          const nextPillars = [...settings.framework.pillars];
                          nextPillars[i].icon = e.target.value;
                          setSettings({
                            ...settings,
                            framework: { ...settings.framework, pillars: nextPillars },
                          });
                        }}
                        className="px-2.5 py-1.5 bg-white dark:bg-slate-950 border border-border rounded-md text-xs font-mono"
                      />
                      <div className="sm:col-span-2">
                        <textarea
                          rows={2}
                          placeholder="Pillar Description"
                          value={pillar.description}
                          onChange={(e) => {
                            const nextPillars = [...settings.framework.pillars];
                            nextPillars[i].description = e.target.value;
                            setSettings({
                              ...settings,
                              framework: { ...settings.framework, pillars: nextPillars },
                            });
                          }}
                          className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-950 border border-border rounded-md text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. TECHNOLOGY SECTION */}
          {activeSection === 'technology' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Eyebrow
                  </label>
                  <input
                    type="text"
                    value={settings.technology.eyebrow}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        technology: { ...settings.technology, eyebrow: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Title Main
                  </label>
                  <input
                    type="text"
                    value={settings.technology.title}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        technology: { ...settings.technology, title: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Highlighted Text (Teal)
                </label>
                <input
                  type="text"
                  value={settings.technology.highlightedText}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      technology: { ...settings.technology, highlightedText: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={settings.technology.description}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      technology: { ...settings.technology, description: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-xs"
                />
              </div>

              {/* Dashboard Image */}
              <div className="pt-2 border-t border-border">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Dashboard / Sensor Architecture Image
                </label>
                <div className="flex items-center gap-4">
                  {settings.technology.image ? (
                    <div className="w-24 h-16 rounded-lg overflow-hidden border border-border bg-slate-100 shrink-0">
                      <img src={settings.technology.image} alt="Tech" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-24 h-16 rounded-lg border border-dashed border-border flex items-center justify-center text-slate-400 shrink-0">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}
                  <div className="flex-1 space-y-1">
                    <input
                      type="text"
                      placeholder="Image URL"
                      value={settings.technology.image}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          technology: { ...settings.technology, image: e.target.value },
                        })
                      }
                      className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => openMediaPicker('technology.image')}
                      className="px-3 py-1.5 bg-teal-50 dark:bg-teal-950/60 border border-teal-500/30 text-teal-700 dark:text-teal-300 rounded-lg text-xs font-bold hover:bg-teal-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Choose from Media Library</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 4 Capabilities */}
              <div className="pt-2 border-t border-border">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  4 Technology Pillars (IoT Sensors, Cloud, AI, Open Integrations)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {settings.technology.capabilities.map((cap, i) => (
                    <div key={i} className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-border space-y-2">
                      <input
                        type="text"
                        placeholder="Title"
                        value={cap.title}
                        onChange={(e) => {
                          const nextCaps = [...settings.technology.capabilities];
                          nextCaps[i].title = e.target.value;
                          setSettings({
                            ...settings,
                            technology: { ...settings.technology, capabilities: nextCaps },
                          });
                        }}
                        className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-950 border border-border rounded-md text-xs font-bold"
                      />
                      <textarea
                        rows={2}
                        placeholder="Description"
                        value={cap.description}
                        onChange={(e) => {
                          const nextCaps = [...settings.technology.capabilities];
                          nextCaps[i].description = e.target.value;
                          setSettings({
                            ...settings,
                            technology: { ...settings.technology, capabilities: nextCaps },
                          });
                        }}
                        className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-950 border border-border rounded-md text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 5. REAL-WORLD EXECUTION */}
          {activeSection === 'execution' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Eyebrow
                  </label>
                  <input
                    type="text"
                    value={settings.execution.eyebrow}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        execution: { ...settings.execution, eyebrow: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Title Main
                  </label>
                  <input
                    type="text"
                    value={settings.execution.title}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        execution: { ...settings.execution, title: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Highlighted Text (Teal)
                </label>
                <input
                  type="text"
                  value={settings.execution.highlightedText}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      execution: { ...settings.execution, highlightedText: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={settings.execution.description}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      execution: { ...settings.execution, description: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-xs"
                />
              </div>

              {/* 4 Execution Stages with individual images */}
              <div className="pt-2 border-t border-border space-y-4">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  4 Execution Stages (Understand, Design, Deploy, Monitor)
                </label>
                {settings.execution.stages.map((stage, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-border space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-mono text-teal-600 dark:text-teal-400">
                        Stage #{idx + 1} ({stage.number})
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">Stage Title</label>
                        <input
                          type="text"
                          value={stage.title}
                          onChange={(e) => {
                            const nextStages = [...settings.execution.stages];
                            nextStages[idx].title = e.target.value;
                            setSettings({
                              ...settings,
                              execution: { ...settings.execution, stages: nextStages },
                            });
                          }}
                          className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-950 border border-border rounded-md text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">Icon Name</label>
                        <input
                          type="text"
                          value={stage.icon}
                          onChange={(e) => {
                            const nextStages = [...settings.execution.stages];
                            nextStages[idx].icon = e.target.value;
                            setSettings({
                              ...settings,
                              execution: { ...settings.execution, stages: nextStages },
                            });
                          }}
                          className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-950 border border-border rounded-md text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={stage.description}
                        onChange={(e) => {
                          const nextStages = [...settings.execution.stages];
                          nextStages[idx].description = e.target.value;
                          setSettings({
                            ...settings,
                            execution: { ...settings.execution, stages: nextStages },
                          });
                        }}
                        className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-950 border border-border rounded-md text-xs"
                      />
                    </div>

                    {/* Stage Image with Media Picker */}
                    <div className="flex items-center gap-3 pt-1">
                      {stage.image ? (
                        <div className="w-16 h-12 rounded-lg overflow-hidden border border-border bg-slate-100 shrink-0">
                          <img src={stage.image} alt={stage.title} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-16 h-12 rounded-lg border border-dashed border-border flex items-center justify-center text-slate-400 shrink-0">
                          <ImageIcon className="w-4 h-4" />
                        </div>
                      )}
                      <div className="flex-1 flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Stage Image URL"
                          value={stage.image}
                          onChange={(e) => {
                            const nextStages = [...settings.execution.stages];
                            nextStages[idx].image = e.target.value;
                            setSettings({
                              ...settings,
                              execution: { ...settings.execution, stages: nextStages },
                            });
                          }}
                          className="flex-1 px-2.5 py-1 bg-white dark:bg-slate-950 border border-border rounded-md text-xs font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => openMediaPicker(`execution.stages.${idx}.image`)}
                          className="px-2.5 py-1 bg-teal-50 dark:bg-teal-950/60 border border-teal-500/30 text-teal-700 dark:text-teal-300 rounded-md text-[11px] font-bold hover:bg-teal-100 transition-colors shrink-0 cursor-pointer"
                        >
                          Media Library
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. IMPACT / OUTCOMES */}
          {activeSection === 'impact' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Eyebrow
                  </label>
                  <input
                    type="text"
                    value={settings.impact.eyebrow}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        impact: { ...settings.impact, eyebrow: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Title Main
                  </label>
                  <input
                    type="text"
                    value={settings.impact.title}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        impact: { ...settings.impact, title: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Highlighted Text (Teal)
                </label>
                <input
                  type="text"
                  value={settings.impact.highlightedText}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      impact: { ...settings.impact, highlightedText: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={settings.impact.description}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      impact: { ...settings.impact, description: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={settings.impact.ctaText}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        impact: { ...settings.impact, ctaText: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    CTA Button Link
                  </label>
                  <input
                    type="text"
                    value={settings.impact.ctaLink}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        impact: { ...settings.impact, ctaLink: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* 4 Metric Cards */}
              <div className="pt-2 border-t border-border space-y-3">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  4 Metric Cards (Ranges & Labels)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {settings.impact.metrics.map((m, i) => (
                    <div key={i} className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-border space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Range start (20)"
                          value={m.range[0]}
                          onChange={(e) => {
                            const nextM = [...settings.impact.metrics];
                            nextM[i].range = [e.target.value, nextM[i].range[1]];
                            setSettings({ ...settings, impact: { ...settings.impact, metrics: nextM } });
                          }}
                          className="w-20 px-2 py-1 bg-white dark:bg-slate-950 border border-border rounded text-xs font-mono text-center font-bold"
                        />
                        <span className="text-xs text-slate-400">–</span>
                        <input
                          type="text"
                          placeholder="Range end (40)"
                          value={m.range[1]}
                          onChange={(e) => {
                            const nextM = [...settings.impact.metrics];
                            nextM[i].range = [nextM[i].range[0], e.target.value];
                            setSettings({ ...settings, impact: { ...settings.impact, metrics: nextM } });
                          }}
                          className="w-20 px-2 py-1 bg-white dark:bg-slate-950 border border-border rounded text-xs font-mono text-center font-bold"
                        />
                        <input
                          type="text"
                          placeholder="Suffix (%)"
                          value={m.suffix}
                          onChange={(e) => {
                            const nextM = [...settings.impact.metrics];
                            nextM[i].suffix = e.target.value;
                            setSettings({ ...settings, impact: { ...settings.impact, metrics: nextM } });
                          }}
                          className="w-14 px-2 py-1 bg-white dark:bg-slate-950 border border-border rounded text-xs font-mono text-center"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Label Line 1 (e.g. Reduction in)"
                        value={m.label}
                        onChange={(e) => {
                          const nextM = [...settings.impact.metrics];
                          nextM[i].label = e.target.value;
                          setSettings({ ...settings, impact: { ...settings.impact, metrics: nextM } });
                        }}
                        className="w-full px-2.5 py-1 bg-white dark:bg-slate-950 border border-border rounded text-xs font-semibold"
                      />
                      <input
                        type="text"
                        placeholder="Sublabel Line 2 (e.g. Non-Revenue Water)"
                        value={m.sublabel}
                        onChange={(e) => {
                          const nextM = [...settings.impact.metrics];
                          nextM[i].sublabel = e.target.value;
                          setSettings({ ...settings, impact: { ...settings.impact, metrics: nextM } });
                        }}
                        className="w-full px-2.5 py-1 bg-white dark:bg-slate-950 border border-border rounded text-xs text-slate-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 7. GOVERNANCE & TRUST (REPLACEMENT SECTION) */}
          {activeSection === 'governance' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Eyebrow / Small Tag
                  </label>
                  <input
                    type="text"
                    value={settings.governance?.eyebrow || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        governance: { ...settings.governance, eyebrow: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    H2 Heading Main Line
                  </label>
                  <input
                    type="text"
                    value={settings.governance?.title || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        governance: { ...settings.governance, title: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  H2 Accent / Highlighted Text (Teal)
                </label>
                <input
                  type="text"
                  value={settings.governance?.highlightedText || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      governance: { ...settings.governance, highlightedText: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Section Overview / Description
                </label>
                <textarea
                  rows={2}
                  value={settings.governance?.description || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      governance: { ...settings.governance, description: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Supporting Content (Operational Context)
                </label>
                <textarea
                  rows={2}
                  value={settings.governance?.supportingContent || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      governance: { ...settings.governance, supportingContent: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={settings.governance?.ctaText || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        governance: { ...settings.governance, ctaText: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    CTA Button Link
                  </label>
                  <input
                    type="text"
                    value={settings.governance?.ctaLink || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        governance: { ...settings.governance, ctaLink: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* Governance Architecture Image */}
              <div className="pt-2 border-t border-border">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Architecture & Trust Image
                </label>
                <div className="flex items-center gap-4">
                  {settings.governance?.image ? (
                    <div className="w-24 h-16 rounded-lg overflow-hidden border border-border bg-slate-100 shrink-0">
                      <img src={settings.governance.image} alt="Governance" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-24 h-16 rounded-lg border border-dashed border-border flex items-center justify-center text-slate-400 shrink-0">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}
                  <div className="flex-1 space-y-1">
                    <input
                      type="text"
                      placeholder="Image URL"
                      value={settings.governance?.image || ''}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          governance: { ...settings.governance, image: e.target.value },
                        })
                      }
                      className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => openMediaPicker('governance.image')}
                      className="px-3 py-1.5 bg-teal-50 dark:bg-teal-950/60 border border-teal-500/30 text-teal-700 dark:text-teal-300 rounded-lg text-xs font-bold hover:bg-teal-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Choose from Media Library</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Governance Cards */}
              <div className="pt-2 border-t border-border space-y-3">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Governance & Verification Feature Cards
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(settings.governance?.cards || []).map((card, i) => (
                    <div key={i} className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-border space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Title"
                          value={card.title}
                          onChange={(e) => {
                            const nextCards = [...(settings.governance?.cards || [])];
                            nextCards[i].title = e.target.value;
                            setSettings({
                              ...settings,
                              governance: { ...settings.governance, cards: nextCards },
                            });
                          }}
                          className="px-2.5 py-1.5 bg-white dark:bg-slate-950 border border-border rounded-md text-xs font-bold"
                        />
                        <input
                          type="text"
                          placeholder="Tag (e.g. AES-256)"
                          value={card.tag || ''}
                          onChange={(e) => {
                            const nextCards = [...(settings.governance?.cards || [])];
                            nextCards[i].tag = e.target.value;
                            setSettings({
                              ...settings,
                              governance: { ...settings.governance, cards: nextCards },
                            });
                          }}
                          className="px-2.5 py-1.5 bg-white dark:bg-slate-950 border border-border rounded-md text-xs font-mono"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Icon Name (ShieldCheck, FileCheck2, Cpu, Lock)"
                        value={card.icon}
                        onChange={(e) => {
                          const nextCards = [...(settings.governance?.cards || [])];
                          nextCards[i].icon = e.target.value;
                          setSettings({
                            ...settings,
                            governance: { ...settings.governance, cards: nextCards },
                          });
                        }}
                        className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-950 border border-border rounded-md text-xs font-mono"
                      />
                      <textarea
                        rows={2}
                        placeholder="Description"
                        value={card.description}
                        onChange={(e) => {
                          const nextCards = [...(settings.governance?.cards || [])];
                          nextCards[i].description = e.target.value;
                          setSettings({
                            ...settings,
                            governance: { ...settings.governance, cards: nextCards },
                          });
                        }}
                        className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-950 border border-border rounded-md text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 8. CTA SECTION */}
          {activeSection === 'cta' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Eyebrow
                  </label>
                  <input
                    type="text"
                    value={settings.cta.eyebrow}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        cta: { ...settings.cta, eyebrow: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Title Main
                  </label>
                  <input
                    type="text"
                    value={settings.cta.title}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        cta: { ...settings.cta, title: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Highlighted Text (Teal)
                </label>
                <input
                  type="text"
                  value={settings.cta.highlightedText}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      cta: { ...settings.cta, highlightedText: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={settings.cta.description}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      cta: { ...settings.cta, description: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Primary Button Text
                  </label>
                  <input
                    type="text"
                    value={settings.cta.primaryButtonText}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        cta: { ...settings.cta, primaryButtonText: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Primary Button Link
                  </label>
                  <input
                    type="text"
                    value={settings.cta.primaryButtonLink}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        cta: { ...settings.cta, primaryButtonLink: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Secondary Button Text
                  </label>
                  <input
                    type="text"
                    value={settings.cta.secondaryButtonText}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        cta: { ...settings.cta, secondaryButtonText: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Secondary Button Link
                  </label>
                  <input
                    type="text"
                    value={settings.cta.secondaryButtonLink}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        cta: { ...settings.cta, secondaryButtonLink: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 9. SEO */}
          {activeSection === 'seo' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Meta Page Title
                </label>
                <input
                  type="text"
                  value={settings.seo.metaTitle}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      seo: { ...settings.seo, metaTitle: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Meta Description
                </label>
                <textarea
                  rows={3}
                  value={settings.seo.metaDescription}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      seo: { ...settings.seo, metaDescription: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-xs"
                />
              </div>
            </div>
          )}

          {/* Bottom Action Footer */}
          <div className="pt-4 border-t border-border flex items-center justify-between">
            <button
              onClick={loadSettings}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Discard Changes
            </button>
            <button
              onClick={() => handleSaveSection(activeSection)}
              disabled={savingSection === activeSection}
              className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold shadow-soft hover:shadow-glow transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {savingSection === activeSection ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>{savingSection === activeSection ? 'Saving...' : `Save ${sectionsList.find((s) => s.key === activeSection)?.label.split('.')[1] || 'Section'}`}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Media Picker Modal */}
      {mediaPickerOpen && (
        <MediaPickerModal
          isOpen={mediaPickerOpen}
          onClose={() => {
            setMediaPickerOpen(false);
            setMediaTargetField(null);
          }}
          onSelect={handleMediaSelect}
          acceptedTypes={['image']}
          defaultPage="approach"
          title="Select Media for Our Approach Page"
        />
      )}
    </div>
  );
};

export default ApproachCms;
