import { HomeFooter } from "@/services/home.service";

// Foundation: Static Footer Content
export const footerContent: HomeFooter = {
  description: "Building India’s Water Intelligence Network—making every litre visible through a real-time water data platform.",
  address: "H-no 3-294/1/A/1 Tailors Colony Adilabad 504001",
  mobile: "9346517202",
  links: {
    solutions: [
      { label: "Veenero Sense", href: "/#solutions" },
      { label: "Veenero Intelligence", href: "/#solutions" },
      { label: "Veenero Insights", href: "/#solutions" },
      { label: "Water Verification", href: "/#solutions" },
    ],
    company: [
      { label: "About Veenero", href: "/#about" },
      { label: "How the Platform Works", href: "/#approach" },
      { label: "Benefits & Outcomes", href: "/#impact" },
      { label: "Careers", href: "/careers" },
    ],
    resources: [
      { label: "Case Studies", href: "#" },
      { label: "Blog", href: "#" },
      { label: "White Papers", href: "#" },
      { label: "FAQ", href: "#" },
    ],
  },
  socialLinks: [
    { iconName: "Linkedin", href: "#", label: "LinkedIn" },
    { iconName: "Twitter", href: "#", label: "Twitter" },
    { iconName: "Youtube", href: "#", label: "YouTube" },
    { iconName: "Mail", href: "udaygedam@veenerosolutions.com", label: "Email" },
  ]
};
