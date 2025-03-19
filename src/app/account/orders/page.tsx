import { Metadata } from "next"
import OrderList from "@/components/account/orders/OrderList"

export const metadata: Metadata = {
  title: "My Orders | GoFromA2zAfrica",
  description: "View and manage your orders",
}

interface OrdersPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <OrderList />
    </div>
  );
} 