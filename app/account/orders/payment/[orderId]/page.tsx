import PaymentInstructions from "@/components/account/orders/payment/PaymentInstructions";

export default function PaymentPage({ params }: { params: { orderId: string } }) {
  return <PaymentInstructions orderId={params.orderId} />;
} 