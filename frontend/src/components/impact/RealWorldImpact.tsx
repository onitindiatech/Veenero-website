import React, { useState } from "react";
import { CheckCircle2, Landmark, Factory, Building2, Globe2, Leaf } from "lucide-react";
import { ImpactContent } from "@/content/impact";
import municipalImg from "@/assets/about/about-journey-water-infrastructure.webp";
import industrialImg from "@/assets/about/about-industrial-water-system.webp";
import commercialImg from "@/assets/about/about-field-verification.webp";
import networkImg from "@/assets/about/about-vision-water-infrastructure.webp";

interface RealWorldImpactProps {
  data: ImpactContent["ecosystem"];
}

const domainImages = [municipalImg, industrialImg, commercialImg, networkImg];
const domainIcons = [Landmark, Factory, Building2, Globe2];

export const RealWorldImpact: React.FC<RealWorldImpactProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState(0);
  const domains = data?.domains && data.domains.length > 0 ? data.domains : [];
  const currentDomain = domains[activeTab] || domains[0];

  if (!currentDomain) {
    return null;
  }

  return (
    <section
      id="real-world-impact"
      className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-[#071317] relative border-b border-slate-200/60 dark:border-teal-900/20 select-none overflow-hidden font-sans"
    >
      <div className="container mx-auto px-6 md:px-12 max-w-7xl space-y-10 sm:space-y-12">
        
        {/* Section Header */}
        <div className="text-left font-sans max-w-3xl">
          {/* Eyebrow Capsule */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-600/10 dark:bg-teal-400/10 border border-teal-600/20 dark:border-teal-400/20 backdrop-blur-xs mb-3.5">
            <Leaf className="w-3 h-3 text-teal-700 dark:text-teal-300" />
            <span className="text-teal-800 dark:text-teal-300 font-bold uppercase tracking-widest text-[10px] sm:text-[11px] font-mono">
              {data.eyebrow || "REAL-WORLD DEPLOYMENTS"}
            </span>
          </div>

          {/* H2 Title */}
          <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.65rem] font-bold text-slate-900 dark:text-white leading-[1.18] mb-4 tracking-tight">
            Creating Value Across{" "}
            <span className="text-[#136873] dark:text-teal-400">
              Industries &amp; Infrastructure
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300/90 leading-relaxed max-w-2xl">
            {data.description ||
              "Veenero's impact reaches across municipal distribution networks, heavy industrial facilities, commercial real estate, and regional water networks."}
          </p>
        </div>

        {/* Interactive Domain Switcher Tabs — Rounded Pill Badges */}
        <div className="flex flex-wrap items-center gap-2.5 pb-2">
          {domains.map((domain, idx) => {
            const Icon = domainIcons[idx] || domainIcons[0];
            const isActive = activeTab === idx;
            return (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-teal-600 text-white shadow-md"
                    : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-teal-900/30"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{domain.title}</span>
              </button>
            );
          })}
        </div>

        {/* Visual Story Card: Image on Left (7 cols) + Details on Right (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center bg-[#f8fcfe] dark:bg-[#071920] rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/80 dark:border-teal-900/30 shadow-md">
          
          {/* Left Media Area */}
          <div className="lg:col-span-7">
            <div className="group relative rounded-2xl overflow-hidden aspect-[16/10] shadow-sm border border-slate-200/80 dark:border-teal-900/30">
              <img
                src={domainImages[activeTab]}
                alt={currentDomain.title}
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

              {/* Status Badge */}
              <div className="absolute top-4 left-4">
                <div className="inline-flex items-center gap-2 bg-slate-950/80 backdrop-blur-md border border-teal-400/30 rounded-full px-3 py-1.5 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-white text-[11px] font-semibold font-sans">
                    Live Operational Deployment
                  </span>
                </div>
              </div>

              {/* Bottom Image Caption */}
              <div className="absolute bottom-4 left-4 right-4 text-left">
                <p className="text-[10px] font-mono text-teal-300 font-bold uppercase tracking-wider mb-0.5">
                  Field Telemetry Node
                </p>
                <p className="text-sm sm:text-base font-bold text-white font-display">
                  {currentDomain.title}
                </p>
              </div>
            </div>
          </div>

          {/* Right Details Area */}
          <div className="lg:col-span-5 text-left font-sans space-y-4">
            <div>
              <span className="text-[10px] font-mono font-bold text-teal-700 dark:text-teal-400 uppercase tracking-widest block mb-1">
                DOMAIN IMPACT REPORT
              </span>
              <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white leading-snug">
                {currentDomain.title}
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300/90 leading-relaxed">
              {currentDomain.description}
            </p>

            {/* Checklist of Measurable Outcomes */}
            <div className="space-y-2.5 pt-2">
              {(currentDomain.impactPoints || []).map((point, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200">
                    {point}
                  </span>
                </div>
              ))}
            </div>

            {/* Verification Ready Footnote */}
            <div className="pt-3 border-t border-slate-200/80 dark:border-teal-900/30 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 inline-block" />
              <span>Cryptographically signed edge telemetry</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default RealWorldImpact;
