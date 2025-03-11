"use client";

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Import the client component with no SSR
const OrderDetailsClient = dynamic(
  () => import('@/components/account/orders/OrderDetailsClient'),
  { ssr: false }
);

interface OrderDetailsWrapperProps {
  orderId: string;
}

export default function OrderDetailsWrapper({ orderId }: OrderDetailsWrapperProps) {
  return (
    <Suspense fallback={<div className="text-white">Loading order details...</div>}>
      <OrderDetailsClient orderId={orderId} />
    </Suspense>
  );
} 