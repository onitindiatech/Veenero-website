import React from "react";
import {
  Cpu,
  Radio,
  ShieldCheck,
  Sparkles,
  LineChart,
  FileCheck2,
  Network,
  BarChart3,
  ShieldAlert,
  Layers,
  CheckCircle,
} from "lucide-react";
import { techCapabilitiesContent } from "@/content/home/techCapabilities";

const iconMap: Record<string, React.ElementType> = {
  Cpu,
  Radio,
  ShieldCheck,
  Sparkles,
  LineChart,
  FileCheck2,
  Network,
  BarChart3,
  ShieldAlert,
  Layers,
};

export const TechCapabilitiesTrack: React.FC = () => {
  const { eyebrow, title, description, items } = techCapabilitiesContent;

  // Double-buffered list for seamless left-to-right looping
  const duplicatedItems = [...items, ...items];

  return (
    <section className="pt-8 pb-10 md:pt-10 md:pb-12 bg-gradient-to-b from-background via-muted/20 to-background relative overflow-hidden border-b border-border/10">
      {/* Background Water Light Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-teal-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="container mx-auto px-6 md:px-12 max-w-7xl mb-6">
        <div className="text-center max-w-2xl mx-auto space-y-2 font-sans">
          {eyebrow && (
            <span className="text-teal-600 dark:text-teal-400 font-bold uppercase tracking-widest text-[10px] md:text-xs block">
              {eyebrow}
            </span>
          )}
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
            {title}
          </h2>
          {description && (
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl mx-auto">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Horizontal Continuous Left-to-Right Moving Track with Gradient Edge Fades */}
      <div className="relative w-full overflow-hidden group">
        {/* Left Edge Gradient Fade */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-background via-background/80 to-transparent z-10 pointer-events-none" />

        {/* Right Edge Gradient Fade */}
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-background via-background/80 to-transparent z-10 pointer-events-none" />

        {/* Seamless Scrolling Track */}
        <div className="flex gap-5 w-max animate-scroll-ltr group-hover:[animation-play-state:paused] py-2 px-4">
          {duplicatedItems.map((item, idx) => {
            const Icon = iconMap[item.iconName] || CheckCircle;
            return (
              <div
                key={`${item.id}-${idx}`}
                className="bg-card hover:bg-card/95 p-4 sm:p-5 rounded-2xl border border-border/40 hover:border-teal-600/30 shadow-sm hover:shadow-soft transition-all duration-300 flex items-center gap-4 min-w-[260px] sm:min-w-[290px] shrink-0 font-sans cursor-default group/card"
              >
                {/* Icon Wrapper */}
                <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/30 text-teal-600 dark:text-teal-400 shrink-0 group-hover/card:scale-110 transition-transform duration-300">
                  <Icon className="h-5 w-5 stroke-[2]" />
                </div>

                {/* Text Content */}
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 truncate">
                      {item.category}
                    </span>
                    {item.badge && (
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 border border-teal-600/10">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-foreground truncate group-hover/card:text-teal-700 transition-colors">
                    {item.title}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TechCapabilitiesTrack;
