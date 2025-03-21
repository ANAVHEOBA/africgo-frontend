"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getOrders } from '@/lib/orders/api';
import { Order } from '@/lib/orders/types';
import { formatDate } from '@/lib/utils';
import { tokenStorage } from '@/lib/auth/tokenStorage';

export default function OrderList() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = tokenStorage.getToken();
    const userType = tokenStorage.getUserType();
    
    console.log('OrderList mounted:', { hasToken: !!token, userType });
    
    if (!token || userType !== 'consumer') {
      console.log('Invalid consumer access:', { token: !!token, userType });
      router.replace('/login');
      return;
    }

    fetchOrders();
  }, [router]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      console.log('Fetching orders...');
      
      const data = await getOrders();
      console.log('Orders received:', data);
      
      // data should now be the array of orders directly
      setOrders(data || []);
      setError(null);
      
    } catch (err) {
      console.error('Error in fetchOrders:', err);
      
      if (err instanceof Error) {
        if (err.message === 'Authentication required') {
          console.log('Authentication required, clearing token');
          tokenStorage.clearToken();
          router.replace('/login');
          return;
        }
        setError(err.message);
      } else {
        setError('Failed to load orders');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount: number | undefined): string => {
    if (typeof amount === 'undefined' || amount === null) {
      return '0';
    }
    return amount.toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-lg">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold mb-4">No Orders Yet</h2>
        <p className="text-gray-600 mb-6">Start shopping to create your first order!</p>
        <Link 
          href="/stores" 
          className="inline-block px-6 py-2 bg-gold-primary text-white rounded-lg hover:bg-gold-secondary transition-colors"
        >
          Browse Stores
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      <h2 className="text-2xl font-bold mb-6">Your Orders</h2>
      <div className="grid gap-4">
        {orders.map((order) => (
          <Link
            key={order._id}
            href={`/account/orders/${order._id}`}
            className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="text-lg font-semibold mb-2">
                  Order #{order.trackingNumber || 'N/A'}
                </div>
                <div className="text-sm text-gray-500">
                  Placed on {order.createdAt ? formatDate(order.createdAt) : 'N/A'}
                </div>
                <div className="mt-2">
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status || 'UNKNOWN'}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">
                  ₦{formatAmount(order.totalAmount)}
                </div>
                <div className="text-sm text-gray-500">
                  {order.items?.length || 0} items
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
