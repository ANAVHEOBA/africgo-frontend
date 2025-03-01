"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { getOrderById } from "@/lib/orders/api"
import { Order } from "@/lib/orders/types"

export default function OrderDetails({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(orderId)
        setOrder(data)
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to fetch order")
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  if (loading) {
    return <div className="text-white">Loading order details...</div>
  }

  if (error) {
    return <div className="text-red-400">{error}</div>
  }

  if (!order) {
    return <div className="text-white">Order not found</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">
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
        <div className="bg-dark-secondary p-6 rounded-lg border border-white/10">
          <h2 className="text-lg font-semibold text-white mb-4">Order Status</h2>
          <div className="flex items-center justify-between">
            <span className={`inline-block px-4 py-2 rounded-full
              ${order.status === 'DELIVERED' 
                ? 'bg-green-500/20 text-green-500'
                : order.status === 'PENDING'
                ? 'bg-yellow-500/20 text-yellow-500'
                : 'bg-blue-500/20 text-blue-500'
              }`}
            >
              {order.status}
            </span>
            <p className="text-white/70">
              Estimated Delivery: {new Date(order.estimatedDeliveryDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-dark-secondary p-6 rounded-lg border border-white/10">
          <h2 className="text-lg font-semibold text-white mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div 
                key={item._id}
                className="flex items-center justify-between py-4 border-b border-white/10 last:border-0"
              >
                <div>
                  <p className="text-white">Product ID: {item.productId}</p>
                  <p className="text-white/70">Quantity: {item.quantity}</p>
                </div>
                <p className="text-gold-primary">${item.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Addresses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Delivery Address */}
          <div className="bg-dark-secondary p-6 rounded-lg border border-white/10">
            <h2 className="text-lg font-semibold text-white mb-4">
              Delivery Address
            </h2>
            <div className="space-y-2 text-white/70">
              <p>{order.deliveryAddress.recipientName}</p>
              <p>{order.deliveryAddress.street}</p>
              <p>
                {order.deliveryAddress.city}, {order.deliveryAddress.state}
              </p>
              <p>{order.deliveryAddress.country} {order.deliveryAddress.postalCode}</p>
              <p>Phone: {order.deliveryAddress.recipientPhone}</p>
            </div>
          </div>

          {/* Pickup Address */}
          <div className="bg-dark-secondary p-6 rounded-lg border border-white/10">
            <h2 className="text-lg font-semibold text-white mb-4">
              Pickup Address
            </h2>
            <div className="space-y-2 text-white/70">
              <p>{order.pickupAddress.street}</p>
              <p>
                {order.pickupAddress.city}, {order.pickupAddress.state}
              </p>
              <p>{order.pickupAddress.country} {order.pickupAddress.postalCode}</p>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-dark-secondary p-6 rounded-lg border border-white/10">
          <h2 className="text-lg font-semibold text-white mb-4">
            Shipping Details
          </h2>
          <div className="grid grid-cols-2 gap-4 text-white/70">
            <div>
              <p>Package Size: {order.packageSize}</p>
              <p>Fragile: {order.isFragile ? 'Yes' : 'No'}</p>
              <p>Express Delivery: {order.isExpressDelivery ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <p>Special Handling: {order.requiresSpecialHandling ? 'Yes' : 'No'}</p>
              {order.specialInstructions && (
                <p>Instructions: {order.specialInstructions}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
} 