"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getOrderById } from "@/lib/orders/api";
import { Order } from "@/lib/orders/types";
import { motion } from "framer-motion";

interface PaymentInstructionsProps {
  orderId: string;
}

export default function PaymentInstructions({ orderId }: PaymentInstructionsProps) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const orderData = await getOrderById(orderId);
        setOrder(orderData);
      } catch (err) {
        setError("Failed to load payment details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gold-primary">Loading payment details...</div>
      </div>
    );
  }

  if (error || !order?.paymentInstructions) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-500">{error || "Payment details not available"}</div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-6"
    >
      <div className="bg-gray-800 rounded-lg p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-gold-primary mb-6">Payment Instructions</h1>
        
        {/* Order Amount */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Order Total</h2>
          <p className="text-4xl font-bold text-gold-primary">
            ₦{order.paymentInstructions.amount.toLocaleString()}
          </p>
        </div>

        {/* Bank Details */}
        <div className="space-y-6 mb-8">
          <h2 className="text-2xl font-bold text-white">Bank Details</h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-gray-400">Bank Name</label>
              <p className="text-xl text-white">{order.paymentInstructions.bankDetails.bankName}</p>
            </div>

            <div>
              <label className="text-gray-400">Account Name</label>
              <p className="text-xl text-white">{order.paymentInstructions.bankDetails.accountName}</p>
            </div>

            <div>
              <label className="text-gray-400">Account Number</label>
              <div className="flex items-center gap-3">
                <p className="text-xl text-white font-mono">
                  {order.paymentInstructions.bankDetails.accountNumber}
                </p>
                <button
                  onClick={() => copyToClipboard(order.paymentInstructions.bankDetails.accountNumber)}
                  className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Important Instructions */}
        <div className="bg-gray-700 rounded-lg p-4 mb-8">
          <h3 className="text-white font-bold mb-2">Important:</h3>
          <ul className="text-gray-300 space-y-2">
            <li>• Please transfer the exact amount</li>
            <li>• Use your Order ID ({orderId}) as payment reference</li>
            <li>• Payment should be made within 24 hours</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => router.push(`/account/orders/${orderId}`)}
            className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-bold"
          >
            View Order
          </button>
          <button
            onClick={() => router.push("/account/orders")}
            className="flex-1 px-6 py-3 bg-gold-primary hover:bg-gold-secondary rounded-lg text-gray-900 font-bold"
          >
            Back to Orders
          </button>
        </div>
      </div>
    </motion.div>
  );
} 