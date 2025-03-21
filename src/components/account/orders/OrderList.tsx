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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const ordersPerPage = 10;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await getOrders(currentPage, ordersPerPage);
        
        // Calculate total pages if not provided
        const calculatedTotalPages = Math.ceil(response.data.total / ordersPerPage);
        
        setOrders(response.data.orders);
        setTotalPages(calculatedTotalPages);
        setTotalOrders(response.data.total);
        
        console.log('Pagination info:', {
          currentPage,
          totalPages: calculatedTotalPages,
          totalOrders: response.data.total,
          ordersPerPage,
          ordersReceived: response.data.orders.length
        });
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch orders"
        );
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentPage]); // Re-fetch when page changes

  const handlePageChange = (newPage: number) => {
    console.log('Changing to page:', newPage);
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading orders...</div>
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
        <p className="text-gray-600">
          Showing {(currentPage - 1) * ordersPerPage + 1}-
          {Math.min(currentPage * ordersPerPage, totalOrders)} of {totalOrders} orders
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-gray-600 text-center py-8">No orders found</div>
      ) : (
        <>
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

          {/* Pagination */}
          {totalOrders > ordersPerPage && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg text-sm font-medium
                  ${currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium
                    ${currentPage === page
                      ? 'bg-gold-primary text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg text-sm font-medium
                  ${currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
