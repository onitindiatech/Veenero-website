import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowLeft,
  LayoutGrid,
  Shield,
  Activity,
  Layers,
  ChevronRight,
  Sparkles,
  Radio,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import { SolutionDetailData } from "@/content/solutionDetailsData";
import { DigitCounter } from "./DigitCounter";

const ALL_SOLUTIONS_NAV = [
  { slug: "water-visibility", label: "Water Visibility" },
  { slug: "operational-intelligence", label: "Operational Intelligence" },
  { slug: "water-accountability", label: "Water Accountability" },
  { slug: "water-verification", label: "Water Verification" },
  { slug: "analytics-insights", label: "Analytics & Insights" },
];

interface SolutionHeroProps {
  data: SolutionDetailData;
  onDemoClick?: () => void;
  onExpertClick?: () => void;
}

export const SolutionHero: React.FC<SolutionHeroProps> = ({
  data,
  onDemoClick,
  onExpertClick,
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 20;
      const y = (e.clientY / innerHeight - 0.5) * 20;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const scrollToInquiry = () => {
    if (onDemoClick) {
      onDemoClick();
      return;
    }
    const el = document.getElementById("inquiry-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToExpert = () => {
    if (onExpertClick) {
      onExpertClick();
      return;
    }
    const el = document.getElementById("inquiry-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-[#021316] text-white pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pt-32 lg:pb-24 select-none">
      {/* ── Layer 1: Ambient Background & Flowing Particles ──────────────── */}
      <div className="absolute inset-0 pointer-events-none -z-0">
        {/* Soft deep gradients */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(20,184,166,0.18),transparent_70%)]" />
        <div className="absolute top-1/3 -right-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl" />

        {/* Animated Cyber Water Grid Lines */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(#2dd4bf 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />

        {/* Flowing Floating Micro-Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-teal-400/40 blur-[0.5px] animate-bubble"
              style={{
                width: `${(i % 3) * 2 + 3}px`,
                height: `${(i % 3) * 2 + 3}px`,
                left: `${(i * 8.5) % 95}%`,
                bottom: `-${(i * 10) % 30}px`,
                animationDuration: `${7 + (i % 5) * 2.5}s`,
                animationDelay: `${(i * 0.7) % 4}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10">
        {/* ── Breadcrumb & "View All Solutions" Navigation ────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 text-xs font-medium text-teal-300/80 font-mono tracking-wide">
            <Link
              to="/solutions"
              className="hover:text-teal-200 transition-colors flex items-center gap-1.5 text-slate-300 group/bc"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-teal-400 group-hover/bc:-translate-x-1 transition-transform" />
              <span>Solutions</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-teal-500/60" />
            <span className="text-teal-300 font-semibold">{data.title}</span>
          </div>

          {/* Prominent "View All Solutions" Button */}
          <Link
            to="/solutions"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-teal-950/80 hover:bg-teal-900 border border-teal-400/40 hover:border-teal-400 text-teal-300 hover:text-white text-xs font-semibold font-sans transition-all duration-200 backdrop-blur-md shadow-xs group cursor-pointer"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-teal-400 group-hover:rotate-12 transition-transform" />
            <span>View All Solutions</span>
            <ArrowRight className="w-3 h-3 text-teal-400 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* ── Solution Switcher Ribbon ────────────────────────────────────── */}
        <div className="overflow-x-auto pb-2 mb-8 scrollbar-none">
          <div className="flex items-center gap-2 min-w-max">
            <Link
              to="/solutions"
              className="px-3 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white bg-slate-900/70 hover:bg-slate-800 border border-teal-500/30 hover:border-teal-400/50 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <LayoutGrid className="w-3 h-3 text-teal-400" />
              <span>All Solutions</span>
            </Link>
            {ALL_SOLUTIONS_NAV.map((sol) => {
              const isActive = sol.slug === data.slug;
              return (
                <Link
                  key={sol.slug}
                  to={`/solutions/${sol.slug}`}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? "bg-teal-500/25 text-teal-200 border border-teal-400/70 font-semibold shadow-[0_0_12px_rgba(20,184,166,0.3)]"
                      : "text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-teal-500/20 hover:border-teal-400/40"
                  }`}
                >
                  {sol.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── Hero Main Grid ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Solution Info & CTAs (7 cols) */}
          <div className="lg:col-span-6 xl:col-span-6 space-y-6 text-left font-sans">
            {/* Category Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-950/80 border border-teal-400/40 backdrop-blur-md shadow-[0_0_15px_rgba(20,184,166,0.25)]">
              <span className="w-2 h-2 rounded-full bg-teal-400 inline-block shadow-[0_0_8px_#2dd4bf] animate-ping" />
              <span className="text-teal-300 font-bold uppercase tracking-widest text-[11px] font-mono">
                {data.badge}
              </span>
            </div>

            {/* H1 Headline */}
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem] font-bold text-white leading-[1.18] tracking-tight">
              <span>{data.tagline.line1}</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-teal-400 to-cyan-300">
                {data.tagline.line2}
              </span>
              <br />
              <span>{data.tagline.line3}</span>
            </h1>

            {/* Short Powerful Description */}
            <p className="text-sm sm:text-base text-slate-300/95 leading-relaxed max-w-xl">
              {data.heroDescription}
            </p>

            {/* 3 Core Highlights / Badges */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              {data.heroPills.map((pill, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-xs sm:text-sm text-slate-200 font-medium bg-slate-900/60 border border-teal-500/25 px-3 py-1.5 rounded-lg backdrop-blur-xs"
                >
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>{pill}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={scrollToInquiry}
                className="px-7 py-3.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl shadow-[0_4px_20px_rgba(20,184,166,0.35)] hover:shadow-[0_4px_28px_rgba(20,184,166,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-sm flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Request a Demo</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
              <button
                onClick={scrollToExpert}
                className="px-7 py-3.5 bg-slate-900/80 hover:bg-slate-800 text-white border border-teal-400/30 hover:border-teal-400/60 rounded-xl font-bold hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-sm flex items-center justify-center shadow-soft backdrop-blur-md cursor-pointer"
              >
                <span>Talk to an Expert</span>
              </button>
            </div>
          </div>

          {/* Right Column: Visual / Interactive Telemetry Area (6 cols) */}
          <div className="lg:col-span-6 xl:col-span-6 relative mt-4 lg:mt-0">
            {/* Interactive Parallax Frame */}
            <div
              className="relative w-full rounded-2xl overflow-visible transition-transform duration-300 ease-out"
              style={{
                transform: `translate3d(${mousePos.x * 0.4}px, ${mousePos.y * 0.4}px, 0)`,
              }}
            >
              {/* Main Visual Image Backdrop */}
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-teal-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.6)] bg-gradient-to-br from-slate-950 via-[#031d22] to-slate-950">
                <img
                  src={data.heroImage}
                  alt={`${data.title} Infrastructure`}
                  className="w-full h-full object-cover opacity-75 mix-blend-luminosity scale-[1.03] transition-transform duration-700 hover:scale-105"
                />

                {/* Deep Cyan/Teal Gradient Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#021316] via-[#021316]/40 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#021316]/60 via-transparent to-[#021316]/60 pointer-events-none" />

                {/* Animated Cyber Sensor Water Flow Pulse */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 border border-teal-400/40 text-[11px] text-teal-300 font-mono tracking-wider backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500" />
                  </span>
                  <span>LIVE SENSOR TELEMETRY FEED</span>
                </div>
              </div>

              {/* ── FLOATING GLASS STAT CARD 1: Flow Rate / Primary Metric (Top Left) ── */}
              {data.heroMetrics[0] && (
                <div className="absolute -top-4 -left-3 sm:-left-6 bg-slate-900/85 backdrop-blur-xl border border-teal-400/40 p-3.5 sm:p-4 rounded-xl shadow-[0_12px_35px_rgba(0,0,0,0.45)] text-left min-w-[170px] sm:min-w-[195px] animate-float-slow">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[11px] font-semibold text-slate-300 font-sans">
                      {data.heroMetrics[0].title}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                  </div>
                  <div className="flex items-baseline gap-1 text-xl sm:text-2xl font-bold font-sans text-white">
                    <DigitCounter
                      target={data.heroMetrics[0].rawValue}
                      decimals={data.heroMetrics[0].decimals || 0}
                      suffix={data.heroMetrics[0].suffix || ""}
                      className="text-white font-extrabold tracking-tight"
                    />
                  </div>
                  {data.heroMetrics[0].change && (
                    <div className="flex items-center gap-1 text-[11px] text-teal-400 font-medium mt-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>{data.heroMetrics[0].change}</span>
                      <span className="text-slate-400 text-[10px] ml-0.5">
                        {data.heroMetrics[0].subtext}
                      </span>
                    </div>
                  )}
                  {/* Mini Sparkline Curve */}
                  {data.heroMetrics[0].sparklineData && (
                    <div className="h-6 w-full mt-2 pt-1">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 100 24">
                        <polyline
                          fill="none"
                          stroke="#2dd4bf"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points="0,18 15,12 30,16 45,8 60,11 75,4 90,7 100,2"
                        />
                        <circle cx="100" cy="2" r="3" fill="#2dd4bf" className="animate-ping" />
                        <circle cx="100" cy="2" r="2" fill="#ffffff" />
                      </svg>
                    </div>
                  )}
                </div>
              )}

              {/* ── FLOATING GLASS STAT CARD 2: Asset Overview / Map (Top Right) ── */}
              {data.heroMetrics[3] && (
                <div className="absolute -top-6 -right-2 sm:-right-6 bg-slate-900/85 backdrop-blur-xl border border-teal-400/40 p-3 sm:p-3.5 rounded-xl shadow-[0_12px_35px_rgba(0,0,0,0.45)] text-left min-w-[150px] sm:min-w-[175px]">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-semibold text-slate-300 font-sans">
                      {data.heroMetrics[3].title}
                    </span>
                    <span className="text-[10px] text-teal-300 font-mono px-1.5 py-0.5 rounded bg-teal-950 border border-teal-500/30">
                      {data.heroMetrics[3].change || "Active"}
                    </span>
                  </div>
                  {/* Cyber Node Mini Map */}
                  <div className="h-12 w-full rounded-lg bg-[#011a1f] border border-teal-900/60 relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-[radial-gradient(#2dd4bf_1px,transparent_1px)] [background-size:8px_8px] opacity-20" />
                    {/* Pulsing Nodes */}
                    <div className="absolute top-2 left-3 w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                    <div className="absolute top-2 left-3 w-2 h-2 rounded-full bg-teal-400" />
                    <div className="absolute bottom-2 right-4 w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <div className="absolute top-3 right-8 w-1.5 h-1.5 rounded-full bg-teal-300" />
                    {/* Connecting line */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      <line x1="12" y1="10" x2="60" y2="15" stroke="#2dd4bf" strokeWidth="1" strokeDasharray="2,2" opacity="0.4" />
                      <line x1="60" y1="15" x2="110" y2="35" stroke="#2dd4bf" strokeWidth="1" strokeDasharray="2,2" opacity="0.4" />
                    </svg>
                    <span className="relative z-10 text-[11px] font-bold text-teal-200">
                      {data.heroMetrics[3].value}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {data.heroMetrics[3].subtext}
                  </span>
                </div>
              )}

              {/* ── FLOATING GLASS STAT CARD 3: Water Quality / Secondary Metric (Middle-Bottom Left) ── */}
              {data.heroMetrics[1] && (
                <div className="absolute -bottom-6 -left-3 sm:-left-6 bg-slate-900/90 backdrop-blur-xl border border-teal-400/40 p-3 sm:p-4 rounded-xl shadow-[0_12px_35px_rgba(0,0,0,0.45)] text-left min-w-[165px] sm:min-w-[190px]">
                  <span className="text-[11px] font-semibold text-slate-300 font-sans block mb-1">
                    {data.heroMetrics[1].title}
                  </span>
                  <div className="flex items-center gap-3">
                    {/* Circular Radial Gauge */}
                    <div className="relative w-11 h-11 shrink-0 flex items-center justify-center">
                      <svg className="w-11 h-11 -rotate-90" viewBox="0 0 36 36">
                        <circle
                          cx="18"
                          cy="18"
                          r="15"
                          fill="none"
                          stroke="#0b2e33"
                          strokeWidth="3.5"
                        />
                        <circle
                          cx="18"
                          cy="18"
                          r="15"
                          fill="none"
                          stroke="#2dd4bf"
                          strokeWidth="3.5"
                          strokeDasharray="94"
                          strokeDashoffset={94 - (94 * (data.heroMetrics[1].gaugePercent || 95)) / 100}
                          strokeLinecap="round"
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>
                      <span className="absolute text-[11px] font-bold text-white">
                        <DigitCounter
                          target={data.heroMetrics[1].rawValue}
                          decimals={data.heroMetrics[1].decimals || 0}
                          suffix="%"
                        />
                      </span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-teal-300 block">
                        {data.heroMetrics[1].change || "Healthy"}
                      </span>
                      <span className="text-[10px] text-slate-400 block leading-tight">
                        {data.heroMetrics[1].subtext}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* ── FLOATING GLASS STAT CARD 4: Active Alerts (Bottom Right) ── */}
              {data.heroMetrics[2] && (
                <div className="absolute -bottom-4 -right-2 sm:-right-4 bg-slate-900/90 backdrop-blur-xl border border-teal-400/40 p-3 sm:p-3.5 rounded-xl shadow-[0_12px_35px_rgba(0,0,0,0.45)] text-left min-w-[130px] sm:min-w-[150px]">
                  <span className="text-[11px] font-semibold text-slate-300 font-sans block">
                    {data.heroMetrics[2].title}
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl font-bold font-sans text-teal-300">
                      <DigitCounter target={data.heroMetrics[2].rawValue} />
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">Critical</span>
                  </div>
                  <span className="text-[10px] text-teal-400 hover:text-teal-300 transition-colors cursor-pointer mt-0.5 block underline font-medium">
                    {data.heroMetrics[2].subtext} →
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionHero;
