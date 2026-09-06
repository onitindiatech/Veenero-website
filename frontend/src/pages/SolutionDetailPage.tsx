import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { getSolutionBySlug } from "@/content/solutionDetailsData";

import { SolutionHero } from "@/components/solution-detail/SolutionHero";
import { SolutionOverview } from "@/components/solution-detail/SolutionOverview";
import { SolutionCapabilities } from "@/components/solution-detail/SolutionCapabilities";
import { SolutionHowItWorks } from "@/components/solution-detail/SolutionHowItWorks";
import { SolutionTechnologySection } from "@/components/solution-detail/SolutionTechnologySection";
import { SolutionFeatures } from "@/components/solution-detail/SolutionFeatures";
import { SolutionUseCases } from "@/components/solution-detail/SolutionUseCases";
import { SolutionBenefits } from "@/components/solution-detail/SolutionBenefits";
import { SolutionAnalyticsVisual } from "@/components/solution-detail/SolutionAnalyticsVisual";
import { SolutionInquiryForm } from "@/components/solution-detail/SolutionInquiryForm";
import { SolutionFinalCTA } from "@/components/solution-detail/SolutionFinalCTA";

export const SolutionDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const solutionData = getSolutionBySlug(slug);

  useScrollReveal([slug]);

  useEffect(() => {
    document.title = `${solutionData.title} | Veenero - Water Intelligence Infrastructure`;
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
        {/* 1. HERO SECTION — Unique Detail Page Hero with dark aquatic visual, floating glass telemetry, and count-up metrics */}
        <SolutionHero
          data={solutionData}
          onDemoClick={handleScrollToInquiry}
          onExpertClick={handleScrollToInquiry}
        />

        {/* 2. OVERVIEW — H2, supporting paragraph, 4 capability blocks, and enterprise dashboard card */}
        <SolutionOverview data={solutionData} />

        {/* 3. HOW IT WORKS — Interactive 5-stage process workflow (horizontal desktop, vertical mobile) */}
        <SolutionHowItWorks data={solutionData.howItWorks} />

        {/* 4. KEY CAPABILITIES — Visually rich 4–6 capability cards with icons and staggered scroll reveal */}
        <SolutionCapabilities data={solutionData.capabilities} />

        {/* 5. VISUAL / TECHNOLOGY SECTION — High-throughput architecture and live telemetry stream visualizer */}
        <SolutionTechnologySection data={solutionData.techSection} />

        {/* 6. FEATURES / FUNCTIONALITY — Precision engineering features and system integration */}
        <SolutionFeatures data={solutionData.features} />

        {/* 7. USE CASES — Real-world deployment scenarios across utilities, industry, and campuses */}
        <SolutionUseCases data={solutionData.useCases} />

        {/* 8. BENEFITS / IMPACT — 4–6 concise impact blocks with one-shot animated count-up numbers */}
        <SolutionBenefits data={solutionData.benefits} />

        {/* 9. DATA / ANALYTICS VISUALIZATION — Interactive facility telemetry chart, zone selector, and status streams */}
        <SolutionAnalyticsVisual data={solutionData.analyticsVisual} />

        {/* 10. DIRECT INQUIRY / CONTACT CTA — "Have Questions? Let's Talk." with 4-field inquiry form */}
        <SolutionInquiryForm solutionName={solutionData.title} />

        {/* 11. FINAL CTA — "Make Water Data Work Smarter." with water ripple animations and dual CTAs */}
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
