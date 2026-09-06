import React from "react";
import { MilestoneWaterIcon } from "./waterIllustrations";
import { PublicAboutJourney, PublicAboutMilestone } from "@/services/about.service";
import defaultJourneyImage from "@/assets/about/about-journey-water-infrastructure.webp";

interface AboutTimelineProps {
  data?: PublicAboutJourney;
}

const defaultMilestones: PublicAboutMilestone[] = [
  {
    year: "2021",
    title: "The Idea",
    description: "Identified the water data gap in India",
    iconType: "idea",
    order: 1,
  },
  {
    year: "2022",
    title: "First Prototype",
    description: "Built our first IoT prototype for leak and flow monitoring",
    iconType: "prototype",
    order: 2,
  },
  {
    year: "2023",
    title: "Early Adoptions",
    description: "Piloted across municipal & industrial installations",
    iconType: "adoption",
    order: 3,
  },
  {
    year: "2024",
    title: "Scaling Impact",
    description: "Expanded to multiple states with advanced analytics",
    iconType: "scale",
    order: 4,
  },
  {
    year: "2025 & Beyond",
    title: "Building the Future",
    description: "AI, predictive intelligence & nationwide impact",
    iconType: "future",
    order: 5,
  },
];

export const AboutTimeline: React.FC<AboutTimelineProps> = ({ data }) => {
  if (data?.visible === false) return null;

  const eyebrow = data?.eyebrow ?? "OUR JOURNEY";
  const title = data?.title ?? "Milestones That Flow Forward";
  const description =
    data?.description ||
    "From our founding vision to nationwide water intelligence infrastructure across India.";
  const journeyImage = data?.journeyImage || defaultJourneyImage;
  const journeyCaption =
    data?.journeyCaption ||
    "Rugged edge sensors and IoT transmission units monitoring high-pressure water conduits, clarifiers, and urban distribution networks in real time.";
  const milestones =
    data?.milestones && data.milestones.length > 0 ? data.milestones : defaultMilestones;

  return (
    <section id="our-journey" className="py-14 sm:py-20 bg-transparent relative border-b border-border/10 overflow-hidden select-none">
      {/* Background Water Stream Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-48 bg-teal-500/5 blur-3xl rounded-full pointer-events-none -z-10" />

      <div className="container mx-auto px-6 md:px-12 max-w-7xl space-y-12">
        {/* Reference-Consistent Header */}
        <div className="text-center font-sans max-w-2xl mx-auto flex flex-col items-center">
          <div className="flex flex-col items-center justify-center mb-3">
            <span className="text-teal-700 dark:text-teal-400 font-bold uppercase tracking-widest text-xs font-mono mb-1.5">
              {eyebrow}
            </span>
            <div className="w-10 h-0.5 bg-teal-600 rounded-full" />
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.6rem] font-bold text-foreground mb-3 leading-tight tracking-tight">
            {title}
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

        {/* Horizontal Flowing Water Roadmap */}
        <div className="relative pt-6 pb-2">
          {/* Animated Water Stream Connecting Line SVG */}
          <div className="hidden lg:block absolute top-[4.8rem] left-8 right-8 h-12 pointer-events-none z-0">
            <svg className="w-full h-full" viewBox="0 0 1000 60" preserveAspectRatio="none">
              <defs>
                <linearGradient id="streamGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="50%" stopColor="#0f766e" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
              </defs>

              {/* Base Stream Curve */}
              <path
                d="M 20 30 Q 125 10 250 30 T 500 30 T 750 30 T 980 30"
                fill="none"
                stroke="url(#streamGrad)"
                strokeWidth="5"
                strokeLinecap="round"
                opacity="0.25"
              />

              {/* Animated Flow Stream Overlay Line */}
              <path
                d="M 20 30 Q 125 10 250 30 T 500 30 T 750 30 T 980 30"
                fill="none"
                stroke="url(#streamGrad)"
                strokeWidth="5"
                strokeLinecap="round"
                className="animate-stream"
              />

              {/* Flow Direction Arrow Head */}
              <path d="M 975 22 L 992 30 L 975 38" fill="none" stroke="#34d399" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Timeline Nodes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4 relative z-10">
            {milestones.map((item, idx) => {
              return (
                <div
                  key={item.id || item._id || idx}
                  className="group flex flex-col items-start lg:items-center text-left lg:text-center space-y-3 bg-card lg:bg-transparent p-6 lg:p-2 rounded-2xl border border-border/50 lg:border-none shadow-card lg:shadow-none hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Node Milestone Circle with Icon */}
                  <div className="relative">
                    <div className="w-15 h-15 rounded-full bg-gradient-to-br from-teal-50 to-cyan-100 dark:from-teal-950 dark:to-cyan-950 border-2 border-teal-500/35 flex items-center justify-center shadow-soft group-hover:scale-105 group-hover:border-teal-500 transition-all duration-300 relative z-10">
                      <MilestoneWaterIcon year={item.year} iconType={item.iconType as any} />
                    </div>
                    {/* Subtle ripple pulse behind node */}
                    <div className="absolute inset-0 rounded-full bg-teal-400/20 group-hover:animate-ping -z-0" />
                  </div>

                  {/* Year Pill Tag */}
                  <span className="inline-block px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 text-xs font-bold border border-teal-600/20 shadow-2xs">
                    {item.year}
                  </span>

                  {/* Title */}
                  <h3 className="font-display text-xl font-bold text-foreground leading-snug group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-[14rem]">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Supporting Visual Anchor: Real Water Infrastructure & Telemetry Deployment */}
        <div className="relative mt-8 lg:mt-10 rounded-2xl sm:rounded-3xl overflow-hidden border border-border/50 shadow-card hover:shadow-glow transition-all duration-500 group">
          <div className="absolute -inset-4 bg-gradient-to-r from-teal-500/15 via-cyan-400/10 to-teal-500/15 rounded-3xl blur-2xl pointer-events-none -z-10" />

          <div className="relative w-full h-64 sm:h-80 md:h-[400px] lg:h-[450px] overflow-hidden rounded-2xl sm:rounded-3xl bg-slate-950">
            <img
              src={journeyImage}
              alt="Veenero nationwide water infrastructure telemetry and treatment facility deployment"
              className="w-full h-full object-cover object-[center_35%] rounded-2xl sm:rounded-3xl transition-transform duration-700 ease-out group-hover:scale-[1.01]"
              loading="lazy"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-black/15 pointer-events-none rounded-2xl sm:rounded-3xl" />

            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-slate-950/75 backdrop-blur-md border border-white/15 text-white text-[11px] font-medium tracking-wide shadow-soft">
              <span className="text-slate-300">FOUNDATION</span>
              <span className="text-teal-400 font-bold">→</span>
              <span className="text-slate-300">INFRASTRUCTURE</span>
              <span className="text-teal-400 font-bold">→</span>
              <span className="text-slate-300">TELEMETRY</span>
              <span className="text-teal-400 font-bold">→</span>
              <span className="text-slate-300">INTELLIGENCE</span>
              <span className="text-teal-400 font-bold">→</span>
              <span className="text-teal-300 font-bold">SCALE</span>
            </div>

            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 right-4 sm:right-auto bg-background/90 dark:bg-slate-900/90 backdrop-blur-md p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-border/50 shadow-soft max-w-lg">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                  Nationwide Field Telemetry
                </span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {journeyCaption}
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutTimeline;
