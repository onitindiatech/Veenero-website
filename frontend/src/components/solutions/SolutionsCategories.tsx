import React, { useMemo } from "react";
import { ArrowRight, Eye, Cpu, FileCheck2, ShieldCheck, BarChart3, Settings, Users, Leaf } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";

import waterVisibilityImg from "@/assets/about/about-journey-water-infrastructure.webp";
import operationalIntelImg from "@/assets/about/about-industrial-water-system.webp";
import waterAccountImg from "@/assets/about/about-field-verification.webp";
import waterVerifyImg from "@/assets/about/about-vision-water-infrastructure.webp";
import analyticsImg from "@/assets/about/about-real-time-analytics.webp";

interface SolutionsCategoriesProps {
  data?: any;
  categories?: any[];
  solutions?: any[];
  gridHeader?: any;
}

const DEFAULT_CATEGORY_CARDS = [
  {
    key: "Water Visibility",
    displayLabel: "Water Visibility",
    slug: "water-visibility",
    description: "Real-time monitoring of water assets, flow, quality, and infrastructure across locations.",
    icon: Eye,
    image: waterVisibilityImg,
  },
  {
    key: "Water Intelligence",
    displayLabel: "Operational Intelligence",
    slug: "operational-intelligence",
    description: "Streamline operations with automation, anomaly detection, and actionable intelligence.",
    icon: Cpu,
    image: operationalIntelImg,
  },
  {
    key: "Water Optimization",
    displayLabel: "Water Accountability",
    slug: "water-accountability",
    description: "Ensure transparency, compliance, and performance across utilities and operations.",
    icon: ShieldCheck,
    image: waterAccountImg,
  },
  {
    key: "Water Accountability",
    displayLabel: "Water Verification",
    slug: "water-verification",
    description: "Verify water quality, flow, and impact with certified data and audit-ready reports.",
    icon: FileCheck2,
    image: waterVerifyImg,
  },
  {
    key: "Infrastructure Layer",
    displayLabel: "Analytics & Insights",
    slug: "analytics-insights",
    description: "Turn data into decisions with advanced analytics, visualization, and predictive insights.",
    icon: BarChart3,
    image: analyticsImg,
  },
];

const iconMap: Record<string, any> = {
  Eye,
  Cpu,
  ShieldCheck,
  FileCheck2,
  BarChart3,
};

export const SolutionsCategories: React.FC<SolutionsCategoriesProps> = ({
  categories,
  gridHeader,
}) => {
  useScrollReveal([]);

  const categoryCards = useMemo(() => {
    if (categories && categories.length > 0) {
      return categories.map((c: any, i: number) => {
        const fallback = DEFAULT_CATEGORY_CARDS[i % DEFAULT_CATEGORY_CARDS.length];
        return {
          key: c.key || c.displayLabel || fallback.key,
          displayLabel: c.displayLabel || c.key || fallback.displayLabel,
          slug: c.slug || fallback.slug,
          description: c.description || fallback.description,
          icon: iconMap[c.icon] || fallback.icon,
          image: c.image || fallback.image,
        };
      });
    }
    return DEFAULT_CATEGORY_CARDS;
  }, [categories]);

  const headerEyebrow = gridHeader?.eyebrow || "OUR SOLUTION CATEGORIES";
  const headerDesc =
    gridHeader?.description ||
    "From real-time visibility to verified impact, our integrated solutions help utilities, industries, and communities manage water smarter.";

  return (
    <section
      id="solutions-categories"
      className="relative py-14 sm:py-16 lg:py-20 bg-gradient-wave dark:bg-[#071317] select-none overflow-hidden"
    >
      <div className="container mx-auto px-6 md:px-12 max-w-7xl">

        {/* Section Header: Left Title + Right Editorial Description & Script Accent */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-end mb-12 sm:mb-14 reveal-on-scroll">
          
          {/* Left: Eyebrow + H2 Title */}
          <div className="lg:col-span-7 font-sans text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-600/10 dark:bg-teal-400/10 border border-teal-600/20 dark:border-teal-400/20 backdrop-blur-xs mb-3">
              <Leaf className="w-3 h-3 text-teal-700 dark:text-teal-300" />
              <span className="text-teal-800 dark:text-teal-300 font-bold uppercase tracking-widest text-[10px] sm:text-[11px] font-mono">
                {headerEyebrow}
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.6rem] font-bold leading-[1.18] tracking-tight text-slate-900 dark:text-white">
              <span>Modular Solutions for</span>
              <br />
              <span className="text-[#136873] dark:text-teal-400">
                Every Water Challenge
              </span>
            </h2>
          </div>

          {/* Right: Description & Hand-drawn Script Accent */}
          <div className="lg:col-span-5 flex flex-col justify-between items-start lg:items-end text-left lg:text-right font-sans">
            {/* Script Water Accent */}
            <div className="mb-3">
              <span className="inline-block font-serif italic text-teal-700 dark:text-teal-300 text-lg sm:text-xl font-medium tracking-wide opacity-90 transform -rotate-2 select-none">
                Water Intelligence for a Better Tomorrow ~
              </span>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300/90 leading-relaxed max-w-md">
              {headerDesc}
            </p>
          </div>
        </div>

        {/* 5-Column Grid of Premium Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 sm:gap-6 items-stretch">
          {categoryCards.map((card, idx) => {
            const Icon = card.icon;
            const staggerDelay =
              idx === 0
                ? ""
                : idx === 1
                ? "reveal-delay-100"
                : idx === 2
                ? "reveal-delay-200"
                : idx === 3
                ? "reveal-delay-300"
                : "reveal-delay-400";

            return (
              <div
                key={card.key || idx}
                className={`reveal-on-scroll ${staggerDelay} flex flex-col h-full`}
              >
                <Link
                  to={`/solutions/${card.slug}`}
                  className="group relative w-full h-full min-h-[470px] sm:min-h-[490px] rounded-2xl overflow-hidden bg-white dark:bg-[#0c1f26] border border-slate-200/80 dark:border-teal-900/35 hover:border-teal-500/40 dark:hover:border-teal-500/50 shadow-xs hover:shadow-[0_16px_32px_-8px_rgba(19,104,115,0.14),0_4px_12px_rgba(0,0,0,0.04)] dark:hover:shadow-[0_16px_32px_-8px_rgba(0,0,0,0.5),0_0_20px_rgba(20,184,166,0.12)] hover:-translate-y-2 transition-all duration-300 ease-out flex flex-col font-sans focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
                >
                  {/* Top Image Container with Smooth Zoom */}
                  <div className="relative aspect-[16/11] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={card.image}
                      alt={`${card.displayLabel} — Veenero Water Intelligence`}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                      loading="lazy"
                    />
                    {/* Numbered Indicator Badge (01, 02, etc.) */}
                    <span className="absolute top-3 left-3 text-[10.5px] font-mono font-bold px-2 py-0.5 rounded-md bg-white/85 dark:bg-slate-950/80 text-slate-800 dark:text-teal-300 backdrop-blur-xs border border-white/50 dark:border-white/10 shadow-2xs select-none">
                      0{idx + 1}
                    </span>
                    {/* Soft gradient sheen at bottom edge of image */}
                    <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/35 via-black/10 to-transparent pointer-events-none" />
                  </div>

                  {/* Circular Icon Badge Overlapping Image */}
                  <div className="relative -mt-6 ml-5 w-11 h-11 rounded-full bg-teal-600 dark:bg-teal-500 text-white flex items-center justify-center shadow-md border-2 border-white dark:border-[#0c1f26] z-10 group-hover:bg-teal-500 dark:group-hover:bg-teal-400 group-hover:scale-105 hover-ripple-subtle transition-all duration-300">
                    <Icon className="w-5 h-5 text-white" />
                  </div>

                  {/* Card Body — Spacious & Equal Spacing */}
                  <div className="px-5 pt-3 pb-5 flex-1 flex flex-col justify-between text-left">
                    <div className="flex-1">
                      {/* Semantic H2 Solution Card Title with Consistent Height */}
                      <h2 className="font-display text-[19px] sm:text-[20px] font-bold text-slate-900 dark:text-white leading-[1.24] tracking-tight group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors min-h-[3.1rem] flex items-start">
                        {card.displayLabel}
                      </h2>

                      {/* Solution Description with Consistent Baseline */}
                      <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300/90 leading-relaxed mt-2.5">
                        {card.description}
                      </p>
                    </div>

                    {/* Bottom CTA Row — Clean, Generously Spaced, and Clickable */}
                    <div className="mt-6 pt-3.5 pb-1 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs sm:text-[13px] font-semibold text-teal-800 dark:text-teal-300 group-hover:text-teal-600 dark:group-hover:text-teal-200 transition-colors">
                      <span>Explore Solution</span>
                      <div className="w-7 h-7 rounded-full border border-teal-200 dark:border-teal-800/70 bg-teal-50/60 dark:bg-teal-950/40 flex items-center justify-center group-hover:border-teal-500 group-hover:bg-teal-600 dark:group-hover:bg-teal-500 group-hover:text-white transition-all duration-300 shadow-2xs">
                        <ArrowRight className="w-3.5 h-3.5 text-teal-700 dark:text-teal-300 group-hover:text-white arrow-shift group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default SolutionsCategories;
