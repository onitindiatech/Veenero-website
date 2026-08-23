import React, { useState } from "react";
import { SolutionsContent } from "@/content/solutions";
import { Cpu, Activity, BarChart3, ShieldCheck, CheckCircle2, ChevronRight } from "lucide-react";

interface PlatformArchitectureProps {
  data: SolutionsContent["architecture"];
}

const layerIcons: Record<string, React.ElementType> = {
  Cpu,
  Activity,
  BarChart3,
  ShieldCheck,
};

export const PlatformArchitecture: React.FC<PlatformArchitectureProps> = ({ data }) => {
  const [activeLayer, setActiveLayer] = useState<number>(0);

  return (
    <section id="platform-architecture" className="py-12 md:py-16 bg-transparent relative border-b border-border/10">
      {/* Background Water/Data-Stream Caustic Glow */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

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

        {/* Interactive Architecture Flow Strip & Cards */}
        <div className="space-y-8">
          
          {/* Layer Indicator Tabs for Fast Scanning */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {data.layers.map((layer, idx) => {
              const Icon = layerIcons[layer.icon] || Cpu;
              const isActive = activeLayer === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveLayer(idx)}
                  className={`p-4 rounded-xl border text-left font-sans transition-all duration-200 flex items-center justify-between group ${
                    isActive
                      ? "bg-teal-50/80 dark:bg-teal-950/40 border-teal-600/40 shadow-sm"
                      : "bg-card border-border/40 hover:border-teal-600/20 hover:bg-muted/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        isActive
                          ? "bg-teal-600 text-white"
                          : "bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-wider text-teal-600 dark:text-teal-400">
                        Layer {layer.number}
                      </p>
                      <p className="text-xs font-bold text-foreground line-clamp-1">{layer.title}</p>
                    </div>
                  </div>
                  <ChevronRight
                    className={`h-4 w-4 transition-transform ${
                      isActive ? "text-teal-600 translate-x-1" : "text-muted-foreground/40 group-hover:text-foreground"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Active Layer Deep Dive Card */}
          <div className="bg-card p-8 md:p-10 rounded-2xl border border-border/40 shadow-soft relative overflow-hidden font-sans">
            {/* Ambient Data-Stream Pulse Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-cyan-400 to-teal-600" />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Number, Title, Subtitle, Description */}
              <div className="lg:col-span-6 space-y-4 text-left">
                <div className="flex items-center gap-3">
                  <span className="font-display text-4xl font-bold text-teal-600/40 dark:text-teal-400/30">
                    {data.layers[activeLayer].number}
                  </span>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                      {data.layers[activeLayer].subtitle}
                    </span>
                    <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                      {data.layers[activeLayer].title}
                    </h3>
                  </div>
                </div>

                <p className="text-sm md:text-base text-muted-foreground leading-relaxed pt-2">
                  {data.layers[activeLayer].description}
                </p>
              </div>

              {/* Right Column: Capabilities & Validation Checklist */}
              <div className="lg:col-span-6 bg-[#F8FAFB] dark:bg-card/60 p-6 rounded-xl border border-border/30 space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">
                  Key Technical Capabilities
                </p>
                <div className="space-y-2.5">
                  {data.layers[activeLayer].capabilities.map((cap, cIdx) => (
                    <div key={cIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground/90">
                      <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
                      <span>{cap}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* 4 Connected Flow Columns (Desktop & Mobile Overview) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
            {data.layers.map((layer, idx) => {
              const Icon = layerIcons[layer.icon] || Cpu;
              return (
                <div
                  key={idx}
                  className="group bg-card p-6 rounded-2xl border border-border/40 hover:border-teal-600/30 shadow-sm hover:shadow-soft hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between font-sans h-full relative"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="h-5 w-5 stroke-[2]" />
                      </div>
                      <span className="font-display text-xl font-bold text-muted-foreground/30">
                        {layer.number}
                      </span>
                    </div>

                    <h4 className="font-bold text-base text-foreground mb-1 group-hover:text-teal-700 transition-colors">
                      {layer.title}
                    </h4>
                    <p className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold mb-3">
                      {layer.subtitle}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {layer.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-border/20">
                    <span className="text-[11px] text-teal-700 dark:text-teal-400 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                      Layer specs
                      <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};

export default PlatformArchitecture;
