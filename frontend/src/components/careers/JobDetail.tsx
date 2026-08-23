import React, { useState } from "react";
import { X, Briefcase, MapPin, Clock, Send, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Job } from "./types";

interface JobDetailProps {
  job: Job | null;
  onClose: () => void;
}

export const JobDetail: React.FC<JobDetailProps> = ({ job, onClose }) => {
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [resumeLink, setResumeLink] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!job) return null;

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error("Missing Information", {
        description: "Please enter your name and email address.",
      });
      return;
    }

    setIsSubmitting(true);
    // Simulate application API submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Application Submitted!", {
        description: `Thank you, ${name}! Your application for the ${job.title} position has been successfully submitted.`,
      });
      // Reset state variables
      setName("");
      setEmail("");
      setResumeLink("");
      setCoverLetter("");
      setShowApplyForm(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end font-sans">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/45 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
      />

      {/* Slide-over Drawer Panel */}
      <div className="relative w-full max-w-2xl bg-card border-l border-border/40 h-full overflow-y-auto shadow-2xl z-10 flex flex-col animate-fade-up">
        
        {/* Header - Close Button */}
        <div className="sticky top-0 bg-card/90 backdrop-blur-md border-b border-border/30 px-8 py-5 flex items-center justify-between z-20">
          <span className="text-[10px] font-bold text-teal-600 bg-teal-50 dark:bg-teal-950/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
            Active Opening
          </span>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-8 flex-1 space-y-8">
          <div>
            {/* H1 Job Title */}
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4 leading-tight">
              {job.title}
            </h1>

            {/* Metadata Tags */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-muted-foreground">
              <div className="flex items-center gap-1.5 bg-muted/40 px-2.5 py-1 rounded-lg">
                <Briefcase className="h-4 w-4 text-teal-600/70" />
                <span>{job.department}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-muted/40 px-2.5 py-1 rounded-lg">
                <MapPin className="h-4 w-4 text-teal-600/70" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-muted/40 px-2.5 py-1 rounded-lg">
                <Clock className="h-4 w-4 text-teal-600/70" />
                <span>{job.employmentType}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-muted/40 px-2.5 py-1 rounded-lg">
                <Gauge className="h-4 w-4 text-teal-600/70" />
                <span>{job.experience}</span>
              </div>
            </div>
          </div>

          <hr className="border-border/30" />

          {/* About the Role */}
          <div className="space-y-3">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">
              About the Role
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {job.description}
            </p>
          </div>

          {/* Responsibilities */}
          <div className="space-y-3">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">
              Responsibilities
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
              {job.responsibilities.map((item, index) => (
                <li key={index} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Requirements */}
          <div className="space-y-3">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">
              Requirements
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
              {job.requirements.map((item, index) => (
                <li key={index} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* What We Offer / Benefits */}
          {job.benefits && job.benefits.length > 0 && (
            <div className="space-y-3">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">
                What We Offer
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                {job.benefits.map((item, index) => (
                  <li key={index} className="leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Application Form Drawer Section */}
          <div className="pt-6 border-t border-border/30">
            {!showApplyForm ? (
              <Button
                onClick={() => setShowApplyForm(true)}
                className="w-full rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold py-6 text-base shadow-soft hover:shadow-card font-sans"
              >
                Apply Now
              </Button>
            ) : (
              <div className="p-6 rounded-2xl border border-teal-600/15 bg-muted/20 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-foreground">
                    Submit Application
                  </h3>
                  <button
                    onClick={() => setShowApplyForm(false)}
                    className="text-xs text-muted-foreground hover:text-foreground font-semibold"
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleApplySubmit} className="space-y-4 font-sans">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-1">
                      Full Name
                    </label>
                    <Input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="rounded-xl border-border/60 bg-background"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-1">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      required
                      placeholder="e.g. rahul@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="rounded-xl border-border/60 bg-background"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-1">
                      Resume Link (e.g. Drive, Dropbox, Portfolio URL)
                    </label>
                    <Input
                      type="url"
                      placeholder="e.g. https://myportfolio.com/resume.pdf"
                      value={resumeLink}
                      onChange={(e) => setResumeLink(e.target.value)}
                      className="rounded-xl border-border/60 bg-background"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-1">
                      Why do you want to build the future of water with Veenero?
                    </label>
                    <Textarea
                      placeholder="Tell us about your background, interests, and motivation..."
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      rows={4}
                      className="rounded-xl border-border/60 bg-background"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      "Submitting application..."
                    ) : (
                      <>
                        Submit Application
                        <Send className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default JobDetail;
