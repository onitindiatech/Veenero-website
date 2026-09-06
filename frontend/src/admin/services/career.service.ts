export interface Career {
  id: string;
  _id?: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  employmentType: string;
  description: string;
  shortDescription: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  qualifications?: string[];
  skills: string[];
  experience: string;
  salaryRange?: string;
  applicationUrl?: string;
  applicationEmail?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ACTIVE' | 'ARCHIVED' | 'CLOSED' | 'TRASHED';
  previousStatus?: 'DRAFT' | 'PUBLISHED' | 'ACTIVE' | 'ARCHIVED' | 'CLOSED';
  isFeatured: boolean;
  sortOrder: number;
  publishedAt?: string;
  createdBy: string;
  updatedBy: string;
  deletedBy?: string;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CareerStats {
  total: number;
  published: number;
  drafts: number;
  archived: number;
  featured: number;
  trashed?: number;
}

export interface AdminCareersResponse {
  success: boolean;
  data: Career[];
  stats: CareerStats;
}

const API_BASE = import.meta.env.VITE_API_URL
  ? (import.meta.env.VITE_API_URL.endsWith('/api') ? import.meta.env.VITE_API_URL : `${import.meta.env.VITE_API_URL}/api`)
  : 'http://localhost:4000/api';

const PUBLIC_API_URL = `${API_BASE}/careers`;
const ADMIN_API_URL = `${API_BASE}/admin/careers`;

async function parseError(response: Response, defaultMessage: string): Promise<Error> {
  let errData: any = {};
  try {
    errData = await response.json();
  } catch {
    // JSON parsing fallback
  }

  if (response.status === 401) {
    return new Error(errData?.error?.message || 'Your admin session has expired. Please sign in again.');
  }
  if (response.status === 403) {
    return new Error(errData?.error?.message || 'You do not have permission to perform this action.');
  }
  if (response.status === 404) {
    return new Error(errData?.error?.message || 'Career opening not found.');
  }
  if (response.status >= 500) {
    return new Error(errData?.error?.message || 'Unable to save career. Please try again.');
  }
  return new Error(errData?.error?.message || defaultMessage);
}

export const getPublicCareers = async (params?: { search?: string; department?: string; location?: string; employmentType?: string }): Promise<Career[]> => {
  return careerService.getPublicCareers(params);
};

export const getPublicCareerBySlug = async (slug: string): Promise<Career> => {
  return careerService.getPublicCareerBySlug(slug);
};

export const careerService = {
  // Public APIs
  async getPublicCareers(params?: { search?: string; department?: string; location?: string; employmentType?: string }): Promise<Career[]> {
    let url = PUBLIC_API_URL;
    if (params) {
      const searchParams = new URLSearchParams();
      if (params.search) searchParams.append('search', params.search);
      if (params.department) searchParams.append('department', params.department);
      if (params.location) searchParams.append('location', params.location);
      if (params.employmentType) searchParams.append('employmentType', params.employmentType);
      const queryString = searchParams.toString();
      if (queryString) url += `?${queryString}`;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw await parseError(response, 'Failed to fetch public careers');
      }
      const data = await response.json();
      return Array.isArray(data) ? data : data.data || [];
    } catch (err: any) {
      if (err.message && !err.message.includes('fetch')) {
        throw err;
      }
      throw new Error('Unable to connect to the CMS API.');
    }
  },

  async getPublicCareerBySlug(slug: string): Promise<Career> {
    try {
      const response = await fetch(`${PUBLIC_API_URL}/${slug}`);
      if (!response.ok) {
        throw await parseError(response, `Failed to fetch job description for slug "${slug}"`);
      }
      const data = await response.json();
      return data.data || data;
    } catch (err: any) {
      if (err.message && !err.message.includes('fetch')) {
        throw err;
      }
      throw new Error('Unable to connect to the CMS API.');
    }
  },

  // Admin APIs
  async getAdminCareers(): Promise<AdminCareersResponse> {
    try {
      const response = await fetch(ADMIN_API_URL, { credentials: 'include' });
      if (!response.ok) {
        throw await parseError(response, 'Failed to fetch admin careers');
      }
      const res = await response.json();
      if (Array.isArray(res)) {
        return {
          success: true,
          data: res,
          stats: {
            total: res.length,
            published: res.filter((c: Career) => c.status === 'PUBLISHED' || c.status === 'ACTIVE').length,
            drafts: res.filter((c: Career) => c.status === 'DRAFT').length,
            archived: res.filter((c: Career) => c.status === 'ARCHIVED' || c.status === 'CLOSED').length,
            featured: res.filter((c: Career) => c.isFeatured).length,
          },
        };
      }
      return res;
    } catch (err: any) {
      if (err.message && !err.message.includes('fetch')) {
        throw err;
      }
      throw new Error('Unable to connect to the CMS API.');
    }
  },

  async getAdminCareerById(id: string): Promise<Career> {
    try {
      const response = await fetch(`${ADMIN_API_URL}/${id}`, { credentials: 'include' });
      if (!response.ok) {
        throw await parseError(response, `Failed to fetch admin career with ID ${id}`);
      }
      const res = await response.json();
      return res.data || res;
    } catch (err: any) {
      if (err.message && !err.message.includes('fetch')) {
        throw err;
      }
      throw new Error('Unable to connect to the CMS API.');
    }
  },

  async createCareer(careerData: Partial<Career>): Promise<Career> {
    try {
      const response = await fetch(ADMIN_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(careerData),
        credentials: 'include',
      });
      if (!response.ok) {
        throw await parseError(response, 'Failed to create career opening');
      }
      const res = await response.json();
      return res.data || res;
    } catch (err: any) {
      if (err.message && !err.message.includes('fetch')) {
        throw err;
      }
      throw new Error('Unable to connect to the CMS API.');
    }
  },

  async updateCareer(id: string, careerData: Partial<Career>): Promise<Career> {
    try {
      const response = await fetch(`${ADMIN_API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(careerData),
        credentials: 'include',
      });
      if (!response.ok) {
        throw await parseError(response, `Failed to update career with ID ${id}`);
      }
      const res = await response.json();
      return res.data || res;
    } catch (err: any) {
      if (err.message && !err.message.includes('fetch')) {
        throw err;
      }
      throw new Error('Unable to connect to the CMS API.');
    }
  },

  async updateCareerStatus(id: string, status: 'DRAFT' | 'PUBLISHED' | 'ACTIVE' | 'ARCHIVED' | 'CLOSED'): Promise<Career> {
    try {
      const response = await fetch(`${ADMIN_API_URL}/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
        credentials: 'include',
      });
      if (!response.ok) {
        throw await parseError(response, `Failed to update status for career with ID ${id}`);
      }
      const res = await response.json();
      return res.data || res;
    } catch (err: any) {
      if (err.message && !err.message.includes('fetch')) {
        throw err;
      }
      throw new Error('Unable to connect to the CMS API.');
    }
  },

  async deleteCareer(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${ADMIN_API_URL}/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) {
        throw await parseError(response, `Failed to soft delete career with ID ${id}`);
      }
      return response.json();
    } catch (err: any) {
      if (err.message && !err.message.includes('fetch')) {
        throw err;
      }
      throw new Error('Unable to connect to the CMS API.');
    }
  },

  async getRecycleBin(): Promise<Career[]> {
    try {
      const response = await fetch(`${ADMIN_API_URL}/recycle-bin`, { credentials: 'include' });
      if (!response.ok) {
        throw await parseError(response, 'Failed to fetch deleted careers from recycle bin');
      }
      const res = await response.json();
      return Array.isArray(res) ? res : res.data || [];
    } catch (err: any) {
      if (err.message && !err.message.includes('fetch')) {
        throw err;
      }
      throw new Error('Unable to connect to the CMS API.');
    }
  },

  async restoreCareer(id: string): Promise<Career> {
    try {
      const response = await fetch(`${ADMIN_API_URL}/${id}/restore`, {
        method: 'PATCH',
        credentials: 'include',
      });
      if (!response.ok) {
        throw await parseError(response, `Failed to restore career with ID ${id}`);
      }
      const res = await response.json();
      return res.data || res;
    } catch (err: any) {
      if (err.message && !err.message.includes('fetch')) {
        throw err;
      }
      throw new Error('Unable to connect to the CMS API.');
    }
  },

  async permanentlyDeleteCareer(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${ADMIN_API_URL}/${id}/permanent`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) {
        throw await parseError(response, `Failed to permanently delete career with ID ${id}`);
      }
      return response.json();
    } catch (err: any) {
      if (err.message && !err.message.includes('fetch')) {
        throw err;
      }
      throw new Error('Unable to connect to the CMS API.');
    }
  },

  async duplicateCareer(careerOrId: Career | string): Promise<Career> {
    const targetId = typeof careerOrId === 'string' ? careerOrId : (careerOrId.id || careerOrId._id);
    try {
      const response = await fetch(`${ADMIN_API_URL}/${targetId}/duplicate`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!response.ok) {
        throw await parseError(response, 'Failed to duplicate career opening');
      }
      const res = await response.json();
      return res.data || res;
    } catch (err: any) {
      if (err.message && !err.message.includes('fetch')) {
        throw err;
      }
      throw new Error('Unable to connect to the CMS API.');
    }
  },

  async getPageSettings(): Promise<CareerPageSettings> {
    try {
      const response = await fetch(`${PUBLIC_API_URL}/settings`);
      if (!response.ok) {
        throw await parseError(response, 'Failed to load career page settings');
      }
      const res = await response.json();
      return res.data;
    } catch (err: any) {
      if (err.message && !err.message.includes('fetch')) throw err;
      throw new Error('Unable to connect to the CMS API.');
    }
  },

  async updatePageSettings(settings: Partial<CareerPageSettings>): Promise<CareerPageSettings> {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    try {
      const response = await fetch(`${ADMIN_API_URL}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(settings),
      });
      if (!response.ok) {
        throw await parseError(response, 'Failed to update career page settings');
      }
      const res = await response.json();
      return res.data;
    } catch (err: any) {
      if (err.message && !err.message.includes('fetch')) throw err;
      throw new Error('Unable to connect to the CMS API.');
    }
  },
};

export interface CareerPageSettings {
  hero: {
    visible: boolean;
    eyebrow: string;
    title: string;
    description: string;
    primaryCtaText: string;
    secondaryCtaText: string;
  };
  hiringProcess: {
    visible: boolean;
    eyebrow: string;
    title: string;
    description: string;
    steps: Array<{
      num: string;
      icon: string;
      title: string;
      subtitle: string;
      description: string;
    }>;
  };
  cta: {
    visible: boolean;
    eyebrow: string;
    title: string;
    description: string;
    buttonText: string;
    email: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
  };
}

export default careerService;

