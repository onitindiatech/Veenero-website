import { useState, useEffect } from "react";
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
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-primary font-medium mb-4 tracking-wider uppercase text-sm">
            {homeCareers.eyebrow}
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            {homeCareers.title}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {homeCareers.description}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
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
              {displayPositions.map((position) => (
                <a
                  key={position.id}
                  href={position.slug ? `/careers/${position.slug}` : "#contact"}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-soft transition-all duration-300"
                >
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {position.title}
                      </h4>
                      {position.isNew && (
                        <span className="px-2 py-0.5 bg-secondary text-secondary-foreground text-xs font-medium rounded-full">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {position.department} · {position.location}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </a>
              ))}
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