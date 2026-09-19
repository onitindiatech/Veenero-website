import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { getSolutionBySlug } from "@/content/solutionDetailsData";
import { getPublicSolutionDetail } from "@/services/solutions.service";

import { SolutionHero } from "@/components/solution-detail/SolutionHero";
import { SolutionProblemSection } from "@/components/solution-detail/SolutionProblemSection";
import { SolutionOverview } from "@/components/solution-detail/SolutionOverview";
import { SolutionHowItWorks } from "@/components/solution-detail/SolutionHowItWorks";
import { SolutionAnalyticsVisual } from "@/components/solution-detail/SolutionAnalyticsVisual";
import { SolutionInquiryForm } from "@/components/solution-detail/SolutionInquiryForm";
import { SolutionFinalCTA } from "@/components/solution-detail/SolutionFinalCTA";

export const SolutionDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [solutionData, setSolutionData] = useState(() => getSolutionBySlug(slug));

  useScrollReveal([slug, solutionData.title]);

  useEffect(() => {
    // Reset to local rich fallback on slug change
    const fallback = getSolutionBySlug(slug);
    setSolutionData(fallback);

    let isMounted = true;
    if (slug) {
      getPublicSolutionDetail(slug).then((remoteData) => {
        if (isMounted && remoteData) {
          setSolutionData((prev: any) => {
            // Helper: merge an array from remote only if remote has items
            const mergeArr = (remoteArr: any, prevArr: any) =>
              Array.isArray(remoteArr) && remoteArr.length > 0 ? remoteArr : prevArr;

            // Build hero highlights: prefer remote heroHighlights
            const heroHighlights =
              Array.isArray(remoteData.heroHighlights) && remoteData.heroHighlights.length > 0
                ? remoteData.heroHighlights
                : prev?.heroHighlights;

            // Build tagline from remote (flat MongoDB fields)
            const tagline = remoteData.tagline
              ? remoteData.tagline
              : prev?.tagline;

            // Build problemSection — remote takes priority
            const problemSection = remoteData.problemSection
              ? {
                  eyebrow: remoteData.problemSection.eyebrow || prev?.problemSection?.eyebrow,
                  title: remoteData.problemSection.title || prev?.problemSection?.title,
                  highlightTitle:
                    remoteData.problemSection.highlightTitle ?? prev?.problemSection?.highlightTitle,
                  description: remoteData.problemSection.description || prev?.problemSection?.description,
                  impactSummary:
                    remoteData.problemSection.impactSummary || prev?.problemSection?.impactSummary,
                  items: mergeArr(remoteData.problemSection.items, prev?.problemSection?.items),
                }
              : prev?.problemSection;

            // Build overview — remote takes priority, preserve dualEngine from remote if present
            const overview = remoteData.overview
              ? {
                  ...prev?.overview,
                  ...remoteData.overview,
                  blocks: mergeArr(remoteData.overview.blocks, prev?.overview?.blocks),
                  dualEngine: remoteData.overview.dualEngine || prev?.overview?.dualEngine,
                }
              : prev?.overview;

            // Build howItWorks — remote takes priority
            const howItWorks = remoteData.howItWorks
              ? {
                  ...prev?.howItWorks,
                  ...remoteData.howItWorks,
                  steps: mergeArr(remoteData.howItWorks.steps, prev?.howItWorks?.steps),
                }
              : prev?.howItWorks;

            // Build analyticsVisual — remote takes priority
            const analyticsVisual = remoteData.analyticsVisual
              ? {
                  ...prev?.analyticsVisual,
                  ...remoteData.analyticsVisual,
                  stats: mergeArr(remoteData.analyticsVisual.stats, prev?.analyticsVisual?.stats),
                }
              : prev?.analyticsVisual;

            // Build finalCta — remote takes priority
            const finalCta = remoteData.finalCta
              ? { ...prev?.finalCta, ...remoteData.finalCta }
              : prev?.finalCta;

            // Build inquiryForm — remote takes priority
            const inquiryForm = remoteData.inquiryForm
              ? { ...prev?.inquiryForm, ...remoteData.inquiryForm }
              : prev?.inquiryForm;

            return {
              ...prev,
              // Core identity
              title: remoteData.title || prev?.title,
              badge: remoteData.badge || prev?.badge,
              slug: remoteData.slug || prev?.slug,
              // Hero flat fields from MongoDB
              tagline,
              heroDescription: remoteData.heroDescription || prev?.heroDescription,
              heroPills:
                Array.isArray(remoteData.heroPills) && remoteData.heroPills.length > 0
                  ? remoteData.heroPills
                  : prev?.heroPills,
              heroImage: remoteData.heroImage || prev?.heroImage,
              heroImageAlt: remoteData.heroImageAlt || prev?.heroImageAlt,
              heroHighlights,
              primaryCtaText: remoteData.primaryCtaText || prev?.primaryCtaText,
              primaryCtaLink: remoteData.primaryCtaLink || prev?.primaryCtaLink,
              secondaryCtaText: remoteData.secondaryCtaText || prev?.secondaryCtaText,
              secondaryCtaLink: remoteData.secondaryCtaLink || prev?.secondaryCtaLink,
              contactEmail: remoteData.contactEmail || prev?.contactEmail,
              heroMetrics:
                Array.isArray(remoteData.heroMetrics) && remoteData.heroMetrics.length > 0
                  ? remoteData.heroMetrics
                  : prev?.heroMetrics,
              // Sections
              problemSection,
              overview,
              howItWorks,
              analyticsVisual,
              inquiryForm,
              finalCta,
              seo: remoteData.seo || prev?.seo,
            };
          });
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [slug]);

  useEffect(() => {
    if ((solutionData as any).seo?.metaTitle) {
      document.title = (solutionData as any).seo.metaTitle;
    } else {
      document.title = `${solutionData.title} | Veenero - Water Management & Conservation`;
    }

    if ((solutionData as any).seo?.metaDescription) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement("meta");
        metaDesc.setAttribute("name", "description");
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute("content", (solutionData as any).seo.metaDescription);
    }

    window.scrollTo(0, 0);
  }, [slug, solutionData.title, (solutionData as any).seo]);

  const handleScrollToInquiry = () => {
    const el = document.getElementById("inquiry-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScrollToHowItWorks = () => {
    const el = document.getElementById("how-it-works");
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
        {/* 1. HERO SECTION — High-contrast authority hero with trust badges & CTAs */}
        <SolutionHero
          data={solutionData}
          onDemoClick={handleScrollToInquiry}
          onExpertClick={handleScrollToInquiry}
        />

        {/* 2. THE PROBLEM WE SOLVE — 4 Concrete Water Infrastructure Failure Modes */}
        <SolutionProblemSection
          data={solutionData.problemSection}
          onResolveClick={handleScrollToHowItWorks}
        />

        {/* 3. OVERVIEW & DUAL-ENGINE SYSTEM — Hardware Device vs Cloud Software */}
        <SolutionOverview
          data={solutionData}
          onExploreClick={handleScrollToHowItWorks}
        />

        {/* 4. HOW IT WORKS — 6-Stage Closed-Loop Conservation Lifecycle */}
        {solutionData.howItWorks && (
          <SolutionHowItWorks data={solutionData.howItWorks} />
        )}

        {/* 5. LIVE TELEMETRY STREAM & COMMAND VISUAL — Real-Time Facility Stream */}
        {solutionData.analyticsVisual && (
          <SolutionAnalyticsVisual data={solutionData.analyticsVisual} />
        )}

        {/* 7. REQUEST A DEMO / INQUIRY FORM — High-Conversion Form connected to Backend API */}
        <SolutionInquiryForm
          solutionName={solutionData.title}
          data={solutionData.inquiryForm}
        />

        {/* 8. FINAL CONVERSION CTA — High-Impact Closing Action */}
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
