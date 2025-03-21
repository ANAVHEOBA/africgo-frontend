import PaymentInstructions from "@/components/account/orders/PaymentInstructions";

interface Props {
  params: {
    id: string;
  }
}

export default async function OrderPaymentPage({ params }: Props) {
  return <PaymentInstructions orderId={params.id} />;
} 