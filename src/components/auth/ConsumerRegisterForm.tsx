"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ConsumerRegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
  });

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const [consumerId, setConsumerId] = useState("");
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otp, setOtp] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/consumers/register`,
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
        setConsumerId(data.consumerId);
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/consumers/verify-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            consumerId,
            otp,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage("Email verified successfully! You can now login.");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
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
      <div className="text-center mb-12">
        <h1 className="text-display-small font-bold hero-gradient-text mb-4">
          Create Consumer Account
        </h1>
        <p className="text-text-secondary text-lg">
          Join to start shopping from African stores
        </p>
      </div>

      {!showOtpForm ? (
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-6 bg-dark-primary/50 backdrop-blur-sm p-8 rounded-lg border border-white/10"
        >
          <div>
            <label htmlFor="firstName" className="block text-dark mb-2">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              className="w-full px-4 py-3 bg-dark-secondary border border-white/10 rounded-lg
                text-dark placeholder:text-gray-400
                focus:outline-none focus:ring-2 focus:ring-gold-primary focus:border-transparent
                hover:border-gold-primary/50
                transition-all duration-300"
              required
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-dark mb-2">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              className="w-full px-4 py-3 bg-dark-secondary border border-white/10 rounded-lg
                text-dark placeholder:text-gray-400
                focus:outline-none focus:ring-2 focus:ring-gold-primary focus:border-transparent
                hover:border-gold-primary/50
                transition-all duration-300"
              required
            />
          </div>

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

          <button
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
          >
            {status === "loading" ? "Registering..." : "Register Now"}
          </button>

          {message && (
            <p
              className={`text-sm ${
                status === "success" ? "text-green-400" : "text-red-400"
              }`}
            >
              {message}
            </p>
          )}
        </motion.form>
      ) : (
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

          <button
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
          >
            {status === "loading" ? "Verifying..." : "Verify Email"}
          </button>

          {message && (
            <p
              className={`text-sm ${
                status === "success" ? "text-green-400" : "text-red-400"
              }`}
            >
              {message}
            </p>
          )}
        </motion.form>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-8 text-center"
      >
        <Link
          href="/register"
          className="text-text-secondary hover:text-dark transition-colors"
        >
          ← Choose Different Account Type
        </Link>
      </motion.div>
    </motion.div>
  );
}
