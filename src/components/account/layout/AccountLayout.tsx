"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import AccountNav from "./AccountNav"
import AccountHeader from "./AccountHeader"
import { tokenStorage } from '@/lib/auth/tokenStorage'

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  // Check if user is logged in and is a consumer
  useEffect(() => {
    const token = tokenStorage.getToken()
    const userType = tokenStorage.getUserType()

    if (!token || userType !== "consumer") {
      console.log('Invalid consumer access:', { token: !!token, userType })
      router.replace("/login")
      return
    }
  }, [router])

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <AccountHeader />
      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
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