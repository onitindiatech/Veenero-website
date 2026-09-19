import { API_BASE_URL } from '@/config/api';

export interface SeoPageItem {
  pageKey: string;
  pageName: string;
  route: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  noIndex?: boolean;
  keywords?: string[];
  updatedAt?: string;
  status: 'OPTIMIZED' | 'NEEDS_ATTENTION' | 'DEFAULT';
}

const API_BASE = `${API_BASE_URL}/api`;

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Fetch SEO settings for all website pages.
 */
export async function getAllPagesSeo(): Promise<SeoPageItem[]> {
  const res = await fetch(`${API_BASE}/admin/seo`, {
    headers: { ...getAuthHeader() },
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error(`Failed to load SEO catalog: ${res.status}`);
  }
  const json = await res.json();
  return json.data || [];
}

/**
 * Update SEO settings for a specific page.
 */
export async function updatePageSeo(pageKey: string, data: Partial<SeoPageItem>): Promise<any> {
  const res = await fetch(`${API_BASE}/admin/seo/${pageKey}`, {
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
    throw new Error(err.message || `Failed to update SEO: ${res.status}`);
  }
  const json = await res.json();
  return json.data;
}
