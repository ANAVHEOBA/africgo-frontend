"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="hero-background min-h-screen flex items-center justify-center pt-20">
      {/* Background Effects */}
      <div className="hero-glow" />
      <div className="absolute inset-0 bg-gradient-to-b from-dark-primary/50 via-transparent to-dark-primary" />

      <div className="container mx-auto px-4">
        <div className="hero-content text-center space-y-8 max-w-4xl mx-auto">
          <motion.h1
            className="text-3xl lg:text-display-large font-bold hero-gradient-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Fast & Reliable Delivery Services
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-hero-subtitle text-text-secondary max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            Connect with local stores and get your items delivered quickly and
            securely
          </motion.p>

          {/* Features List */}
          <motion.div
            className="flex flex-wrap justify-center gap-4 text-sm text-text-secondary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          >
            {[
              "Same-Day Delivery",
              "Real-Time Tracking",
              "Secure Payments",
              "Local Stores",
            ].map((feature, index) => (
              <div key={feature} className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-primary" />
                <span>{feature}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
          >
            <Link href="/stores">
              <motion.button
                className="px-8 py-4 rounded-lg bg-gold-primary text-white 
                    hover:bg-gold-secondary transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Find Stores Near You
              </motion.button>
            </Link>
            <Link href="/register">
              <motion.button
                className="px-8 py-4 rounded-lg border border-gold-primary text-gold-primary 
                hover:bg-gold-primary/10 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Register Your Store
              </motion.button>
            </Link>
          </motion.div>

          {/* Floating Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Decorative elements */}
            <motion.div
              className="absolute top-1/4 left-10 w-20 h-20 bg-gradient-to-r from-gold-primary/20 to-gold-secondary/20 rounded-full blur-xl"
              animate={{
                y: [0, 20, 0],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute bottom-1/4 right-10 w-32 h-32 bg-gradient-to-r from-gold-accent/20 to-gold-highlight/20 rounded-full blur-xl"
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
