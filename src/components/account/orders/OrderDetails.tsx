"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { getOrderById } from "@/lib/orders/api";
import { Order } from "@/lib/orders/types";

export default function OrderDetails({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(orderId);
        setOrder(data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to fetch order"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return <div className="text-gray-600">Loading order details...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!order) {
    return <div className="text-gray-600">Order not found</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Order #{order.trackingNumber}
        </h1>
        <Link
          href="/account/orders"
          className="text-gold-primary hover:text-gold-secondary transition-colors"
        >
          ← Back to Orders
        </Link>
      </div>

      <div className="grid gap-6">
        {/* Order Status */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Order Status
          </h2>
          <div className="flex items-center justify-between">
            <span
              className={`inline-block px-4 py-2 rounded-full
              ${
                order.status === "DELIVERED"
                  ? "bg-green-100 text-green-800"
                  : order.status === "PENDING"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {order.status}
            </span>
            <p className="text-gray-600">
              Estimated Delivery:{" "}
              {new Date(order.estimatedDeliveryDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Order Items
          </h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0"
              >
                <div>
                  <p className="text-gray-900">Product ID: {item.productId}</p>
                  <p className="text-gray-600">Quantity: {item.quantity}</p>
                  {item.variantData && item.variantData.length > 0 && (
                    <div className="text-sm text-gray-600">
                      {item.variantData.map((variant) => (
                        <p key={variant._id}>
                          {variant.name}: {variant.value}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-gold-primary font-medium">
                  ₦{item.price.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Addresses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Delivery Address */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Delivery Address
            </h2>
            <div className="space-y-2 text-gray-600">
              <p>{order.deliveryAddress.manualAddress?.recipientName || order.deliveryAddress.recipientName}</p>
              <p>{order.deliveryAddress.manualAddress?.street || order.deliveryAddress.street}</p>
              <p>
                {order.deliveryAddress.manualAddress?.city || order.deliveryAddress.city}, 
                {order.deliveryAddress.manualAddress?.state || order.deliveryAddress.state}
              </p>
              <p>
                {order.deliveryAddress.manualAddress?.country || order.deliveryAddress.country}{" "}
                {order.deliveryAddress.manualAddress?.postalCode || order.deliveryAddress.postalCode}
              </p>
              <p>Phone: {order.deliveryAddress.manualAddress?.recipientPhone || order.deliveryAddress.recipientPhone}</p>
            </div>
          </div>

          {/* Pickup Address */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Pickup Address
            </h2>
            <div className="space-y-2 text-gray-600">
              <p>{order.pickupAddress.manualAddress?.street || order.pickupAddress.street}</p>
              <p>
                {order.pickupAddress.manualAddress?.city || order.pickupAddress.city}, 
                {order.pickupAddress.manualAddress?.state || order.pickupAddress.state}
              </p>
              <p>
                {order.pickupAddress.manualAddress?.country || order.pickupAddress.country}{" "}
                {order.pickupAddress.manualAddress?.postalCode || order.pickupAddress.postalCode}
              </p>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Shipping Details
          </h2>
          <div className="grid grid-cols-2 gap-4 text-gray-600">
            <div>
              <p>Package Size: {order.packageSize}</p>
              <p>Fragile: {order.isFragile ? "Yes" : "No"}</p>
              <p>Express Delivery: {order.isExpressDelivery ? "Yes" : "No"}</p>
            </div>
            <div>
              <p>
                Special Handling: {order.requiresSpecialHandling ? "Yes" : "No"}
              </p>
              {order.specialInstructions && (
                <p>Instructions: {order.specialInstructions}</p>
              )}
              {order.zonePrice && (
                <p>Delivery Fee: ₦{order.zonePrice.toLocaleString()}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
