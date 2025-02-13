"use client"

import { motion } from "framer-motion"

const stories = [
  {
    name: "Sarah Johnson",
    business: "Fresh Foods Market",
    location: "Lagos, Nigeria",
    quote: "Since implementing the platform, our online sales have grown by 300%. The local payment integration made it easy for our customers to shop with confidence.",
    image: "🏪",
    gradient: "from-gold-primary/20 to-gold-secondary/20",
  },
  {
    name: "David Osei",
    business: "Tech Solutions Hub",
    location: "Accra, Ghana",
    quote: "The analytics tools helped us understand our customers better. We've optimized our inventory and increased our profit margins significantly.",
    image: "💻",
    gradient: "from-gold-secondary/20 to-gold-accent/20",
  },
  {
    name: "Maria Kimani",
    business: "Artisan Crafts",
    location: "Nairobi, Kenya",
    quote: "We're now selling our handmade products internationally. The platform made it simple to reach customers worldwide and manage shipping.",
    image: "🎨",
    gradient: "from-gold-accent/20 to-gold-highlight/20",
  },
]

export default function SuccessStoriesSection() {
  return (
    <section className="relative py-24 overflow-hidden" id="success-stories">
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
            Success Stories
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-lg">
            See how businesses across Africa are thriving with our platform
          </p>
        </motion.div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {stories.map((story, index) => (
            <motion.div
              key={story.name}
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
                {/* Quote */}
                <p className="text-text-secondary mb-6 italic">
                  "{story.quote}"
                </p>

                {/* Business Info */}
                <div className="flex items-center space-x-4">
                  <span className="text-4xl">{story.image}</span>
                  <div>
                    <h3 className="text-white font-semibold">{story.name}</h3>
                    <p className="text-text-secondary text-sm">{story.business}</p>
                    <p className="text-text-secondary text-sm">{story.location}</p>
                  </div>
                </div>
              </div>

              {/* Ambient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${story.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div 
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {[
            { value: "500+", label: "Businesses Empowered" },
            { value: "$10M+", label: "Transaction Volume" },
            { value: "15+", label: "African Countries" },
          ].map((stat, index) => (
            <div key={stat.label}>
              <motion.h4 
                className="text-3xl font-bold hero-gradient-text mb-2"
                initial={{ scale: 0.5 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {stat.value}
              </motion.h4>
              <p className="text-text-secondary">{stat.label}</p>
            </div>
          ))}
        </motion.div>

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
