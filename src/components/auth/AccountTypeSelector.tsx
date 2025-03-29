"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import RegisterForm from "./RegisterForm";
import ConsumerRegisterForm from "./ConsumerRegisterForm";
import Link from "next/link";

export default function AccountTypeSelector() {
  const [selectedType, setSelectedType] = useState<
    "merchant" | "consumer" | null
  >(null);

  if (selectedType === "merchant") {
    return <RegisterForm />;
  }

  if (selectedType === "consumer") {
    return <ConsumerRegisterForm />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-xl mx-auto"
    >
      <div className="text-center mb-12">
        <h1 className="text-display-small font-bold hero-gradient-text mb-4">
          Join GoFromA2zAfrica
        </h1>
        <p className="text-text-secondary text-lg">
          Choose your account type to get started
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AccountTypeCard
          title="Store Owner"
          description="Create and manage your store, list products, and grow your business"
          onClick={() => setSelectedType("merchant")}
        />
        <AccountTypeCard
          title="Consumer"
          description="Shop from verified African stores and manage your orders"
          onClick={() => setSelectedType("consumer")}
        />
      </div>

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

function AccountTypeCard({
  title,
  description,
  onClick,
}: {
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-dark-primary/50 backdrop-blur-sm p-8 rounded-lg border border-white/10
        hover:border-gold-primary/50 transition-all text-left"
    >
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-text-secondary">{description}</p>
    </motion.button>
  );
}
