import React from "react";
import { Link } from "react-router-dom";
import { ContactPageContent } from "@/content/contact";
import { ArrowRight } from "lucide-react";

interface ContactCTAProps {
  data: ContactPageContent["cta"];
}

export const ContactCTA: React.FC<ContactCTAProps> = ({ data }) => {
  return (
    <section id="contact-cta" className="py-12 md:py-16 bg-transparent relative">
      <div className="container mx-auto px-6 md:px-12 max-w-7xl font-sans">
        <div className="bg-[#E6F3F3] dark:bg-teal-950/20 border border-teal-600/10 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative shadow-soft">
          
          {/* Animated Ripple Circles in background */}
          <div className="absolute right-[-40px] bottom-[-40px] w-64 h-64 opacity-25 dark:opacity-10 pointer-events-none z-0">
            <div className="absolute inset-0 rounded-full border border-teal-600 animate-ripple" />
            <div className="absolute inset-6 rounded-full border border-teal-600 animate-ripple animation-delay-400" />
            <div className="absolute inset-12 rounded-full border border-teal-600 animate-ripple animation-delay-800" />
          </div>

          {/* Content */}
          <div className="space-y-3 max-w-xl text-center md:text-left relative z-10">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-tight">
              {data.title}
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              {data.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="relative z-10 shrink-0 w-full md:w-auto flex flex-col sm:flex-row items-center gap-3">
            <Link
              to={data.primaryButtonLink || "/solutions"}
              className="w-full sm:w-auto px-6 py-3.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold shadow-soft hover:-translate-y-0.5 transition-all duration-200 text-sm flex items-center justify-center gap-2"
            >
              {data.primaryButtonText || "Explore Solutions"}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to={data.secondaryButtonLink || "/approach"}
              className="w-full sm:w-auto px-6 py-3.5 bg-card hover:bg-muted text-foreground border border-border/80 rounded-xl font-bold hover:-translate-y-0.5 transition-all duration-200 text-sm flex items-center justify-center shadow-soft"
            >
              {data.secondaryButtonText || "Our Methodology"}
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactCTA;
