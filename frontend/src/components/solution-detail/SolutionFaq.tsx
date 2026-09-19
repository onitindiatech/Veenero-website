import React, { useState } from "react";
import { ChevronDown, HelpCircle, MessageSquare } from "lucide-react";

export interface FaqItem {
  question: string;
  answer: string;
}

interface SolutionFaqProps {
  data?: FaqItem[];
  onAskClick?: () => void;
}

export const SolutionFaq: React.FC<SolutionFaqProps> = ({ data, onAskClick }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const defaultFaqs: FaqItem[] = [
    {
      question:
        "Does installing Aqua Saver require cutting existing pipes or shutting down the water supply?",
      answer:
        "No. Aqua Saver offers a non-invasive ultrasonic clamp-on 3D-Module that mounts onto the outside of your existing pipes (PVC, GI, HDPE, or MS) without cutting pipes or disrupting the water supply. Standard installation takes under 45 minutes. For new constructions or high-precision industrial lines, in-line volumetric chambers are also available.",
    },
    {
      question:
        "How does Aqua Saver prevent pump motor burnouts and dry runs?",
      answer:
        "The Aqua Saver controller connects to your pump motor's starter panel. If the overhead tank reaches maximum safe capacity, it triggers an instant motor cut-off to prevent overflows. Conversely, if the pump is switched on but flow sensors detect zero water movement within 30 seconds (dry-run condition), it automatically trips the motor to prevent catastrophic coil overheating and bearing damage.",
    },
    {
      question:
        "Can Aqua Saver function during power cuts and in remote pump houses?",
      answer:
        "Yes. Aqua Saver units incorporate an internal military-grade Li-SOCl2 battery backup designed for up to 5 years of continuous sensor operation. Telemetry communicates over cellular (NB-IoT/4G) or LoRaWAN. If network reception is temporarily disrupted, on-device non-volatile memory buffers telemetry data and syncs automatically once connectivity returns.",
    },
    {
      question:
        "How sensitive is the micro-seepage detection? Can it detect small tap drips?",
      answer:
        "Aqua Saver’s 3D-Module combines differential pressure analysis and acoustic vibration sensing to detect continuous fluid movement as low as 50 millilitres per hour. It automatically performs Minimum Night Flow (MNF) analysis during low-demand hours (2 AM – 4 AM), identifying persistent fixture leaks and behind-wall pipe fractures before moisture causes structural damage.",
    },
    {
      question:
        "What kind of reports does Aqua Saver generate for society committees or ESG audits?",
      answer:
        "The platform generates automated monthly PDF and CSV reports displaying total water consumed, litres saved by leak intervention, electricity saved from motor optimization, and complete volumetric reconciliation logs. These documents are audit-ready for society Annual General Meetings (AGMs), municipal compliance, and corporate ESG sustainability disclosures.",
    },
  ];

  const faqs = data && data.length > 0 ? data : defaultFaqs;

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq-section"
      className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-[#070f12] border-b border-[#e2eded] dark:border-teal-900/30 select-none font-sans relative"
    >
      <div className="container mx-auto px-6 md:px-12 max-w-4xl">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800/40 text-teal-700 dark:text-teal-300 text-xs font-mono font-bold uppercase tracking-widest mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
            Technical &amp; Deployment Answers
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed mt-3">
            Clear technical details on how Aqua Saver integrates into existing plumbing and electrical systems.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "border-teal-500/50 bg-[#f8fbfb] dark:bg-[#082025] shadow-xs"
                    : "border-[#e2eded] dark:border-teal-900/40 bg-white dark:bg-[#06181d] hover:border-teal-400/40"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen
                        ? "rotate-180 bg-teal-600 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-teal-950/60 mt-1">
                    <p className="pt-3">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Additional Questions Card */}
        <div className="mt-10 p-6 rounded-2xl bg-[#fafcfc] dark:bg-[#071d22] border border-[#e2eded] dark:border-teal-900/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600/10 dark:bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-display text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Have a specific infrastructure question?
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Our application engineers can evaluate your pipe layouts and pump motor specs.
              </p>
            </div>
          </div>

          {onAskClick && (
            <button
              onClick={onAskClick}
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shrink-0"
            >
              Talk to an Engineer
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default SolutionFaq;
