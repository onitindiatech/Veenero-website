import React, { useEffect, useRef, useState } from "react";
import {
  Droplets,
  Zap,
  ArrowDownToLine,
  ShieldCheck,
  ArrowRight,
  Leaf,
} from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Link as RouterLink } from "react-router-dom";

type LucideIcon = React.ComponentType<{ className?: string; strokeWidth?: number }>;

// ========== IMPACT OUTCOMES METRICS ==========
interface OutcomeMetric {
  icon: LucideIcon;
  range: [string, string];
  suffix: string;
  joined?: boolean;
  label: string;
  sublabel: string;
}

const outcomeMetrics: OutcomeMetric[] = [
  {
    icon: Droplets,
    range: ["20", "40"],
    suffix: "%",
    label: "Reduction in",
    sublabel: "Non-Revenue Water",
  },
  {
    icon: Zap,
    range: ["30", "50"],
    suffix: "%",
    label: "Faster Issue",
    sublabel: "Detection",
  },
  {
    icon: ArrowDownToLine,
    range: ["25", "35"],
    suffix: "%",
    label: "Lower Operational",
    sublabel: "Costs",
  },
  {
    icon: ShieldCheck,
    range: ["99", "9"],
    suffix: "%",
    joined: true,
    label: "Data Reliability",
    sublabel: "& Availability",
  },
];

// ========== ONE-SHOT COUNT-UP HOOK ==========
function useCountUp(
  target: number,
  durationMs: number,
  triggerOn: boolean,
  reducedMotion: boolean,
): number {
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!triggerOn || startedRef.current) return;
    startedRef.current = true;
    if (reducedMotion) {
      setValue(target);
      return;
    }
    const start = performance.now();
    let rafId = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [triggerOn, target, durationMs, reducedMotion]);

  return value;
}

// ========== METRIC CARD ==========
interface MetricCardProps {
  metric: OutcomeMetric;
  index: number;
  inView: boolean;
  reducedMotion: boolean;
  stagger: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  metric,
  index,
  inView,
  reducedMotion,
  stagger,
}) => {
  const Icon = metric.icon;
  const fromA = parseInt(metric.range[0], 10);
  const fromB = parseInt(metric.range[1], 10);
  const vA = useCountUp(fromA, 1400 + index * 150, inView, reducedMotion);
  const vB = useCountUp(fromB, 1600 + index * 150, inView, reducedMotion);

  return (
    <div
      className={`group relative rounded-2xl p-6 bg-white dark:bg-[#0c1f26] border border-slate-200/80 dark:border-teal-900/35 hover:border-teal-500/40 shadow-xs hover:shadow-[0_16px_32px_-8px_rgba(19,104,115,0.12)] hover:-translate-y-1.5 transition-all duration-300 font-sans flex flex-col justify-between reveal-on-scroll ${stagger}`}
    >
      <div>
        <div className="w-11 h-11 rounded-xl bg-teal-500/10 border border-teal-500/25 flex items-center justify-center mb-4 text-teal-700 dark:text-teal-400 shrink-0">
          <Icon className="w-5 h-5" strokeWidth={1.8} />
        </div>

        <div className="flex items-baseline gap-1 mb-2 font-mono">
          {!metric.joined ? (
            <>
              <span className="text-3xl sm:text-4xl font-extrabold leading-none text-[#136873] dark:text-teal-400">
                {vA}
              </span>
              <span className="text-xl sm:text-2xl font-bold text-teal-600/80 dark:text-teal-400/80 leading-none">
                –
              </span>
              <span className="text-3xl sm:text-4xl font-extrabold leading-none text-[#136873] dark:text-teal-400">
                {vB}
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-[#136873] dark:text-teal-400 leading-none ml-0.5">
                {metric.suffix}
              </span>
            </>
          ) : (
            <>
              <span className="text-3xl sm:text-4xl font-extrabold leading-none text-[#136873] dark:text-teal-400">
                {vA}.
              </span>
              <span className="text-3xl sm:text-4xl font-extrabold leading-none text-[#136873] dark:text-teal-400">
                {vB}
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-[#136873] dark:text-teal-400 leading-none ml-0.5">
                {metric.suffix}
              </span>
            </>
          )}
        </div>

        <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
          {metric.label}
        </p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">{metric.sublabel}</p>
      </div>

      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-teal-500/30 to-transparent mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};

interface ApproachInsightsProps {
  impactData?: any;
}

const metricIconMap: Record<string, any> = {
  Droplets,
  Zap,
  ArrowDownToLine,
  ShieldCheck,
};

// ===========================================================
//  MAIN COMPONENT (IMPACT OUTCOMES)
// ===========================================================
export const ApproachInsights: React.FC<ApproachInsightsProps> = ({ impactData }) => {
  useScrollReveal([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = () => setReducedMotion(mql.matches);
    handler();
    mql.addEventListener?.("change", handler);
    return () => mql.removeEventListener?.("change", handler);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setInView(true);
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
    );
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  const staggers = ["", "reveal-delay-100", "reveal-delay-200", "reveal-delay-300"];

  // Impact Section Data
  const impactEyebrow = impactData?.eyebrow || "IMPACT-DRIVEN APPROACH";
  const impactTitle = impactData?.title || "Our Approach Creates";
  const impactHighlightedText = impactData?.highlightedText || "Measurable Outcomes";
  const impactDesc = impactData?.description ||
    "We don't just deploy technology — we create lasting, verifiable impact across water networks and industrial utilities.";
  const impactCtaText = impactData?.ctaText || "Explore Our Impact";
  const impactCtaLink = impactData?.ctaLink || "/impact";

  const metrics: OutcomeMetric[] = impactData?.metrics && impactData.metrics.length > 0
    ? impactData.metrics.map((m: any, i: number) => ({
        icon: metricIconMap[m.icon] || outcomeMetrics[i % outcomeMetrics.length]?.icon || Droplets,
        range: m.range || outcomeMetrics[i % outcomeMetrics.length]?.range || ["20", "40"],
        suffix: m.suffix || "%",
        joined: m.joined,
        label: m.label,
        sublabel: m.sublabel,
      }))
    : outcomeMetrics;

  return (
    <div ref={containerRef} className="select-none">
      {/* ============  IMPACT / OUTCOMES (Light Aqua #f8fafb)  ============ */}
      <section
        id="approach-impact"
        className="relative py-14 sm:py-16 lg:py-20 bg-[#f8fafb] dark:bg-[#071317] border-b border-slate-200/60 dark:border-teal-900/20 overflow-hidden"
      >
        <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10 space-y-10 sm:space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left column: heading + CTA */}
            <div className="lg:col-span-5 text-left font-sans space-y-4 reveal-on-scroll">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-600/10 dark:bg-teal-400/10 border border-teal-600/20 dark:border-teal-400/20 backdrop-blur-xs mb-1">
                <Leaf className="w-3 h-3 text-teal-700 dark:text-teal-300" />
                <span className="text-teal-800 dark:text-teal-300 font-bold uppercase tracking-widest text-[10px] sm:text-[11px] font-mono">
                  {impactEyebrow}
                </span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.6rem] font-bold text-slate-900 dark:text-white leading-[1.18] tracking-tight">
                {impactTitle}{" "}
                <span className="text-[#136873] dark:text-teal-400">{impactHighlightedText}</span>
              </h2>
              <p className="text-sm sm:text-[15px] text-slate-600 dark:text-slate-300/90 leading-relaxed max-w-lg">
                {impactDesc}
              </p>
              <RouterLink
                to={impactCtaLink}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-teal-600 hover:bg-teal-500 text-white rounded-full font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-xs sm:text-sm group w-fit mt-2 cursor-pointer"
              >
                <span>{impactCtaText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </RouterLink>
            </div>

            {/* Right column: 4 metric cards */}
            <div className="lg:col-span-7 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {metrics.map((m, i) => (
                <MetricCard
                  key={m.label}
                  metric={m}
                  index={i}
                  inView={inView}
                  reducedMotion={reducedMotion}
                  stagger={staggers[i]}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ApproachInsights;
