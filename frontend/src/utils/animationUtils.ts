/**
 * Veenero Global Animation System — Shared Motion Utilities & Tokens
 *
 * Design Guidelines:
 * - Subtle, premium, and restrained for an enterprise water infrastructure company.
 * - Hardware-accelerated with transform & opacity.
 * - Guaranteed one-shot scroll reveals without reverse triggering.
 * - Full accessibility with prefers-reduced-motion.
 */

export const MOTION_TOKENS = {
  // Cubic bezier easing curves
  easeOutCubic: "cubic-bezier(0.16, 1, 0.3, 1)",
  easeOutQuad: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",

  // Standard durations
  durationFast: "200ms",
  durationNormal: "300ms",
  durationSmooth: "500ms",
  durationReveal: "650ms",
} as const;

/**
 * Shared CSS class strings for consistent component motion
 */
export const motion = {
  // Scroll reveal classes
  reveal: "reveal-on-scroll",
  revealFade: "reveal-fade",

  // Stagger delay helpers for cards, grids, and lists
  stagger: (index: number): string => {
    const step = Math.min((index + 1) * 100, 600);
    return `reveal-delay-${step}`;
  },

  // Interactive elevation classes
  cardHover: "transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-card",
  btnHover: "transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]",
  imgHover: "transition-transform duration-500 ease-out hover:scale-[1.025]",
  linkHover: "transition-colors duration-200 ease-out",

  // Page entrance transition
  pageEnter: "animate-page-enter",
} as const;

/**
 * Returns a CSS class string combining reveal-on-scroll with an index-based stagger delay
 */
export function getStaggerReveal(index: number, extraClasses = ""): string {
  const delayClass = motion.stagger(index);
  return `${motion.reveal} ${delayClass} ${extraClasses}`.trim();
}

export default motion;
