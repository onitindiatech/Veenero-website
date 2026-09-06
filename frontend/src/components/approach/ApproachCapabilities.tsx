import React from "react";
import { Radio, Cloud, Cpu, PlugZap, TrendingUp, Gauge, BarChart3, Leaf } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import dashboardImage from "@/assets/about/about-infrastructure-sensor.webp";

interface ApproachCapabilitiesProps {
  data?: any;
}

// 4 Technology pillars on the left
const defaultTechCapabilities = [
  {
    icon: Radio,
    title: "IoT Sensors",
    description: "High-precision, industrial-grade telemetry devices.",
  },
  {
    icon: Cloud,
    title: "Cloud Platform",
    description: "Scalable, encrypted, and highly available data streams.",
  },
  {
    icon: Cpu,
    title: "AI & Analytics",
    description: "Advanced ML models for anomaly detection and forecasting.",
  },
  {
    icon: PlugZap,
    title: "Open Integrations",
    description: "Seamless API integration with existing SCADA and ERPs.",
  },
];

const capabilityIconMap: Record<string, any> = {
  Radio,
  Cloud,
  Cpu,
  PlugZap,
  TrendingUp,
  Gauge,
  BarChart3,
};

export const ApproachCapabilities: React.FC<ApproachCapabilitiesProps> = ({ data }) => {
  useScrollReveal([]);

  const eyebrow = data?.eyebrow || "ENABLED BY TECHNOLOGY";
  const title = data?.title || "Built on a Modern,";
  const highlightedText = data?.highlightedText || "Scalable Architecture";
  const description = data?.description ||
    "We combine best-in-class technologies with domain expertise to build solutions that are secure, scalable, and future-ready.";

  const capabilities = data?.capabilities && data.capabilities.length > 0
    ? data.capabilities.map((c: any, i: number) => ({
        icon: capabilityIconMap[c.icon] || defaultTechCapabilities[i % defaultTechCapabilities.length]?.icon || Radio,
        title: c.title,
        description: c.description,
      }))
    : defaultTechCapabilities;

  const img = data?.image || dashboardImage;

  const flowRateLabel = data?.telemetry?.flowRate?.label || "Water Flow Rate";
  const flowRateValue = data?.telemetry?.flowRate?.value || "1,245";
  const flowRateUnit = data?.telemetry?.flowRate?.unit || "m³/hr";

  const systemHealthLabel = data?.telemetry?.systemHealth?.label || "System Health";
  const systemHealthValue = data?.telemetry?.systemHealth?.value || "98%";

  return (
    <section
      id="approach-technology"
      className="relative bg-[#021318] text-white select-none overflow-hidden"
    >
      {/* Wave Transition from previous section */}
      <div className="relative w-full overflow-hidden leading-none pointer-events-none select-none -mb-1">
        <svg className="w-full h-16 sm:h-24 lg:h-32 text-[#021318]" viewBox="0 0 1440 160" fill="none" preserveAspectRatio="none">
          <path d="M0,80 C240,160 480,20 720,80 C960,140 1200,40 1440,90 L1440,160 L0,160 Z" fill="#0ea5e9" fillOpacity="0.25" />
          <path d="M0,50 C320,130 560,0 840,65 C1120,130 1320,30 1440,60 L1440,160 L0,160 Z" fill="#14b8a6" fillOpacity="0.4" />
          <path d="M0,40 C360,110 680,10 1020,70 C1240,105 1380,45 1440,55 L1440,160 L0,160 Z" fill="currentColor" />
        </svg>
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-teal-400/20 via-cyan-400/50 to-teal-400/20 blur-xs" />
      </div>
      <div className="container mx-auto px-6 md:px-12 max-w-7xl pt-4 sm:pt-6 pb-16 sm:pb-20 lg:pb-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* LEFT: Eyebrow, H2, Description, 4 capability badges */}
          <div className="lg:col-span-5 text-left font-sans space-y-4 reveal-on-scroll">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-400/10 border border-teal-400/25 backdrop-blur-xs mb-1">
              <Leaf className="w-3 h-3 text-teal-300" />
              <span className="text-teal-300 font-bold uppercase tracking-widest text-[10px] sm:text-[11px] font-mono">
                {eyebrow}
              </span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.6rem] font-bold text-white leading-[1.18] tracking-tight">
              {title}{" "}
              <span className="text-teal-400">{highlightedText}</span>
            </h2>

            <p className="text-sm sm:text-[15px] text-slate-300 leading-relaxed">
              {description}
            </p>

            {/* 4 Technology capability badges — 2x2 grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {capabilities.map((cap: any, i: number) => {
                const Icon = cap.icon;
                const stagger = ["", "", "reveal-delay-100", "reveal-delay-200"][i];
                return (
                  <div
                    key={cap.title}
                    className={`flex items-start gap-3 bg-white/5 backdrop-blur-xs rounded-2xl p-4 border border-teal-900/40 hover:border-teal-500/40 shadow-xs hover:-translate-y-0.5 transition-all duration-300 reveal-on-scroll ${stagger}`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-teal-400/15 border border-teal-400/30 flex items-center justify-center shrink-0 text-teal-300">
                      <Icon className="w-4.5 h-4.5" strokeWidth={1.8} />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <h4 className="text-xs font-bold text-white leading-tight">
                        {cap.title}
                      </h4>
                      <p className="text-[11px] text-slate-300/80 leading-relaxed">
                        {cap.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Large Dashboard / Telemetry Visual */}
          <div className="lg:col-span-7 reveal-on-scroll reveal-delay-200">
            <div className="group relative rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/80 dark:border-teal-900/40 bg-slate-950 shadow-xl">
              {/* Dashboard image with subtle motion */}
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <img
                  src={img}
                  alt="Veenero real-time intelligence dashboard — live flow, quality and system health monitoring"
                  className="w-full h-full object-cover opacity-90 group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                {/* Dark overlay so telemetry overlays read clearly */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950/40 via-slate-950/20 to-slate-950/50 pointer-events-none" />
                {/* Teal corner vignette glow */}
                <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-teal-500/15 blur-3xl pointer-events-none" />

                {/* Top-left dashboard chrome */}
                <div className="absolute top-5 left-5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950/75 backdrop-blur-sm border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="w-2 h-2 rounded-full bg-yellow-400" />
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="ml-2 text-[10px] text-slate-300 font-mono">operations.veenero</span>
                </div>

                {/* Telemetry widgets on top-right */}
                <div className="absolute top-4 right-4 w-[48%] space-y-2.5">
                  {/* Live Overview widget */}
                  <div className="rounded-xl bg-slate-950/80 backdrop-blur-md border border-teal-500/25 p-3 shadow-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-teal-300">{flowRateLabel}</p>
                        <div className="flex items-end gap-1 mt-0.5">
                          <span className="font-display text-2xl font-extrabold text-white leading-none">{flowRateValue}</span>
                          <span className="text-[9px] text-slate-400 mb-0.5">{flowRateUnit}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] text-slate-400">{systemHealthLabel}</p>
                        <div className="flex items-center gap-1 justify-end mt-0.5">
                          <span className="font-display text-lg font-extrabold text-emerald-400 leading-none">{systemHealthValue}</span>
                          <TrendingUp className="w-3 h-3 text-emerald-400" />
                        </div>
                      </div>
                    </div>
                    {/* Bar chart mock */}
                    <svg viewBox="0 0 240 50" className="w-full h-11">
                      <defs>
                        <linearGradient id="dashBars" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#2dd4bf" />
                          <stop offset="100%" stopColor="#0d9488" />
                        </linearGradient>
                      </defs>
                      {[14, 22, 18, 30, 26, 38, 33, 44, 40, 48, 42, 50].map((h, i) => (
                        <rect
                          key={i}
                          x={4 + i * 19.5}
                          y={50 - h}
                          width="12"
                          height={h}
                          rx="2"
                          fill="url(#dashBars)"
                          opacity={0.85}
                        />
                      ))}
                    </svg>
                  </div>

                  {/* Quality gauge widget */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="rounded-xl bg-slate-950/80 backdrop-blur-md border border-teal-500/25 p-3 flex items-center gap-2.5">
                      <div className="relative w-12 h-12 shrink-0">
                        <svg viewBox="0 0 50 50" className="w-full h-full -rotate-90">
                          <circle cx="25" cy="25" r="20" stroke="#0a2a30" strokeWidth="4" fill="none" />
                          <circle
                            cx="25" cy="25" r="20"
                            stroke="#14b8a6"
                            strokeWidth="4"
                            strokeLinecap="round"
                            fill="none"
                            strokeDasharray="125.7"
                            strokeDashoffset="5"
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center font-display text-xs font-extrabold text-white">
                          96.5
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] font-bold uppercase tracking-wider text-teal-300 leading-tight">Quality Index</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Excellent</p>
                      </div>
                    </div>
                    <div className="rounded-xl bg-slate-950/80 backdrop-blur-md border border-teal-500/25 p-3 space-y-1.5">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-teal-300">Alerts Today</p>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-display text-2xl font-extrabold text-white leading-none">3</span>
                        <span className="text-[9px] text-amber-400">2 review</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#0a2a30] overflow-hidden">
                        <div className="h-full w-[30%] bg-gradient-to-r from-amber-400 to-teal-400 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom-left widget: Sites map view */}
                <div className="absolute bottom-4 left-4 w-[55%] rounded-xl bg-slate-950/80 backdrop-blur-md border border-teal-500/25 p-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-teal-500/20 border border-teal-400/30 flex items-center justify-center shrink-0">
                    <Gauge className="w-5 h-5 text-teal-300" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-teal-300">Active Sites · All Regions</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[10px] text-slate-300">42 Online</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <span className="text-[10px] text-slate-300">1 Warning</span>
                      </div>
                    </div>
                  </div>
                  <BarChart3 className="w-4 h-4 text-teal-400 shrink-0" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ApproachCapabilities;
