import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Save,
  CheckCircle,
  XCircle,
  Server,
  Database,
  Cloud,
  Cpu,
  ShieldAlert,
  Bell,
  HardDrive,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  PlatformSettingsData,
  SystemDiagnostics,
  getAdminSettings,
  updateAdminSettings,
} from '@/services/settings.service';

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

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / (24 * 3600));
  const hours = Math.floor((seconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  parts.push(`${minutes}m`);
  return parts.join(' ');
}

export const AdminSettingsCms: React.FC = () => {
  const [settings, setSettings] = useState<PlatformSettingsData | null>(null);
  const [diagnostics, setDiagnostics] = useState<SystemDiagnostics | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getAdminSettings();
      setSettings(res.settings);
      setDiagnostics(res.diagnostics);
    } catch (err: any) {
      showToast(err.message || 'Failed to load system diagnostics', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    try {
      setSaving(true);
      const updated = await updateAdminSettings(settings);
      setSettings(updated);
      showToast('System configuration saved successfully!');
    } catch (err: any) {
      showToast(err.message || 'Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
          <p className="text-xs font-medium text-muted-foreground">Probing server environment &amp; health...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto font-sans space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-700 dark:text-teal-300 text-xs font-mono font-bold mb-2">
            <Sliders className="w-3.5 h-3.5" />
            <span>PLATFORM INFRASTRUCTURE &amp; CONTROLS</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">System Settings</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Monitor infrastructure telemetry, database health, storage connections, maintenance modes, and security rules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={loadData}
            className="text-xs rounded-xl h-9"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Refresh Telemetry
          </Button>

          <Button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs h-9 px-4"
          >
            <Save className="w-4 h-4 mr-1.5" />
            {saving ? 'Saving...' : 'Save Configuration'}
          </Button>
        </div>
      </div>

      {/* System Diagnostics Cards */}
      {diagnostics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Node Runtime */}
          <div className="p-4 rounded-2xl border border-border/70 bg-card shadow-xs flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 flex items-center justify-center shrink-0">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-muted-foreground uppercase">Runtime</p>
              <p className="text-sm font-bold text-foreground">Node {diagnostics.nodeVersion}</p>
              <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
                Uptime: {formatUptime(diagnostics.uptimeSeconds)}
              </p>
            </div>
          </div>

          {/* MongoDB */}
          <div className="p-4 rounded-2xl border border-border/70 bg-card shadow-xs flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center shrink-0">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-muted-foreground uppercase">Database</p>
              <p className="text-sm font-bold text-emerald-600">
                {diagnostics.database.status}
              </p>
              <p className="text-[10px] font-mono text-muted-foreground mt-0.5 truncate max-w-[150px]">
                DB: {diagnostics.database.name || 'Veenero'}
              </p>
            </div>
          </div>

          {/* Cloudinary */}
          <div className="p-4 rounded-2xl border border-border/70 bg-card shadow-xs flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-600 flex items-center justify-center shrink-0">
              <Cloud className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-muted-foreground uppercase">Media CDN</p>
              <p className="text-sm font-bold text-foreground truncate">
                {diagnostics.storage.cloudName}
              </p>
              <p className="text-[10px] font-mono text-emerald-600 mt-0.5">
                {diagnostics.storage.configured ? 'Active' : 'Unconfigured'}
              </p>
            </div>
          </div>

          {/* Server Memory */}
          <div className="p-4 rounded-2xl border border-border/70 bg-card shadow-xs flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 flex items-center justify-center shrink-0">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-muted-foreground uppercase">Heap Usage</p>
              <p className="text-sm font-bold text-foreground">
                {diagnostics.memory.heapUsedMb} MB / {diagnostics.memory.heapTotalMb} MB
              </p>
              <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
                Env: {diagnostics.environment}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Maintenance Mode & Operations */}
        <div className="p-6 rounded-2xl border border-border/70 bg-card shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-border/50">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-foreground">Maintenance &amp; Traffic Gate</h3>
          </div>

          <label className="flex items-start gap-3 p-3.5 rounded-xl border border-border/70 bg-muted/10 cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(settings.maintenanceMode?.enabled)}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  maintenanceMode: {
                    ...settings.maintenanceMode,
                    enabled: e.target.checked,
                  },
                })
              }
              className="mt-1 rounded border-border text-amber-600 focus:ring-amber-500"
            />
            <div>
              <p className="text-xs font-bold text-foreground">Enable Platform Maintenance Mode</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Shows a scheduled maintenance message on public pages while keeping the admin panel fully operational.
              </p>
            </div>
          </label>

          <div>
            <label className={labelCls}>Public Maintenance Notice</label>
            <textarea
              rows={3}
              value={settings.maintenanceMode?.message || ''}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  maintenanceMode: {
                    ...settings.maintenanceMode,
                    message: e.target.value,
                  },
                })
              }
              className="w-full px-3.5 py-2.5 text-xs bg-background border border-border/70 rounded-xl focus:outline-none focus:border-teal-500 font-medium text-foreground transition-all duration-200 resize-y"
            />
          </div>

          {/* Form Gateway Toggles */}
          <div className="pt-2 space-y-3">
            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(settings.system?.enableContactForm)}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    system: {
                      ...settings.system,
                      enableContactForm: e.target.checked,
                    },
                  })
                }
                className="rounded border-border text-teal-600 focus:ring-teal-500"
              />
              <span>Accept Public Inquiries &amp; Pilot Requests</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(settings.system?.enableJobApplications)}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    system: {
                      ...settings.system,
                      enableJobApplications: e.target.checked,
                    },
                  })
                }
                className="rounded border-border text-teal-600 focus:ring-teal-500"
              />
              <span>Accept Public Job Applications &amp; Resumes</span>
            </label>
          </div>
        </div>

        {/* Security & Notification Alerts */}
        <div className="p-6 rounded-2xl border border-border/70 bg-card shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-border/50">
            <Bell className="w-4 h-4 text-teal-600" />
            <h3 className="text-sm font-bold text-foreground">Alerts &amp; Security Controls</h3>
          </div>

          <div>
            <label className={labelCls}>Platform Alert Dispatch Email</label>
            <input
              type="email"
              value={settings.notifications?.adminAlertEmail || ''}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  notifications: {
                    ...settings.notifications,
                    adminAlertEmail: e.target.value,
                  },
                })
              }
              placeholder="admin@veenero.com"
              className={inputCls}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Admin Session Timeout</label>
              <div className="relative">
                <input
                  type="number"
                  value={settings.security?.sessionTimeoutMinutes || 480}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      security: {
                        ...settings.security,
                        sessionTimeoutMinutes: Number(e.target.value),
                      },
                    })
                  }
                  className={inputCls}
                />
                <span className="text-[11px] text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 font-mono">
                  mins
                </span>
              </div>
            </div>

            <div>
              <label className={labelCls}>Max Upload Size</label>
              <div className="relative">
                <input
                  type="number"
                  value={settings.system?.maxUploadSizeMb || 10}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      system: {
                        ...settings.system,
                        maxUploadSizeMb: Number(e.target.value),
                      },
                    })
                  }
                  className={inputCls}
                />
                <span className="text-[11px] text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 font-mono">
                  MB
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 space-y-3">
            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(settings.notifications?.emailOnNewLead)}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    notifications: {
                      ...settings.notifications,
                      emailOnNewLead: e.target.checked,
                    },
                  })
                }
                className="rounded border-border text-teal-600 focus:ring-teal-500"
              />
              <span>Send instant notification email on new Contact Lead</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(settings.notifications?.emailOnNewJobApp)}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    notifications: {
                      ...settings.notifications,
                      emailOnNewJobApp: e.target.checked,
                    },
                  })
                }
                className="rounded border-border text-teal-600 focus:ring-teal-500"
              />
              <span>Send notification email on new Job Application</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsCms;
