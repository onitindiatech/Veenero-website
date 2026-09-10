import React from "react";
import {
  Radio,
  Sparkles,
  MapPin,
  Shield,
  BarChart3,
  Cpu,
  Layers,
  Zap,
  Gauge,
  SlidersHorizontal,
  Building,
  ShieldCheck,
  FileCheck,
  DollarSign,
  Droplets,
  Users,
  Activity,
  TrendingUp,
  Compass,
} from "lucide-react";
import { CapabilityCard } from "@/content/solutionDetailsData";

interface SolutionCapabilitiesProps {
  data: {
    eyebrow: string;
    title: string;
    description: string;
    items: CapabilityCard[];
  };
}

const capabilityIcons: Record<string, React.ElementType> = {
  Radio,
  Sparkles,
  MapPin,
  Shield,
  BarChart3,
  Cpu,
  Layers,
  Zap,
  Gauge,
  SlidersHorizontal,
  Building,
  ShieldCheck,
  FileCheck,
  DollarSign,
  Droplets,
  Users,
  Activity,
  TrendingUp,
  Compass,
};

export const SolutionCapabilities: React.FC<SolutionCapabilitiesProps> = ({
  data,
}) => {
  // Reduce to the most important 4 capabilities
  const displayItems = data.items.slice(0, 4);

  return (
    <section
      id="capabilities"
      className="py-16 sm:py-20 lg:py-24 bg-[#fafcfc] dark:bg-[#041316] border-b border-[#e2eded] dark:border-teal-900/30 select-none relative font-sans"
    >
      <div className="container mx-auto px-6 md:px-12 max-w-7xl">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16 text-left">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
            <span className="text-teal-700 dark:text-teal-400 font-bold uppercase tracking-widest text-xs font-mono">
              {data.eyebrow || "KEY CAPABILITIES"}
            </span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white leading-[1.25] tracking-tight">
            {data.title}
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed mt-3 max-w-2xl">
            {data.description}
          </p>
        </div>

        {/* 4 Clean, Premium Capability Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayItems.map((item, idx) => {
            const Icon = capabilityIcons[item.icon] || Radio;

            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white dark:bg-[#071d22] border border-[#e2eded] dark:border-teal-900/40 hover:border-teal-500/40 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-start text-left group"
              >
                <div className="w-11 h-11 rounded-xl bg-teal-600/10 dark:bg-teal-500/15 border border-teal-500/20 text-teal-700 dark:text-teal-300 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-200">
                  <Icon className="w-5 h-5" />
                </div>

                <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SolutionCapabilities;
