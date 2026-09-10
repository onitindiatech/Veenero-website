import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { getSolutionBySlug } from "@/content/solutionDetailsData";
import { getPublicSolutionDetail } from "@/services/solutions.service";

import { SolutionHero } from "@/components/solution-detail/SolutionHero";
import { SolutionOverview } from "@/components/solution-detail/SolutionOverview";
import { SolutionCapabilities } from "@/components/solution-detail/SolutionCapabilities";
import { SolutionUseCases } from "@/components/solution-detail/SolutionUseCases";
import { SolutionInquiryForm } from "@/components/solution-detail/SolutionInquiryForm";
import { SolutionFinalCTA } from "@/components/solution-detail/SolutionFinalCTA";

export const SolutionDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [solutionData, setSolutionData] = useState(() => getSolutionBySlug(slug));

  useScrollReveal([slug, solutionData.title]);

  useEffect(() => {
    // Reset to local fallback on slug change
    const fallback = getSolutionBySlug(slug);
    setSolutionData(fallback);

    let isMounted = true;
    if (slug) {
      getPublicSolutionDetail(slug).then((remoteData) => {
        if (isMounted && remoteData) {
          setSolutionData((prev: any) => ({
            ...prev,
            ...remoteData,
            tagline: remoteData.tagline || prev.tagline,
            overview: remoteData.overview ? { ...prev.overview, ...remoteData.overview } : prev.overview,
            capabilities: remoteData.capabilities || prev.capabilities,
            useCases: remoteData.useCases || prev.useCases,
            finalCta: remoteData.finalCta ? { ...prev.finalCta, ...remoteData.finalCta } : prev.finalCta,
          }));
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [slug]);

  useEffect(() => {
    document.title = `${solutionData.title} | Veenero - Water Management & Conservation`;
    window.scrollTo(0, 0);
  }, [slug, solutionData.title]);

  const handleScrollToInquiry = () => {
    const el = document.getElementById("inquiry-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans relative overflow-x-hidden">
      {/* Main Global Navbar */}
      <Navbar />

      {/* Main Page Flow */}
      <main className="flex-1">
        {/* 1. HERO SECTION — Clean, spacious minimal hero with clear CTAs & direct email */}
        <SolutionHero
          data={solutionData}
          onDemoClick={handleScrollToInquiry}
          onExpertClick={handleScrollToInquiry}
        />

        {/* 2. OVERVIEW — Concise narrative without pillars or duplicate cards */}
        <SolutionOverview data={solutionData} />

        {/* 3. KEY CAPABILITIES — 4 clean, premium capability cards */}
        <SolutionCapabilities data={solutionData.capabilities} />

        {/* 4. USE CASES — 4 real-world deployment scenarios */}
        <SolutionUseCases data={solutionData.useCases} />

        {/* 5. REQUEST A DEMO / INQUIRY FORM — Conversion form connected to backend API */}
        <SolutionInquiryForm solutionName={solutionData.title} />

        {/* 6. FINAL CTA — Streamlined closing action with trust indicators */}
        <SolutionFinalCTA
          data={solutionData.finalCta}
          onDemoClick={handleScrollToInquiry}
          onExpertClick={handleScrollToInquiry}
        />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default SolutionDetailPage;
