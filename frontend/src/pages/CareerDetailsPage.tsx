import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  Calendar,
  Award,
  CheckCircle2,
  Sparkles,
  UploadCloud,
  FileText,
  X,
  Send,
  Loader2,
  AlertCircle,
  Linkedin,
  Globe,
  DollarSign,
  ShieldCheck,
  Building2,
  Check,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { careerService, Career } from '@/admin/services/career.service';
import { submitJobApplication } from '@/services/application.service';

export const CareerDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [career, setCareer] = useState<Career | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  // Validation & Submission States
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadCareer = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        setError(null);
        const data = await careerService.getPublicCareerBySlug(slug);
        setCareer(data);
      } catch (err: any) {
        setError(err.message || 'Job opening not found.');
      } finally {
        setLoading(false);
      }
    };
    loadCareer();
  }, [slug]);

  const scrollToApply = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleFileSelection = (file: File | undefined) => {
    if (!file) return;

    // Validate size (< 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setFormErrors((prev) => ({ ...prev, resume: 'File size must be less than 10MB.' }));
      return;
    }

    // Validate file extension
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'doc', 'docx', 'rtf', 'txt'].includes(ext || '')) {
      setFormErrors((prev) => ({ ...prev, resume: 'Please upload a PDF, DOC, or DOCX document.' }));
      return;
    }

    setResumeFile(file);
    setFormErrors((prev) => {
      const copy = { ...prev };
      delete copy.resume;
      return copy;
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!fullName.trim()) {
      errors.fullName = 'Full Name is required.';
    }

    if (!email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!phone.trim()) {
      errors.phone = 'Phone number is required.';
    } else if (!/^[+0-9\s-]{7,20}$/.test(phone.trim())) {
      errors.phone = 'Please enter a valid contact phone number.';
    }

    if (!coverLetter.trim()) {
      errors.coverLetter = 'Cover letter or message is required.';
    } else if (coverLetter.trim().length < 20) {
      errors.coverLetter = 'Please write at least a few sentences about your interest.';
    }

    if (!resumeFile) {
      errors.resume = 'Please attach your Resume / CV.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !career) return;

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const formData = new FormData();
      formData.append('careerId', career.id || career._id || '');
      formData.append('candidateName', fullName.trim());
      formData.append('email', email.trim());
      formData.append('phone', phone.trim());
      formData.append('coverLetter', coverLetter.trim());
      if (linkedInUrl.trim()) formData.append('linkedInUrl', linkedInUrl.trim());
      if (portfolioUrl.trim()) formData.append('portfolioUrl', portfolioUrl.trim());
      if (resumeFile) formData.append('resume', resumeFile);

      await submitJobApplication(formData);

      setSubmitSuccess(true);
      // Reset form fields
      setFullName('');
      setEmail('');
      setPhone('');
      setCoverLetter('');
      setLinkedInUrl('');
      setPortfolioUrl('');
      setResumeFile(null);
    } catch (err: any) {
      setSubmitError(err.message || 'Unable to submit application. Please try again or contact careers@veenero.com');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-background flex flex-col font-sans relative overflow-hidden">
      {/* Subtle Atmospheric Water Background Effects */}
      <div className="absolute top-[12%] right-[5%] w-[420px] h-[420px] rounded-full bg-teal-500/[0.035] blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-[25%] left-[3%] w-[380px] h-[380px] rounded-full bg-cyan-500/[0.03] blur-3xl pointer-events-none -z-0" />

      {/* Main Navbar */}
      <Navbar />

      <main className="flex-1 pt-28 pb-24 relative z-10">
        <div className="container mx-auto px-6 md:px-12 max-w-5xl space-y-8">
          
          {/* Back Navigation Button */}
          <Link
            to="/careers"
            className="inline-flex items-center gap-2 text-xs font-bold text-teal-700 dark:text-teal-400 hover:text-teal-900 dark:hover:text-teal-300 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to All Open Positions</span>
          </Link>

          {/* ── State Loading / Error ── */}
          {loading ? (
            <div className="bg-card p-20 border border-border/50 rounded-3xl shadow-sm flex flex-col items-center justify-center gap-4 text-center">
              <div className="w-10 h-10 rounded-full border-3 border-teal-600 border-t-transparent animate-spin" />
              <p className="text-xs text-muted-foreground font-semibold font-mono tracking-widest uppercase">
                Loading role intelligence...
              </p>
            </div>
          ) : error || !career ? (
            <div className="bg-card p-14 border border-border/50 rounded-3xl text-center space-y-5 max-w-lg mx-auto shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
                <AlertCircle className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-1">Position Unavailable</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {error || 'This job opening is no longer accepting new applications or has been moved.'}
                </p>
              </div>
              <Link
                to="/careers"
                className="inline-flex items-center justify-center px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl shadow-soft transition-colors"
              >
                Browse All Openings
              </Link>
            </div>
          ) : (
            <div className="space-y-10 animate-fade-up">
              
              {/* ── 1. Hero Job Card ── */}
              <div className="bg-card border border-border/60 rounded-3xl p-8 md:p-10 shadow-sm relative overflow-hidden">
                {/* Decorative water gradient accent top stripe */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-500 via-cyan-400 to-teal-700" />

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                  <div className="space-y-4 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-700 dark:text-teal-300 text-[11px] font-mono font-bold tracking-wider uppercase">
                      <Sparkles className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                      <span>{career.department}</span>
                    </div>

                    <h1 className="font-display text-3xl sm:text-4xl md:text-[2.6rem] font-bold text-foreground leading-[1.15] tracking-tight">
                      {career.title}
                    </h1>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {career.shortDescription || 'Join Veenero Sustainable Solutions to build India\'s next-generation digital water intelligence infrastructure.'}
                    </p>
                  </div>

                  {/* Quick Apply CTA Button in Header */}
                  <div className="shrink-0 flex flex-col items-start lg:items-end gap-3 border-t lg:border-t-0 border-border/40 pt-4 lg:pt-0">
                    <button
                      type="button"
                      onClick={scrollToApply}
                      className="w-full sm:w-auto px-7 py-3.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs sm:text-sm font-extrabold shadow-soft hover:shadow-glow hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Apply for this role</span>
                      <Send className="w-4 h-4" />
                    </button>
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                      Direct Candidate Review
                    </span>
                  </div>
                </div>

                {/* Role Key Metrics Pills Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-border/40 font-sans">
                  <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/40 space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-teal-600" /> Location
                    </span>
                    <p className="text-xs font-bold text-foreground truncate">{career.location}</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/40 space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Briefcase className="w-3 h-3 text-teal-600" /> Type
                    </span>
                    <p className="text-xs font-bold text-foreground truncate">{career.employmentType}</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/40 space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Award className="w-3 h-3 text-teal-600" /> Experience
                    </span>
                    <p className="text-xs font-bold text-foreground truncate">{career.experience}</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/40 space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-teal-600" /> Posted
                    </span>
                    <p className="text-xs font-bold text-foreground truncate">
                      {career.publishedAt
                        ? new Date(career.publishedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                        : 'Active Opening'}
                    </p>
                  </div>
                </div>
              </div>

              {/* ── 2. Job Specification Detailed Content Block ── */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Main Content (Responsibilities, Requirements, Nice to Have) */}
                <div className="lg:col-span-8 bg-card border border-border/60 rounded-3xl p-8 md:p-10 shadow-sm space-y-8 text-foreground font-sans">
                  
                  {/* Overview */}
                  <div className="space-y-3">
                    <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-teal-600 shadow-[0_0_8px_rgba(13,148,136,0.6)]" />
                      Role Overview
                    </h2>
                    <div className="text-xs sm:text-sm text-muted-foreground leading-relaxed whitespace-pre-line space-y-2">
                      {career.description}
                    </div>
                  </div>

                  {/* Responsibilities */}
                  {career.responsibilities && career.responsibilities.length > 0 && (
                    <div className="space-y-4 pt-4 border-t border-border/40">
                      <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-teal-600 shadow-[0_0_8px_rgba(13,148,136,0.6)]" />
                        Key Responsibilities
                      </h2>
                      <ul className="space-y-3">
                        {career.responsibilities.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            <div className="p-0.5 rounded-full bg-teal-500/15 text-teal-700 dark:text-teal-300 shrink-0 mt-0.5">
                              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            </div>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Requirements */}
                  {career.requirements && career.requirements.length > 0 && (
                    <div className="space-y-4 pt-4 border-t border-border/40">
                      <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-teal-600 shadow-[0_0_8px_rgba(13,148,136,0.6)]" />
                        Role Requirements
                      </h2>
                      <ul className="space-y-3">
                        {career.requirements.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            <div className="p-0.5 rounded-full bg-teal-500/15 text-teal-700 dark:text-teal-300 shrink-0 mt-0.5">
                              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            </div>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Nice To Have */}
                  {career.niceToHave && career.niceToHave.length > 0 && (
                    <div className="space-y-4 pt-4 border-t border-border/40">
                      <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-cyan-600 shadow-[0_0_8px_rgba(8,145,178,0.6)]" />
                        Nice To Have
                      </h2>
                      <ul className="space-y-3">
                        {career.niceToHave.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            <div className="p-0.5 rounded-full bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 shrink-0 mt-0.5">
                              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            </div>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Skills Tags */}
                  {career.skills && career.skills.length > 0 && (
                    <div className="space-y-3 pt-4 border-t border-border/40">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground block">
                        Target Skills & Technologies
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {career.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3.5 py-1.5 rounded-xl bg-teal-500/10 text-teal-800 dark:text-teal-300 border border-teal-500/20 text-xs font-semibold"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar Quick Card */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Company Culture Quick Card */}
                  <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-2xl bg-teal-500/10 text-teal-700 dark:text-teal-300">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-foreground">Why Veenero?</h4>
                        <span className="text-[11px] text-muted-foreground">Water Intelligence Pioneer</span>
                      </div>
                    </div>

                    <ul className="space-y-3 text-xs text-muted-foreground pt-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                        <span>High impact on national water conservation infrastructure.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                        <span>Modern tech stack (IoT telemetry, React, Node.js, AI analytics).</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                        <span>Supportive, meritocratic engineering culture.</span>
                      </li>
                    </ul>

                    {career.salaryRange && (
                      <div className="p-3.5 rounded-2xl bg-teal-500/5 border border-teal-500/20 space-y-1">
                        <span className="text-[10px] font-mono uppercase font-bold text-teal-700 dark:text-teal-400 block">
                          Compensation / Salary Range
                        </span>
                        <p className="text-xs font-extrabold text-foreground">{career.salaryRange}</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* ── 3. Candidate Application Form ── */}
              <div
                ref={formRef}
                id="apply"
                className="bg-card border border-border/70 rounded-3xl p-8 md:p-12 shadow-md relative overflow-hidden"
              >
                {/* Decorative header glow */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/[0.04] rounded-full blur-3xl pointer-events-none" />

                {submitSuccess ? (
                  /* Success Confirmation Screen */
                  <div className="py-12 px-4 text-center space-y-6 max-w-lg mx-auto animate-fade-up">
                    <div className="w-16 h-16 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto shadow-soft">
                      <CheckCircle2 className="w-9 h-9" />
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-foreground">Application Submitted</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        Application submitted successfully. Our team will review your profile and get back to you.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 text-xs text-muted-foreground text-left space-y-1.5 font-mono">
                      <div className="flex justify-between">
                        <span>Role:</span>
                        <strong className="text-foreground">{career.title}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Department:</span>
                        <span className="text-foreground">{career.department}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <span className="text-teal-700 dark:text-teal-400 font-bold">Received (Pending Review)</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setSubmitSuccess(false)}
                        className="px-5 py-2.5 rounded-xl border border-border/80 text-xs font-bold text-foreground hover:bg-muted transition-colors cursor-pointer"
                      >
                        Submit Another Response
                      </button>
                      <Link
                        to="/careers"
                        className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-soft transition-colors"
                      >
                        Browse Other Positions
                      </Link>
                    </div>
                  </div>
                ) : (
                  /* Application Form */
                  <form onSubmit={handleSubmit} className="space-y-8 relative z-10 font-sans">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-700 dark:text-teal-300 text-[11px] font-mono font-bold uppercase tracking-wider mb-2">
                        <span>CANDIDATE APPLICATION PORTAL</span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                        Apply for {career.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        Please complete the required details below and attach your resume. All submissions are reviewed directly by our recruitment panel.
                      </p>
                    </div>

                    {submitError && (
                      <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-800 dark:text-rose-300 text-xs flex items-start gap-3">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                        <span className="leading-relaxed font-medium">{submitError}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Full Name */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-foreground flex items-center justify-between">
                          <span>Full Name <span className="text-rose-500">*</span></span>
                        </label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Aditya Sharma"
                          className={`w-full px-4 py-3 text-xs bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-medium text-foreground transition-all ${
                            formErrors.fullName ? 'border-rose-500 bg-rose-500/5' : 'border-border/80 focus:border-teal-600'
                          }`}
                        />
                        {formErrors.fullName && (
                          <span className="text-[11px] text-rose-500 font-medium block">{formErrors.fullName}</span>
                        )}
                      </div>

                      {/* Email Address */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-foreground flex items-center justify-between">
                          <span>Email Address <span className="text-rose-500">*</span></span>
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="aditya@example.com"
                          className={`w-full px-4 py-3 text-xs bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-medium text-foreground transition-all ${
                            formErrors.email ? 'border-rose-500 bg-rose-500/5' : 'border-border/80 focus:border-teal-600'
                          }`}
                        />
                        {formErrors.email && (
                          <span className="text-[11px] text-rose-500 font-medium block">{formErrors.email}</span>
                        )}
                      </div>

                      {/* Phone Number */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-foreground flex items-center justify-between">
                          <span>Phone Number <span className="text-rose-500">*</span></span>
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className={`w-full px-4 py-3 text-xs bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-medium text-foreground transition-all ${
                            formErrors.phone ? 'border-rose-500 bg-rose-500/5' : 'border-border/80 focus:border-teal-600'
                          }`}
                        />
                        {formErrors.phone && (
                          <span className="text-[11px] text-rose-500 font-medium block">{formErrors.phone}</span>
                        )}
                      </div>

                      {/* LinkedIn Profile */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-foreground flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <Linkedin className="w-3.5 h-3.5 text-teal-600" />
                            LinkedIn URL <span className="text-muted-foreground font-normal text-[11px]">(Optional)</span>
                          </span>
                        </label>
                        <input
                          type="url"
                          value={linkedInUrl}
                          onChange={(e) => setLinkedInUrl(e.target.value)}
                          placeholder="https://linkedin.com/in/username"
                          className="w-full px-4 py-3 text-xs bg-background border border-border/80 focus:border-teal-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-medium text-foreground transition-all"
                        />
                      </div>
                    </div>

                    {/* Portfolio / GitHub URL */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-teal-600" />
                          Portfolio / GitHub / Website <span className="text-muted-foreground font-normal text-[11px]">(Optional)</span>
                        </span>
                      </label>
                      <input
                        type="url"
                        value={portfolioUrl}
                        onChange={(e) => setPortfolioUrl(e.target.value)}
                        placeholder="https://github.com/username or https://portfolio.com"
                        className="w-full px-4 py-3 text-xs bg-background border border-border/80 focus:border-teal-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-medium text-foreground transition-all"
                      />
                    </div>

                    {/* Resume Upload Box */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-foreground flex items-center justify-between">
                        <span>Resume / CV Document <span className="text-rose-500">*</span></span>
                        <span className="text-[11px] text-muted-foreground font-normal">PDF, DOC, DOCX up to 10MB</span>
                      </label>

                      <input
                        type="file"
                        ref={fileInputRef}
                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        className="hidden"
                        onChange={(e) => handleFileSelection(e.target.files?.[0])}
                      />

                      {resumeFile ? (
                        /* Selected file badge */
                        <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-teal-600 text-white">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-foreground truncate max-w-xs sm:max-w-md">
                                {resumeFile.name}
                              </p>
                              <span className="text-[11px] text-teal-800 dark:text-teal-300 font-mono">
                                {(resumeFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for submission
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => setResumeFile(null)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title="Remove file"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        /* Drag & Drop Upload Zone */
                        <div
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current?.click()}
                          className={`p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center space-y-2.5 ${
                            isDragging
                              ? 'border-teal-500 bg-teal-500/10'
                              : formErrors.resume
                              ? 'border-rose-400 bg-rose-500/5'
                              : 'border-border/80 hover:border-teal-500/60 bg-muted/20 hover:bg-muted/40'
                          }`}
                        >
                          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto">
                            <UploadCloud className="w-6 h-6" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-foreground">
                              Click to upload or drag & drop your resume
                            </span>
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                              Supported formats: PDF, DOC, DOCX (Max 10MB)
                            </p>
                          </div>
                        </div>
                      )}

                      {formErrors.resume && (
                        <span className="text-[11px] text-rose-500 font-medium block">{formErrors.resume}</span>
                      )}
                    </div>

                    {/* Cover Letter / Message */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground flex items-center justify-between">
                        <span>Cover Letter / Candidate Note <span className="text-rose-500">*</span></span>
                        <span className="text-[11px] text-muted-foreground font-normal">Tell us about your relevant projects & experience</span>
                      </label>
                      <textarea
                        rows={5}
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        placeholder="Share a brief overview of your background, why you're interested in Veenero's water intelligence mission, and key relevant achievements..."
                        className={`w-full px-4 py-3 text-xs bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-medium text-foreground transition-all resize-y ${
                          formErrors.coverLetter ? 'border-rose-500 bg-rose-500/5' : 'border-border/80 focus:border-teal-600'
                        }`}
                      />
                      {formErrors.coverLetter && (
                        <span className="text-[11px] text-rose-500 font-medium block">{formErrors.coverLetter}</span>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto px-8 py-4 bg-teal-700 hover:bg-teal-800 disabled:opacity-60 text-white rounded-xl text-xs sm:text-sm font-extrabold shadow-soft hover:shadow-glow hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Submitting Application...</span>
                          </>
                        ) : (
                          <>
                            <span>Submit Application →</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>

            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CareerDetailsPage;
