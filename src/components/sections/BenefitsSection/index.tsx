"use client"

import { motion } from "framer-motion"

const benefits = [
  {
    title: "Digital Transformation",
    description: "Modernize your business operations with cutting-edge digital solutions tailored for African markets",
    icon: "🚀",
  },
  {
    title: "Market Access",
    description: "Connect with new customers and expand your reach across African markets",
    icon: "🌍",
  },
  {
    title: "Secure Payments",
    description: "Reliable and secure payment processing designed for African businesses",
    icon: "🔒",
  },
  {
    title: "Business Analytics",
    description: "Make data-driven decisions with powerful analytics tools",
    icon: "📊",
  },
]

export default function BenefitsSection() {
  return (
    <section className="relative py-20 overflow-hidden" id="benefits">
      {/* Flowing Background Effect - matching hero section */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-primary via-transparent to-dark-primary opacity-80" />
        <div className="hero-glow" /> {/* Reusing hero glow effect */}
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-display-small font-bold hero-gradient-text mb-6">
            Why Choose Us
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-lg">
            Unlock your business potential with our comprehensive suite of digital solutions
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              className="relative p-8 bg-dark-primary/30 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ 
                backgroundColor: "rgba(var(--gold-primary-rgb), 0.05)",
                transition: { duration: 0.3 }
              }}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                  <span className="text-2xl">{benefit.icon}</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-text-secondary">
                    {benefit.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Floating Elements - matching hero section style */}
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
    </section>
  )
}
