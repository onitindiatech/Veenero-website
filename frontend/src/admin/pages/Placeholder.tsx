import React from 'react';
import { useLocation } from 'react-router-dom';
import * as Icons from 'lucide-react';

export const Placeholder: React.FC = () => {
  const location = useLocation();

  // Get name from path, e.g., /admin/sites -> Sites & Facilities
  const getPageTitle = (pathname: string) => {
    const segment = pathname.split('/').pop() || 'dashboard';
    switch (segment) {
      case 'sites':
        return 'Sites & Facilities';
      case 'monitoring':
        return 'Water Monitoring';
      case 'analytics':
        return 'Analytics & Reports';
      case 'risk':
        return 'Risk Management';
      case 'insights':
        return 'AI Insights & Audits';
      case 'reports':
        return 'Reports & Exports';
      case 'pages':
        return 'CMS: Pages';
      case 'blog':
        return 'CMS: Blog / Insights';
      case 'media':
        return 'CMS: Media Library';
      case 'casestudies':
        return 'CMS: Case Studies';
      case 'faqs':
        return 'CMS: FAQs';
      case 'testimonials':
        return 'CMS: Testimonials';
      case 'partners':
        return 'CMS: Partners';
      case 'leads':
        return 'CRM: Leads';
      case 'contact':
        return 'CRM: Contact Requests';
      case 'newsletters':
        return 'CRM: Newsletters';
      case 'users':
        return 'User Management';
      case 'roles':
        return 'Roles & Permissions';
      case 'settings':
        return 'System Settings';
      case 'audit':
        return 'Audit Logs';
      case 'health':
        return 'System Health';
      default:
        return segment.charAt(0).toUpperCase() + segment.slice(1);
    }
  };

  const title = getPageTitle(location.pathname);

  return (
    <div className="flex flex-col flex-1 p-6 md:p-8 animate-fade-in">
      {/* Breadcrumb path */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground font-sans mb-6">
        <span>Admin</span>
        <Icons.ChevronRight className="h-3 w-3" />
        <span className="text-foreground/80">{title}</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-border/60 rounded-2xl bg-card/10 p-8 text-center min-h-[450px]">
        <div className="p-4 rounded-full bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400 mb-4 animate-wave">
          <Icons.Wrench className="h-10 w-10 stroke-[1.5]" />
        </div>
        <h2 className="text-2xl font-bold text-foreground font-sans tracking-tight mb-2">
          {title} Control Center
        </h2>
        <p className="text-sm text-muted-foreground max-w-md font-sans mb-6">
          This portal section is currently under development in Phase 2. All operations, forms, and tables will sync with the direct live backend API.
        </p>
        <div className="flex items-center gap-4 text-xs font-sans text-muted-foreground bg-muted/50 px-4 py-2 rounded-lg">
          <span className="flex items-center gap-1.5 font-semibold text-teal-600 dark:text-teal-400">
            <Icons.Sparkles className="h-3.5 w-3.5" />
            Veenero OS v1.0
          </span>
          <span className="h-3 w-[1px] bg-border" />
          <span>Mock environment active</span>
        </div>
      </div>
    </div>
  );
};
export default Placeholder;
