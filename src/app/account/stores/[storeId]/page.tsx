import { Metadata } from "next"
import ConsumerStoreProducts from "@/components/account/stores/products/ProductList"

export const metadata: Metadata = {
  title: "Store Products | GoFromA2zAfrica",
  description: "Browse store products and place orders",
}

export default function ConsumerStoreProductsPage({ 
  params 
}: { 
  params: { storeId: string } 
}) {
  return <ConsumerStoreProducts storeId={params.storeId} />
} 