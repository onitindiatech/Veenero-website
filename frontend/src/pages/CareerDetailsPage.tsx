import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Briefcase, Calendar, Award, CheckCircle2, 
  ChevronRight, Mail, ExternalLink, Loader2, AlertCircle 
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { careerService, Career } from '@/admin/services/career.service';

export const CareerDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [career, setCareer] = useState<Career | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCareer = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        setError(null);
        const data = await careerService.getPublicCareerBySlug(slug);
        setCareer(data);
      } catch (err: any) {
        setError(err.message || 'Job opening not found.');
      } finally {
        setLoading(false);
      }
    };
    loadCareer();
  }, [slug]);

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans relative overflow-hidden">
      
      {/* Floating droplet background accents */}
      <div className="absolute top-[20%] left-[3%] w-8 h-8 rounded-full bg-teal-500/10 border border-teal-600/20 blur-[0.5px] pointer-events-none" />
      <div className="absolute bottom-[35%] right-[4%] w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-600/20 blur-[1px] pointer-events-none" />

      {/* Navbar */}
      <Navbar />

      <main className="flex-1 bg-[#FCFDFD] dark:bg-background pt-24 pb-20 relative z-10">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl space-y-8">
          
          {/* Back link */}
          <Link
            to="/careers"
            className="inline-flex items-center gap-2 text-xs font-bold text-teal-700 dark:text-teal-400 hover:text-teal-800 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Open Positions
          </Link>

          {/* ── State Loading/Error ── */}
          {loading ? (
            <div className="bg-card p-16 border border-border/40 rounded-2xl flex flex-col items-center justify-center gap-3">
              <Loader2 className="h-8 w-8 text-teal-600 animate-spin" />
              <p className="text-xs text-muted-foreground font-semibold">Loading job description...</p>
            </div>
          ) : error || !career ? (
            <div className="bg-card p-12 border border-border/40 rounded-2xl text-center space-y-4 max-w-md mx-auto">
              <AlertCircle className="h-10 w-10 text-rose-500 mx-auto" />
              <h3 className="text-base font-bold text-foreground">Position not found</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {error || 'This job opening may have been closed or moved by the administration.'}
              </p>
              <Link
                to="/careers"
                className="inline-block px-5 py-2.5 bg-teal-700 text-white text-xs font-bold rounded-xl shadow-soft"
              >
                Browse Careers
              </Link>
            </div>
          ) : (
            <div className="space-y-8 animate-fade-up">
              
              {/* ── Job Header Summary block ── */}
              <div className="bg-card p-8 border border-border/40 rounded-3xl shadow-sm space-y-6">
                <div>
                  <span className="text-[10px] font-extrabold text-teal-600 dark:text-teal-400 uppercase tracking-widest block mb-2">
                    {career.department}
                  </span>
                  <h1 className="font-display text-3xl md:text-[2.5rem] font-bold text-foreground leading-tight">
                    {career.title}
                  </h1>
                </div>

                {/* Metadata Items */}
                <div className="flex flex-wrap gap-6 text-xs text-muted-foreground border-t border-border/30 pt-6 font-semibold">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-teal-600" />
                    <span>{career.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-teal-600" />
                    <span>{career.employmentType}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-teal-600" />
                    <span>{career.experience}</span>
                  </div>
                  {career.publishedAt && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-teal-600" />
                      <span>
                        Posted {new Date(career.publishedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Full Job Description Body ── */}
              <div className="bg-card p-8 border border-border/40 rounded-3xl shadow-sm space-y-8 text-foreground font-sans">
                
                {/* Section: Overview */}
                <div className="space-y-3">
                  <h2 className="text-lg font-extrabold text-foreground tracking-tight">Role Overview</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {career.description}
                  </p>
                </div>

                {/* Section: Responsibilities */}
                {career.responsibilities && career.responsibilities.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-extrabold text-foreground tracking-tight">Key Responsibilities</h2>
                    <ul className="space-y-2.5">
                      {career.responsibilities.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Section: Requirements */}
                {career.requirements && career.requirements.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-extrabold text-foreground tracking-tight">Role Requirements</h2>
                    <ul className="space-y-2.5">
                      {career.requirements.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Section: Nice to have */}
                {career.niceToHave && career.niceToHave.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-extrabold text-foreground tracking-tight">Nice To Have</h2>
                    <ul className="space-y-2.5">
                      {career.niceToHave.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          <CheckCircle2 className="h-4 w-4 text-teal-600/60 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Section: Skills Tags */}
                {career.skills && career.skills.length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-border/30">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                      Skills & Technologies
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {career.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-teal-50 dark:bg-teal-950/20 text-teal-700 dark:text-teal-400 border border-teal-600/10 rounded-xl text-xs font-semibold"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* ── Action Apply Call to Action Banner ── */}
              <div className="bg-[#E6F3F3] dark:bg-teal-950/20 border border-teal-600/10 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                <div className="space-y-1.5 text-center md:text-left">
                  <h2 className="text-xl font-bold text-foreground">Interested in this position?</h2>
                  <p className="text-xs text-muted-foreground">
                    Submit your profile to start meaningful conversations with our engineering panel.
                  </p>
                </div>

                <div className="shrink-0 w-full md:w-auto">
                  {career.applicationUrl ? (
                    <a
                      href={career.applicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full md:w-auto px-6 py-3.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold shadow-soft flex items-center justify-center gap-2 text-xs transition-all"
                    >
                      Apply Online
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : (
                    <a
                      href={`mailto:${career.applicationEmail || 'careers@veenero.com'}?subject=Application: ${career.title}`}
                      className="w-full md:w-auto px-6 py-3.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold shadow-soft flex items-center justify-center gap-2 text-xs transition-all"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      Apply via Email
                    </a>
                  )}
                </div>
              </div>

            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CareerDetailsPage;
