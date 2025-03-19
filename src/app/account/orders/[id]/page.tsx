import { Metadata } from "next"
import OrderDetailsWrapper from "@/components/account/orders/OrderDetailsWrapper"

interface OrderDetailsPageProps {
  params: {
    id: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function OrderDetailsPage({
  params,
  searchParams,
}: OrderDetailsPageProps) {
  // Ensure params.id is available before rendering
  if (!params?.id) {
    return <div className="text-gold-primary text-xl">Invalid order ID</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-4xl font-bold text-gold-primary mb-6">Order Details</h1>
      <OrderDetailsWrapper orderId={params.id.toString()} />
    </div>
  );
}

// Generate metadata dynamically
export async function generateMetadata({ params }: OrderDetailsPageProps): Promise<Metadata> {
  return {
    title: `Order ${params.id} Details | GoFromA2zAfrica`,
    description: `View details for order ${params.id}`,
  };
} 