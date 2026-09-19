import React, { useState, useEffect } from 'react';
import {
  Settings2,
  Save,
  CheckCircle,
  XCircle,
  Building,
  Phone,
  Mail,
  Palette,
  Share2,
  Cpu,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  GlobalSettingsData,
  getAdminGlobalSettings,
  updateAdminGlobalSettings,
} from '@/services/globalSettings.service';

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

export const GlobalSettingsCms: React.FC = () => {
  const [data, setData] = useState<GlobalSettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'brand' | 'contact' | 'social' | 'behavior'>('general');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadSettings = async () => {
    try {
      setLoading(true);
      const res = await getAdminGlobalSettings();
      setData(res);
    } catch (err: any) {
      showToast(err.message || 'Failed to load global settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async () => {
    if (!data) return;
    try {
      setSaving(true);
      const res = await updateAdminGlobalSettings(data);
      setData(res);
      showToast('Global platform settings updated successfully!');
    } catch (err: any) {
      showToast(err.message || 'Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
          <p className="text-xs font-medium text-muted-foreground">Loading Global Platform configurations...</p>
        </div>
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
            <Settings2 className="w-3.5 h-3.5" />
            <span>ENTERPRISE SYSTEM CONFIG</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Global Settings</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Configure site metadata, brand identity, contact channels, social profiles, and feature toggles.
          </p>
        </div>

        <Button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs h-9 px-4"
        >
          <Save className="w-4 h-4 mr-1.5" />
          {saving ? 'Saving...' : 'Save Global Settings'}
        </Button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border/60 pb-3">
        {[
          { key: 'general', label: 'General', icon: Building },
          { key: 'brand', label: 'Brand & Identity', icon: Palette },
          { key: 'contact', label: 'Contact Details', icon: Phone },
          { key: 'social', label: 'Social Handles', icon: Share2 },
          { key: 'behavior', label: 'Platform Behavior', icon: Cpu },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="bg-card rounded-2xl border border-border/70 p-6 shadow-xs space-y-6">
        {/* Tab: General */}
        {activeTab === 'general' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-foreground">General Website Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Site Name</label>
                <input
                  type="text"
                  value={data.general?.siteName || ''}
                  onChange={(e) =>
                    setData({ ...data, general: { ...data.general, siteName: e.target.value } })
                  }
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Primary Public Domain URL</label>
                <input
                  type="text"
                  value={data.general?.siteUrl || ''}
                  onChange={(e) =>
                    setData({ ...data, general: { ...data.general, siteUrl: e.target.value } })
                  }
                  className={inputCls}
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelCls}>Tagline / Brand Value Proposition</label>
                <input
                  type="text"
                  value={data.general?.tagline || ''}
                  onChange={(e) =>
                    setData({ ...data, general: { ...data.general, tagline: e.target.value } })
                  }
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Corporate Support Email</label>
                <input
                  type="text"
                  value={data.general?.supportEmail || ''}
                  onChange={(e) =>
                    setData({ ...data, general: { ...data.general, supportEmail: e.target.value } })
                  }
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Corporate Helpline Phone</label>
                <input
                  type="text"
                  value={data.general?.supportPhone || ''}
                  onChange={(e) =>
                    setData({ ...data, general: { ...data.general, supportPhone: e.target.value } })
                  }
                  className={inputCls}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab: Brand & Identity */}
        {activeTab === 'brand' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-foreground">Brand Logo &amp; Palette</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Light Mode Logo URL</label>
                <input
                  type="text"
                  value={data.brand?.logoLightUrl || ''}
                  placeholder="https://res.cloudinary.com/..."
                  onChange={(e) =>
                    setData({ ...data, brand: { ...data.brand, logoLightUrl: e.target.value } })
                  }
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Dark Mode Logo URL</label>
                <input
                  type="text"
                  value={data.brand?.logoDarkUrl || ''}
                  placeholder="https://res.cloudinary.com/..."
                  onChange={(e) =>
                    setData({ ...data, brand: { ...data.brand, logoDarkUrl: e.target.value } })
                  }
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Favicon URL</label>
                <input
                  type="text"
                  value={data.brand?.faviconUrl || ''}
                  placeholder="/favicon.ico or https://..."
                  onChange={(e) =>
                    setData({ ...data, brand: { ...data.brand, faviconUrl: e.target.value } })
                  }
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Accent Hex Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={data.brand?.accentColor || '#0D9488'}
                    onChange={(e) =>
                      setData({ ...data, brand: { ...data.brand, accentColor: e.target.value } })
                    }
                    className="w-10 h-10 rounded-lg cursor-pointer border border-border/70 p-0.5 bg-transparent"
                  />
                  <input
                    type="text"
                    value={data.brand?.accentColor || '#0D9488'}
                    onChange={(e) =>
                      setData({ ...data, brand: { ...data.brand, accentColor: e.target.value } })
                    }
                    className={inputCls}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Contact */}
        {activeTab === 'contact' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-foreground">Global Physical &amp; Inquiries Contact Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className={labelCls}>Headquarters Street Address</label>
                <input
                  type="text"
                  value={data.contact?.officeAddress || ''}
                  onChange={(e) =>
                    setData({ ...data, contact: { ...data.contact, officeAddress: e.target.value } })
                  }
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>City, State &amp; Postal Code</label>
                <input
                  type="text"
                  value={data.contact?.cityStateZip || ''}
                  onChange={(e) =>
                    setData({ ...data, contact: { ...data.contact, cityStateZip: e.target.value } })
                  }
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Operating / Business Hours</label>
                <input
                  type="text"
                  value={data.contact?.businessHours || ''}
                  placeholder="Mon - Sat: 9:00 AM - 6:30 PM IST"
                  onChange={(e) =>
                    setData({ ...data, contact: { ...data.contact, businessHours: e.target.value } })
                  }
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Inquiries &amp; Sales Email</label>
                <input
                  type="text"
                  value={data.contact?.salesEmail || ''}
                  onChange={(e) =>
                    setData({ ...data, contact: { ...data.contact, salesEmail: e.target.value } })
                  }
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Primary Telephone</label>
                <input
                  type="text"
                  value={data.contact?.primaryPhone || ''}
                  onChange={(e) =>
                    setData({ ...data, contact: { ...data.contact, primaryPhone: e.target.value } })
                  }
                  className={inputCls}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab: Social */}
        {activeTab === 'social' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-foreground">Official Corporate Social Profiles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>LinkedIn URL</label>
                <input
                  type="text"
                  value={data.social?.linkedin || ''}
                  placeholder="https://linkedin.com/company/veenero"
                  onChange={(e) =>
                    setData({ ...data, social: { ...data.social, linkedin: e.target.value } })
                  }
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Twitter / X Profile</label>
                <input
                  type="text"
                  value={data.social?.twitter || ''}
                  placeholder="https://x.com/veenero"
                  onChange={(e) =>
                    setData({ ...data, social: { ...data.social, twitter: e.target.value } })
                  }
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Instagram URL</label>
                <input
                  type="text"
                  value={data.social?.instagram || ''}
                  placeholder="https://instagram.com/veenero"
                  onChange={(e) =>
                    setData({ ...data, social: { ...data.social, instagram: e.target.value } })
                  }
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>YouTube Channel</label>
                <input
                  type="text"
                  value={data.social?.youtube || ''}
                  placeholder="https://youtube.com/@veenero"
                  onChange={(e) =>
                    setData({ ...data, social: { ...data.social, youtube: e.target.value } })
                  }
                  className={inputCls}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab: Behavior */}
        {activeTab === 'behavior' && (
          <div className="space-y-5">
            <h3 className="text-sm font-bold text-foreground">Interactive Features &amp; Integrations</h3>
            <div className="space-y-4">
              <label className="flex items-start gap-3 p-4 rounded-xl border border-border/70 bg-muted/10 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(data.behavior?.enableChatAssistant)}
                  onChange={(e) =>
                    setData({
                      ...data,
                      behavior: { ...data.behavior, enableChatAssistant: e.target.checked },
                    })
                  }
                  className="mt-1 rounded border-border text-teal-600 focus:ring-teal-500"
                />
                <div>
                  <p className="text-xs font-bold text-foreground">Enable AI Chat Assistant</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Renders the floating Veenero water intelligence assistant on all public pages.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 rounded-xl border border-border/70 bg-muted/10 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(data.behavior?.showCookieNotice)}
                  onChange={(e) =>
                    setData({
                      ...data,
                      behavior: { ...data.behavior, showCookieNotice: e.target.checked },
                    })
                  }
                  className="mt-1 rounded border-border text-teal-600 focus:ring-teal-500"
                />
                <div>
                  <p className="text-xs font-bold text-foreground">Show Privacy &amp; Cookie Consent Banner</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Displays GDPR and enterprise data protection notice to first-time website visitors.
                  </p>
                </div>
              </label>

              <div>
                <label className={labelCls}>Google Analytics 4 Measurement ID</label>
                <input
                  type="text"
                  value={data.behavior?.googleAnalyticsId || ''}
                  placeholder="G-XXXXXXXXXX"
                  onChange={(e) =>
                    setData({
                      ...data,
                      behavior: { ...data.behavior, googleAnalyticsId: e.target.value },
                    })
                  }
                  className={inputCls}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalSettingsCms;
