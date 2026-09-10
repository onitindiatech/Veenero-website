import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ContactHero } from "@/components/contact/ContactHero";
import { ContactFormSection } from "@/components/contact/ContactFormSection";
import { ContactFAQ } from "@/components/contact/ContactFAQ";
import { ContactCTA } from "@/components/contact/ContactCTA";
import { contactPageContent } from "@/content/contact";
import { getPublicContactContent, PublicContactData } from "@/services/contact.service";

export const ContactPage: React.FC = () => {
  const [cmsData, setCmsData] = useState<PublicContactData | null>(null);

  useEffect(() => {
    document.title = "Contact Us | Veenero - Water Intelligence Network";
    window.scrollTo(0, 0);

    getPublicContactContent()
      .then((data) => {
        if (data) {
          setCmsData(data);
          if (data.seo?.metaTitle) {
            document.title = data.seo.metaTitle;
          }
          if (data.seo?.metaDescription) {
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) metaDesc.setAttribute("content", data.seo.metaDescription);
          }
        }
      })
      .catch((err) => {
        console.warn("Using fallback contact content:", err);
      });
  }, []);

  const heroData = cmsData?.hero || contactPageContent.hero;
  const contactInfoData = cmsData?.contactInfo || contactPageContent.contactInfo;
  const demoCardData = cmsData?.demoCard || contactPageContent.demoCard;
  const formData = cmsData?.form || contactPageContent.form;
  const faqData = cmsData?.faq || contactPageContent.faq;
  const ctaData = cmsData?.cta;

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans relative overflow-x-hidden">
      {/* Subtle Ambient Water Glows matching Design Language */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none">
        <div className="absolute -top-[15%] -left-[10%] w-[65vw] h-[65vw] max-w-[700px] max-h-[700px] bg-gradient-to-br from-teal-500/[0.04] to-transparent rounded-full blur-3xl" />
        <div className="absolute top-[35%] -right-[15%] w-[55vw] h-[55vw] max-w-[650px] max-h-[650px] bg-gradient-to-bl from-cyan-500/[0.03] via-teal-500/[0.02] to-transparent rounded-full blur-3xl" />
        <div className="absolute top-[68%] -left-[12%] w-[60vw] h-[60vw] max-w-[680px] max-h-[680px] bg-gradient-to-tr from-teal-500/[0.03] to-transparent rounded-full blur-3xl" />
      </div>

      {/* Main Global Navbar */}
      <Navbar />

      {/* Page Content: Hero → Contact Options → Form + Office → Closing CTA */}
      <main className="flex-1 bg-transparent">
        {/* 1. HERO SECTION */}
        <ContactHero data={heroData} />

        {/* 2. CONTACT OPTIONS + MAIN FORM + OFFICE SECTION */}
        <ContactFormSection
          contactInfo={contactInfoData}
          demoCard={demoCardData}
          form={formData}
        />

        {/* 3. FAQ SECTION */}
        {faqData && faqData.visible !== false && faqData.items && faqData.items.length > 0 && (
          <ContactFAQ data={faqData} />
        )}

        {/* 4. FINAL CTA — Ready to Make an Impact? / Let's Work Together */}
        <ContactCTA data={ctaData} />
      </main>

      {/* Main Global Footer */}
      <Footer />
    </div>
  );
};

export default ContactPage;
