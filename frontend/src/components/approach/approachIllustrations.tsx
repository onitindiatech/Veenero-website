import React from "react";
import { Radio, BarChart3, Sliders, Leaf, Activity, Cpu, LineChart, Award, SearchCheck } from "lucide-react";

/**
 * 1. HERO APPROACH VECTOR VISUAL
 * Displays a central water droplet surrounded by 4 orbital nodes representing:
 * Sense -> Intelligence -> Optimize -> Innovate.
 */
export const HeroApproachVisual: React.FC = () => {
  return (
    <div className="relative w-full max-w-lg lg:max-w-xl mx-auto flex items-center justify-center p-4 select-none">
      {/* Background Glow Caustics */}
      <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/20 via-cyan-400/20 to-blue-600/10 rounded-full blur-3xl -z-10" />

      {/* Main Orbital Journey Container */}
      <div className="relative w-72 h-72 sm:w-88 sm:h-88 lg:w-96 lg:h-96 flex items-center justify-center">
        
        {/* Orbital Stream Paths SVG */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
          <defs>
            <linearGradient id="pathGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#0f766e" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
          </defs>

          {/* Outer Orbital Ring */}
          <circle cx="200" cy="200" r="140" fill="none" stroke="url(#pathGrad)" strokeWidth="3" strokeDasharray="6 6" opacity="0.4" />
          <circle cx="200" cy="200" r="100" fill="none" stroke="#bae6fd" strokeWidth="2" opacity="0.3" />

          {/* Flow Direction Indicator Dots */}
          <circle cx="200" cy="60" r="5" fill="#38bdf8" />
          <circle cx="340" cy="200" r="5" fill="#0f766e" />
          <circle cx="200" cy="340" r="5" fill="#34d399" />
          <circle cx="60" cy="200" r="5" fill="#0284c7" />
        </svg>

        {/* Central Water Drop Core */}
        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-b from-cyan-300 via-teal-500 to-blue-700 p-1 shadow-glow relative z-10">
          <div className="w-full h-full bg-slate-950 rounded-full flex flex-col items-center justify-center text-center p-2 border border-cyan-200/40">
            <svg viewBox="0 0 100 100" className="w-12 h-12 mb-1">
              <path d="M50 15 C50 15 25 55 25 68 C25 82 36 88 50 88 C64 88 75 82 75 68 C75 55 50 15 50 15 Z" fill="#38bdf8" />
              <ellipse cx="42" cy="55" rx="5" ry="10" fill="#ffffff" opacity="0.4" transform="rotate(-20 42 55)" />
            </svg>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-200">
              WATER JOURNEY
            </span>
          </div>
        </div>

        {/* --- ORBITAL BADGE 01: Sense (Top) --- */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-white/95 dark:bg-slate-900/95 border border-teal-500/30 shadow-md rounded-full px-3.5 py-1.5 flex items-center gap-2 backdrop-blur-md z-20">
          <div className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-teal-700 dark:text-teal-300 text-xs font-bold">
            01
          </div>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100">Sense</span>
        </div>

        {/* --- ORBITAL BADGE 02: Intelligence (Right) --- */}
        <div className="absolute top-1/2 -right-4 -translate-y-1/2 bg-white/95 dark:bg-slate-900/95 border border-cyan-500/30 shadow-md rounded-full px-3.5 py-1.5 flex items-center gap-2 backdrop-blur-md z-20">
          <div className="w-6 h-6 rounded-full bg-cyan-100 dark:bg-cyan-950 flex items-center justify-center text-cyan-700 dark:text-cyan-300 text-xs font-bold">
            02
          </div>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100">Intelligence</span>
        </div>

        {/* --- ORBITAL BADGE 03: Optimize (Bottom) --- */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/95 dark:bg-slate-900/95 border border-emerald-500/30 shadow-md rounded-full px-3.5 py-1.5 flex items-center gap-2 backdrop-blur-md z-20">
          <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-300 text-xs font-bold">
            03
          </div>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100">Optimize</span>
        </div>

        {/* --- ORBITAL BADGE 04: Innovate (Left) --- */}
        <div className="absolute top-1/2 -left-4 -translate-y-1/2 bg-white/95 dark:bg-slate-900/95 border border-blue-500/30 shadow-md rounded-full px-3.5 py-1.5 flex items-center gap-2 backdrop-blur-md z-20">
          <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-700 dark:text-blue-300 text-xs font-bold">
            04
          </div>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100">Innovate</span>
        </div>

      </div>
    </div>
  );
};

/**
 * STEP 01 SENSE ILLUSTRATION
 */
export const StepSenseIllustration: React.FC = () => {
  return (
    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-100 dark:from-teal-950 dark:to-cyan-950 border border-teal-500/30 flex items-center justify-center p-2 shadow-sm shrink-0">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <rect x="15" y="55" width="70" height="22" rx="5" fill="#0284c7" />
        <rect x="42" y="25" width="16" height="30" rx="4" fill="#0f766e" />
        <circle cx="50" cy="35" r="4" fill="#38bdf8" />
        <path d="M 40 18 C 45 14, 55 14, 60 18" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M 35 12 C 48 6, 52 6, 65 12" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />
      </svg>
    </div>
  );
};

/**
 * STEP 02 INTELLIGENCE ILLUSTRATION
 */
export const StepIntelligenceIllustration: React.FC = () => {
  return (
    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-cyan-50 to-teal-100 dark:from-cyan-950 dark:to-teal-950 border border-cyan-500/30 flex items-center justify-center p-2 shadow-sm shrink-0">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <path d="M 20 40 A 15 15 0 0 1 45 25 A 18 18 0 0 1 75 35 A 12 12 0 0 1 70 55 H 20 A 12 12 0 0 1 20 40 Z" fill="#38bdf8" />
        <rect x="25" y="52" width="50" height="30" rx="4" fill="#0f766e" />
        <path d="M 32 72 L 42 62 L 52 66 L 68 56" stroke="#34d399" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    </div>
  );
};

/**
 * STEP 03 OPTIMIZE ILLUSTRATION
 */
export const StepOptimizeIllustration: React.FC = () => {
  return (
    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-950 dark:to-teal-950 border border-emerald-500/30 flex items-center justify-center p-2 shadow-sm shrink-0">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="35" fill="none" stroke="#0f766e" strokeWidth="6" />
        <path d="M 25 50 A 25 25 0 0 1 75 50" fill="none" stroke="#34d399" strokeWidth="6" strokeLinecap="round" />
        <line x1="50" y1="50" x2="68" y2="32" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
        <circle cx="50" cy="50" r="6" fill="#0f766e" />
      </svg>
    </div>
  );
};

/**
 * STEP 04 INNOVATE ILLUSTRATION
 */
export const StepInnovateIllustration: React.FC = () => {
  return (
    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-teal-50 to-blue-100 dark:from-teal-950 dark:to-blue-950 border border-blue-500/30 flex items-center justify-center p-2 shadow-sm shrink-0">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="32" fill="#0369a1" />
        <path d="M 30 45 C 40 30, 60 35, 70 50 C 60 65, 40 60, 30 45 Z" fill="#34d399" opacity="0.8" />
        <ellipse cx="50" cy="50" rx="38" ry="12" fill="none" stroke="#bae6fd" strokeWidth="3" transform="rotate(-25 50 50)" />
      </svg>
    </div>
  );
};

/**
 * CONNECTED CAPABILITIES ICON
 */
export const CapabilityIcon: React.FC<{ index: number }> = ({ index }) => {
  const icons = [Activity, Cpu, LineChart, Award, SearchCheck];
  const IconComponent = icons[index % icons.length] || Activity;

  return (
    <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-500/30 flex items-center justify-center text-teal-700 dark:text-teal-300 shadow-sm mb-5 shrink-0">
      <IconComponent className="w-6 h-6" />
    </div>
  );
};
