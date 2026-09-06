import React from "react";
import {
  Gauge,
  Activity,
  Droplets,
  Bell,
  Layers,
  Network,
  Sparkles,
  Cpu,
  MapPin,
  PieChart,
  Radio,
  Shield,
  FileText,
  Lock,
  AlertTriangle,
  CheckCircle2,
  Download,
  Calendar,
  Database,
  Share2,
  ArrowRight,
} from "lucide-react";
import { FeatureItem } from "@/content/solutionDetailsData";

interface SolutionFeaturesProps {
  data: {
    eyebrow: string;
    title: string;
    description: string;
    items: FeatureItem[];
  };
}

const featureIcons: Record<string, React.ElementType> = {
  Gauge,
  Activity,
  Droplets,
  Bell,
  Layers,
  Network,
  Sparkles,
  Cpu,
  MapPin,
  PieChart,
  Radio,
  Shield,
  FileText,
  Lock,
  AlertTriangle,
  CheckCircle2,
  Download,
  Calendar,
  Database,
  Share2,
};

export const SolutionFeatures: React.FC<SolutionFeaturesProps> = ({ data }) => {
  return (
    <section
      id="features-section"
      className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-[#070f12] border-b border-[#e2eded] dark:border-teal-900/30 select-none font-sans relative"
    >
      <div className="container mx-auto px-6 md:px-12 max-w-7xl">
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

        {/* Feature Grid with alternating subtle gradients */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.items.map((item, idx) => {
            const Icon = featureIcons[item.icon] || Activity;
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
                className={`p-6 sm:p-7 rounded-2xl bg-[#fafcfc] dark:bg-[#091e23] border border-[#dce9e6] dark:border-teal-900/40 hover:border-teal-500/40 shadow-xs hover:shadow-soft hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between reveal-on-scroll ${stagger}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-teal-600/10 dark:bg-teal-500/15 text-teal-700 dark:text-teal-300 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    {item.tag && (
                      <span className="text-[10px] font-mono font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded border border-teal-600/15">
                        {item.tag}
                      </span>
                    )}
                  </div>

                  <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#e8ecec] dark:border-teal-900/30 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Enterprise Ready</span>
                  <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SolutionFeatures;
