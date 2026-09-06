import React, { useState } from "react";
import { ContactPageContent } from "@/content/contact";
import { ChevronDown, HelpCircle, MessageCircleQuestion } from "lucide-react";

interface ContactFAQProps {
  data: ContactPageContent["faq"];
}

export const ContactFAQ: React.FC<ContactFAQProps> = ({ data }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="contact-faq" className="py-12 sm:py-16 lg:py-20 bg-slate-50/70 dark:bg-slate-900/30 relative border-b border-border/15 select-none overflow-hidden">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-teal-500/[0.03] rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="container mx-auto px-6 md:px-12 max-w-4xl space-y-10">
        
        {/* Section Header */}
        <div className="text-center font-sans max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-mono font-bold uppercase tracking-widest border border-teal-500/20 mb-2.5">
            <MessageCircleQuestion className="w-3.5 h-3.5" />
            <span>{data.eyebrow || "COMMON INQUIRIES"}</span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-2 leading-tight tracking-tight">
            {data.title || "Frequently Asked Questions"}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {data.description ||
              "Common questions about evaluating, piloting, and deploying Veenero's water intelligence platform."}
          </p>
        </div>

        {/* Elegant Accordion List */}
        <div className="space-y-3 font-sans text-left">
          {data.items.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "bg-white dark:bg-card border-teal-500/50 shadow-sm ring-1 ring-teal-500/20"
                    : "bg-white/80 dark:bg-card/70 border-border/60 hover:border-teal-500/30 shadow-2xs"
                }`}
              >
                {/* Accordion Trigger Header */}
                <button
                  type="button"
                  onClick={() => toggleItem(idx)}
                  className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left cursor-pointer transition-colors"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400">
                      0{idx + 1}
                    </span>
                    <h3 className="font-display text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {item.question}
                    </h3>
                  </div>

                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300 ${
                      isOpen
                        ? "bg-teal-500 text-slate-950 border-teal-400 rotate-180"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-border/40"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {/* Accordion Content Panel */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100 pb-5 sm:pb-6 px-5 sm:px-6" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="pt-2 border-t border-border/20">
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default ContactFAQ;
