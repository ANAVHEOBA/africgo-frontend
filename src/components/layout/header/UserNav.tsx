"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    return token && token.trim() !== "" ? token : null; // Ensure it's non-empty
  }
  return null;
};

const getUserType = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("userType");
  }
  return null;
};

export default function UserNav() {
  const [token, setToken] = useState<string | null>(null);
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    setToken(getToken());
    setUserType(getUserType());
  }, []);

  console.log("Token:", token); // Debugging output
  console.log("UserType:", userType); // Debugging output

  return (
    <div className="hidden md:flex items-center space-x-4">
      {token ? ( // Show correct dashboard based on userType
        <Link href={userType === "merchant" ? "/dashboard" : "/account"}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 text-sm font-medium bg-gradient-to-r from-gold-primary to-gold-secondary 
            text-dark-primary rounded-lg hover:shadow-gold transition-all duration-300"
          >
            {userType === "merchant" ? "Dashboard" : "Account"}
          </motion.button>
        </Link>
      ) : (
        <>
          <Link href="/login">
            <span className="text-sm font-medium text-text-secondary hover:text-dark transition-colors duration-200">
              Log In
            </span>
          </Link>
          <Link href="/register">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 text-sm font-medium bg-gradient-to-r from-gold-primary to-gold-secondary 
            text-dark-primary rounded-lg hover:shadow-gold transition-all duration-300"
            >
              Register Now
            </motion.button>
          </Link>
        </>
      )}
    </div>
  );
}
