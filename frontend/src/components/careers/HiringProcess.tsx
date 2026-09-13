import React, { useEffect, useRef, useState } from "react";
import { Search, FileText, Users, Rocket, CheckCircle } from "lucide-react";

const defaultSteps = [
  {
    num: "01",
    icon: Search,
    title: "Explore",
    subtitle: "Find Your Fit",
    description:
      "Browse our open roles across engineering, hardware, data science, and operations. Find the position that matches your passion and expertise.",
    accent: "from-teal-500/20 to-cyan-500/10",
    iconBg: "bg-teal-50 dark:bg-teal-950/50 border-teal-500/30 text-teal-700 dark:text-teal-300",
    pill: "bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border-teal-600/20",
  },
  {
    num: "02",
    icon: FileText,
    title: "Apply",
    subtitle: "Share Your Story",
    description:
      "Submit your application with your resume and a note about what drives you. We read every application — no black boxes here.",
    accent: "from-cyan-500/20 to-teal-500/10",
    iconBg: "bg-cyan-50 dark:bg-cyan-950/50 border-cyan-500/30 text-cyan-700 dark:text-cyan-300",
    pill: "bg-cyan-50 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 border-cyan-600/20",
  },
  {
    num: "03",
    icon: Users,
    title: "Interview",
    subtitle: "Meaningful Conversations",
    description:
      "We run focused, respectful interviews designed to understand your thinking, values, and technical depth. Typically two to three rounds.",
    accent: "from-teal-600/20 to-sky-500/10",
    iconBg: "bg-teal-50 dark:bg-teal-950/50 border-teal-600/30 text-teal-700 dark:text-teal-300",
    pill: "bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border-teal-600/20",
  },
  {
    num: "04",
    icon: Rocket,
    title: "Join & Build",
    subtitle: "Welcome to Veenero",
    description:
      "Receive your offer, onboard with your team, and start building the water intelligence infrastructure that India needs.",
    accent: "from-sky-500/20 to-teal-400/10",
    iconBg: "bg-sky-50 dark:bg-sky-950/50 border-sky-500/30 text-sky-700 dark:text-sky-300",
    pill: "bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border-sky-500/20",
  },
];

export interface HiringProcessProps {
  data?: {
    visible?: boolean;
    eyebrow?: string;
    title?: string;
    description?: string;
    steps?: Array<{
      num?: string;
      icon?: string;
      title: string;
      subtitle?: string;
      description: string;
    }>;
  };
}

export const HiringProcess: React.FC<HiringProcessProps> = ({ data }) => {
  if (data?.visible === false) return null;

  const displaySteps =
    data?.steps && data.steps.length > 0
      ? data.steps.map((s, idx) => {
          const fallback = defaultSteps[idx % defaultSteps.length];
          return {
            num: s.num || fallback.num,
            icon: fallback.icon,
            title: s.title || fallback.title,
            subtitle: s.subtitle || fallback.subtitle,
            description: s.description || fallback.description,
            accent: fallback.accent,
            iconBg: fallback.iconBg,
            pill: fallback.pill,
          };
        })
      : defaultSteps;

  const sectionRef = useRef<HTMLElement>(null);
  const [visibleSteps, setVisibleSteps] = useState<boolean[]>(
    Array(displaySteps.length).fill(false)
  );
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    stepRefs.current.forEach((el, idx) => {
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setVisibleSteps((prev) => {
                const next = [...prev];
                next[idx] = true;
                return next;
              });
            }, idx * 150);
            observer.disconnect();
          }
        },
        { threshold: 0.15 }
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <section
      id="selection-process"
      ref={sectionRef}
      className="py-16 sm:py-24 lg:py-28 bg-slate-50/70 dark:bg-slate-900/30 border-t border-border/10 select-none relative overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/4 -right-1/4 w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-gradient-to-bl from-teal-500/[0.04] to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[45vw] h-[45vw] max-w-[550px] max-h-[550px] bg-gradient-to-tr from-cyan-500/[0.03] to-transparent rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10">

        {/* Section Header */}
        <div className="text-left font-sans max-w-3xl mb-14 sm:mb-16">
          <div>
            <span className="text-teal-700 dark:text-teal-400 font-bold uppercase tracking-widest text-xs font-mono block mb-1.5">
              {data?.eyebrow || "THE HIRING PROCESS"}
            </span>
            <div className="w-10 h-0.5 bg-teal-600 rounded-full mb-4" />
          </div>

          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-3 leading-tight tracking-tight">
            {data?.title || "How We Hire at Veenero"}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
            {data?.description ||
              "A transparent, candidate-first process designed to understand your expertise, values, and long-term alignment with our mission."}
          </p>
        </div>

        {/* Steps — Horizontal Timeline Desktop / Vertical Mobile */}
        <div className="relative">

          {/* Desktop Connecting Line */}
          <div className="hidden lg:block absolute top-[4.25rem] left-[calc(12.5%+2rem)] right-[calc(12.5%+2rem)] h-px bg-gradient-to-r from-transparent via-teal-500/30 to-transparent z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8 relative z-10">
            {displaySteps.map((step, idx) => {
              const Icon = step.icon;
              const isVisible = visibleSteps[idx];
              return (
                <div
                  key={idx}
                  ref={(el) => { stepRefs.current[idx] = el; }}
                  className="group flex flex-col font-sans"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? "translateY(0)" : "translateY(28px)",
                    transition: "opacity 0.55s ease, transform 0.55s ease",
                  }}
                >
                  {/* Card */}
                  <div className="flex flex-col h-full bg-card rounded-2xl border border-border/50 hover:border-teal-500/50 shadow-sm hover:shadow-card hover:-translate-y-1.5 transition-all duration-300 overflow-hidden relative">
                    
                    {/* Top accent gradient bar */}
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${step.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                    <div className="p-6 sm:p-7 flex flex-col h-full space-y-4">
                      
                      {/* Step number + icon row */}
                      <div className="flex items-center gap-3">
                        {/* Step Pill */}
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold border tracking-widest font-mono ${step.pill}`}>
                          <CheckCircle className="w-3 h-3" />
                          STEP {step.num}
                        </span>
                      </div>

                      {/* Icon Circle */}
                      <div className={`h-14 w-14 rounded-2xl border flex items-center justify-center group-hover:scale-105 hover-ripple-subtle transition-all duration-300 ${step.iconBg}`}>
                        <Icon className="h-6 w-6" />
                      </div>

                      {/* Text */}
                      <div className="flex-1 space-y-1.5">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                          {step.subtitle}
                        </p>
                        <h3 className="font-display text-lg font-bold text-foreground group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors leading-snug">
                          {step.title}
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                          {step.description}
                        </p>
                      </div>

                      {/* Step indicator footer */}
                      <div className="pt-4 border-t border-border/20 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-muted-foreground font-mono tracking-widest">
                          {idx + 1} of {displaySteps.length}
                        </span>
                        <div className="flex gap-1">
                          {displaySteps.map((_, i) => (
                            <div
                              key={i}
                              className={`h-1 rounded-full transition-all duration-300 ${
                                i === idx
                                  ? "w-5 bg-teal-500"
                                  : i < idx
                                  ? "w-1.5 bg-teal-300 dark:bg-teal-700"
                                  : "w-1.5 bg-border/60"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom summary note */}
        <div className="mt-10 sm:mt-12 text-center font-sans">
          <p className="text-xs text-muted-foreground leading-relaxed max-w-xl mx-auto">
            Most candidates complete the full process within{" "}
            <span className="font-semibold text-foreground">10–14 working days</span>. We communicate clearly at every step.
          </p>
        </div>

      </div>
    </section>
  );
};

export default HiringProcess;
