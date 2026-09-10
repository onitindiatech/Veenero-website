import React from "react";
import { ArrowRight, Leaf, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import defaultCtaBackground from "@/assets/solutions/solutions-cta-background.png";

export interface ContactCTAProps {
  data?: {
    visible?: boolean;
    title?: string;
    description?: string;
    primaryButtonText?: string;
    primaryButtonLink?: string;
    secondaryButtonText?: string;
    secondaryButtonLink?: string;
  };
}

export const ContactCTA: React.FC<ContactCTAProps> = ({ data }) => {
  useScrollReveal([]);

  if (data?.visible === false) return null;

  const scrollToForm = () => {
    const el = document.getElementById("inquiry-form");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const title = data?.title || "Let's Work Together";
  const description =
    data?.description ||
    "From smarter water systems to stronger communities — we're always open to meaningful conversations.";
  const primaryButtonText = data?.primaryButtonText || "Get in Touch";
  const secondaryButtonText = data?.secondaryButtonText || "Explore Solutions";
  const secondaryButtonLink = data?.secondaryButtonLink || "/solutions";

  return (
    <section
      id="contact-cta"
      className="relative py-14 sm:py-16 lg:py-20 bg-white dark:bg-[#070f12] select-none"
    >
      <div className="container mx-auto px-6 md:px-12 max-w-7xl font-sans">
        <div className="relative overflow-hidden bg-slate-950 rounded-3xl p-8 sm:p-12 md:p-14 shadow-2xl border border-teal-900/40 reveal-on-scroll">

          {/* Background CTA Image */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <img
              src={defaultCtaBackground}
              alt="Veenero water intelligence — ready to make an impact"
              className="w-full h-full object-cover object-[center_right]"
              loading="lazy"
            />
            {/* Deep dark teal gradient overlay on left */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#021316] via-[#021316]/90 via-55% to-transparent pointer-events-none" />
          </div>

          {/* Right Watermark Accent */}
          <div className="hidden lg:block absolute bottom-8 right-12 text-right pointer-events-none select-none z-10">
            <span className="text-[10px] tracking-[0.25em] font-bold text-teal-200/50 uppercase font-mono leading-tight block">
              WATER
              <br />
              INTELLIGENCE
              <br />
              PLATFORM
            </span>
          </div>

          {/* Left Text and Actions */}
          <div className="relative z-10 text-left max-w-xl space-y-4">

            {/* Eyebrow Leaf Capsule */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-400/10 border border-teal-400/25 backdrop-blur-xs mb-1">
              <Leaf className="w-3 h-3 text-teal-300" />
              <span className="text-teal-300 font-bold uppercase tracking-widest text-[10px] sm:text-[11px] font-mono">
                READY TO MAKE AN IMPACT?
              </span>
            </div>

            {/* H2 Title */}
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-snug">
              {data?.title ? (
                title
              ) : (
                <>
                  Let's Work{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-teal-400 to-cyan-300">
                    Together
                  </span>
                </>
              )}
            </h2>

            {/* Description */}
            <p className="text-sm md:text-[15px] text-slate-300/90 leading-relaxed">
              {description}
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <button
                onClick={scrollToForm}
                className="px-7 py-3.5 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-full font-bold shadow-md hover:shadow-lg transition-all duration-200 text-sm flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>{primaryButtonText}</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <Link
                to={secondaryButtonLink}
                className="px-7 py-3.5 bg-white/5 hover:bg-white/10 text-white border border-white/25 hover:border-white/40 rounded-full font-semibold transition-all duration-200 text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{secondaryButtonText}</span>
              </Link>
            </div>

            {/* Trust Points */}
            <div className="pt-4 flex flex-wrap items-center gap-5 text-xs text-slate-400 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>24h Engineer Response</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>Confidential &amp; Secure</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-teal-400" />
                <span>Tailored Consultations</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactCTA;
