import React from "react";
import {
  Radio,
  Lock,
  Layers,
  Network,
  Cpu,
  Sparkles,
  Zap,
  Building,
  ShieldCheck,
  Activity,
  ArrowRight,
} from "lucide-react";
import { SolutionDetailData } from "@/content/solutionDetailsData";

interface SolutionTechnologySectionProps {
  data: SolutionDetailData["techSection"];
}

const techIcons: Record<string, React.ElementType> = {
  Radio,
  Lock,
  Layers,
  Network,
  Cpu,
  Sparkles,
  Zap,
  Building,
  ShieldCheck,
  Activity,
};

export const SolutionTechnologySection: React.FC<SolutionTechnologySectionProps> = ({
  data,
}) => {
  return (
    <section
      id="technology-section"
      className="py-16 sm:py-20 lg:py-24 bg-[#021316] text-white select-none relative overflow-hidden font-sans border-b border-teal-900/40"
    >
      {/* Dynamic Background Water Waves & Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none -z-0">
        <div className="absolute -top-24 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(#2dd4bf 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-18 reveal-on-scroll">
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

        {/* Interactive Architecture Flow Visual */}
        <div className="rounded-2xl border border-teal-500/30 bg-slate-950/70 backdrop-blur-xl p-6 sm:p-8 lg:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.5)] reveal-on-scroll reveal-delay-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {data.diagramSteps.map((step, idx) => {
              const Icon = techIcons[step.icon] || Cpu;
              return (
                <div
                  key={idx}
                  className="relative flex flex-col p-5 rounded-xl bg-[#031d22]/90 border border-teal-500/25 hover:border-teal-400/50 transition-all duration-300 group"
                >
                  {/* Top: Step Index & Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-400/30 flex items-center justify-center text-teal-300 group-hover:scale-110 group-hover:bg-teal-500/25 transition-all duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono font-bold text-teal-400/80 bg-teal-950 px-2 py-0.5 rounded border border-teal-500/20">
                      LAYER 0{idx + 1}
                    </span>
                  </div>

                  {/* Title & Desc */}
                  <h3 className="font-display text-base font-bold text-white mb-2 group-hover:text-teal-300 transition-colors">
                    {step.label}
                  </h3>
                  <p className="text-xs text-slate-300/80 leading-relaxed flex-1">
                    {step.desc}
                  </p>

                  {/* Live Packet Status Indicator */}
                  <div className="pt-4 mt-4 border-t border-teal-900/40 flex items-center justify-between text-[11px] text-teal-400 font-mono">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping" />
                      Stream Active
                    </span>
                    <span className="text-slate-400">99.9% QoS</span>
                  </div>

                  {/* Connecting Arrow for Desktop */}
                  {idx < data.diagramSteps.length - 1 && (
                    <div className="hidden md:block absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-[#021316] border border-teal-500/40 flex items-center justify-center text-teal-300">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Stream Telemetry Visualizer Bar */}
          <div className="mt-8 pt-6 border-t border-teal-900/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-300">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span>TLS 1.3 Encrypted Transmission</span>
              <span className="text-teal-500">|</span>
              <span className="text-teal-300">Sub-Second Processing</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Time-Series Format:</span>
              <span className="px-2 py-0.5 rounded bg-teal-950 border border-teal-500/30 text-teal-200">
                Protobuf / MQTT
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionTechnologySection;
