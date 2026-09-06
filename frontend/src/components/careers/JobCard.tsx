import React from "react";
import { Briefcase, MapPin, ChevronRight, ArrowRight } from "lucide-react";
import { Job } from "./types";

interface JobCardProps {
  job: Job;
  onViewDetails: (job: Job) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onViewDetails }) => {
  return (
    <div
      className="group bg-card p-7 sm:p-8 rounded-2xl border border-border/60 hover:border-teal-500/50 shadow-xs hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full font-sans cursor-pointer relative overflow-hidden"
      onClick={() => onViewDetails(job)}
    >
      {/* Top Gradient Accent Line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-ocean opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="space-y-4">
        {/* Title (H3) */}
        <h3 className="text-lg md:text-xl font-bold text-foreground group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors leading-snug">
          {job.title}
        </h3>

        {/* Metadata row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Briefcase className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform duration-300" />
            <span>{job.department}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform duration-300" />
            <span>{job.location}</span>
          </div>
          <span className="px-2.5 py-0.5 bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 rounded-full font-extrabold text-[11px] border border-teal-600/20">
            {job.employmentType}
          </span>
        </div>

        {/* Short Description */}
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {job.shortDescription}
        </p>
      </div>

      {/* Card Footer */}
      <div className="flex items-center justify-between pt-6 mt-6 border-t border-border/20">
        <span className="text-teal-700 dark:text-teal-300 text-xs font-bold inline-flex items-center gap-1.5 transition-colors">
          View Details
          <ArrowRight className="h-3.5 w-3.5 arrow-shift group-hover:translate-x-1 transition-transform duration-200" />
        </span>
        <div className="h-8 w-8 rounded-full bg-teal-50 dark:bg-teal-950/40 border border-teal-500/20 flex items-center justify-center text-teal-700 dark:text-teal-300 group-hover:scale-105 group-hover:bg-teal-600 group-hover:text-white hover-ripple-subtle transition-all duration-300">
          <ChevronRight className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
};

export default JobCard;
