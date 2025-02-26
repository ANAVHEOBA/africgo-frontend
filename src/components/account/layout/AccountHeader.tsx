"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function AccountHeader() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userType")
    router.replace("/login")
  }

  return (
    <header className="bg-dark-secondary border-b border-white/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-white">My Account</h1>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="px-4 py-2 text-text-secondary hover:text-white
              transition-colors"
          >
            Logout
          </motion.button>
        </div>
      </div>
    </header>
  )
} 