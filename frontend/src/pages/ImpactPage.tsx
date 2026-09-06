import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ImpactHero } from "@/components/impact/ImpactHero";
import { ImpactOverview } from "@/components/impact/ImpactOverview";
import { ImpactMetrics } from "@/components/impact/ImpactMetrics";
import { RealWorldImpact } from "@/components/impact/RealWorldImpact";
import { SustainabilitySection } from "@/components/impact/SustainabilitySection";
import { ImpactCTA } from "@/components/impact/ImpactCTA";
import { impactPageContent } from "@/content/impact";
import { getPublicImpactContent, PublicImpactData } from "@/services/impact.service";

export const ImpactPage: React.FC = () => {
  const [cmsData, setCmsData] = useState<PublicImpactData | null>(null);

  useEffect(() => {
    document.title = "Impact | Veenero - Turning Water Intelligence Into Measurable Impact";
    window.scrollTo(0, 0);

    getPublicImpactContent()
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
        console.warn("Using fallback impact content:", err);
      });
  }, []);

  const heroData = cmsData?.hero || impactPageContent.hero;
  const outcomesData =
    cmsData?.outcomes?.pillars && cmsData.outcomes.pillars.length > 0
      ? cmsData.outcomes
      : impactPageContent.outcomes;
  const ecosystemData =
    cmsData?.ecosystem?.domains && cmsData.ecosystem.domains.length > 0
      ? cmsData.ecosystem
      : impactPageContent.ecosystem;
  const sustainabilityData =
    cmsData?.sustainability?.pillars && cmsData.sustainability.pillars.length > 0
      ? cmsData.sustainability
      : impactPageContent.sustainability;
  const ctaData = cmsData?.cta || impactPageContent.cta;

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans relative overflow-x-hidden">
      {/* Subtle Ambient Water Glows matching Design Language */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none">
        <div className="absolute -top-[15%] -left-[10%] w-[65vw] h-[65vw] max-w-[700px] max-h-[700px] bg-gradient-to-br from-teal-500/[0.045] to-transparent rounded-full blur-3xl" />
        <div className="absolute top-[35%] -right-[15%] w-[55vw] h-[55vw] max-w-[650px] max-h-[650px] bg-gradient-to-bl from-cyan-500/[0.035] via-teal-500/[0.02] to-transparent rounded-full blur-3xl" />
        <div className="absolute top-[68%] -left-[12%] w-[60vw] h-[60vw] max-w-[680px] max-h-[680px] bg-gradient-to-tr from-teal-500/[0.03] to-transparent rounded-full blur-3xl" />
      </div>

      {/* Main Global Navbar */}
      <Navbar />

      {/* Page Content with Cohesive Spacing and Rhythm */}
      <main className="flex-1 bg-transparent">
        {/* 1. HERO SECTION */}
        <ImpactHero data={heroData} />

        {/* 2. IMPACT OVERVIEW — What Impact Means */}
        <ImpactOverview />

        {/* 3. IMPACT METRICS — Quantified Performance Across 4 Core Areas */}
        <ImpactMetrics data={outcomesData} />

        {/* 4. REAL-WORLD IMPACT — Infrastructure Deployments & Industry Domains */}
        <RealWorldImpact data={ecosystemData} />

        {/* 5. SUSTAINABILITY & MOTION SECTION — Long-term ESG Resilience & Looping Video */}
        <SustainabilitySection
          data={sustainabilityData}
          quote={ecosystemData.quote || impactPageContent.ecosystem.quote}
        />

        {/* 6. FINAL CTA — Shared solutions-cta-background.png banner */}
        <ImpactCTA data={ctaData} />
      </main>

      {/* Main Global Footer */}
      <Footer />
    </div>
  );
};

export default ImpactPage;
