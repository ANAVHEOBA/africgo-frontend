import OrderDetails from '@/components/dashboard/orders/OrderDetails';

interface Props {
  params: {
    orderId: string;
  };
}

export default function OrderDetailsPage({ params }: Props) {
  return (
    <div className="p-6">
      <OrderDetails orderId={params.orderId} />
    </div>
  );
} 