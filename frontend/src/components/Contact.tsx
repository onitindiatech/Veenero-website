import { useState, useEffect } from "react";
import * as Icons from "lucide-react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getPublicHome, HomeContact } from "@/services/home.service";
import { contactContent } from "@/content/home/contact";
import { mergeHomeSection } from "@/utils/mergeHomeSection";

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

  useEffect(() => {
    let cancelled = false;
    getPublicHome()
      .then((data) => {
        if (!cancelled && data?.contact) {
          setContactData(mergeHomeSection(contactContent, data.contact));
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSuccess(true);
    setFormState({ name: "", email: "", company: "", message: "" });
    setIsSubmitting(false);
    setTimeout(() => setIsSuccess(false), 5000);
  };

  if (contactData.visible === false) return null;

  return (
    <section id="contact" className="py-16 md:py-20 bg-gradient-wave relative">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">

          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            {contactData.title}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {contactData.description}
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-card rounded-2xl p-8 shadow-card border border-border">
              <h3 className="font-display text-xl font-semibold text-foreground mb-6">
                {contactData.infoTitle || "Contact Information"}
              </h3>
              <div className="space-y-6">
                {contactData.infoList.map((info, idx) => {
                  const IconComp = (Icons as any)[info.iconName] || Icons.MapPin;
                  return (
                    <div key={`${info.label}-${idx}`} className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
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

            <div className="bg-gradient-ocean rounded-2xl p-8 text-primary-foreground">
              <h3 className="font-display text-xl font-semibold mb-4">
                {contactData.demoTitle || "Schedule a Platform Demo"}
              </h3>
              <p className="text-primary-foreground/85 mb-6">
                {contactData.demoDescription}
              </p>
              <Button variant="hero" size="lg" className="w-full">
                {contactData.demoButtonText || "Book Demo"}
              </Button>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              className="bg-card rounded-2xl p-8 shadow-card border border-border"
            >
              <h3 className="font-display text-xl font-semibold text-foreground mb-6">
                {contactData.formTitle || "Send Us a Message"}
              </h3>
              <div className="space-y-6">
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
                    rows={5}
                    value={formState.message}
                    onChange={(e) =>
                      setFormState({ ...formState, message: e.target.value })
                    }
                  />
                </div>
                <Button
                  type="submit"
                  variant="ocean"
                  size="xl"
                  className="w-full"
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
                {isSuccess && (
                  <div className="mt-4 p-4 bg-teal-50 border border-teal-200 rounded-xl text-teal-800 text-sm font-medium text-center">
                    ✓ Message sent successfully! We'll get back to you within 24 hours.
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
