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
  const [error, setError] = useState("");
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const orderData = await getOrderById(orderId);
        setOrder(orderData);
      } catch (err) {
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

    // Use order.price instead of paymentInstructions.amount
    const totalAmount = order.price || 0;
    console.log('Confirming payment with total amount:', totalAmount); // Debug log
    
    if (totalAmount <= 0) {
      setError("Invalid order amount");
      return;
    }

    setConfirming(true);
    setError("");

    try {
      await confirmOrderPayment(orderId, totalAmount);
      router.push(`/account/orders/${orderId}`);
    } catch (err) {
      console.error('Payment confirmation error:', err);
      setError(err instanceof Error ? err.message : "Failed to confirm payment");
    } finally {
      setConfirming(false);
    }
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return (
    <div className="text-center p-8 text-red-500">
      <p>{error}</p>
      <button 
        onClick={() => router.push('/account/orders')}
        className="mt-4 px-4 py-2 bg-gray-800 text-white rounded"
      >
        Back to Orders
      </button>
    </div>
  );
  if (!order) return <div className="text-center p-8">Order not found</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto bg-gray-900 p-8 rounded-lg border-2 border-gray-700"
    >
      <h2 className="text-3xl font-bold text-gold-primary mb-8">Payment Instructions</h2>
      
      <PaymentTimer 
        expiryTime={30 * 60} 
        onExpire={() => router.push('/account/orders')}
        orderId={orderId}
      />

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
              <span className="font-bold">Amount to Pay:</span> ₦{order.price.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">Payment Breakdown</h3>
          <div className="space-y-3">
            <p className="text-white">
              <span className="font-bold">Subtotal:</span> ₦{order.paymentInstructions?.subtotal.toLocaleString()}
            </p>
            <p className="text-white">
              <span className="font-bold">Delivery Fee:</span> ₦{order.paymentInstructions?.deliveryFee.toLocaleString()}
            </p>
            <p className="text-white text-lg font-bold">
              <span className="font-bold">Total Amount:</span> ₦{order.price.toLocaleString()}
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
              ? "bg-gray-600 cursor-not-allowed" 
              : "bg-gold-primary hover:bg-gold-secondary"
          } text-gray-900 rounded-lg text-xl font-bold transition-colors`}
        >
          {confirming ? "Confirming Payment..." : "I Have Made the Payment"}
        </button>

        {error && (
          <p className="text-red-500 text-center mt-4">{error}</p>
        )}
      </div>
    </motion.div>
  );
} 