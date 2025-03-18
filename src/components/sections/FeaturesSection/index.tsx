"use client"

import { motion } from "framer-motion"

const features = [
  {
    title: "Real-Time Tracking",
    description: "Track your deliveries in real-time with live updates and notifications",
    icon: "🚚",
    gradient: "from-gold-primary/20 to-gold-secondary/20",
  },
  {
    title: "Zone-Based Delivery",
    description: "Efficient delivery zones for better coverage and faster service",
    icon: "🎯",
    gradient: "from-gold-secondary/20 to-gold-accent/20",
  },
  {
    title: "Secure Payments",
    description: "Safe and secure payment processing for all transactions",
    icon: "🔒",
    gradient: "from-gold-accent/20 to-gold-highlight/20",
  },
  {
    title: "Local Store Network",
    description: "Connect with trusted local stores in your area",
    icon: "🏪",
    gradient: "from-gold-primary/20 to-gold-highlight/20",
  },
  {
    title: "Delivery Updates",
    description: "Get instant notifications about your delivery status",
    icon: "📱",
    gradient: "from-gold-secondary/20 to-gold-primary/20",
  },
  {
    title: "24/7 Support",
    description: "Round-the-clock customer support for all your needs",
    icon: "🤝",
    gradient: "from-gold-highlight/20 to-gold-accent/20",
  },
]

export default function FeaturesSection() {
  return (
    <section className="relative py-24 overflow-hidden" id="features">
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
            Powerful Features
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-lg">
            Everything you need to grow your business in the digital age
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="relative p-8 bg-dark-primary/30 backdrop-blur-sm group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ 
                backgroundColor: "rgba(var(--gold-primary-rgb), 0.05)",
                transition: { duration: 0.3 }
              }}
            >
              <div className="relative z-10">
                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-3xl">{feature.icon}</span>
                  <h3 className="text-xl font-semibold text-white">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-text-secondary">
                  {feature.description}
                </p>
              </div>

              {/* Ambient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
            </motion.div>
          ))}
        </div>

        {/* Floating Elements */}
        <motion.div 
          className="absolute top-1/3 left-0 w-72 h-72 bg-gradient-to-r from-gold-primary/20 to-gold-secondary/20 rounded-full blur-3xl"
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
          className="absolute bottom-1/3 right-0 w-96 h-96 bg-gradient-to-r from-gold-accent/20 to-gold-highlight/20 rounded-full blur-3xl"
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
