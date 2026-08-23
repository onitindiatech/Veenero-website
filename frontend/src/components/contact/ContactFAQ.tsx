import React from "react";
import { ContactPageContent } from "@/content/contact";
import { HelpCircle } from "lucide-react";

interface ContactFAQProps {
  data: ContactPageContent["faq"];
}

export const ContactFAQ: React.FC<ContactFAQProps> = ({ data }) => {
  return (
    <section id="contact-faq" className="py-12 md:py-16 bg-transparent relative border-b border-border/10">
      <div className="container mx-auto px-6 md:px-12 max-w-7xl space-y-12">
        
        {/* Section Header */}
        <div className="text-left font-sans max-w-3xl">
          {data.eyebrow && (
            <span className="text-teal-600 dark:text-teal-400 font-bold uppercase tracking-widest text-[10px] md:text-xs block mb-3">
              {data.eyebrow}
            </span>
          )}
          <h2 className="font-display text-3xl md:text-[2.5rem] font-bold text-foreground mb-3">
            {data.title}
          </h2>
          {data.description && (
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              {data.description}
            </p>
          )}
        </div>

        {/* 2x2 FAQ Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.items.map((item, idx) => (
            <div
              key={idx}
              className="group bg-card p-6 md:p-8 rounded-2xl border border-border/40 hover:border-teal-600/30 shadow-sm hover:shadow-soft hover:-translate-y-1 transition-all duration-300 flex flex-col font-sans"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400 shrink-0 group-hover:scale-110 transition-transform duration-300 mt-0.5">
                  <HelpCircle className="h-5 w-5 stroke-[2]" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-foreground leading-snug group-hover:text-teal-700 transition-colors">
                    {item.question}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ContactFAQ;
