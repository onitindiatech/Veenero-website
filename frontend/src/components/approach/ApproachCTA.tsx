import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Leaf } from "lucide-react";
import defaultCtaBackground from "@/assets/solutions/solutions-cta-background.png";

interface ApproachCTAProps {
  data?: any;
}

export const ApproachCTA: React.FC<ApproachCTAProps> = ({ data }) => {
  const ctaBg = defaultCtaBackground;
  const eyebrow = data?.eyebrow || "READY TO GET STARTED";
  const title = data?.title || "Ready to Transform";
  const highlightedText = data?.highlightedText || "Water Future?";
  const description =
    data?.description ||
    "Let's build smarter, more resilient water systems together with real-time intelligence.";
  const primaryButtonText = data?.primaryButtonText || "Get in Touch";
  const primaryButtonLink = data?.primaryButtonLink || "/contact";
  const secondaryButtonText = data?.secondaryButtonText || "Explore Solutions";
  const secondaryButtonLink = data?.secondaryButtonLink || "/solutions";

  return (
    <section
      id="approach-cta"
      className="relative py-14 sm:py-16 lg:py-20 bg-white dark:bg-[#070f12] select-none"
    >
      <div className="container mx-auto px-6 md:px-12 max-w-7xl font-sans">
        <div className="relative overflow-hidden bg-slate-950 rounded-3xl p-8 sm:p-12 md:p-14 shadow-2xl border border-teal-900/40">

          {/* Background Planet & Water Splash Image */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <img
              src={ctaBg}
              alt="Veenero Sustainable Water Infrastructure — Earth splashing in water"
              className="w-full h-full object-cover object-[center_right]"
              loading="lazy"
            />
            {/* Deep dark teal gradient overlay on left to ensure high readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#021316] via-[#021316]/90 via-55% to-transparent pointer-events-none" />
          </div>

          {/* Right Watermark Accent */}
          <div className="hidden lg:block absolute bottom-8 right-12 text-right pointer-events-none select-none z-10">
            <span className="text-[10px] tracking-[0.25em] font-bold text-teal-200/50 uppercase font-mono leading-tight block">
              WATER
              <br />
              INTELLIGENCE
              <br />
              VERIFIED IMPACT
            </span>
          </div>

          {/* Left Content and Action */}
          <div className="relative z-10 text-left max-w-xl space-y-4">
            {eyebrow && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-400/10 border border-teal-400/25 backdrop-blur-xs mb-1">
                <Leaf className="w-3 h-3 text-teal-300" />
                <span className="text-teal-300 font-bold uppercase tracking-widest text-[10px] sm:text-[11px] font-mono">
                  {eyebrow}
                </span>
              </div>
            )}

            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-snug">
              {title}{" "}
              <br className="hidden sm:block" />
              <span className="text-teal-400">{highlightedText}</span>
            </h2>

            <p className="text-sm md:text-[15px] text-slate-300/90 leading-relaxed max-w-md">
              {description}
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <Link
                to={primaryButtonLink}
                className="px-7 py-3.5 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-full font-bold shadow-md hover:shadow-lg transition-all duration-200 text-sm flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>{primaryButtonText}</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to={secondaryButtonLink}
                className="px-7 py-3.5 bg-white/5 hover:bg-white/10 text-white border border-white/25 hover:border-white/40 rounded-full font-semibold transition-all duration-200 text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{secondaryButtonText}</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ApproachCTA;
