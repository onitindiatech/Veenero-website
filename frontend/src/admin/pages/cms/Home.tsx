import React, { useState, useEffect } from 'react';
import { Save, Eye, EyeOff, Plus, Trash2, ArrowUp, ArrowDown, CheckCircle, XCircle, Globe } from 'lucide-react';
import { HomePageSettings, getAdminHomeSettings, updateAdminHomeSettings, updateAdminHomeSection } from '@/services/home.service';

// ─── Toast Component ──────────────────────────────────────────────────────────
const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => (
  <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border text-sm font-semibold max-w-xs ${
    type === 'success'
      ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-300'
      : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-300'
  }`}>
    {type === 'success' ? <CheckCircle className="h-4 w-4 shrink-0" /> : <XCircle className="h-4 w-4 shrink-0" />}
    <span className="flex-1">{message}</span>
    <button onClick={onClose} className="hover:opacity-70">✕</button>
  </div>
);

// ─── Constants for Styles ──────────────────────────────────────────────────────
const labelCls = 'block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5';
const inputCls = 'w-full px-3 py-2.5 text-xs bg-background border border-border/60 rounded-xl focus:outline-none focus:border-teal-500/60 font-medium text-foreground transition-all duration-200';

const SECTIONS = [
  { id: 'hero', label: 'Hero Section', desc: 'Main cover presentation' },
  { id: 'about', label: 'About Us', desc: 'Core purpose & metrics' },
  { id: 'solutions', label: 'Solutions', desc: 'Veenero product suite' },
  { id: 'approach', label: 'Our Approach', desc: 'Methodology process' },
  { id: 'impact', label: 'Impact & Outcomes', desc: 'Benefits & testimonials' },
  { id: 'partners', label: 'Our Partners', desc: 'Ecosystem connections' },
  { id: 'careers', label: 'Careers Banner', desc: 'Recruiting highlights' },
  { id: 'contact', label: 'Contact', desc: 'Inquiries & demo booking' },
  { id: 'seo', label: 'SEO Metadata', desc: 'Search engine optimization' },
];

export const HomeCms: React.FC = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [settings, setSettings] = useState<HomePageSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getAdminHomeSettings();
        setSettings(data);
      } catch (err) {
        showToast((err as Error).message || 'Failed to retrieve settings.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const [isDirty, setIsDirty] = useState(false);

  const handleSaveSection = async (sectionKey: keyof HomePageSettings) => {
    if (!settings) return;
    setSaving(true);
    try {
      const sectionData = settings[sectionKey];
      const updatedSection = await updateAdminHomeSection(sectionKey, sectionData);
      setSettings(prev => prev ? { ...prev, [sectionKey]: updatedSection } : prev);
      showToast(`${SECTIONS.find(s => s.id === sectionKey)?.label || sectionKey} saved successfully to MongoDB.`);
      setIsDirty(false);
    } catch (err) {
      showToast((err as Error).message || 'Failed to save configurations.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const currentSectionLabel = SECTIONS.find(s => s.id === activeSection)?.label || 'Section';

  const updateSettingsWithDirty = (newSettings: HomePageSettings) => {
    setSettings(newSettings);
    setIsDirty(true);
  };

  const toggleVisibility = (sectionKey: keyof HomePageSettings) => {
    if (!settings || typeof settings[sectionKey] !== 'object') return;
    const target = settings[sectionKey] as any;
    if (target && 'visible' in target) {
      setSettings({
        ...settings,
        [sectionKey]: {
          ...target,
          visible: !target.visible,
        },
      });
    }
  };

  if (loading) {
    return (
      <div className="p-6 md:p-8 space-y-6 animate-pulse">
        <div className="h-8 w-64 bg-muted/40 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1 h-80 bg-muted/30 rounded-2xl" />
          <div className="md:col-span-3 h-96 bg-muted/20 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="p-6 md:p-8 text-center">
        <h2 className="text-xl font-bold text-foreground">Could not load Homepage Settings.</h2>
        <p className="text-sm text-muted-foreground mt-2">Please verify that database has been properly seeded.</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-6 font-sans relative z-10 animate-fade-in max-w-6xl">
      {/* Toast Alert */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap border-b border-border/20 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground font-sans tracking-tight">Home Page CMS</h1>
            {isDirty && (
              <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 rounded-full border border-amber-300 dark:border-amber-800">
                Unsaved Changes
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Manage sections, visual properties, cards, and call-to-actions on the public landing page.
          </p>
        </div>
        <button
          onClick={() => handleSaveSection(activeSection as keyof HomePageSettings)}
          disabled={saving}
          className="px-5 py-2.5 text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white rounded-xl shadow-soft flex items-center gap-2 transition-colors disabled:opacity-60 shrink-0"
        >
          <Save className="h-3.5 w-3.5" />
          {saving ? 'Saving...' : `Save ${currentSectionLabel}`}
        </button>
      </div>

      {/* Main Panel Content Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        
        {/* Left pane: Sections list */}
        <aside className="md:col-span-1 flex flex-col gap-1 bg-card/40 border border-border/40 p-2.5 rounded-2xl backdrop-blur-md">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-3 py-1.5 block">
            Homepage Sections
          </span>
          {SECTIONS.map((sec) => (
            <button
              key={sec.id}
              id={`nav-section-${sec.id}`}
              data-testid={`nav-${sec.id}`}
              onClick={() => setActiveSection(sec.id)}
              className={`flex flex-col text-left px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                activeSection === sec.id
                  ? 'bg-teal-600 text-white shadow-soft font-semibold'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              }`}
            >
              <span className="text-xs leading-none pointer-events-none">{sec.label}</span>
              <span className={`text-[9px] mt-1 pointer-events-none ${activeSection === sec.id ? 'text-teal-100' : 'text-muted-foreground/80'}`}>
                {sec.desc}
              </span>
            </button>
          ))}
        </aside>

        {/* Right pane: Active form */}
        <main className="md:col-span-3">
          
          {/* HERO SECTION */}
          {activeSection === 'hero' && (
            <div className="bg-card border border-border/40 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-border/40 bg-muted/10 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h2 className="font-bold text-foreground text-sm">Hero Section Settings</h2>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Edit main cover title, description, image, and CTAs.</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleVisibility('hero')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all duration-200 ${
                    settings.hero.visible
                      ? 'bg-teal-50 border border-teal-200 text-teal-700 dark:bg-teal-950/20 dark:border-teal-900 dark:text-teal-400'
                      : 'bg-muted border border-border text-muted-foreground'
                  }`}
                >
                  {settings.hero.visible ? <><Eye className="h-3.5 w-3.5" /> Visible</> : <><EyeOff className="h-3.5 w-3.5" /> Hidden</>}
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className={labelCls}>Eyebrow</label>
                    <input
                      value={settings.hero.eyebrow}
                      onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, eyebrow: e.target.value } })}
                      className={inputCls}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelCls}>H1 Title</label>
                    <input
                      value={settings.hero.title}
                      onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, title: e.target.value } })}
                      className={inputCls}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelCls}>Description</label>
                    <textarea
                      value={settings.hero.description}
                      onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, description: e.target.value } })}
                      className={`${inputCls} resize-none`}
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Primary CTA Text</label>
                    <input
                      value={settings.hero.primaryCtaText}
                      onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, primaryCtaText: e.target.value } })}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Primary CTA Link</label>
                    <input
                      value={settings.hero.primaryCtaLink}
                      onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, primaryCtaLink: e.target.value } })}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Secondary CTA Text</label>
                    <input
                      value={settings.hero.secondaryCtaText}
                      onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, secondaryCtaText: e.target.value } })}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Secondary CTA Link</label>
                    <input
                      value={settings.hero.secondaryCtaLink}
                      onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, secondaryCtaLink: e.target.value } })}
                      className={inputCls}
                    />
                  </div>
                  <div className="md:col-span-2 border-t border-border/30 pt-4">
                    <label className={labelCls}>Hero Image URL</label>
                    <input
                      value={settings.hero.image}
                      onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, image: e.target.value } })}
                      className={inputCls}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelCls}>Hero Image Alt</label>
                    <input
                      value={settings.hero.imageAlt}
                      onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, imageAlt: e.target.value } })}
                      className={inputCls}
                    />
                  </div>
                  <div className="md:col-span-2 border-t border-border/30 pt-4">
                    <label className={labelCls}>Bottom Tagline</label>
                    <input
                      value={settings.hero.bottomText}
                      onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, bottomText: e.target.value } })}
                      className={inputCls}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ABOUT SECTION */}
          {activeSection === 'about' && (
            <div className="bg-card border border-border/40 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-border/40 bg-muted/10 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h2 className="font-bold text-foreground text-sm">About Us Section</h2>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Edit company vision, core value pillars, and statistics.</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleVisibility('about')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all duration-200 ${
                    settings.about.visible ? 'bg-teal-50 text-teal-700' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {settings.about.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  {settings.about.visible ? 'Visible' : 'Hidden'}
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className={labelCls}>Eyebrow</label>
                  <input
                    value={settings.about.eyebrow}
                    onChange={(e) => setSettings({ ...settings, about: { ...settings.about, eyebrow: e.target.value } })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Section Heading</label>
                  <input
                    value={settings.about.title}
                    onChange={(e) => setSettings({ ...settings, about: { ...settings.about, title: e.target.value } })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Main Description</label>
                  <textarea
                    value={settings.about.description}
                    onChange={(e) => setSettings({ ...settings, about: { ...settings.about, description: e.target.value } })}
                    className={`${inputCls} resize-none`}
                    rows={3}
                  />
                </div>

                {/* Values Pillar Editor */}
                <div className="border-t border-border/30 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Core Value Pillars</h3>
                    <button
                      type="button"
                      onClick={() => {
                        const newValues = [...settings.about.values, { iconName: 'Target', title: 'New Pillar', description: 'Description' }];
                        setSettings({ ...settings, about: { ...settings.about, values: newValues } });
                      }}
                      className="px-3 py-1.5 text-[11px] font-bold bg-teal-50 text-teal-700 rounded-lg flex items-center gap-1 hover:bg-teal-100"
                    >
                      <Plus className="h-3 w-3" /> Add Value Pillar
                    </button>
                  </div>

                  <div className="space-y-3">
                    {settings.about.values.map((val, idx) => (
                      <div key={idx} className="p-3 bg-muted/20 border border-border/40 rounded-xl space-y-2 relative">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold text-muted-foreground">Pillar #{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const newValues = settings.about.values.filter((_, i) => i !== idx);
                              setSettings({ ...settings, about: { ...settings.about, values: newValues } });
                            }}
                            className="text-rose-600 hover:text-rose-800"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <input
                            placeholder="Icon Name (Target, Heart, Users)"
                            value={val.iconName}
                            onChange={(e) => {
                              const updated = [...settings.about.values];
                              updated[idx].iconName = e.target.value;
                              setSettings({ ...settings, about: { ...settings.about, values: updated } });
                            }}
                            className={inputCls}
                          />
                          <input
                            placeholder="Title"
                            value={val.title}
                            onChange={(e) => {
                              const updated = [...settings.about.values];
                              updated[idx].title = e.target.value;
                              setSettings({ ...settings, about: { ...settings.about, values: updated } });
                            }}
                            className={inputCls}
                          />
                        </div>
                        <input
                          placeholder="Description"
                          value={val.description}
                          onChange={(e) => {
                            const updated = [...settings.about.values];
                            updated[idx].description = e.target.value;
                            setSettings({ ...settings, about: { ...settings.about, values: updated } });
                          }}
                          className={inputCls}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* About Stats Editor */}
                <div className="border-t border-border/30 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Section Metrics & Stats</h3>
                    <button
                      type="button"
                      onClick={() => {
                        const newStats = [...settings.about.stats, { value: '100%', label: 'Metric Label' }];
                        setSettings({ ...settings, about: { ...settings.about, stats: newStats } });
                      }}
                      className="px-3 py-1.5 text-[11px] font-bold bg-teal-50 text-teal-700 rounded-lg flex items-center gap-1 hover:bg-teal-100"
                    >
                      <Plus className="h-3 w-3" /> Add Metric
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {settings.about.stats.map((st, idx) => (
                      <div key={idx} className="p-3 bg-muted/20 border border-border/40 rounded-xl space-y-2 relative">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-muted-foreground">Stat #{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const newStats = settings.about.stats.filter((_, i) => i !== idx);
                              setSettings({ ...settings, about: { ...settings.about, stats: newStats } });
                            }}
                            className="text-rose-600 hover:text-rose-800"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <input
                          placeholder="Value (e.g. 24/7)"
                          value={st.value}
                          onChange={(e) => {
                            const updated = [...settings.about.stats];
                            updated[idx].value = e.target.value;
                            setSettings({ ...settings, about: { ...settings.about, stats: updated } });
                          }}
                          className={inputCls}
                        />
                        <input
                          placeholder="Label (e.g. Monitoring Coverage)"
                          value={st.label}
                          onChange={(e) => {
                            const updated = [...settings.about.stats];
                            updated[idx].label = e.target.value;
                            setSettings({ ...settings, about: { ...settings.about, stats: updated } });
                          }}
                          className={inputCls}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SOLUTIONS SECTION */}
          {activeSection === 'solutions' && (
            <div className="bg-card border border-border/40 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-border/40 bg-muted/10 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h2 className="font-bold text-foreground text-sm">Solutions Product Suite</h2>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Manage products, features list, and call to action.</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleVisibility('solutions')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all duration-200 ${
                    settings.solutions.visible ? 'bg-teal-50 text-teal-700' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {settings.solutions.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  {settings.solutions.visible ? 'Visible' : 'Hidden'}
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className={labelCls}>Eyebrow</label>
                  <input
                    value={settings.solutions.eyebrow}
                    onChange={(e) => setSettings({ ...settings, solutions: { ...settings.solutions, eyebrow: e.target.value } })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Heading</label>
                  <input
                    value={settings.solutions.title}
                    onChange={(e) => setSettings({ ...settings, solutions: { ...settings.solutions, title: e.target.value } })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Description</label>
                  <textarea
                    value={settings.solutions.description}
                    onChange={(e) => setSettings({ ...settings, solutions: { ...settings.solutions, description: e.target.value } })}
                    className={`${inputCls} resize-none`}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>CTA Button Text</label>
                    <input
                      value={settings.solutions.ctaText || ''}
                      onChange={(e) => setSettings({ ...settings, solutions: { ...settings.solutions, ctaText: e.target.value } })}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>CTA Button Link</label>
                    <input
                      value={settings.solutions.ctaLink || ''}
                      onChange={(e) => setSettings({ ...settings, solutions: { ...settings.solutions, ctaLink: e.target.value } })}
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* Repeatable Solution Cards */}
                <div className="border-t border-border/30 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Solutions Product List ({settings.solutions.list.length})</h3>
                    <button
                      type="button"
                      onClick={() => {
                        const newList = [
                          ...settings.solutions.list,
                          { iconName: 'Search', title: 'New Solution', description: 'Solution overview text', features: ['Feature 1', 'Feature 2'] }
                        ];
                        setSettings({ ...settings, solutions: { ...settings.solutions, list: newList } });
                      }}
                      className="px-3 py-1.5 text-[11px] font-bold bg-teal-50 text-teal-700 rounded-lg flex items-center gap-1 hover:bg-teal-100"
                    >
                      <Plus className="h-3 w-3" /> Add Product Card
                    </button>
                  </div>

                  <div className="space-y-4">
                    {settings.solutions.list.map((sol, idx) => (
                      <div key={idx} className="p-4 bg-muted/20 border border-border/40 rounded-xl space-y-3 relative">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-muted-foreground">Product #{idx + 1}</span>
                            {idx > 0 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const arr = [...settings.solutions.list];
                                  const temp = arr[idx];
                                  arr[idx] = arr[idx - 1];
                                  arr[idx - 1] = temp;
                                  setSettings({ ...settings, solutions: { ...settings.solutions, list: arr } });
                                }}
                                className="text-muted-foreground hover:text-foreground"
                              >
                                <ArrowUp className="h-3.5 w-3.5" />
                              </button>
                            )}
                            {idx < settings.solutions.list.length - 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const arr = [...settings.solutions.list];
                                  const temp = arr[idx];
                                  arr[idx] = arr[idx + 1];
                                  arr[idx + 1] = temp;
                                  setSettings({ ...settings, solutions: { ...settings.solutions, list: arr } });
                                }}
                                className="text-muted-foreground hover:text-foreground"
                              >
                                <ArrowDown className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const newList = settings.solutions.list.filter((_, i) => i !== idx);
                              setSettings({ ...settings, solutions: { ...settings.solutions, list: newList } });
                            }}
                            className="text-rose-600 hover:text-rose-800"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div>
                            <label className={labelCls}>Icon Name (Search, BarChart3, Waves, Shield, Cloud, Leaf)</label>
                            <input
                              value={sol.iconName}
                              onChange={(e) => {
                                const arr = [...settings.solutions.list];
                                arr[idx].iconName = e.target.value;
                                setSettings({ ...settings, solutions: { ...settings.solutions, list: arr } });
                              }}
                              className={inputCls}
                            />
                          </div>
                          <div>
                            <label className={labelCls}>Title</label>
                            <input
                              value={sol.title}
                              onChange={(e) => {
                                const arr = [...settings.solutions.list];
                                arr[idx].title = e.target.value;
                                setSettings({ ...settings, solutions: { ...settings.solutions, list: arr } });
                              }}
                              className={inputCls}
                            />
                          </div>
                        </div>

                        <div>
                          <label className={labelCls}>Description</label>
                          <textarea
                            value={sol.description}
                            onChange={(e) => {
                              const arr = [...settings.solutions.list];
                              arr[idx].description = e.target.value;
                              setSettings({ ...settings, solutions: { ...settings.solutions, list: arr } });
                            }}
                            className={`${inputCls} resize-none`}
                            rows={2}
                          />
                        </div>

                        <div>
                          <label className={labelCls}>Key Features (Comma Separated)</label>
                          <input
                            value={sol.features.join(', ')}
                            onChange={(e) => {
                              const arr = [...settings.solutions.list];
                              arr[idx].features = e.target.value.split(',').map((f) => f.trim()).filter(Boolean);
                              setSettings({ ...settings, solutions: { ...settings.solutions, list: arr } });
                            }}
                            className={inputCls}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* APPROACH SECTION */}
          {activeSection === 'approach' && (
            <div className="bg-card border border-border/40 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-border/40 bg-muted/10 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h2 className="font-bold text-foreground text-sm">Our Approach Steps</h2>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Manage methodology steps and process bullet points.</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleVisibility('approach')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all duration-200 ${
                    settings.approach.visible ? 'bg-teal-50 text-teal-700' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {settings.approach.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  {settings.approach.visible ? 'Visible' : 'Hidden'}
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className={labelCls}>Eyebrow</label>
                  <input
                    value={settings.approach.eyebrow}
                    onChange={(e) => setSettings({ ...settings, approach: { ...settings.approach, eyebrow: e.target.value } })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Title</label>
                  <input
                    value={settings.approach.title}
                    onChange={(e) => setSettings({ ...settings, approach: { ...settings.approach, title: e.target.value } })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Description</label>
                  <textarea
                    value={settings.approach.description}
                    onChange={(e) => setSettings({ ...settings, approach: { ...settings.approach, description: e.target.value } })}
                    className={`${inputCls} resize-none`}
                    rows={2}
                  />
                </div>

                {/* Steps CRUD */}
                <div className="border-t border-border/30 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Process Steps ({settings.approach.steps.length})</h3>
                    <button
                      type="button"
                      onClick={() => {
                        const newSteps = [
                          ...settings.approach.steps,
                          { number: `0${settings.approach.steps.length + 1}`, title: 'Step Title', description: 'Step description', points: ['Point 1', 'Point 2'] }
                        ];
                        setSettings({ ...settings, approach: { ...settings.approach, steps: newSteps } });
                      }}
                      className="px-3 py-1.5 text-[11px] font-bold bg-teal-50 text-teal-700 rounded-lg flex items-center gap-1 hover:bg-teal-100"
                    >
                      <Plus className="h-3 w-3" /> Add Process Step
                    </button>
                  </div>

                  <div className="space-y-4">
                    {settings.approach.steps.map((st, idx) => (
                      <div key={idx} className="p-4 bg-muted/20 border border-border/40 rounded-xl space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-muted-foreground">Step #{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const newSteps = settings.approach.steps.filter((_, i) => i !== idx);
                              setSettings({ ...settings, approach: { ...settings.approach, steps: newSteps } });
                            }}
                            className="text-rose-600 hover:text-rose-800"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          <div>
                            <label className={labelCls}>Step Number</label>
                            <input
                              value={st.number}
                              onChange={(e) => {
                                const arr = [...settings.approach.steps];
                                arr[idx].number = e.target.value;
                                setSettings({ ...settings, approach: { ...settings.approach, steps: arr } });
                              }}
                              className={inputCls}
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className={labelCls}>Step Title</label>
                            <input
                              value={st.title}
                              onChange={(e) => {
                                const arr = [...settings.approach.steps];
                                arr[idx].title = e.target.value;
                                setSettings({ ...settings, approach: { ...settings.approach, steps: arr } });
                              }}
                              className={inputCls}
                            />
                          </div>
                        </div>
                        <div>
                          <label className={labelCls}>Description</label>
                          <textarea
                            value={st.description}
                            onChange={(e) => {
                              const arr = [...settings.approach.steps];
                              arr[idx].description = e.target.value;
                              setSettings({ ...settings, approach: { ...settings.approach, steps: arr } });
                            }}
                            className={`${inputCls} resize-none`}
                            rows={2}
                          />
                        </div>
                        <div>
                          <label className={labelCls}>Key Highlights (Comma Separated)</label>
                          <input
                            value={st.points.join(', ')}
                            onChange={(e) => {
                              const arr = [...settings.approach.steps];
                              arr[idx].points = e.target.value.split(',').map((p) => p.trim()).filter(Boolean);
                              setSettings({ ...settings, approach: { ...settings.approach, steps: arr } });
                            }}
                            className={inputCls}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* IMPACT SECTION */}
          {activeSection === 'impact' && (
            <div className="bg-card border border-border/40 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-border/40 bg-muted/10 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h2 className="font-bold text-foreground text-sm">Impact & Outcomes</h2>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Manage outcome cards and client testimonial quote.</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleVisibility('impact')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all duration-200 ${
                    settings.impact.visible ? 'bg-teal-50 text-teal-700' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {settings.impact.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  {settings.impact.visible ? 'Visible' : 'Hidden'}
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className={labelCls}>Eyebrow</label>
                  <input
                    value={settings.impact.eyebrow}
                    onChange={(e) => setSettings({ ...settings, impact: { ...settings.impact, eyebrow: e.target.value } })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Title</label>
                  <input
                    value={settings.impact.title}
                    onChange={(e) => setSettings({ ...settings, impact: { ...settings.impact, title: e.target.value } })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Description</label>
                  <textarea
                    value={settings.impact.description}
                    onChange={(e) => setSettings({ ...settings, impact: { ...settings.impact, description: e.target.value } })}
                    className={`${inputCls} resize-none`}
                    rows={2}
                  />
                </div>

                {/* Impact Items list */}
                <div className="border-t border-border/30 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Impact Items ({settings.impact.impacts.length})</h3>
                    <button
                      type="button"
                      onClick={() => {
                        const newImpacts = [
                          ...settings.impact.impacts,
                          { iconName: 'Droplets', value: '100%', label: 'Metric Label', description: 'Short description' }
                        ];
                        setSettings({ ...settings, impact: { ...settings.impact, impacts: newImpacts } });
                      }}
                      className="px-3 py-1.5 text-[11px] font-bold bg-teal-50 text-teal-700 rounded-lg flex items-center gap-1 hover:bg-teal-100"
                    >
                      <Plus className="h-3 w-3" /> Add Impact Metric
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {settings.impact.impacts.map((imp, idx) => (
                      <div key={idx} className="p-3 bg-muted/20 border border-border/40 rounded-xl space-y-2 relative">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-muted-foreground">Impact #{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const newImp = settings.impact.impacts.filter((_, i) => i !== idx);
                              setSettings({ ...settings, impact: { ...settings.impact, impacts: newImp } });
                            }}
                            className="text-rose-600 hover:text-rose-800"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <input
                          placeholder="Icon Name (Droplets, TrendingUp, Globe, Award)"
                          value={imp.iconName}
                          onChange={(e) => {
                            const arr = [...settings.impact.impacts];
                            arr[idx].iconName = e.target.value;
                            setSettings({ ...settings, impact: { ...settings.impact, impacts: arr } });
                          }}
                          className={inputCls}
                        />
                        <input
                          placeholder="Value (e.g. 100%+)"
                          value={imp.value}
                          onChange={(e) => {
                            const arr = [...settings.impact.impacts];
                            arr[idx].value = e.target.value;
                            setSettings({ ...settings, impact: { ...settings.impact, impacts: arr } });
                          }}
                          className={inputCls}
                        />
                        <input
                          placeholder="Label (e.g. Visibility Coverage)"
                          value={imp.label}
                          onChange={(e) => {
                            const arr = [...settings.impact.impacts];
                            arr[idx].label = e.target.value;
                            setSettings({ ...settings, impact: { ...settings.impact, impacts: arr } });
                          }}
                          className={inputCls}
                        />
                        <input
                          placeholder="Description"
                          value={imp.description}
                          onChange={(e) => {
                            const arr = [...settings.impact.impacts];
                            arr[idx].description = e.target.value;
                            setSettings({ ...settings, impact: { ...settings.impact, impacts: arr } });
                          }}
                          className={inputCls}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Testimonial Quote */}
                <div className="border-t border-border/30 pt-4 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Client Testimonial Quote</h3>
                  <div>
                    <label className={labelCls}>Quote</label>
                    <textarea
                      value={settings.impact.testimonial?.quote || ''}
                      onChange={(e) => {
                        setSettings({
                          ...settings,
                          impact: {
                            ...settings.impact,
                            testimonial: { ...settings.impact.testimonial, quote: e.target.value }
                          }
                        });
                      }}
                      className={`${inputCls} resize-none`}
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div>
                      <label className={labelCls}>Author Name</label>
                      <input
                        value={settings.impact.testimonial?.author || ''}
                        onChange={(e) => {
                          setSettings({
                            ...settings,
                            impact: {
                              ...settings.impact,
                              testimonial: { ...settings.impact.testimonial, author: e.target.value }
                            }
                          });
                        }}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Role / Position</label>
                      <input
                        value={settings.impact.testimonial?.role || ''}
                        onChange={(e) => {
                          setSettings({
                            ...settings,
                            impact: {
                              ...settings.impact,
                              testimonial: { ...settings.impact.testimonial, role: e.target.value }
                            }
                          });
                        }}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Company</label>
                      <input
                        value={settings.impact.testimonial?.company || ''}
                        onChange={(e) => {
                          setSettings({
                            ...settings,
                            impact: {
                              ...settings.impact,
                              testimonial: { ...settings.impact.testimonial, company: e.target.value }
                            }
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

          {/* PARTNERS SECTION */}
          {activeSection === 'partners' && (
            <div className="bg-card border border-border/40 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-border/40 bg-muted/10 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h2 className="font-bold text-foreground text-sm">Partners Ecosystem</h2>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Manage partner institution logos and descriptions.</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleVisibility('partners')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all duration-200 ${
                    settings.partners.visible ? 'bg-teal-50 text-teal-700' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {settings.partners.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  {settings.partners.visible ? 'Visible' : 'Hidden'}
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className={labelCls}>Eyebrow</label>
                  <input
                    value={settings.partners.eyebrow}
                    onChange={(e) => setSettings({ ...settings, partners: { ...settings.partners, eyebrow: e.target.value } })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Title</label>
                  <input
                    value={settings.partners.title}
                    onChange={(e) => setSettings({ ...settings, partners: { ...settings.partners, title: e.target.value } })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Description</label>
                  <textarea
                    value={settings.partners.description}
                    onChange={(e) => setSettings({ ...settings, partners: { ...settings.partners, description: e.target.value } })}
                    className={`${inputCls} resize-none`}
                    rows={2}
                  />
                </div>

                {/* Partners List */}
                <div className="border-t border-border/30 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Partner Organizations ({settings.partners.list.length})</h3>
                    <button
                      type="button"
                      onClick={() => {
                        const newList = [
                          ...settings.partners.list,
                          { name: 'New Partner', logo: '/src/assets/partner.png', description: 'Partner description' }
                        ];
                        setSettings({ ...settings, partners: { ...settings.partners, list: newList } });
                      }}
                      className="px-3 py-1.5 text-[11px] font-bold bg-teal-50 text-teal-700 rounded-lg flex items-center gap-1 hover:bg-teal-100"
                    >
                      <Plus className="h-3 w-3" /> Add Partner Card
                    </button>
                  </div>

                  <div className="space-y-3">
                    {settings.partners.list.map((p, idx) => (
                      <div key={idx} className="p-3 bg-muted/20 border border-border/40 rounded-xl space-y-2 relative">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-muted-foreground">Partner #{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const newList = settings.partners.list.filter((_, i) => i !== idx);
                              setSettings({ ...settings, partners: { ...settings.partners, list: newList } });
                            }}
                            className="text-rose-600 hover:text-rose-800"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <input
                            placeholder="Partner Name"
                            value={p.name}
                            onChange={(e) => {
                              const arr = [...settings.partners.list];
                              arr[idx].name = e.target.value;
                              setSettings({ ...settings, partners: { ...settings.partners, list: arr } });
                            }}
                            className={inputCls}
                          />
                          <input
                            placeholder="Logo Path / URL"
                            value={p.logo}
                            onChange={(e) => {
                              const arr = [...settings.partners.list];
                              arr[idx].logo = e.target.value;
                              setSettings({ ...settings, partners: { ...settings.partners, list: arr } });
                            }}
                            className={inputCls}
                          />
                        </div>
                        <input
                          placeholder="Description"
                          value={p.description}
                          onChange={(e) => {
                            const arr = [...settings.partners.list];
                            arr[idx].description = e.target.value;
                            setSettings({ ...settings, partners: { ...settings.partners, list: arr } });
                          }}
                          className={inputCls}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CAREERS BANNER SECTION */}
          {activeSection === 'careers' && (
            <div className="bg-card border border-border/40 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-border/40 bg-muted/10 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h2 className="font-bold text-foreground text-sm">Homepage Careers Banner</h2>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Edit surrounding text and application CTA for open positions.</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleVisibility('careers')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all duration-200 ${
                    settings.careers.visible ? 'bg-teal-50 text-teal-700' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {settings.careers.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  {settings.careers.visible ? 'Visible' : 'Hidden'}
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <label className={labelCls}>Eyebrow</label>
                  <input
                    value={settings.careers.eyebrow}
                    onChange={(e) => setSettings({ ...settings, careers: { ...settings.careers, eyebrow: e.target.value } })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Heading</label>
                  <input
                    value={settings.careers.title}
                    onChange={(e) => setSettings({ ...settings, careers: { ...settings.careers, title: e.target.value } })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Description</label>
                  <textarea
                    value={settings.careers.description}
                    onChange={(e) => setSettings({ ...settings, careers: { ...settings.careers, description: e.target.value } })}
                    className={`${inputCls} resize-none`}
                    rows={3}
                  />
                </div>
                <div>
                  <label className={labelCls}>Openings List Sub-heading</label>
                  <input
                    value={settings.careers.openingsTitle}
                    onChange={(e) => setSettings({ ...settings, careers: { ...settings.careers, openingsTitle: e.target.value } })}
                    className={inputCls}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border-t border-border/30 pt-4">
                  <div>
                    <label className={labelCls}>General Application Footer Text</label>
                    <input
                      value={settings.careers.generalAppText}
                      onChange={(e) => setSettings({ ...settings, careers: { ...settings.careers, generalAppText: e.target.value } })}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>General Application Button Text</label>
                    <input
                      value={settings.careers.generalAppButtonText}
                      onChange={(e) => setSettings({ ...settings, careers: { ...settings.careers, generalAppButtonText: e.target.value } })}
                      className={inputCls}
                    />
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground italic bg-muted/30 p-3 rounded-xl border border-border/30">
                  Note: Job opening cards are rendered dynamically from the live Careers CMS database API.
                </p>
              </div>
            </div>
          )}

          {/* CONTACT SECTION */}
          {activeSection === 'contact' && (
            <div className="bg-card border border-border/40 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-border/40 bg-muted/10 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h2 className="font-bold text-foreground text-sm">Contact & Demo Booking</h2>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Edit inquiry header, contact info cards, and demo panel.</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleVisibility('contact')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all duration-200 ${
                    settings.contact.visible ? 'bg-teal-50 text-teal-700' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {settings.contact.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  {settings.contact.visible ? 'Visible' : 'Hidden'}
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className={labelCls}>Eyebrow</label>
                  <input
                    value={settings.contact.eyebrow}
                    onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, eyebrow: e.target.value } })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Heading</label>
                  <input
                    value={settings.contact.title}
                    onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, title: e.target.value } })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Description</label>
                  <textarea
                    value={settings.contact.description}
                    onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, description: e.target.value } })}
                    className={`${inputCls} resize-none`}
                    rows={2}
                  />
                </div>

                {/* Contact Info Items */}
                <div className="border-t border-border/30 pt-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">Contact Information Cards</h3>
                  <div className="space-y-3">
                    {settings.contact.infoList.map((info, idx) => (
                      <div key={idx} className="p-3 bg-muted/20 border border-border/40 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-2">
                        <input
                          placeholder="Icon (MapPin, Phone, Mail)"
                          value={info.iconName}
                          onChange={(e) => {
                            const arr = [...settings.contact.infoList];
                            arr[idx].iconName = e.target.value;
                            setSettings({ ...settings, contact: { ...settings.contact, infoList: arr } });
                          }}
                          className={inputCls}
                        />
                        <input
                          placeholder="Label (e.g. Call Us)"
                          value={info.label}
                          onChange={(e) => {
                            const arr = [...settings.contact.infoList];
                            arr[idx].label = e.target.value;
                            setSettings({ ...settings, contact: { ...settings.contact, infoList: arr } });
                          }}
                          className={inputCls}
                        />
                        <input
                          placeholder="Value (e.g. 9346517202)"
                          value={info.value}
                          onChange={(e) => {
                            const arr = [...settings.contact.infoList];
                            arr[idx].value = e.target.value;
                            setSettings({ ...settings, contact: { ...settings.contact, infoList: arr } });
                          }}
                          className={inputCls}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Demo Card Settings */}
                <div className="border-t border-border/30 pt-4 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Schedule Demo Card</h3>
                  <div>
                    <label className={labelCls}>Demo Card Title</label>
                    <input
                      value={settings.contact.demoTitle}
                      onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, demoTitle: e.target.value } })}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Demo Card Description</label>
                    <textarea
                      value={settings.contact.demoDescription}
                      onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, demoDescription: e.target.value } })}
                      className={`${inputCls} resize-none`}
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Demo Button Text</label>
                    <input
                      value={settings.contact.demoButtonText}
                      onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, demoButtonText: e.target.value } })}
                      className={inputCls}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SEO METADATA SECTION */}
          {activeSection === 'seo' && (
            <div className="bg-card border border-border/40 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-border/40 bg-muted/10 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h2 className="font-bold text-foreground text-sm flex items-center gap-2">
                    <Globe className="h-4 w-4 text-teal-600" /> Home Page SEO Metadata
                  </h2>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Optimize search engine visibility and meta tags.</p>
                </div>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <label className={labelCls}>Meta Title</label>
                  <input
                    value={settings.seo?.metaTitle || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      seo: {
                        metaTitle: e.target.value,
                        metaDescription: settings.seo?.metaDescription || '',
                        metaKeywords: settings.seo?.metaKeywords || ''
                      }
                    })}
                    className={inputCls}
                    placeholder="e.g. Veenero | Technology-Driven Water Conservation"
                  />
                </div>

                <div>
                  <label className={labelCls}>Meta Description</label>
                  <textarea
                    value={settings.seo?.metaDescription || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      seo: {
                        metaTitle: settings.seo?.metaTitle || '',
                        metaDescription: e.target.value,
                        metaKeywords: settings.seo?.metaKeywords || ''
                      }
                    })}
                    className={`${inputCls} resize-none`}
                    rows={3}
                    placeholder="e.g. Pioneering sustainable water management through innovative technology."
                  />
                </div>

                <div>
                  <label className={labelCls}>Meta Keywords (Comma Separated)</label>
                  <input
                    value={settings.seo?.metaKeywords || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      seo: {
                        metaTitle: settings.seo?.metaTitle || '',
                        metaDescription: settings.seo?.metaDescription || '',
                        metaKeywords: e.target.value
                      }
                    })}
                    className={inputCls}
                    placeholder="e.g. water intelligence, IoT telemetry, water conservation"
                  />
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default HomeCms;

