import React, { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SolutionsHero } from "@/components/solutions/SolutionsHero";
import { PlatformArchitecture } from "@/components/solutions/PlatformArchitecture";
import { SolutionsGrid } from "@/components/solutions/SolutionsGrid";
import { IndustrySolutions } from "@/components/solutions/IndustrySolutions";
import { SolutionsCTA } from "@/components/solutions/SolutionsCTA";
import { solutionsPageContent } from "@/content/solutions";

export const SolutionsPage: React.FC = () => {
  useEffect(() => {
    document.title = "Solutions | Veenero - Water Intelligence Infrastructure";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans relative overflow-hidden">
      {/* Floating droplet background accents matching Careers and About page benchmark */}
      <div className="absolute top-[18%] left-[2%] w-6 h-6 rounded-full bg-teal-500/10 border border-teal-600/20 blur-[0.5px] pointer-events-none animate-float z-0" />
      <div className="absolute top-[38%] right-[3%] w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-600/20 blur-[1px] pointer-events-none animate-float animation-delay-400 z-0" />
      <div className="absolute top-[62%] left-[3%] w-5 h-5 rounded-full bg-teal-400/15 border border-teal-500/30 blur-[0.5px] pointer-events-none animate-float animation-delay-200 z-0" />
      <div className="absolute top-[82%] right-[2%] w-7 h-7 rounded-full bg-cyan-400/10 border border-cyan-500/20 blur-[0.8px] pointer-events-none animate-float animation-delay-600 z-0" />

      {/* Navbar */}
      <Navbar />

      {/* Page Content */}
      <main className="flex-1 bg-[#FCFDFD] dark:bg-background">
        <SolutionsHero data={solutionsPageContent.hero} />
        <PlatformArchitecture data={solutionsPageContent.architecture} />
        <SolutionsGrid data={solutionsPageContent.solutionsGrid} />
        <IndustrySolutions data={solutionsPageContent.industries} />
        <SolutionsCTA data={solutionsPageContent.cta} />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default SolutionsPage;
