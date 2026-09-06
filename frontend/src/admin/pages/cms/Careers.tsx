import React, { useState, useEffect, useMemo } from 'react';
import { 
  Briefcase, Plus, Trash2, RotateCcw, Copy, Edit3, Eye, 
  Search, SlidersHorizontal, ArrowUpDown, ChevronDown, Check, X, AlertCircle, Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { careerService, Career } from '../../services/career.service';

export const Careers: React.FC = () => {
  const [careers, setCareers] = useState<Career[]>([]);
  const [deletedCareers, setDeletedCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Search states
  const [mainTab, setMainTab] = useState<'openings' | 'page-content'>('openings');
  const [pageSettings, setPageSettings] = useState<any>(null);
  const [pageSettingsLoading, setPageSettingsLoading] = useState(false);
  const [pageSettingsSaving, setPageSettingsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deptFilter, setDeptFilter] = useState<string>('all');
  const [locFilter, setLocFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

  // View state: 'active' or 'recycle'
  const [viewMode, setViewMode] = useState<'active' | 'recycle'>('active');

  // Drawer (add / edit)
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [formTitle, setFormTitle] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formDept, setFormDept] = useState('');
  const [formLoc, setFormLoc] = useState('');
  const [formType, setFormType] = useState('Full-time');
  const [formExperience, setFormExperience] = useState('');
  const [formShortDesc, setFormShortDesc] = useState('');
  const [formFullDesc, setFormFullDesc] = useState('');
  const [formAppUrl, setFormAppUrl] = useState('');
  const [formAppEmail, setFormAppEmail] = useState('');
  const [formSalaryRange, setFormSalaryRange] = useState('');
  const [formStatus, setFormStatus] = useState<'DRAFT' | 'PUBLISHED' | 'ACTIVE' | 'ARCHIVED' | 'CLOSED'>('DRAFT');
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formSortOrder, setFormSortOrder] = useState(0);

  // List fields
  const [responsibilities, setResponsibilities] = useState<string[]>([]);
  const [requirements, setRequirements] = useState<string[]>([]);
  const [niceToHave, setNiceToHave] = useState<string[]>([]);
  const [qualifications, setQualifications] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);

  // Input fields for list items
  const [respInput, setRespInput] = useState('');
  const [reqInput, setReqInput] = useState('');
  const [niceInput, setNiceInput] = useState('');
  const [qualInput, setQualInput] = useState('');
  const [skillInput, setSkillInput] = useState('');

  // Modals confirmation
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmPermDeleteId, setConfirmPermDeleteId] = useState<string | null>(null);

  // API Stats
  const [apiStats, setApiStats] = useState<any>(null);

  // Helper ID getter
  const getCareerId = (c: Career) => c.id || c._id || '';

  // ── Load Careers from API ──
  const loadCareers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await careerService.getAdminCareers();
      setCareers(res.data || []);
      if (res.stats) setApiStats(res.stats);
      
      const binData = await careerService.getRecycleBin();
      setDeletedCareers(binData);
    } catch (err: any) {
      setError(err.message || 'Failed to load career listings.');
    } finally {
      setLoading(false);
    }
  };

  const loadPageSettings = async () => {
    try {
      setPageSettingsLoading(true);
      const data = await careerService.getPageSettings();
      setPageSettings(data);
    } catch (err: any) {
      toast.error('Failed to load Career page settings', { description: err.message });
    } finally {
      setPageSettingsLoading(false);
    }
  };

  const handleSavePageSettings = async () => {
    if (!pageSettings) return;
    try {
      setPageSettingsSaving(true);
      const updated = await careerService.updatePageSettings(pageSettings);
      setPageSettings(updated);
      toast.success('Career page content saved successfully!');
    } catch (err: any) {
      toast.error('Failed to save Career page content', { description: err.message });
    } finally {
      setPageSettingsSaving(false);
    }
  };

  useEffect(() => {
    loadCareers();
    loadPageSettings();
  }, []);

  // ── Auto-generate Slug ──
  useEffect(() => {
    if (!editingId && formTitle) {
      const slug = formTitle
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormSlug(slug);
    }
  }, [formTitle, editingId]);

  // ── Extract unique filter options ──
  const departments = useMemo(() => {
    const list = viewMode === 'active' ? careers : deletedCareers;
    return Array.from(new Set(list.map((c) => c.department)));
  }, [careers, deletedCareers, viewMode]);

  const locations = useMemo(() => {
    const list = viewMode === 'active' ? careers : deletedCareers;
    return Array.from(new Set(list.map((c) => c.location)));
  }, [careers, deletedCareers, viewMode]);

  const types = useMemo(() => {
    const list = viewMode === 'active' ? careers : deletedCareers;
    return Array.from(new Set(list.map((c) => c.employmentType)));
  }, [careers, deletedCareers, viewMode]);

  // ── Filtered & Searched Careers ──
  const processedCareers = useMemo(() => {
    let result = viewMode === 'active' ? [...careers] : [...deletedCareers];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.department.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q) ||
          c.skills.some((s) => s.toLowerCase().includes(q))
      );
    }

    // Status filter
    if (viewMode === 'active' && statusFilter !== 'all') {
      result = result.filter((c) => c.status === statusFilter);
    }

    // Department filter
    if (deptFilter !== 'all') {
      result = result.filter((c) => c.department === deptFilter);
    }

    // Location filter
    if (locFilter !== 'all') {
      result = result.filter((c) => c.location === locFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      result = result.filter((c) => c.employmentType === typeFilter);
    }

    // Sort order
    result.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === 'title-asc') return a.title.localeCompare(b.title);
      if (sortBy === 'title-desc') return b.title.localeCompare(a.title);
      return 0;
    });

    return result;
  }, [careers, deletedCareers, viewMode, searchQuery, statusFilter, deptFilter, locFilter, typeFilter, sortBy]);

  // ── Stats calculation ──
  const stats = useMemo(() => {
    return {
      total: apiStats?.total ?? careers.length,
      published: apiStats?.published ?? careers.filter((c) => c.status === 'PUBLISHED' || c.status === 'ACTIVE').length,
      draft: apiStats?.drafts ?? careers.filter((c) => c.status === 'DRAFT').length,
      archived: apiStats?.archived ?? careers.filter((c) => c.status === 'ARCHIVED' || c.status === 'CLOSED').length,
      deleted: deletedCareers.length,
    };
  }, [careers, deletedCareers, apiStats]);

  // ── Open Create form ──
  const handleOpenAdd = () => {
    setEditingId(null);
    setFormTitle('');
    setFormSlug('');
    setFormDept('');
    setFormLoc('');
    setFormType('Full-time');
    setFormExperience('');
    setFormShortDesc('');
    setFormFullDesc('');
    setFormAppUrl('');
    setFormAppEmail('');
    setFormSalaryRange('');
    setFormStatus('DRAFT');
    setFormIsFeatured(false);
    setFormSortOrder(0);
    setResponsibilities([]);
    setRequirements([]);
    setNiceToHave([]);
    setQualifications([]);
    setSkills([]);
    setDrawerOpen(true);
  };

  // ── Open Edit form ──
  const handleOpenEdit = (career: Career) => {
    setEditingId(getCareerId(career));
    setFormTitle(career.title);
    setFormSlug(career.slug);
    setFormDept(career.department);
    setFormLoc(career.location);
    setFormType(career.employmentType);
    setFormExperience(career.experience);
    setFormShortDesc(career.shortDescription);
    setFormFullDesc(career.description);
    setFormAppUrl(career.applicationUrl || '');
    setFormAppEmail(career.applicationEmail || '');
    setFormSalaryRange(career.salaryRange || '');
    setFormStatus((career.status === 'ACTIVE' ? 'PUBLISHED' : career.status === 'CLOSED' ? 'ARCHIVED' : career.status) as any);
    setFormIsFeatured(career.isFeatured);
    setFormSortOrder(career.sortOrder);
    setResponsibilities(career.responsibilities || []);
    setRequirements(career.requirements || []);
    setNiceToHave(career.niceToHave || []);
    setQualifications(career.qualifications || []);
    setSkills(career.skills || []);
    setDrawerOpen(true);
  };

  // ── Save Form (Create or Update) ──
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formDept || !formLoc || !formShortDesc || !formFullDesc || !formExperience) {
      toast.error('Required Fields Missing', { description: 'Please fill in all mandatory fields.' });
      return;
    }

    const payload: Partial<Career> = {
      title: formTitle,
      slug: formSlug,
      department: formDept,
      location: formLoc,
      employmentType: formType,
      experience: formExperience,
      shortDescription: formShortDesc,
      description: formFullDesc,
      applicationUrl: formAppUrl || undefined,
      applicationEmail: formAppEmail || undefined,
      salaryRange: formSalaryRange || undefined,
      status: formStatus,
      isFeatured: formIsFeatured,
      sortOrder: Number(formSortOrder),
      responsibilities,
      requirements,
      niceToHave,
      qualifications,
      skills,
    };

    try {
      if (editingId) {
        await careerService.updateCareer(editingId, payload);
        toast.success('Job Opening Updated');
      } else {
        await careerService.createCareer(payload);
        toast.success('Job Opening Created');
      }
      setDrawerOpen(false);
      loadCareers();
    } catch (err: any) {
      toast.error('Operation Failed', { description: err.message || 'Check form parameters.' });
    }
  };

  // ── Change Status inline ──
  const handleStatusChange = async (id: string, current: string) => {
    const nextMap: Record<string, 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'> = {
      'DRAFT': 'PUBLISHED',
      'PUBLISHED': 'ARCHIVED',
      'ACTIVE': 'ARCHIVED',
      'ARCHIVED': 'DRAFT',
      'CLOSED': 'DRAFT',
    };
    const nextStatus = nextMap[current] || 'DRAFT';
    try {
      await careerService.updateCareerStatus(id, nextStatus);
      toast.success(`Status updated to ${nextStatus}`);
      loadCareers();
    } catch (err: any) {
      toast.error('Status Update Failed', { description: err.message });
    }
  };

  // ── Duplicate Career ──
  const handleDuplicate = async (career: Career) => {
    try {
      await careerService.duplicateCareer(getCareerId(career));
      toast.success('Career Opening Duplicated', { description: 'Created new draft entry.' });
      loadCareers();
    } catch (err: any) {
      toast.error('Duplication Failed', { description: err.message });
    }
  };

  // ── Soft Delete ──
  const handleSoftDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      await careerService.deleteCareer(confirmDeleteId);
      toast.success('Job moved to recycle bin');
      setConfirmDeleteId(null);
      loadCareers();
    } catch (err: any) {
      toast.error('Delete Failed', { description: err.message });
    }
  };

  // ── Restore deleted ──
  const handleRestore = async (id: string) => {
    try {
      await careerService.restoreCareer(id);
      toast.success('Job opening restored to listings');
      loadCareers();
    } catch (err: any) {
      toast.error('Restore Failed', { description: err.message });
    }
  };

  // ── Permanent Delete ──
  const handlePermanentDelete = async () => {
    if (!confirmPermDeleteId) return;
    try {
      await careerService.permanentlyDeleteCareer(confirmPermDeleteId);
      toast.success('Job opening permanently removed from MongoDB');
      setConfirmPermDeleteId(null);
      loadCareers();
    } catch (err: any) {
      toast.error('Permanent Delete Failed', { description: err.message });
    }
  };

  // ── List Item Manipulations ──
  const addListItem = (type: 'resp' | 'req' | 'nice' | 'qual' | 'skill') => {
    if (type === 'resp' && respInput.trim()) {
      setResponsibilities([...responsibilities, respInput.trim()]);
      setRespInput('');
    } else if (type === 'req' && reqInput.trim()) {
      setRequirements([...requirements, reqInput.trim()]);
      setReqInput('');
    } else if (type === 'nice' && niceInput.trim()) {
      setNiceToHave([...niceToHave, niceInput.trim()]);
      setNiceInput('');
    } else if (type === 'qual' && qualInput.trim()) {
      setQualifications([...qualifications, qualInput.trim()]);
      setQualInput('');
    } else if (type === 'skill' && skillInput.trim()) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeListItem = (type: 'resp' | 'req' | 'nice' | 'qual' | 'skill', idx: number) => {
    if (type === 'resp') setResponsibilities(responsibilities.filter((_, i) => i !== idx));
    if (type === 'req') setRequirements(requirements.filter((_, i) => i !== idx));
    if (type === 'nice') setNiceToHave(niceToHave.filter((_, i) => i !== idx));
    if (type === 'qual') setQualifications(qualifications.filter((_, i) => i !== idx));
    if (type === 'skill') setSkills(skills.filter((_, i) => i !== idx));
  };

  return (
    <div className="p-6 md:p-8 space-y-8 font-sans max-w-7xl mx-auto relative z-10">
      
      {/* ── Title Heading ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Careers</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage job openings, applications and career content.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setViewMode(viewMode === 'active' ? 'recycle' : 'active')}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-2 ${
              viewMode === 'recycle'
                ? 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400'
                : 'bg-card border-border/80 text-muted-foreground hover:text-foreground'
            }`}
          >
            {viewMode === 'recycle' ? <Briefcase className="h-3.5 w-3.5" /> : <Trash2 className="h-3.5 w-3.5" />}
            {viewMode === 'recycle' ? 'View Open Openings' : `Recycle Bin (${stats.deleted})`}
          </button>
          
          {viewMode === 'active' && (
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-soft flex items-center gap-1.5 transition-all"
            >
              <Plus className="h-4 w-4" />
              Add Career
            </button>
          )}
        </div>
      </div>

      {/* ── Main CMS Tabs ── */}
      <div className="flex border-b border-border/60 gap-6">
        <button
          type="button"
          onClick={() => setMainTab('openings')}
          className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
            mainTab === 'openings'
              ? 'border-teal-600 text-teal-600 dark:text-teal-400'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Job Openings ({careers.length})
        </button>
        <button
          type="button"
          onClick={() => setMainTab('page-content')}
          className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
            mainTab === 'page-content'
              ? 'border-teal-600 text-teal-600 dark:text-teal-400'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Page Content &amp; Hero
        </button>
      </div>

      {mainTab === 'openings' ? (
        <>
      {/* ── Stats Panels ── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Openings', count: stats.total, color: 'text-foreground' },
          { label: 'Active', count: stats.active, color: 'text-teal-600 dark:text-teal-400' },
          { label: 'Draft', count: stats.draft, color: 'text-amber-500' },
          { label: 'Closed', count: stats.closed, color: 'text-rose-500' },
          { label: 'Deleted (Bin)', count: stats.deleted, color: 'text-gray-500' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-card p-5 border border-border/40 rounded-2xl shadow-sm">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              {stat.label}
            </span>
            <span className={`text-2xl font-extrabold mt-1 block ${stat.color}`}>
              {stat.count}
            </span>
          </div>
        ))}
      </div>

      {/* ── Filtering Area ── */}
      <div className="bg-card p-4 border border-border/40 rounded-2xl shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
          
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by title, department, location or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-muted/40 border border-border/60 rounded-xl focus:outline-none focus:border-teal-500/60"
            />
          </div>

          {/* Filtering dropdowns */}
          <div className="flex flex-wrap items-center gap-3">
            
            {viewMode === 'active' && (
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-card border border-border/80 rounded-xl focus:outline-none text-muted-foreground font-semibold"
              >
                <option value="all">All Statuses</option>
                <option value="ACTIVE">Active Only</option>
                <option value="DRAFT">Draft Only</option>
                <option value="CLOSED">Closed Only</option>
              </select>
            )}

            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-card border border-border/80 rounded-xl focus:outline-none text-muted-foreground font-semibold"
            >
              <option value="all">All Departments</option>
              {departments.map((d, i) => <option key={i} value={d}>{d}</option>)}
            </select>

            <select
              value={locFilter}
              onChange={(e) => setLocFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-card border border-border/80 rounded-xl focus:outline-none text-muted-foreground font-semibold"
            >
              <option value="all">All Locations</option>
              {locations.map((l, i) => <option key={i} value={l}>{l}</option>)}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 text-xs bg-card border border-border/80 rounded-xl focus:outline-none text-muted-foreground font-semibold"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title-asc">Title (A-Z)</option>
              <option value="title-desc">Title (Z-A)</option>
            </select>

          </div>

        </div>
      </div>

      {/* ── Main Data View ── */}
      {loading ? (
        <div className="bg-card p-12 border border-border/40 rounded-2xl flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 text-teal-600 animate-spin" />
          <p className="text-xs text-muted-foreground font-semibold">Fetching Careers telemetry...</p>
        </div>
      ) : error ? (
        <div className="bg-rose-50 dark:bg-rose-950/10 border border-rose-100 p-6 rounded-2xl text-rose-700 text-xs font-semibold flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-rose-500" />
          <span>Error loading data: {error}</span>
        </div>
      ) : processedCareers.length === 0 ? (
        <div className="bg-card p-12 border border-border/40 rounded-2xl text-center font-sans space-y-2">
          <Briefcase className="h-10 w-10 text-muted-foreground/60 mx-auto" />
          <h3 className="text-base font-bold text-foreground">No openings found</h3>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto">
            {viewMode === 'recycle' 
              ? 'Your recycle bin is clean. Deleted openings will appear here.'
              : 'Try adjusting your search filters or add a new job opening.'}
          </p>
        </div>
      ) : (
        <div className="bg-card border border-border/40 rounded-2xl shadow-sm overflow-hidden font-sans">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/30 bg-muted/20 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  <th className="px-6 py-4">Job Title</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Featured</th>
                  <th className="px-6 py-4">Last Updated</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20 text-xs font-medium">
                {processedCareers.map((career) => {
                  const careerId = getCareerId(career);
                  return (
                  <tr key={careerId} className="hover:bg-muted/15 transition-colors">
                    
                    {/* Title */}
                    <td className="px-6 py-4 font-bold text-foreground">
                      <div>
                        {career.title}
                        <span className="text-[10px] text-muted-foreground font-mono block mt-0.5">
                          /{career.slug}
                        </span>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="px-6 py-4 text-muted-foreground">{career.department}</td>
                    
                    {/* Location */}
                    <td className="px-6 py-4 text-muted-foreground">{career.location}</td>

                    {/* Employment Type */}
                    <td className="px-6 py-4 text-muted-foreground">{career.employmentType}</td>

                    {/* Status Badge */}
                    <td className="px-6 py-4 text-center">
                      {viewMode === 'recycle' ? (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 uppercase">
                          TRASHED
                        </span>
                      ) : (
                        <button
                          onClick={() => handleStatusChange(careerId, career.status)}
                          className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase transition-all ${
                            career.status === 'PUBLISHED' || career.status === 'ACTIVE'
                              ? 'bg-teal-50 dark:bg-teal-950/20 text-teal-700 dark:text-teal-400'
                              : career.status === 'DRAFT'
                              ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400'
                              : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          {career.status}
                        </button>
                      )}
                    </td>

                    {/* Featured */}
                    <td className="px-6 py-4 text-center">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                        career.isFeatured ? 'bg-teal-600/10 text-teal-700 dark:text-teal-400' : 'text-muted-foreground/50'
                      }`}>
                        {career.isFeatured ? '★ Yes' : 'No'}
                      </span>
                    </td>

                    {/* Last Updated */}
                    <td className="px-6 py-4 text-muted-foreground">
                      <div>
                        {new Date(career.updatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        <span className="text-[9px] text-muted-foreground/60 block mt-0.5">By {career.updatedBy}</span>
                      </div>
                    </td>

                    {/* Actions Menu */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        {viewMode === 'active' ? (
                          <>
                            <button
                              onClick={() => handleOpenEdit(career)}
                              className="p-1.5 text-muted-foreground hover:text-teal-600 hover:bg-muted/60 rounded-lg transition-colors"
                              title="Edit Opening"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDuplicate(career)}
                              className="p-1.5 text-muted-foreground hover:text-indigo-600 hover:bg-muted/60 rounded-lg transition-colors"
                              title="Duplicate"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(careerId)}
                              className="p-1.5 text-muted-foreground hover:text-rose-600 hover:bg-muted/60 rounded-lg transition-colors"
                              title="Move to Recycle Bin"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleRestore(careerId)}
                              className="p-1.5 text-muted-foreground hover:text-teal-600 hover:bg-muted/60 rounded-lg transition-colors"
                              title="Restore"
                            >
                              <RotateCcw className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => setConfirmPermDeleteId(careerId)}
                              className="p-1.5 text-muted-foreground hover:text-rose-600 hover:bg-muted/60 rounded-lg transition-colors"
                              title="Permanently Delete"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>

                  </tr>
                );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      </>
      ) : (
        /* ── Page Content & Hero Editor ── */
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-card rounded-2xl border border-border/70 shadow-xs">
            <div>
              <h2 className="text-base font-bold text-foreground">Careers Page Header &amp; Content</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Controls the hero title, hiring process timeline, and final CTA on /careers
              </p>
            </div>
            <button
              type="button"
              onClick={handleSavePageSettings}
              disabled={pageSettingsSaving}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              {pageSettingsSaving ? 'Saving...' : 'Save Page Content'}
            </button>
          </div>

          {pageSettingsLoading ? (
            <div className="p-12 text-center text-xs text-muted-foreground">Loading settings...</div>
          ) : !pageSettings ? (
            <div className="p-12 text-center text-xs text-rose-500">Failed to load career page settings.</div>
          ) : (
            <div className="space-y-6">
              {/* 1. HERO */}
              <div className="bg-card p-6 rounded-2xl border border-border/70 shadow-xs space-y-4">
                <span className="text-xs font-mono font-bold uppercase text-teal-600 block">01 — Hero Section</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-1">Eyebrow</label>
                    <input
                      type="text"
                      value={pageSettings.hero?.eyebrow || ''}
                      onChange={(e) =>
                        setPageSettings({
                          ...pageSettings,
                          hero: { ...pageSettings.hero, eyebrow: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 text-xs bg-background border border-border/70 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-1">Title</label>
                    <input
                      type="text"
                      value={pageSettings.hero?.title || ''}
                      onChange={(e) =>
                        setPageSettings({
                          ...pageSettings,
                          hero: { ...pageSettings.hero, title: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 text-xs bg-background border border-border/70 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-1">Hero Description</label>
                  <textarea
                    rows={2}
                    value={pageSettings.hero?.description || ''}
                    onChange={(e) =>
                      setPageSettings({
                        ...pageSettings,
                        hero: { ...pageSettings.hero, description: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-background border border-border/70 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-1">Primary CTA Button</label>
                    <input
                      type="text"
                      value={pageSettings.hero?.primaryCtaText || ''}
                      onChange={(e) =>
                        setPageSettings({
                          ...pageSettings,
                          hero: { ...pageSettings.hero, primaryCtaText: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 text-xs bg-background border border-border/70 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-1">Secondary CTA Button</label>
                    <input
                      type="text"
                      value={pageSettings.hero?.secondaryCtaText || ''}
                      onChange={(e) =>
                        setPageSettings({
                          ...pageSettings,
                          hero: { ...pageSettings.hero, secondaryCtaText: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 text-xs bg-background border border-border/70 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* 2. HIRING PROCESS */}
              <div className="bg-card p-6 rounded-2xl border border-border/70 shadow-xs space-y-4">
                <span className="text-xs font-mono font-bold uppercase text-teal-600 block">02 — Hiring Process Steps</span>
                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-1">Section Title</label>
                  <input
                    type="text"
                    value={pageSettings.hiringProcess?.title || ''}
                    onChange={(e) =>
                      setPageSettings({
                        ...pageSettings,
                        hiringProcess: { ...pageSettings.hiringProcess, title: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-background border border-border/70 rounded-xl"
                  />
                </div>

                <div className="space-y-3">
                  {pageSettings.hiringProcess?.steps?.map((step: any, sIdx: number) => (
                    <div key={sIdx} className="p-4 rounded-xl border border-border/60 bg-muted/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-teal-600">Step {step.num || sIdx + 1}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={step.title}
                          placeholder="Title"
                          onChange={(e) => {
                            const next = [...pageSettings.hiringProcess.steps];
                            next[sIdx].title = e.target.value;
                            setPageSettings({
                              ...pageSettings,
                              hiringProcess: { ...pageSettings.hiringProcess, steps: next },
                            });
                          }}
                          className="w-full px-3 py-2 text-xs bg-background border border-border/70 rounded-xl"
                        />
                        <input
                          type="text"
                          value={step.subtitle}
                          placeholder="Subtitle"
                          onChange={(e) => {
                            const next = [...pageSettings.hiringProcess.steps];
                            next[sIdx].subtitle = e.target.value;
                            setPageSettings({
                              ...pageSettings,
                              hiringProcess: { ...pageSettings.hiringProcess, steps: next },
                            });
                          }}
                          className="w-full px-3 py-2 text-xs bg-background border border-border/70 rounded-xl"
                        />
                      </div>
                      <textarea
                        rows={2}
                        value={step.description}
                        placeholder="Description"
                        onChange={(e) => {
                          const next = [...pageSettings.hiringProcess.steps];
                          next[sIdx].description = e.target.value;
                          setPageSettings({
                            ...pageSettings,
                            hiringProcess: { ...pageSettings.hiringProcess, steps: next },
                          });
                        }}
                        className="w-full px-3 py-2 text-xs bg-background border border-border/70 rounded-xl"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. CTA */}
              <div className="bg-card p-6 rounded-2xl border border-border/70 shadow-xs space-y-4">
                <span className="text-xs font-mono font-bold uppercase text-teal-600 block">03 — Careers Closing CTA</span>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-1">CTA Heading</label>
                    <input
                      type="text"
                      value={pageSettings.cta?.title || ''}
                      onChange={(e) =>
                        setPageSettings({
                          ...pageSettings,
                          cta: { ...pageSettings.cta, title: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 text-xs bg-background border border-border/70 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-1">Contact Email</label>
                    <input
                      type="text"
                      value={pageSettings.cta?.email || ''}
                      onChange={(e) =>
                        setPageSettings({
                          ...pageSettings,
                          cta: { ...pageSettings.cta, email: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 text-xs bg-background border border-border/70 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Add/Edit Slide-Over Drawer ── */}
      {drawerOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end font-sans transition-all">
          <div className="w-full max-w-2xl bg-card border-l border-border h-full flex flex-col shadow-2xl animate-slide-in">
            
            {/* Drawer Header */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-border">
              <div>
                <h3 className="text-base font-bold text-foreground">
                  {editingId ? 'Edit Career Opening' : 'Add New Career Opening'}
                </h3>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Configure real-time website job metadata settings.
                </p>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1 text-muted-foreground hover:text-foreground rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drawer Body Scroll */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
              
              <div className="grid grid-cols-2 gap-4">
                {/* Title */}
                <div className="col-span-2 space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Job Title *</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-muted/40 border border-border/80 focus:border-teal-600 focus:outline-none rounded-xl"
                    placeholder="e.g. Senior Full Stack Developer"
                  />
                </div>

                {/* Slug */}
                <div className="col-span-2 space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Slug (Auto-generated) *</label>
                  <input
                    type="text"
                    required
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                    className="w-full px-3 py-2 text-xs bg-muted/40 border border-border/80 focus:border-teal-600 focus:outline-none rounded-xl font-mono text-teal-600"
                    placeholder="e.g. senior-full-stack-developer"
                  />
                </div>

                {/* Department */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Department *</label>
                  <input
                    type="text"
                    required
                    value={formDept}
                    onChange={(e) => setFormDept(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-muted/40 border border-border/80 focus:border-teal-600 focus:outline-none rounded-xl"
                    placeholder="e.g. Engineering"
                  />
                </div>

                {/* Location */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Location *</label>
                  <input
                    type="text"
                    required
                    value={formLoc}
                    onChange={(e) => setFormLoc(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-muted/40 border border-border/80 focus:border-teal-600 focus:outline-none rounded-xl"
                    placeholder="e.g. Bengaluru, India or Remote"
                  />
                </div>

                {/* Employment Type */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Type *</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-muted/40 border border-border/80 focus:border-teal-600 focus:outline-none rounded-xl font-semibold text-foreground"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                {/* Experience */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Experience *</label>
                  <input
                    type="text"
                    required
                    value={formExperience}
                    onChange={(e) => setFormExperience(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-muted/40 border border-border/80 focus:border-teal-600 focus:outline-none rounded-xl"
                    placeholder="e.g. 2+ Years"
                  />
                </div>

                {/* Application URL */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Application URL (Optional)</label>
                  <input
                    type="url"
                    value={formAppUrl}
                    onChange={(e) => setFormAppUrl(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-muted/40 border border-border/80 focus:border-teal-600 focus:outline-none rounded-xl"
                    placeholder="https://..."
                  />
                </div>

                {/* Application Email */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Application Email (Optional)</label>
                  <input
                    type="email"
                    value={formAppEmail}
                    onChange={(e) => setFormAppEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-muted/40 border border-border/80 focus:border-teal-600 focus:outline-none rounded-xl"
                    placeholder="careers@veenero.com"
                  />
                </div>
              </div>

              {/* Short Description */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-muted-foreground">Short Description (Mockup Card Copy) *</label>
                <textarea
                  required
                  rows={2}
                  value={formShortDesc}
                  onChange={(e) => setFormShortDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-muted/40 border border-border/80 focus:border-teal-600 focus:outline-none rounded-xl"
                  placeholder="Describe role in 1-2 lines for listing layout."
                />
              </div>

              {/* Full Description */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-muted-foreground">Job Description (Markdown Allowed) *</label>
                <textarea
                  required
                  rows={6}
                  value={formFullDesc}
                  onChange={(e) => setFormFullDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-muted/40 border border-border/80 focus:border-teal-600 focus:outline-none rounded-xl font-mono text-xs"
                  placeholder="Enter full job specifications and summary details..."
                />
              </div>

              {/* List adders: Responsibilities */}
              <div className="space-y-3 bg-muted/20 p-4 rounded-2xl border border-border/30">
                <label className="text-[10px] font-bold uppercase text-muted-foreground block">Key Responsibilities</label>
                
                {/* Items */}
                {responsibilities.length > 0 && (
                  <ul className="space-y-2 text-xs text-muted-foreground">
                    {responsibilities.map((item, idx) => (
                      <li key={idx} className="flex justify-between items-center bg-card px-3 py-1.5 rounded-lg border border-border/40">
                        <span className="truncate max-w-[90%]">{item}</span>
                        <button type="button" onClick={() => removeListItem('resp', idx)} className="text-rose-500 hover:scale-105">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={respInput}
                    onChange={(e) => setRespInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs bg-card border border-border/80 focus:outline-none rounded-xl"
                    placeholder="Add responsibilities item..."
                  />
                  <button
                    type="button"
                    onClick={() => addListItem('resp')}
                    className="px-3 py-1.5 bg-teal-700/10 text-teal-700 dark:text-teal-400 font-bold rounded-xl text-xs"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* List adders: Requirements */}
              <div className="space-y-3 bg-muted/20 p-4 rounded-2xl border border-border/30">
                <label className="text-[10px] font-bold uppercase text-muted-foreground block">Role Requirements</label>
                
                {/* Items */}
                {requirements.length > 0 && (
                  <ul className="space-y-2 text-xs text-muted-foreground">
                    {requirements.map((item, idx) => (
                      <li key={idx} className="flex justify-between items-center bg-card px-3 py-1.5 rounded-lg border border-border/40">
                        <span className="truncate max-w-[90%]">{item}</span>
                        <button type="button" onClick={() => removeListItem('req', idx)} className="text-rose-500 hover:scale-105">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={reqInput}
                    onChange={(e) => setReqInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs bg-card border border-border/80 focus:outline-none rounded-xl"
                    placeholder="Add requirement item..."
                  />
                  <button
                    type="button"
                    onClick={() => addListItem('req')}
                    className="px-3 py-1.5 bg-teal-700/10 text-teal-700 dark:text-teal-400 font-bold rounded-xl text-xs"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* List adders: Nice To Have */}
              <div className="space-y-3 bg-muted/20 p-4 rounded-2xl border border-border/30">
                <label className="text-[10px] font-bold uppercase text-muted-foreground block">Nice To Have</label>
                
                {/* Items */}
                {niceToHave.length > 0 && (
                  <ul className="space-y-2 text-xs text-muted-foreground">
                    {niceToHave.map((item, idx) => (
                      <li key={idx} className="flex justify-between items-center bg-card px-3 py-1.5 rounded-lg border border-border/40">
                        <span className="truncate max-w-[90%]">{item}</span>
                        <button type="button" onClick={() => removeListItem('nice', idx)} className="text-rose-500 hover:scale-105">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={niceInput}
                    onChange={(e) => setNiceInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs bg-card border border-border/80 focus:outline-none rounded-xl"
                    placeholder="Add extra nice-to-have skill..."
                  />
                  <button
                    type="button"
                    onClick={() => addListItem('nice')}
                    className="px-3 py-1.5 bg-teal-700/10 text-teal-700 dark:text-teal-400 font-bold rounded-xl text-xs"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* List adders: Skills */}
              <div className="space-y-3 bg-muted/20 p-4 rounded-2xl border border-border/30">
                <label className="text-[10px] font-bold uppercase text-muted-foreground block">Skills Tags</label>
                
                {/* Tags wrap */}
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((item, idx) => (
                      <span key={idx} className="flex items-center gap-1.5 px-2.5 py-1 bg-card text-teal-700 dark:text-teal-400 border border-border/40 rounded-lg text-xs">
                        {item}
                        <button type="button" onClick={() => removeListItem('skill', idx)} className="text-rose-500">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs bg-card border border-border/80 focus:outline-none rounded-xl"
                    placeholder="e.g. React, Node.js..."
                  />
                  <button
                    type="button"
                    onClick={() => addListItem('skill')}
                    className="px-3 py-1.5 bg-teal-700/10 text-teal-700 dark:text-teal-400 font-bold rounded-xl text-xs"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Featured toggle & Sort Order & Status */}
              <div className="grid grid-cols-3 gap-4 bg-muted/10 p-4 rounded-2xl border border-border/30">
                
                {/* Status Selection */}
                <div className="space-y-1.5 col-span-1">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Publish Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-card border border-border/80 rounded-xl focus:outline-none text-foreground font-semibold"
                  >
                    <option value="DRAFT">DRAFT</option>
                    <option value="PUBLISHED">PUBLISHED</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </div>

                {/* Sort Order */}
                <div className="space-y-1.5 col-span-1">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Sort Order</label>
                  <input
                    type="number"
                    value={formSortOrder}
                    onChange={(e) => setFormSortOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-card border border-border/80 rounded-xl focus:outline-none font-semibold text-foreground"
                  />
                </div>

                {/* Featured toggle */}
                <div className="space-y-1.5 col-span-1 flex flex-col justify-end pb-1.5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formIsFeatured}
                      onChange={(e) => setFormIsFeatured(e.target.checked)}
                      className="rounded border-gray-300 text-teal-600 focus:ring-teal-500 h-4 w-4 bg-card"
                    />
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Featured Job</span>
                  </label>
                </div>

              </div>

            </form>

            {/* Drawer Footer Actions */}
            <div className="h-20 border-t border-border flex items-center justify-between px-6 shrink-0 bg-card">
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="px-5 py-2.5 bg-muted text-foreground border border-border/80 hover:bg-muted/80 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>

              <div className="flex gap-3">
                {formStatus === 'DRAFT' && !editingId && (
                  <button
                    type="button"
                    onClick={(e) => { setFormStatus('DRAFT'); handleSave(e); }}
                    className="px-5 py-2.5 bg-card hover:bg-muted text-muted-foreground hover:text-foreground border border-border/80 rounded-xl text-xs font-bold transition-all"
                  >
                    Save Draft
                  </button>
                )}
                
                <button
                  type="submit"
                  onClick={handleSave}
                  className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-soft transition-all"
                >
                  {editingId ? 'Save Changes' : formStatus === 'ACTIVE' ? 'Publish' : 'Create Job'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ── Soft Delete Confirmation Modal ── */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border/80 rounded-2xl p-6 max-w-sm w-full space-y-4 animate-fade-in shadow-2xl">
            <div className="flex items-center gap-3 text-amber-600">
              <AlertCircle className="h-6 w-6" />
              <h3 className="text-base font-bold text-foreground">Move to Recycle Bin?</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to move this career opening to the Recycle Bin? It will immediately disappear from the public job boards.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 border border-border/80 rounded-xl text-xs font-bold text-muted-foreground hover:bg-muted/40"
              >
                Cancel
              </button>
              <button
                onClick={handleSoftDelete}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md"
              >
                Move to Bin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Permanent Delete Confirmation Modal ── */}
      {confirmPermDeleteId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border/80 rounded-2xl p-6 max-w-sm w-full space-y-4 animate-fade-in shadow-2xl">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertCircle className="h-6 w-6" />
              <h3 className="text-base font-bold text-foreground">Permanently Delete?</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to permanently delete this job opening? This action **cannot** be undone and will erase the document from MongoDB.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmPermDeleteId(null)}
                className="px-4 py-2 border border-border/80 rounded-xl text-xs font-bold text-muted-foreground hover:bg-muted/40"
              >
                Cancel
              </button>
              <button
                onClick={handlePermanentDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Careers;
