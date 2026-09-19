import { API_BASE_URL } from '@/config/api';

export interface ActivityLogItem {
  id: string;
  userId?: string;
  userName: string;
  userEmail: string;
  userRole: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'PUBLISH' | 'EXPORT';
  module: string;
  entity: string;
  description: string;
  ipAddress?: string;
  status: 'SUCCESS' | 'FAILURE';
  createdAt: string;
}

export interface ActivityLogsResponse {
  logs: ActivityLogItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const API_BASE = `${API_BASE_URL}/api`;

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function listActivityLogs(params?: {
  page?: number;
  limit?: number;
  module?: string;
  action?: string;
  search?: string;
}): Promise<ActivityLogsResponse> {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.module && params.module !== 'ALL') query.set('module', params.module);
  if (params?.action && params.action !== 'ALL') query.set('action', params.action);
  if (params?.search) query.set('search', params.search);

  const res = await fetch(`${API_BASE}/admin/activity-logs?${query.toString()}`, {
    headers: { ...getAuthHeader() },
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error(`Failed to load activity logs: ${res.status}`);
  }
  const json = await res.json();
  return json.data;
}
