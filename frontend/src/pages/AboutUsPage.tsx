import React, { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AboutHero } from "@/components/about/AboutHero";
import { OurStory } from "@/components/about/OurStory";
import { VisionMission } from "@/components/about/VisionMission";
import { OurValues } from "@/components/about/OurValues";
import { WhyVeenero } from "@/components/about/WhyVeenero";
import { Leadership } from "@/components/about/Leadership";
import { AboutCTA } from "@/components/about/AboutCTA";
import { aboutContent } from "@/content/about";

export const AboutUsPage: React.FC = () => {
  useEffect(() => {
    document.title = "About Us | Veenero - Water Intelligence Network";
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans relative overflow-hidden">
      {/* Floating droplet background accents matching Careers page benchmark */}
      <div className="absolute top-[20%] left-[2%] w-6 h-6 rounded-full bg-teal-500/10 border border-teal-600/20 blur-[0.5px] pointer-events-none animate-float z-0" />
      <div className="absolute top-[40%] right-[3%] w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-600/20 blur-[1px] pointer-events-none animate-float animation-delay-400 z-0" />
      <div className="absolute top-[65%] left-[3%] w-5 h-5 rounded-full bg-teal-400/15 border border-teal-500/30 blur-[0.5px] pointer-events-none animate-float animation-delay-200 z-0" />
      <div className="absolute top-[85%] right-[2%] w-7 h-7 rounded-full bg-cyan-400/10 border border-cyan-500/20 blur-[0.8px] pointer-events-none animate-float animation-delay-600 z-0" />

      {/* Navbar */}
      <Navbar />

      {/* Page Content */}
      <main className="flex-1 bg-[#FCFDFD] dark:bg-background">
        <AboutHero data={aboutContent.hero} />
        <OurStory data={aboutContent.ourStory} />
        <VisionMission data={aboutContent.visionMission} />
        <OurValues data={aboutContent.values} />
        <WhyVeenero data={aboutContent.whyVeenero} />
        <Leadership data={aboutContent.leadership} />
        <AboutCTA data={aboutContent.cta} />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AboutUsPage;
