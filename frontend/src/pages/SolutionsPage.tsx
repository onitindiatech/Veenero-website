import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SolutionsHero } from "@/components/solutions/SolutionsHero";
import { SolutionsCategories } from "@/components/solutions/SolutionsCategories";
import { SolutionsImpact } from "@/components/solutions/SolutionsImpact";
import { SolutionsCTA } from "@/components/solutions/SolutionsCTA";
import { solutionsPageContent } from "@/content/solutions";
import { getPublicSolutionsContent, PublicSolutionsData } from "@/services/solutions.service";

export const SolutionsPage: React.FC = () => {
  const [cmsData, setCmsData] = useState<PublicSolutionsData | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    getPublicSolutionsContent()
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
        console.warn("Using fallback solutions content:", err);
      });
  }, []);

  // Safe fallbacks to static content for zero delay/flicker
  const heroData = cmsData?.hero || solutionsPageContent.hero;
  const introData = cmsData?.intro || solutionsPageContent.architecture;
  const categoriesList = cmsData?.categories || [];
  const solutionsList = cmsData?.solutions || [];
  const gridHeader = cmsData?.gridHeader;
  const featuredData = cmsData?.featuredSolution;
  const ctaData = cmsData?.cta || solutionsPageContent.cta;

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans relative overflow-x-hidden">

      {/* Navbar */}
      <Navbar />

      {/* Page Content — clean section flow matching visual hierarchy */}
      <main className="flex-1">

        {/* 1. HERO — Compact 50-55vh Sustainable Solutions with light blue water background */}
        <SolutionsHero data={heroData} />

        {/* 2. SOLUTIONS CATEGORIES — 5-column grid with subtle 01-05 badges */}
        <SolutionsCategories
          data={solutionsPageContent.solutionsGrid}
          categories={categoriesList}
          solutions={solutionsList}
          gridHeader={gridHeader}
        />

        {/* 3. REAL-WORLD IMPACT — Organic water wave transition, 4 sectors, and animated counters */}
        <SolutionsImpact />

        {/* 4. FINAL CTA — Water circularity & Earth splash banner */}
        <SolutionsCTA data={ctaData} />

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default SolutionsPage;
