import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, AlertCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CareersHero } from "@/components/careers/CareersHero";
import { HiringProcess } from "@/components/careers/HiringProcess";
import { JobFilters } from "@/components/careers/JobFilters";
import { JobList } from "@/components/careers/JobList";
import { CareersCTA } from "@/components/careers/CareersCTA";
import { CareerHeroData } from "@/components/careers/types";
import { careerService, Career } from "@/admin/services/career.service";

// Careers Hero Data
const defaultCareerHeroConfig: Partial<CareerHeroData> = {
  eyebrow: "CAREERS AT VEENERO",
  title: "Build the Future of Water Intelligence",
  description:
    "We are building India's water intelligence platform. Join our mission to make every litre visible, verifiable, and meaningful.",
  primaryCtaText: "Explore Opportunities",
  secondaryCtaText: "Hiring Process",
};

export const CareersPage: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Career[]>([]);
  const [pageSettings, setPageSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedLoc, setSelectedLoc] = useState("");
  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    document.title = "Careers | Veenero - Build the Future of Water Intelligence";
    window.scrollTo(0, 0);

    const fetchAll = async () => {
      try {
        setLoading(true);
        setError(null);
        const [jobsData, settingsData] = await Promise.allSettled([
          careerService.getPublicCareers(),
          careerService.getPageSettings(),
        ]);
        if (jobsData.status === "fulfilled") {
          setJobs(jobsData.value);
        }
        if (settingsData.status === "fulfilled" && settingsData.value) {
          setPageSettings(settingsData.value);
          if (settingsData.value.seo?.metaTitle) {
            document.title = settingsData.value.seo.metaTitle;
          }
        }
      } catch (err: any) {
        setError(err.message || "Failed to load positions.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const heroConfig = pageSettings?.hero
    ? {
        eyebrow: pageSettings.hero.eyebrow || defaultCareerHeroConfig.eyebrow,
        title: pageSettings.hero.title || defaultCareerHeroConfig.title,
        description: pageSettings.hero.description || defaultCareerHeroConfig.description,
        primaryCtaText: pageSettings.hero.primaryCtaText || defaultCareerHeroConfig.primaryCtaText,
        secondaryCtaText: pageSettings.hero.secondaryCtaText || defaultCareerHeroConfig.secondaryCtaText,
      }
    : defaultCareerHeroConfig;

  // Extract unique filters from MongoDB data
  const departments = Array.from(new Set(jobs.map((j) => j.department)));
  const locations = Array.from(new Set(jobs.map((j) => j.location)));
  const types = Array.from(new Set(jobs.map((j) => j.employmentType)));

  // Filter jobs dynamically
  const filteredJobs = jobs.filter((job) => {
    const matchSearch = searchQuery
      ? job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
    const matchDept = selectedDept ? job.department === selectedDept : true;
    const matchLoc = selectedLoc ? job.location === selectedLoc : true;
    const matchType = selectedType ? job.employmentType === selectedType : true;
    return matchSearch && matchDept && matchLoc && matchType;
  });

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans relative overflow-x-hidden">
      {/* Subtle Ambient Water Glows matching Design Language */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none">
        <div className="absolute -top-[15%] -left-[10%] w-[65vw] h-[65vw] max-w-[700px] max-h-[700px] bg-gradient-to-br from-teal-500/[0.04] to-transparent rounded-full blur-3xl" />
        <div className="absolute top-[35%] -right-[15%] w-[55vw] h-[55vw] max-w-[650px] max-h-[650px] bg-gradient-to-bl from-cyan-500/[0.03] via-teal-500/[0.02] to-transparent rounded-full blur-3xl" />
        <div className="absolute top-[68%] -left-[12%] w-[60vw] h-[60vw] max-w-[680px] max-h-[680px] bg-gradient-to-tr from-teal-500/[0.03] to-transparent rounded-full blur-3xl" />
      </div>

      {/* Main Global Navbar */}
      <Navbar />

      {/* Page Content */}
      <main className="flex-1 bg-transparent">
        
        {/* 1. HERO SECTION */}
        <CareersHero data={heroConfig} jobCount={jobs.length || 6} />

        {/* 2. OPEN OPPORTUNITIES — Interactive Job Listings */}
        <section id="open-positions" className="py-12 sm:py-16 lg:py-20 relative bg-gradient-wave dark:bg-slate-900/30 border-b border-border/15 select-none">
          <div className="container mx-auto px-6 md:px-12 max-w-7xl space-y-10">
            
            {/* Section Header */}
            <div className="text-left font-sans max-w-3xl">
              <div>
                <span className="text-teal-700 dark:text-teal-400 font-bold uppercase tracking-widest text-xs font-mono block mb-1.5">
                  OPEN OPPORTUNITIES
                </span>
                <div className="w-10 h-0.5 bg-teal-600 rounded-full mb-3" />
              </div>

              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-2 leading-tight tracking-tight">
                Current Openings &amp; Roles
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                Explore engineering, hardware, data science, and operations roles shaping water intelligence across India.
              </p>
            </div>

            {/* Horizontal Filters UI */}
            <div className="w-full bg-card p-4 sm:p-5 rounded-2xl border border-border/60 shadow-xs">
              <JobFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedDept={selectedDept}
                setSelectedDept={setSelectedDept}
                selectedLoc={selectedLoc}
                setSelectedLoc={setSelectedLoc}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                departments={departments}
                locations={locations}
                types={types}
              />
            </div>

            {/* Listings Grid */}
            {loading ? (
              <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
                <Loader2 className="h-8 w-8 text-teal-600 animate-spin" />
                <p className="text-xs text-muted-foreground font-semibold">Updating career opportunities...</p>
              </div>
            ) : error ? (
              <div className="bg-rose-50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900/30 p-6 rounded-2xl text-rose-700 dark:text-rose-400 text-xs font-semibold flex items-center gap-3 justify-center">
                <AlertCircle className="h-5 w-5 text-rose-500" />
                <span>Error updating openings: {error}</span>
              </div>
            ) : (
              <JobList
                jobs={filteredJobs}
                onViewDetails={(job) => navigate(`/careers/${job.slug}`)}
              />
            )}

            {/* Center Reset & View All Button */}
            <div className="flex justify-center pt-2">
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedDept("");
                  setSelectedLoc("");
                  setSelectedType("");
                  const el = document.getElementById("open-positions");
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="px-6 py-2.5 border border-teal-600/30 text-teal-700 dark:text-teal-400 bg-card hover:bg-muted font-bold rounded-xl text-xs sm:text-sm shadow-xs transition-all duration-150 cursor-pointer"
              >
                Reset Filters &amp; View All Roles
              </button>
            </div>

          </div>
        </section>

        {/* 3. HIRING PROCESS — Animated Step Timeline */}
        <HiringProcess data={pageSettings?.hiringProcess} />

        {/* 4. CAREER CTA — Dark Aquatic Final Call to Action */}
        <CareersCTA data={pageSettings?.cta} />

      </main>

      {/* Main Global Footer */}
      <Footer />
    </div>
  );
};

export default CareersPage;
