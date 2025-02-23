"use client"

import { usePathname } from "next/navigation";
import ClientLayout from "@/components/layout/ClientLayout";

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');

  return isDashboard ? children : <ClientLayout>{children}</ClientLayout>;
} 