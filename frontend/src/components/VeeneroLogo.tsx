import React, { useState, useEffect } from "react";
import veeneroLogo from "@/assets/veenero_logo.png";

export interface VeeneroLogoProps {
  /**
   * 'dark': Authentic monochrome black/dark logo (for top initial navbar)
   * 'light': Light-blue "VEENERO" + pure white "SUSTAINABLE SOLUTIONS" (for dark footer backgrounds)
   * 'default': Original authentic logo with light-blue "VEENERO" + black "SUSTAINABLE SOLUTIONS" (for sticky navbar)
   */
  variant?: "light" | "default" | "dark";
  className?: string;
  alt?: string;
  loading?: "eager" | "lazy";
}

// Module-level in-memory cache to ensure zero redundant processing
let cachedLightLogoUrl: string | null = null;
const listeners: Array<(url: string) => void> = [];

// Try to initialize from sessionStorage if available
if (typeof window !== "undefined") {
  try {
    cachedLightLogoUrl = sessionStorage.getItem("veenero_light_logo_v1");
  } catch {
    // sessionStorage not available or disabled
  }
}

/**
 * Derives the light-blue / white brand version from the existing veenero_logo.png
 * without adding duplicate assets or changing the original company logo.
 *
 * In veenero_logo.png:
 * - Top text ("VEENERO") & top swoosh: authentic light-cyan brand color.
 * - Bottom text ("SUSTAINABLE SOLUTIONS") & bottom swoosh: dark/black.
 *
 * This transform keeps the authentic light-cyan brand color completely intact,
 * while mapping the dark text to pure white with smooth anti-aliasing preserved.
 */
function generateLightLogo() {
  if (cachedLightLogoUrl || typeof window === "undefined") return;

  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = veeneroLogo;

  img.onload = () => {
    try {
      const width = img.naturalWidth || 1047;
      const height = img.naturalHeight || 144;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = (y * width + x) * 4;
          const r = data[idx];
          const a = data[idx + 3];

          // Bottom text "SUSTAINABLE SOLUTIONS" starts around y >= 62
          // Bottom swoosh icon (x < 110, y >= 55) is dark
          if (a > 5) {
            if (y >= 62 || (x < 110 && y >= 55 && r < 130)) {
              data[idx] = 255;
              data[idx + 1] = 255;
              data[idx + 2] = 255;
            }
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);
      const dataUrl = canvas.toDataURL("image/png");
      cachedLightLogoUrl = dataUrl;

      try {
        sessionStorage.setItem("veenero_light_logo_v1", dataUrl);
      } catch {
        // quota exceeded or disabled
      }

      while (listeners.length > 0) {
        const cb = listeners.pop();
        if (cb) cb(dataUrl);
      }
    } catch (err) {
      console.warn("[VeeneroLogo] Canvas transform error, using standard fallback", err);
    }
  };
}

// Start generating in background immediately upon script loading
if (typeof window !== "undefined" && !cachedLightLogoUrl) {
  generateLightLogo();
}

export const VeeneroLogo: React.FC<VeeneroLogoProps> = ({
  variant = "default",
  className = "h-9 w-auto object-contain",
  alt = "Veenero Sustainable Solutions",
  loading = "eager",
}) => {
  const [lightSrc, setLightSrc] = useState<string | null>(() => cachedLightLogoUrl);

  useEffect(() => {
    if (variant === "light" && !lightSrc) {
      if (cachedLightLogoUrl) {
        setLightSrc(cachedLightLogoUrl);
      } else {
        const handler = (url: string) => setLightSrc(url);
        listeners.push(handler);
        generateLightLogo();
      }
    }
  }, [variant, lightSrc]);

  const isLight = variant === "light";
  const isDark = variant === "dark";
  const src = isLight && lightSrc ? lightSrc : veeneroLogo;

  // Filter styling:
  // - dark variant: authentic crisp monochrome black (with dark:invert for dark mode)
  // - light fallback: brightness-0 invert if canvas is generating
  let filterClass = "";
  if (isDark) {
    filterClass = "brightness-0 dark:brightness-0 dark:invert";
  } else if (isLight && !lightSrc) {
    filterClass = "brightness-0 invert opacity-95";
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${className} ${filterClass}`.trim()}
      loading={loading}
    />
  );
};

export default VeeneroLogo;
