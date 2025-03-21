import PaymentInstructions from "@/components/account/orders/PaymentInstructions";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function OrderPaymentPage({ params }: PageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <PaymentInstructions orderId={params.id} />
    </div>
  );
} 