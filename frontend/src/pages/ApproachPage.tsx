import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ApproachHero } from "@/components/approach/ApproachHero";
import { StrategicJourneyRoadmap } from "@/components/approach/StrategicJourneyRoadmap";
import { ApproachCapabilities } from "@/components/approach/ApproachCapabilities";
import { ApproachFlow } from "@/components/approach/ApproachFlow";
import { ApproachInsights } from "@/components/approach/ApproachInsights";
import { ApproachGovernance } from "@/components/approach/ApproachGovernance";
import { ApproachCTA } from "@/components/approach/ApproachCTA";
import { getPublicApproachContent, PublicApproachData } from "@/services/approach.service";

export const ApproachPage: React.FC = () => {
  const [cmsData, setCmsData] = useState<PublicApproachData | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    getPublicApproachContent()
      .then((data) => {
        setCmsData(data);
        if (data.seo?.metaTitle) {
          document.title = data.seo.metaTitle;
        }
        if (data.seo?.metaDescription) {
          const metaDesc = document.querySelector('meta[name="description"]');
          if (metaDesc) metaDesc.setAttribute("content", data.seo.metaDescription);
        }
      })
      .catch((err) => {
        console.warn("Using fallback Approach page content:", err);
      });
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans relative overflow-hidden">
      {/* Subtle Water-Inspired Atmospheric Lighting (Consistent with Home & About Identity) */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none">
        {/* Soft top-left ambient teal glow */}
        <div className="absolute -top-[15%] -left-[10%] w-[65vw] h-[65vw] max-w-[700px] max-h-[700px] bg-gradient-to-br from-teal-500/[0.045] to-transparent rounded-full blur-3xl" />
        {/* Mid-right ambient cyan flow glow */}
        <div className="absolute top-[35%] -right-[15%] w-[55vw] h-[55vw] max-w-[650px] max-h-[650px] bg-gradient-to-bl from-cyan-500/[0.035] via-teal-500/[0.02] to-transparent rounded-full blur-3xl" />
        {/* Lower-left ambient reservoir glow */}
        <div className="absolute top-[68%] -left-[12%] w-[60vw] h-[60vw] max-w-[680px] max-h-[680px] bg-gradient-to-tr from-teal-500/[0.03] to-transparent rounded-full blur-3xl" />
      </div>

      {/* Main Global Navbar */}
      <Navbar />

      {/* Page Content with Cohesive Soft Gradients and Content Surfaces */}
      <main className="flex-1 bg-transparent relative">
        {/* 1. HERO SECTION */}
        <ApproachHero data={cmsData?.hero} />

        {/* 2. OUR PHILOSOPHY (VISIBILITY, INTELLIGENCE, ACCOUNTABILITY, IMPACT) */}
        <StrategicJourneyRoadmap data={cmsData?.philosophy} />

        {/* 3. ENABLED BY TECHNOLOGY */}
        <ApproachCapabilities data={cmsData?.technology} />

        {/* 5. REAL-WORLD EXECUTION */}
        <ApproachFlow data={cmsData?.execution} />

        {/* 6. IMPACT OUTCOMES */}
        <ApproachInsights impactData={cmsData?.impact} />

        {/* 7. ENTERPRISE GOVERNANCE & TRUST (REPLACEMENT SECTION) */}
        <ApproachGovernance data={cmsData?.governance} />

        {/* 8. FINAL CTA */}
        <ApproachCTA data={cmsData?.cta} />
      </main>

      {/* Main Global Footer */}
      <Footer />
    </div>
  );
};

export default ApproachPage;
