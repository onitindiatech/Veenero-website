import React from "react";
import { Eye, ShieldCheck, Play, Lightbulb, Cpu, Building2, TrendingUp, Sparkles, Heart, Zap, Globe, Users } from "lucide-react";

/**
 * 1. HERO WATER INTELLIGENCE ECOSYSTEM ILLUSTRATION
 * Premium isometric smart-city water infrastructure scene:
 * buildings, reservoirs, pipes, telemetry sensors, data dashboards,
 * cloud data connectivity, flowing water — in a teal/aqua/white palette.
 * Three floating concept cards: Water Visibility (top), Water Verification (right), Water Accountability (bottom).
 */
export const HeroWaterDropIllustration: React.FC = () => {
  return (
    <div className="relative w-full max-w-2xl mx-auto flex items-center justify-center select-none" style={{ minHeight: 420 }}>
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-teal-400/10 via-cyan-300/10 to-sky-500/5 rounded-3xl blur-3xl -z-10" />

      {/* ── MAIN ECOSYSTEM PANEL ── */}
      <div
        className="relative w-full rounded-3xl overflow-visible"
        style={{ aspectRatio: '4/3', maxHeight: 420 }}
      >
        {/* Panel card with glassmorphism border */}
        <div
          className="absolute inset-0 rounded-3xl"
          style={{
            background: 'linear-gradient(145deg, #e8f8f7 0%, #d0f0ee 30%, #c2ebf5 65%, #ddf1fb 100%)',
            boxShadow: '0 24px 64px -12px rgba(15,118,110,0.18), 0 4px 20px -4px rgba(2,132,199,0.12)',
            border: '1.5px solid rgba(20,184,166,0.25)',
          }}
        />

        {/* Main SVG ecosystem scene */}
        <svg
          viewBox="0 0 540 400"
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            {/* Sky gradient */}
            <linearGradient id="heroSkyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e0f7fa" />
              <stop offset="50%" stopColor="#b2ebf2" />
              <stop offset="100%" stopColor="#80deea" stopOpacity="0.4" />
            </linearGradient>
            {/* Water river gradient */}
            <linearGradient id="heroRiverGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            {/* Building dark teal */}
            <linearGradient id="heroBldDark" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#134e4a" />
              <stop offset="100%" stopColor="#0f3a36" />
            </linearGradient>
            {/* Building mid teal */}
            <linearGradient id="heroBldMid" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0f766e" />
              <stop offset="100%" stopColor="#0d5e58" />
            </linearGradient>
            {/* Building light teal */}
            <linearGradient id="heroBldLight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2dd4bf" />
              <stop offset="100%" stopColor="#14b8a6" />
            </linearGradient>
            {/* Reservoir gradient */}
            <linearGradient id="heroTankGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#64748b" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
            {/* Ground/terrain */}
            <linearGradient id="heroGroundGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ccfbf1" />
              <stop offset="100%" stopColor="#99f6e4" />
            </linearGradient>
            {/* Dashboard panel */}
            <linearGradient id="heroDashGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0f766e" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            {/* Cloud gradient */}
            <linearGradient id="heroCloudGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#e0f7fa" />
            </linearGradient>
            {/* Pipe gradient */}
            <linearGradient id="heroPipeGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>
            {/* Glow filter */}
            <filter id="heroGlow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="heroBigGlow">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            {/* Shadow filter */}
            <filter id="heroShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#0f766e" floodOpacity="0.18"/>
            </filter>
          </defs>

          {/* ── SKY BACKGROUND ── */}
          <rect x="0" y="0" width="540" height="280" fill="url(#heroSkyGrad)" />

          {/* ── GROUND PLATFORM ── */}
          <ellipse cx="270" cy="285" rx="240" ry="55" fill="url(#heroGroundGrad)" opacity="0.7" />
          <ellipse cx="270" cy="285" rx="210" ry="42" fill="#b2f5ea" opacity="0.5" />

          {/* ══════════════════════════════════════════════ */}
          {/* ── DATA DASHBOARD FLOATING PANEL (top center) ── */}
          {/* ══════════════════════════════════════════════ */}
          <g transform="translate(180,20)" filter="url(#heroShadow)">
            {/* Panel background */}
            <rect x="0" y="0" width="180" height="90" rx="10" fill="url(#heroDashGrad)" />
            <rect x="0" y="0" width="180" height="90" rx="10" fill="white" fillOpacity="0.07" />
            {/* Panel header bar */}
            <rect x="0" y="0" width="180" height="22" rx="10" fill="white" fillOpacity="0.12" />
            <rect x="0" y="11" width="180" height="11" fill="white" fillOpacity="0.12" />
            {/* Header dots */}
            <circle cx="12" cy="11" r="4" fill="#f87171" />
            <circle cx="24" cy="11" r="4" fill="#fbbf24" />
            <circle cx="36" cy="11" r="4" fill="#34d399" />
            {/* Header label */}
            <rect x="48" y="7" width="60" height="8" rx="3" fill="white" fillOpacity="0.5" />
            {/* Bar chart */}
            <rect x="12" y="60" width="10" height="22" rx="2" fill="#38bdf8" fillOpacity="0.9" />
            <rect x="28" y="48" width="10" height="34" rx="2" fill="#2dd4bf" fillOpacity="0.9" />
            <rect x="44" y="38" width="10" height="44" rx="2" fill="#38bdf8" fillOpacity="0.9" />
            <rect x="60" y="52" width="10" height="30" rx="2" fill="#7dd3fc" fillOpacity="0.9" />
            <rect x="76" y="42" width="10" height="40" rx="2" fill="#2dd4bf" fillOpacity="0.9" />
            {/* Line chart */}
            <polyline points="100,72 115,55 128,63 143,44 158,50 170,38" stroke="#fde68a" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="143" cy="44" r="3.5" fill="#fde68a" filter="url(#heroGlow)" />
            {/* Sparkle dot */}
            <circle cx="170" cy="38" r="3" fill="#ffffff" filter="url(#heroGlow)" />
            {/* Water flow label */}
            <rect x="100" y="72" width="72" height="9" rx="3" fill="white" fillOpacity="0.2" />
          </g>

          {/* Data signal lines from dashboard down to buildings */}
          <line x1="270" y1="110" x2="200" y2="170" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="5,4" opacity="0.5" />
          <line x1="270" y1="110" x2="310" y2="175" stroke="#2dd4bf" strokeWidth="1.5" strokeDasharray="5,4" opacity="0.5" />
          <line x1="270" y1="110" x2="390" y2="190" stroke="#7dd3fc" strokeWidth="1.5" strokeDasharray="5,4" opacity="0.4" />

          {/* ══════════════════════ */}
          {/* ── CLOUD NODES (top) ── */}
          {/* ══════════════════════ */}
          {/* Cloud left */}
          <g transform="translate(32,45)">
            <ellipse cx="38" cy="22" rx="38" ry="18" fill="url(#heroCloudGrad)" opacity="0.92" />
            <ellipse cx="22" cy="28" rx="22" ry="13" fill="url(#heroCloudGrad)" opacity="0.92" />
            <ellipse cx="54" cy="28" rx="20" ry="12" fill="url(#heroCloudGrad)" opacity="0.92" />
            {/* WiFi arcs */}
            <path d="M28 42 Q38 34 48 42" stroke="#0f766e" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7" />
            <path d="M22 48 Q38 36 54 48" stroke="#0f766e" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.4" />
            <circle cx="38" cy="52" r="3" fill="#0f766e" opacity="0.7" />
          </g>
          {/* Cloud right */}
          <g transform="translate(420,30)">
            <ellipse cx="38" cy="22" rx="42" ry="20" fill="url(#heroCloudGrad)" opacity="0.88" />
            <ellipse cx="20" cy="30" rx="22" ry="13" fill="url(#heroCloudGrad)" opacity="0.88" />
            <ellipse cx="56" cy="28" rx="22" ry="13" fill="url(#heroCloudGrad)" opacity="0.88" />
            {/* data dots */}
            <circle cx="28" cy="26" r="3" fill="#38bdf8" opacity="0.8" />
            <circle cx="38" cy="20" r="3" fill="#2dd4bf" opacity="0.8" />
            <circle cx="50" cy="24" r="3" fill="#38bdf8" opacity="0.8" />
          </g>

          {/* ════════════════════════════════ */}
          {/* ── BUILDINGS (left cluster) ── */}
          {/* ════════════════════════════════ */}
          {/* Building L-1 (tallest) */}
          <g transform="translate(62, 130)">
            <rect x="0" y="0" width="38" height="130" rx="3" fill="url(#heroBldDark)" />
            {/* window grid */}
            {[0,1,2,3,4,5].map(row =>
              [0,1].map(col => (
                <rect key={`lw${row}${col}`} x={6 + col*16} y={8 + row*20} width="10" height="13" rx="1.5" fill="#7dd3fc" fillOpacity="0.7" />
              ))
            )}
            {/* Roof antenna */}
            <rect x="18" y="-12" width="3" height="12" fill="#94a3b8" />
            <circle cx="19.5" cy="-14" r="4" fill="#38bdf8" filter="url(#heroGlow)" opacity="0.9" />
          </g>
          {/* Building L-2 (medium) */}
          <g transform="translate(106, 165)">
            <rect x="0" y="0" width="30" height="95" rx="3" fill="url(#heroBldMid)" />
            {[0,1,2].map(row =>
              [0,1].map(col => (
                <rect key={`l2w${row}${col}`} x={4 + col*14} y={8 + row*22} width="9" height="14" rx="1.5" fill="#bae6fd" fillOpacity="0.6" />
              ))
            )}
          </g>
          {/* Building L-3 (short) */}
          <g transform="translate(140, 200)">
            <rect x="0" y="0" width="24" height="60" rx="3" fill="#0d9488" />
            {[0,1].map(row =>
              [0].map(col => (
                <rect key={`l3w${row}${col}`} x={4} y={8 + row*22} width="16" height="13" rx="1.5" fill="#a5f3fc" fillOpacity="0.55" />
              ))
            )}
          </g>

          {/* ════════════════════════════════════ */}
          {/* ── CENTRAL SMART BUILDING (hero) ── */}
          {/* ════════════════════════════════════ */}
          <g transform="translate(215, 100)">
            {/* Tall centre tower */}
            <rect x="0" y="0" width="60" height="170" rx="4" fill="url(#heroBldDark)" filter="url(#heroShadow)" />
            {/* glass facade shimmer */}
            <rect x="4" y="0" width="16" height="170" rx="2" fill="white" fillOpacity="0.06" />
            {/* window grid */}
            {[0,1,2,3,4,5,6].map(row =>
              [0,1,2].map(col => (
                <rect key={`cw${row}${col}`} x={8 + col*17} y={10 + row*22} width="11" height="15" rx="1.5" fill="#7dd3fc" fillOpacity={0.55 + (row % 2) * 0.2} />
              ))
            )}
            {/* Rooftop solar array */}
            <rect x="4" y="-8" width="52" height="10" rx="2" fill="#0284c7" opacity="0.9" />
            <line x1="14" y1="-8" x2="14" y2="2" stroke="white" strokeWidth="1" opacity="0.4" />
            <line x1="24" y1="-8" x2="24" y2="2" stroke="white" strokeWidth="1" opacity="0.4" />
            <line x1="34" y1="-8" x2="34" y2="2" stroke="white" strokeWidth="1" opacity="0.4" />
            <line x1="44" y1="-8" x2="44" y2="2" stroke="white" strokeWidth="1" opacity="0.4" />
            {/* Antenna mast */}
            <rect x="27" y="-22" width="6" height="16" fill="#94a3b8" />
            <circle cx="30" cy="-24" r="5" fill="#f59e0b" filter="url(#heroGlow)" opacity="0.9" />
            {/* Wifi signal rings from antenna */}
            <path d="M22 -18 Q30 -30 38 -18" stroke="#38bdf8" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.8" />
            <path d="M16 -14 Q30 -36 44 -14" stroke="#38bdf8" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.5" />
          </g>

          {/* ════════════════════════════ */}
          {/* ── RIGHT CLUSTER: reservoir + plant ── */}
          {/* ════════════════════════════ */}
          {/* Water tower / reservoir (cylindrical) */}
          <g transform="translate(318, 155)">
            {/* Tower legs */}
            <line x1="14" y1="82" x2="4" y2="115" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
            <line x1="30" y1="82" x2="20" y2="115" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
            <line x1="46" y1="82" x2="56" y2="115" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
            <line x1="62" y1="82" x2="72" y2="115" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
            {/* Cross braces */}
            <line x1="4" y1="95" x2="72" y2="95" stroke="#94a3b8" strokeWidth="2" opacity="0.5" />
            <line x1="4" y1="108" x2="72" y2="108" stroke="#94a3b8" strokeWidth="2" opacity="0.5" />
            {/* Tank body ellipse top */}
            <ellipse cx="38" cy="60" rx="38" ry="14" fill="#475569" />
            {/* Tank cylinder */}
            <rect x="0" y="60" width="76" height="50" rx="0" fill="url(#heroTankGrad)" />
            {/* Tank bottom ellipse */}
            <ellipse cx="38" cy="110" rx="38" ry="14" fill="#334155" />
            {/* Water fill indicator */}
            <ellipse cx="38" cy="84" rx="32" ry="10" fill="#38bdf8" opacity="0.35" />
            {/* Tank highlight */}
            <ellipse cx="38" cy="60" rx="38" ry="14" fill="white" fillOpacity="0.12" />
            {/* Vent pipe */}
            <rect x="34" y="38" width="8" height="22" fill="#64748b" />
            <rect x="28" y="34" width="20" height="6" rx="2" fill="#475569" />
            {/* Sensor on tank */}
            <circle cx="68" cy="75" r="5" fill="#34d399" filter="url(#heroGlow)" />
            <circle cx="68" cy="75" r="9" fill="none" stroke="#34d399" strokeWidth="1.5" opacity="0.5" />
          </g>

          {/* Water treatment plant building */}
          <g transform="translate(400, 185)">
            <rect x="0" y="0" width="80" height="75" rx="4" fill="url(#heroBldMid)" />
            {/* Dome on top */}
            <ellipse cx="40" cy="0" rx="30" ry="12" fill="#0f766e" />
            <ellipse cx="40" cy="0" rx="28" ry="10" fill="#14b8a6" opacity="0.7" />
            {/* windows */}
            {[0,1].map(row =>
              [0,1,2].map(col => (
                <rect key={`pw${row}${col}`} x={6 + col*24} y={12 + row*26} width="16" height="18" rx="2" fill="#bae6fd" fillOpacity="0.5" />
              ))
            )}
            {/* Chimney */}
            <rect x="60" y="-25" width="12" height="26" rx="2" fill="#64748b" />
            <ellipse cx="66" cy="-25" rx="8" ry="4" fill="#475569" />
            {/* Flow gauge */}
            <circle cx="66" cy="40" r="10" fill="white" fillOpacity="0.15" />
            <circle cx="66" cy="40" r="6" fill="#38bdf8" opacity="0.7" />
          </g>

          {/* ════════════════════════ */}
          {/* ── PIPES NETWORK ── */}
          {/* ════════════════════════ */}
          {/* Main horizontal pipe from plant to buildings */}
          <rect x="165" y="252" width="240" height="10" rx="5" fill="url(#heroPipeGrad)" opacity="0.85" />
          {/* Pipe connector joints */}
          <circle cx="205" cy="257" r="7" fill="#64748b" />
          <circle cx="280" cy="257" r="7" fill="#475569" />
          <circle cx="355" cy="257" r="7" fill="#64748b" />
          {/* Vertical pipe drops */}
          <rect x="198" y="230" width="10" height="27" rx="4" fill="#64748b" opacity="0.8" />
          <rect x="348" y="226" width="10" height="32" rx="4" fill="#64748b" opacity="0.8" />
          {/* Water flow animated dots on pipe */}
          <circle cx="220" cy="257" r="3.5" fill="#38bdf8" opacity="0.9" />
          <circle cx="260" cy="257" r="3.5" fill="#38bdf8" opacity="0.7" />
          <circle cx="300" cy="257" r="3.5" fill="#38bdf8" opacity="0.9" />
          <circle cx="340" cy="257" r="3.5" fill="#38bdf8" opacity="0.7" />

          {/* ══════════════════════ */}
          {/* ── WATER RIVER ── */}
          {/* ══════════════════════ */}
          <path
            d="M0,310 C60,290 100,320 160,305 C200,295 230,325 280,310 C330,295 380,320 440,305 C480,296 510,315 540,308 L540,400 L0,400 Z"
            fill="url(#heroRiverGrad)"
            opacity="0.75"
          />
          <path
            d="M0,325 C80,310 140,340 200,322 C260,304 310,338 380,320 C420,310 480,330 540,320 L540,400 L0,400 Z"
            fill="#38bdf8"
            opacity="0.35"
          />
          {/* River surface glimmers */}
          <ellipse cx="100" cy="335" rx="30" ry="5" fill="white" opacity="0.2" />
          <ellipse cx="280" cy="328" rx="40" ry="5" fill="white" opacity="0.18" />
          <ellipse cx="450" cy="333" rx="28" ry="4" fill="white" opacity="0.2" />

          {/* ═══════════════════════════════ */}
          {/* ── TELEMETRY SENSORS ── */}
          {/* ═══════════════════════════════ */}
          {/* Sensor 1 */}
          <g transform="translate(80,262)">
            <rect x="-6" y="0" width="12" height="22" rx="3" fill="#0f766e" />
            <rect x="-3" y="-5" width="6" height="8" rx="1.5" fill="#475569" />
            <circle cx="0" cy="-8" r="4" fill="#34d399" filter="url(#heroGlow)" />
            <path d="M-8 -4 Q0 -14 8 -4" stroke="#34d399" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.8" />
            <path d="M-13 -1 Q0 -18 13 -1" stroke="#34d399" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.45" />
          </g>
          {/* Sensor 2 */}
          <g transform="translate(470,255)">
            <rect x="-6" y="0" width="12" height="22" rx="3" fill="#0f766e" />
            <rect x="-3" y="-5" width="6" height="8" rx="1.5" fill="#475569" />
            <circle cx="0" cy="-8" r="4" fill="#38bdf8" filter="url(#heroGlow)" />
            <path d="M-8 -4 Q0 -14 8 -4" stroke="#38bdf8" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.8" />
            <path d="M-13 -1 Q0 -18 13 -1" stroke="#38bdf8" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.45" />
          </g>
          {/* Sensor 3 (floating on river bank) */}
          <g transform="translate(230,275)">
            <rect x="-5" y="0" width="10" height="18" rx="2.5" fill="#0d9488" />
            <circle cx="0" cy="-6" r="3.5" fill="#f59e0b" filter="url(#heroGlow)" opacity="0.95" />
            <path d="M-7 -3 Q0 -12 7 -3" stroke="#f59e0b" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7" />
          </g>

          {/* ════════════════════════════════ */}
          {/* ── TREES & GREENERY ── */}
          {/* ════════════════════════════════ */}
          {/* Trees left */}
          <g transform="translate(30, 225)">
            <rect x="8" y="28" width="6" height="20" fill="#6b7280" />
            <ellipse cx="11" cy="22" rx="14" ry="18" fill="#34d399" opacity="0.85" />
            <ellipse cx="11" cy="16" rx="10" ry="13" fill="#10b981" opacity="0.9" />
          </g>
          <g transform="translate(48, 232)">
            <rect x="6" y="24" width="5" height="16" fill="#6b7280" />
            <ellipse cx="8.5" cy="18" rx="11" ry="14" fill="#34d399" opacity="0.8" />
            <ellipse cx="8.5" cy="13" rx="8" ry="10" fill="#10b981" opacity="0.88" />
          </g>
          {/* Trees right */}
          <g transform="translate(500, 218)">
            <rect x="8" y="30" width="6" height="22" fill="#6b7280" />
            <ellipse cx="11" cy="24" rx="15" ry="19" fill="#34d399" opacity="0.8" />
            <ellipse cx="11" cy="17" rx="11" ry="14" fill="#10b981" opacity="0.88" />
          </g>

          {/* ══════════════════════ */}
          {/* ── AMBIENT BUBBLES ── */}
          {/* ══════════════════════ */}
          <circle cx="155" cy="298" r="4" fill="#38bdf8" opacity="0.6" />
          <circle cx="370" cy="304" r="3" fill="#2dd4bf" opacity="0.55" />
          <circle cx="490" cy="295" r="5" fill="#38bdf8" opacity="0.45" />
          <circle cx="60" cy="305" r="3.5" fill="#7dd3fc" opacity="0.5" />

          {/* ════════════════════════════════════ */}
          {/* ── SUBTLE GLOW ACCENTS ── */}
          {/* ════════════════════════════════════ */}
          <ellipse cx="245" cy="268" rx="60" ry="18" fill="#38bdf8" opacity="0.08" />
          <ellipse cx="356" cy="200" rx="50" ry="15" fill="#0f766e" opacity="0.07" />
        </svg>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* ── FLOATING CONCEPT CARDS (absolutely positioned over SVG) ── */}
        {/* ══════════════════════════════════════════════════════════════ */}

        {/* CARD 1: Water Visibility — top left */}
        <div
          className="absolute animate-float z-20"
          style={{ top: '-18px', left: '-8px' }}
        >
          <div
            className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl px-3.5 py-2.5 flex items-start gap-3 hover:scale-105 transition-transform duration-200"
            style={{
              boxShadow: '0 8px 32px -4px rgba(15,118,110,0.18), 0 2px 8px rgba(0,0,0,0.07)',
              border: '1px solid rgba(20,184,166,0.22)',
              minWidth: 176,
            }}
          >
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950 flex items-center justify-center text-teal-600 dark:text-teal-300 shrink-0 mt-0.5" style={{ border: '1.5px solid rgba(20,184,166,0.3)' }}>
              <Eye className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-800 dark:text-slate-100 leading-tight">Water Visibility</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5">Real-time insights into<br/>every drop and every asset.</p>
            </div>
          </div>
        </div>

        {/* CARD 2: Water Verification — top right */}
        <div
          className="absolute animate-float animation-delay-400 z-20"
          style={{ top: '52px', right: '-12px' }}
        >
          <div
            className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl px-3.5 py-2.5 flex items-start gap-3 hover:scale-105 transition-transform duration-200"
            style={{
              boxShadow: '0 8px 32px -4px rgba(2,132,199,0.15), 0 2px 8px rgba(0,0,0,0.07)',
              border: '1px solid rgba(56,189,248,0.22)',
              minWidth: 172,
            }}
          >
            <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950 flex items-center justify-center text-sky-600 dark:text-sky-300 shrink-0 mt-0.5" style={{ border: '1.5px solid rgba(56,189,248,0.28)' }}>
              <ShieldCheck className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-800 dark:text-slate-100 leading-tight">Water Verification</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5">Verified data you can<br/>trust and act on.</p>
            </div>
          </div>
        </div>

        {/* CARD 3: Water Accountability — bottom center */}
        <div
          className="absolute animate-float animation-delay-600 z-20"
          style={{ bottom: '-20px', left: '50%', transform: 'translateX(-50%)' }}
        >
          <div
            className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl px-3.5 py-2.5 flex items-start gap-3 hover:scale-105 transition-transform duration-200"
            style={{
              boxShadow: '0 8px 32px -4px rgba(16,185,129,0.15), 0 2px 8px rgba(0,0,0,0.07)',
              border: '1px solid rgba(52,211,153,0.22)',
              minWidth: 190,
            }}
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-300 shrink-0 mt-0.5" style={{ border: '1.5px solid rgba(52,211,153,0.28)' }}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4l3 3" />
              </svg>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-800 dark:text-slate-100 leading-tight">Water Accountability</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5">Transparent, traceable, and<br/>auditable water operations.</p>
            </div>
          </div>
        </div>

        {/* Ambient glow underneath panel */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-12 bg-teal-400/15 blur-2xl rounded-full -z-10" />
      </div>
    </div>
  );
};

/**
 * 2. VIDEO CARD ILLUSTRATION (OUR STORY & ORIGIN)
 * Underwater ocean scene with soft seabed, rising bubbles, caustic lighting, play button overlay.
 */
export const VideoCardIllustration: React.FC<{ onPlayClick?: () => void }> = ({ onPlayClick }) => {
  return (
    <div
      onClick={onPlayClick}
      className="relative w-full h-72 sm:h-80 md:h-96 rounded-2xl overflow-hidden border border-teal-500/20 shadow-card bg-slate-950 group cursor-pointer select-none"
    >
      {/* Deep Sea Aqua Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-900 via-teal-950 to-slate-950" />

      {/* Caustic Water Light Rays */}
      <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" viewBox="0 0 400 300" preserveAspectRatio="none">
        <path d="M50 0 L150 300 L120 300 L30 0 Z" fill="#38bdf8" />
        <path d="M180 0 L280 300 L240 300 L140 0 Z" fill="#2dd4bf" opacity="0.6" />
        <path d="M300 0 L380 300 L350 300 L270 0 Z" fill="#38bdf8" opacity="0.4" />
      </svg>

      {/* Underwater Coral / Seabed Silhouette Vector */}
      <svg className="absolute bottom-0 inset-x-0 w-full h-24 text-teal-900/60 pointer-events-none" viewBox="0 0 400 100" preserveAspectRatio="none">
        <path fill="currentColor" d="M0,100 C50,80 80,60 100,100 C120,70 150,90 180,100 C220,60 260,85 300,100 C340,75 370,90 400,100 Z" />
        <circle cx="80" cy="70" r="15" fill="#134e4a" opacity="0.7" />
        <circle cx="320" cy="65" r="20" fill="#134e4a" opacity="0.7" />
      </svg>

      {/* Rising Animated Water Bubbles */}
      <div className="absolute bottom-2 left-[15%] w-3 h-3 rounded-full bg-cyan-200/40 border border-white/60 animate-bubble" />
      <div className="absolute bottom-2 left-[40%] w-5 h-5 rounded-full bg-teal-200/30 border border-white/50 animate-bubble animation-delay-400" />
      <div className="absolute bottom-2 right-[25%] w-4 h-4 rounded-full bg-cyan-300/40 border border-white/60 animate-bubble animation-delay-600" />
      <div className="absolute bottom-2 right-[10%] w-2 h-2 rounded-full bg-white/50 animate-bubble animation-delay-200" />

      {/* Centered Play Button Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <div className="relative flex items-center justify-center">
          {/* Pulsing Ripple Rings */}
          <div className="absolute w-20 h-20 rounded-full bg-teal-400/30 animate-ping" />
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/90 text-teal-800 flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-300">
            <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1" />
          </div>
        </div>
        <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-cyan-200/90">Watch Overview</p>
      </div>

      {/* Bottom Info Bar */}
      <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent z-20">
        <h4 className="text-sm font-bold text-white">Our Journey in Motion</h4>
        <p className="text-xs text-cyan-200/80">Watch how we're transforming water management</p>
      </div>
    </div>
  );
};

/**
 * 3. IMPACT STATS ILLUSTRATION CARDS
 */
export const ImpactStatCard: React.FC<{
  statValue: string;
  statLabel: string;
  type: "litres" | "sensors" | "datapoints" | "cities";
}> = ({ statValue, statLabel, type }) => {
  return (
    <div className="group bg-card rounded-2xl p-6 sm:p-7 border border-teal-500/20 hover:border-teal-500/40 shadow-sm hover:shadow-soft transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden">
      {/* Background Soft Blob */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />

      {/* Custom Vector Water Graphic Container */}
      <div className="w-24 h-24 sm:w-28 sm:h-28 mb-4 relative flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
        {type === "litres" && (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <linearGradient id="dropGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0f766e" />
              </linearGradient>
            </defs>
            {/* Outer Ripple Wave */}
            <circle cx="50" cy="65" r="30" fill="none" stroke="#bae6fd" strokeWidth="2" strokeDasharray="4 4" className="animate-spin" style={{ animationDuration: "12s" }} />
            {/* Water Drop Shape */}
            <path d="M50 15 C50 15 20 55 20 68 C20 84 33 90 50 90 C67 90 80 84 80 68 C80 55 50 15 50 15 Z" fill="url(#dropGrad)" />
            <ellipse cx="40" cy="55" rx="6" ry="12" fill="#ffffff" opacity="0.4" transform="rotate(-20 40 55)" />
            {/* Telemetry wave rings */}
            <path d="M30 65 Q 50 55 70 65" stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.8" />
          </svg>
        )}

        {type === "sensors" && (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <linearGradient id="sensorGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#0f766e" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
            </defs>
            {/* Sensor Device Body */}
            <rect x="35" y="30" width="30" height="50" rx="15" fill="url(#sensorGrad)" />
            <rect x="42" y="38" width="16" height="12" rx="3" fill="#bae6fd" />
            <circle cx="50" cy="62" r="5" fill="#34d399" />
            {/* Wireless Radio Signals */}
            <path d="M22 40 C 12 45, 12 55, 22 60" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" fill="none" className="animate-pulse" />
            <path d="M78 40 C 88 45, 88 55, 78 60" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" fill="none" className="animate-pulse animation-delay-200" />
            {/* Water Flow Drops */}
            <circle cx="50" cy="15" r="4" fill="#38bdf8" className="animate-bounce" />
          </svg>
        )}

        {type === "datapoints" && (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <linearGradient id="cloudGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
            </defs>
            {/* Cloud Shape */}
            <path d="M25 55 A 18 18 0 0 1 50 35 A 22 22 0 0 1 80 48 A 16 16 0 0 1 78 72 H 25 A 16 16 0 0 1 25 55 Z" fill="url(#cloudGrad)" />
            {/* Analytics Bar Chart inside/below cloud */}
            <rect x="35" y="60" width="6" height="15" rx="2" fill="#ffffff" />
            <rect x="47" y="52" width="6" height="23" rx="2" fill="#34d399" />
            <rect x="59" y="45" width="6" height="30" rx="2" fill="#fef08a" />
            {/* Sparkle Points */}
            <circle cx="25" cy="30" r="3" fill="#38bdf8" className="animate-ping" />
            <circle cx="75" cy="25" r="4" fill="#34d399" className="animate-ping animation-delay-400" />
          </svg>
        )}

        {type === "cities" && (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <linearGradient id="globeGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#14b8a6" />
                <stop offset="100%" stopColor="#0369a1" />
              </linearGradient>
            </defs>
            {/* Globe Sphere */}
            <circle cx="50" cy="50" r="35" fill="url(#globeGrad)" />
            {/* Water Wave Swirl around Globe */}
            <ellipse cx="50" cy="50" rx="42" ry="14" fill="none" stroke="#bae6fd" strokeWidth="4" transform="rotate(-25 50 50)" className="animate-pulse" />
            {/* Continents Vector */}
            <path d="M30 40 Q 40 30 55 35 T 65 50 T 45 65 Z" fill="#34d399" opacity="0.8" />
            <path d="M60 60 Q 70 55 75 65 T 65 75 Z" fill="#34d399" opacity="0.8" />
            {/* Location Pin Nodes */}
            <circle cx="45" cy="42" r="4" fill="#ef4444" />
            <circle cx="62" cy="52" r="3" fill="#f59e0b" />
          </svg>
        )}
      </div>

      {/* Stat Number */}
      <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-teal-800 dark:text-teal-300 tracking-tight mb-1">
        {statValue}
      </h3>

      {/* Stat Label */}
      <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 max-w-[12rem] leading-snug">
        {statLabel}
      </p>
    </div>
  );
};

/**
 * 4. ROADMAP TIMELINE MILESTONE VECTOR ICONS
 */
export const MilestoneWaterIcon: React.FC<{ year: string; iconType: string }> = ({ iconType }) => {
  switch (iconType) {
    case "idea":
      return <Lightbulb className="w-6 h-6 text-teal-600 dark:text-teal-300" />;
    case "prototype":
      return <Cpu className="w-6 h-6 text-cyan-600 dark:text-cyan-300" />;
    case "adoption":
      return <Building2 className="w-6 h-6 text-teal-600 dark:text-teal-300" />;
    case "scale":
      return <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-300" />;
    case "future":
    default:
      return <Sparkles className="w-6 h-6 text-cyan-500 dark:text-cyan-300" />;
  }
};

/**
 * 5. CORE VALUES ILLUSTRATION CARDS
 */
export const ValueCardIllustration: React.FC<{ index: number; title: string }> = ({ index }) => {
  const valueTypes = ["purpose", "integrity", "scale", "innovation", "together"];
  const type = valueTypes[index % valueTypes.length];

  return (
    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-100 dark:from-teal-950 dark:to-cyan-950 border border-teal-500/30 flex items-center justify-center text-teal-700 dark:text-teal-300 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 mb-4 shrink-0">
      {type === "purpose" && <Heart className="w-8 h-8 fill-teal-500/20 text-teal-600" />}
      {type === "integrity" && <ShieldCheck className="w-8 h-8 fill-teal-500/20 text-teal-600" />}
      {type === "scale" && <Globe className="w-8 h-8 fill-cyan-500/20 text-cyan-600" />}
      {type === "innovation" && <Zap className="w-8 h-8 fill-emerald-500/20 text-emerald-600" />}
      {type === "together" && <Users className="w-8 h-8 fill-teal-500/20 text-teal-600" />}
    </div>
  );
};
