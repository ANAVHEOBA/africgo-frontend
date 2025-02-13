"use client"

import { motion } from "framer-motion"

const steps = [
  {
    number: "01",
    title: "Sign Up",
    description: "Create your account in minutes with our streamlined onboarding process",
    icon: "✨",
    gradient: "from-gold-primary/20 to-gold-secondary/20",
  },
  {
    number: "02",
    title: "Customize Your Store",
    description: "Set up your digital storefront with our intuitive dashboard and tools",
    icon: "🎨",
    gradient: "from-gold-secondary/20 to-gold-accent/20",
  },
  {
    number: "03",
    title: "Connect Payment Methods",
    description: "Integrate local and international payment options for your customers",
    icon: "💳",
    gradient: "from-gold-accent/20 to-gold-highlight/20",
  },
  {
    number: "04",
    title: "Launch & Grow",
    description: "Go live and start selling to customers across Africa and beyond",
    icon: "🚀",
    gradient: "from-gold-highlight/20 to-gold-primary/20",
  },
]

export default function HowItWorksSection() {
  return (
    <section className="relative py-24 overflow-hidden" id="how-it-works">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-primary via-transparent to-dark-primary opacity-80" />
        <div className="hero-glow" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-display-small font-bold hero-gradient-text mb-6">
            How It Works
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-lg">
            Get started with your digital transformation in four simple steps
          </p>
        </motion.div>

        {/* Steps */}
        <div className="max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              className="relative flex items-start gap-8 mb-16 last:mb-0"
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              {/* Step Number */}
              <div className="flex-shrink-0 w-20 h-20 flex items-center justify-center">
                <motion.div
                  className="text-4xl font-bold hero-gradient-text"
                  initial={{ scale: 0.5 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  {step.number}
                </motion.div>
              </div>

              {/* Step Content */}
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-3xl">{step.icon}</span>
                  <h3 className="text-2xl font-semibold text-white">
                    {step.title}
                  </h3>
                </div>
                <p className="text-text-secondary text-lg">
                  {step.description}
                </p>
              </div>

              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <motion.div 
                  className="absolute left-10 top-20 w-0.5 h-16 bg-gradient-to-b from-gold-primary/20 to-transparent"
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* Floating Elements */}
        <motion.div 
          className="absolute top-1/4 left-0 w-64 h-64 bg-gradient-to-r from-gold-primary/20 to-gold-secondary/20 rounded-full blur-3xl"
          animate={{
            y: [0, 40, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-0 w-80 h-80 bg-gradient-to-r from-gold-accent/20 to-gold-highlight/20 rounded-full blur-3xl"
          animate={{
            y: [0, -40, 0],
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
