import React, { useState, useEffect, useRef } from "react";
import { ContactPageContent } from "@/content/contact";
import {
  Phone,
  Mail,
  Send,
  CheckCircle2,
  Loader2,
  Building2,
  Landmark,
  Droplets,
  ArrowRight,
  Leaf,
  ExternalLink,
} from "lucide-react";

import { submitContactInquiry } from "@/services/contact.service";

interface ContactFormSectionProps {
  contactInfo?: ContactPageContent["contactInfo"];
  demoCard?: ContactPageContent["demoCard"];
  form: ContactPageContent["form"];
}

// Focus area options matching intent cards
const focusAreas = [
  { id: "enterprise", label: "Solutions & Projects" },
  { id: "municipal", label: "Municipal & Utilities" },
  { id: "esg", label: "ESG & Compliance" },
  { id: "general", label: "Partnerships & Other" },
];

export const ContactFormSection: React.FC<ContactFormSectionProps> = ({
  contactInfo,
  demoCard,
  form,
}) => {
  const [focusArea, setFocusArea] = useState<string>("enterprise");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const [sectionVisible, setSectionVisible] = useState(false);

  useEffect(() => {
    // Section reveal
    const secObs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setSectionVisible(true); secObs.disconnect(); } },
      { threshold: 0.1 }
    );
    if (sectionRef.current) secObs.observe(sectionRef.current);

    return () => { secObs.disconnect(); };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setErrorMessage("Please enter a valid work email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitContactInquiry({
        name: formData.name.trim(),
        email: formData.email.trim(),
        organization: formData.company.trim(),
        inquiryType: focusArea,
        message: formData.message.trim(),
        source: "Contact Page Form",
      });
      setIsSuccess(true);
      setFormData({ name: "", email: "", company: "", message: "" });
      setTimeout(() => setIsSuccess(false), 6000);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="inquiry-form"
      ref={sectionRef}
      className="relative z-20 select-none bg-white dark:bg-background border-b border-slate-200/60 dark:border-teal-900/20"
    >
      {/* ── Main Contact Form + Office ── */}
      <div className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl">
          <div
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start font-sans"
            style={{
              opacity: sectionVisible ? 1 : 0,
              transform: sectionVisible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s",
            }}
          >

            {/* LEFT: Form Column */}
            <div className="lg:col-span-7 space-y-6 text-left">

              {/* Section Header */}
              <div>
                <span className="text-teal-700 dark:text-teal-400 font-bold uppercase tracking-widest text-xs font-mono block mb-1.5">
                  START A CONVERSATION
                </span>
                <div className="w-10 h-0.5 bg-teal-600 rounded-full mb-3" />
                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white leading-tight tracking-tight">
                  How Can We Help Your{" "}
                  <span className="text-[#136873] dark:text-teal-400">Water Operations?</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-2 max-w-xl">
                  Fill out the form below and our team will get back to you shortly. Select your focus area to help us route your inquiry faster.
                </p>
              </div>

              {/* Premium Form Card */}
              <div className="bg-white dark:bg-card p-7 sm:p-8 rounded-2xl border border-border/60 shadow-sm hover:shadow-md transition-all">

                {/* Success Banner */}
                {isSuccess && (
                  <div className="mb-5 p-4 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-600/30 text-left space-y-1">
                    <div className="flex items-center gap-2 text-teal-800 dark:text-teal-300 font-bold text-sm">
                      <CheckCircle2 className="h-4 w-4 text-teal-600" />
                      <span>{form.successTitle || "Message Sent Successfully!"}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {form.successMessage || "We'll get back to you within 24 business hours."}
                    </p>
                  </div>
                )}

                {/* Error Banner */}
                {errorMessage && (
                  <div className="mb-5 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-500/30 text-left space-y-1 text-xs text-rose-800 dark:text-rose-300 font-medium">
                    ✕ {errorMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Sharma"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border/70 bg-slate-50/50 dark:bg-slate-900/60 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-600 transition-all placeholder:text-muted-foreground/60 font-medium"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                        Work Email <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="name@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border/70 bg-slate-50/50 dark:bg-slate-900/60 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-600 transition-all placeholder:text-muted-foreground/60 font-medium"
                      />
                    </div>
                  </div>

                  {/* Organization */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      Organization
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Enterprise Ltd / Municipal Water Board"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border/70 bg-slate-50/50 dark:bg-slate-900/60 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-600 transition-all placeholder:text-muted-foreground/60 font-medium"
                    />
                  </div>

                  {/* Focus Area Selector */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      Focus Area
                    </label>
                    <select
                      value={focusArea}
                      onChange={(e) => setFocusArea(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border/70 bg-slate-50/50 dark:bg-slate-900/60 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-600 transition-all font-medium"
                    >
                      {focusAreas.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      Your Message <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tell us about your facility nodes, telemetry requirements, or water management goals..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border/70 bg-slate-50/50 dark:bg-slate-900/60 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-600 transition-all placeholder:text-muted-foreground/60 resize-y font-medium"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-6 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold shadow-soft hover:shadow-glow hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-xs sm:text-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send className="h-4 w-4" />
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center flex items-center justify-center gap-1 font-sans">
                    <CheckCircle2 className="w-3 h-3 text-teal-500" />
                    Your information is secure and will only be used to respond to your inquiry.
                  </p>
                </form>
              </div>
            </div>

            {/* RIGHT: Our Office Column */}
            <div className="lg:col-span-5 space-y-6 text-left">

              {/* Office Header */}
              <div>
                <span className="text-teal-700 dark:text-teal-400 font-bold uppercase tracking-widest text-xs font-mono block mb-1.5">
                  OUR OFFICE
                </span>
                <div className="w-10 h-0.5 bg-teal-600 rounded-full mb-3" />
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white leading-tight tracking-tight">
                  Visit Us in{" "}
                  <span className="text-[#136873] dark:text-teal-400">New Delhi, India</span>
                </h2>
              </div>

              {/* Office Info Card */}
              <div className="bg-white dark:bg-card p-6 rounded-2xl border border-border/60 hover:border-teal-500/40 shadow-sm hover:shadow-card hover:-translate-y-1 transition-all duration-300 space-y-4 font-sans">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-600/10 dark:bg-teal-400/15 border border-teal-600/20 dark:border-teal-400/30 flex items-center justify-center text-teal-700 dark:text-teal-300 shrink-0 mt-0.5">
                    <Building2 className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white mb-0.5">Veenero Technologies Pvt. Ltd.</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      A-123, Sector 63<br />
                      Noida, Uttar Pradesh 201309<br />
                      India
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-600/10 dark:bg-teal-400/15 border border-teal-600/20 dark:border-teal-400/30 flex items-center justify-center text-teal-700 dark:text-teal-300 shrink-0">
                    <Phone className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono mb-0.5">Phone</p>
                    <a href="tel:+919876543210" className="text-xs font-bold text-teal-700 dark:text-teal-300 hover:text-teal-600 transition-colors">
                      +91 98765 43210
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-600/10 dark:bg-teal-400/15 border border-teal-600/20 dark:border-teal-400/30 flex items-center justify-center text-teal-700 dark:text-teal-300 shrink-0">
                    <Mail className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono mb-0.5">Email</p>
                    <a href="mailto:hello@veenero.com" className="text-xs font-bold text-teal-700 dark:text-teal-300 hover:text-teal-600 transition-colors">
                      hello@veenero.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div
                id="office-map"
                className="relative rounded-2xl border border-border/60 overflow-hidden shadow-sm bg-slate-100 dark:bg-slate-900"
                style={{ height: "220px" }}
              >
                <iframe
                  title="Veenero Office Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.0!2d77.3720!3d28.6251!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce5a2f!2sNoida%2C+Uttar+Pradesh!5e0!3m2!1sen!2sin!4v1"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: "saturate(0.8) brightness(1.05)" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />

                {/* View on Google Maps CTA */}
                <a
                  href="https://maps.google.com/?q=Noida,Uttar Pradesh,India"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-900 rounded-lg text-[10px] font-bold text-teal-700 dark:text-teal-300 border border-border/60 shadow-sm hover:shadow-md hover:border-teal-500/50 transition-all font-sans"
                >
                  <span>View on Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Office Hours Note */}
              <div className="flex items-start gap-3 p-4 bg-teal-50/60 dark:bg-teal-950/20 rounded-xl border border-teal-600/15 dark:border-teal-400/15 font-sans">
                <div className="w-8 h-8 rounded-lg bg-teal-600/10 border border-teal-600/20 flex items-center justify-center text-teal-700 dark:text-teal-300 shrink-0 mt-0.5">
                  <Leaf className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 font-mono mb-0.5">Office Hours</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Monday – Friday, 9:00 AM to 6:00 PM IST. For urgent matters, email us directly.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactFormSection;
