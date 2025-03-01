import { Metadata } from "next"
import OrderDetails from "@/components/account/orders/OrderDetails"

export const metadata: Metadata = {
  title: "Order Details | GoFromA2zAfrica",
  description: "View order details",
}

export default function OrderDetailsPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  return <OrderDetails orderId={params.id} />
} 