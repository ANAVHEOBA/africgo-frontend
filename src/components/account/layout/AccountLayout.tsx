"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import AccountNav from "./AccountNav"
import AccountHeader from "./AccountHeader"

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  // Check if user is logged in and is a consumer
  useEffect(() => {
    const token = localStorage.getItem("token")
    const userType = localStorage.getItem("userType")

    if (!token || userType !== "consumer") {
      router.replace("/login")
    }
  }, [router])

  return (
    <div className="min-h-screen bg-dark-primary">
      <AccountHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <aside className="md:col-span-1">
            <AccountNav />
          </aside>
          <main className="md:col-span-3">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
} 