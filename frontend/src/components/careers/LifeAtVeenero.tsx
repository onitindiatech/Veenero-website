import React from "react";
import rndImage from "@/assets/about/about-infrastructure-sensor.webp";
import deploymentImage from "@/assets/about/about-field-verification.webp";
import teamImage from "@/assets/about/about-pillar-together.webp";
import facilityImage from "@/assets/about/about-industrial-water-system.webp";
import { Sparkles, MapPin } from "lucide-react";

export const LifeAtVeenero: React.FC = () => {
  const highlights = [
    {
      type: "image",
      src: teamImage,
      title: "Collaborative Engineering Culture",
      tag: "Team & Culture",
      description: "Cross-functional teams debating system architecture, shipping telemetry updates, and solving edge cases together.",
      span: "md:col-span-2 md:row-span-2 min-h-[360px]",
    },
    {
      type: "image",
      src: rndImage,
      title: "Sensor Lab Calibration",
      tag: "Hardware & IoT",
      description: "Calibrating flow meters and testing edge microcontrollers under rigorous hydraulic loads.",
      span: "md:col-span-1 md:row-span-1 min-h-[175px]",
    },
    {
      type: "image",
      src: deploymentImage,
      title: "Real-World Field Deployments",
      tag: "Operations",
      description: "Hands-on site deployments with municipal water networks and industrial facility engineers.",
      span: "md:col-span-1 md:row-span-1 min-h-[175px]",
    },
    {
      type: "image",
      src: facilityImage,
      title: "Conserving Every Litre",
      tag: "Environmental Impact",
      description: "Live tracking, pressure zone balancing, and preventing millions of litres of loss across assets.",
      span: "md:col-span-2 md:row-span-1 min-h-[175px]",
    },
    {
      type: "card",
      title: "Continuous Learning & Hackathons",
      tag: "Innovation",
      description: "Weekly tech talks, open-source contributions, and hackathons tackling automated leak forecasting.",
      span: "md:col-span-1 md:row-span-1 min-h-[175px]",
    },
  ];

  return (
    <section id="life-at-veenero" className="py-12 sm:py-16 lg:py-20 bg-background relative border-b border-border/15 select-none overflow-hidden">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-teal-500/[0.03] rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="container mx-auto px-6 md:px-12 max-w-7xl space-y-10">
        
        {/* Section Header */}
        <div className="text-left font-sans max-w-3xl">
          <div>
            <span className="text-teal-700 dark:text-teal-400 font-bold uppercase tracking-widest text-xs font-mono block mb-1.5">
              LIFE AT VEENERO
            </span>
            <div className="w-10 h-0.5 bg-teal-600 rounded-full mb-3" />
          </div>

          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-2 leading-tight tracking-tight">
            Inside the Water Intelligence Workshop
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
            A look into our labs, field installations, and everyday collaboration building mission-critical water management infrastructure.
          </p>
        </div>

        {/* Masonry/Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {highlights.map((item, idx) => (
            <div
              key={idx}
              className={`group relative overflow-hidden rounded-2xl border border-border/60 bg-card shadow-2xs hover:shadow-soft hover:-translate-y-1 transition-all duration-300 ${item.span}`}
            >
              {item.type === "image" ? (
                <div className="relative w-full h-full min-h-[200px]">
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  {/* Editorial Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent flex flex-col justify-end p-5 sm:p-6 text-left" />

                  {/* Top Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-teal-300 border border-teal-500/30 text-[10px] font-bold font-mono">
                      {item.tag}
                    </span>
                  </div>

                  {/* Bottom Text Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 text-left font-sans space-y-1 text-white">
                    <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-200/90 leading-relaxed max-w-md line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full p-6 flex flex-col justify-between bg-gradient-to-br from-teal-500/10 via-cyan-500/5 to-transparent font-sans text-left">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 text-[10px] font-bold font-mono border border-teal-600/20">
                        {item.tag}
                      </span>
                      <Sparkles className="w-4 h-4 text-teal-500" />
                    </div>
                    <h3 className="font-display text-base font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-border/30 text-[10px] text-teal-700 dark:text-teal-400 font-bold font-mono">
                    High Agency Environment →
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default LifeAtVeenero;
