import React, { useState } from "react";
import { ImpactContent } from "@/content/impact";
import { ShieldCheck, Zap, Globe, Leaf } from "lucide-react";
import storyVideo from "@/assets/about/about-story-water-infrastructure.mp4";
import videoPoster from "@/assets/about/about-vision-water-infrastructure.webp";

interface SustainabilitySectionProps {
  data: ImpactContent["sustainability"];
  quote?: ImpactContent["ecosystem"]["quote"];
}

const pillarIcons = [ShieldCheck, Zap, Globe];

export const SustainabilitySection: React.FC<SustainabilitySectionProps> = ({ data }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section
      id="sustainability-section"
      className="py-16 sm:py-20 lg:py-24 bg-[#f8fcfe] dark:bg-[#030f14] relative border-b border-slate-200/70 dark:border-teal-900/25 select-none overflow-hidden font-sans"
    >
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-teal-500/[0.04] rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="container mx-auto px-6 md:px-12 max-w-7xl space-y-12 sm:space-y-14 relative z-10">
        
        {/* Section Header */}
        <div className="text-left font-sans max-w-3xl">
          {/* Eyebrow Capsule */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-600/10 dark:bg-teal-400/10 border border-teal-600/20 dark:border-teal-400/20 backdrop-blur-xs mb-3.5">
            <Leaf className="w-3 h-3 text-teal-700 dark:text-teal-300" />
            <span className="text-teal-800 dark:text-teal-300 font-bold uppercase tracking-widest text-[10px] sm:text-[11px] font-mono">
              {data.eyebrow || "LONG-TERM SUSTAINABILITY"}
            </span>
          </div>

          {/* H2 Title */}
          <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.65rem] font-bold text-slate-900 dark:text-white leading-[1.18] mb-4 tracking-tight">
            Connecting Water Intelligence to{" "}
            <span className="text-[#136873] dark:text-teal-400">
              Long-Term Sustainability
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300/90 leading-relaxed max-w-2xl">
            {data.description ||
              "Water security is the foundation of economic resilience. Veenero bridges the gap between physical water management and ESG governance."}
          </p>
        </div>

        {/* 2-Column Split: 3 Sustainability Cards LEFT (6 cols) + Looping Video RIGHT (6 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left: 3 Sustainability Value Pillars */}
          <div className="lg:col-span-6 space-y-4">
            {(data?.pillars || []).map((pillar, idx) => {
              const Icon = pillarIcons[idx] || ShieldCheck;
              return (
                <div
                  key={idx}
                  className="group bg-white dark:bg-[#071920] p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-teal-900/30 hover:border-teal-500/50 shadow-xs hover:shadow-card hover:-translate-y-0.5 transition-all duration-300 font-sans flex items-start gap-4 text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-teal-600/10 dark:bg-teal-400/15 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0 border border-teal-600/20 group-hover:scale-105 transition-transform mt-0.5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-teal-700 dark:text-teal-400 font-mono">
                        0{idx + 1}
                      </span>
                      <h3 className="font-display text-base font-bold text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
                        {pillar.title}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300/85 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Motion & Looping Infrastructure Video Player */}
          <div className="lg:col-span-6">
            <div className="group relative rounded-3xl overflow-hidden aspect-[16/11] shadow-xl border border-slate-200/80 dark:border-teal-900/30 bg-slate-950">
              {/* HTML5 Autoplaying Looping Video */}
              <video
                ref={videoRef}
                src={storyVideo}
                poster={videoPoster}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

              {/* Bottom Video Caption */}
              <div className="absolute bottom-5 left-5 right-5 text-left flex items-center justify-between pointer-events-none z-10">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-teal-300 block mb-0.5">
                    FIELD TELEMETRY IN ACTION
                  </span>
                  <p className="text-sm sm:text-base font-bold text-white font-display">
                    Real-World Water Infrastructure
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/70 border border-teal-400/30 text-teal-300 text-[10px] font-mono font-bold backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>ACTIVE FEED</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default SustainabilitySection;
