import React from "react";
import {
  CheckCircle2,
  Cpu,
  Server,
} from "lucide-react";
import { SolutionDetailData } from "@/content/solutionDetailsData";

interface SolutionOverviewProps {
  data: SolutionDetailData;
  onExploreClick?: () => void;
}

export const SolutionOverview: React.FC<SolutionOverviewProps> = ({
  data,
  onExploreClick,
}) => {
  const dualEngine = (data.overview as any).dualEngine || {
    hardware: {
      tag: "FIELD HARDWARE",
      title: "Aqua Saver 3D-Module & Actuator",
      description:
        "Ruggedized, IP68 waterproof physical device engineered for Indian water conditions. Deployed directly on overhead tanks, pumps, and pipe networks without plumbing overhauls.",
      features: [
        "Non-invasive clamp-on ultrasonic & in-line multi-path flow chambers",
        "Automated solid-state motorized valve controller and pump relay cut-off",
        "Continuous vibration and acoustic micro-seepage pickup array",
        "Internal 5-year battery backup with surge-protected utility power",
      ],
    },
    software: {
      tag: "CLOUD & EDGE PLATFORM",
      title: "Veenero Water Management Software",
      description:
        "Central intelligence platform ingesting millisecond telemetry to model normal consumption, detect hydraulic anomalies, and coordinate maintenance.",
      features: [
        "Sub-second hydraulic anomaly detection & instant SMS/WhatsApp alerts",
        "Automated time-of-day pumping rules and multi-tank balancing",
        "Zone-wise consumption budgeting, leak localization, and isolation triggers",
        "Audit-ready ESG water balance reports & municipal compliance logs",
      ],
    },
  };

  return (
    <section
      id="overview-section"
      className="py-16 sm:py-20 lg:py-24 bg-[#f8fbfb] dark:bg-[#031518] border-b border-[#e2eded] dark:border-teal-900/30 select-none relative overflow-hidden font-sans"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-teal-500/[0.04] rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16 text-left">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
            <span className="text-teal-700 dark:text-teal-400 font-bold uppercase tracking-widest text-xs font-mono">
              {data.overview.eyebrow || "DUAL-ENGINE ARCHITECTURE"}
            </span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white leading-[1.25] tracking-tight">
            <span>{data.overview.title} </span>
            {data.overview.highlightTitle && (
              <span className="text-teal-600 dark:text-teal-400">
                {data.overview.highlightTitle}
              </span>
            )}
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mt-3 max-w-2xl">
            {data.overview.description}
          </p>
        </div>

        {/* ── DUAL-ENGINE ARCHITECTURE CARDS: Hardware vs Software ───────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card 1: Physical Hardware Device */}
          <div className="p-7 sm:p-9 rounded-2xl bg-white dark:bg-[#071f24] border border-[#dce8e6] dark:border-teal-800/40 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/[0.04] rounded-bl-full pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/50">
                  {dualEngine.hardware.tag}
                </span>
                <div className="w-9 h-9 rounded-lg bg-teal-600/10 dark:bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                  <Cpu className="w-5 h-5" />
                </div>
              </div>

              <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3 leading-snug">
                {dualEngine.hardware.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                {dualEngine.hardware.description}
              </p>

              <div className="space-y-3 pt-2">
                {dualEngine.hardware.features.map((feat: string, i: number) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                    <span className="leading-snug">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 dark:border-teal-900/40 flex items-center justify-between text-xs text-teal-700 dark:text-teal-300 font-mono font-medium">
              <span>IP68 Submersible · Clamp-On / In-Line</span>
              <span className="text-slate-400">Layer 01 Hardware</span>
            </div>
          </div>

          {/* Card 2: Cloud & Edge Software */}
          <div className="p-7 sm:p-9 rounded-2xl bg-white dark:bg-[#071f24] border border-[#dce8e6] dark:border-teal-800/40 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/[0.04] rounded-bl-full pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800/50">
                  {dualEngine.software.tag}
                </span>
                <div className="w-9 h-9 rounded-lg bg-cyan-600/10 dark:bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                  <Server className="w-5 h-5" />
                </div>
              </div>

              <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3 leading-snug">
                {dualEngine.software.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                {dualEngine.software.description}
              </p>

              <div className="space-y-3 pt-2">
                {dualEngine.software.features.map((feat: string, i: number) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                    <span className="leading-snug">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 dark:border-teal-900/40 flex items-center justify-between text-xs text-cyan-700 dark:text-cyan-300 font-mono font-medium">
              <span>Sub-Second Telemetry · Automated Rules</span>
              <span className="text-slate-400">Layer 02 Cloud</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionOverview;
