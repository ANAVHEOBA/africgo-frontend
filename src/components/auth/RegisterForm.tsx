"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
  });

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState("");
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otp, setOtp] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(data.message);
        setUserId(data.userId);
        setShowOtpForm(true);
      } else {
        setStatus("error");
        setMessage(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setStatus("error");
      setMessage("An error occurred. Please try again.");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/verify-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            otp,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage("Email verified successfully! You can now login.");
        // Optionally redirect to login page after successful verification
      } else {
        setStatus("error");
        setMessage(data.message || "Verification failed. Please try again.");
      }
    } catch (err) {
      setStatus("error");
      setMessage("An error occurred. Please try again.");
    }
  };

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
      {!showOtpForm ? (
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-6 bg-dark-primary/50 backdrop-blur-sm p-8 rounded-lg border border-white/10"
        >
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-dark mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-3 bg-dark-secondary border border-white/10 rounded-lg
                text-dark placeholder:text-gray-400
                focus:outline-none focus:ring-2 focus:ring-gold-primary focus:border-transparent
                hover:border-gold-primary/50
                transition-all duration-300"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-dark mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-3 bg-dark-secondary border border-white/10 rounded-lg
                text-dark placeholder:text-gray-400
                focus:outline-none focus:ring-2 focus:ring-gold-primary focus:border-transparent
                hover:border-gold-primary/50
                transition-all duration-300"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-dark mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-4 py-3 bg-dark-secondary border border-white/10 rounded-lg
                text-dark placeholder:text-gray-400
                focus:outline-none focus:ring-2 focus:ring-gold-primary focus:border-transparent
                hover:border-gold-primary/50
                transition-all duration-300"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-dark mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full px-4 py-3 bg-dark-secondary border border-white/10 rounded-lg
                text-dark placeholder:text-gray-400
                focus:outline-none focus:ring-2 focus:ring-gold-primary focus:border-transparent
                hover:border-gold-primary/50
                transition-all duration-300"
              required
            />
          </div>

          {/* Submit Button */}
          <SubmitButton status={status} text="Register Now" />

          {/* Status Message */}
          <StatusMessage status={status} message={message} />
        </motion.form>
      ) : (
        /* OTP Verification Form */
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          onSubmit={handleVerifyOtp}
          className="space-y-6 bg-dark-primary/50 backdrop-blur-sm p-8 rounded-lg border border-white/10"
        >
          <div>
            <label htmlFor="otp" className="block text-dark mb-2">
              Enter Verification Code
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-3 bg-dark-secondary border border-white/10 rounded-lg
                text-dark placeholder:text-gray-400
                focus:outline-none focus:ring-2 focus:ring-gold-primary focus:border-transparent
                hover:border-gold-primary/50
                transition-all duration-300"
              required
            />
          </div>

          {/* Submit Button */}
          <SubmitButton status={status} text="Verify Email" />

          {/* Status Message */}
          <StatusMessage status={status} message={message} />
        </motion.form>
      )}

      {/* Back Link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-8 text-center"
      >
        <Link
          href="/"
          className="text-text-secondary hover:text-dark transition-colors"
        >
          ← Back to Home
        </Link>
      </motion.div>
    </motion.div>
  );
}

// Helper Components
const SubmitButton = ({ status, text }: { status: string; text: string }) => (
  <motion.button
    type="submit"
    disabled={status === "loading"}
    className={`relative w-full px-6 py-4 bg-gradient-to-r from-gold-primary to-gold-secondary 
      rounded-lg text-dark-primary font-medium overflow-hidden
      ${
        status === "loading"
          ? "opacity-75 cursor-not-allowed"
          : "hover:shadow-lg hover:shadow-gold-primary/20"
      }
      transition-all duration-300`}
    whileHover={{ scale: status === "loading" ? 1 : 1.02 }}
    whileTap={{ scale: status === "loading" ? 1 : 0.98 }}
  >
    <span className="relative z-10">
      {status === "loading" ? <LoadingDots /> : text}
    </span>
  </motion.button>
);

const LoadingDots = () => (
  <div className="flex items-center justify-center space-x-2">
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        className="w-2 h-2 bg-dark-primary rounded-full"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 0.5, delay: i * 0.1, repeat: Infinity }}
      />
    ))}
  </div>
);

const StatusMessage = ({
  status,
  message,
}: {
  status: string;
  message: string;
}) =>
  message && (
    <motion.p
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`text-sm ${
        status === "success" ? "text-green-400" : "text-red-400"
      }`}
    >
      {message}
    </motion.p>
  );
