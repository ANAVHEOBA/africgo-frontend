"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getStoreDashboard } from "@/lib/stores/api";
import { StoreDashboardData } from "@/lib/stores/types";
import { getStatusStyle } from "@/lib/utils/orderUtils";
import Link from "next/link";

export default function DashboardStats() {
  const [dashboardData, setDashboardData] = useState<StoreDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const data = await getStoreDashboard();
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard:', error);
        setError(error instanceof Error ? error.message : "Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
    const intervalId = setInterval(fetchDashboard, 5 * 60 * 1000); // Refresh every 5 minutes
    
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  if (!dashboardData) return null;

  return (
    <div className="space-y-8">
      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-4">Today's Revenue</h3>
          <p className="text-3xl font-bold">₦{dashboardData.stats.revenue.today.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-2">
            Yesterday: ₦{dashboardData.stats.revenue.yesterday.toLocaleString()}
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-lg shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-4">This Month</h3>
          <p className="text-3xl font-bold">₦{dashboardData.stats.revenue.thisMonth.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-2">
            Daily Average: ₦{dashboardData.stats.revenue.dailyAverage.toLocaleString()}
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-4">Total Revenue</h3>
          <p className="text-3xl font-bold">₦{dashboardData.stats.revenue.total.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-2">
            Total Orders: {dashboardData.stats.orders}
          </p>
        </motion.div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold mb-6">Recent Orders</h3>
        <div className="space-y-4">
          {dashboardData.recentOrders.map((order) => (
            <Link 
              href={`/dashboard/orders/${order._id}`}
              key={order._id}
              className="block hover:bg-gray-50 p-4 rounded-lg transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Order #{order.trackingNumber}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(order.status)}`}>
                  {order.status.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                {order.items.map((item) => (
                  <div key={item._id}>
                    {item.quantity}x - ₦{item.price.toLocaleString()}
                  </div>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Top Products */}
      {dashboardData.topProducts.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-6">Top Products</h3>
          <div className="space-y-4">
            {dashboardData.topProducts.map((product) => (
              <div key={product._id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-600">Sold: {product.totalSold}</p>
                </div>
                <p className="font-medium">₦{(product.revenue || 0).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 