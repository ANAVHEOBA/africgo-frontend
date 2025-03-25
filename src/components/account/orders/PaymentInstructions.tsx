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
        console.log('Fetching order with ID:', orderId);
        const orderData = await getOrderById(orderId);
        console.log('Full order data:', JSON.stringify(orderData, null, 2));
        
        if (!orderData.paymentInstructions) {
          console.error('Payment instructions missing from order:', orderData);
          setError("Order found but payment instructions are missing");
        }
        
        setOrder(orderData);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError(err instanceof Error ? err.message : "Failed to load order details");
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId]);

  useEffect(() => {
    if (order) {
      console.log('Order state updated:', order);
      console.log('Payment Instructions:', order.paymentInstructions);
    }
  }, [order]);

  const handlePaymentConfirm = async () => {
    if (!order?.paymentInstructions) {
      setError("Payment details not found");
      return;
    }

    try {
      setConfirming(true);
      setError("");
      await confirmOrderPayment(orderId, order.paymentInstructions.amount);
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
        <p>{error}</p>
        <p className="text-sm mt-2">Order ID: {orderId}</p>
      </div>
    );
  }

  if (!order?.paymentInstructions) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        <p>Payment instructions not found</p>
        <p className="text-sm mt-2">Order ID: {orderId}</p>
        <p className="text-sm mt-1">Order Status: {order?.status}</p>
        <p className="text-sm mt-1">Order Data Available: {order ? 'Yes' : 'No'}</p>
        {order && (
          <details className="mt-2">
            <summary className="cursor-pointer">Debug Info</summary>
            <pre className="mt-2 text-xs whitespace-pre-wrap">
              {JSON.stringify(order, null, 2)}
            </pre>
          </details>
        )}
      </div>
    );
  }

  const { bankDetails, amount, deliveryFee, subtotal, currency, instructions } = order.paymentInstructions;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto bg-gray-900 p-8 rounded-lg border-2 border-gray-700"
    >
      <h2 className="text-3xl font-bold text-gold-primary mb-8">Payment Instructions</h2>
      
      <PaymentTimer expiryTime={30 * 60} onExpire={() => router.push('/account/orders')} />

      <div className="space-y-6 mt-8">
        {/* Bank Details */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">Bank Transfer Details</h3>
          <div className="space-y-3">
            <p className="text-white">
              <span className="font-bold">Bank:</span> {bankDetails.bankName}
            </p>
            <p className="text-white">
              <span className="font-bold">Account Name:</span> {bankDetails.accountName}
            </p>
            <p className="text-white">
              <span className="font-bold">Account Number:</span> {bankDetails.accountNumber}
            </p>
          </div>
        </div>

        {/* Payment Breakdown */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">Payment Details</h3>
          <div className="space-y-3">
            <p className="text-white flex justify-between">
              <span>Subtotal:</span>
              <span>{currency} {subtotal.toLocaleString()}</span>
            </p>
            <p className="text-white flex justify-between">
              <span>Delivery Fee:</span>
              <span>{currency} {deliveryFee.toLocaleString()}</span>
            </p>
            <div className="border-t border-gray-600 my-3"></div>
            <p className="text-white flex justify-between text-lg font-bold">
              <span>Total Amount:</span>
              <span>{currency} {amount.toLocaleString()}</span>
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">Important Instructions</h3>
          <p className="text-white">{instructions}</p>
        </div>

        {/* Confirm Payment Button */}
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