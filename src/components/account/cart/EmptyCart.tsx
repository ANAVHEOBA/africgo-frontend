'use client';

import Link from "next/link";

export default function EmptyCart() {
  return (
    <div className="text-center py-12">
      <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <svg
          className="w-12 h-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
      <p className="text-gray-600 mb-6">
        Looks like you haven't added any items to your cart yet.
      </p>
      <Link
        href="/account/stores"
        className="inline-block bg-gold-primary text-white px-6 py-2 rounded-md 
          hover:bg-gold-secondary transition-colors font-medium"
      >
        Browse Stores
      </Link>
    </div>
  );
} 