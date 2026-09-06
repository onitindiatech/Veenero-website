import React from "react";
import { Eye, TrendingDown, TrendingUp, ShieldCheck, Landmark, Factory, Building, Globe, Radio, Search, Sliders, FileCheck2, Sparkles } from "lucide-react";

/**
 * 1. HERO IMPACT VECTOR VISUAL
 * Displays a water globe surrounded by real-time telemetry indicators and splash waves.
 */
export const HeroImpactVisual: React.FC = () => {
  return (
    <div className="relative w-full max-w-lg lg:max-w-xl mx-auto flex items-center justify-center p-4 select-none">
      {/* Background Ambient Caustic Water Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/20 via-cyan-400/20 to-blue-600/10 rounded-full blur-3xl -z-10" />

      {/* SVG Water Splash Waves Base */}
      <svg className="absolute bottom-0 w-full h-28 text-cyan-500/15 pointer-events-none" viewBox="0 0 500 120" preserveAspectRatio="none">
        <path fill="currentColor" d="M0,40 C150,90 350,-10 500,40 L500,120 L0,120 Z" />
        <path fill="currentColor" opacity="0.5" d="M0,60 C200,10 300,80 500,50 L500,120 L0,120 Z" />
      </svg>

      {/* Main Water Globe Visual */}
      <div className="relative w-72 h-72 sm:w-88 sm:h-88 lg:w-96 lg:h-96 flex items-center justify-center">
        
        {/* Globe Outer Swirl Rings SVG */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
          <defs>
            <linearGradient id="impactGlobeGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#14b8a6" />
              <stop offset="50%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0f766e" />
            </linearGradient>
          </defs>

          {/* Orbit Wave Rings */}
          <ellipse cx="200" cy="200" r1="170" r2="50" rx="170" ry="50" fill="none" stroke="#bae6fd" strokeWidth="3" strokeDasharray="6 6" transform="rotate(-20 200 200)" opacity="0.5" />
          <ellipse cx="200" cy="200" r1="140" r2="40" rx="140" ry="40" fill="none" stroke="#38bdf8" strokeWidth="2" transform="rotate(30 200 200)" opacity="0.4" />
        </svg>

        {/* Central Water Globe Sphere */}
        <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-gradient-to-br from-teal-500 via-cyan-600 to-slate-950 p-1 shadow-glow relative z-10 overflow-hidden border border-cyan-200/40">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {/* Globe Grid lines */}
            <circle cx="100" cy="100" r="95" fill="none" stroke="#38bdf8" strokeWidth="1" opacity="0.3" />
            <ellipse cx="100" cy="100" rx="95" ry="40" fill="none" stroke="#38bdf8" strokeWidth="1" opacity="0.3" />
            <ellipse cx="100" cy="100" rx="40" ry="95" fill="none" stroke="#38bdf8" strokeWidth="1" opacity="0.3" />

            {/* Continent Vectors */}
            <path d="M40 70 Q 60 50 100 60 T 150 90 T 110 130 Z" fill="#34d399" opacity="0.8" />
            <path d="M120 120 Q 150 110 165 130 T 140 160 Z" fill="#34d399" opacity="0.8" />

            {/* Telemetry Pin Nodes */}
            <circle cx="80" cy="75" r="5" fill="#38bdf8" />
            <circle cx="130" cy="95" r="5" fill="#34d399" />
            <circle cx="110" cy="135" r="4" fill="#fef08a" />
          </svg>
        </div>

        {/* --- FLOATING BADGE 1: 100% Water Visibility (Top Left) --- */}
        <div className="absolute top-2 -left-4 bg-white/95 dark:bg-slate-900/95 border border-teal-500/30 shadow-md rounded-full px-3.5 py-2 flex items-center gap-2.5 backdrop-blur-md z-20">
          <div className="w-7 h-7 rounded-full bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-teal-700 dark:text-teal-300">
            <Eye className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 pr-1">100% Visibility</span>
        </div>

        {/* --- FLOATING BADGE 2: 40% Waste Reduction (Top Right) --- */}
        <div className="absolute top-10 -right-4 bg-white/95 dark:bg-slate-900/95 border border-cyan-500/30 shadow-md rounded-full px-3.5 py-2 flex items-center gap-2.5 backdrop-blur-md z-20">
          <div className="w-7 h-7 rounded-full bg-cyan-100 dark:bg-cyan-950 flex items-center justify-center text-cyan-700 dark:text-cyan-300">
            <TrendingDown className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 pr-1">40% Waste Cut</span>
        </div>

        {/* --- FLOATING BADGE 3: Audit-Ready ESG (Bottom Left) --- */}
        <div className="absolute bottom-6 -left-2 bg-white/95 dark:bg-slate-900/95 border border-emerald-500/30 shadow-md rounded-full px-3.5 py-2 flex items-center gap-2.5 backdrop-blur-md z-20">
          <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 pr-1">Audit-Ready ESG</span>
        </div>

      </div>
    </div>
  );
};

/**
 * 2. METRIC CARD ICON
 */
export const MetricCardIcon: React.FC<{ index: number }> = ({ index }) => {
  const icons = [Eye, TrendingDown, TrendingUp, ShieldCheck];
  const IconComponent = icons[index % icons.length] || Eye;

  return (
    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-100 dark:from-teal-950 dark:to-cyan-950 border border-teal-500/30 flex items-center justify-center text-teal-700 dark:text-teal-300 shadow-sm mb-4 shrink-0">
      <IconComponent className="w-7 h-7" />
    </div>
  );
};

/**
 * 3. REAL-WORLD IMPACT DOMAIN ICON
 */
export const RealWorldImpactIcon: React.FC<{ index: number }> = ({ index }) => {
  const icons = [Landmark, Factory, Building, Globe];
  const IconComponent = icons[index % icons.length] || Landmark;

  return (
    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-50 to-cyan-100 dark:from-teal-950 dark:to-cyan-950 border border-teal-500/30 flex items-center justify-center text-teal-700 dark:text-teal-300 shadow-sm mb-5 shrink-0">
      <IconComponent className="w-7 h-7" />
    </div>
  );
};

/**
 * 4. JOURNEY 5-STEP STAGE ICON
 */
export const Journey5StepIcon: React.FC<{ index: number }> = ({ index }) => {
  const icons = [Radio, Search, Sliders, FileCheck2, Sparkles];
  const IconComponent = icons[index % icons.length] || Radio;

  return (
    <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-500/30 flex items-center justify-center text-teal-700 dark:text-teal-300 shadow-sm shrink-0">
      <IconComponent className="w-6 h-6" />
    </div>
  );
};
