import React, { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ContactHero } from "@/components/contact/ContactHero";
import { ContactFormSection } from "@/components/contact/ContactFormSection";
import { ContactFAQ } from "@/components/contact/ContactFAQ";
import { ContactCTA } from "@/components/contact/ContactCTA";
import { contactPageContent } from "@/content/contact";

export const ContactPage: React.FC = () => {
  useEffect(() => {
    document.title = "Contact Us | Veenero - Water Intelligence Network";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans relative overflow-hidden">
      {/* Floating droplet background accents matching Careers, About, Solutions, and Impact benchmark */}
      <div className="absolute top-[18%] left-[2%] w-6 h-6 rounded-full bg-teal-500/10 border border-teal-600/20 blur-[0.5px] pointer-events-none animate-float z-0" />
      <div className="absolute top-[38%] right-[3%] w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-600/20 blur-[1px] pointer-events-none animate-float animation-delay-400 z-0" />
      <div className="absolute top-[62%] left-[3%] w-5 h-5 rounded-full bg-teal-400/15 border border-teal-500/30 blur-[0.5px] pointer-events-none animate-float animation-delay-200 z-0" />
      <div className="absolute top-[82%] right-[2%] w-7 h-7 rounded-full bg-cyan-400/10 border border-cyan-500/20 blur-[0.8px] pointer-events-none animate-float animation-delay-600 z-0" />

      {/* Navbar */}
      <Navbar />

      {/* Page Content */}
      <main className="flex-1 bg-[#FCFDFD] dark:bg-background">
        <ContactHero data={contactPageContent.hero} />
        <ContactFormSection
          contactInfo={contactPageContent.contactInfo}
          demoCard={contactPageContent.demoCard}
          form={contactPageContent.form}
        />
        <ContactFAQ data={contactPageContent.faq} />
        <ContactCTA data={contactPageContent.cta} />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ContactPage;
