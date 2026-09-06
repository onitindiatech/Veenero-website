import React from "react";
import { Leaf } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface RecognitionBadge {
  code: string;
  title: string;
  sub: string;
}

const RECOGNITIONS: RecognitionBadge[] = [
  {
    code: "SIH",
    title: "Smart India",
    sub: "Hackathon",
  },
  {
    code: "MeitY",
    title: "Government",
    sub: "of India",
  },
  {
    code: "IESA",
    title: "India Electronics &",
    sub: "Semiconductor Association",
  },
  {
    code: "VISHVA",
    title: "Pioneer for a",
    sub: "Sustainable India",
  },
];

// SVG Laurel Wreath Left & Right leaves
const LaurelWreathLeft = () => (
  <svg className="w-5 sm:w-6 h-12 sm:h-14 text-teal-600/70 dark:text-teal-400/60" viewBox="0 0 24 56" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 4 C14 8, 8 16, 8 28 C8 40, 14 48, 20 52" />
    <path d="M12 12 C6 10, 4 14, 8 16" fill="currentColor" fillOpacity="0.3" />
    <path d="M10 20 C4 19, 2 24, 7 25" fill="currentColor" fillOpacity="0.3" />
    <path d="M9 30 C3 30, 2 36, 7 36" fill="currentColor" fillOpacity="0.3" />
    <path d="M11 40 C6 41, 5 46, 10 45" fill="currentColor" fillOpacity="0.3" />
  </svg>
);

const LaurelWreathRight = () => (
  <svg className="w-5 sm:w-6 h-12 sm:h-14 text-teal-600/70 dark:text-teal-400/60" viewBox="0 0 24 56" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4 C10 8, 16 16, 16 28 C16 40, 10 48, 4 52" />
    <path d="M12 12 C18 10, 20 14, 16 16" fill="currentColor" fillOpacity="0.3" />
    <path d="M14 20 C20 19, 22 24, 17 25" fill="currentColor" fillOpacity="0.3" />
    <path d="M15 30 C21 30, 22 36, 17 36" fill="currentColor" fillOpacity="0.3" />
    <path d="M13 40 C18 41, 19 46, 14 45" fill="currentColor" fillOpacity="0.3" />
  </svg>
);

export const SolutionsRecognition: React.FC = () => {
  useScrollReveal([]);

  return (
    <section
      id="solutions-recognition"
      className="py-14 sm:py-16 bg-[#f8fafb] dark:bg-[#071317] border-t border-slate-200/70 dark:border-teal-900/30 select-none overflow-hidden"
    >
      <div className="container mx-auto px-6 md:px-12 max-w-7xl font-sans">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left: Eyebrow + Title */}
          <div className="lg:col-span-5 text-left reveal-on-scroll">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-600/10 dark:bg-teal-400/10 border border-teal-600/20 dark:border-teal-400/20 backdrop-blur-xs mb-3">
              <Leaf className="w-3 h-3 text-teal-700 dark:text-teal-300" />
              <span className="text-teal-800 dark:text-teal-300 font-bold uppercase tracking-widest text-[10px] sm:text-[11px] font-mono">
                RECOGNITION & PARTNERSHIPS
              </span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl lg:text-[2.25rem] font-bold text-slate-900 dark:text-white leading-tight">
              Building a More
              <br />
              <span className="text-[#136873] dark:text-teal-400">
                Sustainable Future
              </span>{" "}
              Together
            </h2>
          </div>

          {/* Right: 4 Laurel Badges matching mockup */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 items-center reveal-on-scroll reveal-delay-200">
            {RECOGNITIONS.map((rec, i) => (
              <div
                key={i}
                className="flex items-center justify-center gap-1 group py-2"
              >
                <LaurelWreathLeft />
                
                <div className="text-center px-1">
                  <span className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white block group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors">
                    {rec.code}
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-tight block mt-0.5">
                    {rec.title}
                    <br />
                    {rec.sub}
                  </span>
                </div>

                <LaurelWreathRight />
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default SolutionsRecognition;
