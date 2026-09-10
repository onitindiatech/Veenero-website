import React, { useState, useEffect } from 'react';
import {
  Search,
  Trash2,
  Calendar,
  Phone,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  UserCheck,
  FileText,
  ExternalLink,
  Mail,
  Linkedin,
  Globe,
  Briefcase,
  AlertTriangle,
  Send,
  Loader2,
  Check,
  RefreshCw,
  Building,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  JobApplication,
  ApplicationStatus,
  ApplicationCounts,
  getAdminApplications,
  updateApplicationStatus,
  sendDecisionEmail,
  deleteApplication,
} from '@/services/application.service';

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
  PENDING: 'Pending',
  UNDER_REVIEW: 'Under Review',
  SELECTED: 'Selected',
  NOT_SELECTED: 'Not Selected',
};

const statusColors: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
  UNDER_REVIEW: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
  SELECTED: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
  NOT_SELECTED: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
};

export const JobApplications: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [counts, setCounts] = useState<ApplicationCounts>({
    all: 0,
    pending: 0,
    underReview: 0,
    selected: 0,
    notSelected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [internalNote, setInternalNote] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Email Confirmation Dialog State
  const [emailDialog, setEmailDialog] = useState<{
    open: boolean;
    type: 'SELECTED' | 'NOT_SELECTED';
    application: JobApplication | null;
    isSending: boolean;
    forceResend?: boolean;
  }>({
    open: false,
    type: 'SELECTED',
    application: null,
    isSending: false,
    forceResend: false,
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadApplications = async () => {
    try {
      setLoading(true);
      const res = await getAdminApplications({
        status: activeTab,
        search,
      });
      setApplications(res.data);
      if (res.counts) {
        setCounts(res.counts);
      }

      if (selectedApp) {
        const refreshed = res.data.find((a) => (a.id || a._id) === (selectedApp.id || selectedApp._id));
        if (refreshed) {
          setSelectedApp(refreshed);
          setInternalNote(refreshed.notes || '');
        }
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to load applications', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [activeTab]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadApplications();
  };

  const handleSelectApplication = (app: JobApplication) => {
    setSelectedApp(app);
    setInternalNote(app.notes || '');
  };

  const handleStatusChange = async (id: string, newStatus: ApplicationStatus) => {
    try {
      const updated = await updateApplicationStatus(id, newStatus);
      setApplications((prev) => prev.map((a) => ((a.id || a._id) === id ? updated : a)));
      if ((selectedApp?.id || selectedApp?._id) === id) {
        setSelectedApp(updated);
      }
      showToast(`Status updated to ${STATUS_LABELS[newStatus] || newStatus}`);
    } catch (err: any) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  const handleSaveNote = async () => {
    if (!selectedApp) return;
    const appId = selectedApp.id || selectedApp._id || '';
    try {
      const updated = await updateApplicationStatus(appId, selectedApp.status, internalNote);
      setApplications((prev) => prev.map((a) => ((a.id || a._id) === appId ? updated : a)));
      setSelectedApp(updated);
      showToast('Internal note saved successfully');
    } catch (err: any) {
      showToast(err.message || 'Failed to save note', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this application record?')) return;
    try {
      await deleteApplication(id);
      setApplications((prev) => prev.filter((a) => (a.id || a._id) !== id));
      if ((selectedApp?.id || selectedApp?._id) === id) setSelectedApp(null);
      showToast('Application deleted successfully');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete application', 'error');
    }
  };

  // Open confirmation dialog for decision email
  const openDecisionEmailModal = (type: 'SELECTED' | 'NOT_SELECTED') => {
    if (!selectedApp) return;
    setEmailDialog({
      open: true,
      type,
      application: selectedApp,
      isSending: false,
      forceResend: false,
    });
  };

  // Confirm sending email
  const handleConfirmSendEmail = async () => {
    if (!emailDialog.application) return;
    const appId = emailDialog.application.id || emailDialog.application._id || '';

    try {
      setEmailDialog((prev) => ({ ...prev, isSending: true }));
      const res = await sendDecisionEmail(appId, emailDialog.type, emailDialog.forceResend);

      // Update records
      setApplications((prev) => prev.map((a) => ((a.id || a._id) === appId ? res.data : a)));
      setSelectedApp(res.data);

      setEmailDialog({ open: false, type: 'SELECTED', application: null, isSending: false, forceResend: false });
      showToast(res.message || `${emailDialog.type === 'SELECTED' ? 'Selection' : 'Rejection'} email sent!`);
    } catch (err: any) {
      if (err.isDuplicate) {
        setEmailDialog((prev) => ({ ...prev, forceResend: true, isSending: false }));
        showToast(err.message, 'error');
      } else {
        showToast(err.message || 'Failed to send decision email', 'error');
        setEmailDialog((prev) => ({ ...prev, isSending: false }));
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans space-y-6 select-none">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Confirmation Dialog for Decision Email */}
      {emailDialog.open && emailDialog.application && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-card border border-border/70 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 animate-scale-in">
            <div className="flex items-center gap-3">
              <div
                className={`p-3 rounded-2xl ${
                  emailDialog.type === 'SELECTED'
                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                    : 'bg-rose-500/15 text-rose-700 dark:text-rose-400'
                }`}
              >
                {emailDialog.type === 'SELECTED' ? <UserCheck className="w-6 h-6" /> : <Mail className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">
                  {emailDialog.type === 'SELECTED' ? 'Send Selection Email' : 'Send Rejection Email'}
                </h3>
                <span className="text-xs text-muted-foreground">Action requires explicit confirmation</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Candidate:</span>
                <strong className="text-foreground">{emailDialog.application.candidateName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="text-foreground font-mono">{emailDialog.application.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Position:</span>
                <span className="text-foreground">{emailDialog.application.jobTitle}</span>
              </div>
            </div>

            {emailDialog.application.decisionEmailSent && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  A decision email was previously sent on{' '}
                  {emailDialog.application.decisionEmailSentAt
                    ? new Date(emailDialog.application.decisionEmailSentAt).toLocaleDateString()
                    : 'earlier'}
                  . Confirming will resend the update.
                </span>
              </div>
            )}

            <p className="text-xs text-muted-foreground leading-relaxed">
              {emailDialog.type === 'SELECTED'
                ? `This will update the application status to SELECTED and immediately send a formal shortlisting email from Veenero Recruitment to ${emailDialog.application.candidateName}.`
                : `This will update the application status to NOT_SELECTED and immediately send a respectful rejection notification to ${emailDialog.application.candidateName}.`}
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setEmailDialog({ open: false, type: 'SELECTED', application: null, isSending: false, forceResend: false })
                }
                disabled={emailDialog.isSending}
                className="rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </Button>

              <Button
                size="sm"
                onClick={handleConfirmSendEmail}
                disabled={emailDialog.isSending}
                className={`rounded-xl text-xs font-bold cursor-pointer text-white flex items-center gap-2 ${
                  emailDialog.type === 'SELECTED'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                {emailDialog.isSending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Dispatching Email...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>
                      {emailDialog.forceResend
                        ? 'Confirm Resend'
                        : emailDialog.type === 'SELECTED'
                        ? 'Confirm & Send Selection'
                        : 'Confirm & Send Rejection'}
                    </span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-700 dark:text-teal-300 text-xs font-mono font-bold mb-2">
            <UserCheck className="w-3.5 h-3.5" />
            <span>RECRUITMENT APPLICATION WORKFLOW</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Candidate Job Applications
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Review submitted candidate profiles, verify resumes, update recruitment statuses, and send automated decision emails.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={loadApplications} variant="outline" size="sm" className="rounded-xl text-xs cursor-pointer gap-2">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Status Category Tabs */}
      <div className="flex items-center gap-2 border-b border-border/60 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('ALL')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'ALL'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          <span>All Applications</span>
          <span className="px-1.5 py-0.2 rounded-full bg-muted/60 text-[10px] font-mono">
            {counts.all}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('PENDING')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'PENDING'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          <span>Pending</span>
          {counts.pending > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 text-[10px] font-mono font-bold">
              {counts.pending}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('UNDER_REVIEW')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'UNDER_REVIEW'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          <span>Under Review</span>
          <span className="px-1.5 py-0.2 rounded-full bg-muted/60 text-[10px] font-mono">
            {counts.underReview}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('SELECTED')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'SELECTED'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          <span>Selected</span>
          <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-[10px] font-mono font-bold">
            {counts.selected}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('NOT_SELECTED')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'NOT_SELECTED'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          <span>Not Selected</span>
          <span className="px-1.5 py-0.2 rounded-full bg-muted/60 text-[10px] font-mono">
            {counts.notSelected}
          </span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-card p-4 rounded-2xl border border-border/60 shadow-xs flex flex-wrap gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by candidate name, email, phone or applied role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-background border border-border/70 rounded-xl focus:outline-none focus:border-teal-500 font-medium text-foreground"
          />
        </form>
      </div>

      {/* Split Layout: Applications Table & Profile Review Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Table List (8 Cols) */}
        <div className="lg:col-span-8 bg-card rounded-2xl border border-border/60 overflow-hidden shadow-xs">
          {loading ? (
            <div className="p-14 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
              <div className="w-5 h-5 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
              Loading candidate applications...
            </div>
          ) : applications.length === 0 ? (
            <div className="p-14 text-center text-xs text-muted-foreground space-y-2">
              <p className="font-bold text-foreground">No applications found in this category.</p>
              <p>When candidates apply on the public Career Detail pages, their profiles appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/20 font-bold text-muted-foreground">
                    <th className="p-3.5">Candidate / Contact</th>
                    <th className="p-3.5">Applied Role</th>
                    <th className="p-3.5">Applied Date</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Resume</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 font-medium">
                  {applications.map((app) => {
                    const appId = app.id || app._id || '';
                    const isSelected = (selectedApp?.id || selectedApp?._id) === appId;
                    return (
                      <tr
                        key={appId}
                        onClick={() => handleSelectApplication(app)}
                        className={`hover:bg-muted/40 cursor-pointer transition-colors ${
                          isSelected ? 'bg-teal-500/10' : ''
                        }`}
                      >
                        <td className="p-3.5">
                          <div className="font-bold text-foreground">{app.candidateName}</div>
                          <div className="text-[11px] text-muted-foreground">{app.email}</div>
                          <div className="text-[10px] text-muted-foreground font-mono">{app.phone}</div>
                        </td>
                        <td className="p-3.5">
                          <span className="font-semibold text-foreground block">{app.jobTitle}</span>
                          <span className="text-[10px] text-muted-foreground">{app.jobDepartment}</span>
                        </td>
                        <td className="p-3.5 text-muted-foreground text-[11px]">
                          {new Date(app.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                              statusColors[app.status] || ''
                            }`}
                          >
                            {STATUS_LABELS[app.status] || app.status}
                          </span>
                        </td>
                        <td className="p-3.5">
                          {app.resumeUrl ? (
                            <a
                              href={app.resumeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 text-teal-600 dark:text-teal-400 hover:underline text-[11px] font-bold"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              View CV
                            </a>
                          ) : (
                            <span className="text-muted-foreground text-[11px]">No file</span>
                          )}
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(appId);
                            }}
                            className="p-1 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                            title="Delete Application"
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

        {/* Candidate Profile Review Drawer (4 Cols) */}
        <div className="lg:col-span-4 bg-card rounded-2xl border border-border/70 p-5 shadow-xs space-y-5">
          {selectedApp ? (
            <div className="space-y-5">
              {/* Header & Status Badge */}
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                    statusColors[selectedApp.status]
                  }`}
                >
                  {STATUS_LABELS[selectedApp.status] || selectedApp.status}
                </span>

                <span className="text-[11px] text-muted-foreground">
                  Applied: {new Date(selectedApp.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Candidate Info Block */}
              <div>
                <h3 className="text-lg font-bold text-foreground">{selectedApp.candidateName}</h3>
                <p className="text-xs text-teal-700 dark:text-teal-400 font-semibold">{selectedApp.jobTitle}</p>
                <div className="flex flex-col gap-1.5 mt-2.5 text-xs text-muted-foreground">
                  <a href={`mailto:${selectedApp.email}`} className="hover:underline flex items-center gap-1.5 text-foreground">
                    <Mail className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>{selectedApp.email}</span>
                  </a>
                  <a href={`tel:${selectedApp.phone}`} className="hover:underline flex items-center gap-1.5 text-foreground">
                    <Phone className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>{selectedApp.phone}</span>
                  </a>
                </div>
              </div>

              {/* Links (LinkedIn, Portfolio, Resume) */}
              <div className="space-y-2 pt-1 border-t border-border/60">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground block">
                  CANDIDATE ASSETS & PROFILES
                </span>
                <div className="flex flex-col gap-2">
                  {selectedApp.resumeUrl && (
                    <a
                      href={selectedApp.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/25 hover:bg-teal-500/20 text-teal-800 dark:text-teal-300 text-xs font-bold flex items-center justify-between transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span>{selectedApp.resumeFilename || 'Resume / CV Document'}</span>
                      </span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  {selectedApp.linkedInUrl && (
                    <a
                      href={selectedApp.linkedInUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-muted/40 hover:bg-muted text-xs text-foreground flex items-center justify-between transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Linkedin className="w-3.5 h-3.5 text-teal-600" />
                        <span className="truncate">LinkedIn Profile</span>
                      </span>
                      <ExternalLink className="w-3 h-3 text-muted-foreground" />
                    </a>
                  )}

                  {selectedApp.portfolioUrl && (
                    <a
                      href={selectedApp.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-muted/40 hover:bg-muted text-xs text-foreground flex items-center justify-between transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 text-teal-600" />
                        <span className="truncate">Portfolio / GitHub</span>
                      </span>
                      <ExternalLink className="w-3 h-3 text-muted-foreground" />
                    </a>
                  )}
                </div>
              </div>

              {/* Cover Letter */}
              <div className="space-y-1.5 pt-1 border-t border-border/60">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground block">
                  COVER LETTER / CANDIDATE NOTE
                </span>
                <div className="p-3 rounded-xl bg-muted/30 border border-border/60 text-xs text-foreground leading-relaxed whitespace-pre-wrap max-h-40 overflow-y-auto font-normal">
                  {selectedApp.coverLetter}
                </div>
              </div>

              {/* Decision Email Log Banner */}
              {selectedApp.decisionEmailSent && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-xs text-emerald-800 dark:text-emerald-300 space-y-1 font-sans">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Check className="w-3.5 h-3.5" />
                    <span>
                      {selectedApp.decisionEmailType === 'SELECTED' ? 'Shortlist Email Sent' : 'Rejection Email Sent'}
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                    Dispatched on {selectedApp.decisionEmailSentAt ? new Date(selectedApp.decisionEmailSentAt).toLocaleString() : 'earlier'} by {selectedApp.decisionSentBy || 'Admin'}.
                  </p>
                </div>
              )}

              {/* Recruitment Decision Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-border/60">
                <span className="text-[11px] font-bold text-foreground block">Recruitment Decision Actions:</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => openDecisionEmailModal('SELECTED')}
                    className="px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Mark Selected</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => openDecisionEmailModal('NOT_SELECTED')}
                    className="px-3 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Mark Not Selected</span>
                  </button>
                </div>
              </div>

              {/* Quick Status Selector */}
              <div className="space-y-1.5 pt-1 border-t border-border/60">
                <span className="text-[11px] font-bold text-muted-foreground block">Change Status Manually:</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['PENDING', 'UNDER_REVIEW', 'SELECTED', 'NOT_SELECTED'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusChange(selectedApp.id || selectedApp._id || '', st)}
                      className={`px-2 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer text-center ${
                        selectedApp.status === st
                          ? 'bg-teal-600 border-teal-600 text-white shadow-2xs'
                          : 'bg-muted/40 hover:bg-muted text-muted-foreground border-border/70'
                      }`}
                    >
                      {STATUS_LABELS[st] || st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Internal Admin Notes */}
              <div className="space-y-2 pt-1 border-t border-border/60">
                <span className="text-[11px] font-bold text-muted-foreground block">Internal Recruitment Notes:</span>
                <textarea
                  rows={3}
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  placeholder="Record panel feedback, interview dates, or technical assessment score..."
                  className="w-full px-3 py-2 text-xs bg-background border border-border/70 rounded-xl focus:outline-none focus:border-teal-500 font-medium text-foreground resize-y"
                />
                <Button
                  onClick={handleSaveNote}
                  size="sm"
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Save Internal Note
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-muted-foreground space-y-2">
              <UserCheck className="w-8 h-8 mx-auto text-muted-foreground/50 mb-1" />
              <p className="font-bold text-foreground">Select an Application</p>
              <p>Click any candidate row on the left to review resume, portfolio, cover letter, and trigger decision emails.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default JobApplications;
