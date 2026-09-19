import { API_BASE_URL } from '@/config/api';

export interface GlobalSettingsData {
  general: {
    siteName: string;
    tagline: string;
    siteUrl: string;
    supportEmail: string;
    supportPhone: string;
  };
  brand: {
    logoLightUrl?: string;
    logoDarkUrl?: string;
    faviconUrl?: string;
    accentColor?: string;
  };
  contact: {
    officeAddress: string;
    cityStateZip: string;
    primaryPhone: string;
    salesEmail: string;
    supportEmail: string;
    businessHours: string;
  };
  social: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
    github?: string;
  };
  behavior: {
    enableChatAssistant: boolean;
    showCookieNotice: boolean;
    cookieNoticeText?: string;
    googleAnalyticsId?: string;
  };
  updatedAt?: string;
}

const API_BASE = `${API_BASE_URL}/api`;

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getPublicGlobalSettings(): Promise<GlobalSettingsData> {
  const res = await fetch(`${API_BASE}/global-settings`);
  if (!res.ok) {
    throw new Error(`Failed to load global settings: ${res.status}`);
  }
  const json = await res.json();
  return json.data;
}

export async function getAdminGlobalSettings(): Promise<GlobalSettingsData> {
  const res = await fetch(`${API_BASE}/admin/global-settings`, {
    headers: { ...getAuthHeader() },
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error(`Failed to load admin global settings: ${res.status}`);
  }
  const json = await res.json();
  return json.data;
}

export async function updateAdminGlobalSettings(data: Partial<GlobalSettingsData>): Promise<GlobalSettingsData> {
  const res = await fetch(`${API_BASE}/admin/global-settings`, {
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
    throw new Error(err.message || `Failed to update global settings: ${res.status}`);
  }
  const json = await res.json();
  return json.data;
}
