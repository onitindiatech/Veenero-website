import React from "react";
import { ArrowRight } from "lucide-react";
import { UseCaseItem } from "@/content/solutionDetailsData";

interface SolutionUseCasesProps {
  data: {
    eyebrow: string;
    title: string;
    description: string;
    items: UseCaseItem[];
  };
}

export const SolutionUseCases: React.FC<SolutionUseCasesProps> = ({ data }) => {
  // Keep approximately 4 strong use cases
  const displayItems = data.items.slice(0, 4);

  const handleScrollToInquiry = () => {
    const el = document.getElementById("inquiry-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="use-cases-section"
      className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-[#070f12] border-b border-[#e2eded] dark:border-teal-900/30 select-none font-sans relative"
    >
      <div className="container mx-auto px-6 md:px-12 max-w-7xl">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16 text-left">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
            <span className="text-teal-700 dark:text-teal-400 font-bold uppercase tracking-widest text-xs font-mono">
              {data.eyebrow || "DEPLOYMENT SCENARIOS"}
            </span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white leading-[1.25] tracking-tight">
            {data.title}
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed mt-3 max-w-2xl">
            {data.description}
          </p>
        </div>

        {/* 4 Clean, Premium Use Case Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayItems.map((item, idx) => (
            <div
              key={idx}
              className="group rounded-2xl overflow-hidden bg-[#f9fbfb] dark:bg-[#071d22] border border-[#e2eded] dark:border-teal-900/40 hover:border-teal-500/40 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between text-left"
            >
              <div>
                {/* Image Header with Outcome Tag */}
                {item.image && (
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
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
                <div className="p-5">
                  <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Action Link */}
              <div className="p-5 pt-0">
                <button
                  type="button"
                  onClick={handleScrollToInquiry}
                  className="w-full pt-3 border-t border-[#ebf0f0] dark:border-teal-900/30 flex items-center justify-between text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-500 transition-colors cursor-pointer"
                >
                  <span>Explore Scenario</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionUseCases;
