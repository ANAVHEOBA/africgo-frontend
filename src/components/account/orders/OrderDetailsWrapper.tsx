"use client";

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Import the client component with no SSR
const OrderDetailsClient = dynamic(
  () => import('@/components/account/orders/OrderDetailsClient'),
  { 
    ssr: false,
    loading: () => <div className="text-gold-primary text-xl font-bold">Loading order details...</div>
  }
);

interface OrderDetailsWrapperProps {
  orderId: string;
}

export default function OrderDetailsWrapper({ orderId }: OrderDetailsWrapperProps) {
  if (!orderId) {
    return <div className="text-gold-primary text-xl font-bold">No order ID provided</div>;
  }

  return (
    <Suspense fallback={<div className="text-gold-primary text-xl font-bold">Loading order details...</div>}>
      <OrderDetailsClient orderId={orderId} />
    </Suspense>
  );
} 