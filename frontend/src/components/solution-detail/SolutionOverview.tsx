import React from "react";
import {
  Activity,
  Gauge,
  Droplets,
  Bell,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Download,
  Filter,
  Calendar,
  Layers,
  Sparkles,
  Zap,
  Building,
  ShieldCheck,
  Compass,
  FileText,
  Users,
  TrendingUp,
} from "lucide-react";
import { SolutionDetailData } from "@/content/solutionDetailsData";
import { DigitCounter } from "./DigitCounter";

interface SolutionOverviewProps {
  data: SolutionDetailData;
}

const iconMap: Record<string, React.ElementType> = {
  Activity,
  Gauge,
  Droplets,
  Bell,
  Layers,
  Sparkles,
  Zap,
  Building,
  ShieldCheck,
  Compass,
  FileText,
  Users,
  TrendingUp,
};

export const SolutionOverview: React.FC<SolutionOverviewProps> = ({ data }) => {
  return (
    <section
      id="overview-section"
      className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-[#070f12] border-b border-[#e2eded] dark:border-teal-900/30 select-none relative overflow-hidden"
    >
      {/* Background soft water flow glow */}
      <div className="absolute top-1/2 -left-32 w-80 h-80 bg-teal-500/[0.035] rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center font-sans">
          {/* Left Column (5 cols): Title, Paragraph, 4 Feature Blocks */}
          <div className="lg:col-span-5 space-y-7 text-left">
            {/* Section Eyebrow */}
            <div className="reveal-on-scroll">
              <span className="text-teal-700 dark:text-teal-400 font-bold uppercase tracking-widest text-xs font-mono block mb-1.5">
                {data.overview.eyebrow}
              </span>
              <div className="w-10 h-0.5 bg-teal-600 rounded-full mb-3" />
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white leading-[1.2]">
                <span>{data.overview.title} </span>
                <span className="text-teal-600 dark:text-teal-400 block sm:inline">
                  {data.overview.highlightTitle || data.title}
                </span>
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed mt-4">
                {data.overview.description}
              </p>
            </div>

            {/* 4 Feature Blocks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 pt-2">
              {data.overview.blocks.map((block, idx) => {
                const Icon = iconMap[block.icon] || Activity;
                const stagger =
                  idx === 0
                    ? ""
                    : idx === 1
                    ? "reveal-delay-100"
                    : idx === 2
                    ? "reveal-delay-200"
                    : "reveal-delay-300";
                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl bg-[#f7fafa] dark:bg-[#0c1f26] border border-[#e2eded] dark:border-teal-900/40 hover:border-teal-500/40 transition-all duration-300 group reveal-on-scroll ${stagger}`}
                  >
                    <div className="w-9 h-9 rounded-lg bg-teal-600/10 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white mb-1 leading-snug">
                      {block.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {block.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column (7 cols): Enterprise Dashboard Card UI */}
          <div className="lg:col-span-7 reveal-on-scroll reveal-delay-200">
            <div className="rounded-2xl border border-[#dce9e6] dark:border-teal-900/50 bg-white dark:bg-[#09181d] shadow-[0_15px_40px_rgba(15,76,92,0.08)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.5)] p-5 sm:p-6 overflow-hidden">
              {/* Dashboard Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#e8ecec] dark:border-teal-900/30">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center shadow-xs">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                        Veenero Overview
                      </span>
                      <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Telemetry Node: VNR-402-HYD
                    </span>
                  </div>
                </div>

                {/* Filter and Action Buttons */}
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-teal-900/40 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-[#071317]">
                    <Filter className="w-3 h-3 text-slate-400" />
                    <span>All Sites</span>
                  </div>
                  <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-teal-900/40 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-[#071317]">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>Last 24 Hours</span>
                  </div>
                  <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-medium transition-colors cursor-pointer">
                    <Download className="w-3 h-3" />
                    <span>Export</span>
                  </button>
                </div>
              </div>

              {/* 4 Dashboard Metric Boxes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0d2229] border border-slate-100 dark:border-teal-900/30">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-0.5">
                    Total Assets
                  </span>
                  <span className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white block font-sans">
                    <DigitCounter target={236} />
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0d2229] border border-slate-100 dark:border-teal-900/30">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-0.5">
                    Active Devices
                  </span>
                  <span className="text-lg sm:text-xl font-bold text-teal-600 dark:text-teal-400 block font-sans">
                    <DigitCounter target={198} />
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0d2229] border border-slate-100 dark:border-teal-900/30">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-0.5">
                    Live Flow Rate
                  </span>
                  <span className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white block font-sans">
                    <DigitCounter
                      target={data.heroMetrics[0]?.rawValue || 1245}
                      suffix={data.heroMetrics[0]?.suffix || " m³/hr"}
                    />
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0d2229] border border-slate-100 dark:border-teal-900/30">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-0.5">
                    Water Quality
                  </span>
                  <span className="text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400 block font-sans">
                    <DigitCounter
                      target={data.heroMetrics[1]?.rawValue || 98}
                      suffix="%"
                    />
                    <span className="text-[10px] font-normal text-slate-400 ml-1">
                      Healthy
                    </span>
                  </span>
                </div>
              </div>

              {/* 2 Middle Charts: Flow Trend + Quality Index */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 pb-4">
                {/* Flow Trend Area Chart (8 cols) */}
                <div className="sm:col-span-8 p-3.5 rounded-xl bg-slate-50 dark:bg-[#0c1f26] border border-slate-100 dark:border-teal-900/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Flow Trend (m³/hr)
                    </span>
                    <span className="text-[10px] text-teal-600 dark:text-teal-400 font-mono">
                      +10.5% vs avg
                    </span>
                  </div>
                  {/* SVG Area Chart */}
                  <div className="h-32 w-full pt-2">
                    <svg className="w-full h-full" viewBox="0 0 320 100" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="flowGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0d9488" stopOpacity="0.35" />
                          <stop offset="100%" stopColor="#0d9488" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      {/* Grid guidelines */}
                      <line x1="0" y1="25" x2="320" y2="25" stroke="#e2e8f0" strokeDasharray="3 3" opacity="0.4" />
                      <line x1="0" y1="50" x2="320" y2="50" stroke="#e2e8f0" strokeDasharray="3 3" opacity="0.4" />
                      <line x1="0" y1="75" x2="320" y2="75" stroke="#e2e8f0" strokeDasharray="3 3" opacity="0.4" />
                      {/* Area */}
                      <polygon
                        fill="url(#flowGrad)"
                        points="0,80 35,65 70,72 105,48 140,55 175,38 210,44 245,28 280,33 320,18 320,100 0,100"
                      />
                      {/* Stroke Line */}
                      <polyline
                        fill="none"
                        stroke="#0d9488"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points="0,80 35,65 70,72 105,48 140,55 175,38 210,44 245,28 280,33 320,18"
                      />
                      {/* Last datapoint dot */}
                      <circle cx="320" cy="18" r="3.5" fill="#0d9488" />
                      <circle cx="320" cy="18" r="7" fill="#0d9488" opacity="0.25" className="animate-ping" />
                    </svg>
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-1">
                    <span>00:00</span>
                    <span>04:00</span>
                    <span>08:00</span>
                    <span>12:00</span>
                    <span>16:00</span>
                    <span>20:00</span>
                  </div>
                </div>

                {/* Quality Index Bar Chart (4 cols) */}
                <div className="sm:col-span-4 p-3.5 rounded-xl bg-slate-50 dark:bg-[#0c1f26] border border-slate-100 dark:border-teal-900/30 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                      Quality Index
                    </span>
                    <span className="text-[10px] text-slate-400 block mb-2">
                      Turbidity &amp; pH Score
                    </span>
                  </div>
                  {/* Bar indicators */}
                  <div className="flex items-end justify-between gap-1.5 h-24 pt-2">
                    {[65, 80, 75, 92, 88, 96, 94].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className={`w-full rounded-t-sm transition-all duration-700 ${
                            i === 5 || i === 6
                              ? "bg-teal-600 dark:bg-teal-400"
                              : "bg-teal-700/50 dark:bg-teal-500/40"
                          }`}
                          style={{ height: `${h}%` }}
                        />
                        <span className="text-[8px] text-slate-400 font-mono">
                          D{i + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Lower Section: Asset Map (7 cols) + Recent Alerts (5 cols) */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 pt-1">
                {/* Asset Map Card (7 cols) */}
                <div className="sm:col-span-7 p-3.5 rounded-xl bg-slate-50 dark:bg-[#0c1f26] border border-slate-100 dark:border-teal-900/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Asset Network Map
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                      12 DMA Zones Online
                    </span>
                  </div>
                  {/* GIS Network Visualization */}
                  <div className="h-28 w-full rounded-lg bg-[#021316] relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:12px_12px] opacity-25" />
                    {/* SVG Pipeline Lines */}
                    <svg className="absolute inset-0 w-full h-full">
                      <line x1="40" y1="30" x2="110" y2="55" stroke="#14b8a6" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
                      <line x1="110" y1="55" x2="190" y2="35" stroke="#14b8a6" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
                      <line x1="110" y1="55" x2="160" y2="85" stroke="#14b8a6" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
                      <line x1="190" y1="35" x2="250" y2="70" stroke="#14b8a6" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
                    </svg>
                    {/* Node points */}
                    <div className="absolute top-7 left-10 w-2.5 h-2.5 rounded-full bg-teal-400 shadow-[0_0_8px_#2dd4bf]" />
                    <div className="absolute top-13 left-26 w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] animate-pulse" />
                    <div className="absolute top-8 left-46 w-2.5 h-2.5 rounded-full bg-teal-400 shadow-[0_0_8px_#2dd4bf]" />
                    <div className="absolute top-20 left-38 w-2 h-2 rounded-full bg-teal-300" />
                    <div className="absolute top-16 right-16 w-2.5 h-2.5 rounded-full bg-teal-400" />
                    {/* Floating badge */}
                    <span className="relative z-10 text-[10px] text-teal-200 bg-slate-900/80 px-2 py-0.5 rounded border border-teal-500/30">
                      Central Grid: 1.2M L/day
                    </span>
                  </div>
                </div>

                {/* Recent Alerts List (5 cols) */}
                <div className="sm:col-span-5 p-3.5 rounded-xl bg-slate-50 dark:bg-[#0c1f26] border border-slate-100 dark:border-teal-900/30 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      Recent Alerts
                    </span>
                    <div className="space-y-1.5">
                      <div className="flex items-start gap-2 text-[11px] p-1.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold leading-tight">High Pressure Detected</p>
                          <p className="text-[10px] text-amber-700/80 dark:text-amber-300/70">Main Trunk B · 2 hrs ago</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 text-[11px] p-1.5 rounded bg-teal-500/10 border border-teal-500/20 text-teal-900 dark:text-teal-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold leading-tight">Flow Rate Normal</p>
                          <p className="text-[10px] text-teal-700/80 dark:text-teal-300/70">Pump Station 4 · 12 min ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold hover:underline cursor-pointer pt-2 block">
                    View All Live Alerts →
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionOverview;
