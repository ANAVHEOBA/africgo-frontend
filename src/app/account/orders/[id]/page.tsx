import { Metadata } from "next"
import OrderDetailsWrapper from "@/components/account/orders/OrderDetailsWrapper"

export const metadata: Metadata = {
  title: "Order Details | GoFromA2zAfrica",
  description: "View your order details",
}

export default async function OrderDetailsPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-white mb-6">Order Details</h1>
      <OrderDetailsWrapper orderId={params.id} />
    </div>
  )
} 