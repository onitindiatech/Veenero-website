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
  ArrowRight,
} from "lucide-react";
import { CapabilityCard } from "@/content/solutionDetailsData";

interface SolutionCapabilitiesProps {
  data: {
    eyebrow: string;
    title: string;
    description: string;
    items: CapabilityCard[];
  };
  onExploreAll?: () => void;
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
  onExploreAll,
}) => {
  return (
    <section
      id="capabilities"
      className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-[#070f12] border-b border-[#e2eded] dark:border-teal-900/30 select-none relative"
    >
      <div className="container mx-auto px-6 md:px-12 max-w-7xl font-sans">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-14 reveal-on-scroll">
          <div className="max-w-2xl text-left">
            <span className="text-teal-700 dark:text-teal-400 font-bold uppercase tracking-widest text-xs font-mono block mb-1.5">
              {data.eyebrow}
            </span>
            <div className="w-10 h-0.5 bg-teal-600 rounded-full mb-3" />
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
              {data.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed mt-2.5">
              {data.description}
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <a
              href="#inquiry-section"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-teal-600 dark:text-teal-400 hover:text-teal-500 transition-colors group"
            >
              <span>Explore All Capabilities</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* 4 to 6 Capability Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {data.items.map((item, idx) => {
            const Icon = capabilityIcons[item.icon] || Radio;
            const stagger =
              idx === 0
                ? ""
                : idx === 1
                ? "reveal-delay-100"
                : idx === 2
                ? "reveal-delay-200"
                : idx === 3
                ? "reveal-delay-300"
                : "reveal-delay-400";

            return (
              <div
                key={idx}
                className={`group p-6 rounded-2xl bg-[#fafcfc] dark:bg-[#0b1f24] border border-[#e2eded] dark:border-teal-900/40 hover:border-teal-500/50 shadow-xs hover:shadow-soft hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between text-left reveal-on-scroll ${stagger}`}
              >
                <div>
                  <div className="w-11 h-11 rounded-xl bg-teal-600/10 dark:bg-teal-500/15 border border-teal-500/20 text-teal-700 dark:text-teal-300 flex items-center justify-center mb-4 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300">
                    <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                  </div>

                  <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#ebf0f0] dark:border-teal-900/30 flex items-center justify-between text-xs text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors font-medium">
                  <span>Included in Platform</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
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
