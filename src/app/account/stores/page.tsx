import { Metadata } from "next"
import AccountStoreList from "@/components/account/stores/StoreList"

export const metadata: Metadata = {
  title: "Browse Stores | GoFromA2zAfrica",
  description: "Browse and discover stores on GoFromA2zAfrica",
}

export default function AccountStoresPage() {
  return <AccountStoreList />
} 