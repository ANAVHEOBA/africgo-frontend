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

  if (loading) return <div className="text-gold-primary text-xl font-bold">Loading order details...</div>;
  if (error) return <div className="text-red-500 text-xl font-bold">Error: {error}</div>;
  if (!order) return <div className="text-gold-primary text-xl font-bold">Order not found</div>;

  return (
    <div className="bg-gray-900 rounded-lg p-8 shadow-xl border-2 border-gray-700">
      <h2 className="text-4xl font-bold text-gold-primary mb-6">Order #{order.trackingNumber}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-6 rounded-lg border-2 border-gray-700">
          <h3 className="text-2xl font-bold text-gold-primary mb-4">Order Information</h3>
          <div className="space-y-4 text-xl">
            <p className="flex justify-between items-center">
              <span className="font-bold text-white">Status:</span>
              <span className="text-gold-primary font-semibold">{order.status}</span>
            </p>
            <p className="flex justify-between items-center">
              <span className="font-bold text-white">Date:</span>
              <span className="text-gold-primary font-semibold">{new Date(order.createdAt).toLocaleDateString()}</span>
            </p>
            <p className="flex justify-between items-center">
              <span className="font-bold text-white">Total:</span>
              <span className="text-gold-primary font-semibold">₦{order.price.toLocaleString()}</span>
            </p>
            <p className="flex justify-between items-center">
              <span className="font-bold text-white">Estimated Delivery:</span>
              <span className="text-gold-primary font-semibold">{new Date(order.estimatedDeliveryDate).toLocaleDateString()}</span>
            </p>
          </div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg border-2 border-gray-700">
          <h3 className="text-2xl font-bold text-gold-primary mb-4">Delivery Details</h3>
          <div className="space-y-4 text-xl">
            <p className="flex justify-between items-center">
              <span className="font-bold text-white">Recipient:</span>
              <span className="text-gold-primary font-semibold">{order.deliveryAddress.recipientName}</span>
            </p>
            <p className="flex justify-between items-center">
              <span className="font-bold text-white">Address:</span>
              <span className="text-gold-primary font-semibold">{order.deliveryAddress.street}, {order.deliveryAddress.city}</span>
            </p>
            <p className="flex justify-between items-center">
              <span className="font-bold text-white">Phone:</span>
              <span className="text-gold-primary font-semibold">{order.deliveryAddress.recipientPhone}</span>
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="text-2xl font-bold text-gold-primary mb-4">Items</h3>
        <div className="bg-gray-800 rounded-lg p-6 border-2 border-gray-700">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between items-center py-4 border-b-2 border-gray-700 last:border-0">
              <div className="text-xl">
                <p className="font-bold text-white">Product ID: <span className="text-gold-primary">{item.productId}</span></p>
                <p className="mt-2 font-bold text-white">Quantity: <span className="text-gold-primary">{item.quantity}</span></p>
              </div>
              <div className="text-2xl font-bold text-gold-primary">
                ₦{item.price.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {order.specialInstructions && (
        <div className="mt-8">
          <h3 className="text-2xl font-bold text-gold-primary mb-4">Special Instructions</h3>
          <div className="bg-gray-800 rounded-lg p-6 border-2 border-gray-700">
            <p className="text-xl text-white">{order.specialInstructions}</p>
          </div>
        </div>
      )}
    </div>
  );
}