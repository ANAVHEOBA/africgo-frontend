"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useState } from "react"

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    phone: "",
    country: "",
    businessType: "",
  })

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setMessage("")

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus("success")
        setMessage(data.message)
        // Reset form
        setFormData({
          businessName: "",
          email: "",
          phone: "",
          country: "",
          businessType: "",
        })
      } else {
        setStatus("error")
        setMessage(data.message || "Registration failed. Please try again.")
      }
    } catch (error) {
      setStatus("error")
      setMessage("An error occurred. Please try again later.")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-xl mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-display-small font-bold hero-gradient-text mb-4">
          Join GoFromA2zAfrica
        </h1>
        <p className="text-text-secondary text-lg">
          Start your digital transformation journey today
        </p>
      </div>

      {/* Registration Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        onSubmit={handleSubmit}
        className="space-y-6 bg-dark-primary/50 backdrop-blur-sm p-8 rounded-lg border border-white/10"
      >
        {/* Business Name */}
        <div>
          <label htmlFor="businessName" className="block text-white mb-2">
            Business Name
          </label>
          <input
            type="text"
            id="businessName"
            value={formData.businessName}
            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
            className="w-full px-4 py-3 bg-dark-secondary border border-white/10 rounded-lg
              text-white placeholder:text-gray-400
              focus:outline-none focus:ring-2 focus:ring-gold-primary focus:border-transparent
              hover:border-gold-primary/50
              transition-all duration-300"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-white mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 bg-dark-secondary border border-white/10 rounded-lg
              text-white placeholder:text-gray-400
              focus:outline-none focus:ring-2 focus:ring-gold-primary focus:border-transparent
              hover:border-gold-primary/50
              transition-all duration-300"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-white mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-3 bg-dark-secondary border border-white/10 rounded-lg
              text-white placeholder:text-gray-400
              focus:outline-none focus:ring-2 focus:ring-gold-primary focus:border-transparent
              hover:border-gold-primary/50
              transition-all duration-300"
            required
          />
        </div>

        {/* Country */}
        <div>
          <label htmlFor="country" className="block text-white mb-2">
            Country
          </label>
          <select
            id="country"
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            className="w-full px-4 py-3 bg-dark-secondary border border-white/10 rounded-lg
              text-white placeholder:text-gray-400
              focus:outline-none focus:ring-2 focus:ring-gold-primary focus:border-transparent
              hover:border-gold-primary/50
              transition-all duration-300"
            required
          >
            <option value="">Select a country</option>
            <option value="Nigeria">Nigeria</option>
            <option value="Kenya">Kenya</option>
            <option value="Ghana">Ghana</option>
            <option value="South Africa">South Africa</option>
            {/* Add more African countries as needed */}
          </select>
        </div>

        {/* Business Type */}
        <div>
          <label htmlFor="businessType" className="block text-white mb-2">
            Business Type
          </label>
          <select
            id="businessType"
            value={formData.businessType}
            onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
            className="w-full px-4 py-3 bg-dark-secondary border border-white/10 rounded-lg
              text-white placeholder:text-gray-400
              focus:outline-none focus:ring-2 focus:ring-gold-primary focus:border-transparent
              hover:border-gold-primary/50
              transition-all duration-300"
            required
          >
            <option value="">Select business type</option>
            <option value="Retail">Retail</option>
            <option value="Wholesale">Wholesale</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Technology">Technology</option>
            <option value="Services">Services</option>
            {/* Add more business types as needed */}
          </select>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={status === "loading"}
          className={`relative w-full px-6 py-4 bg-gradient-to-r from-gold-primary to-gold-secondary 
            rounded-lg text-dark-primary font-medium overflow-hidden
            ${status === "loading" ? "opacity-75 cursor-not-allowed" : "hover:shadow-lg hover:shadow-gold-primary/20"}
            transition-all duration-300`}
          whileHover={{ scale: status === "loading" ? 1 : 1.02 }}
          whileTap={{ scale: status === "loading" ? 1 : 0.98 }}
        >
          <span className="relative z-10">
            {status === "loading" ? (
              <div className="flex items-center justify-center space-x-2">
                <motion.span
                  className="w-2 h-2 bg-dark-primary rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                />
                <motion.span
                  className="w-2 h-2 bg-dark-primary rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, delay: 0.1, repeat: Infinity }}
                />
                <motion.span
                  className="w-2 h-2 bg-dark-primary rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, delay: 0.2, repeat: Infinity }}
                />
              </div>
            ) : (
              "Register Now"
            )}
          </span>
        </motion.button>

        {/* Status Message */}
        {message && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-sm ${
              status === "success" ? "text-green-400" : "text-red-400"
            }`}
          >
            {message}
          </motion.p>
        )}
      </motion.form>

      {/* Back Link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-8 text-center"
      >
        <Link
          href="/"
          className="text-text-secondary hover:text-white transition-colors"
        >
          ← Back to Home
        </Link>
      </motion.div>
    </motion.div>
  )
} 