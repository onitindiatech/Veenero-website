import React from "react";
import {
  ShieldCheck,
  ArrowRight,
  Leaf,
} from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Link } from "react-router-dom";
import defaultGovImage from "@/assets/about/about-infrastructure-sensor.webp";

interface ApproachGovernanceProps {
  data?: any;
}

export const ApproachGovernance: React.FC<ApproachGovernanceProps> = ({ data }) => {
  useScrollReveal([]);

  if (data?.visible === false) return null;

  const eyebrow = data?.eyebrow || "ENTERPRISE GOVERNANCE";
  const title = data?.title || "Engineered for Scale,";
  const highlightedText = data?.highlightedText || "Governed for Trust";
  const description =
    data?.description ||
    "Our approach embeds end-to-end data security, regulatory compliance, and verifiable telemetry governance directly into the operational fabric of water infrastructure.";
  const supportingContent =
    data?.supportingContent ||
    "From municipal distribution networks to zero-liquid discharge industrial facilities, every data point captured by Veenero undergoes encrypted edge processing, redundant validation, and tamper-evident audit logging.";
  const img = data?.image || defaultGovImage;
  const ctaText = data?.ctaText || "Explore Platform Security";
  const ctaLink = data?.ctaLink || "/solutions";

  return (
    <section
      id="approach-governance"
      className="relative py-14 sm:py-16 lg:py-20 bg-white dark:bg-[#071317] border-b border-slate-200/60 dark:border-teal-900/20 select-none overflow-hidden"
    >
      <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10 space-y-10 sm:space-y-12">
        {/* Editorial Narrative Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left: Eyebrow, Title, Narrative & CTA */}
          <div className="lg:col-span-6 text-left font-sans space-y-4 reveal-on-scroll">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-600/10 dark:bg-teal-400/10 border border-teal-600/20 dark:border-teal-400/20 backdrop-blur-xs mb-1">
              <Leaf className="w-3 h-3 text-teal-700 dark:text-teal-300" />
              <span className="text-teal-800 dark:text-teal-300 font-bold uppercase tracking-widest text-[10px] sm:text-[11px] font-mono">
                {eyebrow}
              </span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.6rem] font-bold text-slate-900 dark:text-white leading-[1.18] tracking-tight">
              {title}{" "}
              <span className="text-[#136873] dark:text-teal-400">
                {highlightedText}
              </span>
            </h2>

            <p className="text-sm sm:text-[15px] text-slate-700 dark:text-slate-200/90 leading-relaxed">
              {description}
            </p>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed pt-0.5">
              {supportingContent}
            </p>

            {ctaText && (
              <div className="pt-2">
                <Link
                  to={ctaLink}
                  className="inline-flex items-center gap-2 px-6 py-2.5 sm:py-3 rounded-full bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 group cursor-pointer"
                >
                  <span>{ctaText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            )}
          </div>

          {/* Right: Architecture & Sensor Trust Image Card */}
          <div className="lg:col-span-6 reveal-on-scroll reveal-delay-200">
            <div className="group relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs border border-slate-200/80 dark:border-teal-900/40 bg-slate-950 aspect-[16/10]">
              <img
                src={img}
                alt="Veenero enterprise water telemetry and security architecture"
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />

              {/* Status Badge */}
              <div className="absolute top-4 left-4 inline-flex items-center gap-2 bg-slate-950/80 backdrop-blur-md border border-white/20 rounded-full px-3 py-1 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                <span className="text-[10px] font-bold text-teal-300 font-mono tracking-wider">
                  MISSION-CRITICAL RESILIENCE
                </span>
              </div>

              {/* Bottom Telemetry Note */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white/90 text-[11px] font-mono">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                  <span>Continuous Verification Loop</span>
                </span>
                <span className="text-teal-300 font-bold">Zero Trust Protocol</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApproachGovernance;
