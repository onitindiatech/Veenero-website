export interface OverviewKpi {
  value: number;
  label: string;
  subtext: string;
  trend: 'up' | 'down' | 'neutral';
}

export interface DashboardOverview {
  totalPages: OverviewKpi;
  publishedPages: OverviewKpi;
  draftPages: OverviewKpi;
  blogPosts: OverviewKpi;
  openJobs: OverviewKpi;
  contactLeads: OverviewKpi;
  jobApplications: OverviewKpi;
  mediaAssets: OverviewKpi;
  faqs: OverviewKpi;
}

export interface PageStatusItem {
  name: string;
  value: number;
  color: string;
}

export interface ContentDistributionItem {
  name: string;
  count: number;
  color: string;
}

export interface ActivityTimelinePoint {
  date: string;
  name: string;
  contentEdits: number;
  inquiries: number;
}

export interface ActivityEvent {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  timeRaw: number;
  type: 'content' | 'settings' | 'auth' | 'incident';
}

export interface DashboardLeadItem {
  id: string;
  name: string;
  email: string;
  company: string;
  inquiryType: string;
  type: 'ENQUIRY' | 'DEMO';
  date: string;
  status: 'new' | 'in_progress' | 'resolved' | 'contacted' | 'qualified' | 'closed';
}

export interface DashboardApplicationItem {
  id: string;
  applicantName: string;
  email: string;
  position: string;
  department: string;
  appliedDate: string;
  status: 'pending' | 'under_review' | 'selected' | 'not_selected';
}

export interface DashboardSystemSummary {
  databaseConnected: boolean;
  serverUptime: number;
  lastSynced: string;
}

export interface DashboardStatsResponse {
  success: boolean;
  timestamp: string;
  overview: DashboardOverview;
  pageStatus: PageStatusItem[];
  contentDistribution: ContentDistributionItem[];
  activityTimeline: ActivityTimelinePoint[];
  recentActivity: ActivityEvent[];
  recentLeads: DashboardLeadItem[];
  recentApplications: DashboardApplicationItem[];
  system: DashboardSystemSummary;
}
