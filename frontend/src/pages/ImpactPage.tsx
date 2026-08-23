import React, { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ImpactHero } from "@/components/impact/ImpactHero";
import { ImpactOutcomes } from "@/components/impact/ImpactOutcomes";
import { ImpactStoryline } from "@/components/impact/ImpactStoryline";
import { EcosystemImpact } from "@/components/impact/EcosystemImpact";
import { ImpactCTA } from "@/components/impact/ImpactCTA";
import { impactPageContent } from "@/content/impact";

export const ImpactPage: React.FC = () => {
  useEffect(() => {
    document.title = "Impact & Sustainability | Veenero - Water Intelligence Network";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans relative overflow-hidden">
      {/* Floating droplet background accents matching Careers, About, and Solutions benchmark */}
      <div className="absolute top-[18%] left-[2%] w-6 h-6 rounded-full bg-teal-500/10 border border-teal-600/20 blur-[0.5px] pointer-events-none animate-float z-0" />
      <div className="absolute top-[38%] right-[3%] w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-600/20 blur-[1px] pointer-events-none animate-float animation-delay-400 z-0" />
      <div className="absolute top-[62%] left-[3%] w-5 h-5 rounded-full bg-teal-400/15 border border-teal-500/30 blur-[0.5px] pointer-events-none animate-float animation-delay-200 z-0" />
      <div className="absolute top-[82%] right-[2%] w-7 h-7 rounded-full bg-cyan-400/10 border border-cyan-500/20 blur-[0.8px] pointer-events-none animate-float animation-delay-600 z-0" />

      {/* Navbar */}
      <Navbar />

      {/* Page Content */}
      <main className="flex-1 bg-[#FCFDFD] dark:bg-background">
        <ImpactHero data={impactPageContent.hero} />
        <ImpactOutcomes data={impactPageContent.outcomes} />
        <ImpactStoryline data={impactPageContent.storyline} />
        <EcosystemImpact data={impactPageContent.ecosystem} />
        <ImpactCTA data={impactPageContent.cta} />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ImpactPage;
