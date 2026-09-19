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
  // Display up to 6 capabilities in balanced grid
  const displayItems = data.items && data.items.length > 0 ? data.items.slice(0, 6) : [];

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

        {/* Clean, Premium Capability Cards Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 ${displayItems.length > 4 ? "lg:grid-cols-3" : "lg:grid-cols-4"} gap-6`}>
          {displayItems.map((item, idx) => {
            const Icon = capabilityIcons[item.icon] || Radio;

            return (
              <div
                key={idx}
                className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#071d22] border border-[#e2eded] dark:border-teal-900/40 hover:border-teal-500/40 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between text-left group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-teal-600/10 dark:bg-teal-500/15 border border-teal-500/20 text-teal-700 dark:text-teal-300 flex items-center justify-center group-hover:scale-105 group-hover:bg-teal-600/20 transition-all duration-200">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-2.5 py-1 rounded-full border border-teal-200 dark:border-teal-800/40">
                      CAPABILITY 0{idx + 1}
                    </span>
                  </div>

                  <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-5 border-t border-slate-100 dark:border-teal-950/80 flex items-center justify-between text-xs text-teal-600 dark:text-teal-400 font-medium">
                  <span>Continuous Monitoring</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SolutionCapabilities;
