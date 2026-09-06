import React, { useState } from 'react';
import { X, Calendar, CheckCircle2, Loader2, Sparkles, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { submitDemoRequest } from '@/services/contact.service';

interface DemoRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  source?: string;
}

export const DemoRequestModal: React.FC<DemoRequestModalProps> = ({
  isOpen,
  onClose,
  title = 'Schedule a Platform Demo',
  description = 'Experience Veenero Sense, Intelligence, and Insights built to deliver Water Verification-ready reporting and real-time analytics.',
  source = 'Contact Page Book Demo',
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Client-side email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitDemoRequest({
        name: formData.name.trim(),
        email: formData.email.trim(),
        organization: formData.company.trim(),
        phone: formData.phone.trim(),
        message: formData.message.trim() || 'Schedule a Platform Demo live walkthrough',
        source,
      });
      setIsSuccess(true);
      setFormData({ name: '', email: '', company: '', phone: '', message: '' });
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit demo request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setErrorMessage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in-0 duration-200">
      <div
        className="relative w-full max-w-lg bg-card border border-border/80 rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden font-sans select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6 text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-700 dark:text-teal-300 text-xs font-mono font-bold mb-2.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PLATFORM DEMO</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground tracking-tight">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 leading-relaxed">
            {description}
          </p>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Demo Request Received!</h3>
              <p className="text-xs text-muted-foreground mt-1.5 max-w-sm mx-auto leading-relaxed">
                Thank you! Our water intelligence solution engineering team will reach out within 24 hours to schedule your interactive session.
              </p>
            </div>
            <Button
              type="button"
              variant="ocean"
              onClick={handleClose}
              className="mt-4 rounded-xl px-6 font-bold"
            >
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300 text-xs font-medium">
                {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <Input
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-10 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">
                  Work Email <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-10 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">
                  Company / Organization
                </label>
                <Input
                  placeholder="e.g. Industrial Mfg Corp"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="h-10 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="h-10 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                Requirements / Focus Area
              </label>
              <Textarea
                rows={3}
                placeholder="Tell us what you would like to explore (e.g. multi-site telemetry, anomaly detection, ESG audit export)..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="text-xs resize-none"
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="ocean"
                size="lg"
                className="w-full font-bold text-xs sm:text-sm rounded-xl cursor-pointer"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Scheduling Demo...
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4 mr-2" />
                    Request Platform Demo
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default DemoRequestModal;
