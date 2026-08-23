import React from "react";
import { AboutContent } from "@/content/about";
import { Users2, Cpu, LineChart } from "lucide-react";

interface LeadershipProps {
  data: AboutContent["leadership"];
}

const roleIcons: Record<number, React.ElementType> = {
  0: Users2,
  1: Cpu,
  2: LineChart,
};

export const Leadership: React.FC<LeadershipProps> = ({ data }) => {
  return (
    <section id="leadership-team" className="py-12 md:py-16 bg-transparent relative border-b border-border/10">
      <div className="container mx-auto px-6 md:px-12 max-w-7xl space-y-12">
        
        {/* Section Header */}
        <div className="text-left font-sans max-w-3xl">
          {data.eyebrow && (
            <span className="text-teal-600 dark:text-teal-400 font-bold uppercase tracking-widest text-[10px] md:text-xs block mb-3">
              {data.eyebrow}
            </span>
          )}
          <h2 className="font-display text-3xl md:text-[2.5rem] font-bold text-foreground mb-3">
            {data.title}
          </h2>
          {data.description && (
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              {data.description}
            </p>
          )}
        </div>

        {/* Leadership & Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.team.map((member, idx) => {
            const Icon = roleIcons[idx] || Users2;
            return (
              <div
                key={idx}
                className="group bg-card p-8 rounded-2xl border border-border/40 hover:border-teal-600/30 shadow-sm hover:shadow-soft hover:-translate-y-1 transition-all duration-300 flex flex-col items-start font-sans"
              >
                {/* Header Icon & Tag */}
                <div className="w-full flex items-center justify-between mb-6">
                  <div className="p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-6 w-6 stroke-[2]" />
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 px-2.5 py-1 rounded-full border border-teal-600/10">
                    {member.role}
                  </span>
                </div>

                {/* Name */}
                <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-teal-700 transition-colors">
                  {member.name}
                </h3>

                {/* Bio */}
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {member.bio}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Leadership;
