'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCart } from '@/lib/cart/api';
import { Cart } from '@/lib/cart/types';
import { getDeliveryZones, Zone } from '@/lib/zones/api';
import CheckoutForm from '@/components/account/cart/CheckoutForm';

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check for authentication
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        // Fetch cart data
        const cartData = await getCart();
        if (!cartData || cartData.items.length === 0) {
          router.push('/account/cart');
          return;
        }
        setCart(cartData);

        // Fetch delivery zones
        const zonesData = await getDeliveryZones();
        setZones(zonesData);
      } catch (err) {
        if (err instanceof Error && err.message.includes('Invalid token')) {
          localStorage.removeItem('token');
          router.push('/login');
        } else {
          setError(err instanceof Error ? err.message : 'Failed to load checkout data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading checkout...</div>
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

  if (!cart || !zones.length) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-xl text-gray-600">No items in cart</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
      <CheckoutForm cart={cart} zones={zones} />
    </div>
  );
} 