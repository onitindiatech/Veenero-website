import React, { useState } from "react";
import { X, Leaf } from "lucide-react";
import { PublicAboutStory } from "@/services/about.service";
import fallbackStoryVideo from "@/assets/about/about-story-water-infrastructure.mp4";
import posterFallback from "@/assets/about/about-vision-water-infrastructure.webp";

interface OurStoryProps {
  data?: PublicAboutStory;
}

export const OurStory: React.FC<OurStoryProps> = ({ data }) => {
  if (data?.visible === false) return null;

  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const eyebrow = data?.eyebrow || "WHO WE ARE";
  const title = data?.title || "From Water Blindspots to Real-Time Intelligence";
  const paragraphs =
    data?.paragraphs && data.paragraphs.length > 0
      ? data.paragraphs
      : [
          "We are a team of engineers, data scientists, and water experts working at the intersection of technology and sustainability.",
          "Our mission is to empower organizations with real-time water intelligence that drives transparency, efficiency, and measurable environmental impact.",
        ];

  const videoSrc = data?.video || fallbackStoryVideo;
  const posterSrc = data?.videoPoster || posterFallback;

  const renderH2 = () => {
    if (title.includes(" to ")) {
      const parts = title.split(" to ");
      return (
        <>
          <span className="block">{parts[0]}</span>
          <span className="text-[#136873] dark:text-teal-400 font-bold block mt-1">
            to {parts.slice(1).join(" to ")}
          </span>
        </>
      );
    }
    return <span className="block">{title}</span>;
  };

  return (
    <section id="who-we-are" className="relative z-20 select-none py-14 sm:py-16 lg:py-20 bg-gradient-wave dark:bg-[#071317] border-b border-slate-200/60 dark:border-teal-900/20">
      <div className="container mx-auto px-6 md:px-12 max-w-7xl">
        
        {/* Top Header: Leaf Eyebrow + Proper Semantic H2 */}
        <div className="text-left font-sans max-w-4xl mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-600/10 dark:bg-teal-400/10 border border-teal-600/20 dark:border-teal-400/20 backdrop-blur-xs mb-3">
            <Leaf className="w-3 h-3 text-teal-700 dark:text-teal-300" />
            <span className="text-teal-800 dark:text-teal-300 font-bold uppercase tracking-widest text-[10px] sm:text-[11px] font-mono">
              {eyebrow}
            </span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.6rem] font-bold text-slate-900 dark:text-white leading-[1.18] tracking-tight">
            {renderH2()}
          </h2>
        </div>

        {/* 2-Column Balanced Composition: Left Paragraphs | Right Video Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-stretch">
          
          {/* Left Column: Structured Supporting Paragraphs */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-4 text-left font-sans text-base sm:text-[17px] text-slate-600 dark:text-slate-300 leading-relaxed">
            {paragraphs.map((para, idx) => (
              <p key={idx} className="leading-relaxed">{para}</p>
            ))}
          </div>

          {/* Right Column: Autoplaying Water Infrastructure Platform Video Card */}
          <div className="lg:col-span-6 flex items-stretch">
            <div
              onClick={() => setIsVideoOpen(true)}
              className="group relative w-full h-full min-h-[320px] sm:min-h-[380px] rounded-2xl sm:rounded-3xl overflow-hidden border border-teal-500/25 shadow-md hover:shadow-xl bg-gradient-to-br from-teal-50/60 to-cyan-100/60 dark:from-[#042127] dark:to-[#03191d] flex items-center justify-center cursor-pointer transition-all duration-300"
            >
              {/* Autoplaying HTML5 Looping Video */}
              <video
                src={videoSrc}
                poster={posterSrc}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

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
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
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
