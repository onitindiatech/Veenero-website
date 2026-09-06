import React, { useState, useRef } from "react";
import { techCapabilitiesContent } from "@/content/home/techCapabilities";
import { ArrowRight } from "lucide-react";
import { WATER_INTELLIGENCE_ICON_MAP, RuggedEdgeTelemetryIcon } from "./WaterCapabilitiesIcons";

// The 5 core architecture stages communicated by the ecosystem
const ARCHITECTURE_FLOW = [
  { id: "all", label: "All Capabilities", tier: "00", query: "" },
  { id: "edge", label: "Edge Infrastructure", tier: "01", query: "edge" },
  { id: "visibility", label: "Water Visibility", tier: "02", query: "visibility" },
  { id: "assurance", label: "Data Assurance", tier: "03", query: "assurance" },
  { id: "governance", label: "Operational Governance", tier: "04", query: "governance" },
  { id: "intelligence", label: "Actionable Intelligence", tier: "05", query: "intelligence" },
];

export const TechCapabilitiesTrack: React.FC = () => {
  const { eyebrow, title, description, items } = techCapabilitiesContent;
  const [activeTier, setActiveTier] = useState<string>("all");
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Filter items if a specific architectural layer is selected
  const filteredItems = activeTier === "all"
    ? items
    : items.filter((item) => {
        const cat = item.category.toLowerCase();
        const tier = ARCHITECTURE_FLOW.find((t) => t.id === activeTier);
        if (!tier || !tier.query) return true;
        if (tier.id === "intelligence") {
          return cat.includes("intelligence") || cat.includes("machine learning") || cat.includes("performance");
        }
        if (tier.id === "governance") {
          return cat.includes("governance") || cat.includes("accountability") || cat.includes("resilience");
        }
        if (tier.id === "edge") {
          return cat.includes("edge") || cat.includes("ecosystem");
        }
        return cat.includes(tier.query);
      });

  // Duplicate items for continuous horizontal stream when in "all" view
  const streamItems = activeTier === "all" ? [...items, ...items] : filteredItems;

  const handleManualScroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const amount = direction === "left" ? -340 : 340;
    scrollContainerRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section className="py-14 md:py-20 bg-[#FCFDFD] dark:bg-background relative overflow-hidden border-b border-border/10 select-none">
      {/* Subtle ambient lighting accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-teal-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="container mx-auto px-6 md:px-12 max-w-7xl">
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12 font-sans reveal-on-scroll">
          {eyebrow && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/25 mb-4 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 inline-block" />
              <span className="text-teal-700 dark:text-teal-300 font-bold uppercase tracking-widest text-[10px] md:text-xs">
                {eyebrow}
              </span>
            </div>
          )}
          <h2 className="font-display text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-foreground leading-[1.15] mb-4">
            {title}
          </h2>
          {description && (
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </div>

        {/* ARCHITECTURAL DATA FLOW PIPELINE STRIP */}
        <div className="mb-10 max-w-5xl mx-auto reveal-on-scroll reveal-delay-100">
          <div className="hidden lg:flex items-center justify-between p-2 rounded-2xl bg-card border border-border/70 shadow-xs">

            {ARCHITECTURE_FLOW.slice(1).map((stage, idx) => {
              const isSelected = activeTier === stage.id;
              return (
                <React.Fragment key={stage.id}>
                  <button
                    onClick={() => setActiveTier(activeTier === stage.id ? "all" : stage.id)}
                    className={`flex-1 flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-left transition-all duration-200 group ${
                      isSelected
                        ? "bg-teal-500/15 border border-teal-500/30 text-teal-900 dark:text-teal-200 shadow-xs"
                        : "hover:bg-muted/60 text-muted-foreground hover:text-foreground border border-transparent"
                    }`}
                  >
                    <span
                      className={`font-mono text-[11px] font-bold px-1.5 py-0.5 rounded-md ${
                        isSelected
                          ? "bg-teal-600 text-white dark:bg-teal-400 dark:text-slate-950"
                          : "bg-muted text-muted-foreground group-hover:bg-teal-500/10 group-hover:text-teal-700 dark:group-hover:text-teal-300"
                      }`}
                    >
                      {stage.tier}
                    </span>
                    <span className="text-xs font-semibold whitespace-nowrap truncate">
                      {stage.label}
                    </span>
                  </button>

                  {idx < ARCHITECTURE_FLOW.slice(1).length - 1 && (
                    <ArrowRight className="w-3.5 h-3.5 text-border/80 shrink-0 mx-1" />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Mobile/Tablet Architecture Pills Scrollable Strip */}
          <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {ARCHITECTURE_FLOW.map((stage) => {
              const isSelected = activeTier === stage.id;
              return (
                <button
                  key={stage.id}
                  onClick={() => setActiveTier(stage.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                    isSelected
                      ? "bg-teal-600 text-white shadow-xs"
                      : "bg-card border border-border/70 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="font-mono text-[10px] opacity-75">{stage.tier}</span>
                  <span>{stage.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* HORIZONTAL CAPABILITY STREAM WITH CONTROLLED MOTION */}
      <div className="relative w-full overflow-hidden group reveal-fade reveal-delay-200">
        {/* Left and Right Edge Gradient Fades for desktop */}
        <div className="hidden sm:block absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-[#FCFDFD] dark:from-background to-transparent z-10 pointer-events-none" />
        <div className="hidden sm:block absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-[#FCFDFD] dark:from-background to-transparent z-10 pointer-events-none" />

        {/* Cards Container */}
        {activeTier === "all" ? (
          /* Marquee Continuous Flow for All Capabilities */
          <div
            ref={scrollContainerRef}
            className={`flex gap-5 w-max py-3 px-6 ${
              isPaused ? "" : "animate-scroll-ltr"
            } hover:[animation-play-state:paused]`}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {streamItems.map((item, idx) => {
              const IconComponent =
                WATER_INTELLIGENCE_ICON_MAP[item.id] ||
                WATER_INTELLIGENCE_ICON_MAP[item.iconName] ||
                RuggedEdgeTelemetryIcon;
              return (
                <div
                  key={`${item.id}-${idx}`}
                  className="w-[280px] sm:w-[310px] bg-card border border-border/70 hover:border-teal-500/50 rounded-2xl p-5 shadow-xs hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between shrink-0 font-sans group/card cursor-default"
                >
                  <div>
                    {/* Top Row: Category + Badge */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 truncate">
                        {item.category}
                      </span>
                      {item.badge && (
                        <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded bg-muted/60 text-muted-foreground border border-border/50 shrink-0">
                          {item.badge}
                        </span>
                      )}
                    </div>

                    {/* Middle Row: Icon Badge + Title */}
                    <div className="flex items-center gap-3.5 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20 flex items-center justify-center shrink-0 group-hover/card:scale-105 group-hover/card:border-teal-500/40 transition-all shadow-2xs">
                        <IconComponent className="w-5 h-5 stroke-[2]" />
                      </div>
                      <h3 className="font-display text-sm sm:text-[15px] font-bold text-foreground leading-snug group-hover/card:text-teal-700 dark:group-hover/card:text-teal-300 transition-colors">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  {/* Bottom Micro-Detail Telemetry Indicator */}
                  <div className="pt-3 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                      <span className="font-mono text-[10px] tracking-tight">Telemetry Ready</span>
                    </span>
                    <span className="font-mono text-[10px] text-teal-600 dark:text-teal-400 font-semibold opacity-0 group-hover/card:opacity-100 transition-opacity">
                      Active
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Structured Grid when an Architectural Layer is Selected */
          <div className="container mx-auto px-6 md:px-12 max-w-7xl py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredItems.map((item) => {
                const IconComponent =
                  WATER_INTELLIGENCE_ICON_MAP[item.id] ||
                  WATER_INTELLIGENCE_ICON_MAP[item.iconName] ||
                  RuggedEdgeTelemetryIcon;
                return (
                  <div
                    key={item.id}
                    className="bg-card border border-teal-500/30 rounded-2xl p-5 shadow-xs hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between font-sans group/card"
                  >
                    <div>
                      {/* Top Row: Category + Badge */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 truncate">
                          {item.category}
                        </span>
                        {item.badge && (
                          <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded bg-teal-500/10 text-teal-800 dark:text-teal-300 border border-teal-500/20 shrink-0">
                            {item.badge}
                          </span>
                        )}
                      </div>

                      {/* Middle Row: Icon Badge + Title */}
                      <div className="flex items-center gap-3.5 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20 flex items-center justify-center shrink-0 group-hover/card:scale-105 transition-all shadow-2xs">
                          <IconComponent className="w-5 h-5 stroke-[2]" />
                        </div>
                        <h3 className="font-display text-sm sm:text-[15px] font-bold text-foreground leading-snug group-hover/card:text-teal-700 dark:group-hover/card:text-teal-300 transition-colors">
                          {item.title}
                        </h3>
                      </div>
                    </div>

                    {/* Bottom Micro-Detail Telemetry Indicator */}
                    <div className="pt-3 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                        <span className="font-mono text-[10px] tracking-tight">Telemetry Ready</span>
                      </span>
                      <span className="font-mono text-[10px] text-teal-600 dark:text-teal-400 font-semibold">
                        Verified
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reset to All Capabilities button */}
            <div className="text-center mt-6">
              <button
                onClick={() => setActiveTier("all")}
                className="inline-flex items-center gap-2 text-xs font-semibold text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 underline underline-offset-4 transition-colors"
              >
                <span>View all ecosystem capabilities in continuous flow</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TechCapabilitiesTrack;
