"use client"

import { usePathname } from "next/navigation"
import ClientLayout from "@/components/layout/ClientLayout"
import Footer from "@/components/layout/footer/Footer"

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isStoresPage = pathname?.startsWith('/stores')

  return (
    <div className="bg-white">
      <ClientLayout>{children}</ClientLayout>
      {isStoresPage && <Footer />}
    </div>
  )
} 