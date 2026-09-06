import React, { useState, useEffect } from 'react';
import {
  Save,
  Eye,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Globe,
  Sparkles,
  Phone,
  FileText,
  HelpCircle,
  MessageSquare,
  Image as ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  PublicContactData,
  getAdminContactSettings,
  updateAdminContactSection,
  updateAdminContactSettings,
} from '@/services/contact.service';
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
  { id: 'hero', label: '01 — Hero Section', desc: 'Main cover title & description', icon: Sparkles },
  { id: 'contactInfo', label: '02 — Direct Contact Cards', desc: 'Office address, phone, email & timings', icon: Phone },
  { id: 'demoCard', label: '03 — Platform Demo Card', desc: 'Schedule a Platform Demo callout box', icon: HelpCircle },
  { id: 'form', label: '04 — Inquiry Form Config', desc: 'Form titles, inquiry types & success message', icon: FileText },
  { id: 'cta', label: '05 — Closing CTA', desc: 'Bottom banner heading & navigation links', icon: MessageSquare },
  { id: 'seo', label: '06 — SEO Metadata', desc: 'Browser title & meta description for search', icon: Globe },
];

export const ContactCms: React.FC = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [settings, setSettings] = useState<PublicContactData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleMediaSelected = (asset: MediaAsset) => {
    if (!settings) return;
    setSettings({
      ...settings,
      hero: {
        ...settings.hero,
        backgroundImage: asset.secureUrl,
        mediaPublicId: asset.publicId,
      },
    });
    setMediaPickerOpen(false);
    showToast('Hero background media selected from Cloudinary. Click Save to persist.');
  };

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await getAdminContactSettings();
      setSettings(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to load Contact page settings', 'error');
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
      await updateAdminContactSection(sectionKey, sectionData);
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
      const updated = await updateAdminContactSettings(settings);
      setSettings(updated);
      showToast('All Contact page settings saved successfully!');
    } catch (err: any) {
      showToast(err.message || 'Failed to save settings.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
          <p className="text-xs font-medium text-muted-foreground">Loading Contact CMS configurations...</p>
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
            <Phone className="w-3.5 h-3.5" />
            <span>CONTACT CMS</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Contact Page Content</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage contact channels, headquarters address, inquiry forms, and demo CTA.
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
            href="/contact"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 rounded-xl border border-border/80 text-xs font-semibold hover:bg-muted/50 transition-colors inline-flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            Live Preview
          </a>
        </div>
      </div>

      {/* Grid: Navigation Sidebar + Form Panel */}
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

          {/* 1. HERO */}
          {activeSection === 'hero' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-800 dark:text-teal-300 font-medium">
                📍 <strong>Page Location:</strong> Controls the main hero cover banner appearing at the top of the public Contact page.
              </div>

              <div>
                <label className={labelCls}>
                  Hero Eyebrow Badge
                  <span className="ml-1 text-[10px] text-teal-600 font-mono font-normal">
                    → Small pill tag above the hero title
                  </span>
                </label>
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
                <label className={labelCls}>
                  Page Heading (H1)
                  <span className="ml-1 text-[10px] text-teal-600 font-mono font-normal">
                    → Main headline on the public Contact page hero
                  </span>
                </label>
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
                <label className={labelCls}>
                  Description
                  <span className="ml-1 text-[10px] text-teal-600 font-mono font-normal">
                    → Supporting subtitle text below the hero headline
                  </span>
                </label>
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

              {/* Cloudinary Hero Background Media */}
              <div>
                <label className={labelCls}>
                  Hero Background Media (Cloudinary)
                  <span className="ml-1 text-[10px] text-teal-600 font-mono font-normal">
                    → Appears behind the contact hero banner on public page
                  </span>
                </label>
                <div className="flex items-center gap-4 p-3 rounded-xl border border-border/70 bg-muted/10">
                  <div className="w-24 h-16 rounded-lg bg-slate-900 overflow-hidden shrink-0 border border-border flex items-center justify-center">
                    {settings.hero.backgroundImage ? (
                      <img
                        src={settings.hero.backgroundImage}
                        alt="Hero background"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] text-muted-foreground font-mono">Default Asset</span>
                    )}
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <p className="text-xs font-semibold text-foreground">
                      {settings.hero.backgroundImage ? 'Custom Cloudinary Media Active' : 'Default Cinematic Background Active'}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Select or upload an optimized image from the Cloudinary media library.
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setMediaPickerOpen(true)}
                        className="text-xs h-7 rounded-lg cursor-pointer"
                      >
                        <ImageIcon className="w-3.5 h-3.5 mr-1" />
                        Choose Media from Cloudinary
                      </Button>
                      {settings.hero.backgroundImage && (
                        <button
                          type="button"
                          onClick={() => {
                            setSettings({
                              ...settings,
                              hero: { ...settings.hero, backgroundImage: '', mediaPublicId: '' },
                            });
                          }}
                          className="text-[11px] text-rose-500 hover:text-rose-600 font-bold cursor-pointer"
                        >
                          Reset to Default
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. CONTACT INFO */}
          {activeSection === 'contactInfo' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-800 dark:text-teal-300 font-medium">
                📍 <strong>Page Location:</strong> "Contact Phone", "Contact Email", and "Registered Office" configured here appear in the <strong>Contact Information</strong> card on the public Contact page and the Home Contact section.
              </div>

              <div>
                <label className={labelCls}>
                  Section Title
                  <span className="ml-1 text-[10px] text-teal-600 font-mono font-normal">
                    → e.g. "Contact Information" or "Contact Details"
                  </span>
                </label>
                <input
                  type="text"
                  value={settings.contactInfo.title}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      contactInfo: { ...settings.contactInfo, title: e.target.value },
                    })
                  }
                  className={inputCls}
                />
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className={labelCls}>
                    Contact Channels ({settings.contactInfo.items.length})
                    <span className="ml-1 text-[10px] text-teal-600 font-mono font-normal">
                      → Phone, Email, Office Address appearing on public page
                    </span>
                  </label>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const next = [...settings.contactInfo.items];
                      next.push({
                        iconName: 'Mail',
                        label: 'New Channel',
                        value: 'contact@veenero.com',
                        note: 'Available 24/7',
                      });
                      setSettings({
                        ...settings,
                        contactInfo: { ...settings.contactInfo, items: next },
                      });
                    }}
                    className="text-xs h-7 rounded-lg"
                  >
                    <Plus className="w-3 h-3 mr-1" /> Add Channel
                  </Button>
                </div>

                {settings.contactInfo.items.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-border/60 bg-muted/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-teal-600">Channel #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const next = settings.contactInfo.items.filter((_, i) => i !== idx);
                          setSettings({
                            ...settings,
                            contactInfo: { ...settings.contactInfo, items: next },
                          });
                        }}
                        className="text-rose-500 hover:text-rose-600 text-xs font-bold"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelCls}>Channel Label</label>
                        <input
                          type="text"
                          value={item.label}
                          onChange={(e) => {
                            const next = [...settings.contactInfo.items];
                            next[idx].label = e.target.value;
                            setSettings({
                              ...settings,
                              contactInfo: { ...settings.contactInfo, items: next },
                            });
                          }}
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Contact Value</label>
                        <input
                          type="text"
                          value={item.value}
                          onChange={(e) => {
                            const next = [...settings.contactInfo.items];
                            next[idx].value = e.target.value;
                            setSettings({
                              ...settings,
                              contactInfo: { ...settings.contactInfo, items: next },
                            });
                          }}
                          className={inputCls}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={labelCls}>Helper Note</label>
                      <input
                        type="text"
                        value={item.note || ''}
                        onChange={(e) => {
                          const next = [...settings.contactInfo.items];
                          next[idx].note = e.target.value;
                          setSettings({
                            ...settings,
                            contactInfo: { ...settings.contactInfo, items: next },
                          });
                        }}
                        className={inputCls}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. DEMO CARD */}
          {activeSection === 'demoCard' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-800 dark:text-teal-300 font-medium">
                📍 <strong>Page Location:</strong> "Book Demo Heading", description, and button text configured here appear in the <strong>blue Schedule a Platform Demo card</strong> on the Contact page &amp; Home section.
              </div>

              <div>
                <label className={labelCls}>
                  Demo Card Badge
                  <span className="ml-1 text-[10px] text-teal-600 font-mono font-normal">
                    → Eyebrow tag at top of demo card
                  </span>
                </label>
                <input
                  type="text"
                  value={settings.demoCard.badge}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      demoCard: { ...settings.demoCard, badge: e.target.value },
                    })
                  }
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>
                  Book Demo Heading (Title)
                  <span className="ml-1 text-[10px] text-teal-600 font-mono font-normal">
                    → appears in the blue Schedule a Platform Demo card
                  </span>
                </label>
                <input
                  type="text"
                  value={settings.demoCard.title}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      demoCard: { ...settings.demoCard, title: e.target.value },
                    })
                  }
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>
                  Demo Card Description
                  <span className="ml-1 text-[10px] text-teal-600 font-mono font-normal">
                    → Explanatory copy inside the blue demo card
                  </span>
                </label>
                <textarea
                  rows={2}
                  value={settings.demoCard.description}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      demoCard: { ...settings.demoCard, description: e.target.value },
                    })
                  }
                  className={textareaCls}
                />
              </div>

              <div>
                <label className={labelCls}>
                  Book Demo Button Text
                  <span className="ml-1 text-[10px] text-teal-600 font-mono font-normal">
                    → Label on the interactive "Book Demo" button
                  </span>
                </label>
                <input
                  type="text"
                  value={settings.demoCard.buttonText}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      demoCard: { ...settings.demoCard, buttonText: e.target.value },
                    })
                  }
                  className={inputCls}
                />
              </div>
            </div>
          )}

          {/* 4. FORM CONFIG */}
          {activeSection === 'form' && (
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Form Title</label>
                <input
                  type="text"
                  value={settings.form.title}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      form: { ...settings.form, title: e.target.value },
                    })
                  }
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Form Subtitle</label>
                <input
                  type="text"
                  value={settings.form.subtitle}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      form: { ...settings.form, subtitle: e.target.value },
                    })
                  }
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Submit Button Text</label>
                <input
                  type="text"
                  value={settings.form.submitButtonText}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      form: { ...settings.form, submitButtonText: e.target.value },
                    })
                  }
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Success Toast Message</label>
                <textarea
                  rows={2}
                  value={settings.form.successMessage}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      form: { ...settings.form, successMessage: e.target.value },
                    })
                  }
                  className={textareaCls}
                />
              </div>
            </div>
          )}

          {/* 5. CTA */}
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
            </div>
          )}

          {/* 6. SEO */}
          {activeSection === 'seo' && (
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Meta Title</label>
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
                <label className={labelCls}>Meta Description</label>
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

      {/* Cloudinary Media Picker Modal */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={handleMediaSelected}
        defaultTab="library"
      />
    </div>
  );
};

export default ContactCms;
