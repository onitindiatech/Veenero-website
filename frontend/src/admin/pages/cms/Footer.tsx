import React, { useState, useEffect } from 'react';
import {
  Save,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Layout,
  Mail,
  MapPin,
  Phone,
  Share2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  PublicFooterData,
  getAdminFooterSettings,
  updateAdminFooterSettings,
} from '@/services/footer.service';

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

export const FooterCms: React.FC = () => {
  const [settings, setSettings] = useState<PublicFooterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await getAdminFooterSettings();
      setSettings(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to load Footer settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    try {
      setSaving(true);
      const updated = await updateAdminFooterSettings(settings);
      setSettings(updated);
      showToast('Footer settings saved successfully!');
    } catch (err: any) {
      showToast(err.message || 'Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
          <p className="text-xs font-medium text-muted-foreground">Loading Footer CMS configurations...</p>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="p-8 text-center text-rose-500">
        <p>Failed to load configurations.</p>
        <Button onClick={loadSettings} className="mt-4" variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto font-sans space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-700 dark:text-teal-300 text-xs font-mono font-bold mb-2">
            <Layout className="w-3.5 h-3.5" />
            <span>GLOBAL FOOTER CMS</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Global Footer &amp; Contact Info</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage global site footer bio, registered office address, direct phone, and social media handles.
          </p>
        </div>

        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs"
        >
          <Save className="w-4 h-4 mr-1.5" />
          {saving ? 'Saving...' : 'Save Footer'}
        </Button>
      </div>

      {/* Content Form */}
      <div className="bg-card rounded-2xl border border-border/70 p-6 shadow-xs space-y-6">
        {/* Brand Bio */}
        <div>
          <label className={labelCls}>Company Bio &amp; Water Mission</label>
          <textarea
            rows={3}
            value={settings.description}
            onChange={(e) => setSettings({ ...settings, description: e.target.value })}
            className={textareaCls}
          />
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Direct Phone</label>
            <div className="relative">
              <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={settings.mobile}
                onChange={(e) => setSettings({ ...settings, mobile: e.target.value })}
                className={`${inputCls} pl-8.5`}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Support Email</label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className={`${inputCls} pl-8.5`}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Registered Office Address</label>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className={`${inputCls} pl-8.5`}
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="space-y-3 pt-4 border-t border-border/60">
          <div className="flex items-center justify-between">
            <label className={labelCls}>Social Media Links</label>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const next = [...settings.socialLinks];
                next.push({ iconName: 'Linkedin', href: 'https://', label: 'New Social' });
                setSettings({ ...settings, socialLinks: next });
              }}
              className="text-xs h-7 rounded-lg"
            >
              <Plus className="w-3 h-3 mr-1" /> Add Social Link
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {settings.socialLinks.map((soc, idx) => (
              <div key={idx} className="p-3 rounded-xl border border-border/60 bg-muted/10 flex items-center gap-3">
                <Share2 className="w-4 h-4 text-teal-600 shrink-0" />
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={soc.label}
                    placeholder="Platform"
                    onChange={(e) => {
                      const next = [...settings.socialLinks];
                      next[idx].label = e.target.value;
                      setSettings({ ...settings, socialLinks: next });
                    }}
                    className={inputCls}
                  />
                  <input
                    type="text"
                    value={soc.href}
                    placeholder="URL"
                    onChange={(e) => {
                      const next = [...settings.socialLinks];
                      next[idx].href = e.target.value;
                      setSettings({ ...settings, socialLinks: next });
                    }}
                    className={inputCls}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const next = settings.socialLinks.filter((_, i) => i !== idx);
                    setSettings({ ...settings, socialLinks: next });
                  }}
                  className="p-1.5 text-muted-foreground hover:text-rose-500"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Column Navigation Links */}
        <div className="space-y-4 pt-4 border-t border-border/60">
          <label className={labelCls}>Footer Navigation Columns</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['solutions', 'company', 'resources'] as const).map((col) => (
              <div key={col} className="p-4 rounded-xl border border-border/60 bg-muted/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase text-foreground">{col} Links</span>
                  <button
                    type="button"
                    onClick={() => {
                      const next = { ...settings.links };
                      next[col].push({ label: 'New Link', href: '#' });
                      setSettings({ ...settings, links: next });
                    }}
                    className="text-xs text-teal-600 hover:underline font-bold"
                  >
                    + Add
                  </button>
                </div>

                <div className="space-y-2">
                  {settings.links[col].map((link, lIdx) => (
                    <div key={lIdx} className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) => {
                          const next = { ...settings.links };
                          next[col][lIdx].label = e.target.value;
                          setSettings({ ...settings, links: next });
                        }}
                        className={`${inputCls} text-[11px]`}
                        placeholder="Label"
                      />
                      <input
                        type="text"
                        value={link.href}
                        onChange={(e) => {
                          const next = { ...settings.links };
                          next[col][lIdx].href = e.target.value;
                          setSettings({ ...settings, links: next });
                        }}
                        className={`${inputCls} text-[11px]`}
                        placeholder="/path"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const next = { ...settings.links };
                          next[col] = next[col].filter((_, i) => i !== lIdx);
                          setSettings({ ...settings, links: next });
                        }}
                        className="text-muted-foreground hover:text-rose-500 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterCms;
