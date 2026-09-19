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
  MapPin,
  Clock,
  ChevronUp,
  ChevronDown,
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
    <button onClick={onClose} className="hover:opacity-70 text-xs font-bold px-1 cursor-pointer">
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
  { id: 'hero',        label: '01 — Hero Banner',        desc: 'Page title, eyebrow & hero background', icon: Sparkles },
  { id: 'form',        label: '02 — Contact Form',       desc: 'Section heading, field labels, placeholders & inquiry types', icon: FileText },
  { id: 'office',      label: '03 — Office Details',     desc: 'Company name, address, phone, email', icon: MapPin },
  { id: 'officeHours', label: '04 — Office Hours',       desc: 'Business hours displayed beside the map', icon: Clock },
  { id: 'faq',         label: '05 — FAQ Section',        desc: 'Frequently asked questions accordion', icon: HelpCircle },
  { id: 'contactInfo', label: '06 — Contact Channels',   desc: 'Direct contact channel cards (for home page reference)', icon: Phone },
  { id: 'cta',         label: '07 — Closing CTA',        desc: 'Bottom banner heading & navigation links', icon: MessageSquare },
  { id: 'seo',         label: '08 — SEO Metadata',       desc: 'Browser title & meta description for search', icon: Globe },
];

// Default empty values to populate new settings if backend returns nothing
const DEFAULT_OFFICE = {
  visible: true,
  sectionEyebrow: 'OUR OFFICE',
  sectionHeading: 'Visit Us in Adilabad, India',
  companyName: 'Veenero Solutions Pvt. Ltd.',
  addressLine1: 'H-no 3-294/1/A/1, Tailors Colony',
  addressLine2: '',
  city: 'Adilabad',
  state: 'Telangana',
  zip: '504001',
  country: 'India',
  phone: '+91 9346517202',
  phoneHref: 'tel:+919346517202',
  email: 'info@veenerosolutions.com',
  emailHref: 'mailto:info@veenerosolutions.com',
  mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3785.0!2d78.5322!3d19.6641!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcf5c2b!2sAdilabad%2C+Telangana!5e0!3m2!1sen!2sin!4v1',
  mapLinkUrl: 'https://maps.google.com/?q=Adilabad,Telangana,India',
  mapLinkText: 'View on Google Maps',
};

const DEFAULT_OFFICE_HOURS = {
  visible: true,
  eyebrow: 'Office Hours',
  text: 'Monday – Friday, 9:00 AM to 6:00 PM IST. For urgent matters, email us directly.',
};

const DEFAULT_FORM_EXTRAS = {
  sectionEyebrow: 'START A CONVERSATION',
  sectionHeading: 'How Can We Help Your Water Operations?',
  sectionDescription: 'Fill out the form below and our team will get back to you shortly. Select your focus area to help us route your inquiry faster.',
  nameLabel: 'Full Name',
  emailLabel: 'Work Email',
  organizationLabel: 'Organization',
  focusAreaLabel: 'Focus Area',
  messageLabel: 'Your Message',
  namePlaceholder: 'e.g. Rahul Sharma',
  emailPlaceholder: 'name@company.com',
  organizationPlaceholder: 'e.g. Enterprise Ltd / Municipal Water Board',
  messagePlaceholder: 'Tell us about your facility nodes, telemetry requirements, or water management goals...',
  errorMessage: 'Failed to send message. Please try again.',
};

// Helper to normalise settings returned by backend
function normaliseSettings(raw: any): any {
  return {
    ...raw,
    office: { ...DEFAULT_OFFICE, ...(raw.office || {}) },
    officeHours: { ...DEFAULT_OFFICE_HOURS, ...(raw.officeHours || {}) },
    form: {
      ...DEFAULT_FORM_EXTRAS,
      ...(raw.form || {}),
      inquiryTypes: raw.form?.inquiryTypes && raw.form.inquiryTypes.length > 0
        ? raw.form.inquiryTypes
        : [
            { id: 'enterprise', label: 'Solutions & Projects' },
            { id: 'municipal', label: 'Municipal & Utilities' },
            { id: 'esg', label: 'ESG & Compliance' },
            { id: 'general', label: 'Partnerships & Other' },
          ],
    },
    faq: {
      ...(raw.faq || {}),
      items: raw.faq?.items || [],
    },
  };
}

export const ContactCms: React.FC = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [settings, setSettings] = useState<any | null>(null);
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
    showToast('Hero background media selected. Click Save to persist.');
  };

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await getAdminContactSettings();
      setSettings(normaliseSettings(data));
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
      const sectionData = settings[sectionKey];
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
      setSettings(normaliseSettings(updated));
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
            Manage hero, contact form, office details, office hours, FAQ, CTA, and SEO for the public Contact page.
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

          {/* ─────────────────────────────────────────────────────────
              1. HERO
          ───────────────────────────────────────────────────────── */}
          {activeSection === 'hero' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-800 dark:text-teal-300 font-medium">
                📍 <strong>Page Location:</strong> Controls the main hero cover banner at the top of the public Contact page.
              </div>

              <div>
                <label className={labelCls}>
                  Hero Eyebrow Badge
                  <span className="ml-1 text-[10px] text-teal-600 font-mono font-normal">→ small pill tag above the title</span>
                </label>
                <input
                  type="text"
                  value={settings.hero.eyebrow}
                  onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, eyebrow: e.target.value } })}
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>
                  Page H1 Headline
                  <span className="ml-1 text-[10px] text-teal-600 font-mono font-normal">→ main headline on the hero banner</span>
                </label>
                <input
                  type="text"
                  value={settings.hero.title}
                  onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, title: e.target.value } })}
                  className={inputCls}
                />
              </div>

              {/* Cloudinary Hero Background Media */}
              <div>
                <label className={labelCls}>
                  Hero Background Media (Cloudinary)
                  <span className="ml-1 text-[10px] text-teal-600 font-mono font-normal">→ appears behind the hero banner</span>
                </label>
                <div className="flex items-center gap-4 p-3 rounded-xl border border-border/70 bg-muted/10">
                  <div className="w-24 h-16 rounded-lg bg-slate-900 overflow-hidden shrink-0 border border-border flex items-center justify-center">
                    {settings.hero.backgroundImage ? (
                      <img src={settings.hero.backgroundImage} alt="Hero background" className="w-full h-full object-cover" />
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
                          onClick={() => setSettings({ ...settings, hero: { ...settings.hero, backgroundImage: '', mediaPublicId: '' } })}
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

          {/* ─────────────────────────────────────────────────────────
              2. CONTACT FORM
          ───────────────────────────────────────────────────────── */}
          {activeSection === 'form' && (
            <div className="space-y-6">
              <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-800 dark:text-teal-300 font-medium">
                📍 <strong>Page Location:</strong> Controls the left column of the Contact + Office grid — the section header, form card text, field labels, placeholders, and focus area dropdown options.
              </div>

              {/* Section Header */}
              <div>
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3 pb-2 border-b border-border/60">
                  Section Header
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className={labelCls}>Section Eyebrow <span className="ml-1 text-[10px] text-teal-600 font-mono font-normal">→ e.g. "START A CONVERSATION"</span></label>
                    <input type="text" value={settings.form.sectionEyebrow || ''} onChange={(e) => setSettings({ ...settings, form: { ...settings.form, sectionEyebrow: e.target.value } })} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Section Heading <span className="ml-1 text-[10px] text-teal-600 font-mono font-normal">→ bold H2 above the form card</span></label>
                    <input type="text" value={settings.form.sectionHeading || ''} onChange={(e) => setSettings({ ...settings, form: { ...settings.form, sectionHeading: e.target.value } })} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Section Description <span className="ml-1 text-[10px] text-teal-600 font-mono font-normal">→ small text below the H2</span></label>
                    <textarea rows={2} value={settings.form.sectionDescription || ''} onChange={(e) => setSettings({ ...settings, form: { ...settings.form, sectionDescription: e.target.value } })} className={textareaCls} />
                  </div>
                </div>
              </div>

              {/* Field Labels */}
              <div>
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3 pb-2 border-b border-border/60">
                  Field Labels
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Full Name Label</label>
                    <input type="text" value={settings.form.nameLabel || 'Full Name'} onChange={(e) => setSettings({ ...settings, form: { ...settings.form, nameLabel: e.target.value } })} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Work Email Label</label>
                    <input type="text" value={settings.form.emailLabel || 'Work Email'} onChange={(e) => setSettings({ ...settings, form: { ...settings.form, emailLabel: e.target.value } })} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Organization Label</label>
                    <input type="text" value={settings.form.organizationLabel || 'Organization'} onChange={(e) => setSettings({ ...settings, form: { ...settings.form, organizationLabel: e.target.value } })} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Focus Area Label</label>
                    <input type="text" value={settings.form.focusAreaLabel || 'Focus Area'} onChange={(e) => setSettings({ ...settings, form: { ...settings.form, focusAreaLabel: e.target.value } })} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Message Label</label>
                    <input type="text" value={settings.form.messageLabel || 'Your Message'} onChange={(e) => setSettings({ ...settings, form: { ...settings.form, messageLabel: e.target.value } })} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Submit Button Text</label>
                    <input type="text" value={settings.form.submitButtonText} onChange={(e) => setSettings({ ...settings, form: { ...settings.form, submitButtonText: e.target.value } })} className={inputCls} />
                  </div>
                </div>
              </div>

              {/* Placeholders */}
              <div>
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3 pb-2 border-b border-border/60">
                  Field Placeholders
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Name Placeholder</label>
                    <input type="text" value={settings.form.namePlaceholder || ''} onChange={(e) => setSettings({ ...settings, form: { ...settings.form, namePlaceholder: e.target.value } })} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Email Placeholder</label>
                    <input type="text" value={settings.form.emailPlaceholder || ''} onChange={(e) => setSettings({ ...settings, form: { ...settings.form, emailPlaceholder: e.target.value } })} className={inputCls} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Organization Placeholder</label>
                    <input type="text" value={settings.form.organizationPlaceholder || ''} onChange={(e) => setSettings({ ...settings, form: { ...settings.form, organizationPlaceholder: e.target.value } })} className={inputCls} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Message Placeholder</label>
                    <textarea rows={2} value={settings.form.messagePlaceholder || ''} onChange={(e) => setSettings({ ...settings, form: { ...settings.form, messagePlaceholder: e.target.value } })} className={textareaCls} />
                  </div>
                </div>
              </div>

              {/* Focus Area / Inquiry Types */}
              <div>
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3 pb-2 border-b border-border/60">
                  Focus Area Dropdown Options
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] text-muted-foreground">These appear in the "Focus Area" dropdown on the contact form.</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const next = [...(settings.form.inquiryTypes || []), { id: `option_${Date.now()}`, label: 'New Option' }];
                        setSettings({ ...settings, form: { ...settings.form, inquiryTypes: next } });
                      }}
                      className="text-xs h-7 rounded-lg"
                    >
                      <Plus className="w-3 h-3 mr-1" /> Add Option
                    </Button>
                  </div>
                  {(settings.form.inquiryTypes || []).map((opt: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="grid grid-cols-2 gap-2 flex-1">
                        <input
                          type="text"
                          placeholder="Option ID (e.g. enterprise)"
                          value={opt.id}
                          onChange={(e) => {
                            const next = [...settings.form.inquiryTypes];
                            next[idx] = { ...next[idx], id: e.target.value };
                            setSettings({ ...settings, form: { ...settings.form, inquiryTypes: next } });
                          }}
                          className={inputCls}
                        />
                        <input
                          type="text"
                          placeholder="Display Label"
                          value={opt.label}
                          onChange={(e) => {
                            const next = [...settings.form.inquiryTypes];
                            next[idx] = { ...next[idx], label: e.target.value };
                            setSettings({ ...settings, form: { ...settings.form, inquiryTypes: next } });
                          }}
                          className={inputCls}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const next = settings.form.inquiryTypes.filter((_: any, i: number) => i !== idx);
                          setSettings({ ...settings, form: { ...settings.form, inquiryTypes: next } });
                        }}
                        className="text-rose-500 hover:text-rose-600 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Success / Error Messages */}
              <div>
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3 pb-2 border-b border-border/60">
                  Submission Messages
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className={labelCls}>Success Title <span className="ml-1 text-[10px] text-teal-600 font-mono font-normal">→ appears in green banner after form submission</span></label>
                    <input type="text" value={settings.form.successTitle} onChange={(e) => setSettings({ ...settings, form: { ...settings.form, successTitle: e.target.value } })} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Success Message</label>
                    <textarea rows={2} value={settings.form.successMessage} onChange={(e) => setSettings({ ...settings, form: { ...settings.form, successMessage: e.target.value } })} className={textareaCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Default Error Message</label>
                    <input type="text" value={settings.form.errorMessage || ''} onChange={(e) => setSettings({ ...settings, form: { ...settings.form, errorMessage: e.target.value } })} className={inputCls} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────
              3. OFFICE DETAILS
          ───────────────────────────────────────────────────────── */}
          {activeSection === 'office' && (
            <div className="space-y-5">
              <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-800 dark:text-teal-300 font-medium">
                📍 <strong>Page Location:</strong> Controls the right column "Our Office" card on the public Contact page — company name, address, phone, email, and the embedded map.
              </div>

              {/* Section Headers */}
              <div>
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3 pb-2 border-b border-border/60">Section Header</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Section Eyebrow <span className="ml-1 text-[10px] text-teal-600 font-mono font-normal">→ e.g. "OUR OFFICE"</span></label>
                    <input type="text" value={settings.office.sectionEyebrow} onChange={(e) => setSettings({ ...settings, office: { ...settings.office, sectionEyebrow: e.target.value } })} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Section Heading <span className="ml-1 text-[10px] text-teal-600 font-mono font-normal">→ e.g. "Visit Us in City, India"</span></label>
                    <input type="text" value={settings.office.sectionHeading} onChange={(e) => setSettings({ ...settings, office: { ...settings.office, sectionHeading: e.target.value } })} className={inputCls} />
                  </div>
                </div>
              </div>

              {/* Office Info */}
              <div>
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3 pb-2 border-b border-border/60">Office Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className={labelCls}>Company / Office Name</label>
                    <input type="text" value={settings.office.companyName} onChange={(e) => setSettings({ ...settings, office: { ...settings.office, companyName: e.target.value } })} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Address Line 1</label>
                    <input type="text" value={settings.office.addressLine1} onChange={(e) => setSettings({ ...settings, office: { ...settings.office, addressLine1: e.target.value } })} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Address Line 2 <span className="ml-1 text-[10px] text-teal-600 font-mono font-normal">(optional)</span></label>
                    <input type="text" value={settings.office.addressLine2} onChange={(e) => setSettings({ ...settings, office: { ...settings.office, addressLine2: e.target.value } })} className={inputCls} />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className={labelCls}>City</label>
                      <input type="text" value={settings.office.city} onChange={(e) => setSettings({ ...settings, office: { ...settings.office, city: e.target.value } })} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>State</label>
                      <input type="text" value={settings.office.state} onChange={(e) => setSettings({ ...settings, office: { ...settings.office, state: e.target.value } })} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>ZIP / PIN</label>
                      <input type="text" value={settings.office.zip} onChange={(e) => setSettings({ ...settings, office: { ...settings.office, zip: e.target.value } })} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Country</label>
                      <input type="text" value={settings.office.country} onChange={(e) => setSettings({ ...settings, office: { ...settings.office, country: e.target.value } })} className={inputCls} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div>
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3 pb-2 border-b border-border/60">Contact</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Office Phone <span className="ml-1 text-[10px] text-teal-600 font-mono font-normal">→ display text</span></label>
                    <input type="text" value={settings.office.phone} onChange={(e) => setSettings({ ...settings, office: { ...settings.office, phone: e.target.value } })} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Phone Href <span className="ml-1 text-[10px] text-teal-600 font-mono font-normal">→ e.g. tel:+919346517202</span></label>
                    <input type="text" value={settings.office.phoneHref} onChange={(e) => setSettings({ ...settings, office: { ...settings.office, phoneHref: e.target.value } })} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Office Email <span className="ml-1 text-[10px] text-teal-600 font-mono font-normal">→ display text</span></label>
                    <input type="text" value={settings.office.email} onChange={(e) => setSettings({ ...settings, office: { ...settings.office, email: e.target.value } })} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Email Href <span className="ml-1 text-[10px] text-teal-600 font-mono font-normal">→ e.g. mailto:info@veenerosolutions.com</span></label>
                    <input type="text" value={settings.office.emailHref} onChange={(e) => setSettings({ ...settings, office: { ...settings.office, emailHref: e.target.value } })} className={inputCls} />
                  </div>
                </div>
              </div>

              {/* Map */}
              <div>
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3 pb-2 border-b border-border/60">Map Configuration</h3>
                <div className="space-y-3">
                  <div>
                    <label className={labelCls}>Google Maps Embed URL <span className="ml-1 text-[10px] text-teal-600 font-mono font-normal">→ paste from Google Maps → Share → Embed</span></label>
                    <textarea rows={3} value={settings.office.mapEmbedUrl} onChange={(e) => setSettings({ ...settings, office: { ...settings.office, mapEmbedUrl: e.target.value } })} className={textareaCls} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Google Maps Link URL</label>
                      <input type="text" value={settings.office.mapLinkUrl} onChange={(e) => setSettings({ ...settings, office: { ...settings.office, mapLinkUrl: e.target.value } })} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Map Link Label Text</label>
                      <input type="text" value={settings.office.mapLinkText} onChange={(e) => setSettings({ ...settings, office: { ...settings.office, mapLinkText: e.target.value } })} className={inputCls} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────
              4. OFFICE HOURS
          ───────────────────────────────────────────────────────── */}
          {activeSection === 'officeHours' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-800 dark:text-teal-300 font-medium">
                📍 <strong>Page Location:</strong> The small green card appearing below the Google Map on the right column of the Contact page — showing business hours.
              </div>

              <div>
                <label className={labelCls}>
                  Office Hours Eyebrow
                  <span className="ml-1 text-[10px] text-teal-600 font-mono font-normal">→ small label above the hours text, e.g. "Office Hours"</span>
                </label>
                <input
                  type="text"
                  value={settings.officeHours.eyebrow}
                  onChange={(e) => setSettings({ ...settings, officeHours: { ...settings.officeHours, eyebrow: e.target.value } })}
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>
                  Office Hours Text
                  <span className="ml-1 text-[10px] text-teal-600 font-mono font-normal">→ main hours description shown on public page</span>
                </label>
                <textarea
                  rows={3}
                  value={settings.officeHours.text}
                  onChange={(e) => setSettings({ ...settings, officeHours: { ...settings.officeHours, text: e.target.value } })}
                  className={textareaCls}
                />
              </div>

              {/* Live Preview */}
              <div className="mt-2 p-4 rounded-xl border border-border/50 bg-teal-50/60 dark:bg-teal-950/20 flex items-start gap-3 font-sans">
                <div className="w-8 h-8 rounded-lg bg-teal-600/10 border border-teal-600/20 flex items-center justify-center text-teal-700 dark:text-teal-300 shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 font-mono mb-0.5">
                    {settings.officeHours.eyebrow || 'Office Hours'}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {settings.officeHours.text || 'Monday – Friday, 9:00 AM to 6:00 PM IST'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────
              5. FAQ
          ───────────────────────────────────────────────────────── */}
          {activeSection === 'faq' && (
            <div className="space-y-5">
              <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-800 dark:text-teal-300 font-medium">
                📍 <strong>Page Location:</strong> The FAQ accordion section that appears below the contact form on the public Contact page.
              </div>

              {/* FAQ Header Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Eyebrow Badge</label>
                  <input type="text" value={settings.faq.eyebrow || ''} onChange={(e) => setSettings({ ...settings, faq: { ...settings.faq, eyebrow: e.target.value } })} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Section Title</label>
                  <input type="text" value={settings.faq.title || ''} onChange={(e) => setSettings({ ...settings, faq: { ...settings.faq, title: e.target.value } })} className={inputCls} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Section Description</label>
                  <textarea rows={2} value={settings.faq.description || ''} onChange={(e) => setSettings({ ...settings, faq: { ...settings.faq, description: e.target.value } })} className={textareaCls} />
                </div>
              </div>

              {/* FAQ Items */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className={`${labelCls} mb-0`}>
                    FAQ Items ({(settings.faq.items || []).length})
                  </label>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const next = [...(settings.faq.items || []), { question: 'New Question?', answer: 'Answer text here.' }];
                      setSettings({ ...settings, faq: { ...settings.faq, items: next } });
                    }}
                    className="text-xs h-7 rounded-lg"
                  >
                    <Plus className="w-3 h-3 mr-1" /> Add FAQ Item
                  </Button>
                </div>

                {(settings.faq.items || []).map((item: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-xl border border-border/60 bg-muted/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-teal-600">FAQ #{idx + 1}</span>
                      <div className="flex items-center gap-1">
                        {/* Move Up */}
                        {idx > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              const next = [...settings.faq.items];
                              [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
                              setSettings({ ...settings, faq: { ...settings.faq, items: next } });
                            }}
                            className="p-1 text-muted-foreground hover:text-foreground cursor-pointer"
                            title="Move up"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {/* Move Down */}
                        {idx < (settings.faq.items || []).length - 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const next = [...settings.faq.items];
                              [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
                              setSettings({ ...settings, faq: { ...settings.faq, items: next } });
                            }}
                            className="p-1 text-muted-foreground hover:text-foreground cursor-pointer"
                            title="Move down"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => {
                            const next = (settings.faq.items || []).filter((_: any, i: number) => i !== idx);
                            setSettings({ ...settings, faq: { ...settings.faq, items: next } });
                          }}
                          className="text-rose-500 hover:text-rose-600 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className={labelCls}>Question</label>
                      <input
                        type="text"
                        value={item.question}
                        onChange={(e) => {
                          const next = [...settings.faq.items];
                          next[idx] = { ...next[idx], question: e.target.value };
                          setSettings({ ...settings, faq: { ...settings.faq, items: next } });
                        }}
                        className={inputCls}
                      />
                    </div>

                    <div>
                      <label className={labelCls}>Answer</label>
                      <textarea
                        rows={3}
                        value={item.answer}
                        onChange={(e) => {
                          const next = [...settings.faq.items];
                          next[idx] = { ...next[idx], answer: e.target.value };
                          setSettings({ ...settings, faq: { ...settings.faq, items: next } });
                        }}
                        className={textareaCls}
                      />
                    </div>
                  </div>
                ))}

                {(settings.faq.items || []).length === 0 && (
                  <div className="p-8 text-center text-xs text-muted-foreground rounded-xl border border-dashed border-border/60">
                    <HelpCircle className="w-6 h-6 mx-auto mb-2 text-muted-foreground/50" />
                    <p>No FAQ items yet. Click "Add FAQ Item" to create your first question.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────
              6. CONTACT CHANNELS (contactInfo)
          ───────────────────────────────────────────────────────── */}
          {activeSection === 'contactInfo' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-800 dark:text-teal-300 font-medium">
                📍 <strong>Page Location:</strong> The "Contact Details" channel cards — phone, email, registered office address — used on the public Contact page and Home page contact section.
              </div>

              <div>
                <label className={labelCls}>Section Title <span className="ml-1 text-[10px] text-teal-600 font-mono font-normal">→ e.g. "Contact Details"</span></label>
                <input
                  type="text"
                  value={settings.contactInfo.title}
                  onChange={(e) => setSettings({ ...settings, contactInfo: { ...settings.contactInfo, title: e.target.value } })}
                  className={inputCls}
                />
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className={labelCls}>
                    Contact Channels ({settings.contactInfo.items.length})
                    <span className="ml-1 text-[10px] text-teal-600 font-mono font-normal">→ phone, email, address cards</span>
                  </label>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const next = [...settings.contactInfo.items];
                      next.push({ iconName: 'Mail', label: 'New Channel', value: 'contact@veenero.com', note: 'Available 24/7' });
                      setSettings({ ...settings, contactInfo: { ...settings.contactInfo, items: next } });
                    }}
                    className="text-xs h-7 rounded-lg"
                  >
                    <Plus className="w-3 h-3 mr-1" /> Add Channel
                  </Button>
                </div>

                {settings.contactInfo.items.map((item: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-xl border border-border/60 bg-muted/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-teal-600">Channel #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const next = settings.contactInfo.items.filter((_: any, i: number) => i !== idx);
                          setSettings({ ...settings, contactInfo: { ...settings.contactInfo, items: next } });
                        }}
                        className="text-rose-500 hover:text-rose-600 text-xs font-bold cursor-pointer"
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
                            next[idx] = { ...next[idx], label: e.target.value };
                            setSettings({ ...settings, contactInfo: { ...settings.contactInfo, items: next } });
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
                            next[idx] = { ...next[idx], value: e.target.value };
                            setSettings({ ...settings, contactInfo: { ...settings.contactInfo, items: next } });
                          }}
                          className={inputCls}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelCls}>Link Href <span className="ml-1 text-[10px] text-teal-600 font-mono font-normal">(optional)</span></label>
                        <input
                          type="text"
                          value={item.href || ''}
                          onChange={(e) => {
                            const next = [...settings.contactInfo.items];
                            next[idx] = { ...next[idx], href: e.target.value };
                            setSettings({ ...settings, contactInfo: { ...settings.contactInfo, items: next } });
                          }}
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Helper Note</label>
                        <input
                          type="text"
                          value={item.note || ''}
                          onChange={(e) => {
                            const next = [...settings.contactInfo.items];
                            next[idx] = { ...next[idx], note: e.target.value };
                            setSettings({ ...settings, contactInfo: { ...settings.contactInfo, items: next } });
                          }}
                          className={inputCls}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────
              7. CTA
          ───────────────────────────────────────────────────────── */}
          {activeSection === 'cta' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-800 dark:text-teal-300 font-medium">
                📍 <strong>Page Location:</strong> The full-width dark banner at the very bottom of the Contact page ("Let's Work Together").
              </div>

              <div>
                <label className={labelCls}>CTA Title</label>
                <input type="text" value={settings.cta.title} onChange={(e) => setSettings({ ...settings, cta: { ...settings.cta, title: e.target.value } })} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>CTA Description</label>
                <textarea rows={2} value={settings.cta.description} onChange={(e) => setSettings({ ...settings, cta: { ...settings.cta, description: e.target.value } })} className={textareaCls} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Primary Button Text</label>
                  <input type="text" value={settings.cta.primaryButtonText} onChange={(e) => setSettings({ ...settings, cta: { ...settings.cta, primaryButtonText: e.target.value } })} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Primary Button Link</label>
                  <input type="text" value={settings.cta.primaryButtonLink} onChange={(e) => setSettings({ ...settings, cta: { ...settings.cta, primaryButtonLink: e.target.value } })} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Secondary Button Text</label>
                  <input type="text" value={settings.cta.secondaryButtonText} onChange={(e) => setSettings({ ...settings, cta: { ...settings.cta, secondaryButtonText: e.target.value } })} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Secondary Button Link</label>
                  <input type="text" value={settings.cta.secondaryButtonLink} onChange={(e) => setSettings({ ...settings, cta: { ...settings.cta, secondaryButtonLink: e.target.value } })} className={inputCls} />
                </div>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────
              8. SEO
          ───────────────────────────────────────────────────────── */}
          {activeSection === 'seo' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-800 dark:text-teal-300 font-medium">
                📍 <strong>Page Location:</strong> Controls the browser tab title and search engine meta description for the /contact page.
              </div>

              <div>
                <label className={labelCls}>
                  Meta Title
                  <span className="ml-1 text-[10px] text-teal-600 font-mono font-normal">→ appears in browser tab and Google search results</span>
                </label>
                <input
                  type="text"
                  value={settings.seo.metaTitle}
                  onChange={(e) => setSettings({ ...settings, seo: { ...settings.seo, metaTitle: e.target.value } })}
                  className={inputCls}
                />
                <p className={`mt-1 text-[10px] font-mono ${settings.seo.metaTitle?.length > 60 ? 'text-amber-500' : 'text-muted-foreground'}`}>
                  {settings.seo.metaTitle?.length || 0} / 60 characters recommended
                </p>
              </div>

              <div>
                <label className={labelCls}>
                  Meta Description
                  <span className="ml-1 text-[10px] text-teal-600 font-mono font-normal">→ 120–160 chars shown in Google search snippets</span>
                </label>
                <textarea
                  rows={3}
                  value={settings.seo.metaDescription}
                  onChange={(e) => setSettings({ ...settings, seo: { ...settings.seo, metaDescription: e.target.value } })}
                  className={textareaCls}
                />
                <p className={`mt-1 text-[10px] font-mono ${settings.seo.metaDescription?.length > 160 ? 'text-amber-500' : 'text-muted-foreground'}`}>
                  {settings.seo.metaDescription?.length || 0} / 160 characters recommended
                </p>
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
