import StoreOrderDetails from "@/components/dashboard/orders/StoreOrderDetails";

interface OrderDetailsPageProps {
  params: {
    orderId: string;
  };
}

export default function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <StoreOrderDetails orderId={params.orderId} />
    </div>
  );
} 