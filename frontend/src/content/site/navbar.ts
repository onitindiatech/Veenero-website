export interface NavLink {
  href: string;
  label: string;
}

// Foundation: Static Navbar Content
export const navLinks: NavLink[] = [
  { href: "/about", label: "About Us" },
  { href: "/solutions", label: "Solutions" },
  { href: "/approach", label: "Our Approach" },
  { href: "/impact", label: "Impact" },
  { href: "/careers", label: "Careers" },
  { href: "/blog", label: "Blog / Insights" },
];
