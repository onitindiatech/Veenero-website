import React from "react";
import { PublicAboutPurposeDirection } from "@/services/about.service";
import { Eye, Compass, CheckCircle2, Leaf } from "lucide-react";

interface VisionMissionProps {
  data?: PublicAboutPurposeDirection;
}

export const VisionMission: React.FC<VisionMissionProps> = ({ data }) => {
  if (data?.visible === false) return null;

  const eyebrow = data?.eyebrow ?? "PURPOSE & DIRECTION";
  const title = data?.title ?? "Shaping a Water-Secure Future";
  const description =
    data?.description ||
    "Guiding our engineering, partnerships, and operations toward verifiable water accountability across every level of infrastructure.";

  const visionBadge = data?.vision?.badge || "Universal Visibility";
  const visionTitle = data?.vision?.title || "Our Vision";
  const visionDescription =
    data?.vision?.description ||
    "A world where zero water goes unmeasured, unaccounted, or wasted. We envision sustainable, resilient ecosystems powered by universal water visibility and real-time intelligence.";

  const missionBadge = data?.mission?.badge || "Digital Infrastructure";
  const missionTitle = data?.mission?.title || "Our Mission";
  const missionDescription =
    data?.mission?.description ||
    "To deliver India's most reliable and scalable telemetry infrastructure and water data platform, empowering organizations, utilities, and communities to secure their water future.";

  return (
    <section id="purpose-direction" className="py-14 sm:py-16 lg:py-20 bg-[#f8fafb] dark:bg-[#071317] relative border-b border-slate-200/60 dark:border-teal-900/20 overflow-hidden select-none">
      <div className="container mx-auto px-6 md:px-12 max-w-7xl space-y-12">
        
        {/* Centered Header with Leaf Eyebrow & Semantic H2 */}
        <div className="text-center font-sans max-w-2xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-600/10 dark:bg-teal-400/10 border border-teal-600/20 dark:border-teal-400/20 backdrop-blur-xs mb-3">
            <Leaf className="w-3 h-3 text-teal-700 dark:text-teal-300" />
            <span className="text-teal-800 dark:text-teal-300 font-bold uppercase tracking-widest text-[10px] sm:text-[11px] font-mono">
              {eyebrow}
            </span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.6rem] font-bold text-slate-900 dark:text-white mb-3 leading-[1.18] tracking-tight">
            {title}
          </h2>

          <p className="text-sm md:text-base text-slate-600 dark:text-slate-300/90 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Vision & Mission Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* 1. OUR VISION CARD */}
          <div className="group bg-white dark:bg-[#0c1f26] p-8 sm:p-10 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-teal-900/35 hover:border-teal-500/40 shadow-xs hover:shadow-[0_16px_32px_-8px_rgba(19,104,115,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between font-sans relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-full bg-teal-500/10 border border-teal-500/25 flex items-center justify-center text-teal-700 dark:text-teal-300">
                  <Eye className="w-6 h-6 stroke-[1.9]" />
                </div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-teal-600/10 text-teal-800 dark:text-teal-300 border border-teal-600/20">
                  {visionBadge}
                </span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">
                {visionTitle}
              </h3>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300/90 leading-relaxed mb-6">
                {visionDescription}
              </p>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2 text-xs font-semibold text-teal-700 dark:text-teal-300">
              <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Measurable Transparency • Zero Blindspots</span>
            </div>
          </div>

          {/* 2. OUR MISSION CARD */}
          <div className="group bg-white dark:bg-[#0c1f26] p-8 sm:p-10 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-teal-900/35 hover:border-teal-500/40 shadow-xs hover:shadow-[0_16px_32px_-8px_rgba(19,104,115,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between font-sans relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-700 dark:text-cyan-300">
                  <Compass className="w-6 h-6 stroke-[1.9]" />
                </div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-cyan-600/10 text-cyan-800 dark:text-cyan-300 border border-cyan-600/20">
                  {missionBadge}
                </span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">
                {missionTitle}
              </h3>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300/90 leading-relaxed mb-6">
                {missionDescription}
              </p>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2 text-xs font-semibold text-teal-700 dark:text-teal-300">
              <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Full-Stack Telemetry • Verification-First Analytics</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default VisionMission;
