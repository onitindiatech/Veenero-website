import React from 'react';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import * as Icons from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

// Reusable Components
import { StatCard } from '../components/StatCard';
import { ChartCard } from '../components/ChartCard';
import { DataTable } from '../components/DataTable';
import { ActivityFeed } from '../components/ActivityFeed';

// Mock Data
import {
  kpiCards,
  cmsActivityData,
  pageStatusData,
  recentActivity,
  recentLeads,
  recentApplications,
  quickActions,
} from '../data/dashboard.mock';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleQuickAction = (label: string, actionId: string) => {
    if (actionId === 'qa-pages') {
      navigate('/admin/pages');
      toast.success('Redirected to Pages', {
        description: 'Opening Page Management console.',
      });
    } else if (actionId === 'qa-blog') {
      navigate('/admin/blog');
      toast.success('Redirected to Blog', {
        description: 'Opening Blog / Insights editor.',
      });
    } else if (actionId === 'qa-careers') {
      navigate('/admin/careers');
      toast.success('Redirected to Careers', {
        description: 'Opening Careers job poster.',
      });
    } else {
      toast.info('Action Triggered', {
        description: `Executing action: "${label}".`,
      });
    }
  };

  // Define Columns for tables
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
      header: 'Company',
      accessorKey: 'company',
    },
    {
      header: 'Submitted',
      accessorKey: 'date',
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row: any) => (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold font-sans uppercase tracking-wider ${
            row.status === 'new'
              ? 'text-teal-700 bg-teal-50 dark:text-teal-400 dark:bg-teal-950/20'
              : row.status === 'contacted'
              ? 'text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/20'
              : 'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/20'
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

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
      header: 'Target Position',
      accessorKey: 'position',
    },
    {
      header: 'Applied Date',
      accessorKey: 'appliedDate',
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row: any) => (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold font-sans uppercase tracking-wider ${
            row.status === 'pending'
              ? 'text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/20'
              : row.status === 'reviewing'
              ? 'text-teal-700 bg-teal-50 dark:text-teal-400 dark:bg-teal-950/20'
              : 'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/20'
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col flex-1 p-6 md:p-8 space-y-8 animate-fade-in max-w-[1600px] mx-auto w-full relative z-10">
      {/* ----------------------------------------------------
          Dashboard Header & Quick Actions Toolbar
         ---------------------------------------------------- */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground font-sans bg-clip-text text-transparent bg-gradient-to-r from-teal-800 to-cyan-600 dark:from-teal-400 dark:to-cyan-200">
            Control Center Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1 font-sans">
            Veenero site pages, insights content, leads and system settings.
          </p>
        </div>

        {/* Quick actions top pill */}
        <div className="flex items-center gap-2 flex-wrap">
          {quickActions.map((action) => {
            const Icon = (Icons as any)[action.iconName];
            return (
              <button
                key={action.id}
                onClick={() => handleQuickAction(action.label, action.id)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold font-sans transition-all duration-200 bg-card/60 hover:bg-card border border-border/40 text-foreground shadow-soft hover:shadow-card hover:-translate-y-0.5"
              >
                {Icon && (
                  <Icon
                    className={`h-4 w-4 ${
                      action.color === 'ocean' ? 'text-teal-600' : 'text-emerald-600'
                    }`}
                  />
                )}
                {action.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ----------------------------------------------------
          KPI Cards Grid (6 Cards)
         ---------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
        {kpiCards.map((card) => (
          <StatCard key={card.id} {...card} />
        ))}
      </div>

      {/* ----------------------------------------------------
          Primary Analytics Visuals
         ---------------------------------------------------- */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Large CMS & Public Traffic Chart (Area/Line) */}
        <ChartCard
          title="Website Traffic & CMS Updates"
          description="Daily unique page views mapped against CMS content modifications"
          className="xl:col-span-2 bg-card/40 backdrop-blur-md border border-border/30 shadow-soft"
          headerActions={
            <div className="flex items-center gap-1.5 text-xs font-sans text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-teal-600" />
                Page Views
              </span>
              <span className="h-3 w-[1px] bg-border mx-1" />
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-cyan-500" />
                CMS Edits
              </span>
            </div>
          }
        >
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={cmsActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f766e" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#0f766e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="editsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="opacity-40" />
              <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} stroke="#64748B" />
              <YAxis fontSize={10} tickLine={false} axisLine={false} stroke="#64748B" />
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))' }}
                labelStyle={{ fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="pageViews" stroke="#0f766e" strokeWidth={2.5} fillOpacity={1} fill="url(#viewsGradient)" name="Page Views" />
              <Area type="monotone" dataKey="edits" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#editsGradient)" name="Content Edits" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Page Status distribution (Donut Chart) */}
        <ChartCard
          title="Page Status Distribution"
          description="Ratio of active published pages vs draft sections"
          className="bg-card/40 backdrop-blur-md border border-border/30 shadow-soft"
        >
          <div className="flex flex-col items-center justify-center h-full min-h-[300px]">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={pageStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={6}
                  dataKey="value"
                >
                  {pageStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            {/* Custom Legend */}
            <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1.5 w-full text-xs font-sans px-4">
              {pageStatusData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0 animate-pulse" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground truncate">{item.name}</span>
                  <span className="font-bold text-foreground ml-auto">{item.value} pages</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>

      {/* ----------------------------------------------------
          CMS Leads & Applications tables
         ---------------------------------------------------- */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Contact Leads */}
        <ChartCard
          title="Recent Contact Leads"
          description="Recent client inquiries submitted via public contact form"
          className="bg-card/40 backdrop-blur-md border border-border/30 shadow-soft"
        >
          <DataTable columns={leadColumns} data={recentLeads} />
        </ChartCard>

        {/* Recent Job Applications */}
        <ChartCard
          title="Recent Job Applications"
          description="Recent applicants submissions from the public careers section"
          className="bg-card/40 backdrop-blur-md border border-border/30 shadow-soft"
        >
          <DataTable columns={appColumns} data={recentApplications} />
        </ChartCard>
      </div>

      {/* ----------------------------------------------------
          System Activity Log feed
         ---------------------------------------------------- */}
      <div className="grid grid-cols-1 gap-6">
        <ChartCard
          title="Recent Activity Feed"
          description="Audited sequence of events performed in content management modules"
          className="bg-card/40 backdrop-blur-md border border-border/30 shadow-soft"
        >
          <ActivityFeed activities={recentActivity} />
        </ChartCard>
      </div>
    </div>
  );
};

export default Dashboard;
