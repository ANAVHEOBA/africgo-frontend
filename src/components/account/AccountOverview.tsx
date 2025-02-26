"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export default function AccountOverview() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Recent Orders */}
        <div className="bg-dark-secondary p-6 rounded-lg border border-white/10">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Orders</h2>
          <Link
            href="/account/orders"
            className="text-gold-primary hover:text-gold-secondary transition-colors"
          >
            View All Orders →
          </Link>
        </div>

        {/* Saved Addresses */}
        <div className="bg-dark-secondary p-6 rounded-lg border border-white/10">
          <h2 className="text-lg font-semibold text-white mb-4">Shipping Addresses</h2>
          <Link
            href="/account/addresses"
            className="text-gold-primary hover:text-gold-secondary transition-colors"
          >
            Manage Addresses →
          </Link>
        </div>
      </motion.div>
    </div>
  )
} 