"use client"

import { useState } from "react"
import { motion } from "framer-motion"

export default function FooterNewsletter() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setMessage("")
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus("success")
        setMessage(data.message)
        setEmail("")
      } else {
        setStatus("error")
        setMessage(data.message || "Something went wrong")
      }
    } catch (err) {
      setStatus("error")
      setMessage("Failed to subscribe. Please try again.")
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    // Reset status and message when user starts typing again
    if (status !== "idle") {
      setStatus("idle")
      setMessage("")
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-white font-medium">Stay Updated</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter your email"
            className="w-full px-4 py-3 bg-dark-secondary border border-white/10 rounded-lg 
              text-white placeholder:text-gray-400
              focus:outline-none focus:ring-2 focus:ring-gold-primary focus:border-transparent
              hover:border-gold-primary/50
              transition-all duration-300"
            required
            aria-label="Email address"
          />
          <div 
            className="absolute inset-0 -z-10 bg-gradient-to-r from-gold-primary/20 to-gold-secondary/20 
              blur-lg opacity-0 transition-opacity duration-300 rounded-lg
              group-hover:opacity-100"
          />
        </div>

        <motion.button
          type="submit"
          disabled={status === "loading"}
          className={`relative w-full px-6 py-3 bg-gradient-to-r from-gold-primary to-gold-secondary 
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
              "Subscribe to Newsletter"
            )}
          </span>
        </motion.button>
      </form>

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

      <p className="text-text-secondary text-xs">
        By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
      </p>
    </div>
  )
}