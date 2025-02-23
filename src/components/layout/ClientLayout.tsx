"use client"

import Header from "@/components/layout/header/Header"
import Footer from "@/components/layout/footer/Footer"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
} 