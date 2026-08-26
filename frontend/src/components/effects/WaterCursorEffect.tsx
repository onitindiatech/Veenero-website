import React, { useEffect, useRef } from "react";
import { WaterEffectProps } from "./types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  lineWidth: number;
  speed: number;
}

// Veenero teal/aqua palette — kept on the cool, transparent end
const RIPPLE_COLOR_R = 45;
const RIPPLE_COLOR_G = 212;
const RIPPLE_COLOR_B = 191; // Tailwind teal-400 equivalent

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const WaterCursorEffect: React.FC<WaterEffectProps> = ({
  enabled = true,
  intensity = 'subtle',
  enableMovement = true,
  enableClick = true,
  className = '',
  children
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!enabled) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 1. Feature checks
    // Respect prefers-reduced-motion
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) return;

    // Disable on touch / coarse-pointer devices (phones, tablets)
    const coarseQuery = window.matchMedia("(pointer: coarse)");
    if (coarseQuery.matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 2. Constants based on intensity
    const isSubtle = intensity === 'subtle';
    const MAX_RIPPLES = 24;
    const MOVE_THROTTLE_MS = 40;
    
    const MOVE_MAX_RADIUS = isSubtle ? 52 : 75;
    const CLICK_MAX_RADIUS = isSubtle ? 90 : 130;
    
    const MOVE_INITIAL_OPACITY = isSubtle ? 0.18 : 0.3;
    const CLICK_INITIAL_OPACITY = isSubtle ? 0.28 : 0.45;
    
    const MOVE_SPEED = isSubtle ? 1.1 : 1.3;
    const CLICK_SPEED = isSubtle ? 1.6 : 2.0;
    
    const FADE_RATE = 0.012;
    const LINE_WIDTH_MOVE = 1;
    const LINE_WIDTH_CLICK = 1.5;

    // 3. High-DPI canvas sizing
    const dpr = window.devicePixelRatio || 1;
    let rafId: number;
    let scaled = false;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const { width, height } = parent.getBoundingClientRect();
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      // Re-apply scale after each resize (canvas reset clears transform)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      scaled = true;
    };

    resize();

    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    // 4. Ripple pool
    const ripples: Ripple[] = [];

    const spawnRipple = (
      clientX: number,
      clientY: number,
      isClick: boolean
    ) => {
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      // Evict oldest if at capacity
      if (ripples.length >= MAX_RIPPLES) ripples.shift();

      ripples.push({
        x,
        y,
        radius: isClick ? 4 : 1,
        maxRadius: isClick ? CLICK_MAX_RADIUS : MOVE_MAX_RADIUS,
        opacity: isClick ? CLICK_INITIAL_OPACITY : MOVE_INITIAL_OPACITY,
        lineWidth: isClick ? LINE_WIDTH_CLICK : LINE_WIDTH_MOVE,
        speed: isClick ? CLICK_SPEED : MOVE_SPEED,
      });
    };

    // 5. Animation loop
    const draw = () => {
      if (!scaled) {
        rafId = requestAnimationFrame(draw);
        return;
      }

      const logicalW = canvas.width / dpr;
      const logicalH = canvas.height / dpr;

      ctx.clearRect(0, 0, logicalW, logicalH);

      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];

        r.radius += r.speed;
        // Fade accelerates as ripple nears its max size
        const progress = Math.min(r.radius / r.maxRadius, 1);
        r.opacity -= FADE_RATE + progress * 0.008;

        if (r.opacity <= 0 || r.radius >= r.maxRadius) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${RIPPLE_COLOR_R},${RIPPLE_COLOR_G},${RIPPLE_COLOR_B},${Math.max(0, r.opacity).toFixed(4)})`;
        ctx.lineWidth = r.lineWidth * (1 - progress * 0.4); // thin as it expands
        ctx.stroke();
      }

      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);

    // 6. Event listeners — attached to the canvas's parent
    let lastMoveTime = 0;

    const onMouseMove = (e: MouseEvent) => {
      if (!enableMovement) return;
      const now = Date.now();
      if (now - lastMoveTime < MOVE_THROTTLE_MS) return;
      lastMoveTime = now;
      spawnRipple(e.clientX, e.clientY, false);
    };

    const onMouseDown = (e: MouseEvent) => {
      if (!enableClick) return;
      spawnRipple(e.clientX, e.clientY, true);
    };

    const parent = canvas.parentElement;
    if (parent) {
      if (enableMovement) parent.addEventListener("mousemove", onMouseMove, { passive: true });
      if (enableClick) parent.addEventListener("mousedown", onMouseDown, { passive: true });
    }

    // 7. Cleanup
    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      if (parent) {
        parent.removeEventListener("mousemove", onMouseMove);
        parent.removeEventListener("mousedown", onMouseDown);
      }
    };
  }, [enabled, intensity, enableMovement, enableClick]);

  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={`absolute inset-0 pointer-events-none ${className}`}
        style={{ zIndex: 2, display: "block" }}
      />
      {children}
    </>
  );
};

export default WaterCursorEffect;
