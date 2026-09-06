import React from "react";
import { ArrowRight, Check, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import featuredImage from "@/assets/about/about-vision-water-infrastructure.webp";

interface FeaturedSolutionProps {
  data?: any;
}

const defaultCapabilityItems = [
  { icon: Check, title: "Real-time Monitoring", desc: "Live flow, pressure, quality, and telemetry." },
  { icon: Check, title: "Intelligent Alerts", desc: "AI-powered anomaly detection across networks." },
  { icon: Check, title: "Unified Dashboards", desc: "All your water data in one place." },
  { icon: Check, title: "Audit-Ready Reports", desc: "Automated, export-ready reports and insights." },
];

export const FeaturedSolution: React.FC<FeaturedSolutionProps> = ({ data }) => {
  useScrollReveal([]);

  const capabilities = data?.capabilities && data.capabilities.length > 0
    ? data.capabilities.map((c: any) => ({
        icon: Check,
        title: c.title,
        desc: c.desc,
      }))
    : defaultCapabilityItems;

  const featImage = data?.image || featuredImage;

  return (
    <section
      id="featured-solution"
      className="relative py-14 sm:py-16 lg:py-20 bg-[#edf6f5] dark:bg-[#031d22] border-t border-[#dce9e6] dark:border-teal-900/30 select-none"
    >
      <div className="container mx-auto px-6 md:px-12 max-w-7xl">

        {/* Section Eyebrow */}
        <div className="text-left font-sans mb-8 reveal-on-scroll">
          <span className="text-teal-700 dark:text-teal-400 font-bold uppercase tracking-widest text-xs font-mono block mb-1.5">
            {data?.eyebrow || "FEATURED SOLUTION"}
          </span>
          <div className="w-10 h-0.5 bg-teal-600 rounded-full" />
        </div>

        {/* 50/50 Layout — Large LEFT Media + RIGHT Content with Capability Badges */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch bg-white dark:bg-[#070f12] rounded-3xl border border-[#dce9e6] dark:border-teal-900/40 shadow-sm overflow-hidden p-0 sm:p-0">

          {/* LEFT: Large image/video area with Play overlay */}
          <div className="lg:col-span-6 relative group reveal-on-scroll">
            <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full w-full overflow-hidden bg-slate-200 dark:bg-slate-800">
              <img
                src={featImage}
                alt="Real-time Water Visibility Platform — water treatment facility monitoring station"
                className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                loading="lazy"
              />
              {/* Strong dark gradient overlay to make data/badge readable */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-slate-950/10 pointer-events-none" />

              {/* Play Button Overlay */}
              <button
                type="button"
                aria-label="Play platform overview"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/90 backdrop-blur-md text-teal-700 flex items-center justify-center shadow-2xl hover:bg-white hover:scale-105 transition-all duration-200 ring-4 ring-white/20"
              >
                <Play className="w-5 h-5 sm:w-6 sm:h-6 ml-0.5 fill-current" />
              </button>

              {/* Bottom: FEATURED SOLUTION label bar */}
              <div className="absolute bottom-5 left-5">
                <div className="inline-flex items-center gap-2 bg-slate-950/80 backdrop-blur-md border border-teal-400/30 rounded-xl px-3.5 py-2 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-white text-[11px] font-bold font-sans tracking-wide">
                    {data?.eyebrow || "FEATURED SOLUTION"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Content + 4 capability badges in 2x2 grid */}
          <div className="lg:col-span-6 flex flex-col justify-center font-sans text-left p-6 sm:p-8 lg:p-10 space-y-6 reveal-on-scroll reveal-delay-200">
            <div>
              <span className="text-teal-700 dark:text-teal-400 font-bold uppercase tracking-widest text-[11px] font-mono block mb-1.5">
                {data?.subtitle || "WATER VISIBILITY PLATFORM"}
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white leading-tight tracking-tight">
                {data?.title || "Real-time Water"}{" "}
                <span className="text-teal-700 dark:text-teal-400">
                  {data?.highlightedText || "Visibility Platform"}
                </span>
              </h2>
            </div>

            <p className="text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">
              {data?.description ||
                "A comprehensive platform that provides end-to-end visibility of your water infrastructure with real-time data, alerts, and intelligent dashboards."}
            </p>

            {/* 4 Capability Badges in 2x2 Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {capabilities.map((cap: any) => {
                const Icon = cap.icon || Check;
                return (
                  <div
                    key={cap.title}
                    className="flex items-start gap-2.5 bg-[#f5fafa] dark:bg-[#031d22] rounded-xl px-3.5 py-3 border border-[#dce9e6] dark:border-teal-900/30"
                  >
                    <div className="w-5 h-5 rounded-lg bg-teal-500/15 border border-teal-500/25 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-3 h-3 text-teal-600 dark:text-teal-400" strokeWidth={2.2} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-[13px] font-bold text-slate-900 dark:text-slate-100 leading-tight">
                        {cap.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5">
                        {cap.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <Link
              to={data?.ctaLink || "/solutions/water-visibility"}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold shadow-soft hover:shadow-glow hover:-translate-y-0.5 transition-all duration-200 text-sm group w-fit mt-1"
            >
              <span>{data?.ctaText || "Explore Solution"}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FeaturedSolution;
