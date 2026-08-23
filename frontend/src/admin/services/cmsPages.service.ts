import { CmsPage, CmsPageFormValues } from '../types/cms.types';

const API_BASE = import.meta.env.VITE_API_URL
  ? (import.meta.env.VITE_API_URL.endsWith('/api') ? import.meta.env.VITE_API_URL : `${import.meta.env.VITE_API_URL}/api`)
  : 'http://localhost:4000/api';

const API_BASE_URL = `${API_BASE}/cms/pages`;

export const cmsPagesService = {
  async fetchPages(search?: string, status?: string): Promise<CmsPage[]> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status && status !== 'all') params.append('status', status);

    const response = await fetch(`${API_BASE_URL}?${params.toString()}`, {
      credentials: 'include',
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData?.error?.message || 'Failed to fetch pages');
    }
    return response.json();
  },

  async fetchPageById(id: string): Promise<CmsPage> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      credentials: 'include',
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `Failed to fetch page with ID ${id}`);
    }
    return response.json();
  },

  async createPage(values: CmsPageFormValues & { sections?: any[] }): Promise<CmsPage> {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
      credentials: 'include',
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData?.error?.message || 'Failed to create page');
    }
    return response.json();
  },

  async updatePage(id: string, values: Partial<CmsPage>): Promise<CmsPage> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
      credentials: 'include',
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `Failed to update page with ID ${id}`);
    }
    return response.json();
  },

  async deletePage(id: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `Failed to delete page with ID ${id}`);
    }
    return response.json();
  },

  async publishPage(id: string, publish: boolean): Promise<CmsPage> {
    const response = await fetch(`${API_BASE_URL}/${id}/publish`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publish }),
      credentials: 'include',
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(
        errData?.error?.message || `Failed to update publish status for page with ID ${id}`
      );
    }
    return response.json();
  },

  async duplicatePage(page: CmsPage): Promise<CmsPage> {
    // Generate clean slug for copy
    let slugBase = page.slug === '/' ? '/home' : page.slug;
    if (slugBase.endsWith('/')) {
      slugBase = slugBase.slice(0, -1);
    }
    const dupValues = {
      name: `${page.name} (Copy)`,
      slug: `${slugBase}-copy`,
      status: 'draft' as const,
      featuredImage: page.featuredImage || '',
      seoMetaTitle: page.seoMetaTitle,
      seoMetaDescription: page.seoMetaDescription,
      sections: page.sections.map((s) => ({
        ...s,
        id: `s-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      })),
    };
    return this.createPage(dupValues);
  },
};
