import React, { useEffect, useState, useRef } from "react";

interface DigitCounterProps {
  target: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
  displayValueOverride?: string;
}

export const DigitCounter: React.FC<DigitCounterProps> = ({
  target,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1400,
  className = "",
  displayValueOverride,
}) => {
  const [currentValue, setCurrentValue] = useState<number>(0);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const animatedRef = useRef<boolean>(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Check if user prefers reduced motion
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setCurrentValue(target);
      setHasStarted(true);
      animatedRef.current = true;
      return;
    }

    // Single-shot IntersectionObserver
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animatedRef.current) {
            animatedRef.current = true;
            obs.unobserve(entry.target);
            setHasStarted(true);

            const startTimestamp = performance.now();
            let rafId: number;

            const animate = (now: number) => {
              const elapsed = now - startTimestamp;
              const progress = Math.min(1, elapsed / duration);
              // Cubic ease-out
              const eased = 1 - Math.pow(1 - progress, 3);
              const nextVal = target * eased;
              setCurrentValue(nextVal);

              if (progress < 1) {
                rafId = requestAnimationFrame(animate);
              } else {
                setCurrentValue(target);
              }
            };

            rafId = requestAnimationFrame(animate);

            return () => {
              if (rafId) cancelAnimationFrame(rafId);
            };
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [target, duration]);

  // Format number with commas and specified decimals
  const formattedNumber = (() => {
    if (displayValueOverride && currentValue >= target * 0.98) {
      return displayValueOverride;
    }

    const fixed = currentValue.toFixed(decimals);
    const parts = fixed.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  })();

  return (
    <span ref={containerRef} className={`inline-flex items-baseline tabular-nums ${className}`}>
      {prefix && <span className="opacity-90">{prefix}</span>}
      <span>{formattedNumber}</span>
      {suffix && <span className="opacity-90">{suffix}</span>}
    </span>
  );
};

export default DigitCounter;
