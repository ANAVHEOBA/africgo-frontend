"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [accountType, setAccountType] = useState<"merchant" | "consumer">(
    "merchant"
  );
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const endpoint =
      accountType === "merchant" ? "/api/users/login" : "/api/consumers/login";

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
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
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("userType", accountType);

        // Redirect based on account type
        router.replace(accountType === "merchant" ? "/dashboard" : "/account");
      } else {
        setStatus("error");
        setMessage(data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
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
          Welcome Back
        </h1>
        <p className="text-text-secondary text-lg">Log in to your account</p>
      </div>

      {/* Login Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        onSubmit={handleSubmit}
        className="space-y-6 bg-dark-primary/50 backdrop-blur-sm p-8 rounded-lg border border-white/10"
      >
        {/* Account Type */}
        <div className="mb-6">
          <label className="block text-dark mb-2">Account Type</label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setAccountType("merchant")}
              className={`flex-1 py-2 px-4 rounded ${
                accountType === "merchant"
                  ? "bg-gold-primary text-dark-primary"
                  : "bg-dark-secondary text-dark"
              }`}
            >
              Store Owner
            </button>
            <button
              type="button"
              onClick={() => setAccountType("consumer")}
              className={`flex-1 py-2 px-4 rounded ${
                accountType === "consumer"
                  ? "bg-gold-primary text-dark-primary"
                  : "bg-dark-secondary text-dark"
              }`}
            >
              Consumer
            </button>
          </div>
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

        {/* Submit Button */}
        <SubmitButton status={status} text="Log In" />

        {/* Status Message */}
        <StatusMessage status={status} message={message} />

        {/* Register Link */}
        <div className="text-center mt-4">
          <Link
            href="/register"
            className="text-gold-primary hover:text-gold-secondary transition-colors"
          >
            Don't have an account? Register here
          </Link>
        </div>
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
          className="text-text-secondary hover:text-dark transition-colors"
        >
          ← Back to Home
        </Link>
      </motion.div>
    </motion.div>
  );
}

// Helper Components (same as RegisterForm)
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
