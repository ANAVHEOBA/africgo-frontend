"use client"

import { motion, AnimatePresence } from 'framer-motion'

interface LoginRequiredModalProps {
  onClose: () => void
  onLogin: () => void
  onRegister: () => void
}

export default function LoginRequiredModal({
  onClose,
  onLogin,
  onRegister
}: LoginRequiredModalProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-dark-secondary p-6 rounded-lg max-w-md w-full"
        >
          <h2 className="text-xl font-semibold text-white mb-4">
            Login Required
          </h2>
          
          <p className="text-white/70 mb-6">
            You need to be logged in as a consumer to place orders. 
            Please login or register as a consumer to continue.
          </p>

          <div className="space-y-3">
            <button
              onClick={onLogin}
              className="w-full py-2 bg-gold-primary text-dark-primary rounded-lg
                hover:bg-gold-secondary transition-colors"
            >
              Login as Consumer
            </button>

            <button
              onClick={onRegister}
              className="w-full py-2 border border-gold-primary text-gold-primary rounded-lg
                hover:bg-gold-primary hover:text-dark-primary transition-colors"
            >
              Register as Consumer
            </button>

            <button
              onClick={onClose}
              className="w-full py-2 text-white/70 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
} 