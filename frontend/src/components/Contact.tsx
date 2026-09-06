import { useState, useEffect } from "react";
import * as Icons from "lucide-react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getPublicHome, HomeContact } from "@/services/home.service";
import { contactContent } from "@/content/home/contact";
import { mergeHomeSection } from "@/utils/mergeHomeSection";
import { submitContactInquiry, getPublicContactContent } from "@/services/contact.service";
import { DemoRequestModal } from "@/components/contact/DemoRequestModal";

export const Contact = () => {
  const [contactData, setContactData] = useState<HomeContact>(contactContent);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      getPublicHome().catch(() => null),
      getPublicContactContent().catch(() => null),
    ]).then(([homeData, contactCms]) => {
      if (cancelled) return;
      let merged = contactContent;
      if (homeData?.contact) {
        merged = mergeHomeSection(merged, homeData.contact);
      }
      if (contactCms) {
        if (contactCms.contactInfo?.items?.length) {
          merged = {
            ...merged,
            infoTitle: contactCms.contactInfo.title || merged.infoTitle,
            infoList: contactCms.contactInfo.items.map((it) => ({
              iconName: it.iconName || "MapPin",
              label: it.label,
              value: it.value,
            })),
          };
        }
        if (contactCms.demoCard?.title) {
          merged = {
            ...merged,
            demoTitle: contactCms.demoCard.title,
            demoDescription: contactCms.demoCard.description || merged.demoDescription,
            demoButtonText: contactCms.demoCard.buttonText || merged.demoButtonText,
          };
        }
      }
      setContactData(merged);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formState.email.trim())) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitContactInquiry({
        name: formState.name.trim(),
        email: formState.email.trim(),
        organization: formState.company.trim(),
        message: formState.message.trim(),
        source: "Public Contact Section",
      });

      setIsSuccess(true);
      setFormState({ name: "", email: "", company: "", message: "" });
      setTimeout(() => setIsSuccess(false), 6000);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (contactData.visible === false) return null;

  return (
    <section id="contact" className="py-16 md:py-20 bg-gradient-wave relative">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 reveal-on-scroll">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/25 mb-4 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping inline-block" />
            <span className="text-teal-700 dark:text-teal-300 font-bold uppercase tracking-widest text-[10px] md:text-xs">
              GET IN TOUCH
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            {contactData.title}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {contactData.description}
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-12 reveal-on-scroll reveal-delay-100">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-card rounded-2xl p-8 shadow-card border border-border hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 group/info">
              <h3 className="font-display text-xl font-semibold text-foreground mb-6">
                {contactData.infoTitle || "Contact Information"}
              </h3>
              <div className="space-y-6">
                {contactData.infoList.map((info, idx) => {
                  const IconComp = (Icons as any)[info.iconName] || Icons.MapPin;
                  return (
                    <div key={`${info.label}-${idx}`} className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center flex-shrink-0 group-hover/info:scale-105 hover-ripple-subtle transition-all duration-300">
                        <IconComp className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {info.label}
                        </p>
                        <p className="font-medium text-foreground">{info.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-gradient-ocean rounded-2xl p-8 text-primary-foreground shadow-card hover:shadow-glow hover:-translate-y-1 transition-all duration-300">
              <h3 className="font-display text-xl font-semibold mb-4">
                {contactData.demoTitle || "Schedule a Platform Demo"}
              </h3>
              <p className="text-primary-foreground/85 mb-6">
                {contactData.demoDescription}
              </p>
              <Button
                variant="hero"
                size="lg"
                className="w-full cursor-pointer transition-all hover:scale-[1.02]"
                onClick={() => setIsDemoModalOpen(true)}
              >
                {contactData.demoButtonText || "Book Demo"}
              </Button>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3 flex flex-col">
            <form
              onSubmit={handleSubmit}
              className="bg-card rounded-2xl p-8 md:p-9 shadow-card border border-border hover:border-primary/30 transition-all duration-300 flex-1 flex flex-col justify-between"
            >
              <div className="space-y-6">
                <h3 className="font-display text-xl sm:text-2xl font-semibold text-foreground">
                  {contactData.formTitle || "Send Us a Message"}
                </h3>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Full Name *
                    </label>
                    <Input
                      required
                      placeholder="John Smith"
                      value={formState.name}
                      onChange={(e) =>
                        setFormState({ ...formState, name: e.target.value })
                      }
                      className="h-12"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      required
                      placeholder="john@company.com"
                      value={formState.email}
                      onChange={(e) =>
                        setFormState({ ...formState, email: e.target.value })
                      }
                      className="h-12"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Company
                  </label>
                  <Input
                    placeholder="Your company name"
                    value={formState.company}
                    onChange={(e) =>
                      setFormState({ ...formState, company: e.target.value })
                    }
                    className="h-12"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Message *
                  </label>
                  <Textarea
                    required
                    placeholder="Tell us about your water management needs..."
                    rows={6}
                    className="min-h-[160px] resize-none"
                    value={formState.message}
                    onChange={(e) =>
                      setFormState({ ...formState, message: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-border/30">
                <Button
                  type="submit"
                  variant="ocean"
                  size="xl"
                  className="w-full cursor-pointer"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Message
                      <Send className="h-5 w-5" />
                    </>
                  )}
                </Button>
                {errorMessage && (
                  <div className="mt-4 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm font-medium text-center animate-in fade-in-0">
                    ✕ {errorMessage}
                  </div>
                )}
                {isSuccess && (
                  <div className="mt-4 p-4 bg-teal-50 border border-teal-200 rounded-xl text-teal-800 text-sm font-medium text-center animate-in fade-in-0">
                    ✓ Message sent successfully! We'll get back to you within 24 hours.
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Book Demo Interactive Modal Flow */}
      <DemoRequestModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        title={contactData.demoTitle || "Schedule a Platform Demo"}
        description={contactData.demoDescription || "Experience Veenero Sense, Intelligence, and Insights live on your infrastructure."}
        source="Home Page Book Demo Button"
      />
    </section>
  );
};
