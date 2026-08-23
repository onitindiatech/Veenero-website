import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, AlertCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CareersHero } from "@/components/careers/CareersHero";
import { WhyVeenero } from "@/components/careers/WhyVeenero";
import { HiringProcess } from "@/components/careers/HiringProcess";
import { JobFilters } from "@/components/careers/JobFilters";
import { JobList } from "@/components/careers/JobList";
import { CareersCTA } from "@/components/careers/CareersCTA";
import { CareerHeroData } from "@/components/careers/types";
import { careerService, Career } from "@/admin/services/career.service";

// Configurable Careers Hero Data (CMS & API structural representation)
const careerHeroConfig: Partial<CareerHeroData> = {
  eyebrow: "CAREERS AT VEENERO",
  title: "Build the Future of Water With Us",
  description:
    "We are building India's water intelligence platform. Join our mission to make every litre visible.",
  backgroundImage: "", // CMS URL in future; empty string triggers default Home Hero image fallback
  primaryCtaText: "Explore Open Positions",
  secondaryCtaText: "Life at Veenero",
};

export const CareersPage: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedLoc, setSelectedLoc] = useState("");
  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await careerService.getPublicCareers();
        setJobs(data);
      } catch (err: any) {
        setError(err.message || "Failed to load positions.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

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
    <div className="min-h-screen bg-background flex flex-col font-sans relative overflow-hidden">
      {/* Floating droplet background accents matching mockups */}
      <div className="absolute top-[25%] left-[2%] w-6 h-6 rounded-full bg-teal-500/10 border border-teal-600/20 blur-[0.5px] pointer-events-none animate-float z-0" />
      <div className="absolute top-[45%] right-[3%] w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-600/20 blur-[1px] pointer-events-none animate-float animation-delay-400 z-0" />
      <div className="absolute top-[70%] left-[4%] w-5 h-5 rounded-full bg-teal-400/15 border border-teal-500/30 blur-[0.5px] pointer-events-none animate-float animation-delay-200 z-0" />

      {/* Navbar */}
      <Navbar />

      {/* Page Content */}
      <main className="flex-1 bg-[#FCFDFD] dark:bg-background">
        
        {/* 1. Careers Hero */}
        <CareersHero data={careerHeroConfig} />

        {/* 2. Open Positions Section */}
        <section id="open-positions" className="py-10 md:py-12 relative bg-transparent">
          <div className="container mx-auto px-6 md:px-12 max-w-7xl space-y-12">
            
            {/* Section Header */}
            <div className="text-left font-sans">
              <span className="text-teal-600 dark:text-teal-400 font-bold uppercase tracking-widest text-[10px] md:text-xs block mb-3">
                OPEN POSITIONS
              </span>
              <h2 className="font-display text-3xl md:text-[2.5rem] font-bold text-foreground">
                Find Your Next Opportunity
              </h2>
            </div>

            {/* Horizontal Filters UI */}
            <div className="w-full">
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

            {/* Listings Grid (3 columns on desktop) */}
            {loading ? (
              <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
                <Loader2 className="h-8 w-8 text-teal-600 animate-spin" />
                <p className="text-xs text-muted-foreground font-semibold">Updating career opportunities...</p>
              </div>
            ) : error ? (
              <div className="bg-rose-50 dark:bg-rose-950/10 border border-rose-100 p-6 rounded-2xl text-rose-700 text-xs font-semibold flex items-center gap-3 justify-center">
                <AlertCircle className="h-5 w-5 text-rose-500" />
                <span>Error updating openings: {error}</span>
              </div>
            ) : (
              <JobList
                jobs={filteredJobs}
                onViewDetails={(job) => navigate(`/careers/${job.slug}`)}
              />
            )}

            {/* Center View All Open Positions Button */}
            <div className="flex justify-center pt-4">
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
                className="px-6 py-3 border border-teal-600/30 text-teal-700 dark:text-teal-400 bg-card hover:bg-muted font-bold rounded-xl text-sm shadow-sm transition-all duration-150"
              >
                View All Open Positions
              </button>
            </div>

          </div>
        </section>

        {/* 3. Why Join Veenero Section */}
        <WhyVeenero />

        {/* 4. Selection Process Section */}
        <HiringProcess />

        {/* 5. Impact CTA Section */}
        <CareersCTA />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CareersPage;
