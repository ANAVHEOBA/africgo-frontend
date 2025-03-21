"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getOrderById, confirmOrderPayment } from "@/lib/orders/api";
import { Order } from "@/lib/orders/types";
import PaymentTimer from "./PaymentTimer";

export default function PaymentInstructions({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrder() {
      try {
        setLoading(true);
        const orderData = await getOrderById(orderId);
        console.log('Fetched order data:', {
          id: orderData._id,
          price: orderData.price,
          paymentInstructions: orderData.paymentInstructions
        });
        setOrder(orderData);
        setError("");
      } catch (err) {
        console.error('Error fetching order:', err);
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId]);

  const handlePaymentConfirm = async () => {
    if (!order) {
      setError("Order not found");
      return;
    }

    // Calculate total amount from order details
    const totalAmount = order.price || order.paymentInstructions?.amount;
    
    if (!totalAmount || totalAmount <= 0) {
      console.error('Invalid payment amount:', {
        orderPrice: order.price,
        instructionsAmount: order.paymentInstructions?.amount
      });
      setError("Payment amount not found or invalid");
      return;
    }

    try {
      setConfirming(true);
      setError("");
      
      console.log('Confirming payment with amount:', totalAmount);
      
      await confirmOrderPayment(orderId, totalAmount);
      router.push(`/account/orders/${orderId}`);
    } catch (err) {
      console.error('Error confirming payment:', err);
      setError(err instanceof Error ? err.message : "Failed to confirm payment");
    } finally {
      setConfirming(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-gold-primary text-xl">Loading payment details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        Order not found
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto bg-gray-900 p-8 rounded-lg border-2 border-gray-700"
    >
      <h2 className="text-3xl font-bold text-gold-primary mb-8">Payment Instructions</h2>
      
      <PaymentTimer expiryTime={30 * 60} onExpire={() => router.push('/account/orders')} />

      <div className="space-y-6 mt-8">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">Bank Transfer Details</h3>
          <div className="space-y-3">
            <p className="text-white">
              <span className="font-bold">Bank:</span> {order.paymentInstructions?.bankDetails.bankName}
            </p>
            <p className="text-white">
              <span className="font-bold">Account Name:</span> {order.paymentInstructions?.bankDetails.accountName}
            </p>
            <p className="text-white">
              <span className="font-bold">Account Number:</span> {order.paymentInstructions?.bankDetails.accountNumber}
            </p>
            <p className="text-white">
              <span className="font-bold">Amount:</span> ₦{order.paymentInstructions?.amount.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">Important Instructions</h3>
          <p className="text-white">{order.paymentInstructions?.instructions}</p>
        </div>

        <button
          onClick={handlePaymentConfirm}
          disabled={confirming}
          className={`w-full px-8 py-4 ${
            confirming 
              ? 'bg-gray-500 cursor-not-allowed' 
              : 'bg-gold-primary hover:bg-gold-secondary'
          } text-gray-900 rounded-lg text-xl font-bold transition-colors`}
        >
          {confirming ? 'Confirming Payment...' : 'I Have Made the Payment'}
        </button>
      </div>
    </motion.div>
  );
} 