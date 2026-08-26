import React from "react";
import { ImpactContent } from "@/content/impact";
import { CheckCircle2, Quote } from "lucide-react";
import { getWaterPhotograph } from "@/utils/waterImages";

interface EcosystemImpactProps {
  data: ImpactContent["ecosystem"];
}

export const EcosystemImpact: React.FC<EcosystemImpactProps> = ({ data }) => {
  return (
    <section id="ecosystem-impact" className="py-12 md:py-16 bg-transparent relative border-b border-border/10">
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

        {/* 4 Ecosystem Domain Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.domains.map((domain, idx) => {
            const imgSrc = getWaterPhotograph((domain as any).iconImage || (domain as any).imageUrl, domain.title, idx);
            return (
              <div
                key={idx}
                className="group bg-card p-6 md:p-8 rounded-2xl border border-border/40 hover:border-teal-600/30 shadow-sm hover:shadow-soft hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between font-sans h-full"
              >
                <div>
                  {/* Icon Wrapper */}
                  <div className="p-1 rounded-full bg-teal-50 dark:bg-teal-950/20 mb-6 w-14 h-14 group-hover:scale-110 transition-transform duration-300 overflow-hidden flex items-center justify-center shrink-0">
                    <img
                      src={imgSrc}
                      alt={domain.title}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-foreground mb-3 leading-snug group-hover:text-teal-700 transition-colors">
                    {domain.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6">
                    {domain.description}
                  </p>
                </div>

                {/* Impact Points */}
                <div className="pt-4 border-t border-border/20 space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                    Key Outcomes
                  </p>
                  <div className="space-y-1.5">
                    {domain.impactPoints.map((point, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-1.5 text-xs text-foreground/80">
                        <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 shrink-0 mt-0.5" />
                        <span className="leading-tight">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stakeholder Perspective Callout Card */}
        {data.quote && (
          <div className="bg-card p-8 md:p-10 rounded-2xl border border-border/40 shadow-soft relative overflow-hidden font-sans">
            <div className="flex flex-col md:flex-row items-start gap-6 relative z-10">
              <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 shrink-0">
                <Quote className="h-8 w-8" />
              </div>
              <div className="space-y-4">
                <p className="font-display text-lg md:text-xl font-medium text-foreground italic leading-relaxed">
                  "{data.quote.text}"
                </p>
                <div>
                  <p className="text-sm font-bold text-foreground">{data.quote.author}</p>
                  <p className="text-xs text-teal-700 dark:text-teal-400 font-medium">
                    {data.quote.role} • {data.quote.organization}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default EcosystemImpact;
