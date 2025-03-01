"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { rateStore } from "@/lib/stores/api"

interface RatingFormProps {
  storeId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function RatingForm({ storeId, onSuccess, onCancel }: RatingFormProps) {
  const [rating, setRating] = useState(5)
  const [review, setReview] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setMessage("")

    try {
      await rateStore({
        storeId,
        rating,
        review,
      })
      setStatus("success")
      setMessage("Thank you for your review!")
      onSuccess?.()
    } catch (error) {
      setStatus("error")
      setMessage(error instanceof Error ? error.message : "Failed to submit review")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-dark-secondary p-6 rounded-lg border border-white/10"
    >
      <h3 className="text-lg font-semibold text-white mb-4">Rate This Store</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Rating
          </label>
          <div className="flex gap-4">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                className={`w-10 h-10 rounded-full flex items-center justify-center
                  ${rating >= value 
                    ? "bg-gold-primary text-dark-primary" 
                    : "bg-dark-primary text-white/70"
                  } transition-colors`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        {/* Review */}
        <div>
          <label htmlFor="review" className="block text-sm font-medium text-white mb-2">
            Review
          </label>
          <textarea
            id="review"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 bg-dark-primary border border-white/10 rounded-lg
              text-white placeholder:text-gray-400
              focus:outline-none focus:ring-2 focus:ring-gold-primary focus:border-transparent"
            placeholder="Share your experience with this store..."
          />
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={status === "loading"}
            className={`flex-1 px-6 py-3 rounded-lg font-medium
              ${status === "loading"
                ? "bg-gold-primary/50 cursor-not-allowed"
                : "bg-gold-primary hover:bg-gold-secondary"
              } text-dark-primary transition-colors`}
          >
            {status === "loading" ? "Submitting..." : "Submit Review"}
          </button>
          
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 rounded-lg font-medium
              bg-dark-primary border border-white/10 text-white
              hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
        </div>

        {/* Status Message */}
        {message && (
          <p className={`text-sm ${status === "success" ? "text-green-400" : "text-red-400"}`}>
            {message}
          </p>
        )}
      </form>
    </motion.div>
  )
} 