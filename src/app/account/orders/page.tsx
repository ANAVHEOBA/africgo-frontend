import { Metadata } from "next"
import OrderList from "@/components/account/orders/OrderList"

export const metadata: Metadata = {
  title: "My Orders | GoFromA2zAfrica",
  description: "View and track your orders from GoFromA2zAfrica",
}

export default function OrdersPage() {
  return <OrderList />
} 