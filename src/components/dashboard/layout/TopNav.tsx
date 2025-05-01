"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function TopNav({
  toggleSidebar,
  storeName,
}: {
  toggleSidebar: () => void;
  storeName?: string;
}) {
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-4 py-3 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Hamburger Icon (toggles sidebar) */}
          <button onClick={toggleSidebar}>
            <MenuIcon className="h-6 w-6 text-gray-900" />
          </button>

          <Link href="/dashboard">
            <span className="text-xl font-bold text-gray-900 sm:block hidden">
              {storeName || "Dashboard"}
            </span>
          </Link>
        </div>

        {/* Right Section (Profile) */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="relative"
          >
            <div className="w-10 h-10 rounded-full bg-gold-primary/20 flex items-center justify-center">
              <span className="text-gold-primary font-medium">JD</span>
            </div>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1">
                <Link
                  href="/dashboard/settings"
                  className="block text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                >
                  Logout
                </button>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Icon Components
const MenuIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);
