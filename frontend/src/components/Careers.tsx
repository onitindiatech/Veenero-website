import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Briefcase, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPublicHome, HomeCareers } from "@/services/home.service";
import { getPublicCareers, Career } from "@/admin/services/career.service";
import { homeCareersContent } from "@/content/home/careers";
import { mergeHomeSection } from "@/utils/mergeHomeSection";

export const Careers = () => {
  const [homeCareers, setHomeCareers] = useState<HomeCareers>(homeCareersContent);
  const [liveJobs, setLiveJobs] = useState<Career[]>([]);

  useEffect(() => {
    let cancelled = false;

    // Fetch Home CMS settings for surrounding section text
    getPublicHome()
      .then((data) => {
        if (!cancelled && data?.careers) {
          setHomeCareers(mergeHomeSection(homeCareersContent, data.careers));
        }
      })
      .catch(() => {});

    // Fetch published open positions from existing Careers API
    getPublicCareers()
      .then((jobs) => {
        if (!cancelled && Array.isArray(jobs) && jobs.length > 0) {
          setLiveJobs(jobs);
        }
      })
      .catch(() => {});

    return () => { cancelled = true; };
  }, []);

  if (homeCareers.visible === false) return null;

  // Use live published jobs from Careers API if available, else fallback to homeCareers.list
  const displayPositions = liveJobs.length > 0
    ? liveJobs.map((j) => ({
        id: j.id || j._id,
        slug: j.slug,
        title: j.title,
        location: j.location,
        department: j.department,
        isNew: j.isFeatured,
      }))
    : homeCareers.list.map((j, idx) => ({
        id: `fallback-${idx}`,
        slug: undefined,
        title: j.title,
        location: j.location,
        department: j.department,
        isNew: j.isNew,
      }));

  return (
    <section id="careers" className="py-16 md:py-20 bg-background relative">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 reveal-on-scroll">
          {homeCareers.eyebrow && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/25 mb-4 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping inline-block" />
              <span className="text-teal-700 dark:text-teal-300 font-bold uppercase tracking-widest text-[10px] md:text-xs">
                {homeCareers.eyebrow}
              </span>
            </div>
          )}
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            {homeCareers.title}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {homeCareers.description}
          </p>
        </div>

        <div className="max-w-4xl mx-auto reveal-on-scroll reveal-delay-100">
          {/* Careers List */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-display text-2xl font-semibold text-foreground">
                {homeCareers.openingsTitle || "Open Positions"}
              </h3>
            </div>
            <div className="space-y-4">
              {displayPositions.map((position) => {
                const destination = position.slug ? `/careers/${position.slug}` : "/contact";
                return (
                  <Link
                    key={position.id}
                    to={destination}
                    className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-card rounded-2xl border border-border/60 hover:border-teal-500/50 shadow-xs hover:shadow-card hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden"
                  >
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-foreground group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                          {position.title}
                        </h4>
                        {position.isNew && (
                          <span className="px-2.5 py-0.5 bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-600/20 text-xs font-semibold rounded-full">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {position.department} · {position.location}
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 text-center">
            <p className="text-muted-foreground mb-4">
              {homeCareers.generalAppText}
            </p>
            <Button variant="outline" size="lg" asChild>
              <a href="#contact">
                {homeCareers.generalAppButtonText}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};