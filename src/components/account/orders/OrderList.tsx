"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { getOrders } from "@/lib/orders/api"
import { Order } from "@/lib/orders/types"

export default function OrderList() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders()
        setOrders(data)
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to fetch orders")
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (loading) {
    return <div className="text-white">Loading orders...</div>
  }

  if (error) {
    return <div className="text-red-400">{error}</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-white/70">No orders found</div>
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
              className="block bg-dark-secondary p-6 rounded-lg border border-white/10
                hover:border-gold-primary transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-1">
                  <p className="text-white font-medium">
                    Order #{order.trackingNumber}
                  </p>
                  <p className="text-white/70 text-sm">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm
                    ${order.status === 'DELIVERED' 
                      ? 'bg-green-500/20 text-green-500'
                      : order.status === 'PENDING'
                      ? 'bg-yellow-500/20 text-yellow-500'
                      : 'bg-blue-500/20 text-blue-500'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-white/70">
                <div>
                  <p className="font-medium text-white">Delivery Address</p>
                  <p>{order.deliveryAddress.street}</p>
                  <p>{order.deliveryAddress.city}, {order.deliveryAddress.state}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-white">Total Amount</p>
                  <p className="text-gold-primary">${order.price.toFixed(2)}</p>
                </div>
              </div>
            </Link>
          ))}
        </motion.div>
      )}
    </div>
  )
} 