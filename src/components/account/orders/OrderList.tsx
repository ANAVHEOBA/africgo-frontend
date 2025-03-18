"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { getOrders } from "@/lib/orders/api";
import { Order } from "@/lib/orders/types";

export default function OrderList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data || []);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to fetch orders"
        );
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div className="text-gray-600">Loading orders...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!orders) {
    return <div className="text-gray-600">No orders available</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-gray-600">No orders found</div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid gap-4"
        >
          {orders.map((order) => (
            <Link
              key={order._id}
              href={`/account/orders/${order._id}`}
              className="block bg-white p-6 rounded-lg border border-gray-200 shadow-sm
                hover:border-gold-primary transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-1">
                  <p className="text-gray-900 font-medium">
                    Order #{order.trackingNumber}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium
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
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-900">Delivery Address</p>
                  <p className="text-gray-600">
                    {order.deliveryAddress.manualAddress?.street || order.deliveryAddress.street}
                  </p>
                  <p className="text-gray-600">
                    {order.deliveryAddress.manualAddress?.city || order.deliveryAddress.city}, 
                    {order.deliveryAddress.manualAddress?.state || order.deliveryAddress.state}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">Total Amount</p>
                  <p className="text-gold-primary font-medium">
                    ₦{order.price.toLocaleString()}
                  </p>
                  {order.zonePrice && (
                    <p className="text-gray-600 text-sm">
                      (Includes ₦{order.zonePrice.toLocaleString()} delivery fee)
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </motion.div>
      )}
    </div>
  );
}
