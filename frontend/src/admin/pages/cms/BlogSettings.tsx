import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, GripVertical, CheckCircle, XCircle, Save } from 'lucide-react';
import { BlogSettings, InsightStat } from '@/components/blog/types';
import * as BlogService from '@/services/blog.service';

// ─── Toast ────────────────────────────────────────────────────────────────────
const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => (
  <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border text-sm font-semibold max-w-xs ${
    type === 'success'
      ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-300'
      : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-300'
  }`}>
    {type === 'success' ? <CheckCircle className="h-4 w-4 shrink-0" /> : <XCircle className="h-4 w-4 shrink-0" />}
    <span className="flex-1">{message}</span>
    <button onClick={onClose}>✕</button>
  </div>
);

// ─── Section wrapper ──────────────────────────────────────────────────────────
const Section = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <div className="bg-card border border-border/40 rounded-2xl overflow-hidden shadow-sm">
    <div className="px-6 py-4 border-b border-border/40 bg-muted/10">
      <h2 className="font-bold text-foreground text-sm">{title}</h2>
      {subtitle && <p className="text-[11px] text-muted-foreground mt-0.5">{subtitle}</p>}
    </div>
    <div className="p-6 space-y-4">{children}</div>
  </div>
);

const labelCls = 'block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5';
const inputCls = 'w-full px-3 py-2.5 text-xs bg-background border border-border/60 rounded-xl focus:outline-none focus:border-teal-500/60 font-medium text-foreground';

const EMPTY_SETTINGS: BlogSettings = {
  hero: { eyebrow: 'VEENERO INSIGHTS', title: '', description: '', image: '', imageAlt: '' },
  featuredSection: { eyebrow: 'COVER STORY', title: 'Featured Insight', description: '' },
  insightStats: [],
  editorialQuote: { eyebrow: 'OUR MISSION', title: '', description: '' },
  cta: { eyebrow: 'CONTRIBUTE', title: '', description: '', buttonText: 'Explore Veenero', buttonLink: '/#contact' },
  seo: { metaTitle: '', metaDescription: '', ogImage: '', noIndex: false },
  isPublished: true,
};

const BlogSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<BlogSettings>(EMPTY_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    const load = async () => {
      try {
        const data = await BlogService.getAdminSettings();
        if (data) setSettings(data);
      } catch {
        showToast('Failed to load settings.', 'error');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ─── Field helpers ─────────────────────────────────────────────────────────
  const setHero = (field: keyof BlogSettings['hero'], value: string) =>
    setSettings((s) => ({ ...s, hero: { ...s.hero, [field]: value } }));

  const setFeaturedSection = (field: keyof BlogSettings['featuredSection'], value: string) =>
    setSettings((s) => ({ ...s, featuredSection: { ...s.featuredSection, [field]: value } }));

  const setEditorialQuote = (field: keyof BlogSettings['editorialQuote'], value: string) =>
    setSettings((s) => ({ ...s, editorialQuote: { ...s.editorialQuote, [field]: value } }));

  const setCta = (field: keyof BlogSettings['cta'], value: string) =>
    setSettings((s) => ({ ...s, cta: { ...s.cta, [field]: value } }));

  const setSeo = (field: string, value: string | boolean) =>
    setSettings((s) => ({ ...s, seo: { ...s.seo, [field]: value } }));

  // ─── Stats management ──────────────────────────────────────────────────────
  const addStat = () => {
    setSettings((s) => ({
      ...s,
      insightStats: [...s.insightStats, { value: '', label: '', description: '' }],
    }));
  };

  const updateStat = (index: number, field: keyof InsightStat, value: string) => {
    setSettings((s) => {
      const newStats = [...s.insightStats];
      newStats[index] = { ...newStats[index], [field]: value };
      return { ...s, insightStats: newStats };
    });
  };

  const removeStat = (index: number) => {
    setSettings((s) => ({
      ...s,
      insightStats: s.insightStats.filter((_, i) => i !== index),
    }));
  };

  const moveStat = (index: number, direction: 'up' | 'down') => {
    setSettings((s) => {
      const arr = [...s.insightStats];
      const target = direction === 'up' ? index - 1 : index + 1;
      if (target < 0 || target >= arr.length) return s;
      [arr[index], arr[target]] = [arr[target], arr[index]];
      return { ...s, insightStats: arr };
    });
  };

  // ─── Save ──────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    try {
      await BlogService.updateAdminSettings(settings);
      showToast('Blog landing settings saved successfully.');
    } catch (err) {
      showToast((err as Error).message || 'Failed to save settings.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        <div className="h-8 w-48 bg-muted/40 rounded-xl" />
        <div className="h-40 bg-muted/30 rounded-2xl" />
        <div className="h-40 bg-muted/30 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 font-sans max-w-3xl">

      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link to="/admin/blog" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-2xl font-bold text-foreground">Blog Landing Settings</h1>
          </div>
          <p className="text-xs text-muted-foreground">Control all editable content on the public <code className="text-teal-600">/blog</code> page.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white rounded-xl shadow-sm flex items-center gap-2 transition-colors disabled:opacity-60"
        >
          <Save className="h-3.5 w-3.5" />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <Section title="Hero Section" subtitle="The top section of the blog landing page">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className={labelCls}>Eyebrow Text</label>
            <input value={settings.hero.eyebrow} onChange={(e) => setHero('eyebrow', e.target.value)} className={inputCls} placeholder="VEENERO INSIGHTS" />
          </div>
          <div className="col-span-2">
            <label className={labelCls}>Hero Title</label>
            <input value={settings.hero.title} onChange={(e) => setHero('title', e.target.value)} className={inputCls} placeholder="Water Intelligence & Innovation" />
          </div>
          <div className="col-span-2">
            <label className={labelCls}>Hero Description</label>
            <textarea value={settings.hero.description} onChange={(e) => setHero('description', e.target.value)} className={`${inputCls} resize-none`} rows={2} placeholder="Short description for the hero section..." />
          </div>
          <div className="col-span-2">
            <label className={labelCls}>Hero Image URL</label>
            <input value={settings.hero.image} onChange={(e) => setHero('image', e.target.value)} className={inputCls} placeholder="https://..." />
            {settings.hero.image && (
              <div className="mt-2 h-36 rounded-xl overflow-hidden border border-border/40">
                <img src={settings.hero.image} alt="preview" className="w-full h-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
              </div>
            )}
          </div>
          <div className="col-span-2">
            <label className={labelCls}>Hero Image Alt Text</label>
            <input value={settings.hero.imageAlt} onChange={(e) => setHero('imageAlt', e.target.value)} className={inputCls} placeholder="Describe the image..." />
          </div>
        </div>
      </Section>

      {/* ── FEATURED SECTION ─────────────────────────────────────────────── */}
      <Section title="Featured Section" subtitle="Text above the featured article">
        <div>
          <label className={labelCls}>Eyebrow</label>
          <input value={settings.featuredSection.eyebrow} onChange={(e) => setFeaturedSection('eyebrow', e.target.value)} className={inputCls} placeholder="COVER STORY" />
        </div>
        <div>
          <label className={labelCls}>Heading</label>
          <input value={settings.featuredSection.title} onChange={(e) => setFeaturedSection('title', e.target.value)} className={inputCls} placeholder="Featured Insight" />
        </div>
        <div>
          <label className={labelCls}>Description</label>
          <input value={settings.featuredSection.description} onChange={(e) => setFeaturedSection('description', e.target.value)} className={inputCls} placeholder="Optional subtitle..." />
        </div>
      </Section>

      {/* ── INSIGHT STATS ─────────────────────────────────────────────────── */}
      <Section title="Insight Stats Strip" subtitle="Metrics displayed between the blog card rows">
        <div className="space-y-3">
          {settings.insightStats.map((stat, i) => (
            <div key={i} className="flex gap-3 items-start p-3 bg-muted/10 border border-border/40 rounded-xl">
              <div className="flex flex-col gap-1 mt-1">
                <button onClick={() => moveStat(i, 'up')} disabled={i === 0} className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30">
                  <GripVertical className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="flex-1 grid grid-cols-3 gap-2">
                <div>
                  <label className={labelCls}>Value</label>
                  <input value={stat.value} onChange={(e) => updateStat(i, 'value', e.target.value)} className={inputCls} placeholder="100%" />
                </div>
                <div>
                  <label className={labelCls}>Label</label>
                  <input value={stat.label} onChange={(e) => updateStat(i, 'label', e.target.value)} className={inputCls} placeholder="Water Visibility" />
                </div>
                <div>
                  <label className={labelCls}>Description</label>
                  <input value={stat.description || ''} onChange={(e) => updateStat(i, 'description', e.target.value)} className={inputCls} placeholder="Optional..." />
                </div>
              </div>
              <button onClick={() => removeStat(i)} className="mt-5 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          <button onClick={addStat} className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold border border-dashed border-teal-600/30 text-teal-700 dark:text-teal-400 rounded-xl hover:bg-teal-50 dark:hover:bg-teal-950/20 transition-colors w-full justify-center">
            <Plus className="h-3.5 w-3.5" />
            Add Stat
          </button>
        </div>
      </Section>

      {/* ── EDITORIAL QUOTE ───────────────────────────────────────────────── */}
      <Section title="Editorial Quote" subtitle="Mission statement displayed in the stats strip">
        <div>
          <label className={labelCls}>Eyebrow</label>
          <input value={settings.editorialQuote.eyebrow} onChange={(e) => setEditorialQuote('eyebrow', e.target.value)} className={inputCls} placeholder="OUR MISSION" />
        </div>
        <div>
          <label className={labelCls}>Quote / Heading</label>
          <textarea value={settings.editorialQuote.title} onChange={(e) => setEditorialQuote('title', e.target.value)} className={`${inputCls} resize-none`} rows={2} placeholder="Every drop of water deserves..." />
        </div>
        <div>
          <label className={labelCls}>Supporting Description</label>
          <textarea value={settings.editorialQuote.description} onChange={(e) => setEditorialQuote('description', e.target.value)} className={`${inputCls} resize-none`} rows={2} placeholder="At Veenero, we believe..." />
        </div>
      </Section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <Section title="Call to Action Banner" subtitle="Bottom CTA section on the blog landing page">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Eyebrow</label>
            <input value={settings.cta.eyebrow} onChange={(e) => setCta('eyebrow', e.target.value)} className={inputCls} placeholder="CONTRIBUTE" />
          </div>
          <div>
            <label className={labelCls}>Button Text</label>
            <input value={settings.cta.buttonText} onChange={(e) => setCta('buttonText', e.target.value)} className={inputCls} placeholder="Explore Veenero" />
          </div>
          <div className="col-span-2">
            <label className={labelCls}>Heading</label>
            <input value={settings.cta.title} onChange={(e) => setCta('title', e.target.value)} className={inputCls} placeholder="Have an idea worth sharing?" />
          </div>
          <div className="col-span-2">
            <label className={labelCls}>Description</label>
            <textarea value={settings.cta.description} onChange={(e) => setCta('description', e.target.value)} className={`${inputCls} resize-none`} rows={2} placeholder="We are always looking for perspectives..." />
          </div>
          <div className="col-span-2">
            <label className={labelCls}>Button URL</label>
            <input value={settings.cta.buttonLink} onChange={(e) => setCta('buttonLink', e.target.value)} className={inputCls} placeholder="/#contact" />
          </div>
        </div>
      </Section>

      {/* ── SEO ──────────────────────────────────────────────────────────── */}
      <Section title="SEO Settings" subtitle="Meta data for the blog landing page">
        <div>
          <label className={labelCls}>Meta Title</label>
          <input value={settings.seo?.metaTitle || ''} onChange={(e) => setSeo('metaTitle', e.target.value)} className={inputCls} placeholder="Blog page SEO title" maxLength={80} />
          <p className="text-[10px] text-muted-foreground mt-1 text-right">{(settings.seo?.metaTitle || '').length}/80</p>
        </div>
        <div>
          <label className={labelCls}>Meta Description</label>
          <textarea value={settings.seo?.metaDescription || ''} onChange={(e) => setSeo('metaDescription', e.target.value)} className={`${inputCls} resize-none`} rows={2} maxLength={200} placeholder="Blog page meta description..." />
          <p className="text-[10px] text-muted-foreground mt-1 text-right">{(settings.seo?.metaDescription || '').length}/200</p>
        </div>
        <div>
          <label className={labelCls}>OG Image URL</label>
          <input value={settings.seo?.ogImage || ''} onChange={(e) => setSeo('ogImage', e.target.value)} className={inputCls} placeholder="https://..." />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={settings.seo?.noIndex || false} onChange={(e) => setSeo('noIndex', e.target.checked)} className="h-4 w-4 accent-teal-600 rounded" />
          <span className="text-xs text-foreground">No Index (exclude from search engines)</span>
        </label>
      </Section>

      {/* Bottom Save */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white rounded-xl shadow-sm flex items-center gap-2 transition-colors disabled:opacity-60"
        >
          <Save className="h-3.5 w-3.5" />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

    </div>
  );
};

export default BlogSettingsPage;
