import { API_BASE_URL } from '@/config/api';

export interface SocialLinkItem {
  _id?: string;
  name: string;
  url: string;
  platform: string;
  icon?: string;
  iconSource?: 'platform' | 'favicon' | 'custom';
  enabled: boolean;
  order: number;
  openInNewTab: boolean;
  createdAt?: string;
  updatedAt?: string;
}

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
  socialLinks?: SocialLinkItem[];
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

export async function getPublicSocialLinks(): Promise<SocialLinkItem[]> {
  const res = await fetch(`${API_BASE}/global-settings/social-links`);
  if (!res.ok) {
    throw new Error(`Failed to load public social links: ${res.status}`);
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

// ── Admin Social Links CRUD Operations ─────────────────────────────────────────

export async function getAdminSocialLinks(): Promise<SocialLinkItem[]> {
  const res = await fetch(`${API_BASE}/admin/global-settings/social-links`, {
    headers: { ...getAuthHeader() },
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error(`Failed to load social links: ${res.status}`);
  }
  const json = await res.json();
  return json.data;
}

export async function createAdminSocialLink(data: Partial<SocialLinkItem>): Promise<SocialLinkItem> {
  const res = await fetch(`${API_BASE}/admin/global-settings/social-links`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to create social link: ${res.status}`);
  }
  const json = await res.json();
  return json.data;
}

export async function updateAdminSocialLink(id: string, data: Partial<SocialLinkItem>): Promise<SocialLinkItem> {
  const res = await fetch(`${API_BASE}/admin/global-settings/social-links/${id}`, {
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
    throw new Error(err.message || `Failed to update social link: ${res.status}`);
  }
  const json = await res.json();
  return json.data;
}

export async function deleteAdminSocialLink(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/global-settings/social-links/${id}`, {
    method: 'DELETE',
    headers: { ...getAuthHeader() },
    credentials: 'include',
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to delete social link: ${res.status}`);
  }
}

export async function reorderAdminSocialLinks(orderedIds: string[]): Promise<SocialLinkItem[]> {
  const res = await fetch(`${API_BASE}/admin/global-settings/social-links/reorder`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    credentials: 'include',
    body: JSON.stringify({ orderedIds }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to reorder social links: ${res.status}`);
  }
  const json = await res.json();
  return json.data;
}

export async function toggleAdminSocialLink(id: string, enabled?: boolean): Promise<SocialLinkItem> {
  const res = await fetch(`${API_BASE}/admin/global-settings/social-links/${id}/toggle`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    credentials: 'include',
    body: JSON.stringify({ enabled }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to toggle social link: ${res.status}`);
  }
  const json = await res.json();
  return json.data;
}
