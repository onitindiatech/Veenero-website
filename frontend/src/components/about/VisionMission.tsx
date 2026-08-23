import React from "react";
import { AboutContent } from "@/content/about";
import { Eye, Compass } from "lucide-react";

interface VisionMissionProps {
  data: AboutContent["visionMission"];
}

export const VisionMission: React.FC<VisionMissionProps> = ({ data }) => {
  return (
    <section className="py-12 md:py-16 bg-transparent relative border-b border-border/10">
      {/* Background Caustic Glow */}
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="container mx-auto px-6 md:px-12 max-w-7xl space-y-10">
        
        {/* Section Header */}
        <div className="text-left font-sans">
          {data.eyebrow && (
            <span className="text-teal-600 dark:text-teal-400 font-bold uppercase tracking-widest text-[10px] md:text-xs block mb-3">
              {data.eyebrow}
            </span>
          )}
          <h2 className="font-display text-3xl md:text-[2.5rem] font-bold text-foreground">
            {data.title}
          </h2>
        </div>

        {/* Dual Vision & Mission Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Vision Card */}
          <div className="group bg-card p-8 md:p-10 rounded-2xl border border-border/40 hover:border-teal-600/30 shadow-sm hover:shadow-soft hover:-translate-y-1 transition-all duration-300 flex flex-col items-start font-sans relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110" />
            
            {/* Circular Icon Wrapper */}
            <div className="p-4 rounded-full bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400 mb-6 group-hover:scale-110 transition-transform duration-300">
              <Eye className="h-6 w-6 stroke-[2]" />
            </div>

            <h3 className="font-display text-2xl font-bold text-foreground mb-4 group-hover:text-teal-700 transition-colors">
              {data.vision.title}
            </h3>

            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              {data.vision.description}
            </p>
          </div>

          {/* Mission Card */}
          <div className="group bg-card p-8 md:p-10 rounded-2xl border border-border/40 hover:border-cyan-600/30 shadow-sm hover:shadow-soft hover:-translate-y-1 transition-all duration-300 flex flex-col items-start font-sans relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110" />
            
            {/* Circular Icon Wrapper */}
            <div className="p-4 rounded-full bg-cyan-50 dark:bg-cyan-950/20 text-cyan-600 dark:text-cyan-400 mb-6 group-hover:scale-110 transition-transform duration-300">
              <Compass className="h-6 w-6 stroke-[2]" />
            </div>

            <h3 className="font-display text-2xl font-bold text-foreground mb-4 group-hover:text-cyan-700 transition-colors">
              {data.mission.title}
            </h3>

            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              {data.mission.description}
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};

export default VisionMission;
