import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Linkedin,
  Twitter,
  Youtube,
  Mail,
  ArrowUpRight,
  MapPin,
  Phone,
} from "lucide-react";
import { footerContent } from "@/content/site/footer";
import { getPublicFooter, PublicFooterData } from "@/services/footer.service";
import veeneroLogo from "@/assets/veenero_logo.png";

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Linkedin,
  Twitter,
  Youtube,
  Mail,
};

/**
 * Standard Official Google "G" 4-color Vector Logo
 */
const GoogleGLogo: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </svg>
);

export const Footer: React.FC = () => {
  const [data, setData] = useState<PublicFooterData | null>(null);

  useEffect(() => {
    getPublicFooter()
      .then((res) => {
        if (res) setData(res);
      })
      .catch(() => {});
  }, []);

  const description = data?.description || footerContent.description;
  const address = data?.address || footerContent.address;
  const mobile = data?.mobile || footerContent.mobile;
  const links = data?.links || footerContent.links;
  const socialLinks = data?.socialLinks || footerContent.socialLinks;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#050b14] text-slate-100 pt-16 md:pt-20 pb-10 border-t border-teal-900/30 relative overflow-hidden font-sans select-none">
      {/* CSS for slow, elegant water wave motion */}
      <style>{`
        @keyframes footer-water-flow {
          0% { transform: translateX(0) translateZ(0); }
          100% { transform: translateX(-20%) translateZ(0); }
        }
        .footer-water-wave-anim {
          animation: footer-water-flow 18s ease-in-out infinite alternate;
        }
        @media (prefers-reduced-motion: reduce) {
          .footer-water-wave-anim { animation: none !important; }
        }
      `}</style>

      {/* Ambient background glows */}
      <div className="absolute top-0 right-1/4 w-[450px] h-[350px] bg-teal-500/[0.04] rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-12 left-1/4 w-[400px] h-[300px] bg-cyan-500/[0.03] rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Subtle Restrained Water-Inspired Wave Background Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-28 sm:h-36 overflow-hidden pointer-events-none opacity-[0.14] -z-0">
        <svg
          className="w-[180%] h-full text-teal-500 footer-water-wave-anim"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            d="M0,45 C280,75 520,15 760,50 C1000,85 1240,25 1440,60 L1440,120 L0,120 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-14 reveal-on-scroll">
          
          {/* 1. LEFT BRAND AREA (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Brand Logo */}
            <Link to="/" className="inline-flex items-center group" aria-label="Veenero Home">
              <img
                src={veeneroLogo}
                alt="Veenero Sustainable Solutions"
                className="h-9 sm:h-10 w-auto object-contain brightness-0 invert opacity-95 group-hover:opacity-100 transition-opacity duration-300"
                loading="lazy"
              />
            </Link>

            {/* Description */}
            <p className="text-slate-400 text-sm leading-relaxed max-w-md font-normal">
              {description}
            </p>

            {/* Address & Mobile Information */}
            <div className="space-y-2 pt-1 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-3.5 h-3.5 text-teal-400/80 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  <strong className="text-slate-200 font-semibold">Address:</strong> {address}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-3.5 h-3.5 text-teal-400/80 shrink-0" />
                <span>
                  <strong className="text-slate-200 font-semibold">Mobile:</strong> +91 {mobile}
                </span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pt-1">
              {socialLinks.map((social) => {
                const IconComponent = iconMap[social.iconName] || Mail;
                const isEmail = social.iconName === "Mail";
                const href = isEmail && !social.href.startsWith("mailto:") ? `mailto:${social.href}` : social.href;
                return (
                  <a
                    key={social.label}
                    href={href}
                    target={isEmail ? "_self" : "_blank"}
                    rel={isEmail ? undefined : "noopener noreferrer"}
                    aria-label={social.label}
                    className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:border-teal-400/50 hover:bg-teal-500/15 text-slate-300 hover:text-teal-300 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center shadow-xs"
                  >
                    <IconComponent className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* 2. SOLUTIONS (lg:col-span-2) */}
          <div className="lg:col-span-2">
            <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-teal-400 mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 inline-block" />
              Solutions
            </h4>
            <ul className="space-y-3 text-sm">
              {links.solutions.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="group inline-flex items-center gap-1.5 text-slate-400 hover:text-slate-100 transition-colors duration-200 relative py-0.5"
                  >
                    <span className="relative">
                      {link.label}
                      <span className="absolute left-0 bottom-0 w-0 h-[1.5px] bg-teal-400 transition-all duration-300 group-hover:w-full" />
                    </span>
                    <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 translate-y-0.5 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-200 text-teal-400" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. COMPANY (lg:col-span-2) */}
          <div className="lg:col-span-2">
            <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-teal-400 mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 inline-block" />
              Company
            </h4>
            <ul className="space-y-3 text-sm">
              {links.company.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="group inline-flex items-center gap-1.5 text-slate-400 hover:text-slate-100 transition-colors duration-200 relative py-0.5"
                  >
                    <span className="relative">
                      {link.label}
                      <span className="absolute left-0 bottom-0 w-0 h-[1.5px] bg-teal-400 transition-all duration-300 group-hover:w-full" />
                    </span>
                    <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 translate-y-0.5 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-200 text-teal-400" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. RESOURCES & GOOGLE REVIEWS TRUST CARD (lg:col-span-3) */}
          <div className="lg:col-span-3 flex flex-col justify-between">
            <div>
              <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-teal-400 mb-5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 inline-block" />
                Resources
              </h4>
              <ul className="space-y-3 text-sm">
                {links.resources.map((link) => {
                  const isInternalBlog = link.label.toLowerCase() === "blog";
                  const destination = isInternalBlog ? "/blog" : link.href;
                  return (
                    <li key={link.label}>
                      <Link
                        to={destination}
                        className="group inline-flex items-center gap-1.5 text-slate-400 hover:text-slate-100 transition-colors duration-200 relative py-0.5"
                      >
                        <span className="relative">
                          {link.label}
                          <span className="absolute left-0 bottom-0 w-0 h-[1.5px] bg-teal-400 transition-all duration-300 group-hover:w-full" />
                        </span>
                        <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 translate-y-0.5 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-200 text-teal-400" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Google Reviews / Trust Card */}
            <a
              href="https://www.google.com/search?q=Veenero+Sustainable+Solutions"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 block p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-teal-500/30 hover:bg-white/[0.06] transition-all duration-300 group shadow-xs max-w-[240px]"
              aria-label="Google Reviews - 5.0 rating for Veenero Sustainable Solutions"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <GoogleGLogo className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-teal-300 transition-colors">
                    Google Reviews
                  </span>
                </div>
                <ArrowUpRight className="w-3 h-3 text-slate-500 group-hover:text-teal-400 transition-colors shrink-0" />
              </div>

              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-bold text-white font-mono">5.0</span>
                <div className="flex items-center text-[#FBBC05] text-xs tracking-tight" aria-label="5.0 out of 5 stars">
                  ★★★★★
                </div>
              </div>

              <p className="text-[11px] text-slate-400 font-normal">
                Trusted by our customers
              </p>
            </a>
          </div>
        </div>

        {/* 5. BOTTOM BAR */}
        <div className="pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p className="font-normal">
            © {currentYear} Veenero Sustainable Solutions. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link to="/about" className="hover:text-teal-300 transition-colors duration-200">
              About
            </Link>
            <Link to="/solutions" className="hover:text-teal-300 transition-colors duration-200">
              Solutions
            </Link>
            <Link to="/careers" className="hover:text-teal-300 transition-colors duration-200">
              Careers
            </Link>
            <Link to="/contact" className="hover:text-teal-300 transition-colors duration-200">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
