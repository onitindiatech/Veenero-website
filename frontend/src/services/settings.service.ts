import { API_BASE_URL } from '@/config/api';

export interface SystemDiagnostics {
  serverTime: string;
  uptimeSeconds: number;
  nodeVersion: string;
  platform: string;
  arch: string;
  environment: string;
  memory: {
    rssMb: number;
    heapUsedMb: number;
    heapTotalMb: number;
  };
  database: {
    status: 'CONNECTED' | 'DISCONNECTED';
    name?: string;
    host?: string;
  };
  storage: {
    provider: string;
    cloudName: string;
    configured: boolean;
  };
}

export interface PlatformSettingsData {
  maintenanceMode: {
    enabled: boolean;
    message: string;
  };
  security: {
    sessionTimeoutMinutes: number;
    maxLoginAttempts: number;
  };
  notifications: {
    adminAlertEmail: string;
    emailOnNewLead: boolean;
    emailOnNewJobApp: boolean;
  };
  system: {
    enableContactForm: boolean;
    enableJobApplications: boolean;
    maxUploadSizeMb: number;
  };
  updatedAt?: string;
}

export interface SettingsResponse {
  settings: PlatformSettingsData;
  diagnostics: SystemDiagnostics;
}

const API_BASE = `${API_BASE_URL}/api`;

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getAdminSettings(): Promise<SettingsResponse> {
  const res = await fetch(`${API_BASE}/admin/settings`, {
    headers: { ...getAuthHeader() },
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error(`Failed to load system settings: ${res.status}`);
  }
  const json = await res.json();
  return json.data;
}

export async function updateAdminSettings(data: Partial<PlatformSettingsData>): Promise<PlatformSettingsData> {
  const res = await fetch(`${API_BASE}/admin/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to update system settings: ${res.status}`);
  }
  const json = await res.json();
  return json.data;
}
