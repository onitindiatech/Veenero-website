import { API_BASE_URL, apiFetch } from '@/config/api';
import { DashboardStatsResponse } from '../types/dashboard.types';

export const dashboardService = {
  /**
   * Fetch aggregated real-time dashboard statistics from MongoDB
   */
  async getStats(range: '7d' | '30d' | '90d' = '30d'): Promise<DashboardStatsResponse> {
    const response = await apiFetch(`/api/admin/dashboard/stats?range=${range}`);
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData?.error?.message || 'Failed to fetch dashboard statistics.');
    }
    return response.json();
  },

  /**
   * Trigger CMS database backup and download JSON export
   */
  async downloadBackup(): Promise<{ filename: string; recordCounts: any }> {
    const response = await apiFetch('/api/admin/dashboard/backup');
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData?.error?.message || 'Failed to download CMS backup.');
    }

    const blob = await response.blob();
    const contentDisposition = response.headers.get('Content-Disposition');
    let filename = `veenero-cms-backup-${new Date().toISOString().split('T')[0]}.json`;
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?([^"]+)"?/);
      if (match && match[1]) {
        filename = match[1];
      }
    }

    // Trigger browser download
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    // Read payload briefly to extract counts for user confirmation
    try {
      const text = await blob.text();
      const parsed = JSON.parse(text);
      return {
        filename,
        recordCounts: parsed.exportMetadata?.recordCounts || {},
      };
    } catch {
      return { filename, recordCounts: {} };
    }
  },
};
