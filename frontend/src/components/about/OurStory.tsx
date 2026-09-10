import React, { useState, useRef, useEffect } from "react";
import { X, Leaf, Target, TrendingDown, ShieldCheck } from "lucide-react";
import { PublicAboutStory } from "@/services/about.service";
import fallbackStoryVideo from "@/assets/about/about-story-water-infrastructure.mp4";
import posterFallback from "@/assets/about/about-vision-water-infrastructure.webp";

interface OurStoryProps {
  data?: PublicAboutStory;
}

export const OurStory: React.FC<OurStoryProps> = ({ data }) => {
  if (data?.visible === false) return null;

  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const eyebrow = data?.eyebrow || "WHO WE ARE";
  const title = data?.title || "From Village Roots to Water Security";

  // Authentic Veenero Company Story preserved from CMS & Founding Source Data
  const paragraphs =
    data?.paragraphs && data.paragraphs.length > 0
      ? data.paragraphs
      : [
          "Water is at the core of sustainable development and is critical for socio-economic development, energy and food production, healthy ecosystems, and human survival itself. Water is also at the heart of adaptation to climate change, serving as the crucial link between society and the environment.",
          "We are from a village background, and we have seen precisely how many liters of water are wasted every day as a result of leaks in overhead tanks, pipelines, and taps. After conducting a thorough analysis of the issue, we discovered that there are no appropriate water management systems or water usage rules.",
          "We began working on water management and conservation after conducting an extensive study on the use and distribution of water across multiple sectors. Our primary goals are to enforce appropriate water management, reduce water waste, and ensure future water security.",
        ];

  // Authentic Strategic Pillars
  const pillars =
    data?.badgePillars && data.badgePillars.length > 0
      ? data.badgePillars
      : [
          "Enforce Water Management",
          "Reduce Water Waste",
          "Ensure Water Security",
        ];

  // Resolve local asset strings to ESM imports to prevent unnecessary reload/flicker
  const resolveVideoSrc = (url?: string) => {
    if (!url) return fallbackStoryVideo;
    if (url.includes("about-story-water-infrastructure")) return fallbackStoryVideo;
    return url;
  };

  const resolvePosterSrc = (url?: string) => {
    if (!url) return posterFallback;
    if (
      url.includes("about-vision-water-infrastructure") ||
      url.includes("about-hero-water-infrastructure")
    )
      return posterFallback;
    return url;
  };

  const videoSrc = resolveVideoSrc(data?.video);
  const posterSrc = resolvePosterSrc(data?.videoPoster);

  // Auto-play attempt on mount / ready
  useEffect(() => {
    if (videoRef.current) {
      if (videoRef.current.readyState >= 3) {
        setIsVideoLoaded(true);
      }
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback: video remains muted and plays when in view
      });
    }
  }, [videoSrc]);

  const renderH2 = () => {
    if (title.includes(" to ")) {
      const parts = title.split(" to ");
      return (
        <>
          <span className="block">{parts[0]}</span>
          <span className="text-[#136873] dark:text-teal-400 font-bold block mt-1.5 sm:mt-2">
            to {parts.slice(1).join(" to ")}
          </span>
        </>
      );
    }
    return <span className="block">{title}</span>;
  };

  return (
    <section
      id="who-we-are"
      className="relative z-20 select-none py-14 sm:py-16 lg:py-20 bg-gradient-wave dark:bg-[#071317] border-b border-slate-200/60 dark:border-teal-900/20"
    >
      <div className="container mx-auto px-6 md:px-12 max-w-7xl">
        {/* Top Header: Leaf Eyebrow + Proper Semantic H2 with Clean Vertical Breathing */}
        <div className="text-left font-sans max-w-4xl mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-600/10 dark:bg-teal-400/10 border border-teal-600/20 dark:border-teal-400/20 backdrop-blur-xs mb-3.5">
            <Leaf className="w-3 h-3 text-teal-700 dark:text-teal-300" />
            <span className="text-teal-800 dark:text-teal-300 font-bold uppercase tracking-widest text-[10px] sm:text-[11px] font-mono">
              {eyebrow}
            </span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.65rem] font-bold text-slate-900 dark:text-white leading-[1.24] sm:leading-[1.26] tracking-tight">
            {renderH2()}
          </h2>
        </div>

        {/* 2-Column Balanced Composition: Left Paragraphs & Pillars | Right Video Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Column: Structured Supporting Paragraphs & Strategic Focus Pillars */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-4 text-left font-sans text-[15px] sm:text-[16px] text-slate-600 dark:text-slate-300 leading-relaxed">
            {paragraphs.map((para, idx) => (
              <p key={idx} className="leading-relaxed">
                {para}
              </p>
            ))}

            {/* 3 Authentic Veenero Strategic Pillars */}
            <div className="pt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {pillars.map((pillar, idx) => {
                const Icon =
                  idx === 0 ? Target : idx === 1 ? TrendingDown : ShieldCheck;
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white/80 dark:bg-[#0c1f26]/90 border border-teal-500/25 text-slate-800 dark:text-slate-200 text-xs font-semibold shadow-2xs hover:border-teal-400/50 transition-colors"
                  >
                    <Icon className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                    <span className="leading-snug">{pillar}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Autoplaying Video Card with Smooth Poster Fallback & Zero Layout Jump */}
          <div className="lg:col-span-6 flex items-stretch">
            <div
              onClick={() => setIsVideoOpen(true)}
              className="group relative w-full h-full min-h-[360px] sm:min-h-[420px] rounded-2xl sm:rounded-3xl overflow-hidden border border-teal-500/25 shadow-md hover:shadow-xl bg-[#041a20] flex items-center justify-center cursor-pointer transition-all duration-300"
            >
              {/* 1. Underlying Poster Image (Always rendered underneath, prevents black screen or layout jump) */}
              <img
                src={posterSrc}
                alt="Veenero Water Infrastructure Intelligence Platform"
                className={`absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ${
                  isVideoLoaded ? "opacity-0" : "opacity-100"
                } transition-opacity duration-700`}
                loading="eager"
              />

              {/* 2. HTML5 Video Layer with Smooth Opacity Crossfade */}
              <video
                ref={videoRef}
                src={videoSrc}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                onLoadedData={() => setIsVideoLoaded(true)}
                onCanPlay={() => setIsVideoLoaded(true)}
                onPlaying={() => setIsVideoLoaded(true)}
                className={`w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-700 ${
                  isVideoLoaded ? "opacity-100" : "opacity-0"
                }`}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />

              {/* Live telemetry badge overlay on video */}
              <div className="absolute bottom-4 left-4 right-4 z-10 pointer-events-none">
                <div className="inline-flex items-center gap-2 bg-slate-950/80 backdrop-blur-md border border-teal-400/30 rounded-xl px-3.5 py-2 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-white text-xs font-semibold font-sans">
                    Live Water Intelligence
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal if activated */}
      {isVideoOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsVideoOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsVideoOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <video
              src={videoSrc}
              poster={posterSrc}
              controls
              autoPlay
              className="w-full h-auto max-h-[80vh] object-cover"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default OurStory;
