import React, { useState, useEffect, useRef } from "react";
import { ContactPageContent } from "@/content/contact";
import {
  Phone,
  Mail,
  Send,
  CheckCircle2,
  Loader2,
  Building2,
  ExternalLink,
  Leaf,
} from "lucide-react";

import { submitContactInquiry } from "@/services/contact.service";
import { PublicContactOffice, PublicContactOfficeHours } from "@/services/contact.service";

interface ContactFormSectionProps {
  contactInfo?: ContactPageContent["contactInfo"];
  demoCard?: ContactPageContent["demoCard"];
  form: ContactPageContent["form"] & {
    sectionEyebrow?: string;
    sectionHeading?: string;
    sectionDescription?: string;
    nameLabel?: string;
    emailLabel?: string;
    organizationLabel?: string;
    focusAreaLabel?: string;
    messageLabel?: string;
    namePlaceholder?: string;
    emailPlaceholder?: string;
    organizationPlaceholder?: string;
    messagePlaceholder?: string;
    inquiryTypes?: { id: string; label: string }[];
    errorMessage?: string;
  };
  office?: PublicContactOffice;
  officeHours?: PublicContactOfficeHours;
}

export const ContactFormSection: React.FC<ContactFormSectionProps> = ({
  contactInfo,
  demoCard,
  form,
  office,
  officeHours,
}) => {
  // Resolve focus area options — prefer CMS inquiryTypes, fall back to static list
  const focusAreas =
    form?.inquiryTypes && form.inquiryTypes.length > 0
      ? form.inquiryTypes
      : [
          { id: "enterprise", label: "Solutions & Projects" },
          { id: "municipal", label: "Municipal & Utilities" },
          { id: "esg", label: "ESG & Compliance" },
          { id: "general", label: "Partnerships & Other" },
        ];

  const [focusArea, setFocusArea] = useState<string>(focusAreas[0]?.id || "enterprise");
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
    const secObs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setSectionVisible(true); secObs.disconnect(); } },
      { threshold: 0.1 }
    );
    if (sectionRef.current) secObs.observe(sectionRef.current);
    return () => { secObs.disconnect(); };
  }, []);

  // Sync focus area if CMS changes what options are available
  useEffect(() => {
    if (focusAreas.length > 0 && !focusAreas.find(f => f.id === focusArea)) {
      setFocusArea(focusAreas[0].id);
    }
  }, [form?.inquiryTypes]);

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
      setErrorMessage(err.message || form?.errorMessage || "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Resolved CMS values with fallbacks ───────────────────────────────────
  const sectionEyebrow = form?.sectionEyebrow || "START A CONVERSATION";
  const sectionHeading = form?.sectionHeading || "How Can We Help Your Water Operations?";
  const sectionDescription = form?.sectionDescription || "Fill out the form below and our team will get back to you shortly. Select your focus area to help us route your inquiry faster.";

  const nameLabel = form?.nameLabel || "Full Name";
  const emailLabel = form?.emailLabel || "Work Email";
  const organizationLabel = form?.organizationLabel || "Organization";
  const focusAreaLabel = form?.focusAreaLabel || "Focus Area";
  const messageLabel = form?.messageLabel || "Your Message";
  const namePlaceholder = form?.namePlaceholder || "e.g. Rahul Sharma";
  const emailPlaceholder = form?.emailPlaceholder || "name@company.com";
  const organizationPlaceholder = form?.organizationPlaceholder || "e.g. Enterprise Ltd / Municipal Water Board";
  const messagePlaceholder = form?.messagePlaceholder || "Tell us about your facility nodes, telemetry requirements, or water management goals...";
  const submitButtonText = form?.submitButtonText || "Send Message";

  // Office section resolved values
  const officeEyebrow = office?.sectionEyebrow || "OUR OFFICE";
  const officeHeading = office?.sectionHeading || "Visit Us in Adilabad, India";
  const companyName = office?.companyName || "Veenero Solutions Pvt. Ltd.";
  const addressLine1 = office?.addressLine1 || "H-no 3-294/1/A/1, Tailors Colony";
  const addressLine2 = office?.addressLine2 || "";
  const city = office?.city || "Adilabad";
  const state = office?.state || "Telangana";
  const zip = office?.zip || "504001";
  const country = office?.country || "India";
  const officePhone = office?.phone || "+91 9346517202";
  const officePhoneHref = office?.phoneHref || "tel:+919346517202";
  const officeEmail = office?.email || "info@veenerosolutions.com";
  const officeEmailHref = office?.emailHref || "mailto:info@veenerosolutions.com";
  const mapEmbedUrl = office?.mapEmbedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3785.0!2d78.5322!3d19.6641!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcf5c2b!2sAdilabad%2C+Telangana!5e0!3m2!1sen!2sin!4v1";
  const mapLinkUrl = office?.mapLinkUrl || "https://maps.google.com/?q=Adilabad,Telangana,India";
  const mapLinkText = office?.mapLinkText || "View on Google Maps";

  const officeHoursEyebrow = officeHours?.eyebrow || "Office Hours";
  const officeHoursText = officeHours?.text || "Monday – Friday, 9:00 AM to 6:00 PM IST. For urgent matters, email us directly.";

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
                  {sectionEyebrow}
                </span>
                <div className="w-10 h-0.5 bg-teal-600 rounded-full mb-3" />
                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white leading-tight tracking-tight">
                  {sectionHeading.includes("Water Operations") ? (
                    <>
                      {sectionHeading.split("Water Operations")[0]}
                      <span className="text-[#136873] dark:text-teal-400">Water Operations?</span>
                    </>
                  ) : (
                    sectionHeading
                  )}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-2 max-w-xl">
                  {sectionDescription}
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
                        {nameLabel} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={namePlaceholder}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border/70 bg-slate-50/50 dark:bg-slate-900/60 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-600 transition-all placeholder:text-muted-foreground/60 font-medium"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                        {emailLabel} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder={emailPlaceholder}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border/70 bg-slate-50/50 dark:bg-slate-900/60 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-600 transition-all placeholder:text-muted-foreground/60 font-medium"
                      />
                    </div>
                  </div>

                  {/* Organization */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      {organizationLabel}
                    </label>
                    <input
                      type="text"
                      placeholder={organizationPlaceholder}
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border/70 bg-slate-50/50 dark:bg-slate-900/60 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-600 transition-all placeholder:text-muted-foreground/60 font-medium"
                    />
                  </div>

                  {/* Focus Area Selector */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      {focusAreaLabel}
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
                      {messageLabel} <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder={messagePlaceholder}
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
                        <span>{submitButtonText}</span>
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
                  {officeEyebrow}
                </span>
                <div className="w-10 h-0.5 bg-teal-600 rounded-full mb-3" />
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white leading-tight tracking-tight">
                  {officeHeading.includes(",") ? (
                    <>
                      Visit Us in{" "}
                      <span className="text-[#136873] dark:text-teal-400">
                        {officeHeading.replace(/^Visit Us in\s*/i, "")}
                      </span>
                    </>
                  ) : (
                    officeHeading
                  )}
                </h2>
              </div>

              {/* Office Info Card */}
              <div className="bg-white dark:bg-card p-6 rounded-2xl border border-border/60 hover:border-teal-500/40 shadow-sm hover:shadow-card hover:-translate-y-1 transition-all duration-300 space-y-4 font-sans">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-600/10 dark:bg-teal-400/15 border border-teal-600/20 dark:border-teal-400/30 flex items-center justify-center text-teal-700 dark:text-teal-300 shrink-0 mt-0.5">
                    <Building2 className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white mb-0.5">{companyName}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {addressLine1}{addressLine2 ? <><br />{addressLine2}</> : null}<br />
                      {city}, {state} {zip}<br />
                      {country}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-600/10 dark:bg-teal-400/15 border border-teal-600/20 dark:border-teal-400/30 flex items-center justify-center text-teal-700 dark:text-teal-300 shrink-0">
                    <Phone className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono mb-0.5">Phone</p>
                    <a href={officePhoneHref} className="text-xs font-bold text-teal-700 dark:text-teal-300 hover:text-teal-600 transition-colors">
                      {officePhone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-600/10 dark:bg-teal-400/15 border border-teal-600/20 dark:border-teal-400/30 flex items-center justify-center text-teal-700 dark:text-teal-300 shrink-0">
                    <Mail className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono mb-0.5">Email</p>
                    <a href={officeEmailHref} className="text-xs font-bold text-teal-700 dark:text-teal-300 hover:text-teal-600 transition-colors">
                      {officeEmail}
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
                  src={mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: "saturate(0.8) brightness(1.05)" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />

                {/* View on Google Maps CTA */}
                <a
                  href={mapLinkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-900 rounded-lg text-[10px] font-bold text-teal-700 dark:text-teal-300 border border-border/60 shadow-sm hover:shadow-md hover:border-teal-500/50 transition-all font-sans"
                >
                  <span>{mapLinkText}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Office Hours Note */}
              <div className="flex items-start gap-3 p-4 bg-teal-50/60 dark:bg-teal-950/20 rounded-xl border border-teal-600/15 dark:border-teal-400/15 font-sans">
                <div className="w-8 h-8 rounded-lg bg-teal-600/10 border border-teal-600/20 flex items-center justify-center text-teal-700 dark:text-teal-300 shrink-0 mt-0.5">
                  <Leaf className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 font-mono mb-0.5">
                    {officeHoursEyebrow}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {officeHoursText}
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
