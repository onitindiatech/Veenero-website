import { API_BASE_URL } from '@/config/api';

export interface NavItem {
  id: string;
  label: string;
  href: string;
  isExternal?: boolean;
  order: number;
  isActive: boolean;
  badge?: string;
  target?: '_self' | '_blank';
}

export interface NavigationData {
  items: NavItem[];
  updatedAt?: string;
}

const API_BASE = `${API_BASE_URL}/api`;

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Fetch active public navigation links (with fallback handled by caller).
 */
export async function getPublicNavigation(): Promise<NavItem[]> {
  const res = await fetch(`${API_BASE}/navigation`);
  if (!res.ok) {
    throw new Error(`Failed to fetch public navigation: ${res.status}`);
  }
  const json = await res.json();
  return json.data || [];
}

/**
 * Fetch all navigation items for the CMS admin manager.
 */
export async function getAdminNavigation(): Promise<NavigationData> {
  const res = await fetch(`${API_BASE}/admin/navigation`, {
    headers: { ...getAuthHeader() },
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error(`Failed to load navigation admin data: ${res.status}`);
  }
  const json = await res.json();
  return json.data;
}

/**
 * Update navigation items (reorder, edit label/href, toggle visibility).
 */
export async function updateAdminNavigation(items: NavItem[]): Promise<NavigationData> {
  const res = await fetch(`${API_BASE}/admin/navigation`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    credentials: 'include',
    body: JSON.stringify({ items }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to update navigation: ${res.status}`);
  }
  const json = await res.json();
  return json.data;
}

/**
 * Reset navigation back to platform defaults.
 */
export async function resetDefaultNavigation(): Promise<NavigationData> {
  const res = await fetch(`${API_BASE}/admin/navigation/reset-defaults`, {
    method: 'POST',
    headers: { ...getAuthHeader() },
    credentials: 'include',
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to reset navigation: ${res.status}`);
  }
  const json = await res.json();
  return json.data;
}
