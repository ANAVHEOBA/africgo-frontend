"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function UserNav() {
  return (
    <div className="flex items-center space-x-4">
      <Link href="/login">
        <span className="text-sm font-medium text-text-secondary hover:text-white transition-colors duration-200">
          Log In
        </span>
      </Link>
      <Link href="/register">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2 text-sm font-medium bg-gradient-to-r from-gold-primary to-gold-secondary 
            text-dark-primary rounded-lg hover:shadow-gold transition-all duration-300"
        >
          Register Now
        </motion.button>
      </Link>
    </div>
  );
}
