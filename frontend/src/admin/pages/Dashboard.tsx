import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import * as Icons from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';

// Reusable Components
import { StatCard } from '../components/StatCard';
import { ChartCard } from '../components/ChartCard';
import { DataTable } from '../components/DataTable';
import { ActivityFeed } from '../components/ActivityFeed';
import { Button } from '@/components/ui/button';
import { OneShotCounter } from '@/components/ui/OneShotCounter';

// Service & Types
import { dashboardService } from '../services/dashboard.service';
import { DashboardStatsResponse } from '../types/dashboard.types';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [timelineRange, setTimelineRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [isBackingUp, setIsBackingUp] = useState(false);

  // ─── Live Data Fetching via React Query ─────────────────────────────────────
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery<DashboardStatsResponse>({
    queryKey: ['admin-dashboard-stats', timelineRange],
    queryFn: () => dashboardService.getStats(timelineRange),
    refetchInterval: 60000, // Background refresh every 60s
    refetchOnWindowFocus: true,
  });

  // ─── Quick Actions Handler ──────────────────────────────────────────────────
  const handleQuickAction = async (actionId: string, label: string) => {
    switch (actionId) {
      case 'qa-pages':
        navigate('/admin/pages');
        toast.success('Navigating to Page Manager', {
          description: 'Opening Page Management console.',
        });
        break;
      case 'qa-blog':
        navigate('/admin/blog');
        toast.success('Navigating to Blog / Insights', {
          description: 'Opening Blog editor.',
        });
        break;
      case 'qa-careers':
        navigate('/admin/careers');
        toast.success('Navigating to Careers', {
          description: 'Opening Careers job manager.',
        });
        break;
      case 'qa-backup':
        setIsBackingUp(true);
        toast.loading('Generating CMS snapshot...', { id: 'backup-toast' });
        try {
          const result = await dashboardService.downloadBackup();
          toast.success('Backup Exported Successfully', {
            id: 'backup-toast',
            description: `Saved ${result.filename} with live database records.`,
          });
        } catch (err: any) {
          toast.error('Backup Failed', {
            id: 'backup-toast',
            description: err.message || 'Could not generate CMS backup.',
          });
        } finally {
          setIsBackingUp(false);
        }
        break;
      default:
        toast.info(label);
    }
  };

  // ─── Table Columns for Recent Leads ─────────────────────────────────────────
  const leadColumns = [
    {
      header: 'Contact Name',
      accessorKey: 'name',
      cell: (row: any) => (
        <div className="flex flex-col">
          <span className="font-bold text-foreground">{row.name}</span>
          <span className="text-[10px] text-muted-foreground">{row.email}</span>
        </div>
      ),
    },
    {
      header: 'Organization',
      accessorKey: 'company',
      cell: (row: any) => (
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{row.company}</span>
          <span className="text-[10px] text-muted-foreground">{row.inquiryType}</span>
        </div>
      ),
    },
    {
      header: 'Submitted',
      accessorKey: 'date',
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row: any) => {
        const s = String(row.status || '').toLowerCase();
        return (
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold font-sans uppercase tracking-wider ${
              s === 'new'
                ? 'text-teal-700 bg-teal-50 dark:text-teal-400 dark:bg-teal-950/20'
                : s === 'contacted' || s === 'in_progress'
                ? 'text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/20'
                : 'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/20'
            }`}
          >
            {s.replace('_', ' ')}
          </span>
        );
      },
    },
  ];

  // ─── Table Columns for Recent Applications ──────────────────────────────────
  const appColumns = [
    {
      header: 'Applicant',
      accessorKey: 'applicantName',
      cell: (row: any) => (
        <div className="flex flex-col">
          <span className="font-bold text-foreground">{row.applicantName}</span>
          <span className="text-[10px] text-muted-foreground">{row.email}</span>
        </div>
      ),
    },
    {
      header: 'Position & Dept',
      accessorKey: 'position',
      cell: (row: any) => (
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{row.position}</span>
          <span className="text-[10px] text-muted-foreground">{row.department}</span>
        </div>
      ),
    },
    {
      header: 'Applied Date',
      accessorKey: 'appliedDate',
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row: any) => {
        const s = String(row.status || '').toLowerCase();
        return (
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold font-sans uppercase tracking-wider ${
              s === 'pending'
                ? 'text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/20'
                : s === 'under_review'
                ? 'text-teal-700 bg-teal-50 dark:text-teal-400 dark:bg-teal-950/20'
                : s === 'selected'
                ? 'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/20'
                : 'text-rose-700 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/20'
            }`}
          >
            {s.replace('_', ' ')}
          </span>
        );
      },
    },
  ];

  // ─── CMS Launchpad Shortcut Items ──────────────────────────────────────────
  const cmsLaunchpadItems = [
    { label: 'Pages', path: '/admin/pages', icon: 'FileEdit', desc: 'Core pages & layouts', color: 'text-teal-600' },
    { label: 'Home CMS', path: '/admin/home', icon: 'Layers', desc: 'Hero, metrics & sections', color: 'text-cyan-600' },
    { label: 'About CMS', path: '/admin/about', icon: 'Info', desc: 'Origin, team & vision', color: 'text-sky-600' },
    { label: 'Solutions CMS', path: '/admin/solutions', icon: 'Cpu', desc: 'Water tech modules', color: 'text-teal-600' },
    { label: 'Approach CMS', path: '/admin/approach', icon: 'Compass', desc: 'Methodology & tech', color: 'text-emerald-600' },
    { label: 'Impact CMS', path: '/admin/impact', icon: 'Zap', desc: 'Audit stats & awards', color: 'text-amber-600' },
    { label: 'Contact CMS', path: '/admin/contact', icon: 'Phone', desc: 'Inquiries & demo setup', color: 'text-blue-600' },
    { label: 'Blog / Insights', path: '/admin/blog', icon: 'Newspaper', desc: 'Articles & publications', color: 'text-violet-600' },
    { label: 'Careers', path: '/admin/careers', icon: 'Briefcase', desc: 'Job postings & roles', color: 'text-teal-600' },
    { label: 'Media Library', path: '/admin/media', icon: 'Image', desc: 'Cloudinary assets', color: 'text-rose-600' },
    { label: 'Contact Leads', path: '/admin/leads', icon: 'MailCheck', desc: 'Form inquiries in DB', color: 'text-emerald-600' },
    { label: 'Job Applications', path: '/admin/job-applications', icon: 'UserCheck', desc: 'Resumes & candidates', color: 'text-teal-600' },
  ];

  // ─── Loading Skeleton View ──────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex flex-col flex-1 p-6 md:p-8 space-y-8 animate-fade-in max-w-[1600px] mx-auto w-full relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <div className="h-8 w-64 bg-muted/60 rounded-xl animate-pulse" />
            <div className="h-4 w-96 bg-muted/40 rounded-lg animate-pulse" />
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-28 bg-muted/60 rounded-xl animate-pulse" />
            <div className="h-10 w-28 bg-muted/60 rounded-xl animate-pulse" />
          </div>
        </div>

        {/* Skeleton KPI grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="h-32 rounded-2xl bg-card/40 border border-border/30 p-5 space-y-3 animate-pulse">
              <div className="flex justify-between items-center">
                <div className="h-4 w-24 bg-muted/60 rounded" />
                <div className="h-8 w-8 bg-muted/60 rounded-xl" />
              </div>
              <div className="h-8 w-16 bg-muted/70 rounded" />
              <div className="h-3 w-28 bg-muted/40 rounded" />
            </div>
          ))}
        </div>

        {/* Skeleton Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 h-96 rounded-2xl bg-card/40 border border-border/30 p-6 animate-pulse" />
          <div className="h-96 rounded-2xl bg-card/40 border border-border/30 p-6 animate-pulse" />
        </div>
      </div>
    );
  }

  // ─── Error State View ───────────────────────────────────────────────────────
  if (isError || !data) {
    return (
      <div className="flex flex-col flex-1 p-6 md:p-8 space-y-6 animate-fade-in max-w-[1600px] mx-auto w-full items-center justify-center min-h-[60vh]">
        <div className="max-w-md w-full p-8 rounded-2xl bg-card/70 border border-rose-500/30 shadow-2xl text-center space-y-4">
          <div className="h-14 w-14 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 mx-auto flex items-center justify-center">
            <Icons.AlertTriangle className="h-7 w-7 stroke-[2.5]" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Unable to load dashboard data</h2>
          <p className="text-sm text-muted-foreground">
            {error instanceof Error ? error.message : 'Database connection error or network failure.'}
          </p>
          <Button
            onClick={() => refetch()}
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl gap-2 w-full mt-2"
          >
            <Icons.RotateCcw className="h-4 w-4" />
            Retry Connection
          </Button>
        </div>
      </div>
    );
  }

  const { overview, pageStatus, contentDistribution, activityTimeline, recentActivity, recentLeads, recentApplications, system } = data;

  // Real KPI Cards mapped directly from MongoDB statistics
  const kpiCardItems = [
    {
      id: 'kpi-pages',
      title: 'Total System Pages',
      value: overview.totalPages.value,
      subtext: overview.totalPages.subtext,
      trend: overview.totalPages.trend,
      iconName: 'FileText',
      color: 'ocean',
    },
    {
      id: 'kpi-published',
      title: 'Published Pages',
      value: overview.publishedPages.value,
      subtext: overview.publishedPages.subtext,
      trend: overview.publishedPages.trend,
      iconName: 'Globe',
      color: 'sage',
    },
    {
      id: 'kpi-drafts',
      title: 'Draft Pages',
      value: overview.draftPages.value,
      subtext: overview.draftPages.subtext,
      trend: overview.draftPages.trend,
      iconName: 'FileEdit',
      color: 'ocean',
    },
    {
      id: 'kpi-blog',
      title: 'Blog / Insights',
      value: overview.blogPosts.value,
      subtext: overview.blogPosts.subtext,
      trend: overview.blogPosts.trend,
      iconName: 'Newspaper',
      color: 'ocean',
    },
    {
      id: 'kpi-careers',
      title: 'Careers (Open Jobs)',
      value: overview.openJobs.value,
      subtext: overview.openJobs.subtext,
      trend: overview.openJobs.trend,
      iconName: 'Briefcase',
      color: 'sage',
    },
    {
      id: 'kpi-leads',
      title: 'Contact Leads',
      value: overview.contactLeads.value,
      subtext: overview.contactLeads.subtext,
      trend: overview.contactLeads.trend,
      iconName: 'MailCheck',
      color: 'sage',
    },
  ];

  return (
    <div className="flex flex-col flex-1 p-6 md:p-8 space-y-8 animate-fade-in max-w-[1600px] mx-auto w-full relative z-10">
      {/* ----------------------------------------------------
          Dashboard Header & Quick Actions Toolbar
         ---------------------------------------------------- */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground font-sans bg-clip-text text-transparent bg-gradient-to-r from-teal-800 to-cyan-600 dark:from-teal-400 dark:to-cyan-200">
              Control Center Dashboard
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase font-sans bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
              Live MongoDB
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1 font-sans">
            Real-time telemetry and management console for Veenero CMS pages, insights, leads, and jobs.
          </p>
        </div>

        {/* Toolbar: Refresh + Quick Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="rounded-xl border-border/40 bg-card/60 hover:bg-card text-xs font-bold gap-1.5 shadow-soft"
          >
            <Icons.RefreshCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin text-teal-600' : 'text-muted-foreground'}`} />
            <span>{isFetching ? 'Syncing...' : 'Refresh'}</span>
          </Button>

          <Button
            size="sm"
            onClick={() => handleQuickAction('qa-pages', 'Create New Page')}
            className="rounded-xl bg-card/60 hover:bg-card border border-border/40 text-foreground text-xs font-bold gap-1.5 shadow-soft hover:shadow-card hover:-translate-y-0.5"
          >
            <Icons.PlusCircle className="h-4 w-4 text-teal-600" />
            Create Page
          </Button>

          <Button
            size="sm"
            onClick={() => handleQuickAction('qa-blog', 'Publish Blog Post')}
            className="rounded-xl bg-card/60 hover:bg-card border border-border/40 text-foreground text-xs font-bold gap-1.5 shadow-soft hover:shadow-card hover:-translate-y-0.5"
          >
            <Icons.PlusCircle className="h-4 w-4 text-emerald-600" />
            New Blog Post
          </Button>

          <Button
            size="sm"
            onClick={() => handleQuickAction('qa-careers', 'Post Job Opening')}
            className="rounded-xl bg-card/60 hover:bg-card border border-border/40 text-foreground text-xs font-bold gap-1.5 shadow-soft hover:shadow-card hover:-translate-y-0.5"
          >
            <Icons.Briefcase className="h-4 w-4 text-teal-600" />
            Post Job
          </Button>

          <Button
            size="sm"
            onClick={() => handleQuickAction('qa-backup', 'Back Up CMS Data')}
            disabled={isBackingUp}
            className="rounded-xl bg-gradient-to-r from-teal-700 to-cyan-600 hover:from-teal-800 hover:to-cyan-700 text-white text-xs font-bold gap-1.5 shadow-soft hover:shadow-card hover:-translate-y-0.5"
          >
            <Icons.Download className={`h-4 w-4 ${isBackingUp ? 'animate-bounce' : ''}`} />
            {isBackingUp ? 'Exporting...' : 'Back Up CMS'}
          </Button>
        </div>
      </div>

      {/* ----------------------------------------------------
          KPI Cards Grid (6 Real Database Metrics)
         ---------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
        {kpiCardItems.map((card) => {
          const IconComponent = (Icons as any)[card.iconName];
          return (
            <div
              key={card.id}
              className="relative overflow-hidden bg-card/60 backdrop-blur-md border border-border/40 rounded-2xl p-5 shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
            >
              <div
                className={`absolute top-0 left-0 right-0 h-1 ${
                  card.color === 'ocean'
                    ? 'bg-gradient-to-r from-teal-700 to-cyan-600'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-500'
                }`}
              />
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground tracking-wide font-sans">
                  {card.title}
                </span>
                <div
                  className={`p-2 rounded-xl ${
                    card.color === 'ocean'
                      ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400'
                      : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                  }`}
                >
                  {IconComponent && <IconComponent className="h-4 w-4 stroke-[2]" />}
                </div>
              </div>

              <div className="mt-3">
                <div className="text-3xl font-extrabold tracking-tight text-foreground font-sans">
                  <OneShotCounter value={card.value} duration={900} />
                </div>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="text-[11px] text-muted-foreground font-sans">
                    {card.subtext}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ----------------------------------------------------
          Primary Analytics Visuals (CMS Activity + Page Status)
         ---------------------------------------------------- */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Real CMS Activity & Inquiries Timeline */}
        <ChartCard
          title="CMS Activity & Inquiries Timeline"
          description="Actual database create/update actions and client submissions over time"
          className="xl:col-span-2 bg-card/40 backdrop-blur-md border border-border/30 shadow-soft"
          headerActions={
            <div className="flex items-center gap-3">
              {/* Range Toggle */}
              <div className="inline-flex rounded-xl bg-muted/60 p-0.5 border border-border/40">
                {(['7d', '30d', '90d'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setTimelineRange(r)}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
                      timelineRange === r
                        ? 'bg-card text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {r.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Legend indicators */}
              <div className="hidden sm:flex items-center gap-2 text-xs font-sans text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-cyan-500" />
                  Content Edits
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-teal-600" />
                  Inquiries / Apps
                </span>
              </div>
            </div>
          }
        >
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={activityTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="editsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="inqGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f766e" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#0f766e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="opacity-40" />
              <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} stroke="#64748B" />
              <YAxis fontSize={10} tickLine={false} axisLine={false} stroke="#64748B" allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  borderRadius: '12px',
                  border: '1px solid hsl(var(--border))',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                }}
                labelStyle={{ fontWeight: 'bold' }}
              />
              <Area
                type="monotone"
                dataKey="contentEdits"
                stroke="#0ea5e9"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#editsGrad)"
                name="Content Edits"
              />
              <Area
                type="monotone"
                dataKey="inquiries"
                stroke="#0f766e"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#inqGrad)"
                name="Inquiries & Applications"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Real Page Status Donut Chart */}
        <ChartCard
          title="Page Status Distribution"
          description="Ratio of live published pages vs draft sections"
          className="bg-card/40 backdrop-blur-md border border-border/30 shadow-soft"
        >
          <div className="flex flex-col items-center justify-center h-full min-h-[300px]">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={pageStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={6}
                  dataKey="value"
                >
                  {pageStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            {/* Custom Dynamic Legend */}
            <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1.5 w-full text-xs font-sans px-4">
              {pageStatus.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground truncate">{item.name}</span>
                  <span className="font-bold text-foreground ml-auto">{item.value} pages</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>

      {/* ----------------------------------------------------
          Real Content Distribution & CMS Launchpad Grid
         ---------------------------------------------------- */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Content Distribution Bar Chart */}
        <ChartCard
          title="CMS Content Distribution"
          description="Total records managed per collection in MongoDB"
          className="bg-card/40 backdrop-blur-md border border-border/30 shadow-soft"
        >
          <div className="w-full h-full min-h-[280px]">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={contentDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="opacity-40" />
                <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} stroke="#64748B" />
                <YAxis fontSize={10} tickLine={false} axisLine={false} stroke="#64748B" allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    borderRadius: '12px',
                    border: '1px solid hsl(var(--border))',
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} name="Records in DB">
                  {contentDistribution.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* CMS Section Launchpad (Shortcuts to all 12 modules) */}
        <ChartCard
          title="CMS Section Launchpad"
          description="Instant shortcuts to all active content editors and lead managers"
          className="xl:col-span-2 bg-card/40 backdrop-blur-md border border-border/30 shadow-soft"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 py-1">
            {cmsLaunchpadItems.map((item, idx) => {
              const Icon = (Icons as any)[item.icon];
              return (
                <button
                  key={idx}
                  onClick={() => navigate(item.path)}
                  className="flex flex-col text-left p-3 rounded-xl bg-card/50 hover:bg-card border border-border/40 hover:border-teal-500/40 transition-all duration-200 shadow-soft hover:shadow-card hover:-translate-y-0.5 group"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className={`p-1.5 rounded-lg bg-muted/60 group-hover:bg-teal-50 dark:group-hover:bg-teal-950/40 transition-colors`}>
                      {Icon && <Icon className={`h-4 w-4 ${item.color}`} />}
                    </div>
                    <Icons.ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-teal-600 transition-colors" />
                  </div>
                  <span className="font-bold text-xs text-foreground mt-2 font-sans truncate">
                    {item.label}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-sans truncate mt-0.5">
                    {item.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </ChartCard>
      </div>

      {/* ----------------------------------------------------
          CMS Leads & Applications tables (Real Database Data)
         ---------------------------------------------------- */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Contact Leads */}
        <ChartCard
          title="Recent Contact Inquiries"
          description="Inquiries submitted through the public contact & demo forms"
          className="bg-card/40 backdrop-blur-md border border-border/30 shadow-soft"
          headerActions={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin/leads')}
              className="text-xs font-bold text-teal-600 hover:text-teal-700 hover:bg-teal-50 dark:hover:bg-teal-950/20 gap-1 rounded-xl"
            >
              <span>View All Leads</span>
              <Icons.ChevronRight className="h-3.5 w-3.5" />
            </Button>
          }
        >
          {recentLeads.length > 0 ? (
            <DataTable columns={leadColumns} data={recentLeads} />
          ) : (
            <div className="py-12 text-center text-xs text-muted-foreground font-sans">
              No recent inquiries found in database.
            </div>
          )}
        </ChartCard>

        {/* Recent Job Applications */}
        <ChartCard
          title="Recent Job Applications"
          description="Candidate applications submitted via the public careers portal"
          className="bg-card/40 backdrop-blur-md border border-border/30 shadow-soft"
          headerActions={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin/job-applications')}
              className="text-xs font-bold text-teal-600 hover:text-teal-700 hover:bg-teal-50 dark:hover:bg-teal-950/20 gap-1 rounded-xl"
            >
              <span>View All Applications</span>
              <Icons.ChevronRight className="h-3.5 w-3.5" />
            </Button>
          }
        >
          {recentApplications.length > 0 ? (
            <DataTable columns={appColumns} data={recentApplications} />
          ) : (
            <div className="py-12 text-center text-xs text-muted-foreground font-sans">
              No recent job applications found in database.
            </div>
          )}
        </ChartCard>
      </div>

      {/* ----------------------------------------------------
          Real Activity Feed & System Diagnostics
         ---------------------------------------------------- */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* System Activity Feed (Real events across collections) */}
        <ChartCard
          title="Recent System Activity Feed"
          description="Chronological log of content updates, inquiries, and applications"
          className="xl:col-span-2 bg-card/40 backdrop-blur-md border border-border/30 shadow-soft"
        >
          {recentActivity.length > 0 ? (
            <ActivityFeed activities={recentActivity} />
          ) : (
            <div className="py-12 text-center text-xs text-muted-foreground font-sans">
              No recent events logged yet.
            </div>
          )}
        </ChartCard>

        {/* System Diagnostics & Telemetry Summary */}
        <ChartCard
          title="Database & Service Health"
          description="Real-time backend infrastructure telemetry"
          className="bg-card/40 backdrop-blur-md border border-border/30 shadow-soft"
        >
          <div className="space-y-4 py-2">
            <div className="p-3.5 rounded-xl bg-card/60 border border-border/40 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                  <Icons.Database className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">MongoDB Connection</p>
                  <p className="text-[10px] text-muted-foreground">Atlas Primary Cluster</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-0.5 rounded-full">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Connected
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-card/60 border border-border/40 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-teal-50 text-teal-700 dark:bg-teal-950/30 dark:text-teal-400">
                  <Icons.Clock className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">API Server Uptime</p>
                  <p className="text-[10px] text-muted-foreground">Veenero Express CMS</p>
                </div>
              </div>
              <span className="text-xs font-bold text-foreground font-mono">
                {Math.floor(system.serverUptime / 60)} mins
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-card/60 border border-border/40 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-sky-50 text-sky-700 dark:bg-sky-950/30 dark:text-sky-400">
                  <Icons.Image className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">Managed Media</p>
                  <p className="text-[10px] text-muted-foreground">Cloudinary assets</p>
                </div>
              </div>
              <span className="text-xs font-bold text-foreground font-mono">
                {overview.mediaAssets.value} files
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-card/60 border border-border/40 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-violet-50 text-violet-700 dark:bg-violet-950/30 dark:text-violet-400">
                  <Icons.HelpCircle className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">Active FAQs</p>
                  <p className="text-[10px] text-muted-foreground">Public questions</p>
                </div>
              </div>
              <span className="text-xs font-bold text-foreground font-mono">
                {overview.faqs.value} items
              </span>
            </div>
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

export default Dashboard;
