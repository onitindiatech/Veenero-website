import React from "react";
import { Leaf } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import philosophyImage from "@/assets/about/about-real-time-analytics.webp";

interface StrategicJourneyRoadmapProps {
  data?: any;
}

export const StrategicJourneyRoadmap: React.FC<StrategicJourneyRoadmapProps> = ({ data }) => {
  useScrollReveal([]);

  const eyebrow = data?.eyebrow || "OUR PHILOSOPHY";
  const title = data?.title || "Visibility. Intelligence.";
  const highlightedText = data?.highlightedText || "Accountability. Impact.";
  const paragraphs = data?.paragraphs && data.paragraphs.length > 0
    ? data.paragraphs
    : [
        "We believe every drop tells a story.",
        "Our approach is built on the belief that with the right data, the right technology, and the right partnerships, we can solve water challenges at scale.",
        "It begins with visibility — knowing exactly what happens across every pipe, pump, tank and process. From there we apply intelligence to surface insights, build accountability through governance, and deliver outcomes that can be independently verified.",
      ];

  const img = data?.image || philosophyImage;
  const badgeText = data?.badgeText || "PLATFORM ECOSYSTEM";

  return (
    <section
      id="approach-philosophy"
      className="relative py-14 sm:py-16 lg:py-20 bg-gradient-wave dark:bg-[#071317] border-b border-slate-200/60 dark:border-teal-900/20 select-none overflow-hidden"
    >
      <div className="container mx-auto px-6 md:px-12 max-w-7xl">

        {/* Editorial Layout — Text LEFT + Ecosystem Visual RIGHT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center mb-10 sm:mb-12">

          {/* LEFT: Eyebrow, H2, Supporting paragraphs */}
          <div className="lg:col-span-6 text-left font-sans space-y-4 reveal-on-scroll">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-600/10 dark:bg-teal-400/10 border border-teal-600/20 dark:border-teal-400/20 backdrop-blur-xs mb-1">
              <Leaf className="w-3 h-3 text-teal-700 dark:text-teal-300" />
              <span className="text-teal-800 dark:text-teal-300 font-bold uppercase tracking-widest text-[10px] sm:text-[11px] font-mono">
                {eyebrow}
              </span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.6rem] font-bold text-slate-900 dark:text-white leading-[1.18] tracking-tight">
              {title}{" "}
              <br className="hidden sm:block" />
              <span className="text-[#136873] dark:text-teal-400">
                {highlightedText}
              </span>
            </h2>

            <div className="space-y-3 text-sm sm:text-[15px] text-slate-600 dark:text-slate-300/90 leading-relaxed">
              {paragraphs.map((para: string, idx: number) => (
                <p key={idx} className={idx === paragraphs.length - 1 ? "text-slate-500 dark:text-slate-400" : ""}>
                  {para}
                </p>
              ))}
            </div>
          </div>

          {/* RIGHT: Ecosystem visual with badge */}
          <div className="lg:col-span-6 reveal-on-scroll reveal-delay-200">
            <div className="group relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs border border-slate-200/80 dark:border-teal-900/40 bg-slate-950">
              <img
                src={img}
                alt="Veenero water intelligence platform ecosystem — sensors, analytics and verification working together"
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                loading="lazy"
              />
              {/* Subtle gradient overlay */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              {/* Top-left status badge */}
              <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md border border-white/20 rounded-full px-3 py-1 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                <span className="text-[10px] font-bold text-teal-300 font-mono tracking-wider">
                  {badgeText}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StrategicJourneyRoadmap;
