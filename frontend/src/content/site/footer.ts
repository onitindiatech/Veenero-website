import { HomeFooter } from "@/services/home.service";

// Foundation: Static Footer Content
export const footerContent: HomeFooter = {
  description: "Veenero Sustainable Solutions Pvt Ltd provides water conservative devices and software to eliminate water waste and ensure future water security.",
  address: "H-no 3-294/1/A/1 Tailors Colony Adilabad 504001, Telangana, India",
  mobile: "9346517202",
  links: {
    solutions: [
      { label: "Aqua Saver", href: "/solutions/aqua-saver" },
      { label: "Water Quality Assessment", href: "/solutions/water-quality-assessment" },
      { label: "Water Pumping Automation", href: "/solutions/water-pumping-automation" },
      { label: "Water Tracking & Informatics", href: "/solutions/water-tracking-informatics" },
      { label: "Leak Identification & Reporting", href: "/solutions/leak-identification" },
    ],
    company: [
      { label: "About Veenero", href: "/about" },
      { label: "Water Conservation Solutions", href: "/solutions" },
      { label: "Impact & Verification", href: "/impact" },
      { label: "Contact Us", href: "/contact" },
    ],
    resources: [
      { label: "Blog & Insights", href: "/blog" },
      { label: "Contact Support", href: "/contact" },
      { label: "Official Portal", href: "https://www.veenerosolutions.com" },
    ],
  },
  socialLinks: [
    { iconName: "Linkedin", href: "#", label: "LinkedIn" },
    { iconName: "Twitter", href: "#", label: "Twitter" },
    { iconName: "Youtube", href: "#", label: "YouTube" },
    { iconName: "Mail", href: "info@veenerosolutions.com", label: "Email" },
  ]
};
