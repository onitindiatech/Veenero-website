import React from "react";
import { ImpactContent } from "@/content/impact";
import { getWaterPhotograph } from "@/utils/waterImages";

interface ImpactOutcomesProps {
  data: ImpactContent["outcomes"];
}

export const ImpactOutcomes: React.FC<ImpactOutcomesProps> = ({ data }) => {
  return (
    <section id="impact-outcomes" className="py-12 md:py-16 bg-transparent relative border-b border-border/10">
      {/* Background Water Caustic Glow */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="container mx-auto px-6 md:px-12 max-w-7xl space-y-12">
        
        {/* Section Header */}
        <div className="text-left font-sans max-w-3xl">
          {data.eyebrow && (
            <span className="text-teal-600 dark:text-teal-400 font-bold uppercase tracking-widest text-[10px] md:text-xs block mb-3">
              {data.eyebrow}
            </span>
          )}
          <h2 className="font-display text-3xl md:text-[2.5rem] font-bold text-foreground mb-3">
            {data.title}
          </h2>
          {data.description && (
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              {data.description}
            </p>
          )}
        </div>

        {/* 4 Outcome Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.pillars.map((pillar, idx) => {
            const imgSrc = getWaterPhotograph((pillar as any).iconImage || (pillar as any).imageUrl, pillar.label, idx);
            return (
              <div
                key={idx}
                className="group bg-card p-8 rounded-2xl border border-border/40 hover:border-teal-600/30 shadow-sm hover:shadow-soft hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between font-sans h-full relative"
              >
                <div>
                  {/* Top Bar: Icon + Tag */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-1 rounded-xl bg-teal-50 dark:bg-teal-950/20 group-hover:scale-110 transition-transform duration-300 w-12 h-12 flex items-center justify-center overflow-hidden shrink-0">
                      <img
                        src={imgSrc}
                        alt={pillar.label}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 bg-teal-50/80 dark:bg-teal-950/40 px-2.5 py-1 rounded-full border border-teal-600/10">
                      {pillar.tag}
                    </span>
                  </div>

                  {/* Value */}
                  <p className="font-display text-3xl md:text-4xl font-bold text-teal-700 dark:text-teal-400 mb-2 group-hover:text-teal-800 transition-colors">
                    {pillar.value}
                  </p>

                  {/* Label */}
                  <h3 className="text-base font-bold text-foreground mb-3 leading-snug">
                    {pillar.label}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-border/20">
                  <div className="w-full h-1 bg-teal-500/10 rounded-full overflow-hidden">
                    <div className="w-2/3 h-full bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full group-hover:w-full transition-all duration-500" />
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

export default ImpactOutcomes;
