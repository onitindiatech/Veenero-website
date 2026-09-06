import React, { useEffect, useRef, useState } from "react";

interface OneShotCounterProps {
  value: string | number;
  className?: string;
  duration?: number;
}

/**
 * One-Shot Counter Component:
 * - Animates numeric digits ONCE upon first viewport entry (e.g. 0 -> 25).
 * - After reaching the final value, permanently locks into that final value.
 * - When scrolling away and scrolling back, the value remains settled and stable.
 * - Respects prefers-reduced-motion (immediately displays final value).
 */
export const OneShotCounter: React.FC<OneShotCounterProps> = ({
  value,
  className = "",
  duration = 1100,
}) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const rawValue = String(value ?? "");

  // Parse any numeric portion, prefix, and suffix:
  // e.g. "25%+" -> prefix: "", number: 25, suffix: "%+"
  // e.g. "100%+" -> prefix: "", number: 100, suffix: "%+"
  // e.g. "10,000+" -> prefix: "", number: 10000, suffix: "+"
  const parsed = React.useMemo(() => {
    const match = rawValue.match(/^([^0-9.]*)([0-9,.]+)(.*)$/);
    if (!match) {
      return { isNumeric: false, prefix: "", target: 0, suffix: rawValue, isDecimal: false, hasCommas: false };
    }
    const prefix = match[1];
    const numStr = match[2];
    const suffix = match[3];
    const hasCommas = numStr.includes(",");
    const cleanNumStr = numStr.replace(/,/g, "");
    const target = parseFloat(cleanNumStr);
    const isDecimal = numStr.includes(".");

    if (isNaN(target)) {
      return { isNumeric: false, prefix: "", target: 0, suffix: rawValue, isDecimal: false, hasCommas: false };
    }

    return { isNumeric: true, prefix, target, suffix, isDecimal, hasCommas };
  }, [rawValue]);

  const [displayValue, setDisplayValue] = useState<number>(0);
  const [isSettled, setIsSettled] = useState<boolean>(false);
  const hasAnimatedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!parsed.isNumeric || isSettled || hasAnimatedRef.current) return;

    // Reduced motion check: immediately show target
    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      setDisplayValue(parsed.target);
      setIsSettled(true);
      hasAnimatedRef.current = true;
      return;
    }

    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;
          observer.unobserve(node);

          const startTime = performance.now();
          const startVal = 0;
          const endVal = parsed.target;

          const tick = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Smooth ease-out cubic formula
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const current = startVal + (endVal - startVal) * easeProgress;

            if (progress < 1) {
              setDisplayValue(current);
              requestAnimationFrame(tick);
            } else {
              setDisplayValue(endVal);
              setIsSettled(true);
            }
          };

          requestAnimationFrame(tick);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [parsed, isSettled, duration]);

  // Non-numeric values (e.g. "Optimized", "Audit-Ready", "India") render directly
  if (!parsed.isNumeric) {
    return <span className={className}>{rawValue}</span>;
  }

  // Format current numeric display value
  let formattedNumber = "";
  if (isSettled) {
    // Preserve exact original formatting of the number portion
    const match = rawValue.match(/^([^0-9.]*)([0-9,.]+)(.*)$/);
    formattedNumber = match ? match[2] : String(parsed.target);
  } else if (parsed.isDecimal) {
    formattedNumber = displayValue.toFixed(1);
  } else if (parsed.hasCommas) {
    formattedNumber = Math.round(displayValue).toLocaleString();
  } else {
    formattedNumber = String(Math.round(displayValue));
  }

  return (
    <span ref={containerRef} className={className}>
      {parsed.prefix}
      {formattedNumber}
      {parsed.suffix}
    </span>
  );
};

export default OneShotCounter;
