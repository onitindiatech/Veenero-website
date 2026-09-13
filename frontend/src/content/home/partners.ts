import { HomePartners } from "@/services/home.service";
import partnerImage from "@/assets/partner.png";
import partner2Image from "@/assets/partner2.jpg";
import part3Image from "@/assets/part3.png";
import iiitDelhiImage from "@/assets/iiitdelhi_logo.jpg";
import stpiImage from "@/assets/STPI_LOGO.png";
import meityImage from "@/assets/Ministry_of_electronics_information_technology.png";
import stpiNextImage from "@/assets/STPINEXT_LOGO.png";
import iesaImage from "@/assets/Iesa_logo.jpg";

// Foundation: Static Partners Content (Fallback)
export const partnersContent: HomePartners = {
  visible: true,
  eyebrow: "ACHIEVEMENTS & RECOGNITION",
  title: "Validated by Leading Innovation Platforms",
  description: "Our water conservation devices and methodology have been evaluated and recognized across state and national forums.",
  list: [
    {
      name: "WE Hub, Government of Telangana",
      logo: partnerImage,
      description: "Proof-of-Concept (POC) certification from WE Hub, Government of Telangana.",
    },
    {
      name: "Intinta Innovator Award",
      logo: partner2Image,
      description: "Aqua Saver awarded Intinta Innovator Award for two consecutive years at district level.",
    },
    {
      name: "National Innovation Challenge",
      logo: part3Image,
      description: "Participated in the National Innovation Challenge held at PIET College, Haryana.",
    },
    {
      name: "IIIT Delhi",
      logo: iiitDelhiImage,
      description: "Recognized for our innovation in sustainable water solutions and technology-driven impact.",
    },
    {
      name: "STPI (Software Technology Parks of India)",
      logo: stpiImage,
      description: "Supported under STPI for innovation and technology development.",
    },
    {
      name: "Ministry of Electronics & Information Technology",
      logo: meityImage,
      description: "Recognized for contribution towards technology-led solutions for a sustainable future.",
    },
    {
      name: "STPINEXT Initiatives",
      logo: stpiNextImage,
      description: "Featured under STPINEXT for supporting emerging tech startups and innovative solutions.",
    },
    {
      name: "IESA (India Electronics & Semiconductor Association)",
      logo: iesaImage,
      description: "Recognized under IESA for innovation and technology development in sustainable solutions.",
    },
  ],
};

