import React from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { SolutionsContent } from "@/content/solutions";

interface WaterIntelligenceFlowProps {
  data?: any;
}

const DEFAULT_FLOW_STAGES = [
  {
    number: "01",
    icon: "●",
    title: "Sense",
    description: "Rugged edge sensors capture high-resolution flow, pressure, and quality data across every water asset.",
    color: "teal",
  },
  {
    number: "02",
    icon: "◌",
    title: "Connect",
    description: "Encrypted data streams pipe telemetry to the cloud through hardware-agnostic IoT gateways.",
    color: "teal",
  },
  {
    number: "03",
    icon: "◈",
    title: "Understand",
    description: "AI-powered analytics establish baselines, detect anomalies, and surface operational intelligence.",
    color: "teal",
  },
  {
    number: "04",
    icon: "◆",
    title: "Act",
    description: "Operational intelligence to optimize water usage, reduce losses, and drive measurable outcomes.",
    color: "teal",
  },
  {
    number: "05",
    icon: "✓",
    title: "Verify",
    description: "Certified savings are verified with cryptographic audit trails, ready for ESG reporting and compliance.",
    color: "teal",
  },
];

const DEFAULT_LAYERS = [
  {
    number: "01",
    title: "Sense & Ingest",
    subtitle: "Edge Telemetry & IoT Gateways",
    description: "High-precision non-invasive and inline sensors measure flow, pressure, temperature, and quality across distributed facilities with zero blindspots.",
    capabilities: [
      "Multi-source hardware agnostic ingestion",
      "Ultra-low latency edge telemetry",
      "Encrypted local data buffering",
    ],
  },
  {
    number: "02",
    title: "Stream & Validate",
    subtitle: "Real-Time Data Pipeline",
    description: "Continuous data streaming with cryptographic integrity checks, noise filtering, and automated validation to ensure every data packet is authentic.",
    capabilities: [
      "Tamper-evident time-series storage",
      "Automated anomaly validation",
      "Scalable microservices architecture",
    ],
  },
  {
    number: "03",
    title: "Analyze & Optimize",
    subtitle: "AI Water Intelligence Engine",
    description: "Machine learning models establish consumption baselines, detect micro-leaks, flag operational anomalies, and calculate multi-site benchmarks.",
    capabilities: [
      "Predictive consumption forecasting",
      "Automated threshold alert triggers",
      "Multi-facility efficiency benchmarking",
    ],
  },
  {
    number: "04",
    title: "Verify & Govern",
    subtitle: "Audit-Ready ESG & Compliance",
    description: "Verification-first dashboards and export pipelines generate traceable audit trails for sustainability governance and compliance reporting.",
    capabilities: [
      "One-click audit trail exports",
      "Role-based enterprise permissions",
      "Open REST / SCADA / ERP API connectors",
    ],
  },
];

export const WaterIntelligenceFlow: React.FC<WaterIntelligenceFlowProps> = ({ data }) => {
  useScrollReveal([]);

  const stages = data?.stages && data.stages.length > 0 ? data.stages : DEFAULT_FLOW_STAGES;
  const layers = data?.layers && data.layers.length > 0 ? data.layers : DEFAULT_LAYERS;

  return (
    <section
      id="platform-architecture"
      className="relative py-14 sm:py-16 lg:py-20 bg-white dark:bg-[#070f12] border-t border-[#e2eded] dark:border-teal-900/30 select-none"
    >
      <div className="container mx-auto px-6 md:px-12 max-w-7xl space-y-10">

        {/* Section Header */}
        <div className="text-left font-sans max-w-3xl reveal-on-scroll">
          <span className="text-teal-700 dark:text-teal-400 font-bold uppercase tracking-widest text-xs font-mono block mb-1.5">
            {data?.eyebrow || "HOW VEENERO SOLUTIONS WORK"}
          </span>
          <div className="w-10 h-0.5 bg-teal-600 rounded-full mb-4" />
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
            {data?.title || "From Sensor Signal to Verified Outcome"}
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed mt-3 max-w-2xl">
            {data?.description ||
              "A single integrated flow where sensing, secure connectivity, analytics, operational action, and verification all work together — closing the loop on every drop of water."}
          </p>
        </div>

        {/* Flow stages — horizontal on lg, vertical on mobile */}
        <div className="relative">
          {/* Connecting line (desktop only) */}
          <div className="hidden lg:block absolute top-[38px] left-[60px] right-[60px] h-0.5 bg-gradient-to-r from-teal-400/0 via-teal-400/60 to-teal-400/0 pointer-events-none" />

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
            {stages.map((stage: any, i: number) => (
              <div
                key={i}
                className={`group relative flex flex-col items-start lg:items-center text-left lg:text-center font-sans reveal-on-scroll reveal-delay-${Math.min(i * 100, 500)}`}
              >
                {/* Stage number bubble */}
                <div className="relative z-10 w-14 h-14 rounded-2xl bg-[#edf6f5] dark:bg-[#042127] border-2 border-teal-500/40 flex flex-col items-center justify-center mb-4 shadow-sm group-hover:border-teal-500 group-hover:shadow-soft transition-all duration-300">
                  <span className="text-[10px] font-bold text-teal-500 font-mono leading-none">{stage.number}</span>
                  <span className="text-teal-700 dark:text-teal-300 text-base font-bold mt-0.5">{stage.icon || "●"}</span>
                </div>

                {/* Title */}
                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
                  {stage.title}
                </h3>

                {/* Description */}
                <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {stage.description}
                </p>

                {/* Mobile vertical connector */}
                {i < stages.length - 1 && (
                  <div className="lg:hidden absolute left-7 top-14 bottom-0 w-0.5 bg-teal-400/30 -z-10" style={{ height: "calc(100% + 1rem)" }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 4 Architecture Layer Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-2">
          {layers.map((layer: any, idx: number) => (
            <div
              key={idx}
              className={`group bg-[#f5fafa] dark:bg-[#062429] rounded-2xl p-5 border border-[#dce9e6] dark:border-teal-900/40 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col font-sans reveal-on-scroll reveal-delay-${Math.min(idx * 100, 400)}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 text-[10px] font-extrabold border border-teal-600/20">
                  LAYER {layer.number || `0${idx + 1}`}
                </span>
                <span className="font-display text-xl font-bold text-slate-200 dark:text-slate-700">
                  0{idx + 1}
                </span>
              </div>

              <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white mb-1 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
                {layer.title}
              </h3>
              <p className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 mb-2">{layer.subtitle}</p>
              <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed flex-1">{layer.description}</p>

              <div className="pt-3 mt-3 border-t border-[#dce9e6] dark:border-teal-900/40 space-y-1.5">
                {(layer.capabilities || []).map((cap: string, ci: number) => (
                  <div key={ci} className="flex items-start gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                    <span className="text-teal-500 shrink-0 mt-0.5">▸</span>
                    <span className="leading-tight">{cap}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default WaterIntelligenceFlow;
