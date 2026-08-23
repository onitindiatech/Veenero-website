// Mock data for the Veenero Admin Dashboard (CMS focus)

export interface KpiCardData {
  id: string;
  title: string;
  value: string;
  change: number; // percentage change
  trend: 'up' | 'down' | 'neutral';
  timeframe: string;
  iconName: string;
  color: string; // Tailwind color key or theme class name
}

export interface ActivityTrendPoint {
  name: string;
  pageViews: number;
  edits: number;
}

export interface PageStatusDataPoint {
  name: string;
  value: number;
  color: string;
}

export interface ActivityItem {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  type: 'auth' | 'settings' | 'incident' | 'content';
}

export interface LeadItem {
  id: string;
  name: string;
  email: string;
  company: string;
  date: string;
  status: 'new' | 'contacted' | 'qualified';
}

export interface ApplicationItem {
  id: string;
  applicantName: string;
  email: string;
  position: string;
  appliedDate: string;
  status: 'pending' | 'reviewing' | 'shortlisted';
}

export interface QuickActionItem {
  id: string;
  label: string;
  iconName: string;
  color: string;
  actionType: string;
}

// ----------------------------------------------------
// Mock Data Instantiation
// ----------------------------------------------------

export const kpiCards: KpiCardData[] = [
  {
    id: 'kpi-pages',
    title: 'Total System Pages',
    value: '12',
    change: 9.1,
    trend: 'up',
    timeframe: 'vs last month',
    iconName: 'FileText',
    color: 'ocean',
  },
  {
    id: 'kpi-published',
    title: 'Published Pages',
    value: '8',
    change: 12.5,
    trend: 'up',
    timeframe: 'vs last month',
    iconName: 'Globe',
    color: 'sage',
  },
  {
    id: 'kpi-drafts',
    title: 'Draft Pages',
    value: '4',
    change: 0.0,
    trend: 'neutral',
    timeframe: 'vs last month',
    iconName: 'FileEdit',
    color: 'ocean',
  },
  {
    id: 'kpi-blog',
    title: 'Blog / Insights',
    value: '24',
    change: 14.2,
    trend: 'up',
    timeframe: 'vs last month',
    iconName: 'Newspaper',
    color: 'ocean',
  },
  {
    id: 'kpi-careers',
    title: 'Careers (Open Jobs)',
    value: '6',
    change: 20.0,
    trend: 'up',
    timeframe: 'vs last month',
    iconName: 'Briefcase',
    color: 'sage',
  },
  {
    id: 'kpi-leads',
    title: 'Contact Leads',
    value: '18',
    change: 8.3,
    trend: 'up',
    timeframe: 'vs last week',
    iconName: 'MailCheck',
    color: 'sage',
  },
];

export const cmsActivityData: ActivityTrendPoint[] = [
  { name: 'Mon', pageViews: 1200, edits: 1 },
  { name: 'Tue', pageViews: 1450, edits: 3 },
  { name: 'Wed', pageViews: 1900, edits: 2 },
  { name: 'Thu', pageViews: 1750, edits: 0 },
  { name: 'Fri', pageViews: 2200, edits: 5 },
  { name: 'Sat', pageViews: 980, edits: 1 },
  { name: 'Sun', pageViews: 1100, edits: 2 },
];

export const pageStatusData: PageStatusDataPoint[] = [
  { name: 'Published Pages', value: 8, color: '#0f766e' },
  { name: 'Draft Pages', value: 4, color: '#0ea5e9' },
];

export const recentActivity: ActivityItem[] = [
  { id: 'act-1', user: 'Aditya Choubey', action: 'Published page', target: 'About Us', timestamp: '10m ago', type: 'content' },
  { id: 'act-2', user: 'System Guard', action: 'Successfully backed up database', target: 'MongoDB Atlas Cluster0', timestamp: '1h ago', type: 'settings' },
  { id: 'act-3', user: 'Aditya Choubey', action: 'Modified metadata for page', target: 'Solutions', timestamp: '2h ago', type: 'content' },
  { id: 'act-4', user: 'Aditya Choubey', action: 'Duplicated draft page', target: 'Careers (Copy)', timestamp: '4h ago', type: 'content' },
  { id: 'act-5', user: 'System', action: 'Received job application', target: 'Job Application: Senior Hydro Geologist', timestamp: '5h ago', type: 'incident' },
];

export const recentLeads: LeadItem[] = [
  { id: 'lead-1', name: 'GE Water Systems', email: 'procurement@ge.com', company: 'General Electric', date: 'Just now', status: 'new' },
  { id: 'lead-2', name: 'Chicago Brewery Co.', email: 'ops@chicagobeer.com', company: 'Chicago Brewery', date: '3h ago', status: 'contacted' },
  { id: 'lead-3', name: 'Texas Pure Water', email: 'info@txpure.com', company: 'Texas Pure Water Inc.', date: '1d ago', status: 'qualified' },
  { id: 'lead-4', name: 'Nestle Water Division', email: 'sustainability@nestle.com', company: 'Nestle Corp', date: '2d ago', status: 'new' },
];

export const recentApplications: ApplicationItem[] = [
  { id: 'app-1', applicantName: 'Johnathan Doe', email: 'j.doe@gmail.com', position: 'Senior Hydro Geologist', appliedDate: '2h ago', status: 'pending' },
  { id: 'app-2', applicantName: 'Sarah Connor', email: 's.connor@sky.net', position: 'Water Systems Architect', appliedDate: '5h ago', status: 'reviewing' },
  { id: 'app-3', applicantName: 'Bruce Wayne', email: 'bwayne@wayne.com', position: 'Sustainability Consultant', appliedDate: '1d ago', status: 'shortlisted' },
  { id: 'app-4', applicantName: 'Peter Parker', email: 'web@dailybugle.com', position: 'Media Relations Specialist', appliedDate: '3d ago', status: 'pending' },
];

export const quickActions: QuickActionItem[] = [
  { id: 'qa-pages', label: 'Create New Page', iconName: 'PlusCircle', color: 'ocean', actionType: 'navigation' },
  { id: 'qa-blog', label: 'Publish Blog Post', iconName: 'PlusCircle', color: 'sage', actionType: 'navigation' },
  { id: 'qa-careers', label: 'Post Job Opening', iconName: 'Briefcase', color: 'ocean', actionType: 'navigation' },
  { id: 'qa-backup', label: 'Back Up CMS Data', iconName: 'RefreshCw', color: 'sage', actionType: 'trigger' },
];
