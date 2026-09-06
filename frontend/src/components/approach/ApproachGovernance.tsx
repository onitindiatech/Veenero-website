import React from "react";
import {
  ShieldCheck,
  FileCheck2,
  Cpu,
  Lock,
  ArrowRight,
  Leaf,
  CheckCircle2,
} from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Link } from "react-router-dom";
import defaultGovImage from "@/assets/about/about-infrastructure-sensor.webp";

interface ApproachGovernanceProps {
  data?: any;
}

const iconMap: Record<string, any> = {
  ShieldCheck,
  FileCheck2,
  Cpu,
  Lock,
  CheckCircle2,
};

const defaultCards = [
  {
    icon: "ShieldCheck",
    title: "Tamper-Evident Data Integrity",
    description: "Cryptographic signing of field sensor packets ensuring zero data manipulation from edge to dashboard.",
    tag: "AES-256",
  },
  {
    icon: "FileCheck2",
    title: "Regulatory Compliance Ready",
    description: "Automated compliance reporting structured for regional water boards and environmental auditing standards.",
    tag: "ISO Aligned",
  },
  {
    icon: "Cpu",
    title: "Edge-Resilient Telemetry",
    description: "Local storage caching during network outages with automated delta backfill upon link restoration.",
    tag: "99.9% Uptime",
  },
  {
    icon: "Lock",
    title: "Enterprise Access Control",
    description: "Role-based permissions (RBAC), multi-factor authentication, and partitioned multi-tenant architecture.",
    tag: "SOC 2 Ready",
  },
];

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

  const cards = data?.cards && data.cards.length > 0 ? data.cards : defaultCards;

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

        {/* 4 Feature/Pillar Cards in Balanced Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {cards.map((card: any, i: number) => {
            const Icon = iconMap[card.icon] || ShieldCheck;
            const stagger =
              i === 0
                ? ""
                : i === 1
                ? "reveal-delay-100"
                : i === 2
                ? "reveal-delay-200"
                : "reveal-delay-300";

            return (
              <div
                key={card.title || i}
                className={`group bg-[#f8fafb] dark:bg-[#0c1f26] rounded-2xl p-6 border border-slate-200/80 dark:border-teal-900/35 hover:border-teal-500/40 shadow-xs hover:shadow-[0_16px_32px_-8px_rgba(19,104,115,0.12)] hover:-translate-y-1.5 transition-all duration-300 font-sans flex flex-col justify-between reveal-on-scroll ${stagger}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/25 flex items-center justify-center text-teal-700 dark:text-teal-400 shrink-0">
                      <Icon className="w-5 h-5" strokeWidth={1.8} />
                    </div>
                    {card.tag && (
                      <span className="px-2.5 py-0.5 rounded-full bg-teal-600/10 dark:bg-teal-400/10 border border-teal-600/20 dark:border-teal-400/20 text-teal-700 dark:text-teal-300 font-mono text-[10px] font-bold">
                        {card.tag}
                      </span>
                    )}
                  </div>

                  <h3 className="font-display text-base font-bold text-slate-900 dark:text-white leading-snug mb-1.5">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-teal-500/30 to-transparent mt-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ApproachGovernance;
