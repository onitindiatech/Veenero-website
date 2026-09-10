import React, { useState, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { getPublicHome, HomeApproach } from "@/services/home.service";

interface StageData {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  points: string[];
}

const STAGES: StageData[] = [
  {
    id: "sense",
    number: "01",
    title: "Sense",
    subtitle: "Measure Every Litre",
    description:
      "Onboard your water data sources to build Water Visibility—so usage is measurable across sites, assets, and operations.",
    points: [
      "Data capture mapping",
      "Baseline measurement",
      "Integrity & validation checks",
    ],
  },
  {
    id: "intelligence",
    number: "02",
    title: "Intelligence",
    subtitle: "Monitor & Benchmark",
    description:
      "Use real-time analytics to track performance, compare across peers, and surface Water Risk early.",
    points: [
      "Real-time monitoring",
      "Benchmarking & comparison",
      "Risk identification",
    ],
  },
  {
    id: "optimize",
    number: "03",
    title: "Optimize",
    subtitle: "Actionable Insights",
    description:
      "Turn insights into prioritized actions that reduce waste and improve efficiency.",
    points: [
      "Insight generation",
      "Action prioritization",
      "Efficiency improvement",
    ],
  },
  {
    id: "innovate",
    number: "04",
    title: "Innovate",
    subtitle: "Long-term Sustainability",
    description:
      "Continuously evolve strategies and technologies to build a resilient and water-positive future.",
    points: [
      "Sustainable strategies",
      "Technology innovation",
      "Continuous improvement",
    ],
  },
];

export const Approach: React.FC = () => {
  const [approach, setApproach] = useState<HomeApproach | null>(null);

  useEffect(() => {
    let cancelled = false;
    getPublicHome()
      .then((data) => {
        if (!cancelled && data?.approach) {
          setApproach(data.approach);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (approach?.visible === false) return null;

  const displayStages: StageData[] = (approach?.steps && approach.steps.length > 0)
    ? approach.steps.map((s, i) => ({
        id: `step-${i}`,
        number: s.number || `0${i + 1}`,
        title: s.title || STAGES[i % STAGES.length]?.title || "",
        subtitle: (s as any).subtitle || STAGES[i % STAGES.length]?.subtitle || "",
        description: s.description || STAGES[i % STAGES.length]?.description || "",
        points: s.points && s.points.length > 0 ? s.points : (STAGES[i % STAGES.length]?.points || []),
      }))
    : STAGES;

  const eyebrow = approach?.eyebrow || "OUR APPROACH";
  const title = approach?.title || "A Proven Path to\nWater Sustainability";
  const description =
    approach?.description ||
    "Our methodical four-step process transforms water data into actionable insights, driving measurable impact and long-term sustainability.";

  return (
    <section
      id="approach"
      className="py-16 md:py-24 bg-[#FCFDFD] dark:bg-background relative border-b border-border/10 overflow-hidden select-none"
    >
      <div className="container mx-auto px-6 md:px-12 max-w-[1400px] relative z-10">
        {/* SECTION HEADER */}
        <div className="max-w-3xl mx-auto text-center mb-14 lg:mb-16 reveal-on-scroll">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/25 mb-4 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 inline-block" />
            <span className="text-teal-700 dark:text-teal-300 font-bold uppercase tracking-widest text-[10px] md:text-xs">
              {eyebrow}
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-[1.15] mb-5 whitespace-pre-line">
            {title}
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {/* FOUR-STAGE PROCESS TIMELINE */}
        <div className="relative max-w-7xl mx-auto">
          {/* Subtle horizontal connecting line on desktop across stage nodes */}
          <div
            className="hidden lg:block absolute top-[28px] left-[12%] right-[12%] h-[1.5px] bg-gradient-to-r from-teal-500/20 via-teal-500/40 to-teal-500/20 -z-0 pointer-events-none"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8 relative z-10">
            {displayStages.map((stage, idx) => {
              const staggerDelay = idx === 0 ? "reveal-delay-100" : idx === 1 ? "reveal-delay-200" : idx === 2 ? "reveal-delay-300" : "reveal-delay-400";
              return (
                <div key={stage.id} className={`group relative flex flex-col reveal-on-scroll ${staggerDelay}`}>

                {/* Step Indicator Node (Desktop) */}
                <div className="hidden lg:flex items-center justify-center mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-card border border-border/80 group-hover:border-teal-500/50 group-hover:shadow-glow flex items-center justify-center transition-all duration-300 shadow-xs relative">
                    <span className="font-mono text-sm font-bold text-teal-700 dark:text-teal-300">
                      {stage.number}
                    </span>
                    {/* Small step indicator dot on connector */}
                    <div className="w-2 h-2 rounded-full bg-teal-500/30 group-hover:bg-teal-500 transition-colors absolute -bottom-1" />
                  </div>
                </div>

                {/* Process Card */}
                <div className="flex-1 bg-card border border-border/60 rounded-2xl p-6 xl:p-7 shadow-xs hover:border-teal-500/40 hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between font-sans">
                  <div>
                    {/* Card Header with Stage Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-teal-500/10 text-teal-700 dark:text-teal-300 text-[11px] font-mono font-bold border border-teal-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                        STAGE {stage.number}
                      </span>
                      {/* Subtle large ghost number */}
                      <span className="text-2xl font-display font-bold text-foreground/10 select-none">
                        {stage.number}
                      </span>
                    </div>

                    {/* Stage Title & Subtitle */}
                    <h3 className="font-display text-xl font-bold text-foreground mb-1 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
                      {stage.title}
                    </h3>
                    <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-3">
                      {stage.subtitle}
                    </p>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                      {stage.description}
                    </p>
                  </div>

                  {/* Checklist Points */}
                  <div className="border-t border-border/50 pt-4 mt-auto">
                    <ul className="text-xs text-muted-foreground space-y-2">
                      {stage.points.map((p, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                          <span className="leading-snug">{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Subtle bottom detail accent line */}
                  <div className="w-8 h-0.5 bg-transparent group-hover:bg-teal-500/50 rounded-full mt-4 transition-all duration-300" />
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

export default Approach;
