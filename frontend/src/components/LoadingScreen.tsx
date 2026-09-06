import React, { useState, useEffect } from "react";
import waterAnimation from "@/assets/animations/Water filling up.svg";
import veeneroLogo from "@/assets/veenero_logo.png";

interface LoadingScreenProps {
  /** Minimum presentation time in ms to allow smooth water rising (default: 2200ms) */
  minDisplayTime?: number;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ minDisplayTime = 2200 }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Lock body scroll while loader is active to prevent page content shift or peeking
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Wait for minimum presentation time and document load
    const minTimer = new Promise((resolve) => setTimeout(resolve, minDisplayTime));
    const loadPromise = new Promise((resolve) => {
      if (document.readyState === "complete") {
        resolve(true);
      } else {
        const onPageLoad = () => resolve(true);
        window.addEventListener("load", onPageLoad, { once: true });
        setTimeout(() => resolve(true), 3500); // safety fallback
      }
    });

    let fadeTimer: NodeJS.Timeout;

    Promise.all([minTimer, loadPromise]).then(() => {
      setIsFading(true);
      fadeTimer = setTimeout(() => {
        setIsVisible(false);
        document.body.style.overflow = originalOverflow;
      }, 700); // 700ms graceful fade transition
    });

    return () => {
      if (fadeTimer) clearTimeout(fadeTimer);
      document.body.style.overflow = originalOverflow;
    };
  }, [minDisplayTime]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      id="veenero-root-loader"
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#f4fafc] transition-opacity duration-700 ease-out select-none ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{ willChange: "opacity" }}
      aria-busy={!isFading}
      aria-live="polite"
      role="status"
    >
      <style>{`
        @keyframes float-bubble-1 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.35; }
          50% { transform: translate(-3px, -8px) scale(1.08); opacity: 0.7; }
        }
        @keyframes float-bubble-2 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
          50% { transform: translate(4px, -10px) scale(1.1); opacity: 0.65; }
        }
        @keyframes float-bubble-3 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
          50% { transform: translate(-2px, -6px) scale(0.95); opacity: 0.75; }
        }
        @keyframes float-bubble-4 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.25; }
          50% { transform: translate(3px, -7px) scale(1.05); opacity: 0.6; }
        }
        @keyframes progress-ring-spin {
          0% { transform: rotate(0deg); stroke-dashoffset: 240; }
          50% { stroke-dashoffset: 120; }
          100% { transform: rotate(360deg); stroke-dashoffset: 240; }
        }
        @keyframes indicator-pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        .bubble-1 { animation: float-bubble-1 4.2s ease-in-out infinite; }
        .bubble-2 { animation: float-bubble-2 4.8s ease-in-out infinite 0.6s; }
        .bubble-3 { animation: float-bubble-3 3.9s ease-in-out infinite 1.2s; }
        .bubble-4 { animation: float-bubble-4 4.5s ease-in-out infinite 1.8s; }
        .progress-ring {
          transform-origin: center;
          animation: progress-ring-spin 6s linear infinite;
        }
        .loading-dot {
          animation: indicator-pulse 1.8s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .bubble-1, .bubble-2, .bubble-3, .bubble-4, .progress-ring, .loading-dot {
            animation: none !important;
          }
        }
      `}</style>

      {/* Subtle ambient water glow in center */}
      <div className="absolute w-[460px] h-[460px] rounded-full bg-gradient-radial from-sky-200/25 via-teal-100/15 to-transparent pointer-events-none blur-2xl -z-10" />

      <div className="flex flex-col items-center justify-center">
        {/* Animated Water Orb Vessel with Progress Ring and Subtle Floating Particles */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-60 md:h-60 flex items-center justify-center">
          
          {/* Very subtle thin circular progress ring surrounding the orb */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none -rotate-90" viewBox="0 0 200 200">
            {/* Background stationary ring track */}
            <circle
              cx="100"
              cy="100"
              r="73"
              fill="none"
              stroke="rgba(0, 182, 254, 0.12)"
              strokeWidth="1.2"
            />
            {/* Subtle animated progress stroke */}
            <circle
              cx="100"
              cy="100"
              r="73"
              fill="none"
              stroke="rgba(0, 182, 254, 0.45)"
              strokeWidth="1.5"
              strokeDasharray="160 300"
              strokeLinecap="round"
              className="progress-ring"
            />
          </svg>

          {/* Clean circular water vessel/orb aligning with 68% SVG mask */}
          <div
            className="absolute rounded-full border border-sky-400/25 bg-white/50 shadow-[inset_0_2px_8px_rgba(0,182,254,0.08),0_4px_16px_rgba(15,23,42,0.04)] pointer-events-none backdrop-blur-[1px]"
            style={{ width: "68%", height: "68%" }}
          />

          {/* Restrained Subtle Floating Water Particles/Bubbles around the Orb */}
          <div className="absolute top-[8%] left-[16%] w-2 h-2 rounded-full bg-sky-400/25 border border-sky-400/35 bubble-1 pointer-events-none" />
          <div className="absolute top-[22%] right-[10%] w-2.5 h-2.5 rounded-full bg-teal-400/20 border border-teal-400/35 bubble-2 pointer-events-none" />
          <div className="absolute bottom-[20%] left-[10%] w-1.5 h-1.5 rounded-full bg-sky-400/30 border border-sky-400/40 bubble-3 pointer-events-none" />
          <div className="absolute bottom-[10%] right-[16%] w-2 h-2 rounded-full bg-teal-400/25 border border-teal-400/35 bubble-4 pointer-events-none" />
          <div className="absolute top-[48%] -left-1 w-1.5 h-1.5 rounded-full bg-sky-300/30 bubble-2 pointer-events-none" />
          <div className="absolute top-[46%] -right-1 w-1.5 h-1.5 rounded-full bg-sky-300/30 bubble-1 pointer-events-none" />

          {/* Central Water Filling SVG Animation */}
          <img
            src={waterAnimation}
            alt="Veenero water filling animation"
            className="relative z-10 w-full h-full object-contain pointer-events-none select-none"
            loading="eager"
            decoding="sync"
          />
        </div>

        {/* Complete Veenero Logo Underneath Orb */}
        <div className="mt-5 flex flex-col items-center gap-3">
          <div className="flex items-center justify-center">
            <img
              src={veeneroLogo}
              alt="Veenero Sustainable Solutions"
              className="h-9 sm:h-11 md:h-12 w-auto max-w-[280px] sm:max-w-[340px] md:max-w-[380px] object-contain drop-shadow-xs select-none mix-blend-multiply"
              loading="eager"
            />
          </div>

          {/* Small Elegant "LOADING" Label with Subtle Animated Indicator */}
          <div className="flex items-center gap-2.5 px-3 py-1 rounded-full bg-teal-900/[0.04] border border-teal-800/10">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-600 dark:bg-teal-400 loading-dot" />
            <span className="text-[10px] sm:text-[11px] font-mono font-semibold tracking-[0.28em] text-slate-500 uppercase">
              LOADING
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
