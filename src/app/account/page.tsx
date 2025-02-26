import { Metadata } from "next"
import AccountOverview from "@/components/account/AccountOverview"

export const metadata: Metadata = {
  title: "Account Overview | GoFromA2zAfrica",
  description: "Manage your GoFromA2zAfrica account, orders, and preferences",
}

export default function AccountPage() {
  return <AccountOverview />
} 