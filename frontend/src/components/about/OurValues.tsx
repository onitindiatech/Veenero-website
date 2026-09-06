import React from "react";
import { Droplet, ShieldCheck, BarChart3, Zap, Users, Leaf } from "lucide-react";
import { PublicAboutPillars, PublicAboutPillarItem } from "@/services/about.service";

import purposeImg from "@/assets/about/about-pillar-purpose.webp";
import integrityImg from "@/assets/about/about-pillar-integrity.webp";
import impactImg from "@/assets/about/about-pillar-impact.webp";
import innovationImg from "@/assets/about/about-pillar-innovation.webp";
import togetherImg from "@/assets/about/about-pillar-together.webp";

interface OurValuesProps {
  data?: PublicAboutPillars;
}

const fallbackPillarImages = [
  purposeImg,
  integrityImg,
  impactImg,
  innovationImg,
  togetherImg,
];

const pillarIcons = [Droplet, ShieldCheck, BarChart3, Zap, Users];

const defaultValuesList: PublicAboutPillarItem[] = [
  {
    title: "Purpose First",
    description: "We start with why—solving real water challenges.",
    image: purposeImg,
    order: 1,
  },
  {
    title: "Integrity Always",
    description: "We believe in transparency, trust & ethical innovation.",
    image: integrityImg,
    order: 2,
  },
  {
    title: "Impact at Scale",
    description: "We build solutions that create measurable, lasting impact.",
    image: impactImg,
    order: 3,
  },
  {
    title: "Innovation Relentless",
    description: "We constantly push boundaries with technology.",
    image: innovationImg,
    order: 4,
  },
  {
    title: "Stronger Together",
    description: "We grow by empowering communities, partners & each other.",
    image: togetherImg,
    order: 5,
  },
];

export const OurValues: React.FC<OurValuesProps> = ({ data }) => {
  if (data?.visible === false) return null;

  const eyebrow = data?.eyebrow ?? "OUR VALUES";
  const title = data?.title ?? "The Pillars of Veenero";
  const valuesList =
    data?.list && data.list.length > 0 ? data.list : defaultValuesList;

  return (
    <section id="core-values" className="py-14 sm:py-16 lg:py-20 bg-[#f8fafb] dark:bg-[#071317] relative overflow-hidden select-none border-b border-slate-200/60 dark:border-teal-900/20">
      <div className="container mx-auto px-6 md:px-12 max-w-7xl space-y-12">
        
        {/* Centered Header with Leaf Eyebrow & Semantic H2 */}
        <div className="text-center font-sans max-w-2xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-600/10 dark:bg-teal-400/10 border border-teal-600/20 dark:border-teal-400/20 backdrop-blur-xs mb-3">
            <Leaf className="w-3 h-3 text-teal-700 dark:text-teal-300" />
            <span className="text-teal-800 dark:text-teal-300 font-bold uppercase tracking-widest text-[10px] sm:text-[11px] font-mono">
              {eyebrow}
            </span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.6rem] font-bold text-slate-900 dark:text-white mb-3 leading-[1.18] tracking-tight">
            {title}
          </h2>

          {data?.description && (
            <p className="text-sm md:text-base text-slate-600 dark:text-slate-300/90 leading-relaxed mt-1 font-sans">
              {data.description}
            </p>
          )}
        </div>

        {/* 5 Pillars Cards matching Solutions Category Card Aesthetics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 sm:gap-6 items-stretch">
          {valuesList.map((value, idx) => {
            const Icon = pillarIcons[idx % pillarIcons.length];
            const imageSrc =
              value.image || fallbackPillarImages[idx % fallbackPillarImages.length];
            const staggerDelay = idx === 0 ? "" : idx === 1 ? "reveal-delay-100" : idx === 2 ? "reveal-delay-200" : idx === 3 ? "reveal-delay-300" : "reveal-delay-400";

            return (
              <div
                key={value.id || value._id || idx}
                className={`reveal-on-scroll ${staggerDelay} flex flex-col h-full`}
              >
                <div className="group relative w-full h-full min-h-[380px] rounded-2xl overflow-hidden bg-white dark:bg-[#0c1f26] border border-slate-200/80 dark:border-teal-900/35 hover:border-teal-500/40 dark:hover:border-teal-500/50 shadow-xs hover:shadow-[0_16px_32px_-8px_rgba(19,104,115,0.14),0_4px_12px_rgba(0,0,0,0.04)] dark:hover:shadow-[0_16px_32px_-8px_rgba(0,0,0,0.5),0_0_20px_rgba(20,184,166,0.12)] hover:-translate-y-2 transition-all duration-300 ease-out flex flex-col font-sans">
                  {/* Image Banner at Top with Smooth Zoom */}
                  {imageSrc && (
                    <div className="relative aspect-[16/11] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img
                        src={imageSrc}
                        alt={`${value.title} visual`}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                        loading="lazy"
                      />
                      <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/35 via-black/10 to-transparent pointer-events-none" />
                      {/* Numbered Indicator Badge matching Solutions cards */}
                      <span className="absolute top-2.5 left-2.5 text-[10.5px] font-mono font-bold px-2 py-0.5 rounded-md bg-white/85 dark:bg-slate-950/80 text-slate-800 dark:text-teal-300 backdrop-blur-xs border border-white/50 dark:border-white/10 shadow-2xs select-none">
                        0{idx + 1}
                      </span>
                    </div>
                  )}

                  {/* Overlapping Circular Icon Badge matching Solutions */}
                  <div className="relative -mt-6 ml-5 w-11 h-11 rounded-full bg-teal-600 dark:bg-teal-500 text-white flex items-center justify-center shadow-md border-2 border-white dark:border-[#0c1f26] z-10 group-hover:bg-teal-500 dark:group-hover:bg-teal-400 group-hover:scale-105 hover-ripple-subtle transition-all duration-300">
                    <Icon className="w-5 h-5 text-white stroke-[2]" />
                  </div>

                {/* Card Content Below Image */}
                <div className="px-5 pt-3 pb-5 flex-1 flex flex-col justify-start text-left">
                  {/* Semantic H3 Title */}
                  <h3 className="font-display text-[18px] sm:text-[19px] font-bold text-slate-900 dark:text-white mb-2 leading-snug group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
                    {value.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300/90 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        </div>

      </div>
    </section>
  );
};

export default OurValues;
