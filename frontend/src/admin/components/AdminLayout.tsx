import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link, Outlet } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';

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
        <div className="h-16 flex items-center gap-3 px-6 border-b border-border/30 overflow-hidden shrink-0">
          <div className="p-2 rounded-xl bg-gradient-to-br from-teal-600 to-cyan-600 shadow-md text-white shrink-0">
            <Icons.Droplet className="h-5 w-5 fill-white/10" />
          </div>
          {!isSidebarCollapsed && (
            <span className="font-extrabold text-sm tracking-wider font-sans bg-clip-text text-transparent bg-gradient-to-r from-teal-700 to-cyan-600">
              VEENERO <span className="text-teal-500 font-light">OS</span>
            </span>
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
          <div className="h-16 flex items-center justify-between px-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-teal-600 text-white">
                <Icons.Droplet className="h-5 w-5" />
              </div>
              <span className="font-extrabold text-sm tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-teal-700 to-cyan-600">
                VEENERO <span className="text-teal-500 font-light">OS</span>
              </span>
            </div>
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
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header */}
        <header className="h-16 border-b border-border/40 bg-card/60 backdrop-blur-md flex items-center justify-between px-6 z-10 shrink-0">
          <div className="flex items-center gap-4">
            {/* Hamburger Trigger for Mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-muted-foreground hover:text-foreground"
              onClick={() => setIsMobileOpen(true)}
            >
              <Icons.Menu className="h-5.5 w-5.5" />
            </Button>

            {/* Breadcrumb Info */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-muted-foreground font-sans">
              <span>Veenero Admin</span>
              <Icons.ChevronRight className="h-3.5 w-3.5 stroke-[2.5]" />
              <span className="text-foreground font-bold">{currentRouteName()}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick search input */}
            <div className="relative hidden lg:block w-64">
              <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
              <input
                type="text"
                placeholder="Search facility stats..."
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
                  className="absolute right-0 mt-2 w-80 bg-card border border-border/60 rounded-xl shadow-2xl p-4 z-30 animate-fade-in"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between pb-2.5 border-b border-border/40">
                    <span className="text-xs font-bold text-foreground font-sans">Active Notifications</span>
                    <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950/20 px-1.5 py-0.5 rounded-full font-sans">
                      4 Urgent
                    </span>
                  </div>
                  <div className="mt-2 space-y-2 max-h-60 overflow-y-auto no-scrollbar">
                    <div className="p-2 hover:bg-muted/40 rounded-lg text-xs font-sans border-l-2 border-rose-500">
                      <p className="font-bold text-foreground">Austin Datacenter Flow Spike</p>
                      <p className="text-muted-foreground mt-0.5">Flow loop exceeded limits by 45%.</p>
                      <span className="text-[10px] text-muted-foreground/60 block mt-1">10 mins ago</span>
                    </div>
                    <div className="p-2 hover:bg-muted/40 rounded-lg text-xs font-sans border-l-2 border-amber-500">
                      <p className="font-bold text-foreground">Pressure Drop in Chicago</p>
                      <p className="text-muted-foreground mt-0.5">Differential pressure dropped in Boiler loop.</p>
                      <span className="text-[10px] text-muted-foreground/60 block mt-1">42 mins ago</span>
                    </div>
                    <div className="p-2 hover:bg-muted/40 rounded-lg text-xs font-sans border-l-2 border-sky-500">
                      <p className="font-bold text-foreground">Weekly report generated</p>
                      <p className="text-muted-foreground mt-0.5">Water Savings report is ready for export.</p>
                      <span className="text-[10px] text-muted-foreground/60 block mt-1">1 hr ago</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown menu */}
            <div className="relative">
              <button
                type="button"
                className="flex items-center gap-2 focus:outline-none"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsProfileOpen(!isProfileOpen);
                  setIsNotificationOpen(false);
                }}
              >
                <div className="h-8.5 w-8.5 rounded-xl bg-gradient-to-br from-teal-600 to-cyan-600 text-white flex items-center justify-center font-bold text-sm shadow-sm select-none">
                  {user?.name
                    ? user.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)
                    : 'AD'}
                </div>
                <div className="hidden sm:flex flex-col items-start text-left leading-none">
                  <span className="text-xs font-bold text-foreground font-sans">{user?.name || 'Admin User'}</span>
                  <span className="text-[9px] text-muted-foreground font-mono mt-0.5">{user?.role || 'Console Admin'}</span>
                </div>
                <Icons.ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              </button>

              {isProfileOpen && (
                <div
                  className="absolute right-0 mt-2 w-52 bg-card border border-border/60 rounded-xl shadow-2xl p-2.5 z-30 animate-fade-in text-xs font-sans font-medium"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-3 py-2 border-b border-border/40 mb-1.5">
                    <p className="font-bold text-foreground">Account Status</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Veenero Cloud Server 1</p>
                  </div>
                  <Link
                    to="/admin/settings"
                    className="flex items-center gap-2.5 w-full px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-muted/55 rounded-lg"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <Icons.Settings className="h-4 w-4" />
                    Console Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 w-full px-3 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg text-left font-bold"
                  >
                    <Icons.LogOut className="h-4 w-4" />
                    Sign Out Session
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Nested Content */}
        <main className="flex-1 overflow-y-auto bg-muted/20 flex flex-col relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
