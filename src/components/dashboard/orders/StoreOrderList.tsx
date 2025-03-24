"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getStoreOrders } from "@/lib/stores/api";
import { StoreOrder } from "@/lib/stores/types";
import Link from "next/link";
import { OrderStatus } from '@/lib/stores/types';
import { getStatusStyle } from '@/lib/utils/orderUtils';

export default function StoreOrderList() {
  const [orders, setOrders] = useState<StoreOrder[]>([]);
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
        const response = await getStoreOrders(currentPage, ordersPerPage);
        setOrders(response.orders);
        setTotalPages(response.pagination.totalPages);
        setTotalOrders(response.pagination.total);
      } catch (error) {
        console.error('Error fetching store orders:', error);
        setError(error instanceof Error ? error.message : "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getStatusBadgeColor = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'READY_FOR_PICKUP':
        return 'bg-green-100 text-green-800';
      case 'PICKED_UP':
        return 'bg-blue-100 text-blue-800';
      case 'IN_TRANSIT':
        return 'bg-purple-100 text-purple-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'FAILED_DELIVERY':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
        <h1 className="text-2xl font-bold text-gray-900">Store Orders</h1>
        <p className="text-gray-600">
          Showing {(currentPage - 1) * ordersPerPage + 1}-
          {Math.min(currentPage * ordersPerPage, totalOrders)} of {totalOrders} orders
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-gray-600 text-center py-8">No orders found</div>
      ) : (
        <>
          <motion.div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order._id}
                href={`/dashboard/orders/${order._id}`}
                className="block"
              >
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">
                        Order #{order.trackingNumber}
                      </h3>
                      <p className="text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(order.status)}`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Delivery Address</h4>
                      <p className="text-sm text-gray-600">
                        {order.deliveryAddress.recipientName}<br />
                        {order.deliveryAddress.street}<br />
                        {order.deliveryAddress.city}, {order.deliveryAddress.state}<br />
                        {order.deliveryAddress.country}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Order Items</h4>
                      {order.items.map((item) => (
                        <div key={item._id} className="text-sm text-gray-600">
                          {item.quantity}x - ₦{item.price.toLocaleString()}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </motion.div>

          {totalPages > 1 && (
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