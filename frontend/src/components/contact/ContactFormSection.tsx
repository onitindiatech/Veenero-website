import React, { useState } from "react";
import { ContactPageContent } from "@/content/contact";
import { MapPin, Phone, Mail, Send, CheckCircle2, Loader2, Sparkles } from "lucide-react";

interface ContactFormSectionProps {
  contactInfo: ContactPageContent["contactInfo"];
  demoCard: ContactPageContent["demoCard"];
  form: ContactPageContent["form"];
}

const contactIcons: Record<string, React.ElementType> = {
  MapPin,
  Phone,
  Mail,
};

export const ContactFormSection: React.FC<ContactFormSectionProps> = ({
  contactInfo,
  demoCard,
  form,
}) => {
  const [inquiryType, setInquiryType] = useState<string>("enterprise");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate async submission and lead capture
    await new Promise((resolve) => setTimeout(resolve, 800));

    setIsSuccess(true);
    setIsSubmitting(false);
    setFormData({ name: "", email: "", company: "", message: "" });
  };

  const handleSelectDemo = () => {
    setInquiryType("enterprise");
    const el = document.getElementById("contact-form-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="contact-form-section" className="py-12 md:py-16 bg-transparent relative border-b border-border/10">
      {/* Background Water Light Element */}
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="container mx-auto px-6 md:px-12 max-w-7xl space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start font-sans">
          
          {/* Left Column (5 cols): Contact Details & Demo Card */}
          <div className="lg:col-span-5 space-y-6 text-left">
            
            {/* Contact Details Card */}
            <div className="bg-card p-6 md:p-8 rounded-2xl border border-border/40 shadow-sm space-y-6">
              <div>
                <span className="text-teal-600 dark:text-teal-400 font-bold uppercase tracking-widest text-[10px] md:text-xs block mb-2">
                  {contactInfo.eyebrow}
                </span>
                <h3 className="font-display text-2xl font-bold text-foreground">
                  {contactInfo.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-1">
                  {contactInfo.description}
                </p>
              </div>

              <div className="space-y-4 pt-2 border-t border-border/20">
                {contactInfo.items.map((item, idx) => {
                  const Icon = contactIcons[item.iconName] || Mail;
                  const content = (
                    <div className="flex items-start gap-4 group/item">
                      <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400 shrink-0 group-hover/item:scale-110 transition-transform duration-300">
                        <Icon className="h-5 w-5 stroke-[2]" />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                          {item.label}
                        </p>
                        <p className="text-xs sm:text-sm font-semibold text-foreground group-hover/item:text-teal-700 transition-colors">
                          {item.value}
                        </p>
                        {item.note && (
                          <p className="text-[11px] text-teal-700/70 dark:text-teal-400/70 mt-0.5">
                            {item.note}
                          </p>
                        )}
                      </div>
                    </div>
                  );

                  if (item.href) {
                    return (
                      <a
                        key={idx}
                        href={item.href}
                        className="block hover:opacity-90 transition-opacity"
                      >
                        {content}
                      </a>
                    );
                  }
                  return <div key={idx}>{content}</div>;
                })}
              </div>
            </div>

            {/* Platform Demo Callout Card */}
            <div
              id="demo-card-section"
              className="bg-gradient-to-br from-teal-900 via-teal-800 to-cyan-950 p-6 md:p-8 rounded-2xl text-white shadow-soft relative overflow-hidden space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-teal-200 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm border border-white/15">
                  <Sparkles className="h-3 w-3 text-cyan-300" />
                  {demoCard.badge}
                </span>
              </div>

              <h4 className="font-display text-xl font-bold leading-snug">
                {demoCard.title}
              </h4>

              <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed">
                {demoCard.description}
              </p>

              <div className="space-y-2 pt-2">
                {demoCard.bulletPoints.map((point, pIdx) => (
                  <div key={pIdx} className="flex items-start gap-2 text-xs text-teal-50">
                    <CheckCircle2 className="h-3.5 w-3.5 text-cyan-300 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleSelectDemo}
                className="w-full mt-2 py-3 bg-white hover:bg-teal-50 text-teal-900 rounded-xl font-bold text-xs sm:text-sm shadow-sm transition-all duration-200"
              >
                {demoCard.buttonText}
              </button>
            </div>

          </div>

          {/* Right Column (7 cols): High-UX Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-card p-6 md:p-10 rounded-2xl border border-border/40 shadow-soft">
              
              <div className="mb-6 text-left">
                <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                  {form.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  {form.subtitle}
                </p>
              </div>

              {/* Inquiry Type Pill Selector */}
              <div className="space-y-2 mb-6 text-left">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                  Inquiry Focus Area
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {form.inquiryTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setInquiryType(type.id)}
                      className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all duration-150 flex items-center justify-between ${
                        inquiryType === type.id
                          ? "bg-teal-50 dark:bg-teal-950/40 border-teal-600/40 text-teal-800 dark:text-teal-300 shadow-sm"
                          : "bg-background border-border/40 text-foreground/80 hover:border-teal-600/20"
                      }`}
                    >
                      <span>{type.label}</span>
                      {inquiryType === type.id && (
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-600 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Success Banner */}
              {isSuccess && (
                <div className="mb-6 p-4 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-600/20 text-left space-y-1 animate-fade-in">
                  <div className="flex items-center gap-2 text-teal-800 dark:text-teal-300 font-bold text-sm">
                    <CheckCircle2 className="h-4 w-4 text-teal-600" />
                    <span>{form.successTitle}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {form.successMessage}
                  </p>
                </div>
              )}

              {/* Form Elements */}
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-border/60 bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition-all placeholder:text-muted-foreground/60"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">
                      Work Email <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-border/60 bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition-all placeholder:text-muted-foreground/60"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">
                    Organization / Facility Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Enterprise Ltd / Metro Water Board"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border/60 bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition-all placeholder:text-muted-foreground/60"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">
                    Inquiry Details <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us about your water monitoring nodes, facility requirements, or telemetry goals..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border/60 bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition-all placeholder:text-muted-foreground/60 resize-y"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold shadow-soft hover:-translate-y-0.5 transition-all duration-200 text-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Transmitting Inquiry...</span>
                    </>
                  ) : (
                    <>
                      <span>{form.submitButtonText}</span>
                      <Send className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactFormSection;
