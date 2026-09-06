import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ArrowRight } from "lucide-react";
import { navLinks } from "@/content/site/navbar";
import veeneroLogo from "@/assets/veenero_logo.png";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setIsScrolled(scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Determine if current page has a dark hero section where unscrolled navbar sits on top
  const isDarkHeroPage =
    location.pathname === "/about" ||
    location.pathname === "/" ||
    location.pathname === "/approach" ||
    location.pathname === "/solutions" ||
    location.pathname === "/impact" ||
    location.pathname === "/careers" ||
    location.pathname === "/blog" ||
    location.pathname === "/contact" ||
    location.pathname.startsWith("/solutions/") ||
    location.pathname === "";

  const isTransparentOverDark = !isScrolled && isDarkHeroPage;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ease-out select-none ${
        isScrolled
          ? "bg-white/95 dark:bg-[#021316]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-teal-900/30 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] py-3"
          : isTransparentOverDark
          ? "bg-gradient-to-b from-slate-950/80 via-slate-950/40 to-transparent py-5"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 max-w-7xl flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center group select-none" aria-label="Veenero Home">
          <img
            src={veeneroLogo}
            alt="Veenero Sustainable Solutions"
            className={`h-9 w-auto object-contain transition-all duration-300 group-hover:opacity-85 ${
              isTransparentOverDark ? "brightness-0 invert drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" : ""
            }`}
            loading="eager"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium transition-all duration-200 relative py-1 px-0.5 group inline-flex flex-col items-center ${
                  isTransparentOverDark
                    ? isActive
                      ? "text-teal-300 font-bold"
                      : "text-slate-100/90 hover:text-white"
                    : isActive
                    ? "text-teal-700 dark:text-teal-400 font-semibold"
                    : "text-foreground/80 hover:text-foreground hover:text-teal-700 dark:hover:text-teal-300"
                }`}
              >
                <span className="transition-transform duration-200 group-hover:-translate-y-[1px]">
                  {link.label}
                </span>
                <span
                  className={`absolute -bottom-0.5 left-0 h-0.5 rounded-full transition-all duration-300 ease-out ${
                    isTransparentOverDark
                      ? isActive
                        ? "w-full bg-teal-400"
                        : "w-0 bg-teal-400 group-hover:w-full"
                      : isActive
                      ? "w-full bg-teal-600 dark:bg-teal-400"
                      : "w-0 bg-teal-600 dark:bg-teal-400 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}
        </div>

        {/* Action Button on Desktop */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            to="/contact"
            className={`group/cta px-5 py-2.5 text-xs sm:text-sm font-extrabold tracking-wide rounded-xl text-white shadow-soft hover:shadow-glow hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all duration-200 flex items-center gap-2 select-none ${
              isTransparentOverDark
                ? "bg-teal-600 hover:bg-teal-500"
                : "bg-teal-700 hover:bg-teal-800"
            }`}
          >
            <span>Get in Touch</span>
            <ArrowRight className="h-4 w-4 stroke-[2.5] transition-transform duration-200 group-hover/cta:translate-x-0.5" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`lg:hidden p-2.5 rounded-xl transition-all duration-200 shadow-xs ${
            isTransparentOverDark
              ? "bg-white/10 border border-white/20 text-white hover:bg-white/20"
              : "bg-card border border-border/60 text-foreground hover:text-teal-600 hover:border-teal-500/30"
          }`}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      <div
        className={`lg:hidden absolute top-full left-0 right-0 bg-card/95 backdrop-blur-2xl border-b border-border/80 shadow-card transition-all duration-300 ease-out overflow-hidden ${
          isMobileMenuOpen
            ? "max-h-[500px] opacity-100 py-6"
            : "max-h-0 opacity-0 py-0 pointer-events-none"
        }`}
      >
        <div className="container mx-auto px-6 flex flex-col gap-2 font-sans">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-sm font-medium px-4 py-2.5 rounded-xl transition-colors flex items-center justify-between ${
                  isActive
                    ? "bg-teal-500/10 text-teal-700 dark:text-teal-300 font-bold border border-teal-500/20"
                    : "text-foreground/85 hover:text-foreground hover:bg-muted/40"
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-600 dark:bg-teal-400" />
                )}
              </Link>
            );
          })}
          <div className="pt-3 mt-2 border-t border-border/40">
            <Link
              to="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-3.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-sm font-extrabold text-center flex items-center justify-center gap-2 shadow-soft"
            >
              <span>Get in Touch</span>
              <ArrowRight className="h-4 w-4 stroke-[2.5]" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
