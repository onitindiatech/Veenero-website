import { HomePartners } from "@/services/home.service";
import partnerImage from "@/assets/partner.png";
import partner2Image from "@/assets/partner2.jpg";
import part3Image from "@/assets/part3.png";

// Foundation: Static Partners Content (Fallback)
export const partnersContent: HomePartners = {
  visible: true,
  eyebrow: "Water Intelligence Network",
  title: "Collaborating to Make Water Visible Across India",
  description: "We partner with research institutions, industry ecosystems, and infrastructure stakeholders to build Water Intelligence, strengthen Water Verification, and accelerate network-scale benchmarking.",
  list: [
    {
      name: "IIT ROPAR",
      logo: partnerImage,
      description: "Research collaboration for Water Intelligence and evidence-driven infrastructure.",
    },
    {
      name: "ELECTROPRENEUR PARK",
      logo: partner2Image,
      description: "Ecosystem partner supporting the Water Data Platform and network growth.",
    },
    {
      name: "VISHNU TBI",
      logo: part3Image,
      description: "Innovation partner advancing Water Verification and real-time analytics.",
    },
  ],
};
