"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"

const navItems = [
  {
    label: "Overview",
    href: "/account",
  },
  {
    label: "Orders",
    href: "/account/orders",
  },
  {
    label: "Profile",
    href: "/account/profile",
  },
  {
    label: "Addresses",
    href: "/account/addresses",
  },
  {
    label: "Wishlist",
    href: "/account/wishlist",
  },
]

export default function AccountNav() {
  const pathname = usePathname()

  return (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-4 py-2 rounded-lg transition-colors
              ${isActive 
                ? "bg-gold-primary text-dark-primary" 
                : "text-text-secondary hover:text-white hover:bg-dark-secondary"
              }`}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
} 