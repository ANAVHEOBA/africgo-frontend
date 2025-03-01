import { Metadata } from "next"
import AccountLayout from "@/components/account/layout/AccountLayout"

export const metadata: Metadata = {
  title: "Account Dashboard | GoFromA2zAfrica",
  description: "Manage your account, orders, and preferences",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-dark-primary">
      <AccountLayout>{children}</AccountLayout>
    </div>
  )
} 