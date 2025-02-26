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
  const isAuth = pathname?.startsWith('/login') || pathname?.startsWith('/register');

  // Return raw children for dashboard and auth routes
  if (isDashboard || isAuth) {
    return children;
  }

  // Use ClientLayout for marketing and stores pages
  return <ClientLayout>{children}</ClientLayout>;
} 