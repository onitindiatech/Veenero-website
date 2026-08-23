import { Article, BlogSettings, BlogPostFormData } from '@/components/blog/types';

const API_BASE = import.meta.env.VITE_API_URL
  ? (import.meta.env.VITE_API_URL.endsWith('/api') ? import.meta.env.VITE_API_URL : `${import.meta.env.VITE_API_URL}/api`)
  : 'http://localhost:4000/api';

// ─── Helper ───────────────────────────────────────────────────────────────────
async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    ...options,
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error?.message || `API error ${res.status}`);
  }
  return json as T;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLIC
// ═══════════════════════════════════════════════════════════════════════════════

export async function getPublicPosts(params?: {
  category?: string;
  search?: string;
  featured?: boolean;
}): Promise<Article[]> {
  const queryParams = new URLSearchParams();
  if (params?.category) queryParams.set('category', params.category);
  if (params?.search) queryParams.set('search', params.search);
  if (params?.featured) queryParams.set('featured', 'true');

  const queryString = queryParams.toString();
  const url = `${API_BASE}/blog${queryString ? `?${queryString}` : ''}`;

  const data = await apiFetch<{ success: boolean; data: Article[] }>(url);
  return data.data;
}

export async function getPublicPostBySlug(
  slug: string
): Promise<{ post: Article; related: Article[] }> {
  const data = await apiFetch<{ success: boolean; data: { post: Article; related: Article[] } }>(
    `${API_BASE}/blog/${slug}`
  );
  return data.data;
}

export async function getPublicSettings(): Promise<BlogSettings | null> {
  const data = await apiFetch<{ success: boolean; data: BlogSettings | null }>(
    `${API_BASE}/blog/settings`
  );
  return data.data;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN — POSTS
// ═══════════════════════════════════════════════════════════════════════════════

export async function getAdminPosts(): Promise<{
  posts: Article[];
  stats: { total: number; published: number; drafts: number; archived: number; featured: number };
}> {
  const data = await apiFetch<{
    success: boolean;
    data: Article[];
    stats: { total: number; published: number; drafts: number; archived: number; featured: number };
  }>(`${API_BASE}/admin/blog`);
  return { posts: data.data, stats: data.stats };
}

export async function getAdminPostById(id: string): Promise<Article> {
  const data = await apiFetch<{ success: boolean; data: Article }>(
    `${API_BASE}/admin/blog/${id}`
  );
  return data.data;
}

export async function createPost(payload: Partial<BlogPostFormData>): Promise<Article> {
  const data = await apiFetch<{ success: boolean; data: Article }>(
    `${API_BASE}/admin/blog`,
    { method: 'POST', body: JSON.stringify(payload) }
  );
  return data.data;
}

export async function updatePost(id: string, payload: Partial<BlogPostFormData>): Promise<Article> {
  const data = await apiFetch<{ success: boolean; data: Article }>(
    `${API_BASE}/admin/blog/${id}`,
    { method: 'PUT', body: JSON.stringify(payload) }
  );
  return data.data;
}

export async function updatePostStatus(id: string, status: string): Promise<Article> {
  const data = await apiFetch<{ success: boolean; data: Article }>(
    `${API_BASE}/admin/blog/${id}/status`,
    { method: 'PATCH', body: JSON.stringify({ status }) }
  );
  return data.data;
}

export async function toggleFeatured(id: string, featured: boolean): Promise<Article> {
  const data = await apiFetch<{ success: boolean; data: Article }>(
    `${API_BASE}/admin/blog/${id}/featured`,
    { method: 'PATCH', body: JSON.stringify({ featured }) }
  );
  return data.data;
}

export async function duplicatePost(id: string): Promise<Article> {
  const data = await apiFetch<{ success: boolean; data: Article }>(
    `${API_BASE}/admin/blog/${id}/duplicate`,
    { method: 'POST' }
  );
  return data.data;
}

export async function softDeletePost(id: string): Promise<void> {
  await apiFetch(`${API_BASE}/admin/blog/${id}`, { method: 'DELETE' });
}

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN — RECYCLE BIN
// ═══════════════════════════════════════════════════════════════════════════════

export async function getRecycleBin(): Promise<Article[]> {
  const data = await apiFetch<{ success: boolean; data: Article[] }>(
    `${API_BASE}/admin/blog/recycle-bin`
  );
  return data.data;
}

export async function restorePost(id: string): Promise<Article> {
  const data = await apiFetch<{ success: boolean; data: Article }>(
    `${API_BASE}/admin/blog/${id}/restore`,
    { method: 'PATCH' }
  );
  return data.data;
}

export async function permanentlyDeletePost(id: string): Promise<void> {
  await apiFetch(`${API_BASE}/admin/blog/${id}/permanent`, { method: 'DELETE' });
}

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN — SETTINGS
// ═══════════════════════════════════════════════════════════════════════════════

export async function getAdminSettings(): Promise<BlogSettings | null> {
  const data = await apiFetch<{ success: boolean; data: BlogSettings | null }>(
    `${API_BASE}/admin/blog/settings`
  );
  return data.data;
}

export async function updateAdminSettings(payload: Partial<BlogSettings>): Promise<BlogSettings> {
  const data = await apiFetch<{ success: boolean; data: BlogSettings }>(
    `${API_BASE}/admin/blog/settings`,
    { method: 'PUT', body: JSON.stringify(payload) }
  );
  return data.data;
}
