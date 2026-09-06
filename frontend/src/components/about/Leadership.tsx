import React from "react";
import { PublicAboutLeadership, PublicAboutTeamMember } from "@/services/about.service";
import { Leaf } from "lucide-react";

import teamLeadershipImg from "@/assets/about/about-team-leadership.webp";
import edgeTelemetryImg from "@/assets/about/about-field-verification.webp";
import cloudAnalyticsImg from "@/assets/about/about-real-time-analytics.webp";

interface LeadershipProps {
  data?: PublicAboutLeadership;
}

const fallbackTeamImages = [teamLeadershipImg, edgeTelemetryImg, cloudAnalyticsImg];

const defaultTeam: PublicAboutTeamMember[] = [
  {
    name: "Founding Team",
    role: "Leadership & Strategy",
    bio: "Steering the mission to establish India's most comprehensive digital water intelligence network.",
    icon: "Users2",
    image: teamLeadershipImg,
    order: 1,
  },
  {
    name: "Telemetry & Edge Engineering",
    role: "Hardware & IoT Systems",
    bio: "Designing rugged, industrial-grade sensors and edge gateways for high-precision water metering.",
    icon: "Cpu",
    image: edgeTelemetryImg,
    order: 2,
  },
  {
    name: "Data Science & Cloud Platform",
    role: "Water Analytics & AI",
    bio: "Developing predictive consumption models, anomaly detection algorithms, and verification pipelines.",
    icon: "LineChart",
    image: cloudAnalyticsImg,
    order: 3,
  },
];

export const Leadership: React.FC<LeadershipProps> = ({ data }) => {
  if (data?.visible === false) return null;

  const eyebrow = data?.eyebrow ?? "OUR TEAM";
  const title = data?.title ?? "Driven by Water & Technology Pioneers";
  const description =
    data?.description ||
    "Our multidisciplinary team unites IoT systems engineers, data scientists, and water conservation advocates.";
  const teamList = data?.team && data.team.length > 0 ? data.team : defaultTeam;

  return (
    <section id="leadership-team" className="py-14 sm:py-16 lg:py-20 bg-[#f8fafb] dark:bg-[#071317] relative border-b border-slate-200/60 dark:border-teal-900/20 overflow-hidden select-none">
      <div className="container mx-auto px-6 md:px-12 max-w-7xl space-y-12">
        
        {/* Centered Header with Leaf Eyebrow & Semantic H2 */}
        <div className="text-center font-sans max-w-2xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-600/10 dark:bg-teal-400/10 border border-teal-600/20 dark:border-teal-400/20 backdrop-blur-xs mb-3">
            <Leaf className="w-3 h-3 text-teal-700 dark:text-teal-300" />
            <span className="text-teal-800 dark:text-teal-300 font-bold uppercase tracking-widest text-[10px] sm:text-[11px] font-mono">
              {eyebrow}
            </span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.6rem] font-bold text-slate-900 dark:text-white mb-3 leading-[1.18] tracking-tight">
            {title}
          </h2>

          <p className="text-sm md:text-base text-slate-600 dark:text-slate-300/90 leading-relaxed">
            {description}
          </p>
        </div>

        {/* 3 Leadership Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamList.map((member, idx) => {
            const imageSrc =
              member.image || fallbackTeamImages[idx % fallbackTeamImages.length];

            const staggerDelay = idx === 0 ? "reveal-delay-100" : idx === 1 ? "reveal-delay-200" : "reveal-delay-300";

            return (
              <div
                key={member.id || member._id || idx}
                className={`group bg-white dark:bg-[#0c1f26] rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-teal-900/35 hover:border-teal-500/40 shadow-xs hover:shadow-[0_16px_32px_-8px_rgba(19,104,115,0.12)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full overflow-hidden font-sans relative reveal-on-scroll ${staggerDelay}`}
              >
                {/* Photo Frame */}
                <div className="relative w-full h-56 sm:h-64 overflow-hidden bg-slate-950 shrink-0">
                  <img
                    src={imageSrc}
                    alt={member.name}
                    className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Role Pill */}
                  <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-teal-300 text-xs font-semibold border border-white/15">
                    {member.role}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-7 flex flex-col justify-between flex-1 text-left">
                  <div>
                    <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-2 leading-snug group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300/90 leading-relaxed">
                      {member.bio}
                    </p>
                  </div>

                  <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-teal-500/30 to-transparent mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Leadership;
