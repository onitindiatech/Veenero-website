import React, { useState, useEffect } from 'react';
import {
  Menu,
  Save,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  CheckCircle,
  XCircle,
  ExternalLink,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  NavItem,
  getAdminNavigation,
  updateAdminNavigation,
  resetDefaultNavigation,
} from '@/services/navigation.service';

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

const inputCls =
  'w-full px-3 py-2 text-xs bg-background border border-border/70 rounded-xl focus:outline-none focus:border-teal-500 font-medium text-foreground transition-all duration-200';

export const NavigationCms: React.FC = () => {
  const [items, setItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadNav = async () => {
    try {
      setLoading(true);
      const data = await getAdminNavigation();
      setItems(data.items || []);
    } catch (err: any) {
      showToast(err.message || 'Failed to load navigation data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNav();
  }, []);

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const copy = [...items];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;

    // re-assign order property
    copy.forEach((item, idx) => {
      item.order = idx + 1;
    });

    setItems(copy);
  };

  const handleAddItem = () => {
    const newItem: NavItem = {
      id: `nav_${Date.now()}`,
      label: 'New Link',
      href: '/new-page',
      isExternal: false,
      order: items.length + 1,
      isActive: true,
      target: '_self',
    };
    setItems([...items, newItem]);
  };

  const handleDeleteItem = (index: number) => {
    const copy = items.filter((_, idx) => idx !== index);
    copy.forEach((item, idx) => {
      item.order = idx + 1;
    });
    setItems(copy);
  };

  const handleUpdateItem = (index: number, patch: Partial<NavItem>) => {
    const copy = [...items];
    copy[index] = { ...copy[index], ...patch };
    setItems(copy);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await updateAdminNavigation(items);
      setItems(res.items);
      showToast('Header navigation saved successfully!');
    } catch (err: any) {
      showToast(err.message || 'Failed to save navigation', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = async () => {
    if (!window.confirm('Reset all header navigation items back to standard platform defaults?')) {
      return;
    }
    try {
      setSaving(true);
      const res = await resetDefaultNavigation();
      setItems(res.items);
      showToast('Reset to platform defaults complete!');
    } catch (err: any) {
      showToast(err.message || 'Failed to reset navigation', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
          <p className="text-xs font-medium text-muted-foreground">Loading Navigation settings...</p>
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
            <Menu className="w-3.5 h-3.5" />
            <span>PRIMARY HEADER CMS</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Website Navigation</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Configure header menu links, ordering, external redirects, highlight badges, and visibility.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            onClick={handleResetDefaults}
            disabled={saving}
            className="text-xs rounded-xl h-9"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Reset Defaults
          </Button>

          <Button
            type="button"
            onClick={handleAddItem}
            variant="outline"
            className="text-xs rounded-xl h-9 border-teal-500/30 text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Add Item
          </Button>

          <Button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs h-9 px-4"
          >
            <Save className="w-4 h-4 mr-1.5" />
            {saving ? 'Saving...' : 'Save Navigation'}
          </Button>
        </div>
      </div>

      {/* Navigation Items List */}
      <div className="bg-card rounded-2xl border border-border/70 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border/50 text-xs text-muted-foreground font-semibold">
          <div className="w-12 text-center">Order</div>
          <div className="flex-1 grid grid-cols-12 gap-3 px-3">
            <span className="col-span-4">Display Label</span>
            <span className="col-span-4">Route / URL</span>
            <span className="col-span-2">Badge (Optional)</span>
            <span className="col-span-2 text-center">External / Target</span>
          </div>
          <div className="w-24 text-right">Actions</div>
        </div>

        {items.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-xs">
            No navigation items configured. Click &quot;Add Item&quot; or &quot;Reset Defaults&quot;.
          </div>
        ) : (
          items.map((item, idx) => (
            <div
              key={item.id || idx}
              className={`p-3.5 rounded-xl border transition-all flex items-center gap-3 ${
                item.isActive
                  ? 'border-border/60 bg-muted/10 hover:border-teal-500/40'
                  : 'border-border/40 bg-muted/5 opacity-60'
              }`}
            >
              {/* Order buttons */}
              <div className="w-12 flex flex-col items-center gap-1">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => handleMove(idx, 'up')}
                  className="p-1 rounded hover:bg-muted disabled:opacity-30 text-muted-foreground"
                  title="Move Up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-mono font-bold text-muted-foreground">
                  {idx + 1}
                </span>
                <button
                  type="button"
                  disabled={idx === items.length - 1}
                  onClick={() => handleMove(idx, 'down')}
                  className="p-1 rounded hover:bg-muted disabled:opacity-30 text-muted-foreground"
                  title="Move Down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Editable Fields */}
              <div className="flex-1 grid grid-cols-12 gap-3 px-3">
                <div className="col-span-4">
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => handleUpdateItem(idx, { label: e.target.value })}
                    placeholder="e.g. Solutions"
                    className={inputCls}
                  />
                </div>

                <div className="col-span-4">
                  <input
                    type="text"
                    value={item.href}
                    onChange={(e) => handleUpdateItem(idx, { href: e.target.value })}
                    placeholder="e.g. /solutions or https://..."
                    className={inputCls}
                  />
                </div>

                <div className="col-span-2">
                  <input
                    type="text"
                    value={item.badge || ''}
                    onChange={(e) => handleUpdateItem(idx, { badge: e.target.value })}
                    placeholder="e.g. NEW"
                    className={inputCls}
                  />
                </div>

                <div className="col-span-2 flex items-center justify-center gap-2">
                  <label className="flex items-center gap-1 text-[11px] text-muted-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(item.isExternal)}
                      onChange={(e) =>
                        handleUpdateItem(idx, {
                          isExternal: e.target.checked,
                          target: e.target.checked ? '_blank' : '_self',
                        })
                      }
                      className="rounded border-border text-teal-600 focus:ring-teal-500"
                    />
                    <ExternalLink className="w-3 h-3" />
                  </label>
                </div>
              </div>

              {/* Action buttons */}
              <div className="w-24 flex items-center justify-end gap-1.5">
                <button
                  type="button"
                  onClick={() => handleUpdateItem(idx, { isActive: !item.isActive })}
                  className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 ${
                    item.isActive
                      ? 'border-emerald-500/30 text-emerald-600 bg-emerald-500/10'
                      : 'border-muted-foreground/30 text-muted-foreground hover:text-foreground'
                  }`}
                  title={item.isActive ? 'Active on public menu' : 'Hidden from public menu'}
                >
                  {item.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteItem(idx)}
                  className="p-1.5 rounded-lg border border-border/60 text-muted-foreground hover:text-rose-500 hover:border-rose-300"
                  title="Delete link"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Info Banner */}
      <div className="p-4 rounded-xl border border-teal-500/20 bg-teal-500/5 text-xs text-teal-900 dark:text-teal-200 flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">Instant Website Synchronization</p>
          <p className="opacity-90 mt-0.5">
            Changes saved here are instantly served by the public navigation API. If the backend is ever temporarily unreachable, the public website automatically falls back to its built-in menu items.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NavigationCms;
