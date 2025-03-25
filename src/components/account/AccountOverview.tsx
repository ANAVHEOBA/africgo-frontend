"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useEffect, useState } from "react"
import { 
  ConsumerProfile, 
  AnalyticsOverview,
  OrderAnalytics,
  SpendingAnalytics,
  PreferencesAnalytics 
} from "@/lib/consumers/types"
import { 
  getProfile, 
  getAnalyticsOverview,
  getOrderAnalytics,
  getSpendingAnalytics,
  getPreferencesAnalytics 
} from "@/lib/consumers/api"

export default function AccountOverview() {
  const [profile, setProfile] = useState<ConsumerProfile | null>(null)
  const [analytics, setAnalytics] = useState<{
    overview: AnalyticsOverview | null;
    orders: OrderAnalytics | null;
    spending: SpendingAnalytics | null;
    preferences: PreferencesAnalytics | null;
  }>({
    overview: null,
    orders: null,
    spending: null,
    preferences: null
  })

  useEffect(() => {
    async function fetchData() {
      try {
        const [
          profileData,
          overviewData,
          orderData,
          spendingData,
          preferencesData
        ] = await Promise.all([
          getProfile(),
          getAnalyticsOverview(),
          getOrderAnalytics(),
          getSpendingAnalytics(),
          getPreferencesAnalytics()
        ])

        setProfile(profileData)
        setAnalytics({
          overview: overviewData,
          orders: orderData,
          spending: spendingData,
          preferences: preferencesData
        })
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="space-y-8">
      {/* Profile Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
          <Link
            href="/account/profile"
            className="text-gold-primary hover:text-gold-secondary transition-colors"
          >
            Edit Profile →
          </Link>
        </div>
        
        {profile && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
            <div>
              <p className="text-sm">Name</p>
              <p className="text-gray-900">{profile.firstName} {profile.lastName}</p>
            </div>
            <div>
              <p className="text-sm">Email</p>
              <p className="text-gray-900">{profile.email}</p>
            </div>
            <div>
              <p className="text-sm">Phone</p>
              <p className="text-gray-900">{profile.phone || 'Not set'}</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Analytics Overview */}
      {analytics.overview && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders</h3>
            <p className="text-3xl font-bold text-gold-primary">
              {analytics.overview.totalOrders}
            </p>
            <p className="text-sm text-gray-600 mt-2">Total Orders</p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Total Spent</h3>
            <p className="text-3xl font-bold text-gold-primary">
              ₦{analytics.overview.totalSpent.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 mt-2">Lifetime Spending</p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Favorite Store</h3>
            <p className="text-xl font-semibold text-gray-900">
              {analytics.overview.favoriteStore.storeName}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              {analytics.overview.favoriteStore.orderCount} orders
            </p>
          </div>
        </motion.div>
      )}

      {/* Order Status */}
      {analytics.orders && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(analytics.orders.ordersByStatus).map(([status, count]) => (
              <div key={status} className="text-center">
                <p className="text-2xl font-bold text-gold-primary">{count}</p>
                <p className="text-sm text-gray-600">{status}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Delivery Preferences */}
        {analytics.preferences && (
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Preferences</h3>
            <div className="space-y-4">
              {analytics.preferences.deliveryPreferences.commonAddresses.slice(0, 3).map((address, index) => (
                <div key={index} className="flex justify-between items-center">
                  <p className="text-gray-600">{address.address}</p>
                  <span className="text-sm text-gray-500">{address.useCount} times</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Popular Products */}
        {analytics.preferences && (
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Ordered Products</h3>
            <div className="space-y-4">
              {analytics.preferences.productPreferences.slice(0, 3).map((product) => (
                <div key={product.productId} className="flex justify-between items-center">
                  <p className="text-gray-600">{product.productName}</p>
                  <span className="text-sm text-gray-500">{product.orderCount} orders</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
} 