"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getStoreOrderById, markOrderAsReady } from "@/lib/stores/api";
import { StoreOrder } from "@/lib/stores/types";
import { getStatusStyle } from '@/lib/utils/orderUtils';
import { toast } from "react-hot-toast";

interface StoreOrderDetailsProps {
  orderId: string;
}

export default function StoreOrderDetails({ orderId }: StoreOrderDetailsProps) {
  const [order, setOrder] = useState<StoreOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMarkingReady, setIsMarkingReady] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const data = await getStoreOrderById(orderId);
        setOrder(data);
      } catch (error) {
        console.error('Error fetching order details:', error);
        setError(error instanceof Error ? error.message : "Failed to fetch order details");
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchOrderDetails();

    // Poll for updates every 30 seconds
    const intervalId = setInterval(fetchOrderDetails, 30000);

    return () => clearInterval(intervalId);
  }, [orderId]);

  const handleMarkAsReady = async () => {
    try {
      setIsMarkingReady(true);
      const updatedOrder = await markOrderAsReady(orderId);
      setOrder(updatedOrder);
      toast.success('Order marked as ready for pickup');
    } catch (error) {
      console.error('Error marking order as ready:', error);
      setError(error instanceof Error ? error.message : "Failed to mark order as ready");
      toast.error('Failed to mark order as ready');
    } finally {
      setIsMarkingReady(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading order details...</div>
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

  if (!order) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-xl text-gray-600">Order not found</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Order #{order.trackingNumber}
          </h1>
          <p className="text-gray-500">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusStyle(order.status)}`}>
            {order.status.replace(/_/g, ' ')}
          </span>
          {order.status === 'CONFIRMED' && (
            <button
              onClick={handleMarkAsReady}
              disabled={isMarkingReady}
              className={`px-4 py-2 rounded-lg text-sm font-medium text-white
                ${isMarkingReady 
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gold-primary hover:bg-gold-dark'
                }`}
            >
              {isMarkingReady ? 'Marking as Ready...' : 'Mark as Ready'}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Order Items</h2>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item._id} className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    {item.productImage?.[0] && (
                      <img 
                        src={item.productImage[0]} 
                        alt={item.productName}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    )}
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      {item.variantData && item.variantData.map(variant => (
                        <p key={variant._id} className="text-sm text-gray-600">
                          {variant.name}: {variant.value}
                        </p>
                      ))}
                    </div>
                  </div>
                  <p className="font-medium">₦{item.price.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Package Details</h2>
            <div className="space-y-2">
              <p className="text-gray-600">Size: {order.packageSize}</p>
              <p className="text-gray-600">Fragile: {order.isFragile ? 'Yes' : 'No'}</p>
              {order.specialInstructions && (
                <div>
                  <p className="font-medium">Special Instructions:</p>
                  <p className="text-gray-600">{order.specialInstructions}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Pickup Address</h2>
            <div className="text-gray-600">
              <p>{order.pickupAddress.manualAddress.recipientName}</p>
              <p>{order.pickupAddress.manualAddress.street}</p>
              <p>{order.pickupAddress.manualAddress.city}, {order.pickupAddress.manualAddress.state}</p>
              <p>{order.pickupAddress.manualAddress.country}, {order.pickupAddress.manualAddress.postalCode}</p>
              <p>Phone: {order.pickupAddress.manualAddress.recipientPhone}</p>
              <p>Email: {order.pickupAddress.manualAddress.recipientEmail}</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Delivery Address</h2>
            <div className="text-gray-600">
              <p>{order.deliveryAddress.recipientName}</p>
              <p>{order.deliveryAddress.street}</p>
              <p>{order.deliveryAddress.city}, {order.deliveryAddress.state}</p>
              <p>{order.deliveryAddress.country}, {order.deliveryAddress.postalCode}</p>
              <p>Phone: {order.deliveryAddress.recipientPhone}</p>
              <p>Email: {order.deliveryAddress.recipientEmail}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 