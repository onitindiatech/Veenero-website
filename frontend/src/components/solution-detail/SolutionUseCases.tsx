import React from "react";
import {
  Building2,
  Factory,
  Radio,
  Building,
  Server,
  Home,
  Coffee,
  Globe,
  ArrowRight,
} from "lucide-react";
import { UseCaseItem } from "@/content/solutionDetailsData";

interface SolutionUseCasesProps {
  data: {
    eyebrow: string;
    title: string;
    description: string;
    items: UseCaseItem[];
  };
}

const useCaseIcons: Record<string, React.ElementType> = {
  Building2,
  Factory,
  Radio,
  Building,
  Server,
  Home,
  Coffee,
  Globe,
};

export const SolutionUseCases: React.FC<SolutionUseCasesProps> = ({ data }) => {
  return (
    <section
      id="use-cases-section"
      className="py-16 sm:py-20 lg:py-24 bg-[#f7fafa] dark:bg-[#03191d] border-b border-[#e2eded] dark:border-teal-900/30 select-none font-sans relative"
    >
      <div className="container mx-auto px-6 md:px-12 max-w-7xl">
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
              <span>View All 12 Use Cases</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* Use Cases Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.items.map((item, idx) => {
            const Icon = useCaseIcons[item.icon] || Building2;
            const stagger =
              idx === 0
                ? ""
                : idx === 1
                ? "reveal-delay-100"
                : idx === 2
                ? "reveal-delay-200"
                : "reveal-delay-300";

            return (
              <div
                key={idx}
                className={`group rounded-2xl overflow-hidden bg-white dark:bg-[#071d22] border border-[#e2eded] dark:border-teal-900/40 shadow-xs hover:shadow-soft hover:-translate-y-1 transition-all duration-300 flex flex-col text-left reveal-on-scroll ${stagger}`}
              >
                {/* Image Header if available */}
                {item.image && (
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
                    {item.stats && (
                      <span className="absolute bottom-2.5 left-3 text-[11px] font-mono font-bold text-white bg-teal-600/90 backdrop-blur-xs px-2.5 py-0.5 rounded shadow-xs">
                        {item.stats}
                      </span>
                    )}
                  </div>
                )}

                {/* Content */}
                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="w-9 h-9 rounded-xl bg-teal-600/10 dark:bg-teal-500/15 text-teal-700 dark:text-teal-300 flex items-center justify-center mb-3 group-hover:bg-teal-600 group-hover:text-white transition-colors duration-300">
                      <Icon className="w-4.5 h-4.5" />
                    </div>

                    <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#ebf0f0] dark:border-teal-900/30 flex items-center justify-between text-xs font-semibold text-teal-600 dark:text-teal-400">
                    <span>Explore Scenario</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SolutionUseCases;
