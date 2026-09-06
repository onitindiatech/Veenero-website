import React from "react";
import { Eye, TrendingUp, ShieldCheck, Leaf } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { SolutionsContent } from "@/content/solutions";
import ecosystemIllustration from "@/assets/about/about-infrastructure-sensor.webp";

interface SolutionsEcosystemIntroProps {
  data?: any;
}

const defaultCapabilityBadges = [
  { icon: Eye, label: "Real-time Visibility" },
  { icon: ShieldCheck, label: "Data-backed Decisions" },
  { icon: TrendingUp, label: "Operational Efficiency" },
  { icon: Leaf, label: "Verifiable Outcomes" },
];

export const SolutionsEcosystemIntro: React.FC<SolutionsEcosystemIntroProps> = ({ data }) => {
  useScrollReveal([]);

  const badges = data?.badges && data.badges.length > 0
    ? data.badges.map((b: any, i: number) => ({
        icon: defaultCapabilityBadges[i % defaultCapabilityBadges.length]?.icon || Eye,
        label: b.label || b,
      }))
    : defaultCapabilityBadges;

  const illustrationImg = data?.image || ecosystemIllustration;
  const p1 = data?.paragraphs?.[0] ||
    "Veenero unifies sensors, connectivity, and intelligence to deliver real-time visibility, drive operational efficiency, ensure accountability, and verify outcomes across the entire water lifecycle.";
  const p2 = data?.paragraphs?.[1] ||
    "Whether deployed across industrial campuses, municipal networks, or commercial real estate, our modular architecture adapts to any operational environment — without replacing existing SCADA or ERP systems.";

  return (
    <section
      id="solutions-ecosystem"
      className="relative z-20 pt-8 pb-6 sm:pt-10 sm:pb-8 lg:pt-11 lg:pb-10 bg-[#edf6f5] dark:bg-[#031d22]"
    >
      <div className="container mx-auto px-6 md:px-12 max-w-7xl">

        {/* Editorial Layout: Text LEFT + Illustration RIGHT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-8 sm:mb-10">

          {/* Left: Eyebrow, H2, Supporting Paragraphs */}
          <div className="lg:col-span-6 text-left font-sans space-y-5 reveal-on-scroll">
            <div>
              <span className="text-teal-700 dark:text-teal-400 font-bold uppercase tracking-widest text-xs font-mono block mb-1.5">
                {data?.eyebrow || "OUR SOLUTIONS"}
              </span>
              <div className="w-10 h-0.5 bg-teal-600 rounded-full mb-4" />
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.6rem] font-bold text-slate-900 dark:text-white leading-[1.2] tracking-tight">
              {data?.title || "From Water Data"}{" "}
              <span className="text-teal-700 dark:text-teal-400">
                {data?.highlightedText || "to Measurable Action"}
              </span>
            </h2>
            <div className="space-y-4 text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>{p1}</p>
              <p className="text-slate-500 dark:text-slate-400">{p2}</p>
            </div>
          </div>

          {/* Right: Isometric Ecosystem Illustration */}
          <div className="lg:col-span-6 reveal-on-scroll reveal-delay-200">
            <div className="group relative rounded-2xl overflow-hidden shadow-sm border border-[#dce9e6] dark:border-teal-900/40">
              <img
                src={illustrationImg}
                alt="Veenero Water Intelligence Ecosystem — integrated sensor, analytics, and verification infrastructure"
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                loading="lazy"
              />
              {/* Subtle teal gradient overlay on bottom */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#e3f2ef]/40 dark:from-[#042127]/60 to-transparent pointer-events-none" />
              {/* Corner label */}
              <div className="absolute top-4 left-4">
                <div className="inline-flex items-center gap-1.5 bg-white/90 dark:bg-slate-950/70 backdrop-blur-md border border-teal-500/30 rounded-lg px-2.5 py-1 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-teal-700 dark:text-teal-300 font-mono tracking-wider">
                    LIVE ECOSYSTEM
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Capability Badges in a Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 reveal-on-scroll reveal-delay-100">
          {badges.map((cap: any, i: number) => {
            const Icon = cap.icon;
            return (
              <div
                key={cap.label || i}
                className="flex items-center gap-3 bg-white dark:bg-[#062429] rounded-2xl px-4 py-3.5 sm:px-5 sm:py-4 border border-[#dce9e6] dark:border-teal-900/40 shadow-xs hover:shadow-md hover:-translate-y-0.5 hover:border-teal-500/40 transition-all duration-300 font-sans"
              >
                <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-500/25 flex items-center justify-center shrink-0">
                  <Icon className="w-4.5 h-4.5 text-teal-600 dark:text-teal-400" strokeWidth={1.8} />
                </div>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">
                  {cap.label}
                </span>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default SolutionsEcosystemIntro;
