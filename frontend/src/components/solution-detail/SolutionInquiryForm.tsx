import React, { useState } from "react";
import {
  Send,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Clock,
  Building,
  Sparkles,
  Mail,
  User,
  MessageSquare,
} from "lucide-react";

interface SolutionInquiryFormProps {
  solutionName: string;
}

export const SolutionInquiryForm: React.FC<SolutionInquiryFormProps> = ({
  solutionName,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    requirement: "",
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      setErrorMessage("Please fill in your name and work email.");
      return;
    }

    setIsSubmitting(true);
    // UI-only simulated submission
    await new Promise((resolve) => setTimeout(resolve, 850));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const handleReset = () => {
    setIsSuccess(false);
    setFormData({ name: "", email: "", organization: "", requirement: "" });
  };

  return (
    <section
      id="inquiry-section"
      className="py-16 sm:py-20 lg:py-24 bg-[#f8fbfb] dark:bg-[#05171b] border-b border-[#e2eded] dark:border-teal-900/30 select-none font-sans relative"
    >
      <div className="container mx-auto px-6 md:px-12 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column (5 cols): Heading, Trust Badges, Context */}
          <div className="lg:col-span-5 text-left space-y-6 reveal-on-scroll">
            <div>
              <span className="text-teal-700 dark:text-teal-400 font-bold uppercase tracking-widest text-xs font-mono block mb-2">
                DIRECT INQUIRY
              </span>
              <div className="w-10 h-0.5 bg-teal-600 rounded-full mb-3" />
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
                Have Questions? Let's Talk.
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed mt-3">
                Contact our engineering team to discuss your operational requirements, evaluate telemetry feasibility across your network, and explore live platform capabilities for {solutionName}.
              </p>
            </div>

            {/* Trust points */}
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-600/10 dark:bg-teal-500/15 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Rapid Engineering Response
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Direct callback from a senior water systems specialist within 24 hours.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-600/10 dark:bg-teal-500/15 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Enterprise Confidentiality
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Full NDA protection for your infrastructure layouts and volumetric data.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-600/10 dark:bg-teal-500/15 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Custom Proof-of-Concept
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Live pilot telemetry setups available for industrial and utility networks.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (7 cols): Compact Inquiry Form */}
          <div className="lg:col-span-7 reveal-on-scroll reveal-delay-200">
            <div className="rounded-2xl border border-[#dce9e6] dark:border-teal-900/50 bg-white dark:bg-[#071d22] p-6 sm:p-8 lg:p-10 shadow-[0_15px_40px_rgba(15,76,92,0.06)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.4)]">
              {isSuccess ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
                    Demo Request Received
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                    Thank you! We've received your details for{" "}
                    <strong className="text-teal-600 dark:text-teal-400 font-semibold">
                      {solutionName}
                    </strong>
                    . Our water technology engineer will reach out to you within one business day.
                  </p>
                  <button
                    onClick={handleReset}
                    className="mt-4 px-6 py-2.5 rounded-xl bg-slate-100 dark:bg-[#031417] text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                  <div className="mb-2">
                    <span className="text-xs font-mono font-semibold text-teal-700 dark:text-teal-400 uppercase tracking-wider">
                      Request a Demo for {solutionName}
                    </span>
                  </div>

                  {errorMessage && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-300 text-xs">
                      {errorMessage}
                    </div>
                  )}

                  {/* 1. Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Your Full Name <span className="text-teal-600 dark:text-teal-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Rohan Sharma"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#031317] border border-slate-200 dark:border-teal-900/50 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* 2. Work Email */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Work Email <span className="text-teal-600 dark:text-teal-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. rohan@enterprise.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#031317] border border-slate-200 dark:border-teal-900/50 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* 3. Organization */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Organization / Utility Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Building className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        name="organization"
                        value={formData.organization}
                        onChange={handleChange}
                        placeholder="e.g. Municipal Water Board / Tata Steel"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#031317] border border-slate-200 dark:border-teal-900/50 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* 4. Requirement / Message */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Requirement / Operational Context
                    </label>
                    <div className="relative">
                      <div className="absolute top-3 left-3.5 pointer-events-none text-slate-400">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <textarea
                        name="requirement"
                        rows={3}
                        value={formData.requirement}
                        onChange={handleChange}
                        placeholder="Briefly describe your water assets, sites, or monitoring goals..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#031317] border border-slate-200 dark:border-teal-900/50 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all resize-none"
                      />
                    </div>
                  </div>

                  {/* Submit CTA */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-6 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-soft hover:shadow-glow hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Submitting Request...</span>
                        </>
                      ) : (
                        <>
                          <span>Request a Demo</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionInquiryForm;
