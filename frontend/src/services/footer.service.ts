// ─── Footer CMS Frontend Service ──────────────────────────────────────────

export interface PublicFooterLink {
  label: string;
  href: string;
}

export interface PublicFooterSocial {
  iconName: string;
  href: string;
  label: string;
}

export interface PublicFooterData {
  description: string;
  address: string;
  mobile: string;
  email: string;
  copyrightText: string;
  googleRating: {
    rating: string;
    reviewsCount: string;
    href: string;
  };
  links: {
    solutions: PublicFooterLink[];
    company: PublicFooterLink[];
    resources: PublicFooterLink[];
  };
  socialLinks: PublicFooterSocial[];
}

import { API_BASE_URL } from '@/config/api';

const API_BASE = `${API_BASE_URL}/api`;

/**
 * Fetch public footer data.
 */
export async function getPublicFooter(): Promise<PublicFooterData> {
  const res = await fetch(`${API_BASE}/footer`);
  if (!res.ok) {
    throw new Error(`Failed to fetch Footer content: ${res.status}`);
  }
  const json = await res.json();
  return json.data as PublicFooterData;
}

/**
 * Fetch admin footer settings.
 */
export async function getAdminFooterSettings(): Promise<PublicFooterData> {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const res = await fetch(`${API_BASE}/admin/footer`, {
    headers: { Authorization: `Bearer ${token}` },
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error(`Failed to load Footer admin settings: ${res.status}`);
  }
  const json = await res.json();
  return json.data as PublicFooterData;
}

/**
 * Update admin footer settings.
 */
export async function updateAdminFooterSettings(data: Partial<PublicFooterData>): Promise<PublicFooterData> {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const res = await fetch(`${API_BASE}/admin/footer`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to save Footer settings: ${res.status}`);
  }
  const json = await res.json();
  return json.data as PublicFooterData;
}
