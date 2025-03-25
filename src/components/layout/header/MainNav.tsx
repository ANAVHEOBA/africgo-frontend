"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

interface MainNavProps {
  className?: string;
}

const MainNav: React.FC<MainNavProps> = ({ className }) => {
  const pathname = usePathname();
  const isHomePage = pathname === "/"; // Check if on homepage

  const navItems = [
    {
      name: "Features",
      href: isHomePage ? "#features" : "/#features", // Adjust for non-home pages
    },
    {
      name: "How It Works",
      href: isHomePage ? "#how-it-works" : "/#how-it-works",
    },
    {
      name: "Benefits",
      href: isHomePage ? "#benefits" : "/#benefits",
    },
    {
      name: "Success Stories",
      href: isHomePage ? "#success-stories" : "/#success-stories",
    },
    {
      name: "Stores",
      href: "/stores", // External links remain unchanged
    },
    {
      name: "Track Order",
      href: "/track",
    },
  ];

  return (
    <nav className={`relative ${className}`}>
      <div className="flex items-center space-x-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="relative px-4 py-2 group"
          >
            <span className="relative text-sm font-medium text-text-secondary hover:text-dark transition-colors duration-200">
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gold-primary transition-all duration-300 group-hover:w-full" />
            </span>
            <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gold-primary/5 blur-lg -z-10" />
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default MainNav;
