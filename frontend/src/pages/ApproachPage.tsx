import React, { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ApproachHero } from "@/components/approach/ApproachHero";
import { ApproachProcessTimeline } from "@/components/approach/ApproachProcessTimeline";
import { ApproachCapabilities } from "@/components/approach/ApproachCapabilities";
import { ApproachFlow } from "@/components/approach/ApproachFlow";
import { ApproachInsights } from "@/components/approach/ApproachInsights";
import { ApproachCTA } from "@/components/approach/ApproachCTA";

export const ApproachPage: React.FC = () => {
  useEffect(() => {
    document.title = "Our Approach | Veenero - Water Intelligence";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans relative overflow-hidden">
      {/* Floating droplet background accents matching Careers, Contact, etc. */}
      <div className="absolute top-[25%] left-[2%] w-6 h-6 rounded-full bg-teal-500/10 border border-teal-600/20 blur-[0.5px] pointer-events-none animate-float z-0" />
      <div className="absolute top-[45%] right-[3%] w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-600/20 blur-[1px] pointer-events-none animate-float animation-delay-400 z-0" />
      <div className="absolute top-[70%] left-[4%] w-5 h-5 rounded-full bg-teal-400/15 border border-teal-500/30 blur-[0.5px] pointer-events-none animate-float animation-delay-200 z-0" />

      <Navbar />
      
      <main className="flex-1 bg-[#FCFDFD] dark:bg-background z-10 relative">
        <ApproachHero />
        <ApproachProcessTimeline />
        <ApproachCapabilities />
        <ApproachFlow />
        <ApproachInsights />
        <ApproachCTA />
      </main>

      <Footer />
    </div>
  );
};

export default ApproachPage;
