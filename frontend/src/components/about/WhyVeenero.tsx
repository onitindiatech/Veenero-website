import React from "react";
import { PublicAboutWhyChoose, PublicAboutWhyChooseItem } from "@/services/about.service";
import * as LucideIcons from "lucide-react";

import sensorImg from "@/assets/about/about-infrastructure-sensor.webp";
import analyticsImg from "@/assets/about/about-real-time-analytics.webp";
import verificationImg from "@/assets/about/about-field-verification.webp";
import systemImg from "@/assets/about/about-industrial-water-system.webp";

interface WhyVeeneroProps {
  data?: PublicAboutWhyChoose;
}

const fallbackImages = [sensorImg, analyticsImg, verificationImg, systemImg];

const defaultCards: PublicAboutWhyChooseItem[] = [
  {
    title: "End-to-End Infrastructure",
    description:
      "From edge telemetry sensors and gateway hardware to cloud intelligence and executive dashboards.",
    icon: "Layers",
    image: sensorImg,
    order: 1,
  },
  {
    title: "Real-Time Actionability",
    description:
      "Instant anomaly detection and threshold triggers so teams can intervene before losses compound.",
    icon: "Zap",
    image: analyticsImg,
    order: 2,
  },
  {
    title: "Verification-Ready Auditing",
    description:
      "Tamper-resistant audit trails designed to meet stringent ESG compliance and regulatory requirements.",
    icon: "ShieldCheck",
    image: verificationImg,
    order: 3,
  },
  {
    title: "Open & Scalable Ecosystem",
    description:
      "Seamless API integrations with enterprise ERPs, SCADA systems, and facility management platforms.",
    icon: "Share2",
    image: systemImg,
    order: 4,
  },
];

export const WhyVeenero: React.FC<WhyVeeneroProps> = ({ data }) => {
  if (data?.visible === false) return null;

  const eyebrow = data?.eyebrow ?? "WHY CHOOSE VEENERO";
  const title = data?.title ?? "What Sets";
  const highlightedText = data?.highlightedText ?? "Veenero Apart";
  const description =
    data?.description ||
    "We do not provide single-point devices or surface-level charts. We deliver a complete digital infrastructure layer for enterprise water management.";

  const cards = data?.list && data.list.length > 0 ? data.list : defaultCards;

  return (
    <section id="why-choose-veenero" className="py-14 sm:py-16 lg:py-20 bg-white dark:bg-[#071317] relative border-b border-slate-200/60 dark:border-teal-900/20 overflow-hidden select-none">
      <div className="container mx-auto px-6 md:px-12 max-w-7xl space-y-12">
        
        {/* Centered Header with Leaf Eyebrow & Semantic H2 */}
        <div className="text-center font-sans max-w-2xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-600/10 dark:bg-teal-400/10 border border-teal-600/20 dark:border-teal-400/20 backdrop-blur-xs mb-3">
            <LucideIcons.Leaf className="w-3 h-3 text-teal-700 dark:text-teal-300" />
            <span className="text-teal-800 dark:text-teal-300 font-bold uppercase tracking-widest text-[10px] sm:text-[11px] font-mono">
              {eyebrow}
            </span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.6rem] font-bold text-slate-900 dark:text-white mb-3 leading-[1.18] tracking-tight">
            {title} {highlightedText && <span className="text-[#136873] dark:text-teal-400">{highlightedText}</span>}
          </h2>

          <p className="text-sm md:text-base text-slate-600 dark:text-slate-300/90 leading-relaxed">
            {description}
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, idx) => {
            const Icon = (LucideIcons as any)[card.icon] || LucideIcons.Layers;
            const imageSrc =
              card.image || fallbackImages[idx % fallbackImages.length];

            return (
              <div
                key={card.id || card._id || idx}
                className="group bg-[#f8fafb] dark:bg-[#0c1f26] rounded-2xl p-7 border border-slate-200/80 dark:border-teal-900/35 hover:border-teal-500/40 shadow-xs hover:shadow-[0_16px_32px_-8px_rgba(19,104,115,0.12)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between font-sans relative overflow-hidden"
              >
                <div>
                  {/* Circular Icon Container */}
                  <div className="w-12 h-12 rounded-full bg-teal-500/10 border border-teal-500/25 flex items-center justify-center text-teal-700 dark:text-teal-400 group-hover:scale-105 group-hover:bg-teal-500/20 transition-all duration-300 mb-6 shadow-2xs shrink-0">
                    <Icon className="w-5 h-5 stroke-[1.9]" />
                  </div>

                  <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-2 leading-snug group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
                    {card.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300/90 leading-relaxed mb-4">
                    {card.description}
                  </p>
                </div>

                {/* Optional Media Preview (Preserves Media Library Asset Reference) */}
                {imageSrc && (
                  <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800 mt-auto">
                    <div className="relative w-full h-24 rounded-xl overflow-hidden bg-slate-950">
                      <img
                        src={imageSrc}
                        alt={`${card.title} preview`}
                        className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default WhyVeenero;
