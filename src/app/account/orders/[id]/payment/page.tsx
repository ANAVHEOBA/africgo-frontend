import PaymentInstructions from "@/components/account/orders/PaymentInstructions";

export default function OrderPaymentPage({ params }: { params: { id: string } }) {
  return <PaymentInstructions orderId={params.id} />;
} 