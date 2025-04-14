'use client';

import Link from "next/link";

interface CartSummaryProps {
  totalPrice: number;
  onCheckout: () => void;
  onClearCart: () => void;
  loading: boolean;
}

export default function CartSummary({ totalPrice, onCheckout, onClearCart, loading }: CartSummaryProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium text-gold-primary">₦{totalPrice.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="text-gray-600">Calculated at checkout</span>
        </div>
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between font-semibold">
            <span className="text-gray-900">Total</span>
            <span className="text-gold-primary">₦{totalPrice.toLocaleString()}</span>
          </div>
        </div>
        <div className="space-y-2">
          <button
            className="w-full bg-gold-primary text-white py-2 rounded-md hover:bg-gold-secondary 
              transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            onClick={onCheckout}
            disabled={loading}
          >
            Proceed to Checkout
          </button>
          <button
            className="w-full text-red-500 py-2 rounded-md hover:bg-red-50 disabled:opacity-50"
            onClick={onClearCart}
            disabled={loading}
          >
            Clear Cart
          </button>
          <Link
            href="/account/stores"
            className="block text-center text-gold-primary hover:text-gold-secondary transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
} 