// Authentic, real-life water-related photographic images (high quality Unsplash photography)
export const WATER_PHOTOGRAPHS = {
  // Telemetry, Sensing & Measurement (Digital flow meters & sensors on pipes)
  sense: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80",
  telemetry: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=400&q=80",
  metering: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=400&q=80",

  // Intelligence & Analytics (Water monitoring control dashboard stations)
  intelligence: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80",
  analytics: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80",

  // Insights & Lab Quality Testing (Water testing lab analysis)
  insights: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=400&q=80",
  verification: "https://images.unsplash.com/photo-1617155093730-a8bf47be792d?auto=format&fit=crop&w=400&q=80",

  // Water Platform & Reservoirs (Municipal water reservoirs & networks)
  platform: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=400&q=80",
  risk: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=400&q=80",

  // Treatment, Industry & Utilities (Industrial water filtration plants)
  industry: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=400&q=80",
  utility: "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=400&q=80",
  governance: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=400&q=80",

  // Gallery pool of authentic water photos
  gallery: [
    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1617155093730-a8bf47be792d?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=400&q=80",
  ]
};

export const getWaterPhotograph = (customUrl?: string, keyOrTitle?: string, fallbackIdx: number = 0): string => {
  if (customUrl && (customUrl.startsWith('http') || customUrl.startsWith('/'))) {
    return customUrl;
  }
  
  if (!keyOrTitle) {
    return WATER_PHOTOGRAPHS.gallery[fallbackIdx % WATER_PHOTOGRAPHS.gallery.length];
  }

  const normalized = keyOrTitle.toLowerCase();
  
  if (normalized.includes('sense') || normalized.includes('telemetry') || normalized.includes('meter') || normalized.includes('search')) {
    return WATER_PHOTOGRAPHS.sense;
  }
  if (normalized.includes('intelligence') || normalized.includes('analytic') || normalized.includes('barchart') || normalized.includes('monitor')) {
    return WATER_PHOTOGRAPHS.intelligence;
  }
  if (normalized.includes('insight') || normalized.includes('wave') || normalized.includes('report') || normalized.includes('testing')) {
    return WATER_PHOTOGRAPHS.insights;
  }
  if (normalized.includes('verif') || normalized.includes('shield') || normalized.includes('compliance') || normalized.includes('audit')) {
    return WATER_PHOTOGRAPHS.verification;
  }
  if (normalized.includes('platform') || normalized.includes('cloud') || normalized.includes('network') || normalized.includes('grid')) {
    return WATER_PHOTOGRAPHS.platform;
  }
  if (normalized.includes('risk') || normalized.includes('leaf') || normalized.includes('sustain') || normalized.includes('enviro')) {
    return WATER_PHOTOGRAPHS.risk;
  }
  if (normalized.includes('factory') || normalized.includes('industry') || normalized.includes('facility') || normalized.includes('plant')) {
    return WATER_PHOTOGRAPHS.industry;
  }
  if (normalized.includes('util') || normalized.includes('building') || normalized.includes('infrastructure') || normalized.includes('pipe')) {
    return WATER_PHOTOGRAPHS.telemetry;
  }
  if (normalized.includes('innovat') || normalized.includes('cpu') || normalized.includes('tech') || normalized.includes('sparkle')) {
    return WATER_PHOTOGRAPHS.metering;
  }

  return WATER_PHOTOGRAPHS.gallery[fallbackIdx % WATER_PHOTOGRAPHS.gallery.length];
};
