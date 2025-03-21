"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getStoreOrder } from '@/lib/stores/api';
import { StoreOrder } from '@/lib/stores/types';
import { formatDate } from '@/lib/utils';
import OrderActions from './OrderActions';

interface OrderDetailsProps {
  orderId: string;
}

export default function OrderDetails({ orderId }: OrderDetailsProps) {
  const router = useRouter();
  const [order, setOrder] = useState<StoreOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      console.log('Fetching order details for:', orderId);
      
      const data = await getStoreOrder(orderId);
      console.log('Order details received:', data);
      
      if (!data) {
        throw new Error('Order not found');
      }
      
      setOrder(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching order details:', err);
      
      if (err instanceof Error) {
        if (err.message === 'Authentication required') {
          router.push('/login');
          return;
        }
        setError(err.message);
      } else {
        setError('Failed to load order details');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const handleStatusUpdate = () => {
    fetchOrderDetails(); // Refresh the order details
  };

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (!order) {
    return <div className="text-center p-4">Order not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Order Details</h2>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Back to Orders
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
          <div className="space-y-3">
            <div>
              <span className="font-medium">Order ID:</span>
              <span className="ml-2">{order.trackingNumber}</span>
            </div>
            <div>
              <span className="font-medium">Date:</span>
              <span className="ml-2">{formatDate(order.createdAt)}</span>
            </div>
            <div>
              <span className="font-medium">Status:</span>
              <span className="ml-2">{order.status}</span>
            </div>
            <OrderActions 
              orderId={orderId} 
              currentStatus={order.status}
              onStatusUpdate={handleStatusUpdate}
            />
          </div>
        </div>

        {/* Customer Details */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Customer Details</h3>
          <div className="space-y-3">
            <div>
              <span className="font-medium">Name:</span>
              <span className="ml-2">{order.deliveryAddress.recipientName}</span>
            </div>
            <div>
              <span className="font-medium">Email:</span>
              <span className="ml-2">{order.deliveryAddress.recipientEmail}</span>
            </div>
            <div>
              <span className="font-medium">Phone:</span>
              <span className="ml-2">{order.deliveryAddress.recipientPhone}</span>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Delivery Address</h3>
          <div className="space-y-3">
            <div>{order.deliveryAddress.street}</div>
            <div>
              {order.deliveryAddress.city}, {order.deliveryAddress.state}
            </div>
            <div>{order.deliveryAddress.country}</div>
            <div>{order.deliveryAddress.postalCode}</div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Order Items</h3>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item._id} className="border-b pb-4 last:border-0">
                <div className="flex justify-between">
                  <span>Product ID: {item.productId}</span>
                  <span>Qty: {item.quantity}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Price: ${item.price}</span>
                  <span>Total: ${item.price * item.quantity}</span>
                </div>
                {item.variantData.length > 0 && (
                  <div className="mt-2 text-sm">
                    {item.variantData.map((variant) => (
                      <span key={variant._id} className="mr-2">
                        {variant.name}: {variant.value}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 