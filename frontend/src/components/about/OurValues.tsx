import React from "react";
import { AboutContent } from "@/content/about";
import { Cpu, Eye, ShieldCheck, Activity, Leaf, Users, CheckCircle } from "lucide-react";

interface OurValuesProps {
  data: AboutContent["values"];
}

const iconMap: Record<string, React.ElementType> = {
  Cpu,
  Eye,
  ShieldCheck,
  Activity,
  Leaf,
  Users,
};

export const OurValues: React.FC<OurValuesProps> = ({ data }) => {
  return (
    <section id="core-values" className="py-12 md:py-16 bg-transparent relative border-b border-border/10">
      <div className="container mx-auto px-6 md:px-12 max-w-7xl space-y-12">
        
        {/* Section Header */}
        <div className="text-left font-sans">
          {data.eyebrow && (
            <span className="text-teal-600 dark:text-teal-400 font-bold uppercase tracking-widest text-[10px] md:text-xs block mb-3">
              {data.eyebrow}
            </span>
          )}
          <h2 className="font-display text-3xl md:text-[2.5rem] font-bold text-foreground mb-3">
            {data.title}
          </h2>
          {data.description && (
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl leading-relaxed">
              {data.description}
            </p>
          )}
        </div>

        {/* 4 Pillar Value Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.list.map((value, idx) => {
            const IconComponent = iconMap[value.icon] || CheckCircle;
            return (
              <div
                key={idx}
                className="group bg-card p-8 rounded-2xl border border-border/40 hover:border-teal-600/30 shadow-sm hover:shadow-soft hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-start font-sans h-full"
              >
                {/* Circular Icon Wrapper */}
                <div className="p-4 rounded-full bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="h-6 w-6 stroke-[2]" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-foreground mb-3 leading-snug group-hover:text-teal-700 transition-colors">
                  {value.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default OurValues;
