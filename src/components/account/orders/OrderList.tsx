"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { formatDate } from "@/lib/utils"

interface Order {
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
  }>
}

export default function OrderList() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/consumers/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch orders")
        }

        const data = await response.json()
        setOrders(data.orders)
      } catch (err) {
        setError("Failed to load orders. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (loading) {
    return <div className="text-text-secondary">Loading orders...</div>
  }

  if (error) {
    return <div className="text-red-400">{error}</div>
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-white mb-4">No Orders Yet</h2>
        <p className="text-text-secondary mb-6">
          Start shopping to see your orders here
        </p>
        <Link
          href="/stores"
          className="inline-block px-6 py-3 bg-gold-primary text-dark-primary rounded-lg
            hover:bg-gold-secondary transition-colors"
        >
          Browse Stores
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-white">My Orders</h1>
      
      <div className="space-y-4">
        {orders.map((order) => (
          <motion.div
            key={order._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-dark-secondary p-6 rounded-lg border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-white">
                  Order #{order.orderNumber}
                </h3>
                <p className="text-text-secondary">
                  {formatDate(new Date(order.createdAt))}
                </p>
              </div>
              <div className="text-right">
                <p className="text-white font-medium">
                  ${order.total.toFixed(2)}
                </p>
                <p className={`text-sm capitalize
                  ${order.status === "delivered" ? "text-green-400" :
                    order.status === "cancelled" ? "text-red-400" :
                    "text-gold-primary"}`}
                >
                  {order.status}
                </p>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4">
              <p className="text-text-secondary mb-4">
                {order.items.length} {order.items.length === 1 ? "item" : "items"}
              </p>
              <Link
                href={`/account/orders/${order._id}`}
                className="text-gold-primary hover:text-gold-secondary transition-colors"
              >
                View Order Details →
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
} 