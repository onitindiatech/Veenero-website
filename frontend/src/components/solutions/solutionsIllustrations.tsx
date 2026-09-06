import React from "react";
import { Eye, TrendingUp, ShieldCheck, Leaf, Radio, Sparkles, LineChart, FileCheck2, Layers, ShieldAlert, Factory, Building2, Building, Server } from "lucide-react";

/**
 * ARCHITECTURE FLOW DIAGRAM (TOP VECTOR BAR IN REFERENCE IMAGE)
 * Connects 4 steps: Data Collection -> Data Transmission -> Data Intelligence -> Governance & Action
 */
export const ArchitectureFlowDiagram: React.FC = () => {
  return (
    <div className="w-full py-6 px-4 bg-gradient-to-r from-teal-50/50 via-cyan-50/30 to-teal-50/50 dark:from-teal-950/20 dark:via-cyan-950/20 dark:to-teal-950/20 rounded-2xl border border-teal-500/20 shadow-sm mb-10 select-none">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
        
        {/* STEP 1: Pipe & Sensor (Data Collection) */}
        <div className="flex flex-col items-center text-center space-y-2 group">
          <div className="w-20 h-20 rounded-2xl bg-white dark:bg-slate-900 border border-teal-500/30 shadow-soft flex items-center justify-center p-2 relative group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 80 80" className="w-full h-full">
              {/* Water Pipe */}
              <rect x="10" y="45" width="60" height="20" rx="4" fill="#0284c7" opacity="0.8" />
              <rect x="5" y="42" width="10" height="26" rx="2" fill="#0f766e" />
              <rect x="65" y="42" width="10" height="26" rx="2" fill="#0f766e" />
              {/* IoT Sensor Box on Pipe */}
              <rect x="32" y="20" width="16" height="25" rx="3" fill="#0f766e" />
              <circle cx="40" cy="28" r="4" fill="#38bdf8" />
              {/* Wireless Wave */}
              <path d="M 35 12 C 40 8, 45 8, 50 12" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" fill="none" />
              <path d="M 30 7 C 40 1, 50 1, 60 7" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />
            </svg>
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">
            01. Data Collection
          </span>
        </div>

        {/* STEP 2: Wireless Gateway (Data Transmission) */}
        <div className="flex flex-col items-center text-center space-y-2 group">
          <div className="w-20 h-20 rounded-2xl bg-white dark:bg-slate-900 border border-teal-500/30 shadow-soft flex items-center justify-center p-2 relative group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 80 80" className="w-full h-full">
              {/* Gateway Box */}
              <rect x="20" y="40" width="40" height="25" rx="6" fill="#0f766e" />
              <circle cx="30" cy="52.5" r="3" fill="#38bdf8" />
              <circle cx="40" cy="52.5" r="3" fill="#34d399" />
              <circle cx="50" cy="52.5" r="3" fill="#fef08a" />
              {/* Antennas */}
              <line x1="28" y1="40" x2="28" y2="20" stroke="#0f766e" strokeWidth="3" strokeLinecap="round" />
              <line x1="52" y1="40" x2="52" y2="20" stroke="#0f766e" strokeWidth="3" strokeLinecap="round" />
              {/* Signal Rings */}
              <circle cx="28" cy="17" r="4" fill="none" stroke="#38bdf8" strokeWidth="2" />
              <circle cx="52" cy="17" r="4" fill="none" stroke="#38bdf8" strokeWidth="2" />
            </svg>
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">
            02. Data Transmission
          </span>
        </div>

        {/* STEP 3: Cloud & Dashboard (Data Intelligence) */}
        <div className="flex flex-col items-center text-center space-y-2 group">
          <div className="w-20 h-20 rounded-2xl bg-white dark:bg-slate-900 border border-teal-500/30 shadow-soft flex items-center justify-center p-2 relative group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 80 80" className="w-full h-full">
              {/* Cloud Graphic */}
              <path d="M 22 35 A 12 12 0 0 1 40 22 A 15 15 0 0 1 62 30 A 10 10 0 0 1 60 48 H 22 A 10 10 0 0 1 22 35 Z" fill="#38bdf8" />
              {/* Dashboard Monitor */}
              <rect x="25" y="44" width="30" height="22" rx="3" fill="#0f766e" />
              <rect x="29" y="48" width="22" height="14" rx="1" fill="#0369a1" />
              {/* Chart Sparkline */}
              <path d="M 31 57 L 36 52 L 41 55 L 48 49" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">
            03. Data Intelligence
          </span>
        </div>

        {/* STEP 4: Shield Governance (Governance & Action) */}
        <div className="flex flex-col items-center text-center space-y-2 group">
          <div className="w-20 h-20 rounded-2xl bg-white dark:bg-slate-900 border border-teal-500/30 shadow-soft flex items-center justify-center p-2 relative group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 80 80" className="w-full h-full">
              {/* Shield Shape */}
              <path d="M 40 12 L 62 22 V 42 C 62 58 40 68 40 68 C 40 68 18 58 18 42 V 22 Z" fill="#0f766e" />
              {/* Inner Glow Checkmark */}
              <path d="M 32 40 L 38 46 L 50 32" stroke="#34d399" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">
            04. Governance & Action
          </span>
        </div>

      </div>
    </div>
  );
};

/**
 * 4 BENEFIT BADGES STRIP BELOW ARCHITECTURE
 */
export const BenefitBadgeItem: React.FC<{
  title: string;
  description: string;
  type: "visibility" | "efficiency" | "verification" | "impact";
}> = ({ title, description, type }) => {
  return (
    <div className="group/badge bg-card p-5 rounded-2xl border border-teal-500/20 shadow-xs flex items-center gap-4 hover:border-teal-500/40 hover:-translate-y-1 hover:shadow-card transition-all duration-300">
      <div className="w-12 h-12 rounded-full bg-teal-50 dark:bg-teal-950/40 border border-teal-500/30 flex items-center justify-center text-teal-700 dark:text-teal-300 shrink-0 group-hover/badge:scale-105 hover-ripple-subtle transition-all duration-300">
        {type === "visibility" && <Eye className="w-6 h-6" />}
        {type === "efficiency" && <TrendingUp className="w-6 h-6" />}
        {type === "verification" && <ShieldCheck className="w-6 h-6" />}
        {type === "impact" && <Leaf className="w-6 h-6" />}
      </div>
      <div>
        <h4 className="text-sm font-bold text-foreground leading-tight group-hover/badge:text-teal-700 dark:group-hover/badge:text-teal-300 transition-colors">{title}</h4>
        <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{description}</p>
      </div>
    </div>
  );
};

/**
 * PRODUCT SOLUTION CARD ICON
 */
export const ProductSolutionIcon: React.FC<{ id: string }> = ({ id }) => {
  switch (id) {
    case "sense":
      return <Radio className="w-6 h-6 text-teal-600 dark:text-teal-300 group-hover:scale-110 transition-transform duration-300" />;
    case "intelligence":
      return <Sparkles className="w-6 h-6 text-cyan-600 dark:text-cyan-300 group-hover:rotate-12 group-hover:scale-105 transition-transform duration-300" />;
    case "insights":
      return <LineChart className="w-6 h-6 text-emerald-600 dark:text-emerald-300 group-hover:-translate-y-0.5 group-hover:scale-105 transition-transform duration-300" />;
    case "verification":
      return <FileCheck2 className="w-6 h-6 text-teal-600 dark:text-teal-300 group-hover:scale-105 transition-transform duration-300" />;
    case "platform":
      return <Layers className="w-6 h-6 text-cyan-600 dark:text-cyan-300 group-hover:-translate-y-0.5 transition-transform duration-300" />;
    case "risk":
    default:
      return <ShieldAlert className="w-6 h-6 text-emerald-600 dark:text-emerald-300 group-hover:scale-105 transition-transform duration-300" />;
  }
};

/**
 * INDUSTRY APPLICATION CARD ICON
 */
export const IndustryCardIcon: React.FC<{ index: number }> = ({ index }) => {
  const icons = [Factory, Building2, Building, Server];
  const IconComponent = icons[index % icons.length] || Factory;

  return (
    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-50 to-cyan-100 dark:from-teal-950 dark:to-cyan-950 border border-teal-500/30 flex items-center justify-center text-teal-700 dark:text-teal-300 shadow-sm mb-5 shrink-0 group-hover:scale-105 group-hover:border-teal-500/50 hover-ripple-subtle transition-all duration-300">
      <IconComponent className="w-7 h-7" />
    </div>
  );
};
