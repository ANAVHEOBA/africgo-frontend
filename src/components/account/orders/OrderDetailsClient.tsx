"use client";

import { useState, useEffect } from 'react';
import { getOrderById } from '@/lib/orders/api';
import { Order } from '@/lib/orders/types';

interface OrderDetailsClientProps {
  orderId: string;
}

export default function OrderDetailsClient({ orderId }: OrderDetailsClientProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) {
        setError("Order ID is missing");
        setLoading(false);
        return;
      }
      
      try {
        console.log("Fetching order with ID:", orderId);
        const orderData = await getOrderById(orderId);
        setOrder(orderData);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError(err instanceof Error ? err.message : 'Failed to load order');
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId]);

  if (loading) return <div className="text-white">Loading order details...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!order) return <div className="text-white">Order not found</div>;

  return (
    <div className="bg-dark-secondary rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4">Order #{order.trackingNumber}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-gold-primary font-medium mb-2">Order Information</h3>
          <div className="space-y-2 text-white">
            <p><span className="text-gray-400">Status:</span> {order.status}</p>
            <p><span className="text-gray-400">Date:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
            <p><span className="text-gray-400">Total:</span> ₦{order.price.toLocaleString()}</p>
            <p><span className="text-gray-400">Estimated Delivery:</span> {new Date(order.estimatedDeliveryDate).toLocaleDateString()}</p>
          </div>
        </div>
        
        <div>
          <h3 className="text-gold-primary font-medium mb-2">Delivery Details</h3>
          <div className="space-y-2 text-white">
            <p><span className="text-gray-400">Recipient:</span> {order.deliveryAddress.recipientName}</p>
            <p><span className="text-gray-400">Address:</span> {order.deliveryAddress.street}, {order.deliveryAddress.city}</p>
            <p><span className="text-gray-400">Phone:</span> {order.deliveryAddress.recipientPhone}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="text-gold-primary font-medium mb-2">Items</h3>
        <div className="bg-dark-primary rounded-lg p-4">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between py-2 border-b border-gray-700 last:border-0">
              <div className="text-white">
                <p>Product ID: {item.productId}</p>
                <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
              </div>
              <div className="text-white">
                {item.price ? `₦${item.price.toLocaleString()}` : 'Price not available'}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {order.specialInstructions && (
        <div className="mt-6">
          <h3 className="text-gold-primary font-medium mb-2">Special Instructions</h3>
          <p className="text-white bg-dark-primary rounded-lg p-4">{order.specialInstructions}</p>
        </div>
      )}
    </div>
  );
}