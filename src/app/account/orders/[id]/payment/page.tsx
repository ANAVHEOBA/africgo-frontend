"use client";

import { use } from "react";
import PaymentInstructions from "@/components/account/orders/PaymentInstructions";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function OrderPaymentPage({ params }: PageProps) {
  const resolvedParams = use(params);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <PaymentInstructions orderId={resolvedParams.id} />
    </div>
  );
} 