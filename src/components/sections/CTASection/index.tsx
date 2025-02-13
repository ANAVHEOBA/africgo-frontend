"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export default function CTASection() {
  return (
    <section className="relative py-24 overflow-hidden" id="get-started">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-primary via-transparent to-dark-primary opacity-80" />
        <div className="hero-glow" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Main Content */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-display-small font-bold hero-gradient-text mb-6">
              Join the Digital Revolution in African Commerce
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto mb-12">
              Be among the first to transform your business with our comprehensive digital solutions.
            </p>

            {/* Single CTA Button */}
            <motion.div 
              className="flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Link href="/register">
                <motion.button 
                  className="px-8 py-4 text-lg font-medium bg-gradient-to-r from-gold-primary to-gold-secondary 
                    text-dark-primary rounded-lg hover:scale-105 transition-transform duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Register Now
                </motion.button>
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div 
              className="mt-16 pt-16 border-t border-white/10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="text-center">
                <p className="text-text-secondary mb-8">Join leading African businesses</p>
                <div className="flex flex-wrap justify-center gap-12 opacity-50">
                  {["🏢", "🏬", "🏪", "🏭", "🏦"].map((logo, index) => (
                    <motion.span 
                      key={index}
                      className="text-4xl"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      {logo}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div 
          className="absolute top-1/4 left-0 w-96 h-96 bg-gradient-to-r from-gold-primary/20 to-gold-secondary/20 rounded-full blur-3xl"
          animate={{
            y: [0, 50, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-0 w-96 h-96 bg-gradient-to-r from-gold-accent/20 to-gold-highlight/20 rounded-full blur-3xl"
          animate={{
            y: [0, -50, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </section>
  )
}
