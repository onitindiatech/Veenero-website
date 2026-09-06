import React from "react";
import { FileQuestion } from "lucide-react";
import { Job } from "./types";
import { JobCard } from "./JobCard";

interface JobListProps {
  jobs: Job[];
  onViewDetails: (job: Job) => void;
}

export const JobList: React.FC<JobListProps> = ({ jobs, onViewDetails }) => {
  if (jobs.length === 0) {
    return (
      <div className="p-16 rounded-3xl border border-dashed border-border/60 text-center font-sans space-y-4 bg-card/30">
        <div className="p-4 bg-muted rounded-full w-fit mx-auto text-muted-foreground">
          <FileQuestion className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-bold text-foreground">
          No Positions Found
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
          We couldn't find any openings matching your search criteria. Try resetting the filters or submit a general application.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job, idx) => {
        const staggerDelay = idx % 3 === 0 ? "reveal-delay-100" : idx % 3 === 1 ? "reveal-delay-200" : "reveal-delay-300";
        return (
          <div key={job.id || (job as any)._id} className={`reveal-on-scroll ${staggerDelay} h-full`}>
            <JobCard
              job={job}
              onViewDetails={onViewDetails}
            />
          </div>
        );
      })}
    </div>
  );
};

export default JobList;
