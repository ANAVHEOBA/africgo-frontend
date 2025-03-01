"use client"

import { usePathname } from "next/navigation";
import ClientLayout from "@/components/layout/ClientLayout";

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  
  // Add account to the exclusion checks
  const isDashboard = pathname?.startsWith('/dashboard');
  const isAuth = pathname?.startsWith('/login') || pathname?.startsWith('/register');
  const isAccount = pathname?.startsWith('/account');

  // Return raw children for dashboard, auth, and account routes
  if (isDashboard || isAuth || isAccount) {
    return children;
  }

  // Use ClientLayout for marketing and stores pages
  return <ClientLayout>{children}</ClientLayout>;
} 