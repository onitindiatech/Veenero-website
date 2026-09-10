import { API_BASE_URL } from '@/config/api';

const API_BASE = `${API_BASE_URL}/api`;

export type ApplicationStatus = 'PENDING' | 'UNDER_REVIEW' | 'SELECTED' | 'NOT_SELECTED';
export type DecisionEmailType = 'SELECTED' | 'NOT_SELECTED';

export interface JobApplication {
  id: string;
  _id?: string;
  careerId: string;
  jobTitle: string;
  jobDepartment?: string;
  candidateName: string;
  email: string;
  phone: string;
  resumeUrl: string;
  resumeFilename: string;
  coverLetter: string;
  linkedInUrl?: string;
  portfolioUrl?: string;
  status: ApplicationStatus;
  notes?: string;
  decisionEmailSent: boolean;
  decisionEmailType?: DecisionEmailType;
  decisionEmailSentAt?: string;
  decisionSentBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationCounts {
  all: number;
  pending: number;
  underReview: number;
  selected: number;
  notSelected: number;
}

export interface SubmitApplicationResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    candidateName: string;
    jobTitle: string;
    createdAt: string;
  };
}

export interface AdminApplicationsResponse {
  success: boolean;
  data: JobApplication[];
  counts: ApplicationCounts;
}

/**
 * Submit candidate application with multipart form data (resume file)
 */
export async function submitJobApplication(formData: FormData): Promise<SubmitApplicationResponse> {
  const res = await fetch(`${API_BASE}/applications/apply`, {
    method: 'POST',
    body: formData,
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json.message || `Submission failed with status: ${res.status}`);
  }

  return json;
}

/**
 * Fetch all applications for Admin panel with status and search filters
 */
export async function getAdminApplications(params?: {
  status?: string;
  careerId?: string;
  search?: string;
}): Promise<AdminApplicationsResponse> {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const query = new URLSearchParams();

  if (params?.status && params.status !== 'ALL') query.append('status', params.status);
  if (params?.careerId) query.append('careerId', params.careerId);
  if (params?.search) query.append('search', params.search);

  const res = await fetch(`${API_BASE}/admin/applications?${query.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json.message || `Failed to load applications: ${res.status}`);
  }

  return json;
}

/**
 * Fetch a single application by ID
 */
export async function getAdminApplicationById(id: string): Promise<JobApplication> {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const res = await fetch(`${API_BASE}/admin/applications/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json.message || `Failed to load application: ${res.status}`);
  }

  return json.data;
}

/**
 * Update candidate application status or internal notes
 */
export async function updateApplicationStatus(
  id: string,
  status?: ApplicationStatus,
  notes?: string
): Promise<JobApplication> {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const res = await fetch(`${API_BASE}/admin/applications/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
    body: JSON.stringify({ status, notes }),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json.message || `Failed to update application: ${res.status}`);
  }

  return json.data;
}

/**
 * Send Decision Email (Selected or Not Selected) to candidate
 */
export async function sendDecisionEmail(
  id: string,
  type: DecisionEmailType,
  forceResend = false
): Promise<{ success: boolean; message: string; data: JobApplication }> {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const res = await fetch(`${API_BASE}/admin/applications/${id}/decision-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
    body: JSON.stringify({ type, forceResend }),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error: any = new Error(json.message || `Failed to send decision email: ${res.status}`);
    error.isDuplicate = json.isDuplicate;
    throw error;
  }

  return json;
}

/**
 * Delete application record
 */
export async function deleteApplication(id: string): Promise<void> {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const res = await fetch(`${API_BASE}/admin/applications/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json.message || `Failed to delete application: ${res.status}`);
  }
}

export const applicationService = {
  submitJobApplication,
  getAdminApplications,
  getAdminApplicationById,
  updateApplicationStatus,
  sendDecisionEmail,
  deleteApplication,
};
