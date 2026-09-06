// ─── Contact CMS Frontend Service ──────────────────────────────────────────

export interface PublicContactInfoItem {
  iconName: string;
  label: string;
  value: string;
  href?: string;
  note?: string;
}

export interface PublicContactInquiryType {
  id: string;
  label: string;
}

export interface PublicContactFAQItem {
  question: string;
  answer: string;
}

export interface PublicContactHero {
  visible: boolean;
  eyebrow: string;
  title: string;
  description: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  backgroundImage?: string;
  mediaPublicId?: string;
}

export interface PublicContactInfoSection {
  visible: boolean;
  eyebrow: string;
  title: string;
  description: string;
  items: PublicContactInfoItem[];
}

export interface PublicContactDemoCard {
  visible: boolean;
  badge: string;
  title: string;
  description: string;
  bulletPoints: string[];
  buttonText: string;
}

export interface PublicContactFormConfig {
  visible: boolean;
  title: string;
  subtitle: string;
  inquiryTypes: PublicContactInquiryType[];
  submitButtonText: string;
  successTitle: string;
  successMessage: string;
}

export interface PublicContactFAQSection {
  visible: boolean;
  eyebrow: string;
  title: string;
  description: string;
  items: PublicContactFAQItem[];
}

export interface PublicContactCTA {
  visible: boolean;
  title: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
}

export interface PublicContactSEO {
  metaTitle: string;
  metaDescription: string;
}

export interface PublicContactData {
  hero: PublicContactHero;
  contactInfo: PublicContactInfoSection;
  demoCard: PublicContactDemoCard;
  form: PublicContactFormConfig;
  faq: PublicContactFAQSection;
  cta: PublicContactCTA;
  seo: PublicContactSEO;
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  inquiryType?: string;
  type?: 'ENQUIRY' | 'DEMO';
  message: string;
  status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED' | 'CONTACTED' | 'QUALIFIED' | 'CLOSED';
  notes?: string;
  source?: string;
  createdAt: string;
  updatedAt?: string;
}

const API_BASE = import.meta.env.VITE_API_URL
  ? (import.meta.env.VITE_API_URL.endsWith('/api')
      ? import.meta.env.VITE_API_URL
      : `${import.meta.env.VITE_API_URL}/api`)
  : 'http://localhost:4000/api';

/**
 * Fetch public contact page content.
 */
export async function getPublicContactContent(): Promise<PublicContactData> {
  const res = await fetch(`${API_BASE}/contact`);
  if (!res.ok) {
    throw new Error(`Failed to fetch Contact content: ${res.status}`);
  }
  const json = await res.json();
  return json.data as PublicContactData;
}

/**
 * Submit inquiry from public contact form.
 */
export async function submitContactInquiry(inquiry: {
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  inquiryType?: string;
  message: string;
  type?: 'ENQUIRY' | 'DEMO';
  source?: string;
}): Promise<{ success: boolean; data?: any; message: string }> {
  const res = await fetch(`${API_BASE}/contact/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(inquiry),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to submit inquiry: ${res.status}`);
  }
  return res.json();
}

/**
 * Submit demo request from Book Demo flow.
 */
export async function submitDemoRequest(demo: {
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  message?: string;
  source?: string;
}): Promise<{ success: boolean; data?: any; message: string }> {
  const res = await fetch(`${API_BASE}/contact/demo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(demo),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to schedule demo: ${res.status}`);
  }
  return res.json();
}

/**
 * Fetch admin contact page settings.
 */
export async function getAdminContactSettings(): Promise<PublicContactData> {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const res = await fetch(`${API_BASE}/admin/contact`, {
    headers: { Authorization: `Bearer ${token}` },
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error(`Failed to load Contact admin settings: ${res.status}`);
  }
  const json = await res.json();
  return json.data as PublicContactData;
}

/**
 * Update admin contact page settings.
 */
export async function updateAdminContactSettings(data: Partial<PublicContactData>): Promise<PublicContactData> {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const res = await fetch(`${API_BASE}/admin/contact`, {
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
    throw new Error(errorData.error || `Failed to save Contact settings: ${res.status}`);
  }
  const json = await res.json();
  return json.data as PublicContactData;
}

/**
 * Update an individual contact section.
 */
export async function updateAdminContactSection(sectionKey: string, sectionData: any): Promise<any> {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const res = await fetch(`${API_BASE}/admin/contact/${sectionKey}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
    body: JSON.stringify(sectionData),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to save section '${sectionKey}': ${res.status}`);
  }
  const json = await res.json();
  return json.data;
}

/**
 * Fetch all leads / inquiries / demo requests for admin panel.
 */
export async function getAdminLeads(params?: { status?: string; search?: string; type?: string }): Promise<Lead[]> {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const query = new URLSearchParams();
  if (params?.type && params.type !== 'ALL') query.append('type', params.type);
  if (params?.status && params.status !== 'all') query.append('status', params.status);
  if (params?.search) query.append('search', params.search);

  const res = await fetch(`${API_BASE}/admin/leads?${query.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error(`Failed to load leads: ${res.status}`);
  }
  const json = await res.json();
  return json.data as Lead[];
}

/**
 * Fetch a single lead / inquiry by ID.
 */
export async function getAdminLeadById(id: string): Promise<Lead> {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const res = await fetch(`${API_BASE}/admin/leads/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error(`Failed to load inquiry record: ${res.status}`);
  }
  const json = await res.json();
  return json.data as Lead;
}

/**
 * Update lead status or notes.
 */
export async function updateLeadStatus(id: string, status: string, notes?: string): Promise<Lead> {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const res = await fetch(`${API_BASE}/admin/contact/leads/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
    body: JSON.stringify({ status, notes }),
  });
  if (!res.ok) {
    throw new Error(`Failed to update lead: ${res.status}`);
  }
  const json = await res.json();
  return json.data as Lead;
}

/**
 * Delete a lead.
 */
export async function deleteLead(id: string): Promise<void> {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const res = await fetch(`${API_BASE}/admin/contact/leads/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error(`Failed to delete lead: ${res.status}`);
  }
}
