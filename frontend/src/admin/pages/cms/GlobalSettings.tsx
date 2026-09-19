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
  Plus,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Power,
  Sparkles,
  HelpCircle,
  Eye,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  GlobalSettingsData,
  SocialLinkItem,
  getAdminGlobalSettings,
  updateAdminGlobalSettings,
  createAdminSocialLink,
  updateAdminSocialLink,
  deleteAdminSocialLink,
  reorderAdminSocialLinks,
  toggleAdminSocialLink,
} from '@/services/globalSettings.service';
import { SocialPlatformIcon, detectPlatform } from '@/components/SocialPlatformIcon';

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
  const [activeTab, setActiveTab] = useState<'general' | 'brand' | 'contact' | 'social' | 'behavior'>('social');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Modal states for Social Links CRUD
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [currentEditId, setCurrentEditId] = useState<string | null>(null);
  const [modalSaving, setModalSaving] = useState(false);

  // Modal Form State
  const [formName, setFormName] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formPlatform, setFormPlatform] = useState('auto');
  const [formCustomIcon, setFormCustomIcon] = useState('');
  const [formEnabled, setFormEnabled] = useState(true);
  const [formOpenInNewTab, setFormOpenInNewTab] = useState(true);
  const [formOrder, setFormOrder] = useState(0);
  const [showIconOverride, setShowIconOverride] = useState(false);

  // Delete Confirmation Modal State
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<SocialLinkItem | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

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

  // Open Modal for Create
  const handleOpenAddModal = () => {
    setModalMode('add');
    setCurrentEditId(null);
    setFormName('');
    setFormUrl('');
    setFormPlatform('auto');
    setFormCustomIcon('');
    setFormEnabled(true);
    setFormOpenInNewTab(true);
    setFormOrder((data?.socialLinks || []).length);
    setShowIconOverride(false);
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEditModal = (link: SocialLinkItem) => {
    setModalMode('edit');
    setCurrentEditId(link._id || null);
    setFormName(link.name);
    setFormUrl(link.url);
    setFormPlatform(link.platform || 'auto');
    setFormCustomIcon(link.icon || '');
    setFormEnabled(link.enabled);
    setFormOpenInNewTab(link.openInNewTab);
    setFormOrder(link.order ?? 0);
    setShowIconOverride(Boolean(link.icon && link.iconSource === 'custom'));
    setIsModalOpen(true);
  };

  // Compute live auto-detection
  const detected = detectPlatform(formUrl, formName);
  const resolvedPlatform = formPlatform === 'auto' ? detected.platform : formPlatform;
  const resolvedIcon =
    formCustomIcon.trim() ||
    (formPlatform === 'auto' ? detected.icon : formPlatform);
  const resolvedIconSource = formCustomIcon.trim()
    ? ('custom' as const)
    : formPlatform === 'auto'
    ? detected.iconSource
    : ('platform' as const);

  // Submit Modal Form (Add or Edit)
  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      showToast('Please enter a display name for this link.', 'error');
      return;
    }
    if (!formUrl.trim()) {
      showToast('Please enter a destination URL.', 'error');
      return;
    }

    try {
      setModalSaving(true);
      const payload: Partial<SocialLinkItem> = {
        name: formName.trim(),
        url: formUrl.trim(),
        platform: resolvedPlatform,
        icon: resolvedIcon,
        iconSource: resolvedIconSource,
        enabled: formEnabled,
        order: Number(formOrder),
        openInNewTab: formOpenInNewTab,
      };

      if (modalMode === 'add') {
        const created = await createAdminSocialLink(payload);
        const updatedList = [...(data?.socialLinks || []), created].sort((a, b) => a.order - b.order);
        setData(prev => (prev ? { ...prev, socialLinks: updatedList } : prev));
        showToast(`Social link "${created.name}" created successfully!`);
      } else if (modalMode === 'edit' && currentEditId) {
        const updated = await updateAdminSocialLink(currentEditId, payload);
        const updatedList = (data?.socialLinks || [])
          .map((item) => (item._id === currentEditId ? updated : item))
          .sort((a, b) => a.order - b.order);
        setData(prev => (prev ? { ...prev, socialLinks: updatedList } : prev));
        showToast(`Social link "${updated.name}" updated successfully!`);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Failed to save social link', 'error');
    } finally {
      setModalSaving(false);
    }
  };

  // Quick Toggle Enabled
  const handleToggleEnabled = async (link: SocialLinkItem) => {
    if (!link._id) return;
    try {
      const updated = await toggleAdminSocialLink(link._id, !link.enabled);
      setData(prev => {
        if (!prev) return prev;
        const updatedLinks = (prev.socialLinks || []).map(item =>
          item._id === link._id ? updated : item
        );
        return { ...prev, socialLinks: updatedLinks };
      });
      showToast(`Link "${link.name}" ${updated.enabled ? 'enabled' : 'disabled'}.`);
    } catch (err: any) {
      showToast(err.message || 'Failed to toggle status', 'error');
    }
  };

  // Reordering (Move Up / Down)
  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const list = [...(data?.socialLinks || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    // Swap items
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    // Update orders
    const orderedIds = list.map(item => item._id!).filter(Boolean);
    list.forEach((item, idx) => {
      item.order = idx;
    });

    setData(prev => (prev ? { ...prev, socialLinks: list } : prev));

    try {
      await reorderAdminSocialLinks(orderedIds);
      showToast('Links reordered successfully.');
    } catch (err: any) {
      showToast(err.message || 'Failed to reorder links', 'error');
      loadSettings(); // revert on error
    }
  };

  // Confirm Delete
  const handleDeleteConfirm = async () => {
    if (!deleteConfirmItem?._id) return;
    try {
      setDeleteLoading(true);
      await deleteAdminSocialLink(deleteConfirmItem._id);
      setData(prev => {
        if (!prev) return prev;
        const filtered = (prev.socialLinks || []).filter(item => item._id !== deleteConfirmItem._id);
        return { ...prev, socialLinks: filtered };
      });
      showToast(`Link "${deleteConfirmItem.name}" deleted from footer.`);
      setDeleteConfirmItem(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to delete social link', 'error');
    } finally {
      setDeleteLoading(false);
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

  const socialLinksList = [...(data.socialLinks || [])].sort((a, b) => a.order - b.order);

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
            Configure site metadata, brand identity, contact channels, footer social links, and platform behavior.
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
          { key: 'social', label: 'Social & Contact Links', icon: Share2 },
          { key: 'general', label: 'General Info', icon: Building },
          { key: 'brand', label: 'Brand & Identity', icon: Palette },
          { key: 'contact', label: 'Contact Details', icon: Phone },
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
              {tab.key === 'social' && socialLinksList.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-white/20 text-[10px] font-mono">
                  {socialLinksList.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="bg-card rounded-2xl border border-border/70 p-6 shadow-xs space-y-6">
        {/* Tab: Social & Contact Links (CRUD CMS) */}
        {activeTab === 'social' && (
          <div className="space-y-6">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/60">
              <div>
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <span>Social &amp; Contact Links</span>
                  <span className="text-[11px] font-normal text-teal-600 dark:text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">
                    Live CMS
                  </span>
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Manage links rendered in the public footer&apos;s &quot;CONNECT WITH US&quot; section. Changes are reflected live on the public website.
                </p>
              </div>

              <Button
                type="button"
                onClick={handleOpenAddModal}
                className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl h-9 px-3.5 shadow-xs shrink-0"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                + Add Social / Contact Link
              </Button>
            </div>

            {/* Live Footer Preview Box */}
            <div className="p-4 rounded-xl bg-[#030c14] border border-teal-500/30 text-white shadow-inner">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-teal-400 flex items-center gap-1.5">
                  <Eye className="w-3 h-3" />
                  Live Footer Visual Preview
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {socialLinksList.filter((l) => l.enabled).length} Enabled Links
                </span>
              </div>
              <div className="flex items-center gap-2.5 flex-wrap pt-1">
                {socialLinksList.filter((l) => l.enabled).length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-2">
                    No enabled links. Enable or add a link below to display it in the footer.
                  </p>
                ) : (
                  socialLinksList
                    .filter((l) => l.enabled)
                    .map((item) => (
                      <div
                        key={item._id || item.name}
                        title={`${item.name} (${item.url})`}
                        className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.1] text-slate-200 flex items-center justify-center hover:border-teal-400/50 hover:bg-teal-500/20 transition-all cursor-default"
                      >
                        <SocialPlatformIcon
                          platform={item.platform}
                          icon={item.icon}
                          iconSource={item.iconSource}
                          url={item.url}
                          className="w-4 h-4 text-slate-200"
                        />
                      </div>
                    ))
                )}
              </div>
            </div>

            {/* Links Table */}
            <div className="overflow-x-auto rounded-xl border border-border/70">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-muted/40 border-b border-border/70 text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-3.5 w-14 text-center">Icon</th>
                    <th className="py-3 px-3.5">Name</th>
                    <th className="py-3 px-3.5">Platform</th>
                    <th className="py-3 px-3.5">Destination URL</th>
                    <th className="py-3 px-3.5 text-center w-28">Status</th>
                    <th className="py-3 px-3.5 text-center w-24">Order</th>
                    <th className="py-3 px-3.5 text-right w-36">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 bg-card">
                  {socialLinksList.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-muted-foreground">
                        <Share2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p className="font-semibold text-xs text-foreground">No social or contact links found</p>
                        <p className="text-[11px] mt-1">Click &quot;+ Add Social / Contact Link&quot; above to create your first link.</p>
                      </td>
                    </tr>
                  ) : (
                    socialLinksList.map((link, index) => {
                      return (
                        <tr
                          key={link._id || index}
                          className="hover:bg-muted/20 transition-colors group"
                        >
                          {/* Icon Preview */}
                          <td className="py-2.5 px-3.5 text-center">
                            <div className="w-8 h-8 mx-auto rounded-lg bg-[#030c14] border border-white/10 text-slate-200 flex items-center justify-center shadow-xs">
                              <SocialPlatformIcon
                                platform={link.platform}
                                icon={link.icon}
                                iconSource={link.iconSource}
                                url={link.url}
                                className="w-3.5 h-3.5"
                              />
                            </div>
                          </td>

                          {/* Name */}
                          <td className="py-2.5 px-3.5 font-bold text-foreground">
                            {link.name}
                          </td>

                          {/* Platform Badge */}
                          <td className="py-2.5 px-3.5">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-muted text-muted-foreground border border-border/70 capitalize">
                              {link.platform || 'custom'}
                            </span>
                          </td>

                          {/* URL */}
                          <td className="py-2.5 px-3.5 max-w-xs truncate font-mono text-[11px] text-muted-foreground">
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-teal-600 hover:underline inline-flex items-center gap-1"
                            >
                              <span>{link.url}</span>
                              <ExternalLink className="w-2.5 h-2.5 opacity-60 shrink-0" />
                            </a>
                          </td>

                          {/* Status Toggle */}
                          <td className="py-2.5 px-3.5 text-center">
                            <button
                              type="button"
                              onClick={() => handleToggleEnabled(link)}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                                link.enabled
                                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                                  : 'bg-muted text-muted-foreground border border-border/60 hover:bg-muted/70'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  link.enabled ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]' : 'bg-muted-foreground'
                                }`}
                              />
                              <span>{link.enabled ? 'Enabled' : 'Disabled'}</span>
                            </button>
                          </td>

                          {/* Order & Reorder Controls */}
                          <td className="py-2.5 px-3.5 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <span className="font-mono text-xs font-bold text-muted-foreground w-4 text-center">
                                {link.order ?? index}
                              </span>
                              <div className="flex flex-col">
                                <button
                                  type="button"
                                  disabled={index === 0}
                                  onClick={() => handleMoveOrder(index, 'up')}
                                  title="Move Up"
                                  className="p-0.5 text-muted-foreground hover:text-teal-600 disabled:opacity-20 disabled:hover:text-muted-foreground"
                                >
                                  <ArrowUp className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  disabled={index === socialLinksList.length - 1}
                                  onClick={() => handleMoveOrder(index, 'down')}
                                  title="Move Down"
                                  className="p-0.5 text-muted-foreground hover:text-teal-600 disabled:opacity-20 disabled:hover:text-muted-foreground"
                                >
                                  <ArrowDown className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="py-2.5 px-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() => handleOpenEditModal(link)}
                                className="h-7 px-2 text-xs font-medium text-muted-foreground hover:text-foreground"
                              >
                                <Edit2 className="w-3.5 h-3.5 mr-1" />
                                Edit
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() => setDeleteConfirmItem(link)}
                                className="h-7 px-2 text-xs font-medium text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                              >
                                <Trash2 className="w-3.5 h-3.5 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

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

      {/* ADD / EDIT SOCIAL LINK MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-card w-full max-w-lg rounded-2xl border border-border/70 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div>
                <h3 className="text-base font-bold text-foreground">
                  {modalMode === 'add' ? 'Add Social / Contact Link' : 'Edit Social / Contact Link'}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Enter link details. The platform icon and favicon are auto-detected in real time.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm font-bold px-2 py-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-4">
              {/* LIVE ICON & PLATFORM PREVIEW CARD */}
              <div className="p-3.5 rounded-xl bg-[#030c14] border border-teal-500/30 text-white flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/10 text-slate-200 flex items-center justify-center shadow-md shrink-0">
                  <SocialPlatformIcon
                    platform={resolvedPlatform}
                    icon={resolvedIcon}
                    iconSource={resolvedIconSource}
                    url={formUrl}
                    className="w-6 h-6 text-slate-200"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-100 truncate">
                      {formName.trim() || 'Link Name'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-teal-500/20 text-teal-300 border border-teal-500/30 capitalize">
                      {resolvedPlatform}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-slate-400 truncate mt-0.5">
                    {formUrl.trim() || 'https://...'}
                  </p>
                  <p className="text-[10px] text-teal-400/80 font-mono mt-0.5 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-teal-400" />
                    <span>
                      Detected Platform: <strong className="text-white capitalize">{resolvedPlatform}</strong> ({resolvedIconSource})
                    </span>
                  </p>
                </div>
              </div>

              {/* Name & URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>
                    Display Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. LinkedIn, WhatsApp, Notion"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className={labelCls}>
                    Platform Override
                  </label>
                  <select
                    value={formPlatform}
                    onChange={(e) => setFormPlatform(e.target.value)}
                    className={inputCls}
                  >
                    <option value="auto">⚡ Auto-Detect ({detected.displayName})</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="github">GitHub</option>
                    <option value="x">Twitter / X</option>
                    <option value="email">Email / Mailto</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="instagram">Instagram</option>
                    <option value="facebook">Facebook</option>
                    <option value="youtube">YouTube</option>
                    <option value="telegram">Telegram</option>
                    <option value="discord">Discord</option>
                    <option value="notion">Notion</option>
                    <option value="slack">Slack</option>
                    <option value="reddit">Reddit</option>
                    <option value="medium">Medium</option>
                    <option value="website">Custom Website</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className={labelCls}>
                    Destination URL or Protocol <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="https://..., mailto:info@..., or https://wa.me/..."
                    value={formUrl}
                    onChange={(e) => setFormUrl(e.target.value)}
                    className={inputCls}
                  />
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Supports https, http, mailto: (email), and WhatsApp (wa.me) URLs.
                  </p>
                </div>
              </div>

              {/* Optional Icon Override */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowIconOverride(!showIconOverride)}
                  className="text-[11px] text-teal-600 dark:text-teal-400 hover:underline font-bold flex items-center gap-1"
                >
                  <span>{showIconOverride ? '– Hide Custom Icon Override' : '+ Override Icon / Custom Favicon URL'}</span>
                </button>

                {showIconOverride && (
                  <div className="mt-2 p-3 rounded-xl border border-border/70 bg-muted/20 space-y-2">
                    <label className={labelCls}>Custom Icon or Favicon Image URL</label>
                    <input
                      type="text"
                      placeholder="https://example.com/icon.png or custom icon key"
                      value={formCustomIcon}
                      onChange={(e) => setFormCustomIcon(e.target.value)}
                      className={inputCls}
                    />
                    <p className="text-[10px] text-muted-foreground">
                      Leave blank to use automatic platform vector or favicon resolution.
                    </p>
                  </div>
                )}
              </div>

              {/* Toggles: Enabled, OpenInNewTab, Order */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-border/70 bg-muted/10 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formEnabled}
                    onChange={(e) => setFormEnabled(e.target.checked)}
                    className="rounded border-border text-teal-600 focus:ring-teal-500"
                  />
                  <span className="text-xs font-bold text-foreground">Enabled</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-border/70 bg-muted/10 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formOpenInNewTab}
                    onChange={(e) => setFormOpenInNewTab(e.target.checked)}
                    className="rounded border-border text-teal-600 focus:ring-teal-500"
                  />
                  <span className="text-xs font-bold text-foreground">New Tab</span>
                </label>

                <div>
                  <input
                    type="number"
                    value={formOrder}
                    onChange={(e) => setFormOrder(Number(e.target.value))}
                    className={inputCls}
                    placeholder="Order (0, 1, 2...)"
                  />
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/60">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="text-xs font-bold rounded-xl h-9"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={modalSaving}
                  className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl h-9 px-4 shadow-xs"
                >
                  {modalSaving ? 'Saving Link...' : modalMode === 'add' ? 'Add Social Link' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-card w-full max-w-sm rounded-2xl border border-rose-500/30 shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <div className="p-2 rounded-xl bg-rose-500/10">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">Delete Social Link</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to delete <strong className="text-foreground">&quot;{deleteConfirmItem.name}&quot;</strong>?
              It will be immediately removed from the public website footer upon confirmation.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDeleteConfirmItem(null)}
                disabled={deleteLoading}
                className="text-xs font-bold rounded-xl h-9"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl h-9 px-4 shadow-xs"
              >
                {deleteLoading ? 'Deleting...' : 'Yes, Delete Link'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalSettingsCms;
