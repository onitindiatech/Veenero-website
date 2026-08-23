export interface NavLink {
  href: string;
  label: string;
}

// Foundation: Static Navbar Content (Our Partners removed from navbar)
export const navLinks: NavLink[] = [
  { href: "/about", label: "About Us" },
  { href: "/solutions", label: "Solutions" },
  { href: "/approach", label: "Our Approach" },
  { href: "/impact", label: "Impact" },
  { href: "/careers", label: "Careers" },
  { href: "/blog", label: "Blog / Insights" },
  { href: "/contact", label: "Contact" },
];
