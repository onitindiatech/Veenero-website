import { Briefcase, GraduationCap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const positions = [
  {
    type: "career",
    title: "IoT Hardware Engineer",
    location: "Remote / On-site",
    department: "Engineering",
    isNew: true,
  },
  {
    type: "career",
    title: "Mobile Application Developer",
    location: "Remote / On-site",
    department: "Software Development",
    isNew: true,
  },
  {
    type: "career",
    title: "UI/UX Designer",
    location: "Remote / On-site",
    department: "Design",
    isNew: true,
  },
];

export const Careers = () => {
  const careers = positions.filter((p) => p.type === "career");

  return (
    <section id="careers" className="py-24 bg-background relative">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-primary font-medium mb-4 tracking-wider uppercase text-sm">
            Join Our Team
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Build a Sustainable Future With Us
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            We're looking for passionate individuals who want to make a real
            impact in sustainable technology. Join a team driven by innovation,
            collaboration, and environmental responsibility.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Careers */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-display text-2xl font-semibold text-foreground">
                Open Positions
              </h3>
            </div>
            <div className="space-y-4">
              {careers.map((position) => (
                <a
                  key={position.title}
                  href="#contact"
                  className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-soft transition-all duration-300"
                >
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {position.title}
                      </h4>
                      {position.isNew && (
                        <span className="px-2 py-0.5 bg-secondary text-secondary-foreground text-xs font-medium rounded-full">
                          New
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
          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              Don't see a perfect fit? We're always open to meeting talented people.
            </p>
            <Button variant="outline" size="lg">
              Send General Application
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};