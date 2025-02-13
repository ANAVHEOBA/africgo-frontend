"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"

interface MainNavProps {
  className?: string
}

const navItems = [
  {
    name: "Benefits",
    href: "#benefits",
  },
  {
    name: "Features",
    href: "#features",
  },
  {
    name: "How It Works",
    href: "#how-it-works",
  },
  {
    name: "Success Stories",
    href: "#success-stories",
  }
]

export default function MainNav({ className }: MainNavProps) {
  const pathname = usePathname()

  return (
    <nav className={`relative ${className}`}>
      <div className="flex items-center space-x-1">
        {navItems.map((item) => (
          <Link 
            key={item.href}
            href={item.href}
            className="relative px-4 py-2 group"
          >
            <span 
              className="relative text-sm font-medium text-text-secondary 
                hover:text-white transition-colors duration-200"
            >
              {item.name}
              
              {/* Hover line effect */}
              <span 
                className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gold-primary 
                  transition-all duration-300 group-hover:w-full"
              />
            </span>
            
            {/* Hover glow effect */}
            <div 
              className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100
                transition-opacity duration-300 bg-gold-primary/5 blur-lg -z-10"
            />
          </Link>
        ))}
      </div>
    </nav>
  )
}