import React, { useState } from "react";
import {
  Activity,
  BarChart3,
  TrendingUp,
  Radio,
  Sliders,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import { SolutionDetailData } from "@/content/solutionDetailsData";
import { DigitCounter } from "./DigitCounter";

interface SolutionAnalyticsVisualProps {
  data: SolutionDetailData["analyticsVisual"];
}

export const SolutionAnalyticsVisual: React.FC<SolutionAnalyticsVisualProps> = ({
  data,
}) => {
  const [selectedZone, setSelectedZone] = useState<string>("Zone-1");

  return (
    <section
      id="analytics-section"
      className="py-16 sm:py-20 lg:py-24 bg-[#021316] text-white border-b border-teal-900/40 select-none font-sans relative overflow-hidden"
    >
      {/* Dynamic Background Water Waves & Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none -z-0">
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[300px] bg-teal-500/[0.08] rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(#2dd4bf 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 reveal-on-scroll">
          <span className="text-teal-400 font-bold uppercase tracking-widest text-xs font-mono block mb-2">
            {data.eyebrow}
          </span>
          <div className="w-12 h-0.5 bg-teal-500 mx-auto rounded-full mb-3" />
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight">
            {data.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-300/90 leading-relaxed mt-3">
            {data.description}
          </p>
        </div>

        {/* Analytics Interactive Card */}
        <div className="rounded-2xl border border-teal-500/30 bg-slate-950/80 backdrop-blur-xl p-5 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.6)] reveal-on-scroll reveal-delay-100">
          {/* Top Bar: Stats with DigitCounters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-6 border-b border-teal-900/40">
            {data.stats.map((stat, idx) => (
              <div
                key={idx}
                className="p-3.5 sm:p-4 rounded-xl bg-[#031d22]/90 border border-teal-500/20"
              >
                <span className="text-[11px] text-slate-400 block mb-1 font-sans">
                  {stat.label}
                </span>
                <div className="text-xl sm:text-2xl font-bold text-white flex items-baseline gap-1">
                  <DigitCounter
                    target={stat.numericValue}
                    suffix={stat.suffix || ""}
                    displayValueOverride={stat.value}
                  />
                </div>
                {stat.change && (
                  <span className="text-[10px] text-teal-400 font-mono mt-1 block">
                    {stat.change}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Graph Visual Area */}
          <div className="mt-6 pt-2">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Select Facility Zone:</span>
                {["Zone-1", "Zone-2", "Zone-3"].map((zone) => (
                  <button
                    key={zone}
                    onClick={() => setSelectedZone(zone)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                      selectedZone === zone
                        ? "bg-teal-600 text-white font-bold"
                        : "bg-slate-900 text-slate-300 border border-teal-900/40 hover:border-teal-500/40"
                    }`}
                  >
                    {zone}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
                  <span>Actual Telemetry</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-300" />
                  <span>Baseline Target</span>
                </div>
              </div>
            </div>

            {/* Dynamic Interactive SVG Chart Canvas */}
            <div className="h-56 sm:h-64 w-full rounded-xl bg-[#011417] border border-teal-900/50 p-4 relative overflow-hidden flex flex-col justify-between">
              {/* Background Grid Lines */}
              <div className="absolute inset-0 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />

              {/* Chart SVG */}
              <svg className="w-full h-full" viewBox="0 0 500 160" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="areaTeal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Target Baseline Dotted Line */}
                <line x1="0" y1="65" x2="500" y2="65" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.7" />

                {/* Actual Stream Area */}
                <polygon
                  fill="url(#areaTeal)"
                  points="0,120 50,105 100,110 150,70 200,85 250,55 300,60 350,42 400,48 450,30 500,35 500,160 0,160"
                />

                {/* Actual Stream Line */}
                <polyline
                  fill="none"
                  stroke="#2dd4bf"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points="0,120 50,105 100,110 150,70 200,85 250,55 300,60 350,42 400,48 450,30 500,35"
                />

                {/* Pulsing Highlight Dot on Latest Telemetry */}
                <circle cx="500" cy="35" r="4" fill="#2dd4bf" />
                <circle cx="500" cy="35" r="9" fill="#2dd4bf" opacity="0.3" className="animate-ping" />
              </svg>

              {/* X Axis Time Labels */}
              <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-2 border-t border-teal-900/30 relative z-10">
                <span>00:00 HRS</span>
                <span>04:00 HRS</span>
                <span>08:00 HRS</span>
                <span>12:00 HRS</span>
                <span>16:00 HRS</span>
                <span>20:00 HRS</span>
                <span>NOW (LIVE)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionAnalyticsVisual;
