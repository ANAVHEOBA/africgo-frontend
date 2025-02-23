"use client"

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Sidebar from '@/components/dashboard/layout/Sidebar'
import TopNav from '@/components/dashboard/layout/TopNav'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log("=== Dashboard Layout Debug ===")
    console.log("Current pathname:", pathname)
    const token = localStorage.getItem('token')
    console.log("Token exists:", !!token)
    
    if (!token) {
      console.log("No token - redirecting to login")
      router.replace('/login')
      return
    }
    setIsLoading(false)
  }, [router, pathname])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <TopNav />
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  )
} 