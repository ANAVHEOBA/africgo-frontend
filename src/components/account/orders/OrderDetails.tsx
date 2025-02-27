"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { formatDate } from "@/lib/utils"

interface OrderDetails {
  _id: string
  orderNumber: string
  createdAt: string
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  items: Array<{
    productId: string
    name: string
    quantity: number
    price: number
    image?: string
  }>
  shippingAddress: {
    firstName: string
    lastName: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  trackingNumber?: string
}

export default function OrderDetails({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/consumers/orders/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!response.ok) {
          throw new Error("Failed to fetch order details")
        }

        const data = await response.json()
        setOrder(data.order)
      } catch (err) {
        setError("Failed to load order details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [orderId])

  if (loading) {
    return <div className="text-text-secondary">Loading order details...</div>
  }

  if (error || !order) {
    return <div className="text-red-400">{error}</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">
          Order #{order.orderNumber}
        </h1>
        <Link
          href="/account/orders"
          className="text-text-secondary hover:text-white transition-colors"
        >
          ← Back to Orders
        </Link>
      </div>

      {/* Order Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-dark-secondary p-6 rounded-lg border border-white/10"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-text-secondary">Order Date</p>
            <p className="text-white">
              {formatDate(new Date(order.createdAt))}
            </p>
          </div>
          <div className="text-right">
            <p className="text-text-secondary">Status</p>
            <p className={`font-medium capitalize
              ${order.status === "delivered" ? "text-green-400" :
                order.status === "cancelled" ? "text-red-400" :
                "text-gold-primary"}`}
            >
              {order.status}
            </p>
          </div>
        </div>

        {order.trackingNumber && (
          <div className="border-t border-white/10 pt-4 mt-4">
            <p className="text-text-secondary">Tracking Number</p>
            <p className="text-white font-medium">{order.trackingNumber}</p>
          </div>
        )}
      </motion.div>

      {/* Order Items */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-dark-secondary p-6 rounded-lg border border-white/10"
      >
        <h2 className="text-lg font-semibold text-white mb-4">Order Items</h2>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div
              key={item.productId}
              className="flex items-center space-x-4 py-4 border-b border-white/10 last:border-0"
            >
              {item.image && (
                <div className="w-16 h-16 relative rounded-lg overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-white font-medium">{item.name}</h3>
                <p className="text-text-secondary">
                  Quantity: {item.quantity}
                </p>
              </div>
              <p className="text-white font-medium">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 mt-6 pt-4">
          <div className="flex justify-between">
            <p className="text-white font-medium">Total</p>
            <p className="text-white font-medium">
              ${order.total.toFixed(2)}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Shipping Address */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-dark-secondary p-6 rounded-lg border border-white/10"
      >
        <h2 className="text-lg font-semibold text-white mb-4">
          Shipping Address
        </h2>
        <p className="text-white">
          {order.shippingAddress.firstName} {order.shippingAddress.lastName}
        </p>
        <p className="text-text-secondary">
          {order.shippingAddress.address}
        </p>
        <p className="text-text-secondary">
          {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
        </p>
        <p className="text-text-secondary">
          {order.shippingAddress.country}
        </p>
      </motion.div>
    </div>
  )
} 