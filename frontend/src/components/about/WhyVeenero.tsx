import React from "react";
import { AboutContent } from "@/content/about";
import { getWaterPhotograph } from "@/utils/waterImages";
import { techPulse, dataSensor } from "@/assets/animations";

interface WhyVeeneroProps {
  data: AboutContent["whyVeenero"];
}

export const WhyVeenero: React.FC<WhyVeeneroProps> = ({ data }) => {
  return (
    <section id="why-choose-veenero" className="py-12 md:py-16 bg-transparent relative border-b border-border/10">
      {/* Background Water Light Effect */}
      <div className="absolute bottom-10 left-1/3 w-72 h-72 bg-teal-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

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

        {/* 2x2 Differentiator Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.list.map((item, idx) => {
            const imgSrc = getWaterPhotograph((item as any).iconImage || (item as any).imageUrl, item.title, idx);
            const animAsset = idx % 2 === 0 ? techPulse : dataSensor;
            return (
              <div
                key={idx}
                className="group bg-card p-8 rounded-2xl border border-border/40 hover:border-teal-600/30 shadow-sm hover:shadow-soft hover:-translate-y-1 transition-all duration-300 flex items-start gap-6 font-sans"
              >
                {/* Icon Badge */}
                <div className="p-1 rounded-xl bg-teal-50 dark:bg-teal-950/20 shrink-0 group-hover:scale-110 transition-transform duration-300 w-12 h-12 flex items-center justify-center overflow-hidden relative">
                  <img
                    src={imgSrc}
                    alt={item.title}
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-screen">
                    <img src={animAsset} alt="" className="w-full h-full object-cover" />
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-foreground leading-snug group-hover:text-teal-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {item.description}
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

export default WhyVeenero;
