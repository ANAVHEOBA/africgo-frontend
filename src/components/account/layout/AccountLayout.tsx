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
    <div className="flex flex-col min-h-screen">
      <AccountHeader />
      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside className="w-64 bg-dark-secondary border-r border-white/10 hidden md:block">
          <AccountNav />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
} 