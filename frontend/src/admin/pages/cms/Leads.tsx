import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Mail,
  Search,
  Trash2,
  Calendar,
  Building,
  Phone,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Sparkles,
  CalendarCheck,
  MessageSquare,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
  Send,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Lead, getAdminLeads, updateLeadStatus, deleteLead } from '@/services/contact.service';

const Toast = ({
  message,
  type,
  onClose,
}: {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}) => (
  <div
    className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border text-sm font-semibold max-w-sm animate-in slide-in-from-bottom-5 ${
      type === 'success'
        ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-300'
        : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-300'
    }`}
  >
    {type === 'success' ? (
      <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
    ) : (
      <XCircle className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
    )}
    <span className="flex-1">{message}</span>
    <button onClick={onClose} className="hover:opacity-70 text-xs font-bold px-1 cursor-pointer">
      ✕
    </button>
  </div>
);

const STATUS_LABELS: Record<string, string> = {
  NEW: 'New',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
  CONTACTED: 'Contacted',
  QUALIFIED: 'Qualified',
  CLOSED: 'Closed',
};

const statusColors: Record<string, string> = {
  NEW: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
  IN_PROGRESS: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
  RESOLVED: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
  CONTACTED: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800',
  QUALIFIED: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800',
  CLOSED: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
};

export const LeadsAdmin: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine initial tab from route
  const getInitialType = () => {
    if (location.pathname.includes('demo-requests')) return 'DEMO';
    if (location.pathname.includes('enquiries')) return 'ENQUIRY';
    return 'ALL';
  };

  const [activeTab, setActiveTab] = useState<'ALL' | 'ENQUIRY' | 'DEMO'>(getInitialType);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [internalNote, setInternalNote] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Sync route changes to active tab
  useEffect(() => {
    setActiveTab(getInitialType());
  }, [location.pathname]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadLeads = async () => {
    try {
      setLoading(true);
      const data = await getAdminLeads({
        type: activeTab,
        status: statusFilter,
        search,
      });
      setLeads(data);
      if (selectedLead) {
        const refreshed = data.find((l) => l._id === selectedLead._id);
        if (refreshed) {
          setSelectedLead(refreshed);
          setInternalNote(refreshed.notes || '');
        }
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to load inquiries', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, [activeTab, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadLeads();
  };

  const handleSelectLead = (lead: Lead) => {
    setSelectedLead(lead);
    setInternalNote(lead.notes || '');
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const updated = await updateLeadStatus(id, newStatus);
      setLeads((prev) => prev.map((l) => (l._id === id ? updated : l)));
      if (selectedLead?._id === id) {
        setSelectedLead(updated);
      }
      showToast(`Status updated to ${STATUS_LABELS[newStatus] || newStatus}`);
    } catch (err: any) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  const handleSaveNote = async () => {
    if (!selectedLead) return;
    try {
      const updated = await updateLeadStatus(selectedLead._id, selectedLead.status, internalNote);
      setLeads((prev) => prev.map((l) => (l._id === selectedLead._id ? updated : l)));
      setSelectedLead(updated);
      showToast('Internal note saved successfully');
    } catch (err: any) {
      showToast(err.message || 'Failed to save note', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this submission record?')) return;
    try {
      await deleteLead(id);
      setLeads((prev) => prev.filter((l) => l._id !== id));
      if (selectedLead?._id === id) setSelectedLead(null);
      showToast('Record deleted successfully');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete record', 'error');
    }
  };

  // Counts
  const enquiryCount = leads.filter((l) => l.type === 'ENQUIRY').length;
  const demoCount = leads.filter((l) => l.type === 'DEMO').length;

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans space-y-6 select-none">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-700 dark:text-teal-300 text-xs font-mono font-bold mb-2">
            {activeTab === 'DEMO' ? (
              <>
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>PLATFORM DEMO REQUESTS</span>
              </>
            ) : activeTab === 'ENQUIRY' ? (
              <>
                <MessageSquare className="w-3.5 h-3.5" />
                <span>VISITOR ENQUIRIES</span>
              </>
            ) : (
              <>
                <Mail className="w-3.5 h-3.5" />
                <span>ALL INCOMING SUBMISSIONS</span>
              </>
            )}
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {activeTab === 'DEMO'
              ? 'Platform Demo Requests'
              : activeTab === 'ENQUIRY'
              ? 'Contact Enquiries'
              : 'Enquiries & Demo Requests'}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Incoming records submitted by public website visitors. Records are read-only to preserve visitor submission integrity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={loadLeads} variant="outline" size="sm" className="rounded-xl text-xs cursor-pointer">
            Refresh List
          </Button>
        </div>
      </div>

      {/* Primary Category Switcher (Enquiries vs Demo Requests vs All) */}
      <div className="flex items-center gap-2 border-b border-border/60 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('ENQUIRY')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'ENQUIRY'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Enquiries</span>
          {activeTab !== 'ENQUIRY' && enquiryCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-muted text-[10px] font-mono">
              {enquiryCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('DEMO')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'DEMO'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          <CalendarCheck className="w-3.5 h-3.5" />
          <span>Platform Demo Requests</span>
          {activeTab !== 'DEMO' && demoCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[10px] font-mono font-bold">
              {demoCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ALL')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'ALL'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>All Submissions</span>
          <span className="px-1.5 py-0.2 rounded-full bg-muted text-[10px] font-mono">
            {leads.length}
          </span>
        </button>
      </div>

      {/* Filters Bar: Search & Status Badges */}
      <div className="bg-card p-4 rounded-2xl border border-border/60 shadow-xs flex flex-wrap gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, email, company or message content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-background border border-border/70 rounded-xl focus:outline-none focus:border-teal-500 font-medium text-foreground"
          />
        </form>

        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs font-bold text-muted-foreground">Status:</span>
          {['all', 'NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-teal-600 text-white shadow-2xs'
                  : 'bg-muted/60 text-muted-foreground hover:text-foreground'
              }`}
            >
              {st === 'all' ? 'All' : STATUS_LABELS[st] || st}
            </button>
          ))}
        </div>
      </div>

      {/* Split View: Submissions Table & Read-only Details Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Table List */}
        <div className="lg:col-span-8 bg-card rounded-2xl border border-border/60 overflow-hidden shadow-xs">
          {loading ? (
            <div className="p-12 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
              <div className="w-5 h-5 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
              Loading submissions...
            </div>
          ) : leads.length === 0 ? (
            <div className="p-12 text-center text-xs text-muted-foreground space-y-2">
              <p className="font-bold text-foreground">No submissions found matching your filters.</p>
              <p>When visitors submit the public Contact form or request a Demo, their messages will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/20 font-bold text-muted-foreground">
                    <th className="p-3.5">Name / Email</th>
                    <th className="p-3.5">Type</th>
                    <th className="p-3.5">Company</th>
                    <th className="p-3.5">Submission Date</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 font-medium">
                  {leads.map((lead) => {
                    const isSelected = selectedLead?._id === lead._id;
                    const isDemo = lead.type === 'DEMO';
                    return (
                      <tr
                        key={lead._id}
                        onClick={() => handleSelectLead(lead)}
                        className={`hover:bg-muted/40 cursor-pointer transition-colors ${
                          isSelected ? 'bg-teal-500/10' : ''
                        }`}
                      >
                        <td className="p-3.5">
                          <div className="font-bold text-foreground">{lead.name}</div>
                          <div className="text-[11px] text-muted-foreground">{lead.email}</div>
                        </td>
                        <td className="p-3.5">
                          {isDemo ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-800 dark:text-amber-300 text-[10px] font-mono font-bold border border-amber-500/25">
                              <CalendarCheck className="w-3 h-3" />
                              DEMO
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-800 dark:text-teal-300 text-[10px] font-mono font-bold border border-teal-500/20">
                              <MessageSquare className="w-3 h-3" />
                              ENQUIRY
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-muted-foreground">
                          {lead.organization || '—'}
                        </td>
                        <td className="p-3.5 text-muted-foreground text-[11px]">
                          {new Date(lead.createdAt).toLocaleDateString()} {new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              statusColors[lead.status] || ''
                            }`}
                          >
                            {STATUS_LABELS[lead.status] || lead.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(lead._id);
                            }}
                            className="p-1 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                            title="Delete Submission"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Read-Only Details & Status Management Drawer */}
        <div className="lg:col-span-4 bg-card rounded-2xl border border-border/70 p-5 shadow-xs space-y-4">
          {selectedLead ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div className="flex items-center gap-1.5">
                  {selectedLead.type === 'DEMO' ? (
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-800 dark:text-amber-300 font-mono font-bold text-[10px]">
                      DEMO REQUEST
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-800 dark:text-teal-300 font-mono font-bold text-[10px]">
                      CONTACT ENQUIRY
                    </span>
                  )}
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                    statusColors[selectedLead.status]
                  }`}
                >
                  {STATUS_LABELS[selectedLead.status] || selectedLead.status}
                </span>
              </div>

              {/* Visitor Contact Info */}
              <div>
                <h3 className="text-lg font-bold text-foreground">{selectedLead.name}</h3>
                <a
                  href={`mailto:${selectedLead.email}`}
                  className="text-xs text-teal-600 hover:underline inline-flex items-center gap-1 mt-0.5"
                >
                  <Mail className="w-3 h-3" />
                  {selectedLead.email}
                </a>
              </div>

              <div className="grid grid-cols-1 gap-2 text-xs text-muted-foreground font-sans">
                {selectedLead.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <a href={`tel:${selectedLead.phone}`} className="hover:underline text-foreground">
                      {selectedLead.phone}
                    </a>
                  </div>
                )}

                {selectedLead.organization && (
                  <div className="flex items-center gap-2">
                    <Building className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span className="text-foreground font-medium">{selectedLead.organization}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <span>
                    Received: {new Date(selectedLead.createdAt).toLocaleString()}
                  </span>
                </div>

                {selectedLead.source && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase text-muted-foreground">Source:</span>
                    <span className="text-[11px] font-medium text-foreground bg-muted/50 px-2 py-0.5 rounded">
                      {selectedLead.source}
                    </span>
                  </div>
                )}
              </div>

              {/* Immutable Original Visitor Message Block */}
              <div className="p-3.5 rounded-xl bg-muted/20 border border-border/60 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase font-bold text-muted-foreground">
                    {selectedLead.type === 'DEMO' ? 'Demo Requirements / Scope' : 'Visitor Message'}
                  </span>
                  <span className="text-[9px] font-mono text-muted-foreground">(Read-Only Record)</span>
                </div>
                <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap select-text font-normal">
                  {selectedLead.message}
                </p>
              </div>

              {/* Status Update Actions */}
              <div className="space-y-2 pt-2 border-t border-border/60">
                <span className="text-[11px] font-bold text-muted-foreground block">Update Status:</span>
                <div className="grid grid-cols-3 gap-2">
                  {(['NEW', 'IN_PROGRESS', 'RESOLVED'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusChange(selectedLead._id, st)}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer text-center ${
                        selectedLead.status === st
                          ? 'bg-teal-600 border-teal-600 text-white shadow-2xs'
                          : 'bg-muted/40 hover:bg-muted text-muted-foreground border-border/70'
                      }`}
                    >
                      {STATUS_LABELS[st] || st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Internal Admin Note */}
              <div className="space-y-2 pt-2 border-t border-border/60">
                <span className="text-[11px] font-bold text-muted-foreground block">
                  Internal Follow-Up Notes:
                </span>
                <textarea
                  rows={3}
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  placeholder="Record internal notes (e.g. called client, scheduled demo for Thursday)..."
                  className="w-full px-3 py-2 text-xs bg-background border border-border/70 rounded-xl focus:outline-none focus:border-teal-500 font-medium text-foreground resize-y"
                />
                <Button
                  onClick={handleSaveNote}
                  size="sm"
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Save Note
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-muted-foreground space-y-2">
              <Mail className="w-8 h-8 mx-auto text-muted-foreground/50 mb-1" />
              <p className="font-bold text-foreground">Select a Submission</p>
              <p>Click any row on the left to view complete details, visitor requirements, and manage its status.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadsAdmin;
