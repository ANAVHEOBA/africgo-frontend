"use client"

import Link from "next/link"
import { motion } from "framer-motion"

interface FooterNavProps {
  title: string
  links: {
    name: string
    href: string
  }[]
}

export default function FooterNav({ title, links }: FooterNavProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-white font-medium">{title}</h3>
      <ul className="space-y-4">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href}>
              <motion.span
                className="text-text-secondary hover:text-white text-sm relative group inline-block"
                whileHover={{ x: 6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {link.name}
                <span className="absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-px bg-gold-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-right" />
              </motion.span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}