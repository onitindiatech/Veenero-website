import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AboutHero } from "@/components/about/AboutHero";
import { OurStory } from "@/components/about/OurStory";
import { AboutImpactStats } from "@/components/about/AboutImpactStats";
import { VisionMission } from "@/components/about/VisionMission";
import { OurValues } from "@/components/about/OurValues";
import { Leadership } from "@/components/about/Leadership";
import { AboutCTA } from "@/components/about/AboutCTA";
import { getPublicAboutContent, PublicAboutData } from "@/services/about.service";
import { getAssetBySlot, PublicMediaAsset } from "@/services/media.service";

export const AboutUsPage: React.FC = () => {
  const [aboutData, setAboutData] = useState<PublicAboutData | null>(null);

  // Canonical hero image resolved from the Media Library.
  // This is the source of truth — updated whenever an admin replaces the asset
  // via Admin → Media Library → About → Hero Section → Hero Visual → Replace.
  const [heroMediaAsset, setHeroMediaAsset] = useState<PublicMediaAsset | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadContent = async () => {
      // Run both fetches in parallel for performance
      const [aboutResult, heroAsset] = await Promise.allSettled([
        getPublicAboutContent(),
        getAssetBySlot("about", "Hero Section", "Hero Visual"),
      ]);

      if (!isMounted) return;

      if (aboutResult.status === "fulfilled") {
        setAboutData(aboutResult.value);
        if (aboutResult.value.seo?.metaTitle) {
          document.title = aboutResult.value.seo.metaTitle;
        }
      } else {
        console.warn("[About] Could not load dynamic CMS content from API, using default fallbacks.", aboutResult.reason);
      }

      if (heroAsset.status === "fulfilled" && heroAsset.value) {
        setHeroMediaAsset(heroAsset.value);
      }
      // If heroAsset is null (404) or rejected (network error), AboutHero falls back to its local PNG
    };

    document.title = "About Us | Veenero - Building India's Water Intelligence";
    loadContent();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans relative overflow-hidden">
      {/* Subtle Water-Inspired Atmospheric Lighting (Consistent with Home Identity) */}
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

      {/* Page Content with Cohesive Soft Gradients and White Content Surfaces */}
      <main className="flex-1 bg-transparent relative">
        {/* 1. HERO SECTION */}
        <AboutHero
          data={aboutData?.hero}
          mediaUrl={heroMediaAsset?.secureUrl}
          mediaAlt={heroMediaAsset?.altText}
        />

        {/* 2. WHO WE ARE (Technology. Purpose. Impact.) */}
        <OurStory data={aboutData?.ourStory} />

        {/* 3. CORE VALUES / PILLARS OF VEENERO (Directly follows Who We Are as in reference) */}
        <OurValues data={aboutData?.pillars} />

        {/* 4. IMPACT / STATS SECTION */}
        <AboutImpactStats data={aboutData?.impactStats} />

        {/* 5. PURPOSE & DIRECTION (VISION & MISSION) */}
        <VisionMission data={aboutData?.purposeDirection} />

        {/* 6. LEADERSHIP & TEAM */}
        <Leadership data={aboutData?.leadership} />

        {/* 9. FINAL CTA */}
        <AboutCTA data={aboutData?.cta} />
      </main>

      {/* Main Global Footer */}
      <Footer />
    </div>
  );
};

export default AboutUsPage;
