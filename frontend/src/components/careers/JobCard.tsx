import React from "react";
import { Briefcase, MapPin, ChevronRight } from "lucide-react";
import { Job } from "./types";

interface JobCardProps {
  job: Job;
  onViewDetails: (job: Job) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onViewDetails }) => {
  return (
    <div
      className="group bg-card hover:bg-card/95 p-6 sm:p-7 rounded-2xl border border-border/40 hover:border-teal-600/30 shadow-sm hover:shadow-soft hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between h-full font-sans cursor-pointer"
      onClick={() => onViewDetails(job)}
    >
      <div className="space-y-4">
        {/* Title (H3) */}
        <h3 className="text-lg md:text-xl font-bold text-foreground group-hover:text-teal-700 transition-colors leading-snug">
          {job.title}
        </h3>

        {/* Metadata row matching reference image layout */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Briefcase className="h-3.5 w-3.5 text-muted-foreground/75" />
            <span>{job.department}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground/75" />
            <span>{job.location}</span>
          </div>
          <span className="px-2.5 py-0.5 bg-teal-50 dark:bg-teal-950/20 text-teal-700 dark:text-teal-400 rounded-full font-bold">
            {job.employmentType}
          </span>
        </div>

        {/* Short Description */}
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {job.shortDescription}
        </p>
      </div>

      {/* Card Footer matching reference image layout */}
      <div className="flex items-center justify-between pt-6 mt-6 border-t border-border/20">
        <span className="text-teal-700 dark:text-teal-400 text-xs font-bold inline-flex items-center gap-1 group-hover:underline">
          View Details
          <span>→</span>
        </span>
        <div className="h-8 w-8 rounded-full bg-muted/60 group-hover:bg-teal-50 dark:group-hover:bg-teal-950/30 flex items-center justify-center text-muted-foreground group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-all duration-200">
          <ChevronRight className="h-4.5 w-4.5 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
};

export default JobCard;
