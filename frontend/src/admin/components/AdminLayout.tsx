import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link, Outlet } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { VeeneroLogo } from '@/components/VeeneroLogo';
import veeneroLogo from '@/assets/veenero_logo.png';

// Define the structure of Sidebar Links
interface SidebarItem {
  label: string;
  path: string;
  iconName: string;
}

interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Session Terminated', {
        description: 'You have successfully logged out of the admin panel.',
      });
      navigate('/admin/login', { replace: true });
    } catch (err: any) {
      toast.error('Logout failed', {
        description: err.message || 'Something went wrong.',
      });
    }
  };

  // Define sidebar items
  const sidebarSections: SidebarSection[] = [
    {
      title: 'Overview',
      items: [
        { label: 'Dashboard', path: '/admin/dashboard', iconName: 'LayoutDashboard' },
      ],
    },
    {
      title: 'Content Management',
      items: [
        { label: 'Pages', path: '/admin/pages', iconName: 'FileEdit' },
        { label: 'Home CMS', path: '/admin/home', iconName: 'Layers' },
        { label: 'About CMS', path: '/admin/about', iconName: 'Info' },
        { label: 'Solutions CMS', path: '/admin/solutions', iconName: 'Cpu' },
        { label: 'Approach CMS', path: '/admin/approach', iconName: 'Compass' },
        { label: 'Impact CMS', path: '/admin/impact', iconName: 'Zap' },
        { label: 'Contact CMS', path: '/admin/contact', iconName: 'Phone' },
        { label: 'Blog / Insights', path: '/admin/blog', iconName: 'Newspaper' },
        { label: 'Careers', path: '/admin/careers', iconName: 'Briefcase' },
        { label: 'Case Studies', path: '/admin/casestudies', iconName: 'BookOpen' },
        { label: 'FAQs', path: '/admin/faqs', iconName: 'HelpCircle' },
        { label: 'Testimonials', path: '/admin/testimonials', iconName: 'MessageSquare' },
        { label: 'Partners', path: '/admin/partners', iconName: 'Users2' },
        { label: 'Media Library', path: '/admin/media', iconName: 'Image' },
      ],
    },
    {
      title: 'Website Management',
      items: [
        { label: 'Navigation', path: '/admin/navigation', iconName: 'Menu' },
        { label: 'Footer', path: '/admin/footer', iconName: 'Layout' },
        { label: 'SEO', path: '/admin/seo', iconName: 'Globe' },
        { label: 'Global Settings', path: '/admin/global-settings', iconName: 'Settings2' },
      ],
    },
    {
      title: 'Leads & Applications',
      items: [
        { label: 'Contact Leads', path: '/admin/leads', iconName: 'MailCheck' },
        { label: 'Job Applications', path: '/admin/job-applications', iconName: 'UserCheck' },
      ],
    },
    {
      title: 'System',
      items: [
        { label: 'Users & Roles', path: '/admin/users', iconName: 'Users' },
        { label: 'Activity Logs', path: '/admin/activity-logs', iconName: 'History' },
        { label: 'Settings', path: '/admin/settings', iconName: 'Sliders' },
      ],
    },
  ];

  // Helper to render icon dynamically
  const renderIcon = (name: string, className = "h-4.5 w-4.5") => {
    const Icon = (Icons as any)[name];
    return Icon ? <Icon className={className} /> : <Icons.HelpCircle className={className} />;
  };

  const currentRouteName = () => {
    const segment = location.pathname.split('/').pop() || '';
    if (segment === 'dashboard') return 'Dashboard';
    // Match with sidebar items
    for (const section of sidebarSections) {
      const match = section.items.find(item => item.path === location.pathname);
      if (match) return match.label;
    }
    return 'Admin';
  };

  // Close dropdowns on click outside
  useEffect(() => {
    const handleOutsideClick = () => {
      setIsNotificationOpen(false);
      setIsProfileOpen(false);
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  return (
    <div className="min-h-screen flex bg-background text-foreground overflow-hidden font-sans relative">
      {/* Premium Water-inspired flowing background blobs */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-teal-500/5 dark:bg-teal-500/3 blur-[120px] pointer-events-none animate-float" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-cyan-500/5 dark:bg-cyan-500/3 blur-[150px] pointer-events-none animate-float animation-delay-600" />
      
      {/* Subtle pulsing water ripple elements */}
      <div className="absolute top-[25%] left-[20%] pointer-events-none overflow-hidden opacity-[0.25] dark:opacity-[0.15]">
        <div className="h-40 w-40 rounded-full border border-teal-500/10 animate-ripple" />
        <div className="h-40 w-40 rounded-full border border-teal-500/10 animate-ripple animation-delay-800" />
      </div>
      <div className="absolute bottom-[30%] right-[15%] pointer-events-none overflow-hidden opacity-[0.2] dark:opacity-[0.1]">
        <div className="h-48 w-48 rounded-full border border-cyan-500/10 animate-ripple animation-delay-400" />
      </div>

      {/* ----------------------------------------------------
          Sidebar: Desktop
         ---------------------------------------------------- */}
      <aside
        className={cn(
          "hidden md:flex flex-col border-r border-border/40 bg-card/40 backdrop-blur-md transition-all duration-300 relative z-20 shrink-0",
          isSidebarCollapsed ? "w-[72px]" : "w-[260px]"
        )}
      >
        {/* Brand header */}
        <div
          className={cn(
            "h-16 flex items-center border-b border-border/30 overflow-hidden shrink-0 transition-all duration-300",
            isSidebarCollapsed ? "justify-center px-2" : "px-5"
          )}
        >
          {isSidebarCollapsed ? (
            <Link to="/admin/dashboard" title="Veenero OS" className="flex items-center justify-center select-none" aria-label="Veenero OS Home">
              <div className="h-9 w-9 rounded-xl bg-card border border-border/50 shadow-sm flex items-center justify-center overflow-hidden p-1.5 hover:border-teal-500/50 transition-colors">
                <img src={veeneroLogo} alt="Veenero" className="h-full w-full object-cover object-left" />
              </div>
            </Link>
          ) : (
            <Link to="/admin/dashboard" className="flex items-center gap-2 select-none group py-1" aria-label="Veenero OS Dashboard">
              <VeeneroLogo
                variant="default"
                className="h-8 w-auto max-w-[170px] object-contain transition-opacity group-hover:opacity-90"
                loading="eager"
              />
              <span className="text-[10px] font-extrabold tracking-widest px-1.5 py-0.5 rounded-md bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 font-mono shrink-0">
                OS
              </span>
            </Link>
          )}
        </div>

        {/* Sidebar Navigation items */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-6 no-scrollbar">
          {sidebarSections.map((section, idx) => (
            <div key={idx} className="space-y-1.5">
              {!isSidebarCollapsed ? (
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-3 block">
                  {section.title}
                </span>
              ) : (
                <div className="h-[1px] bg-border/40 my-3 mx-1" />
              )}

              <div className="space-y-1">
                {section.items.map((item, itemIdx) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={itemIdx}
                      to={item.path}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
                        isActive
                          ? "bg-teal-600 text-white shadow-soft"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                      title={isSidebarCollapsed ? item.label : undefined}
                    >
                      <div className="shrink-0">{renderIcon(item.iconName)}</div>
                      {!isSidebarCollapsed && (
                        <span className="truncate leading-none">{item.label}</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Toggle sidebar state button */}
        <div className="p-4 border-t border-border/30 shrink-0">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground px-2 py-2"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          >
            {isSidebarCollapsed ? (
              <Icons.ChevronRight className="h-5 w-5 mx-auto" />
            ) : (
              <>
                <Icons.ChevronLeft className="h-5 w-5" />
                <span className="text-xs font-bold font-sans">Collapse Sidebar</span>
              </>
            )}
          </Button>
        </div>
      </aside>

      {/* ----------------------------------------------------
          Sidebar: Mobile Drawer
         ---------------------------------------------------- */}
      <div
        className={cn(
          "fixed inset-0 bg-[#071318]/50 backdrop-blur-sm z-30 transition-opacity duration-300 md:hidden",
          isMobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsMobileOpen(false)}
      >
        <aside
          className={cn(
            "w-[260px] h-full bg-card border-r border-border flex flex-col transition-transform duration-300",
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-16 flex items-center justify-between px-5 border-b border-border shrink-0">
            <Link
              to="/admin/dashboard"
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center gap-2 select-none"
              aria-label="Veenero OS Dashboard"
            >
              <VeeneroLogo
                variant="default"
                className="h-7 w-auto max-w-[160px] object-contain"
                loading="eager"
              />
              <span className="text-[10px] font-extrabold tracking-widest px-1.5 py-0.5 rounded-md bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 font-mono shrink-0">
                OS
              </span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileOpen(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Icons.X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
            {sidebarSections.map((section, idx) => (
              <div key={idx} className="space-y-1.5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-3 block">
                  {section.title}
                </span>
                <div className="space-y-1">
                  {section.items.map((item, itemIdx) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={itemIdx}
                        to={item.path}
                        onClick={() => setIsMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
                          isActive
                            ? "bg-teal-600 text-white"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <div className="shrink-0">{renderIcon(item.iconName)}</div>
                        <span className="truncate leading-none">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className="p-4 border-t border-border">
            <Button
              variant="destructive"
              className="w-full justify-center gap-2"
              onClick={handleLogout}
            >
              <Icons.LogOut className="h-4 w-4" />
              Logout Session
            </Button>
          </div>
        </aside>
      </div>

      {/* ----------------------------------------------------
          Main Layout Work Area
         ---------------------------------------------------- */}
      <div className="flex-1 flex flex-col min-w-0 relative" style={{ minWidth: 0 }}>
        {/* Top Header */}
        <header className="h-16 border-b border-border/40 bg-card/60 backdrop-blur-md flex items-center justify-between px-6 z-50 shrink-0 relative">
          <div className="flex items-center gap-3 min-w-0">
            {/* Hamburger Trigger for Mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-muted-foreground hover:text-foreground shrink-0"
              onClick={() => setIsMobileOpen(true)}
            >
              <Icons.Menu className="h-5.5 w-5.5" />
            </Button>

            {/* Breadcrumb Info */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-muted-foreground font-sans min-w-0">
              <span className="shrink-0">Veenero Admin</span>
              <Icons.ChevronRight className="h-3.5 w-3.5 stroke-[2.5] shrink-0" />
              <span className="text-foreground font-bold truncate max-w-[140px] md:max-w-[200px] xl:max-w-none">{currentRouteName()}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Quick search input */}
            <div className="relative hidden md:block w-44 lg:w-56 xl:w-64">
              <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
              <input
                type="text"
                placeholder="Search CMS pages, leads..."
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-muted/40 border border-border/50 rounded-xl focus:outline-none focus:border-teal-500/60 focus:ring-1 focus:ring-teal-500/20 font-sans"
              />
            </div>

            {/* Notification drop block */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-muted-foreground hover:text-foreground rounded-xl"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsNotificationOpen(!isNotificationOpen);
                  setIsProfileOpen(false);
                }}
              >
                <Icons.Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-600 animate-pulse" />
              </Button>

              {isNotificationOpen && (
                <div
                  className="absolute right-0 mt-2.5 w-80 max-w-[calc(100vw-2rem)] bg-card/95 backdrop-blur-xl border border-border/60 rounded-2xl shadow-2xl p-4 z-[9999] animate-fade-in"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between pb-2.5 border-b border-border/40">
                    <span className="text-xs font-bold text-foreground font-sans">CMS Notifications</span>
                    <span className="text-[10px] font-semibold text-teal-600 bg-teal-50 dark:bg-teal-950/20 px-1.5 py-0.5 rounded-full font-sans">
                      System
                    </span>
                  </div>
                  <div className="mt-2 space-y-2 max-h-60 overflow-y-auto no-scrollbar">
                    <div className="p-2 hover:bg-muted/40 rounded-lg text-xs font-sans border-l-2 border-teal-500">
                      <p className="font-bold text-foreground">Dashboard Connected</p>
                      <p className="text-muted-foreground mt-0.5">Live data is streaming from MongoDB Atlas.</p>
                      <span className="text-[10px] text-muted-foreground/60 block mt-1">Just now</span>
                    </div>
                    <div className="p-2 hover:bg-muted/40 rounded-lg text-xs font-sans border-l-2 border-sky-500">
                      <p className="font-bold text-foreground">CMS Backup Available</p>
                      <p className="text-muted-foreground mt-0.5">Use the dashboard to export a full CMS snapshot.</p>
                      <span className="text-[10px] text-muted-foreground/60 block mt-1">System</span>
                    </div>
                    <div className="p-2 hover:bg-muted/40 rounded-lg text-xs font-sans border-l-2 border-emerald-500">
                      <p className="font-bold text-foreground">All Services Operational</p>
                      <p className="text-muted-foreground mt-0.5">API, media upload, and CMS routes are healthy.</p>
                      <span className="text-[10px] text-muted-foreground/60 block mt-1">Today</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown menu */}
            <div className="relative">
              <button
                type="button"
                className="flex items-center gap-2 focus:outline-none rounded-xl p-1 hover:bg-muted/40 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsProfileOpen(!isProfileOpen);
                  setIsNotificationOpen(false);
                }}
              >
                <div className="h-8.5 w-8.5 rounded-xl bg-gradient-to-br from-teal-600 to-cyan-600 text-white flex items-center justify-center font-bold text-sm shadow-sm select-none shrink-0">
                  {user?.name
                    ? user.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)
                    : 'AD'}
                </div>
                <div className="hidden sm:flex flex-col items-start text-left leading-none max-w-[120px] md:max-w-[150px]">
                  <span className="text-xs font-bold text-foreground font-sans truncate w-full">{user?.name || 'Admin User'}</span>
                  <span className="text-[9px] text-muted-foreground font-mono mt-0.5 truncate w-full">{user?.role || 'Console Admin'}</span>
                </div>
                <Icons.ChevronDown className={`h-3.5 w-3.5 text-muted-foreground shrink-0 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {isProfileOpen && (
                <div
                  className="absolute right-0 mt-2.5 w-64 max-w-[calc(100vw-2rem)] bg-card/95 backdrop-blur-xl border border-border/60 rounded-2xl shadow-2xl p-2 z-[9999] animate-fade-in text-xs font-sans ring-1 ring-black/5 dark:ring-white/5"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Account Status Header */}
                  <div className="px-3.5 py-3 border-b border-border/40 mb-1 rounded-xl bg-muted/30">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground tracking-tight text-xs">Account Status</span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Active
                      </span>
                    </div>
                    <div className="mt-1.5">
                      <p className="font-semibold text-foreground truncate text-xs">{user?.name || 'Super Admin'}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{user?.email || 'admin@veenerosolutions.com'}</p>
                    </div>
                    <div className="mt-2 pt-2 border-t border-border/30 flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                      <span>Server</span>
                      <span className="text-teal-600 dark:text-teal-400 font-semibold">Veenero Cloud 01</span>
                    </div>
                  </div>

                  {/* Menu Action Links */}
                  <div className="space-y-0.5 py-1">
                    <Link
                      to="/admin/careers"
                      className="flex items-center gap-2.5 w-full px-3 py-2.5 text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-xl transition-all duration-150 font-medium"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Icons.Briefcase className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0" />
                      <span>Post Job</span>
                    </Link>
                    <Link
                      to="/admin/settings"
                      className="flex items-center gap-2.5 w-full px-3 py-2.5 text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-xl transition-all duration-150 font-medium"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Icons.Settings className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span>Console Settings</span>
                    </Link>
                  </div>

                  <div className="h-[1px] bg-border/40 my-1 mx-1" />

                  {/* Sign Out Action */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 w-full px-3 py-2.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-all duration-150 font-bold text-left"
                  >
                    <Icons.LogOut className="h-4 w-4 shrink-0" />
                    <span>Sign Out Session</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Nested Content */}
        <main className="flex-1 overflow-y-auto bg-muted/20 flex flex-col relative z-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
