import { HomeCareers } from "@/services/home.service";

// Foundation: Static Careers Content (Fallback)
export const homeCareersContent: HomeCareers = {
  visible: true,
  eyebrow: "Join Our Team",
  title: "Help Build India’s Water Intelligence Network",
  description: "We’re looking for builders who care about data integrity, real-time analytics, and sustainable infrastructure. Join a team creating the future water data platform—so organizations can measure, monitor, optimize, benchmark, and verify every litre.",
  openingsTitle: "Open Positions",
  list: [
    { title: "IoT Hardware Engineer", location: "Remote / On-site", department: "Engineering", isNew: true },
    { title: "Mobile Application Developer", location: "Remote / On-site", department: "Software Development", isNew: true },
    { title: "UI/UX Designer", location: "Remote / On-site", department: "Design", isNew: true },
  ],
  generalAppText: "Don't see a perfect fit? We're always open to meeting talented people.",
  generalAppButtonText: "Send General Application",
};
