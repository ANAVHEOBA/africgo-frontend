"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { trackOrder } from "@/lib/orders/api";
import { Order } from "@/lib/orders/types";

export default function OrderTracking() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      setError("Please enter a tracking number");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const data = await trackOrder(trackingNumber);
      setOrder(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to track order"
      );
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="max-w-3xl mx-auto space-y-8"
      style={{ paddingTop: "100px" }}
    >
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Track Your Order</h1>
        <p className="mt-2 text-gray-600">
          Enter your tracking number to get real-time updates on your delivery
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="Enter tracking number (e.g., LG-20250315-1BED4)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-primary focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-medium
            ${
              loading
                ? "bg-gold-primary/50"
                : "bg-gold-primary hover:bg-gold-secondary"
            }
            text-white transition-colors`}
        >
          {loading ? "Tracking..." : "Track Order"}
        </button>

        {error && <p className="text-red-500 text-center">{error}</p>}
      </form>

      {order && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
        >
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Order #{order.trackingNumber}
                </h2>
                <p className="text-gray-600">
                  Estimated Delivery:{" "}
                  {new Date(order.estimatedDeliveryDate).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium
                  ${
                    order.status === "DELIVERED"
                      ? "bg-green-100 text-green-800"
                      : order.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-800"
                      : order.status === "IN_TRANSIT"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
              >
                {order.status}
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900">Delivery Address</h3>
                <div className="mt-2 text-gray-600">
                  <p>
                    {order.deliveryAddress.manualAddress?.recipientName ||
                      order.deliveryAddress.recipientName}
                  </p>
                  <p>
                    {order.deliveryAddress.manualAddress?.street ||
                      order.deliveryAddress.street}
                  </p>
                  <p>
                    {order.deliveryAddress.manualAddress?.city ||
                      order.deliveryAddress.city}
                    ,
                    {order.deliveryAddress.manualAddress?.state ||
                      order.deliveryAddress.state}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900">Package Details</h3>
                <div className="mt-2 text-gray-600">
                  <p>Size: {order.packageSize}</p>
                  <p>Weight: {order.estimatedWeight}kg</p>
                  <p>Fragile: {order.isFragile ? "Yes" : "No"}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
