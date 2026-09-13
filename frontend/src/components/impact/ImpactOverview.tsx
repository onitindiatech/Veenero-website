import React from "react";
import { Leaf } from "lucide-react";
import overviewImage from "@/assets/about/about-industrial-water-system.webp";

export const ImpactOverview: React.FC = () => {
  return (
    <section
      id="impact-overview"
      className="relative z-20 select-none py-16 sm:py-20 lg:py-24 bg-gradient-wave dark:bg-[#071317] border-b border-slate-200/60 dark:border-teal-900/20"
    >
      <div className="container mx-auto px-6 md:px-12 max-w-7xl">
        
        {/* Editorial Layout: Text LEFT + High-Tech Visual RIGHT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Left Column: Eyebrow, H2, Supporting Paragraphs */}
          <div className="lg:col-span-6 text-left font-sans space-y-5">
            {/* Standard Eyebrow Capsule */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-600/10 dark:bg-teal-400/10 border border-teal-600/20 dark:border-teal-400/20 backdrop-blur-xs mb-1">
              <Leaf className="w-3 h-3 text-teal-700 dark:text-teal-300" />
              <span className="text-teal-800 dark:text-teal-300 font-bold uppercase tracking-widest text-[10px] sm:text-[11px] font-mono">
                WHAT IMPACT MEANS
              </span>
            </div>

            {/* H2 Title — Playfair Display matching Solutions/About */}
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.65rem] font-bold text-slate-900 dark:text-white leading-[1.18] tracking-tight">
              From Water Blindspots to{" "}
              <span className="text-[#136873] dark:text-teal-400">
                Measurable Value &amp; ESG Resilience
              </span>
            </h2>

            {/* Paragraphs */}
            <div className="space-y-4 text-sm sm:text-base text-slate-600 dark:text-slate-300/90 leading-relaxed">
              <p>
                At Veenero, impact is not an abstract corporate slogan—it is a mathematically verified reality measured litre by litre, asset by asset. For decades, water management relied on guesswork, manual logbooks, and post-billing surprises.
              </p>
              <p>
                By unifying high-precision edge IoT sensors with automated hydrodynamic modeling and certified data provenance, we empower municipal utilities, heavy industries, and commercial campuses to transform unmetered losses into quantifiable cost savings and verified sustainability achievements.
              </p>
            </div>
          </div>

          {/* Right Column: Visual Telemetry Card with High-Res Facility Imagery */}
          <div className="lg:col-span-6">
            <div className="group relative rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 dark:border-teal-900/30 bg-slate-950">
              
              {/* Media Image */}
              <div className="relative aspect-[16/11] w-full overflow-hidden">
                <img
                  src={overviewImage}
                  alt="Veenero industrial water intelligence and precision flow validation"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#021316]/85 via-[#021316]/20 to-transparent pointer-events-none" />
                
                {/* Live Node Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/80 border border-teal-400/30 backdrop-blur-md shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] font-bold text-white font-sans">
                      Live Telemetry Validation
                    </span>
                  </div>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-5 left-5 right-5 z-10 text-left">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-teal-300 font-mono block mb-1">
                    FACILITY AUDIT READY
                  </span>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-white leading-snug">
                    Real-time Water Network Telemetry
                  </h3>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default ImpactOverview;
