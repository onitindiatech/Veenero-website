import React from "react";
import {
  Radio,
  Wifi,
  Cpu,
  SlidersHorizontal,
  ShieldCheck,
  Activity,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  PieChart,
  FileCheck,
  Lock,
  BarChart3,
  Layers,
  Network,
} from "lucide-react";
import { HowItWorksStep } from "@/content/solutionDetailsData";

interface SolutionHowItWorksProps {
  data: {
    eyebrow: string;
    title: string;
    description: string;
    steps: HowItWorksStep[];
  };
}

const stepIcons: Record<string, React.ElementType> = {
  Radio,
  Wifi,
  Cpu,
  SlidersHorizontal,
  ShieldCheck,
  Activity,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  PieChart,
  FileCheck,
  Lock,
  BarChart3,
  Layers,
  Network,
};

export const SolutionHowItWorks: React.FC<SolutionHowItWorksProps> = ({ data }) => {
  return (
    <section
      id="how-it-works"
      className="py-16 sm:py-20 lg:py-24 bg-[#f4f9f9] dark:bg-[#04161a] border-b border-[#e2eded] dark:border-teal-900/30 select-none relative overflow-hidden"
    >
      {/* Background soft ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-teal-500/[0.04] rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10 font-sans">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-18 reveal-on-scroll">
          <span className="text-teal-700 dark:text-teal-400 font-bold uppercase tracking-widest text-xs font-mono block mb-2">
            {data.eyebrow}
          </span>
          <div className="w-12 h-0.5 bg-teal-600 mx-auto rounded-full mb-3.5" />
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
            {data.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed mt-3">
            {data.description}
          </p>
        </div>

        {/* ── DESKTOP HORIZONTAL PROCESS TIMELINE (Hidden on mobile) ────────── */}
        <div className="hidden lg:block relative reveal-on-scroll reveal-delay-100">
          {/* Animated Connecting Line */}
          <div className="absolute top-[42px] left-[10%] right-[10%] h-[2px] bg-teal-200 dark:bg-teal-900/60 -z-0">
            <div className="h-full bg-gradient-to-r from-teal-500 via-cyan-400 to-teal-500 w-full animate-stream" />
          </div>

          <div className="grid grid-cols-5 gap-4 relative z-10">
            {data.steps.map((step, idx) => {
              const Icon = stepIcons[step.icon] || Radio;
              return (
                <div key={idx} className="flex flex-col items-center text-center group">
                  {/* Step Node Circle */}
                  <div className="relative mb-5">
                    <div className="w-21 h-21 rounded-full bg-white dark:bg-[#071d22] border-2 border-teal-500/30 group-hover:border-teal-500 shadow-md group-hover:shadow-[0_0_20px_rgba(20,184,166,0.3)] transition-all duration-300 flex items-center justify-center relative">
                      <div className="w-16 h-16 rounded-full bg-teal-50 dark:bg-teal-950/60 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Icon className="w-7 h-7 text-teal-600 dark:text-teal-400" />
                      </div>
                    </div>
                    {/* Number Badge */}
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-teal-600 text-white text-[10px] font-bold font-mono shadow-xs">
                      {step.step}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-display text-base font-bold text-slate-900 dark:text-white mb-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {step.title}
                  </h3>
                  <span className="text-[11px] font-semibold text-teal-700 dark:text-teal-400 block mb-1.5 font-mono">
                    {step.subtitle}
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-[200px]">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── MOBILE / TABLET VERTICAL TIMELINE (Shown on small screens) ───── */}
        <div className="lg:hidden relative pl-6 space-y-8 border-l-2 border-teal-500/30 dark:border-teal-900/60 ml-4">
          {data.steps.map((step, idx) => {
            const Icon = stepIcons[step.icon] || Radio;
            const stagger =
              idx === 0
                ? ""
                : idx === 1
                ? "reveal-delay-100"
                : idx === 2
                ? "reveal-delay-200"
                : "reveal-delay-300";
            return (
              <div key={idx} className={`relative group reveal-on-scroll ${stagger}`}>
                {/* Node on Vertical Line */}
                <div className="absolute -left-[37px] top-0 w-9 h-9 rounded-full bg-white dark:bg-[#071d22] border-2 border-teal-500 shadow-sm flex items-center justify-center">
                  <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400 font-mono">
                    {step.step}
                  </span>
                </div>

                {/* Content Card */}
                <div className="bg-white dark:bg-[#0a2026] p-4.5 rounded-xl border border-[#e2eded] dark:border-teal-900/40 shadow-xs">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h3 className="font-display text-base font-bold text-slate-900 dark:text-white leading-tight">
                        {step.title}
                      </h3>
                      <span className="text-[11px] font-medium text-teal-600 dark:text-teal-400 font-mono">
                        {step.subtitle}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SolutionHowItWorks;
