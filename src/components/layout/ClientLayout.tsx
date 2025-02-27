"use client"

import { usePathname } from "next/navigation"
import Header from "@/components/layout/header/Header"
import Footer from "@/components/layout/footer/Footer"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isStoresPage = pathname?.startsWith('/stores')

  return (
    <>
      <Header />
      {children}
      {!isStoresPage && <Footer />}
    </>
  )
} 